// src/seo/alternates.ts
import "server-only";

import { fetchActiveLocales, DEFAULT_LOCALE } from "@/i18n/server";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
const DEFAULT_LOCALE_PREFIXLESS = true;

function normLocale(l: any): string {
  const v = String(l || "").trim().toLowerCase().replace("_", "-");
  return v.split("-")[0] || DEFAULT_LOCALE;
}

function normPath(pathname?: string): string {
  let p = (pathname ?? "/").trim();
  if (!p.startsWith("/")) p = `/${p}`;
  if (p !== "/" && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

function localizedPath(locale: string, pathname: string): string {
  const loc = normLocale(locale);
  const p = normPath(pathname);
  if (DEFAULT_LOCALE_PREFIXLESS && loc === normLocale(DEFAULT_LOCALE)) return p;
  if (p === "/") return `/${loc}`;
  return `/${loc}${p}`;
}

function absUrl(pathOrUrl: string): string {
  const v = String(pathOrUrl || "").trim();
  if (!v) return BASE_URL;
  if (/^https?:\/\//i.test(v)) return v;
  const p = v.startsWith("/") ? v : `/${v}`;
  return `${BASE_URL}${p}`;
}

/** hreflang için mutlak URL haritası üretir (DB app_locales) */
export async function languagesMap(pathname?: string) {
  const active = (await fetchActiveLocales()).map(normLocale);
  const p = normPath(pathname);

  const map: Record<string, string> = {};
  for (const l of active) {
    map[l] = absUrl(localizedPath(l, p));
  }
  map["x-default"] = absUrl(localizedPath(normLocale(DEFAULT_LOCALE), p));
  return map as Readonly<Record<string, string>>;
}

/** Canonical URL (mutlak) – seçilen dil için */
export function canonicalFor(locale: string, pathname?: string) {
  const p = normPath(pathname);
  return absUrl(localizedPath(locale, p));
}
