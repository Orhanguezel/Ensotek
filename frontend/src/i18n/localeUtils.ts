// =============================================================
// FILE: src/i18n/localeUtils.ts
// =============================================================

import { LOCALE_SET } from "@/i18n/config";

/**
 * ✅ Dinamik i18n için:
 * - DEFAULT_LOCALE artık config/env’den gelmez.
 * - Sadece “en kötü senaryo” fallback’i vardır.
 *
 * Not: Default locale’i DB’den almak için server tarafında:
 * - getDefaultLocale() (src/i18n/server.ts) kullanılır.
 */
export const FALLBACK_LOCALE = "tr";

export function normLocaleTag(x: unknown): string {
  return String(x || "")
    .toLowerCase()
    .trim()
    .replace("_", "-")
    .split("-")[0]
    .trim();
}

/** Sadece build-time desteklenen locale’leri bırak + dedupe */
export function filterSupported(locales: string[]): string[] {
  const cleaned = locales
    .map(normLocaleTag)
    .filter(Boolean)
    .filter((l) => LOCALE_SET.has(l));
  return Array.from(new Set(cleaned));
}

/**
 * raw:
 * - ["tr","en"]
 * - { locales: ["tr","en"] }
 * - JSON string olabilir (server fetch’ten)
 */
export function normalizeLocales(raw: unknown): string[] {
  const def = FALLBACK_LOCALE;

  let v: unknown = raw;

  // JSON string parse (server tarafı için de faydalı)
  if (typeof v === "string") {
    const s = v.trim();
    if (
      (s.startsWith("{") && s.endsWith("}")) ||
      (s.startsWith("[") && s.endsWith("]"))
    ) {
      try {
        v = JSON.parse(s);
      } catch {
        // ignore
      }
    }
  }

  const arr: unknown[] = Array.isArray(v)
    ? v
    : v && typeof v === "object" && Array.isArray((v as any).locales)
      ? (v as any).locales
      : [];

  const supported = filterSupported(arr.map((x) => String(x)));
  return supported.length ? supported : [def];
}

/**
 * Accept-Language’den en uygun locale’i seçer.
 * - active: DB’den gelen app_locales (normalize edilmiş olmalı)
 * - Eğer active boşsa, fallback’i kullanır
 */
export function pickFromAcceptLanguage(
  accept: string | null,
  active: string[],
): string {
  const def = FALLBACK_LOCALE;
  const activeClean = filterSupported(active.length ? active : [def]);

  const a = (accept || "").toLowerCase();
  if (!a) return activeClean[0] || def;

  const prefs = a
    .split(",")
    .map((part) => part.trim().split(";")[0]?.trim())
    .filter(Boolean)
    .map((tag) => normLocaleTag(tag))
    .filter(Boolean);

  for (const p of prefs) {
    if (activeClean.includes(p)) return p;
  }

  return activeClean.includes(def) ? def : (activeClean[0] || def);
}

export function pickFromCookie(
  cookieLocale: string | undefined,
  active: string[],
): string | null {
  const c = normLocaleTag(cookieLocale);
  if (!c) return null;

  const activeClean = filterSupported(active);
  return activeClean.includes(c) ? c : null;
}
