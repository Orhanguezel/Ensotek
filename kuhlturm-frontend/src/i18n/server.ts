import 'server-only';

import { getLocaleSettings, API_BASE_URL } from './locale-settings';

export type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };

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
    const url = `${API_BASE_URL}/site_settings/${encodeURIComponent(key)}?locale=${encodeURIComponent(locale)}`;
    const res = await fetch(url, {
      next: options?.revalidate != null ? { revalidate: options.revalidate } : undefined,
      headers: {
        'x-locale': locale,
        'accept-language': locale,
      },
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
    const res = await fetch(url, { 
      next: { revalidate: 300 },
      headers: {
        'x-locale': locale,
        'accept-language': locale,
      },
    });
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

/* ------------------------------------------------------------------ */
/*  Custom page type + list fetcher                                     */
/* ------------------------------------------------------------------ */

export interface CustomPage {
  id: string;
  module_key: string;
  is_published: boolean;
  featured: boolean;
  featured_image: string | null;
  image_url: string | null;
  images: string[] | null;
  title: string;
  slug: string;
  content: string | null;
  summary: string | null;
  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchCustomPagesByModuleKey(
  moduleKey: string,
  locale: string,
  limit = 20,
): Promise<CustomPage[]> {
  try {
    const url =
      `${API_BASE_URL}/custom_pages` +
      `?module_key=${encodeURIComponent(moduleKey)}` +
      `&language=${encodeURIComponent(locale)}` +
      `&is_published=1` +
      `&limit=${limit}`;
    const res = await fetch(url, { 
      next: { revalidate: 300 },
      headers: {
        'x-locale': locale,
        'accept-language': locale,
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}

/** Parse content field — may be raw HTML or JSON-stringified HTML */
/**
 * Parse content field — handles multiple formats from the rich-text editor:
 *   1. Raw HTML string              → "<p>...</p>"
 *   2. JSON-stringified HTML string → '"<p>...</p>"'
 *   3. JSON object with html key    → '{"html":"<p>...</p>"}'
 *   4. JSON object with content key → '{"content":"<p>...</p>"}'
 */
export function parseCustomPageContent(content: string | null): string {
  if (!content) return '';
  const s = content.trim();

  if (
    (s.startsWith('{') && s.endsWith('}')) ||
    (s.startsWith('"') && s.endsWith('"'))
  ) {
    try {
      const parsed: unknown = JSON.parse(s);
      if (typeof parsed === 'string') return parsed;
      if (parsed && typeof parsed === 'object') {
        const obj = parsed as Record<string, unknown>;
        if (typeof obj.html === 'string') return obj.html;
        if (typeof obj.content === 'string') return obj.content;
      }
    } catch {
      /* fall through — return raw string */
    }
  }

  return s;
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

export async function fetchSliders(locale?: string): Promise<Record<string, unknown>[]> {
  try {
    const url = `${API_BASE_URL}/sliders`;
    const headers: Record<string, string> = {};
    if (locale) {
      headers['x-locale'] = locale;
      headers['accept-language'] = locale;
    }
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}
