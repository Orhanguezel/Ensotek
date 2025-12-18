// =============================================================
// FILE: src/seo/serverMetadata.ts
// Ensotek – Server Metadata Builder (DB-driven locales/default)
//   - Active locales: site_settings.app_locales
//   - Default locale: getDefaultLocale() => activeLocales[0] (DB) or "tr"
//   - Canonical + hreflang: DEFAULT_LOCALE_PREFIXLESS uygulanır
// =============================================================
import "server-only";

import type { Metadata } from "next";
import {
  fetchSetting,
  fetchActiveLocales,
  getDefaultLocale,
  type JsonLike,
  DEFAULT_LOCALE_FALLBACK,
} from "@/i18n/server";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

/**
 * Default locale prefix kuralı:
 * - true  => default locale URL’leri prefix’siz: "/" , "/blog"
 * - false => default locale de prefix’li: "/tr", "/tr/blog"
 */
const DEFAULT_LOCALE_PREFIXLESS = true;

function normLocale(l: any): string {
  const v = String(l || "").trim().toLowerCase().replace("_", "-");
  return v.split("-")[0] || DEFAULT_LOCALE_FALLBACK;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function asStr(x: any): string | null {
  return typeof x === "string" && x.trim() ? x.trim() : null;
}
function asBool(x: any): boolean | null {
  return typeof x === "boolean" ? x : null;
}
function asObj(x: any): Record<string, any> | null {
  return x && typeof x === "object" && !Array.isArray(x) ? (x as Record<string, any>) : null;
}
function asStrArr(x: any): string[] {
  if (!x) return [];
  if (Array.isArray(x)) return x.map((v) => String(v)).map((s) => s.trim()).filter(Boolean);
  const s = asStr(x);
  return s ? [s] : [];
}

/**
 * OpenGraph locale formatına çevir:
 * - "pt-br" -> "pt_BR"
 * - "tr"    -> "tr_TR"
 * - "fr"    -> "fr_FR"
 * - "en"    -> "en_US" (varsayılan)
 */
function toOgLocale(l: string): string {
  const raw = String(l || "").trim();
  if (!raw) return "en_US";

  const normalized = raw.replace("_", "-").toLowerCase();
  const [langRaw, regionRaw] = normalized.split("-");

  const lang = (langRaw || "en").toLowerCase();
  const region = (regionRaw || "").toUpperCase();

  if (lang === "en" && !region) return "en_US";
  if (lang === "tr" && !region) return "tr_TR";
  if (lang === "de" && !region) return "de_DE";

  return `${lang}_${region || lang.toUpperCase()}`;
}

/** base + path birleşimi; mutlak URL garanti */
function absUrl(pathOrUrl: string): string {
  const v = String(pathOrUrl || "").trim();
  if (!v) return BASE_URL;
  if (/^https?:\/\//i.test(v)) return v;
  const p = v.startsWith("/") ? v : `/${v}`;
  return `${BASE_URL}${p}`;
}

/** Path normalizasyonu: başında / olsun; kök dışı ise sonda / olmasın */
function normPath(pathname?: string): string {
  let p = (pathname ?? "/").trim();
  if (!p.startsWith("/")) p = `/${p}`;
  if (p !== "/" && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

/**
 * "/{locale}/..." path üretimi
 * - defaultPrefixless=true ise defaultLocale için "/blog" üretilir ("/tr/blog" değil).
 */
function localizedPath(locale: string, pathname: string, defaultLocale: string): string {
  const loc = normLocale(locale);
  const def = normLocale(defaultLocale);
  const p = normPath(pathname);

  if (DEFAULT_LOCALE_PREFIXLESS && loc === def) return p; // "/" veya "/blog"
  if (p === "/") return `/${loc}`;
  return `/${loc}${p}`;
}

async function fetchSeoRowWithFallback(locale: string) {
  const loc = normLocale(locale);

  // Öncelik: "seo" -> "site_seo"
  const tryKeys = ["seo", "site_seo"] as const;

  // ✅ Default locale artık DB’den geliyor
  const defaultLocale = await getDefaultLocale();
  const tryLocales = uniq([loc, normLocale(defaultLocale), "en"].filter(Boolean));

  for (const l of tryLocales) {
    for (const k of tryKeys) {
      const row = await fetchSetting(k, l, { revalidate: 600 });
      if (row?.value != null) return row;
    }
  }
  return null;
}

/**
 * SEO value örneği (site_settings key: site_seo):
 * {
 *  title_default, title_template, description, site_name,
 *  open_graph: { type, image, images? },
 *  twitter: { card, site?, creator? },
 *  robots: { index, follow, noindex? }
 * }
 */
export async function fetchSeoObject(locale: string): Promise<Record<string, any>> {
  const row = await fetchSeoRowWithFallback(locale);
  const v = row?.value as JsonLike;
  const obj = asObj(v);
  return obj ?? {};
}

type BuildMetadataArgs = {
  locale: string;
  /** canonical/alternates üretmek için sayfanın locale-prefixsiz path’i. örn: "/" veya "/blog" */
  pathname?: string;
  /** aktif diller (app_locales). verilmezse server’dan çekmeye çalışır. */
  activeLocales?: string[];
};

async function resolveActiveLocales(provided?: string[]) {
  const list =
    provided && provided.length ? provided : await fetchActiveLocales();

  const normalized = uniq(list.map(normLocale)).filter(Boolean);

  // güvenlik: en az 1 dil olsun
  if (!normalized.length) normalized.push(DEFAULT_LOCALE_FALLBACK);

  return normalized;
}

export async function buildMetadataFromSeo(
  seo: Record<string, any>,
  args: BuildMetadataArgs,
): Promise<Metadata> {
  const active = await resolveActiveLocales(args.activeLocales);

  // ✅ Default locale artık DB: activeLocales[0] (server.ts getDefaultLocale)
  const defaultLocale = await getDefaultLocale();

  // locale: aktif değilse detected gibi davranmasın; yine de normalize edelim
  const locale = normLocale(args.locale);

  // --- core fields (tamamı site_settings’ten; yoksa güvenli fallback) ---
  const titleDefault = asStr(seo.title_default) || "Ensotek";
  const titleTemplate = asStr(seo.title_template) || "%s | Ensotek";
  const description = asStr(seo.description) || "";
  const siteName = asStr(seo.site_name) || "Ensotek";

  // --- Open Graph ---
  const og = asObj(seo.open_graph) || {};
  const ogType = (asStr(og.type) || "website") as any;

  const ogImages = uniq([...asStrArr(og.image), ...asStrArr(og.images)])
    .map(absUrl)
    .filter(Boolean);

  // --- Twitter ---
  const tw = asObj(seo.twitter) || {};
  const twitterCard = (asStr(tw.card) || "summary_large_image") as any;
  const twitterSite = asStr(tw.site);
  const twitterCreator = asStr(tw.creator);

  // --- Robots ---
  const rb = asObj(seo.robots) || {};
  const robotsNoindex = asBool(rb.noindex) ?? false;
  const robotsIndex = asBool(rb.index) ?? true;
  const robotsFollow = asBool(rb.follow) ?? true;

  // Canonical + hreflang
  const pathname = normPath(args.pathname);
  const canonical = absUrl(localizedPath(locale, pathname, defaultLocale));

  const languages: Record<string, string> = {};
  for (const l of active) {
    languages[l] = absUrl(localizedPath(l, pathname, defaultLocale));
  }
  languages["x-default"] = absUrl(localizedPath(defaultLocale, pathname, defaultLocale));

  const ogLocale = toOgLocale(locale);
  const ogAltLocales = active
    .filter((l) => normLocale(l) !== normLocale(locale))
    .map((l) => toOgLocale(l));

  const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),

    title: { default: titleDefault, template: titleTemplate },
    ...(description ? { description } : {}),

    alternates: {
      canonical,
      languages,
    },

    openGraph: {
      type: ogType,
      siteName,
      locale: ogLocale,
      ...(ogAltLocales.length ? { alternateLocale: ogAltLocales } : {}),
      ...(ogImages.length ? { images: ogImages.map((url) => ({ url })) } : {}),
      ...(description ? { description } : {}),
      url: canonical,
      title: titleDefault,
    },

    twitter: {
      card: twitterCard,
      ...(twitterSite ? { site: twitterSite } : {}),
      ...(twitterCreator ? { creator: twitterCreator } : {}),
      ...(ogImages[0] ? { images: [ogImages[0]] } : {}),
    },

    robots: robotsNoindex ? { index: false, follow: false } : { index: robotsIndex, follow: robotsFollow },
  };

  return metadata;
}
