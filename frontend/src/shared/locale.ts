// src/lib/shared/locale.ts
import { LOCALES, DEFAULT_LOCALE, isSupportedLocale } from "@/i18n/config";
import type { SupportedLocale } from "@/types/common";
import { stripLeadingLocale, collapseDoubleLocale } from "@/i18n/url";

/** Tek lokalle başlıyorsa tespit et; yoksa DEFAULT_LOCALE */
export function detectLocaleFromPath(path: string): SupportedLocale {
  const raw = String(path || "");
  const parts = raw.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const head = (parts[0] || "").toLowerCase();
  return isSupportedLocale(head) ? (head as SupportedLocale) : DEFAULT_LOCALE;
}

/** Baştaki locale’i (varsa) temizle, query/hash korunur */
export function stripLocale(path: string): string {
  if (!path) return "/";
  const [p, q = ""] = String(path).split("?");
  const [pathname, hash = ""] = p.split("#");
  const clean = stripLeadingLocale(collapseDoubleLocale(pathname || "/")) || "/";
  const qq = q ? `?${q}` : "";
  const hh = hash ? `#${hash}` : "";
  return `${clean}${qq}${hh}`;
}

/** Verilen path’i hedef dile çevirir (varsa mevcut locale’i söker, sonra ekler) */
export function withLocalePath(locale: SupportedLocale, pathLike: string): string {
  const clean = stripLocale(String(pathLike || "/"));
  const [p, q = ""] = clean.split("?");
  const [pathname, hash = ""] = p.split("#");
  const qq = q ? `?${q}` : "";
  const hh = hash ? `#${hash}` : "";
  // kök path için "/{locale}"
  const base = pathname === "/" ? "" : pathname;
  return `/${locale}${base}${qq}${hh}`;
}

/** Tüm destekli diller (tek kaynak) */
export const SUPPORTED = LOCALES;
