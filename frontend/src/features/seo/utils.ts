// src/features/seo/utils.ts (veya mevcut dosyanız)
export function siteUrlBase() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "https://guezelwebdesign.de").trim();
  // Protokol yoksa https ekle, trailing slash temizle
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProto.replace(/\/+$/, "");
}

export function absoluteUrl(input: string) {
  const base = siteUrlBase();
  try {
    // URL ctor lokal/relatif tüm path'leri normalize eder
    return new URL(input || "/", base + "/").toString().replace(/\/+$/, (m) =>
      // base-only olmasın diye kök için tek slash bırak
      m.length > 1 ? "/" : m
    );
  } catch {
    // herhangi bir parse hatasında güvenli fallback
    return `${base}/`;
  }
}

/** ISO veya Date → RFC 1123 (HTTP date) */
export function httpDate(d?: string | Date | null) {
  if (!d) return undefined;
  const date = typeof d === "string" ? new Date(d) : d;
  return isNaN(date.getTime()) ? undefined : date.toUTCString();
}

/** Gereksiz boş/undefined alanları objeden çıkarır */
export function compact<T extends Record<string, any>>(obj: T): T {
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (
      v === undefined ||
      v === null ||
      (Array.isArray(v) && v.length === 0) ||
      (typeof v === "string" && v.trim() === "")
    ) continue;
    out[k] = v;
  }
  return out;
}
