// src/i18n/url.ts
import { LOCALES, LOCALE_SET, DEFAULT_LOCALE } from "./config";
import type { SupportedLocale } from "@/types/common";

const DEFAULT_LOCALE_PREFIXLESS = true;

// Başta tek bir locale varsa sök
const leadingLocaleRe = new RegExp(`^\\/(${LOCALES.join("|")})(?=\\/|$)`, "i");

export function stripLeadingLocale(pathname: string): string {
  const out = (pathname || "/").replace(leadingLocaleRe, "");
  return out || "/";
}

// Yan yana iki locale varsa ilkini at ("/tr/en/..." -> "/en/...")
export function collapseDoubleLocale(pathname: string): string {
  const parts = (pathname || "/").replace(/^\/+/, "").split("/");
  if (parts.length >= 2 && LOCALE_SET.has(parts[0]!) && LOCALE_SET.has(parts[1]!)) {
    parts.shift();
    return "/" + parts.join("/");
  }
  return pathname || "/";
}

function normPath(pathname: string): string {
  let p = (pathname || "/").trim();
  if (!p.startsWith("/")) p = `/${p}`;
  if (p !== "/" && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

/**
 * Hedef dile göre absolute path üret (query/hash korunur)
 * - default locale prefixless ise: target=DEFAULT_LOCALE => "/about"
 * - diğerleri: "/en/about"
 */
export function localizePath(target: SupportedLocale, asPath: string) {
  const [pathWithHash, queryString = ""] = String(asPath || "/").split("?");
  const [pathnameRaw, hash = ""] = pathWithHash.split("#");

  const collapsed = collapseDoubleLocale(pathnameRaw || "/");
  const stripped = stripLeadingLocale(collapsed);
  const base = normPath(stripped);

  const query = queryString ? `?${queryString}` : "";
  const h = hash ? `#${hash}` : "";

  const isDefault = String(target) === String(DEFAULT_LOCALE);

  if (DEFAULT_LOCALE_PREFIXLESS && isDefault) {
    return `${base}${query}${h}`;
  }

  // "/" için "/en" gibi üret
  if (base === "/") return `/${target}${query}${h}`;

  return `/${target}${base}${query}${h}`;
}
