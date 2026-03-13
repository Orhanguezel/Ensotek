// =============================================================
// FILE: src/server/fetch-branding.ts
// Server-only utility — SSR'da branding config'i backend'den çeker
// =============================================================

import { DEFAULT_BRANDING, type AdminBrandingConfig } from '@/config/app-config';

/**
 * Backend API base URL (server-side only).
 * PANEL_API_URL > NEXT_PUBLIC_API_URL > fallback
 */
function getServerApiUrl(): string {
  const panel = (process.env.PANEL_API_URL || '').trim().replace(/\/+$/, '');
  if (panel) return `${panel}/api`;

  const pub = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/+$/, '');
  if (pub) return pub;

  return 'http://127.0.0.1:8186/api';
}

function parseSettingValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (!trimmed) return value;

  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
}

/**
 * SSR'da `ui_admin_config` key'ini public endpoint üzerinden çeker,
 * `branding` alt-objesini döndürür.
 * Not:
 * - Admin panel branding'i bilerek sadece `ui_admin_config` üzerinden okunur.
 * - `site_favicon` / `site_apple_touch_icon` gibi global site media key'leri
 *   birden fazla site tarafından ortak kullanıldığı için burada merge edilmez.
 * Hata durumunda DEFAULT_BRANDING fallback döner.
 */
export async function fetchBrandingConfig(): Promise<AdminBrandingConfig> {
  try {
    const base = getServerApiUrl();
    for (const key of ['kompozit__ui_admin_config', 'ui_admin_config']) {
      const res = await fetch(`${base}/site_settings/${key}`, {
        next: { revalidate: 300 },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const value = parseSettingValue(data?.value) as { branding?: Partial<AdminBrandingConfig> } | null;
      const branding = value?.branding;

      if (!branding?.meta?.title) continue;

      return {
        ...DEFAULT_BRANDING,
        ...branding,
        meta: { ...DEFAULT_BRANDING.meta, ...branding.meta },
      };
    };

    return DEFAULT_BRANDING;
  } catch {
    return DEFAULT_BRANDING;
  }
}
