// =============================================================
// FILE: src/seo/pageSeo.ts
// =============================================================
'use client';

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

/**
 * Canonical üretimi:
 * - asPath -> query/hash temizlenir
 * - sonra localizePath(locale, path) ile locale prefix kuralına uyulur
 * - ardından absUrl ile mutlak URL yapılır
 */
export function buildCanonical(args: {
  asPath?: string;
  locale: string;
  fallbackPathname: string;
  localizePath: (locale: string, pathname: string) => string;
}): string {
  const rawPath = stripHashQuery(args.asPath || args.fallbackPathname || '/');
  const localized = args.localizePath(args.locale, rawPath);
  return absUrl(localized);
}
