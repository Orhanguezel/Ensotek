// src/i18n/locale.ts
"use client";

import { useRouter } from "next/router";
import type { SupportedLocale } from "@/types/common";
import { normalizeLocale } from "./config";

/**
 * Tüm client-side component'lerde locale çözümü:
 * - Öncelik: dışarıdan verilen explicitLocale
 * - Sonra: router.locale
 * - En sonunda: normalizeLocale → DEFAULT_LOCALE fallback
 */
export function useResolvedLocale(
  explicitLocale?: SupportedLocale | string | null
): SupportedLocale {
  const { locale } = useRouter();

  const cand =
    (typeof explicitLocale === "string" && explicitLocale) ||
    (typeof explicitLocale === "object" ? String(explicitLocale) : undefined) ||
    locale ||
    undefined;

  return normalizeLocale(cand);
}
