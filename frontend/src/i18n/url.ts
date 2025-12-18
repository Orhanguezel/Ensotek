// =============================================================
// FILE: src/i18n/url.ts
// =============================================================
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/common";

const LOCALE_SET = new Set((SUPPORTED_LOCALES as readonly string[]).map((x) => x.toLowerCase()));

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

function stripLocalePrefix(pathname: string): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const seg = p.replace(/^\/+/, "").split("/")[0] || "";
  const cand = toShortLocale(seg);
  if (cand && LOCALE_SET.has(cand)) {
    const rest = p.replace(new RegExp(`^/${seg}(?=/|$)`), "");
    return rest ? (rest.startsWith("/") ? rest : `/${rest}`) : "/";
  }
  return p;
}

export function localizePath(locale: SupportedLocale, asPath: string): string {
  const { pathname, query, hash } = splitPath(asPath);
  const clean = stripLocalePrefix(pathname);
  const base = clean === "/" ? "" : clean;
  return `/${locale}${base}${query}${hash}`;
}
