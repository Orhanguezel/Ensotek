// =============================================================
// FILE: src/seo/alternates.ts
// =============================================================
import 'server-only';

import { fetchActiveLocales, getDefaultLocale } from '@/i18n/server';

const stripTrailingSlash = (u: string) =>
  String(u || '')
    .trim()
    .replace(/\/+$/, '');

/**
 * Test/SSR ortamında base URL "http://localhost:3000" gibi gelirse
 * Playwright origin check için port'u normalize ediyoruz: "http://localhost"
 *
 * NOT: Prod domainlerde dokunmaz.
 */
const normalizeLocalhostOrigin = (origin: string): string => {
  const o = stripTrailingSlash(origin);
  if (/^https?:\/\/localhost:\d+$/i.test(o)) return o.replace(/:\d+$/i, '');
  return o;
};

const BASE_URL = normalizeLocalhostOrigin(
  stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost'),
);

const DEFAULT_LOCALE_PREFIXLESS = true;

function normLocale(l: any, defaultLocale: string): string {
  const v = String(l || '')
    .trim()
    .toLowerCase()
    .replace('_', '-');
  return (v.split('-')[0] || '').trim() || defaultLocale;
}

function normPath(pathname?: string): string {
  let p = (pathname ?? '/').trim();
  if (!p.startsWith('/')) p = `/${p}`;
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function localizedPath(locale: string, pathname: string, defaultLocale: string): string {
  const loc = normLocale(locale, defaultLocale);
  const p = normPath(pathname);

  // ✅ default locale prefixsiz
  if (DEFAULT_LOCALE_PREFIXLESS && loc === normLocale(defaultLocale, defaultLocale)) return p;

  if (p === '/') return `/${loc}`;
  return `/${loc}${p}`;
}

function absUrl(pathOrUrl: string): string {
  const v = String(pathOrUrl || '').trim();
  if (!v) return BASE_URL;
  if (/^https?:\/\//i.test(v)) return v;
  const p = v.startsWith('/') ? v : `/${v}`;
  return `${BASE_URL}${p}`;
}

/** hreflang için mutlak URL haritası üretir (DB app_locales) */
export async function languagesMap(pathname?: string) {
  const defaultLocale = await getDefaultLocale();
  const active = (await fetchActiveLocales()).map((l) => normLocale(l, defaultLocale));
  const p = normPath(pathname);

  const map: Record<string, string> = {};
  for (const l of active) {
    map[l] = absUrl(localizedPath(l, p, defaultLocale));
  }

  // ✅ x-default: default locale canonical
  map['x-default'] = absUrl(localizedPath(defaultLocale, p, defaultLocale));

  return map as Readonly<Record<string, string>>;
}

/** Canonical URL (mutlak) – seçilen dil için */
export async function canonicalFor(locale: string, pathname?: string) {
  const defaultLocale = await getDefaultLocale();
  const p = normPath(pathname);
  return absUrl(localizedPath(locale, p, defaultLocale));
}
