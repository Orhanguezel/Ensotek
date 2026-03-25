// =============================================================
// FILE: src/i18n/config.ts  (DYNAMIC)
//  - No SUPPORTED_LOCALES / env default
//  - Only constants that are truly static (rtl list etc.)
//  - Fallback locale: PREFERENCE_DEFAULTS.admin_locale üzerinden merkezi
// =============================================================

import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";

export const FALLBACK_LOCALE = PREFERENCE_DEFAULTS.admin_locale;

/** RTL set sabit olabilir (bu bir “dil listesi yönetimi” değil, yazım yönü bilgisidir) */
export const KNOWN_RTL = new Set(["ar", "fa", "he", "ur", "ckb", "ps", "sd", "ug", "yi", "dv"]);

export const isRTL = (l: string) => KNOWN_RTL.has(String(l || "").toLowerCase());
