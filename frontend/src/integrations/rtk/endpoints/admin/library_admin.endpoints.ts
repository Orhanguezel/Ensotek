// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/library_admin.endpoints.ts
// Ensotek – Admin Library RTK Endpoints (SCHEMA-SAFE)
// Base URL: /api/admin (baseApi üzerinden)
// Routes: src/modules/library/admin.routes.ts
// =============================================================

import { baseApi } from '../../baseApi';
import type {
  LibraryDto,
  LibraryListQueryParams,
  LibraryCreatePayload,
  LibraryUpdatePayload,
  LibraryImageDto,
  LibraryImageCreatePayload,
  LibraryImageUpdatePayload,
  LibraryFileDto,
  LibraryFileCreatePayload,
  LibraryFileUpdatePayload,
} from '@/integrations/types/library.types';

type WithLocale<T> = T & { locale?: string };

const cleanParams = (params?: Record<string, unknown>): Record<string, unknown> | undefined => {
  if (!params) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
};

export const libraryAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* ------------------------------ */
    /* Library (Admin)                */
    /* ------------------------------ */

    listLibraryAdmin: build.query<LibraryDto[], WithLocale<LibraryListQueryParams> | void>({
      query: (params) => {
        const p = (params || {}) as WithLocale<LibraryListQueryParams>;
        const { locale, ...rest } = p;

        return {
          url: '/admin/library',
          method: 'GET',
          params: cleanParams({ ...rest, locale }),
          headers: locale ? { 'x-locale': locale } : undefined,
        };
      },
    }),

    getLibraryAdmin: build.query<
      LibraryDto,
      { id: string; locale?: string; default_locale?: string }
    >({
      query: ({ id, locale, default_locale }) => ({
        url: `/admin/library/${id}`,
        method: 'GET',
        params: cleanParams({ locale, default_locale }),
        headers: locale ? { 'x-locale': locale } : undefined,
      }),
    }),

    getLibraryBySlugAdmin: build.query<
      LibraryDto,
      { slug: string; locale?: string; default_locale?: string }
    >({
      query: ({ slug, locale, default_locale }) => ({
        url: `/admin/library/by-slug/${encodeURIComponent(slug)}`,
        method: 'GET',
        params: cleanParams({ locale, default_locale }),
        headers: locale ? { 'x-locale': locale } : undefined,
      }),
    }),

    createLibraryAdmin: build.mutation<LibraryDto, LibraryCreatePayload>({
      query: (body) => ({
        url: '/admin/library',
        method: 'POST',
        body,
      }),
    }),

    updateLibraryAdmin: build.mutation<LibraryDto, { id: string; patch: LibraryUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/library/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),

    removeLibraryAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/library/${id}`,
        method: 'DELETE',
      }),
    }),

    reorderLibraryAdmin: build.mutation<void, { ids: string[] }>({
      query: (body) => ({
        url: `/admin/library/reorder`,
        method: 'POST',
        body,
      }),
    }),

    /* ------------------------------ */
    /* Images (Admin)                 */
    /* ------------------------------ */

    listLibraryImagesAdmin: build.query<LibraryImageDto[], { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/library/${id}/images`,
        method: 'GET',
        params: cleanParams({ locale }),
        headers: locale ? { 'x-locale': locale } : undefined,
      }),
    }),

    createLibraryImageAdmin: build.mutation<
      LibraryImageDto[],
      { id: string; payload: LibraryImageCreatePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/library/${id}/images`,
        method: 'POST',
        body: payload,
      }),
    }),

    updateLibraryImageAdmin: build.mutation<
      LibraryImageDto[],
      { id: string; imageId: string; patch: LibraryImageUpdatePayload }
    >({
      query: ({ id, imageId, patch }) => ({
        url: `/admin/library/${id}/images/${imageId}`,
        method: 'PATCH',
        body: patch,
      }),
    }),

    removeLibraryImageAdmin: build.mutation<void, { id: string; imageId: string }>({
      query: ({ id, imageId }) => ({
        url: `/admin/library/${id}/images/${imageId}`,
        method: 'DELETE',
      }),
    }),

    /* ------------------------------ */
    /* Files (Admin)                  */
    /* ------------------------------ */

    listLibraryFilesAdmin: build.query<LibraryFileDto[], { id: string }>({
      query: ({ id }) => ({
        url: `/admin/library/${id}/files`,
        method: 'GET',
      }),
    }),

    createLibraryFileAdmin: build.mutation<
      LibraryFileDto[],
      { id: string; payload: LibraryFileCreatePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/library/${id}/files`,
        method: 'POST',
        body: payload,
      }),
    }),

    updateLibraryFileAdmin: build.mutation<
      LibraryFileDto[],
      { id: string; fileId: string; patch: LibraryFileUpdatePayload }
    >({
      query: ({ id, fileId, patch }) => ({
        url: `/admin/library/${id}/files/${fileId}`,
        method: 'PATCH',
        body: patch,
      }),
    }),

    removeLibraryFileAdmin: build.mutation<void, { id: string; fileId: string }>({
      query: ({ id, fileId }) => ({
        url: `/admin/library/${id}/files/${fileId}`,
        method: 'DELETE',
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  // library
  useListLibraryAdminQuery,
  useLazyListLibraryAdminQuery,
  useGetLibraryAdminQuery,
  useLazyGetLibraryAdminQuery,
  useGetLibraryBySlugAdminQuery,
  useLazyGetLibraryBySlugAdminQuery,
  useCreateLibraryAdminMutation,
  useUpdateLibraryAdminMutation,
  useRemoveLibraryAdminMutation,
  useReorderLibraryAdminMutation,

  // images
  useListLibraryImagesAdminQuery,
  useLazyListLibraryImagesAdminQuery,
  useCreateLibraryImageAdminMutation,
  useUpdateLibraryImageAdminMutation,
  useRemoveLibraryImageAdminMutation,

  // files
  useListLibraryFilesAdminQuery,
  useLazyListLibraryFilesAdminQuery,
  useCreateLibraryFileAdminMutation,
  useUpdateLibraryFileAdminMutation,
  useRemoveLibraryFileAdminMutation,
} = libraryAdminApi;
