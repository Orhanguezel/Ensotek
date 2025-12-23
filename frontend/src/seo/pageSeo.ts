// =============================================================
// FILE: src/seo/pageSeo.ts
// =============================================================
'use client';

/**
 * Default locale prefix kuralı:
 * - true  => default locale URL’leri prefix’siz: "/" , "/service"
 * - false => default locale de prefix’li: "/tr", "/tr/service"
 */
const DEFAULT_LOCALE_PREFIXLESS = true;

// Client tarafında default locale bilgisi DB’den gelmez.
// Test/CI için env ile sabitle:
const DEFAULT_LOCALE = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'tr').trim().toLowerCase();

function stripTrailingSlash(u: string) {
  return String(u || '')
    .trim()
    .replace(/\/+$/, '');
}

function normalizeLocalhostOrigin(origin: string): string {
  const o = stripTrailingSlash(origin);
  // http://localhost:3000  -> http://localhost
  // https://localhost:3000 -> https://localhost
  if (/^https?:\/\/localhost:\d+$/i.test(o)) return o.replace(/:\d+$/i, '');
  return o;
}

function toLocaleShort(l: any): string {
  return (
    String(l || DEFAULT_LOCALE)
      .trim()
      .toLowerCase()
      .split('-')[0] || DEFAULT_LOCALE
  );
}

function getBaseUrl(): string {
  const env = stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || '');
  if (env) return normalizeLocalhostOrigin(env);

  if (typeof window !== 'undefined' && window?.location?.origin) {
    return normalizeLocalhostOrigin(window.location.origin);
  }

  return 'http://localhost';
}

/** absolute URL helper (client) */
export function absUrl(pathOrUrl: string): string {
  const base = getBaseUrl();
  const v = String(pathOrUrl || '').trim();
  if (!v) return base;
  if (/^https?:\/\//i.test(v)) return normalizeLocalhostOrigin(v);
  return `${base}${v.startsWith('/') ? v : `/${v}`}`;
}

/** "/x?y#z" -> "/x" */
export function stripHashQuery(asPath: string): string {
  const [pathOnly] = String(asPath || '/').split('#');
  const [pathname] = pathOnly.split('?');
  return pathname || '/';
}

export function asObj(x: any): Record<string, any> | null {
  return x && typeof x === 'object' && !Array.isArray(x) ? (x as Record<string, any>) : null;
}

/** seo.open_graph.image veya seo.open_graph.images[0] */
export function pickFirstImageFromSeo(seo: any): string {
  const og = asObj(seo?.open_graph) || {};
  const image = typeof (og as any).image === 'string' ? String((og as any).image).trim() : '';
  const imagesArr =
    Array.isArray((og as any).images) && (og as any).images.length
      ? String((og as any).images[0]).trim()
      : '';
  return image || imagesArr || '';
}

function stripDefaultLocalePrefix(pathname: string, locale: string): string {
  const loc = toLocaleShort(locale);
  const def = toLocaleShort(DEFAULT_LOCALE);

  if (!DEFAULT_LOCALE_PREFIXLESS) return pathname;
  if (loc !== def) return pathname;

  // "/tr" -> "/"
  if (pathname === `/${loc}`) return '/';

  // "/tr/xxx" -> "/xxx"
  const pref = `/${loc}/`;
  if (pathname.startsWith(pref)) return `/${pathname.slice(pref.length)}`.replace(/^\/+/, '/');

  return pathname;
}

/**
 * Canonical üretimi (CLIENT):
 * - asPath -> query/hash temizlenir
 * - localizePath(locale, path) uygulanır
 * - default locale prefixless ise "/tr/.." -> "/.."
 * - absUrl ile mutlak yapılır (localhost:3000 -> localhost normalize)
 */
export function buildCanonical(args: {
  asPath?: string;
  locale: string;
  fallbackPathname: string;
  localizePath: (locale: string, pathname: string) => string;
}): string {
  const rawPath = stripHashQuery(args.asPath || args.fallbackPathname || '/');
  const localized = args.localizePath(args.locale, rawPath);
  const fixed = stripDefaultLocalePrefix(localized, args.locale);
  return absUrl(fixed);
}
