// src/seo/pageSeo.ts
"use client";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export type SeoDbValue = Record<string, any>;

export function asObj(x: any): Record<string, any> | null {
    return x && typeof x === "object" && !Array.isArray(x) ? (x as Record<string, any>) : null;
}

export function absUrl(pathOrUrl: string): string {
    const v = String(pathOrUrl || "").trim();
    if (!v) return BASE_URL;
    if (/^https?:\/\//i.test(v)) return v;
    return `${BASE_URL}${v.startsWith("/") ? v : `/${v}`}`;
}

/** "/x?y#z" -> "/x" */
export function stripHashQuery(asPath: string): string {
    const [pathOnly] = String(asPath || "/").split("#");
    const [pathname] = pathOnly.split("?");
    return pathname || "/";
}

/** seo.open_graph.image veya seo.open_graph.images[0] */
export function pickFirstImageFromSeo(seo: any): string {
    const og = asObj(seo?.open_graph) || {};
    const image = typeof og.image === "string" ? og.image.trim() : "";
    const imagesArr =
        Array.isArray(og.images) && og.images.length ? String(og.images[0]).trim() : "";
    return image || imagesArr || "";
}

/**
 * Canonical üretimi:
 * - asPath -> query/hash temizlenir
 * - sonra localizePath(locale, path) ile locale prefix kuralına uyulur
 * - ardından absUrl ile mutlak URL yapılır
 */
export function buildCanonical(args: {
    asPath?: string;
    locale: string;
    fallbackPathname: string; // örn "/about"
    localizePath: (locale: string, pathname: string) => string;
}): string {
    const rawPath = stripHashQuery(args.asPath || args.fallbackPathname || "/");
    const localized = args.localizePath(args.locale, rawPath);
    return absUrl(localized);
}
