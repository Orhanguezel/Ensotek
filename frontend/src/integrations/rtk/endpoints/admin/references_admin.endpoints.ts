// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/references_admin.endpoints.ts
// Ensotek – References (admin API) – LOCALE AWARE (FINAL)
// =============================================================

import { baseApi } from '../../baseApi';
import type {
  ReferenceDto,
  ReferenceImageDto,
  ReferenceListQueryParams,
  ReferenceListResponse,
  ReferenceUpsertPayload,
  ReferenceImageUpsertPayload,
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

  if (typeof q.is_published !== 'undefined') params.is_published = q.is_published;
  if (typeof q.is_featured !== 'undefined') params.is_featured = q.is_featured;

  if (q.q) params.q = q.q;
  if (q.slug) params.slug = q.slug;
  if (q.select) params.select = q.select;

  if (q.category_id) params.category_id = q.category_id;
  if (q.sub_category_id) params.sub_category_id = q.sub_category_id;

  if (q.module_key) params.module_key = q.module_key;
  if (typeof q.has_website !== 'undefined') params.has_website = q.has_website;

  // ✅ locale param (dynamic server-side validation handled by backend)
  if (q.locale) params.locale = q.locale;

  return params;
};

const withResolvedLocale = (r: ReferenceDto): ReferenceDto => ({
  ...r,
  // normalize for FE usage
  locale: (r.locale_resolved ?? r.locale ?? null) as any,
});

/* ---------------- API ---------------- */

export const referencesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* -------------------- LIST (admin) -------------------- */
    listReferencesAdmin: build.query<ReferenceListResponse, ReferenceListQueryParams | void>({
      query: (params?: ReferenceListQueryParams) => ({
        url: '/admin/references',
        method: 'GET',
        params: serializeListQuery(params),
      }),
      transformResponse: (response: ReferenceDto[], meta): ReferenceListResponse => {
        const totalHeader = meta?.response?.headers?.get('x-total-count') ?? '0';
        const total = Number(totalHeader) || 0;

        const items = Array.isArray(response) ? response.map(withResolvedLocale) : [];
        return { items, total };
      },
      providesTags: (result) =>
        result?.items?.length
          ? [
              { type: 'AdminReferences', id: 'LIST' },
              ...result.items.map((r) => ({ type: 'AdminReferences' as const, id: r.id })),
            ]
          : [{ type: 'AdminReferences', id: 'LIST' }],
    }),

    /* -------------------- GET BY ID (admin) ---------------- */
    getReferenceAdmin: build.query<
      ReferenceDto,
      { id: string | number; locale?: string } | string | number
    >({
      query: (arg) => {
        const id = typeof arg === 'string' || typeof arg === 'number' ? arg : arg.id;
        const locale = typeof arg === 'object' && arg !== null ? arg.locale : undefined;

        return {
          url: `/admin/references/${encodeURIComponent(String(id))}`,
          method: 'GET',
          params: locale ? { locale } : undefined,
        };
      },
      transformResponse: (response: ReferenceDto) => withResolvedLocale(response),
      providesTags: (_res, _err, arg) => {
        const id =
          typeof arg === 'string' || typeof arg === 'number' ? String(arg) : String(arg.id);
        return [{ type: 'AdminReferences', id }];
      },
    }),

    /* -------------------- GET BY SLUG (admin) -------------- */
    getReferenceBySlugAdmin: build.query<ReferenceDto, { slug: string; locale?: string } | string>({
      query: (arg) => {
        const slug = typeof arg === 'string' ? arg : arg.slug;
        const locale = typeof arg === 'object' && arg !== null ? arg.locale : undefined;

        return {
          url: `/admin/references/by-slug/${encodeURIComponent(slug)}`,
          method: 'GET',
          params: locale ? { locale } : undefined,
        };
      },
      transformResponse: (response: ReferenceDto) => withResolvedLocale(response),
      providesTags: (res) => (res?.id ? [{ type: 'AdminReferences', id: res.id }] : []),
    }),

    /* -------------------- CREATE (admin) ------------------- */
    createReferenceAdmin: build.mutation<ReferenceDto, ReferenceUpsertPayload>({
      query: (payload) => ({
        url: '/admin/references',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'AdminReferences', id: 'LIST' }],
    }),

    /* -------------------- UPDATE (admin) ------------------- */
    updateReferenceAdmin: build.mutation<
      ReferenceDto,
      { id: string; patch: ReferenceUpsertPayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/references/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminReferences', id: arg.id },
        { type: 'AdminReferences', id: 'LIST' },
      ],
    }),

    /* -------------------- DELETE (admin) ------------------- */
    deleteReferenceAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/references/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'AdminReferences', id },
        { type: 'AdminReferences', id: 'LIST' },
      ],
    }),

    /* -------------------- GALLERY LIST (admin) ------------- */
    listReferenceImagesAdmin: build.query<ReferenceImageDto[], string>({
      query: (referenceId) => ({
        url: `/admin/references/${encodeURIComponent(referenceId)}/images`,
        method: 'GET',
      }),
      providesTags: (_res, _err, referenceId) => [
        { type: 'AdminReferenceImages', id: referenceId },
      ],
    }),

    /* -------------------- GALLERY CREATE (admin) ----------- */
    createReferenceImageAdmin: build.mutation<
      ReferenceImageDto[],
      { referenceId: string; payload: ReferenceImageUpsertPayload }
    >({
      query: ({ referenceId, payload }) => ({
        url: `/admin/references/${encodeURIComponent(referenceId)}/images`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'AdminReferenceImages', id: arg.referenceId }],
    }),

    /* -------------------- GALLERY UPDATE (admin) ----------- */
    updateReferenceImageAdmin: build.mutation<
      ReferenceImageDto[],
      { referenceId: string; imageId: string; patch: ReferenceImageUpsertPayload }
    >({
      query: ({ referenceId, imageId, patch }) => ({
        url: `/admin/references/${encodeURIComponent(referenceId)}/images/${encodeURIComponent(
          imageId,
        )}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'AdminReferenceImages', id: arg.referenceId }],
    }),

    /* -------------------- GALLERY DELETE (admin) ----------- */
    deleteReferenceImageAdmin: build.mutation<void, { referenceId: string; imageId: string }>({
      query: ({ referenceId, imageId }) => ({
        url: `/admin/references/${encodeURIComponent(referenceId)}/images/${encodeURIComponent(
          imageId,
        )}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'AdminReferenceImages', id: arg.referenceId }],
    }),
  }),

  overrideExisting: false,
});

export const {
  useListReferencesAdminQuery,
  useGetReferenceAdminQuery,
  useLazyGetReferenceAdminQuery,
  useGetReferenceBySlugAdminQuery,
  useCreateReferenceAdminMutation,
  useUpdateReferenceAdminMutation,
  useDeleteReferenceAdminMutation,
  useListReferenceImagesAdminQuery,
  useCreateReferenceImageAdminMutation,
  useUpdateReferenceImageAdminMutation,
  useDeleteReferenceImageAdminMutation,
} = referencesAdminApi;
