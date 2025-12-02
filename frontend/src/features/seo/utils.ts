// =============================================================
// FILE: src/features/seo/utils.ts
// SEO yardımcıları: site URL, absoluteUrl, compact
// =============================================================

/** Site'nin temel URL'si (örn: https://ensotek.de) */
export function siteUrlBase(): string {
  const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  // Env yoksa: SSR'da tahmin, client'ta window.location
  if (typeof window !== "undefined") {
    const { protocol, host } = window.location;
    return `${protocol}//${host}`.replace(/\/+$/, "");
  }

  // En son fallback
  return "http://localhost:3000";
}

/** Verilen path'i tam URL'e çevirir. Zaten http(s) ise dokunmaz. */
export function absoluteUrl(path: string): string {
  const base = siteUrlBase();
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * Nesnedeki undefined / null / boş string / boş array / boş object alanları temizler.
 * JSON-LD için gereksiz alanları çıkarmakta kullanıyoruz.
 */
export function compact<T extends Record<string, any>>(obj: T): T {
  const out: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;

    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      continue;
    }

    out[key] = value;
  }

  return out as T;
}
