// src/i18n/server.ts
import "server-only";

import { cache } from "react";
import { headers, cookies } from "next/headers";

import {
    DEFAULT_LOCALE,
    normalizeLocales,
    normLocaleTag,
    pickFromAcceptLanguage,
    pickFromCookie,
} from "@/i18n/localeUtils";

const API = (process.env.API_BASE_URL || "").trim();

export type JsonLike =
    | string
    | number
    | boolean
    | null
    | { [k: string]: JsonLike }
    | JsonLike[];

export type SiteSettingResp = {
    key?: string;
    locale?: string;
    value?: JsonLike;
    updated_at?: string;
};

function tryParse(x: unknown): unknown {
    if (typeof x === "string") {
        const s = x.trim();
        if (
            (s.startsWith("{") && s.endsWith("}")) ||
            (s.startsWith("[") && s.endsWith("]"))
        ) {
            try {
                return JSON.parse(s);
            } catch {
                /* ignore */
            }
        }
    }
    return x;
}

export async function fetchSetting(
    key: string,
    locale?: string,
    opts?: { revalidate?: number }
): Promise<SiteSettingResp | null> {
    if (!API) return null;

    try {
        const url = new URL(`${API.replace(/\/+$/, "")}/site_settings/${encodeURIComponent(key)}`);

        const l = normLocaleTag(locale);
        if (l) url.searchParams.set("locale", l);

        const res = await fetch(url.toString(), {
            next: { revalidate: opts?.revalidate ?? 600 },
        });

        if (!res.ok) return null;

        const data = (await res.json()) as SiteSettingResp;
        if (!data || typeof data !== "object") return null;

        const value = tryParse((data as any).value) as JsonLike;
        return { ...data, value };
    } catch {
        return null;
    }
}

export async function fetchActiveLocales(): Promise<string[]> {
    const def = normLocaleTag(DEFAULT_LOCALE) || "tr";
    if (!API) return [def];

    const row = await fetchSetting("app_locales", undefined, { revalidate: 600 });
    const locales = normalizeLocales(row?.value);

    return locales.length ? locales : [def];
}

/**
 * ✅ Tek noktadan request i18n context:
 * - activeLocales (app_locales)
 * - detectedLocale (cookie > accept-language)
 *
 * ✅ cache() => aynı request içinde (layout + generateMetadata) tekrar fetch yok.
 */
export const getServerI18nContext = cache(async () => {
    const h = await headers();
    const c = await cookies();

    const activeLocales = await fetchActiveLocales();

    const cookieLocale = c.get("NEXT_LOCALE")?.value;
    const fromCookie = pickFromCookie(cookieLocale, activeLocales);

    const detectedLocale =
        fromCookie ?? pickFromAcceptLanguage(h.get("accept-language"), activeLocales);

    return { activeLocales, detectedLocale };
});
