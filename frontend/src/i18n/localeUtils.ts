// src/i18n/localeUtils.ts
import { DEFAULT_LOCALE as DEFAULT_LOCALE_TYPED, LOCALE_SET } from "@/i18n/config";

export const DEFAULT_LOCALE = String(DEFAULT_LOCALE_TYPED || "tr");

export function normLocaleTag(x: unknown): string {
    return String(x || "")
        .toLowerCase()
        .trim()
        .replace("_", "-")
        .split("-")[0]
        .trim();
}

/** Sadece build-time supported locale’leri bırak + dedupe */
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
    const def = normLocaleTag(DEFAULT_LOCALE) || "tr";

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

export function pickFromAcceptLanguage(accept: string | null, active: string[]): string {
    const def = normLocaleTag(DEFAULT_LOCALE) || "tr";
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

export function pickFromCookie(cookieLocale: string | undefined, active: string[]): string | null {
    const c = normLocaleTag(cookieLocale);
    if (!c) return null;

    const activeClean = filterSupported(active);
    return activeClean.includes(c) ? c : null;
}
