import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type { ISetting } from "@/lib/settings/types";

/** İç içe yapılardan sadece İLGİLİ dilin metnini, fallback yapmadan çıkarır */
export function readLocalizedLabel(value: any, locale: SupportedLocale): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();

  const cands = [
    value?.[locale],
    value?.label?.[locale],
    value?.title?.label?.[locale],
    value?.description?.label?.[locale],
  ];
  for (const c of cands) if (typeof c === "string" && c.trim()) return c.trim();

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

async function fetchSettingsList(locale: SupportedLocale): Promise<ISetting[]> {
  const base = await getServerApiBaseAbsolute(); // .../api
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);
  const url = `${base.replace(/\/+$/, "")}/settings?hl=${encodeURIComponent(l)}`;

  const r = await fetch(url, {
    headers: buildCommonHeaders(l, tenant),
    // İstersen cache: "force-cache", next: { revalidate: 300 } kullan
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`settings ${r.status}`);
  const j = await r.json();
  return Array.isArray(j) ? j : (j?.data ?? []);
}

/** Ham value’yu döndürür (array/obje/string olabilir) */
export async function getSettingValue(locale: SupportedLocale, key: string): Promise<any> {
  const list = await fetchSettingsList(locale);
  return list.find(s => s.key === key)?.value;
}

/** Tek bir label/string gerekirken kullan (ör. başlık) */
export async function getSettingLabel(locale: SupportedLocale, key: string): Promise<string> {
  const val = await getSettingValue(locale, key);
  return readLocalizedLabel(val, locale);
}

/** SEO için iki anahtarı birden oku (fallback sadece parametre ile) */
export async function getSeoFromSettings(
  locale: SupportedLocale,
  keys: { titleKey: string; descKey: string },
  fallback: { title: string; description: string }
) {
  const list = await fetchSettingsList(locale);
  const tVal = list.find(s => s.key === keys.titleKey)?.value;
  const dVal = list.find(s => s.key === keys.descKey)?.value;
  const title = readLocalizedLabel(tVal, locale) || fallback.title;
  const description = readLocalizedLabel(dVal, locale) || fallback.description;
  return { title, description };
}
