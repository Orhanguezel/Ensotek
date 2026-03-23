import { API_BASE_URL } from './utils';

export interface FetchOptions {
  params?: Record<string, any>;
  cache?: RequestCache;
  revalidate?: number;
  headers?: Record<string, string>;
}

/**
 * Robust fetcher that ensures locale/language is sent both in query and headers.
 * This handles inconsistencies in some backend versions.
 */
export async function apiFetchWithLocale<T>(
  path: string,
  locale: string,
  options: FetchOptions = {}
): Promise<T | null> {
  try {
    const url = new URL(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);
    
    // Always include locale/language in query
    url.searchParams.set('locale', locale);
    url.searchParams.set('language', locale);
    
    if (options.params) {
      Object.entries(options.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          url.searchParams.set(k, String(v));
        }
      });
    }

    const fetchOptions: RequestInit = {
      cache: options.cache || (options.revalidate ? undefined : 'no-store'),
      next: options.revalidate ? { revalidate: options.revalidate } : undefined,
      headers: {
        'Accept': 'application/json',
        'x-locale': locale,
        'accept-language': locale,
        ...options.headers,
      },
    };

    const res = await fetch(url.toString(), fetchOptions);

    if (!res.ok) {
      console.warn(`[API] ${res.status} ${res.statusText} - ${url.toString()}`);
      return null;
    }

    const json = await res.json();
    // Support both direct array/object and { data: ... } wrapped responses
    return (json?.data ?? json) as T;
  } catch (error) {
    console.error(`[API ERROR] ${path}:`, error);
    return null;
  }
}

/**
 * Wrapped core services that ensure locale headers are sent.
 */
export async function getProductsWithLocale(locale: string, params: Record<string, any> = {}) {
  return apiFetchWithLocale<any[]>('/products', locale, { params });
}

export async function getCustomPagesWithLocale(locale: string, params: Record<string, any> = {}) {
  return apiFetchWithLocale<any[]>('/custom_pages', locale, { params });
}

export async function getCategoriesWithLocale(locale: string, params: Record<string, any> = {}) {
  return apiFetchWithLocale<any[]>('/categories', locale, { params });
}

export async function getProductBySlugWithLocale(slug: string, locale: string) {
  return apiFetchWithLocale<any>(`/products/by-slug/${slug}`, locale);
}

export async function getCustomPageBySlugWithLocale(slug: string, locale: string) {
  return apiFetchWithLocale<any>(`/custom_pages/by-slug/${slug}`, locale);
}

export async function getServiceBySlugWithLocale(slug: string, locale: string) {
  return apiFetchWithLocale<any>(`/services/by-slug/${slug}`, locale);
}

export async function getServicesWithLocale(locale: string, params: Record<string, any> = {}) {
  return apiFetchWithLocale<any[]>('/services', locale, { params });
}


