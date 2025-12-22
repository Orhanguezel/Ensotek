// =============================================================
// FILE: src/integrations/rtk/endpoints/site_settings.endpoints.ts
// Ensotek – Public Site Settings RTK (aligned with BE routes)
//   - GET /site_settings
//   - GET /site_settings/:key
//   - GET /site_settings/app-locales
//   - GET /site_settings/default-locale
// =============================================================

import { baseApi } from '../baseApi';
import type {
  SiteSettingRow,
  SettingValue,
  AppLocaleMeta,
  DefaultLocaleMeta,
} from '@/integrations/types/site_settings.types';

/* ----------------------------- args ----------------------------- */

export type ListSiteSettingsArgs = {
  prefix?: string;
  locale?: string;
  keys?: string[];

  // BE'de var (controller.ts)
  key?: string;
  order?: string;
  limit?: number | string;
  offset?: number | string;
};

export type GetSiteSettingByKeyArgs = {
  key: string;
  locale?: string;
};

/* ----------------------------- helpers ----------------------------- */

// BE value çoğunlukla parse edilmiş geliyor.
// Yine de legacy için JSON-string gelirse parse etmeye çalışalım.
const tryParse = (x: unknown): SettingValue => {
  if (typeof x === 'string') {
    const s = x.trim();

    if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try {
        return JSON.parse(s) as SettingValue;
      } catch {
        /* ignore */
      }
    }

    if (s === 'true') return true;
    if (s === 'false') return false;

    // number string
    if (!Number.isNaN(Number(s)) && s !== '') return Number(s);
  }

  // object/array/boolean/number/null already ok
  return x as SettingValue;
};

function mapRowToSetting(r: unknown): SiteSettingRow | null {
  if (!r || typeof r !== 'object') return null;

  const o = r as any;
  if (!o.key) return null;

  return {
    id: o.id,
    key: String(o.key),
    locale: typeof o.locale === 'string' ? o.locale : undefined,
    value: tryParse(o.value),
    created_at: typeof o.created_at === 'string' ? o.created_at : undefined,
    updated_at: typeof o.updated_at === 'string' ? o.updated_at : undefined,
  };
}

function parseAppLocalesMeta(res: unknown): AppLocaleMeta[] {
  if (!Array.isArray(res)) return [];
  return (res as any[])
    .map((x) => {
      if (!x) return null;
      const code = String(x.code ?? x.value ?? '').trim();
      if (!code) return null;

      const label = typeof x.label === 'string' ? x.label.trim() : undefined;
      const is_default = x.is_default === true;
      const is_active = x.is_active !== false;

      return { code, label, is_default, is_active } as AppLocaleMeta;
    })
    .filter(Boolean) as AppLocaleMeta[];
}

/* ----------------------------- API ----------------------------- */

export const siteSettingsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // GET /site_settings?locale=de&prefix=foo&key_in=a,b
    listSiteSettings: b.query<SiteSettingRow[], ListSiteSettingsArgs | void>({
      query: (arg) => {
        const params: Record<string, string> = {};

        if (arg?.prefix) params.prefix = String(arg.prefix);
        if (arg?.locale) params.locale = String(arg.locale);

        if (arg?.key) params.key = String(arg.key);
        if (arg?.keys?.length) params.key_in = arg.keys.join(',');

        if (arg?.order) params.order = String(arg.order);
        if (arg?.limit !== undefined) params.limit = String(arg.limit);
        if (arg?.offset !== undefined) params.offset = String(arg.offset);

        return {
          url: '/site_settings',
          params: Object.keys(params).length ? params : undefined,
        };
      },

      transformResponse: (res: unknown): SiteSettingRow[] => {
        const arr = Array.isArray(res) ? (res as unknown[]) : [];
        return arr.map(mapRowToSetting).filter(Boolean) as SiteSettingRow[];
      },

      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((s) => ({ type: 'SiteSettings' as const, id: s.key })),
              { type: 'SiteSettings' as const, id: 'LIST' },
            ]
          : [{ type: 'SiteSettings' as const, id: 'LIST' }],

      keepUnusedDataFor: 60,
    }),

    // GET /site_settings/:key?locale=de
    getSiteSettingByKey: b.query<SiteSettingRow | null, GetSiteSettingByKeyArgs>({
      query: ({ key, locale }) => ({
        url: `/site_settings/${encodeURIComponent(key)}`,
        params: locale ? { locale } : undefined,
      }),

      transformResponse: (res: unknown): SiteSettingRow | null => mapRowToSetting(res),

      providesTags: (_r, _e, arg) => [{ type: 'SiteSettings', id: arg.key }],
    }),

    // GET /site_settings/app-locales
    getAppLocalesPublic: b.query<AppLocaleMeta[], void>({
      query: () => ({ url: '/site_settings/app-locales' }),
      transformResponse: (res: unknown) => parseAppLocalesMeta(res),
      providesTags: [{ type: 'SiteSettings', id: 'META:APP_LOCALES' }],
      keepUnusedDataFor: 300,
    }),

    // GET /site_settings/default-locale
    getDefaultLocalePublic: b.query<DefaultLocaleMeta, void>({
      query: () => ({ url: '/site_settings/default-locale' }),
      transformResponse: (res: unknown): DefaultLocaleMeta => {
        if (typeof res === 'string') return res.trim().toLowerCase() || null;
        if (res == null) return null;

        // toleranslı: { value: "tr" }
        if (typeof res === 'object' && (res as any).value) {
          const v = (res as any).value;
          if (typeof v === 'string') return v.trim().toLowerCase() || null;
        }

        return null;
      },
      providesTags: [{ type: 'SiteSettings', id: 'META:DEFAULT_LOCALE' }],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: true,
});

export const {
  useListSiteSettingsQuery,
  useGetSiteSettingByKeyQuery,
  useGetAppLocalesPublicQuery,
  useGetDefaultLocalePublicQuery,
} = siteSettingsApi;
