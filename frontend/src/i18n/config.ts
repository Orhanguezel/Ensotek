// =============================================================
// FILE: src/i18n/config.ts
// =============================================================
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/common";

/**
 * STATIC LOCALES:
 * - Build-time'da bilinen "mümkün" locale'ler (mesaj dosyaları / routing).
 * - Hangi dillerin aktif olduğu runtime'da site_settings.app_locales üzerinden belirlenir.
 */
export const LOCALES = SUPPORTED_LOCALES;
export const LOCALE_SET = new Set(LOCALES as readonly string[]);

/**
 * FALLBACK_LOCALE:
 * - DB erişilemezse / site_settings yoksa kullanılacak güvenli fallback.
 */
export const FALLBACK_LOCALE: SupportedLocale = "tr";

/**
 * DEFAULT_LOCALE (STATIC):
 * - Bu değer artık "gerçek default" değildir.
 * - Sadece build-time yardımcı/fallback olarak tutulur.
 * - Env varsa candidate gibi davranır, yoksa FALLBACK_LOCALE.
 *
 * Gerçek default => site_settings.default_locale (server.ts / client hook üzerinden).
 */
export const DEFAULT_LOCALE: SupportedLocale = (() => {
  const cand = String(process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "")
    .trim()
    .replace("_", "-")
    .split("-")[0]
    .toLowerCase();

  return (cand && LOCALE_SET.has(cand) ? cand : FALLBACK_LOCALE) as SupportedLocale;
})();

export const KNOWN_RTL = new Set([
  "ar", "fa", "he", "ur", "ckb", "ps", "sd", "ug", "yi", "dv",
]);

export const isSupportedLocale = (x?: string | null): x is SupportedLocale =>
  !!x && LOCALE_SET.has(String(x).toLowerCase());

/**
 * normalizeLocale:
 * - Build-time supported değilse DEFAULT_LOCALE'e düşer.
 * - Runtime default için server/client tarafında DB default_locale kullanılmalı.
 */
export const normalizeLocale = (x?: string | null): SupportedLocale => {
  const v = String(x || "").trim().toLowerCase().replace("_", "-").split("-")[0];
  return (v && LOCALE_SET.has(v) ? v : DEFAULT_LOCALE) as SupportedLocale;
};
