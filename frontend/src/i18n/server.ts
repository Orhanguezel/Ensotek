// =============================================================
// FILE: src/i18n/server.ts
// =============================================================
import "server-only";

import { cache } from "react";
import { headers, cookies } from "next/headers";

import {
  normalizeLocales,
  normLocaleTag,
  pickFromAcceptLanguage,
  pickFromCookie,
} from "@/i18n/localeUtils";

const API = (process.env.API_BASE_URL || "").trim();

// ✅ Hard fallback sadece "DB yoksa" devreye girer (env/static default değil)
export const DEFAULT_LOCALE_FALLBACK = "tr";

export type JsonLike =
  | string
  | number
  | boolean
  | null
  | { [k: string]: JsonLike }
  | JsonLike[];

export type SiteSettingResp = {
  key?: string;
  locale?: string;
  value?: JsonLike;
  updated_at?: string;
};

function tryParse(x: unknown): unknown {
  if (typeof x === "string") {
    const s = x.trim();
    if (
      (s.startsWith("{") && s.endsWith("}")) ||
      (s.startsWith("[") && s.endsWith("]"))
    ) {
      try {
        return JSON.parse(s);
      } catch {
        /* ignore */
      }
    }
  }
  return x;
}

export async function fetchSetting(
  key: string,
  locale?: string,
  opts?: { revalidate?: number },
): Promise<SiteSettingResp | null> {
  if (!API) return null;

  try {
    const url = new URL(
      `${API.replace(/\/+$/, "")}/site_settings/${encodeURIComponent(key)}`,
    );

    const l = normLocaleTag(locale);
    if (l) url.searchParams.set("locale", l);

    const res = await fetch(url.toString(), {
      next: { revalidate: opts?.revalidate ?? 600 },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as SiteSettingResp;
    if (!data || typeof data !== "object") return null;

    const value = tryParse((data as any).value) as JsonLike;
    return { ...data, value };
  } catch {
    return null;
  }
}

/**
 * DB: site_settings(app_locales) => aktif diller
 * Her zaman "kısa locale" normalize beklenir (tr/en/de gibi)
 */
export async function fetchActiveLocales(): Promise<string[]> {
  const def = DEFAULT_LOCALE_FALLBACK;

  if (!API) return [def];

  const row = await fetchSetting("app_locales", undefined, { revalidate: 600 });
  const locales = normalizeLocales(row?.value);

  return locales.length ? locales : [def];
}

/**
 * ✅ Dinamik default locale:
 * - app_locales içinden "ilk locale" default kabul edilir
 * - DB yoksa fallback "tr"
 *
 * Not: Bu yöntem %100 dinamik ve multi-tenant pattern’ine uygun.
 * (İstersen ileride "default_locale" key’i ekleyip buradan okuyabiliriz.)
 */
export const getDefaultLocale = cache(async (): Promise<string> => {
  const active = await fetchActiveLocales();
  const first = (active?.[0] ?? "").toString();
  return normLocaleTag(first) || DEFAULT_LOCALE_FALLBACK;
});

/**
 * ✅ Tek noktadan request i18n context:
 * - activeLocales (app_locales)
 * - defaultLocale (app_locales[0])
 * - detectedLocale (cookie > accept-language > defaultLocale)
 *
 * ✅ cache() => aynı request içinde tekrar fetch yok.
 */
export const getServerI18nContext = cache(async () => {
  const h = await headers();
  const c = await cookies();

  const activeLocales = await fetchActiveLocales();
  const defaultLocale = await getDefaultLocale();

  const cookieLocale = c.get("NEXT_LOCALE")?.value;
  const fromCookie = pickFromCookie(cookieLocale, activeLocales);

  const detectedLocale =
    fromCookie ??
    pickFromAcceptLanguage(h.get("accept-language"), activeLocales) ??
    defaultLocale;

  return { activeLocales, defaultLocale, detectedLocale };
});
