// =============================================================
// FILE: src/i18n/adminLocale.ts
// Ensotek – Admin locale helpers (NO URL sync, NO prefix)
// - Admin tarafında locale URL'e yazılmaz.
// - API için güvenli locale seçer: adminLocale > db default > first option > ADMIN_DEFAULT_LOCALE.
// =============================================================

import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";

import { localeShortClient, localeShortClientOr } from "./localeShortClient";

/**
 * Tek merkezi admin fallback locale sabiti.
 * Tüm modüller bu değeri kullanmalı — hardcoded "de" veya "tr" YAZMAMALI.
 */
export const ADMIN_DEFAULT_LOCALE = PREFERENCE_DEFAULTS.admin_locale; // "tr"

export function resolveAdminApiLocale(
  localeOptions?: Array<{ value: string } | { value: string; label?: string }> | null,
  defaultLocaleFromDb?: string | null,
  preferredLocale?: string | null,
): string {
  const safeOptions = Array.isArray(localeOptions) ? localeOptions : [];
  const set = new Set(safeOptions.map((x: any) => localeShortClient(x?.value)).filter(Boolean));

  // 1. Tercih edilen locale (admin UI locale) varsa ve aktif listede varsa kullan
  const pref = localeShortClient(preferredLocale);
  if (pref && set.has(pref)) return pref;

  // 2. DB default locale
  const db = localeShortClient(defaultLocaleFromDb);
  if (db && set.has(db)) return db;

  // 3. İlk aktif locale
  const first = localeShortClient(safeOptions[0]?.value);
  if (first && set.has(first)) return first;

  // 4. localeOptions henüz gelmemiş olabilir (ilk render) — merkezi fallback
  return localeShortClientOr(preferredLocale || ADMIN_DEFAULT_LOCALE, ADMIN_DEFAULT_LOCALE);
}
