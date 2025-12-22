// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/custom_pages_admin.endpoints.ts
// Ensotek – Admin Custom Pages RTK Endpoints
// Base URL: /api/admin (baseApi üzerinden)
// Backend: src/modules/customPages/admin.routes.ts
// =============================================================

import { baseApi } from '../../baseApi';
import type {
  ApiCustomPage,
  CustomPageDto,
  CustomPageListAdminQueryParams,
  CustomPageCreatePayload,
  CustomPageUpdatePayload,
} from '@/integrations/types/custom_pages.types';
import { mapApiCustomPageToDto } from '@/integrations/types/custom_pages.types';

/**
 * Query paramlarından undefined / boş stringleri temizlemek için
 */
const cleanParams = (
  params?: Record<string, unknown>,
): Record<string, string | number | boolean> | undefined => {
  if (!params) return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '' || (typeof v === 'number' && Number.isNaN(v))) {
      continue;
    }
    if (typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string') {
      out[k] = v;
    } else {
      out[k] = String(v);
    }
  }
  return Object.keys(out).length ? out : undefined;
};

/**
 * x-total-count header'ından total çekmek için helper
 */
const getTotalFromHeaders = (
  responseHeaders: Headers | undefined,
  fallbackLength: number,
): number => {
  const headerValue =
    responseHeaders?.get('x-total-count') ?? responseHeaders?.get('X-Total-Count');
  if (!headerValue) return fallbackLength;
  const n = Number(headerValue);
  return Number.isFinite(n) && n >= 0 ? n : fallbackLength;
};

/**
 * Response bazen array, bazen {items: []} gelebilir – normalize et
 */
const normalizeList = (raw: unknown): ApiCustomPage[] => {
  if (Array.isArray(raw)) return raw as ApiCustomPage[];
  const anyRaw: any = raw as any;
  if (anyRaw && Array.isArray(anyRaw.items)) return anyRaw.items as ApiCustomPage[];
  return [];
};

export const customPagesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* --------------------------------------------------------- */
    /* LIST (ADMIN)                                              */
    /* GET /api/admin/custom_pages                               */
    /* --------------------------------------------------------- */
    listCustomPagesAdmin: build.query<
      { items: CustomPageDto[]; total: number },
      CustomPageListAdminQueryParams | void
    >({
      query: (params) => ({
        url: '/admin/custom_pages',
        method: 'GET',
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      transformResponse: (response: unknown, meta) => {
        const rows = normalizeList(response);
        const total = getTotalFromHeaders(meta?.response?.headers, rows.length);
        return {
          items: rows.map((row) => mapApiCustomPageToDto(row)),
          total,
        };
      },
      providesTags: (result) =>
        result?.items?.length
          ? [
              ...result.items.map((p) => ({ type: 'CustomPage' as const, id: p.id })),
              { type: 'CustomPage' as const, id: 'ADMIN_LIST' },
            ]
          : [{ type: 'CustomPage' as const, id: 'ADMIN_LIST' }],
    }),

    /* --------------------------------------------------------- */
    /* GET by id – /api/admin/custom_pages/:id                   */
    /* FIX: locale query param gönder                            */
    /* --------------------------------------------------------- */
    getCustomPageAdmin: build.query<CustomPageDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/custom_pages/${encodeURIComponent(id)}`,
        method: 'GET',
        // ✅ FIX: locale'i backend'e ilet
        params: cleanParams(locale ? { locale } : undefined),
      }),
      transformResponse: (response: ApiCustomPage) => mapApiCustomPageToDto(response),
      providesTags: (_result, _error, { id }) => [{ type: 'CustomPage' as const, id }],
    }),

    /* --------------------------------------------------------- */
    /* GET by slug – /api/admin/custom_pages/by-slug/:slug       */
    /* FIX: locale query param gönder                            */
    /* --------------------------------------------------------- */
    getCustomPageBySlugAdmin: build.query<CustomPageDto, { slug: string; locale?: string }>({
      query: ({ slug, locale }) => ({
        url: `/admin/custom_pages/by-slug/${encodeURIComponent(slug)}`,
        method: 'GET',
        // ✅ FIX: locale'i backend'e ilet
        params: cleanParams(locale ? { locale } : undefined),
      }),
      transformResponse: (response: ApiCustomPage) => mapApiCustomPageToDto(response),
      providesTags: (_result, _error, { slug }) => [{ type: 'CustomPageSlug' as const, id: slug }],
    }),

    /* --------------------------------------------------------- */
    /* CREATE – POST /api/admin/custom_pages                     */
    /* --------------------------------------------------------- */
    createCustomPageAdmin: build.mutation<CustomPageDto, CustomPageCreatePayload>({
      query: (body) => ({
        url: '/admin/custom_pages',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiCustomPage) => mapApiCustomPageToDto(response),
      invalidatesTags: [{ type: 'CustomPage' as const, id: 'ADMIN_LIST' }],
    }),

    /* --------------------------------------------------------- */
    /* UPDATE (partial) – PATCH /api/admin/custom_pages/:id      */
    /* --------------------------------------------------------- */
    updateCustomPageAdmin: build.mutation<
      CustomPageDto,
      { id: string; patch: CustomPageUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/custom_pages/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      transformResponse: (response: ApiCustomPage) => mapApiCustomPageToDto(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CustomPage' as const, id },
        { type: 'CustomPage' as const, id: 'ADMIN_LIST' },
      ],
    }),

    /* --------------------------------------------------------- */
    /* DELETE – DELETE /api/admin/custom_pages/:id               */
    /* --------------------------------------------------------- */
    deleteCustomPageAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/custom_pages/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'CustomPage' as const, id },
        { type: 'CustomPage' as const, id: 'ADMIN_LIST' },
      ],
    }),

    /* --------------------------------------------------------- */
    /* REORDER – POST /api/admin/custom_pages/reorder            */
    /* Body: { items: [{id, display_order}, ...] }               */
    /* Backend 204 dönebilir                                     */
    /* --------------------------------------------------------- */
    reorderCustomPagesAdmin: build.mutation<
      { ok: boolean },
      { items: { id: string; display_order: number }[] }
    >({
      query: (payload) => ({
        url: '/admin/custom_pages/reorder',
        method: 'POST',
        body: payload,
      }),
      transformResponse: () => ({ ok: true }),
      invalidatesTags: [{ type: 'CustomPage' as const, id: 'ADMIN_LIST' }],
    }),
  }),

  overrideExisting: false,
});

export const {
  useListCustomPagesAdminQuery,
  useLazyListCustomPagesAdminQuery,
  useGetCustomPageAdminQuery,
  useLazyGetCustomPageAdminQuery,
  useGetCustomPageBySlugAdminQuery,
  useLazyGetCustomPageBySlugAdminQuery,
  useCreateCustomPageAdminMutation,
  useUpdateCustomPageAdminMutation,
  useDeleteCustomPageAdminMutation,
  useReorderCustomPagesAdminMutation,
} = customPagesAdminApi;
