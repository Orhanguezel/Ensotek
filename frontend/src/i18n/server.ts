import 'server-only';

import { getRuntimeLocaleSettings, API_BASE_URL } from './locale-settings';
import { FALLBACK_LOCALE } from './locales';

export type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };

type SettingRow = { value: JsonLike } | null;

export async function fetchActiveLocales(): Promise<string[]> {
  const { activeLocales } = await getRuntimeLocaleSettings();
  return activeLocales;
}

export async function getDefaultLocale(): Promise<string> {
  const { defaultLocale } = await getRuntimeLocaleSettings();
  return defaultLocale;
}

export async function fetchSetting(
  key: string,
  locale: string,
  options?: { revalidate?: number },
): Promise<SettingRow> {
  try {
    const url = `${API_BASE_URL}/site_settings/${encodeURIComponent(key)}?locale=${encodeURIComponent(locale)}`;
    const res = await fetch(url, {
      next: options?.revalidate != null ? { revalidate: options.revalidate } : undefined,
    });
    if (!res.ok) return null;
    const data = await res.json();

    // Backend may return { value: ... } directly or the full row
    const value = data?.value ?? data?.data?.value ?? null;
    if (value == null) return null;

    // Try parsing JSON strings
    if (typeof value === 'string') {
      try {
        return { value: JSON.parse(value) };
      } catch {
        return { value };
      }
    }

    return { value };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Server-side content fetchers (for generateMetadata in pages)       */
/* ------------------------------------------------------------------ */

type ContentMeta = {
  title?: string;
  name?: string;
  slug?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  summary?: string | null;
  description?: string | null;
} | null;

async function fetchContent(path: string, locale: string): Promise<ContentMeta> {
  try {
    const url = `${API_BASE_URL}/${path}?locale=${encodeURIComponent(locale)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? data ?? null;
  } catch {
    return null;
  }
}

export async function fetchCustomPage(slug: string, locale: string): Promise<ContentMeta> {
  return fetchContent(`custom_pages/by-slug/${encodeURIComponent(slug)}`, locale);
}

export async function fetchServiceBySlug(slug: string, locale: string): Promise<ContentMeta> {
  return fetchContent(`services/by-slug/${encodeURIComponent(slug)}`, locale);
}

export async function fetchProductBySlug(slug: string, locale: string): Promise<ContentMeta> {
  return fetchContent(`products/by-slug/${encodeURIComponent(slug)}`, locale);
}

export async function fetchLibraryBySlug(slug: string, locale: string): Promise<ContentMeta> {
  return fetchContent(`library/by-slug/${encodeURIComponent(slug)}`, locale);
}
