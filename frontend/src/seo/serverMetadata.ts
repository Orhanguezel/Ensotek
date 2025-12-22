// =============================================================
// FILE: src/seo/serverMetadata.ts
// Ensotek – Server Metadata Builder (DB-driven locales/default)
//   - Active locales: site_settings.app_locales
//   - Default locale: getDefaultLocale() (DB)
//   - Canonical + hreflang: DEFAULT_LOCALE_PREFIXLESS uygulanır
// =============================================================
import 'server-only';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import {
  fetchSetting,
  fetchActiveLocales,
  getDefaultLocale,
  type JsonLike,
  DEFAULT_LOCALE_FALLBACK,
} from '@/i18n/server';

/**
 * Default locale prefix kuralı:
 * - true  => default locale URL’leri prefix’siz: "/" , "/blog"
 * - false => default locale de prefix’li: "/tr", "/tr/blog"
 */
const DEFAULT_LOCALE_PREFIXLESS = true;

function normLocale(l: any): string {
  const v = String(l || '')
    .trim()
    .toLowerCase()
    .replace('_', '-');
  return v.split('-')[0] || DEFAULT_LOCALE_FALLBACK;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function asStr(x: any): string | null {
  return typeof x === 'string' && x.trim() ? x.trim() : null;
}
function asBool(x: any): boolean | null {
  return typeof x === 'boolean' ? x : null;
}
function asObj(x: any): Record<string, any> | null {
  return x && typeof x === 'object' && !Array.isArray(x) ? (x as Record<string, any>) : null;
}
function asStrArr(x: any): string[] {
  if (!x) return [];
  if (Array.isArray(x))
    return x
      .map((v) => String(v))
      .map((s) => s.trim())
      .filter(Boolean);
  const s = asStr(x);
  return s ? [s] : [];
}

/**
 * ✅ Server runtime base URL (proxy-safe).
 * Öncelik:
 *  1) NEXT_PUBLIC_SITE_URL (varsa sabit olarak kullan)
 *  2) x-forwarded-proto + x-forwarded-host
 *  3) host + https (fallback)
 */
async function getRuntimeBaseUrl(): Promise<string> {
  const env = String(process.env.NEXT_PUBLIC_SITE_URL || '')
    .trim()
    .replace(/\/+$/, '');
  if (env) return env;

  const h = await headers();

  const xfProto = String(h.get('x-forwarded-proto') || '')
    .split(',')[0]
    ?.trim();
  const xfHost = String(h.get('x-forwarded-host') || '')
    .split(',')[0]
    ?.trim();

  const host = xfHost || String(h.get('host') || '').trim();

  const proto = (xfProto || 'https').trim();

  if (host) return `${proto}://${host}`.replace(/\/+$/, '');

  // En son fallback (test ortamı)
  return 'http://localhost:3000';
}

/**
 * OpenGraph locale formatına çevir:
 * - "pt-br" -> "pt_BR"
 * - "tr"    -> "tr_TR"
 * - "fr"    -> "fr_FR"
 * - "en"    -> "en_US" (varsayılan)
 */
function toOgLocale(l: string): string {
  const raw = String(l || '').trim();
  if (!raw) return 'en_US';

  const normalized = raw.replace('_', '-').toLowerCase();
  const [langRaw, regionRaw] = normalized.split('-');

  const lang = (langRaw || 'en').toLowerCase();
  const region = (regionRaw || '').toUpperCase();

  if (lang === 'en' && !region) return 'en_US';
  if (lang === 'tr' && !region) return 'tr_TR';
  if (lang === 'de' && !region) return 'de_DE';

  return `${lang}_${region || lang.toUpperCase()}`;
}

/** Path normalizasyonu: başında / olsun; kök dışı ise sonda / olmasın */
function normPath(pathname?: string): string {
  let p = (pathname ?? '/').trim();
  if (!p.startsWith('/')) p = `/${p}`;
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
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
  if (p === '/') return `/${loc}`;
  return `/${loc}${p}`;
}

function absUrl(baseUrl: string, pathOrUrl: string): string {
  const v = String(pathOrUrl || '').trim();
  if (!v) return baseUrl;
  if (/^https?:\/\//i.test(v)) return v;
  const p = v.startsWith('/') ? v : `/${v}`;
  return `${baseUrl}${p}`;
}

async function fetchSeoRowWithFallback(locale: string) {
  const loc = normLocale(locale);

  // Öncelik: "seo" -> "site_seo"
  const tryKeys = ['seo', 'site_seo'] as const;

  const defaultLocale = await getDefaultLocale();
  const tryLocales = uniq([loc, normLocale(defaultLocale), 'en'].filter(Boolean));

  for (const l of tryLocales) {
    for (const k of tryKeys) {
      const row = await fetchSetting(k, l, { revalidate: 600 });
      if (row?.value != null) return row;
    }
  }
  return null;
}

export async function fetchSeoObject(locale: string): Promise<Record<string, any>> {
  const row = await fetchSeoRowWithFallback(locale);
  const v = row?.value as JsonLike;
  const obj = asObj(v);
  return obj ?? {};
}

type BuildMetadataArgs = {
  locale: string;
  pathname?: string; // locale-prefixsiz path: "/" veya "/blog"
  activeLocales?: string[];
};

async function resolveActiveLocales(provided?: string[]) {
  const list = provided && provided.length ? provided : await fetchActiveLocales();
  const normalized = uniq(list.map(normLocale)).filter(Boolean);
  if (!normalized.length) normalized.push(DEFAULT_LOCALE_FALLBACK);
  return normalized;
}

export async function buildMetadataFromSeo(
  seo: Record<string, any>,
  args: BuildMetadataArgs,
): Promise<Metadata> {
  const baseUrl = await getRuntimeBaseUrl();

  const active = await resolveActiveLocales(args.activeLocales);
  const defaultLocale = await getDefaultLocale();
  const locale = normLocale(args.locale);

  const titleDefault = asStr(seo.title_default) || 'Ensotek';
  const titleTemplate = asStr(seo.title_template) || '%s | Ensotek';
  const description = asStr(seo.description) || '';
  const siteName = asStr(seo.site_name) || 'Ensotek';

  // Open Graph
  const og = asObj(seo.open_graph) || {};
  const ogType = (asStr(og.type) || 'website') as any;

  const ogImages = uniq([...asStrArr(og.image), ...asStrArr(og.images)])
    .map((u) => absUrl(baseUrl, u))
    .filter(Boolean);

  // Twitter
  const tw = asObj(seo.twitter) || {};
  const twitterCard = (asStr(tw.card) || 'summary_large_image') as any;
  const twitterSite = asStr(tw.site);
  const twitterCreator = asStr(tw.creator);

  // Robots
  const rb = asObj(seo.robots) || {};
  const robotsNoindex = asBool(rb.noindex) ?? false;
  const robotsIndex = asBool(rb.index) ?? true;
  const robotsFollow = asBool(rb.follow) ?? true;

  const pathname = normPath(args.pathname);

  const canonical = absUrl(baseUrl, localizedPath(locale, pathname, defaultLocale));

  const languages: Record<string, string> = {};
  for (const l of active) {
    languages[l] = absUrl(baseUrl, localizedPath(l, pathname, defaultLocale));
  }
  languages['x-default'] = absUrl(baseUrl, localizedPath(defaultLocale, pathname, defaultLocale));

  const ogLocale = toOgLocale(locale);
  const ogAltLocales = active
    .filter((l) => normLocale(l) !== normLocale(locale))
    .map((l) => toOgLocale(l));

  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),

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

    robots: robotsNoindex
      ? { index: false, follow: false }
      : { index: robotsIndex, follow: robotsFollow },
  };

  return metadata;
}
