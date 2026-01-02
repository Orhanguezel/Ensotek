// =============================================================
// FILE: src/integrations/rtk/endpoints/references.endpoints.ts
// Ensotek – References (public API) – LOCALE AWARE (FINAL)
// =============================================================

import { baseApi } from '../baseApi';
import type {
  ReferenceDto,
  ReferenceImageDto,
  ReferenceListQueryParams,
  ReferenceListResponse,
} from '@/integrations/types/references.types';

/* ---------------- Helpers ---------------- */

const serializeListQuery = (q?: ReferenceListQueryParams): Record<string, any> => {
  if (!q) return {};
  const params: Record<string, any> = {};

  if (q.order) params.order = q.order;
  if (q.sort) params.sort = q.sort;
  if (q.orderDir) params.orderDir = q.orderDir;
  if (typeof q.limit === 'number') params.limit = q.limit;
  if (typeof q.offset === 'number') params.offset = q.offset;

  // public endpoint'te is_published backend tarafından zorlanıyor olabilir;
  // gönderilirse de sorun çıkarmayacak şekilde bırakıyoruz.
  if (typeof q.is_published !== 'undefined') params.is_published = q.is_published;
  if (typeof q.is_featured !== 'undefined') params.is_featured = q.is_featured;

  if (q.q) params.q = q.q;
  if (q.slug) params.slug = q.slug;
  if (q.select) params.select = q.select;

  if (q.category_id) params.category_id = q.category_id;
  if (q.sub_category_id) params.sub_category_id = q.sub_category_id;

  if (q.module_key) params.module_key = q.module_key;
  if (typeof q.has_website !== 'undefined') params.has_website = q.has_website;

  if (q.locale) params.locale = q.locale;

  return params;
};

/* ---------------- Types ---------------- */

// Backend public GET endpoints return: { ...row, gallery }
export type ReferenceWithGalleryDto = ReferenceDto & { gallery?: ReferenceImageDto[] };

/* ---------------- API ---------------- */

export const referencesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* -------------------- LIST (public) -------------------- */
    listReferences: build.query<ReferenceListResponse, ReferenceListQueryParams | void>({
      query: (params?: ReferenceListQueryParams) => ({
        url: '/references',
        method: 'GET',
        params: serializeListQuery(params),
      }),
      transformResponse: (response: ReferenceDto[], meta): ReferenceListResponse => {
        const totalHeader = (meta as any)?.response?.headers?.get('x-total-count') ?? '0';
        const total = Number(totalHeader) || (Array.isArray(response) ? response.length : 0);

        return { items: Array.isArray(response) ? response : [], total };
      },
      providesTags: (result) =>
        result?.items?.length
          ? [
              { type: 'References', id: 'LIST' },
              ...result.items.map((r) => ({ type: 'References' as const, id: r.id })),
            ]
          : [{ type: 'References', id: 'LIST' }],
    }),

    /* -------------------- GET BY ID (public) --------------- */
    getReferenceById: build.query<
      ReferenceWithGalleryDto,
      { id: string; locale?: string } | string
    >({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg.id;
        const locale = typeof arg === 'object' && arg !== null ? arg.locale : undefined;

        return {
          url: `/references/${encodeURIComponent(id)}`,
          method: 'GET',
          params: locale ? { locale } : undefined,
        };
      },
      providesTags: (_res, _err, arg) => {
        const id = typeof arg === 'string' ? arg : arg.id;
        return [{ type: 'References', id }];
      },
    }),

    /* -------------------- GET BY SLUG (public) ------------- */
    getReferenceBySlug: build.query<
      ReferenceWithGalleryDto,
      { slug: string; locale?: string } | string
    >({
      query: (arg) => {
        const slug = typeof arg === 'string' ? arg : arg.slug;
        const locale = typeof arg === 'object' && arg !== null ? arg.locale : undefined;

        return {
          url: `/references/by-slug/${encodeURIComponent(slug)}`,
          method: 'GET',
          params: locale ? { locale } : undefined,
        };
      },
      providesTags: (res) => (res?.id ? [{ type: 'References', id: res.id }] : []),
    }),

    // ⚠️ NOT: Backend'de public /references/:id/images route'u yoksa
    // bu endpoint'i EKLEMEYİN. Aksi halde 404 üretir.
    // Eğer eklediysen, burayı geri açabiliriz.
  }),

  overrideExisting: false,
});

export const { useListReferencesQuery, useGetReferenceByIdQuery, useGetReferenceBySlugQuery } =
  referencesApi;
