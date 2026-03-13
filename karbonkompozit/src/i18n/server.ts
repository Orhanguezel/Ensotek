import 'server-only';
import { getLocaleSettings, API_BASE_URL } from './locale-settings';

type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };
type SettingRow = { value: JsonLike } | null;

export async function fetchActiveLocales(): Promise<string[]> {
  const { activeLocales } = await getLocaleSettings();
  return activeLocales;
}

export async function getDefaultLocale(): Promise<string> {
  const { defaultLocale } = await getLocaleSettings();
  return defaultLocale;
}

export async function fetchSetting(
  key: string,
  locale: string,
  options?: { revalidate?: number },
): Promise<SettingRow> {
  try {
    const url = `${API_BASE_URL}/site_settings/${encodeURIComponent(key)}?locale=${encodeURIComponent(locale)}&prefix=kompozit__`;
    const res = await fetch(url, {
      next: { revalidate: options?.revalidate ?? 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function fetchSliders(locale?: string): Promise<Record<string, unknown>[]> {
  try {
    const params = new URLSearchParams();
    if (locale) params.set('locale', locale);
    params.set('is_active', '1');
    const res = await fetch(`${API_BASE_URL}/sliders?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchMenuItems(locale: string): Promise<Record<string, unknown>[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/menu-items?locale=${encodeURIComponent(locale)}&is_active=1&site_id=kompozit`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchFooterSections(locale: string): Promise<Record<string, unknown>[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/footer-sections?locale=${encodeURIComponent(locale)}&is_active=1&site_id=kompozit`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}
