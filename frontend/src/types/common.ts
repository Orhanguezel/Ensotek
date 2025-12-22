// =============================================================
// FILE: src/types/common.ts  (DYNAMIC)
// =============================================================

// Runtime’da tek kaynak DB olduğu için:
// SupportedLocale compile-time union OLAMAZ. string olmalı.
export type SupportedLocale = string;

/** Çok dilli alan: locale -> text */
export type TranslatedLabel = Record<string, string>;
export type StrictTranslatedLabel = Record<string, string>;

/**
 * İsteğe bağlı: Label map (UI dil seçici gibi yerlerde “güzel isim” için)
 * Bu tablo “karar mekanizması” değildir, sadece best-effort display'dir.
 */
export const LANG_LABELS: Record<string, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
};

/** Tarih formatları: best-effort + fallback */
export const DATE_FORMATS: Record<string, string> = {
  tr: "dd.MM.yyyy",
  en: "yyyy-MM-dd",
  de: "dd.MM.yyyy",
};

/** Intl locale map: best-effort + fallback */
export const LOCALE_MAP: Record<string, string> = {
  tr: "tr-TR",
  en: "en-US",
  de: "de-DE",
};

export function getDateLocale(locale: SupportedLocale): string {
  const l = String(locale || "").trim().toLowerCase();
  return LOCALE_MAP[l] || LOCALE_MAP.en || "en-US";
}

export function getLocaleStringFromLang(lang: SupportedLocale): string {
  const l = String(lang || "").trim().toLowerCase();
  return LOCALE_MAP[l] || LOCALE_MAP.en || "en-US";
}

/**
 * Çok dilli alanlarda fallback okuma
 * Fallback sırası:
 *  1) istenen lang
 *  2) tr
 *  3) en
 *  4) ilk değer
 */
export function getMultiLang(
  obj?: Record<string, string> | null,
  lang?: SupportedLocale | null,
): string {
  if (!obj) return "—";

  const l = String(lang || "").trim().toLowerCase();
  if (l && obj[l]) return obj[l];

  return obj.tr || obj.en || Object.values(obj)[0] || "—";
}
