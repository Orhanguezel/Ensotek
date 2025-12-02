// SSR-side settings helper'ları (SEO, başlık vs. için)

// ✅ Yeni importlar
import { BASE_URL } from "@/integrations/rtk/constants";
import { normalizeLocale } from "@/i18n/config";
import type { SupportedLocale } from "@/types/common";

// RTK tarafındaki SiteSetting yapısına benzer basit tip
type SettingDoc = { key: string; value: any };

/** İç içe yapılardan sadece İLGİLİ dilin metnini, fallback yapmadan çıkarır */
export function readLocalizedLabel(
  value: any,
  locale: SupportedLocale,
): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();

  const cands = [
    value?.[locale],
    value?.label?.[locale],
    value?.title?.label?.[locale],
    value?.description?.label?.[locale],
  ];
  for (const c of cands) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }

  if (typeof value === "object") {
    if (value.label && typeof value.label === "object") {
      const c = value.label?.[locale];
      if (typeof c === "string" && c.trim()) return c.trim();
    }
    for (const k of Object.keys(value)) {
      const out = readLocalizedLabel(value[k], locale);
      if (out) return out;
    }
  }
  return "";
}

/**
 * site_settings listesini çeker.
 * BE: GET /site_settings?locale=tr
 */
async function fetchSettingsList(
  locale: SupportedLocale,
): Promise<SettingDoc[]> {
  const base = BASE_URL.replace(/\/+$/, ""); // örn: "/api" veya "https://ensotek.de/api"
  const l = normalizeLocale(locale);
  const url = `${base}/site_settings?locale=${encodeURIComponent(l)}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": l,
    },
    // SEO ayarları sık değişmez; istersen "force-cache" yapabilirsin
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`site_settings ${res.status}`);
  const j = await res.json();

  // RTK'ye paralel: API ya [] ya da {data: []} dönebilir
  return Array.isArray(j) ? (j as SettingDoc[]) : (j?.data ?? []);
}

/** Ham value’yu döndürür (array/obje/string olabilir) */
export async function getSettingValue(
  locale: SupportedLocale,
  key: string,
): Promise<any> {
  const list = await fetchSettingsList(locale);
  return list.find((s) => s.key === key)?.value;
}

/** Tek bir label/string gerekirken kullan (ör. başlık) */
export async function getSettingLabel(
  locale: SupportedLocale,
  key: string,
): Promise<string> {
  const val = await getSettingValue(locale, key);
  return readLocalizedLabel(val, locale);
}

/** SEO için iki anahtarı birden oku (fallback sadece parametre ile) */
export async function getSeoFromSettings(
  locale: SupportedLocale,
  keys: { titleKey: string; descKey: string },
  fallback: { title: string; description: string },
) {
  const list = await fetchSettingsList(locale);
  const tVal = list.find((s) => s.key === keys.titleKey)?.value;
  const dVal = list.find((s) => s.key === keys.descKey)?.value;

  const title = readLocalizedLabel(tVal, locale) || fallback.title;
  const description =
    readLocalizedLabel(dVal, locale) || fallback.description;

  return { title, description };
}
