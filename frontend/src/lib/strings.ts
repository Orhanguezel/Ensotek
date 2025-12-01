/** Küçük yardımcılar: güvenli string/URL/locale işlemleri */
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/common";

export const toStr = (v: unknown) => (v == null ? "" : String(v));

/** Başa / ekler */
export const ensureLeadingSlash = (s: string) => (s.startsWith("/") ? s : `/${s}`);

/** Sondaki /’ları temizler (root hariç) — Safari güvenli */
export const stripTrailingSlash = (s: string) => (s === "/" ? s : s.replace(/\/+$/g, ""));

/** Trim + tek boşlukla birleştir */
export const squish = (s: string) => toStr(s).replace(/\s+/g, " ").trim();

/** Güvenli split (boşları at) */
export const safeSplit = (s: string, sep: RegExp | string) =>
  toStr(s).split(sep).map((x) => x.trim()).filter(Boolean);

/** Locale doğrulama (tek kaynak: SUPPORTED_LOCALES) */
export type Locale = SupportedLocale;

const LOCALE_SET = new Set(SUPPORTED_LOCALES as readonly string[]);

export function baseLocale(x: string): string {
  return String(x || "").split("-")[0].toLowerCase();
}

export const isLocale = (x: string): x is Locale => LOCALE_SET.has(baseLocale(x));

/** Cookie-value decode (kusurlu escape’a toleranslı) */
export const safeDecode = (s: string) => {
  try { return decodeURIComponent(s); } catch { return s; }
};
