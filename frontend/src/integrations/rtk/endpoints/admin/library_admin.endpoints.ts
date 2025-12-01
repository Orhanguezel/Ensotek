// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/library_admin.endpoints.ts
// Ensotek – Admin Library RTK Endpoints
// Base URL: /api/admin (baseApi üzerinden)
// =============================================================

import { baseApi } from "../../baseApi";
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
} from "@/integrations/types/library.types";

/**
 * Query paramlarından undefined / boş stringleri temizlemek için
 */
const cleanParams = (
  params?: Record<string, unknown>,
): Record<string, unknown> | undefined => {
  if (!params) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
};

export const libraryAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* --------------------------------------------------------- */
    /* LIST – GET /api/admin/library                             */
    /* x-total-count header'ı varsa UI tarafında erişebilirsin   */
    /* --------------------------------------------------------- */
    listLibraryAdmin: build.query<
      LibraryDto[],
      LibraryListQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/library",
        method: "GET",
        params: cleanParams(
          params as Record<string, unknown> | undefined,
        ),
      }),
    }),

    /* --------------------------------------------------------- */
    /* GET BY ID – GET /api/admin/library/:id                    */
    /* --------------------------------------------------------- */
    getLibraryAdmin: build.query<LibraryDto, string>({
      query: (id) => ({
        url: `/admin/library/${id}`,
        method: "GET",
      }),
    }),

    /* --------------------------------------------------------- */
    /* GET BY SLUG – GET /api/admin/library/by-slug/:slug        */
    /* --------------------------------------------------------- */
    getLibraryBySlugAdmin: build.query<LibraryDto, string>({
      query: (slug) => ({
        url: `/admin/library/by-slug/${encodeURIComponent(slug)}`,
        method: "GET",
      }),
    }),

    /* --------------------------------------------------------- */
    /* CREATE – POST /api/admin/library                          */
    /* Body: UpsertLibraryBody                                   */
    /* --------------------------------------------------------- */
    createLibraryAdmin: build.mutation<LibraryDto, LibraryCreatePayload>(
      {
        query: (body) => ({
          url: "/admin/library",
          method: "POST",
          body,
        }),
      },
    ),

    /* --------------------------------------------------------- */
    /* UPDATE (PATCH) – PATCH /api/admin/library/:id             */
    /* Body: PatchLibraryBody                                    */
    /* --------------------------------------------------------- */
    updateLibraryAdmin: build.mutation<
      LibraryDto,
      { id: string; patch: LibraryUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/library/${id}`,
        method: "PATCH",
        body: patch,
      }),
    }),

    /* --------------------------------------------------------- */
    /* DELETE – DELETE /api/admin/library/:id                    */
    /* --------------------------------------------------------- */
    removeLibraryAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/library/${id}`,
        method: "DELETE",
      }),
    }),

    /* ================== IMAGES (gallery) ===================== */

    /* LIST IMAGES – GET /api/admin/library/:id/images           */
    listLibraryImagesAdmin: build.query<LibraryImageDto[], string>({
      query: (id) => ({
        url: `/admin/library/${id}/images`,
        method: "GET",
      }),
    }),

    /* CREATE IMAGE – POST /api/admin/library/:id/images         */
    /* Body: UpsertLibraryImageBody, Response: LibraryImageView[]*/
    createLibraryImageAdmin: build.mutation<
      LibraryImageDto[],
      { id: string; payload: LibraryImageCreatePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/library/${id}/images`,
        method: "POST",
        body: payload,
      }),
    }),

    /* UPDATE IMAGE – PATCH /api/admin/library/:id/images/:imageId */
    updateLibraryImageAdmin: build.mutation<
      LibraryImageDto[],
      {
        id: string;
        imageId: string;
        patch: LibraryImageUpdatePayload;
      }
    >({
      query: ({ id, imageId, patch }) => ({
        url: `/admin/library/${id}/images/${imageId}`,
        method: "PATCH",
        body: patch,
      }),
    }),

    /* DELETE IMAGE – DELETE /api/admin/library/:id/images/:imageId */
    removeLibraryImageAdmin: build.mutation<
      void,
      { id: string; imageId: string }
    >({
      query: ({ id, imageId }) => ({
        url: `/admin/library/${id}/images/${imageId}`,
        method: "DELETE",
      }),
    }),

    /* ================== FILES ================================ */

    /* LIST FILES – GET /api/admin/library/:id/files             */
    listLibraryFilesAdmin: build.query<LibraryFileDto[], string>({
      query: (id) => ({
        url: `/admin/library/${id}/files`,
        method: "GET",
      }),
    }),

    /* CREATE FILE – POST /api/admin/library/:id/files           */
    createLibraryFileAdmin: build.mutation<
      LibraryFileDto[],
      { id: string; payload: LibraryFileCreatePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/library/${id}/files`,
        method: "POST",
        body: payload,
      }),
    }),

    /* UPDATE FILE – PATCH /api/admin/library/:id/files/:fileId  */
    updateLibraryFileAdmin: build.mutation<
      LibraryFileDto[],
      {
        id: string;
        fileId: string;
        patch: LibraryFileUpdatePayload;
      }
    >({
      query: ({ id, fileId, patch }) => ({
        url: `/admin/library/${id}/files/${fileId}`,
        method: "PATCH",
        body: patch,
      }),
    }),

    /* DELETE FILE – DELETE /api/admin/library/:id/files/:fileId */
    removeLibraryFileAdmin: build.mutation<
      void,
      { id: string; fileId: string }
    >({
      query: ({ id, fileId }) => ({
        url: `/admin/library/${id}/files/${fileId}`,
        method: "DELETE",
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
