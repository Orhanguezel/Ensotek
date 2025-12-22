// =============================================================
// FILE: src/i18n/url.ts  (DYNAMIC)
//  - No SUPPORTED_LOCALES / LOCALE_SET dependency
//  - Strip/localize uses runtime activeLocales if provided
//  - Has safe heuristic fallback when activeLocales is not available yet
// =============================================================

export type RuntimeLocale = string;

function toShortLocale(v: unknown): string {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace("_", "-")
    .split("-")[0]
    .trim();
}

function splitPath(asPath: string) {
  const s = String(asPath || "/");
  const [pathAndQuery, hash = ""] = s.split("#");
  const [pathname = "/", query = ""] = pathAndQuery.split("?");
  return {
    pathname: pathname || "/",
    query: query ? `?${query}` : "",
    hash: hash ? `#${hash}` : "",
  };
}

function buildActiveSet(activeLocales?: string[]) {
  return new Set((activeLocales || []).map((x) => toShortLocale(x)).filter(Boolean));
}

/**
 * Heuristic locale prefix detection:
 * - Matches "xx" or "xx-yy" but we store short "xx"
 * - Only used if activeLocales not passed
 */
function looksLikeLocale(seg: string): boolean {
  const s = toShortLocale(seg);
  // "tr", "en", "de" style
  if (/^[a-z]{2}$/.test(s)) return true;
  // allow 3-letter language codes if you ever use them
  if (/^[a-z]{3}$/.test(s)) return true;
  return false;
}

/**
 * Strips "/{locale}" prefix from a pathname.
 * - If activeLocales provided, only strips if the prefix exists in activeLocales (strict).
 * - Otherwise uses a conservative heuristic (best-effort).
 */
export function stripLocalePrefix(pathname: string, activeLocales?: string[]): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const seg = p.replace(/^\/+/, "").split("/")[0] || "";
  const cand = toShortLocale(seg);

  if (!cand) return p;

  const activeSet = buildActiveSet(activeLocales);

  const shouldStrip =
    activeSet.size > 0 ? activeSet.has(cand) : looksLikeLocale(cand);

  if (!shouldStrip) return p;

  const rest = p.replace(new RegExp(`^/${seg}(?=/|$)`), "");
  return rest ? (rest.startsWith("/") ? rest : `/${rest}`) : "/";
}

/**
 * Prefixes a path with "/{locale}" (URL-prefix routing).
 * - Removes existing locale prefix first (using activeLocales if provided).
 * - Does not validate locale here; validation belongs to routing/boot logic.
 */
export function localizePath(locale: RuntimeLocale, asPath: string, activeLocales?: string[]): string {
  const { pathname, query, hash } = splitPath(asPath);
  const clean = stripLocalePrefix(pathname, activeLocales);
  const base = clean === "/" ? "" : clean;
  const l = toShortLocale(locale) || "tr";
  return `/${l}${base}${query}${hash}`;
}
