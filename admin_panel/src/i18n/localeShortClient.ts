// =============================================================
// FILE: src/i18n/localeShortClient.ts
// Ensotek – Locale normalize helper (CLIENT SAFE, NO HOOKS)
// - NO toShortLocale
// - Uses normLocaleTag
// - Fallback: PREFERENCE_DEFAULTS.admin_locale üzerinden merkezi
// =============================================================

import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";

import { normLocaleTag } from "./localeUtils";

const safeStr = (v: unknown) => String(v ?? "").trim();

export function localeShortClient(v: unknown): string {
  const raw = safeStr(v);
  if (!raw) return "";
  return normLocaleTag(raw) || "";
}

export function localeShortClientOr(v: unknown, fallback?: string): string {
  return localeShortClient(v) || fallback || PREFERENCE_DEFAULTS.admin_locale;
}
