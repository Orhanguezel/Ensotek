// =============================================================
// FILE: src/integrations/endpoints/admin/gallery_admin.endpoints.ts
// Ensotek – Gallery (admin API) – LOCALE AWARE
// =============================================================

import { baseApi } from '@/integrations/baseApi';
import type {
  GalleryDto,
  GalleryImageDto,
  GalleryListQueryParams,
  GalleryListResponse,
  GalleryUpsertPayload,
  GalleryImageUpsertPayload,
} from '@/integrations/shared';
import { serializeGalleryListQuery, withResolvedGalleryLocale } from '@/integrations/shared';

/* ---------------- API ---------------- */

export const galleryAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* -------------------- LIST (admin) -------------------- */
    listGalleriesAdmin: build.query<GalleryListResponse, GalleryListQueryParams | void>({
      query: (params?: GalleryListQueryParams) => ({
        url: '/admin/galleries',
        method: 'GET',
        params: serializeGalleryListQuery(params),
      }),
      transformResponse: (response: GalleryDto[], meta): GalleryListResponse => {
        const totalHeader = meta?.response?.headers?.get('x-total-count') ?? '0';
        const total = Number(totalHeader) || 0;
        const items = Array.isArray(response) ? response.map(withResolvedGalleryLocale) : [];
        return { items, total };
      },
      providesTags: (result) =>
        result?.items?.length
          ? [
              { type: 'AdminGalleries', id: 'LIST' },
              ...result.items.map((r) => ({ type: 'AdminGalleries' as const, id: r.id })),
            ]
          : [{ type: 'AdminGalleries', id: 'LIST' }],
    }),

    /* -------------------- GET BY ID (admin) ---------------- */
    getGalleryAdmin: build.query<
      GalleryDto,
      { id: string | number; locale?: string } | string | number
    >({
      query: (arg) => {
        const id = typeof arg === 'string' || typeof arg === 'number' ? arg : arg.id;
        const locale = typeof arg === 'object' && arg !== null ? arg.locale : undefined;
        return {
          url: `/admin/galleries/${encodeURIComponent(String(id))}`,
          method: 'GET',
          params: locale ? { locale } : undefined,
        };
      },
      transformResponse: (response: GalleryDto) => withResolvedGalleryLocale(response),
      providesTags: (_res, _err, arg) => {
        const id =
          typeof arg === 'string' || typeof arg === 'number' ? String(arg) : String(arg.id);
        return [{ type: 'AdminGalleries', id }];
      },
    }),

    /* -------------------- CREATE (admin) ------------------- */
    createGalleryAdmin: build.mutation<GalleryDto, GalleryUpsertPayload>({
      query: (payload) => ({
        url: '/admin/galleries',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'AdminGalleries', id: 'LIST' }],
    }),

    /* -------------------- UPDATE (admin) ------------------- */
    updateGalleryAdmin: build.mutation<
      GalleryDto,
      { id: string; patch: GalleryUpsertPayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/galleries/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminGalleries', id: arg.id },
        { type: 'AdminGalleries', id: 'LIST' },
      ],
    }),

    /* -------------------- DELETE (admin) ------------------- */
    deleteGalleryAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/galleries/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'AdminGalleries', id },
        { type: 'AdminGalleries', id: 'LIST' },
      ],
    }),

    /* -------------------- REORDER (admin) ------------------ */
    reorderGalleriesAdmin: build.mutation<void, { ids: string[] }>({
      query: (body) => ({
        url: '/admin/galleries/reorder',
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'AdminGalleries', id: 'LIST' }],
    }),

    /* -------------------- IMAGES LIST (admin) -------------- */
    listGalleryImagesAdmin: build.query<GalleryImageDto[], { galleryId: string; locale?: string }>({
      query: ({ galleryId, locale }) => ({
        url: `/admin/galleries/${encodeURIComponent(galleryId)}/images`,
        method: 'GET',
        params: locale ? { locale } : undefined,
      }),
      providesTags: (_res, _err, arg) => [
        { type: 'AdminGalleryImages', id: arg.galleryId },
      ],
    }),

    /* -------------------- IMAGE CREATE (admin) ------------- */
    createGalleryImageAdmin: build.mutation<
      GalleryImageDto[],
      { galleryId: string; payload: GalleryImageUpsertPayload }
    >({
      query: ({ galleryId, payload }) => ({
        url: `/admin/galleries/${encodeURIComponent(galleryId)}/images`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminGalleryImages', id: arg.galleryId },
      ],
    }),

    /* -------------------- IMAGE BULK CREATE (admin) -------- */
    bulkCreateGalleryImagesAdmin: build.mutation<
      GalleryImageDto[],
      { galleryId: string; payload: { images: GalleryImageUpsertPayload[] } }
    >({
      query: ({ galleryId, payload }) => ({
        url: `/admin/galleries/${encodeURIComponent(galleryId)}/images/bulk`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminGalleryImages', id: arg.galleryId },
      ],
    }),

    /* -------------------- IMAGE UPDATE (admin) ------------- */
    updateGalleryImageAdmin: build.mutation<
      GalleryImageDto[],
      { galleryId: string; imageId: string; patch: GalleryImageUpsertPayload }
    >({
      query: ({ galleryId, imageId, patch }) => ({
        url: `/admin/galleries/${encodeURIComponent(galleryId)}/images/${encodeURIComponent(imageId)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminGalleryImages', id: arg.galleryId },
      ],
    }),

    /* -------------------- IMAGE DELETE (admin) ------------- */
    deleteGalleryImageAdmin: build.mutation<void, { galleryId: string; imageId: string }>({
      query: ({ galleryId, imageId }) => ({
        url: `/admin/galleries/${encodeURIComponent(galleryId)}/images/${encodeURIComponent(imageId)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminGalleryImages', id: arg.galleryId },
      ],
    }),

    /* -------------------- IMAGE REORDER (admin) ------------ */
    reorderGalleryImagesAdmin: build.mutation<
      void,
      { galleryId: string; ids: string[] }
    >({
      query: ({ galleryId, ids }) => ({
        url: `/admin/galleries/${encodeURIComponent(galleryId)}/images/reorder`,
        method: 'PUT',
        body: { ids },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminGalleryImages', id: arg.galleryId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useListGalleriesAdminQuery,
  useGetGalleryAdminQuery,
  useLazyGetGalleryAdminQuery,
  useCreateGalleryAdminMutation,
  useUpdateGalleryAdminMutation,
  useDeleteGalleryAdminMutation,
  useReorderGalleriesAdminMutation,
  useListGalleryImagesAdminQuery,
  useCreateGalleryImageAdminMutation,
  useBulkCreateGalleryImagesAdminMutation,
  useUpdateGalleryImageAdminMutation,
  useDeleteGalleryImageAdminMutation,
  useReorderGalleryImagesAdminMutation,
} = galleryAdminApi;
