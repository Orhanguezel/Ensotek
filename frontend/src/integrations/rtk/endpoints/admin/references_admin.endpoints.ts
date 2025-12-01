// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/references_admin.endpoints.ts
// Ensotek – References (admin API)
// Backend routes (admin prefix ile):
//   GET    /admin/references
//   GET    /admin/references/:id
//   GET    /admin/references/by-slug/:slug
//   POST   /admin/references
//   PATCH  /admin/references/:id
//   DELETE /admin/references/:id
//
//   GET    /admin/references/:id/images
//   POST   /admin/references/:id/images
//   PATCH  /admin/references/:id/images/:imageId
//   DELETE /admin/references/:id/images/:imageId
// =============================================================

import { baseApi } from "../../baseApi";
import type {
  ReferenceDto,
  ReferenceImageDto,
  ReferenceListQueryParams,
  ReferenceListResponse,
  ReferenceUpsertPayload,
  ReferenceImageUpsertPayload,
} from "@/integrations/types/references.types";

const serializeListQuery = (
  q?: ReferenceListQueryParams,
): Record<string, any> => {
  if (!q) return {};
  const {
    order,
    sort,
    orderDir,
    limit,
    offset,
    is_published,
    is_featured,
    q: search,
    slug,
    select,
    category_id,
    sub_category_id,
  } = q;

  const params: Record<string, any> = {};
  if (order) params.order = order;
  if (sort) params.sort = sort;
  if (orderDir) params.orderDir = orderDir;
  if (typeof limit === "number") params.limit = limit;
  if (typeof offset === "number") params.offset = offset;

  if (typeof is_published !== "undefined")
    params.is_published = is_published;
  if (typeof is_featured !== "undefined")
    params.is_featured = is_featured;

  if (search) params.q = search;
  if (slug) params.slug = slug;
  if (select) params.select = select;
  if (category_id) params.category_id = category_id;
  if (sub_category_id) params.sub_category_id = sub_category_id;

  return params;
};

export const referencesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* -------------------- LIST (admin) -------------------- */
    listReferencesAdmin: build.query<
      ReferenceListResponse,
      ReferenceListQueryParams | void
    >({
      query: (params?: ReferenceListQueryParams) => ({
        url: "/admin/references",
        method: "GET",
        params: serializeListQuery(params),
      }),
      transformResponse: (response: ReferenceDto[], meta): ReferenceListResponse => {
        const totalHeader =
          meta?.response?.headers?.get("x-total-count") ?? "0";
        const total = Number(totalHeader) || 0;
        return { items: response ?? [], total };
      },
      providesTags: (result) =>
        result?.items
          ? [
              { type: "AdminReferences", id: "LIST" },
              ...result.items.map((r: ReferenceDto) => ({
                type: "AdminReferences" as const,
                id: r.id,
              })),
            ]
          : [{ type: "AdminReferences", id: "LIST" }],
    }),

    /* -------------------- GET BY ID (admin) -------------------- */
    getReferenceAdmin: build.query<ReferenceDto, string>({
      query: (id) => ({
        url: `/admin/references/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [
        { type: "AdminReferences", id },
      ],
    }),

    /* -------------------- GET BY SLUG (admin) -------------------- */
    getReferenceBySlugAdmin: build.query<ReferenceDto, string>({
      query: (slug) => ({
        url: `/admin/references/by-slug/${slug}`,
        method: "GET",
      }),
      providesTags: (res) =>
        res?.id ? [{ type: "AdminReferences", id: res.id }] : [],
    }),

    /* -------------------- CREATE (admin) -------------------- */
    createReferenceAdmin: build.mutation<
      ReferenceDto,
      ReferenceUpsertPayload
    >({
      query: (payload) => ({
        url: "/admin/references",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "AdminReferences", id: "LIST" }],
    }),

    /* -------------------- UPDATE (admin) -------------------- */
    updateReferenceAdmin: build.mutation<
      ReferenceDto,
      { id: string; patch: ReferenceUpsertPayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/references/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "AdminReferences", id: arg.id },
        { type: "AdminReferences", id: "LIST" },
      ],
    }),

    /* -------------------- DELETE (admin) -------------------- */
    deleteReferenceAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/references/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "AdminReferences", id },
        { type: "AdminReferences", id: "LIST" },
      ],
    }),

    /* -------------------- GALLERY LIST (admin) -------------------- */
    listReferenceImagesAdmin: build.query<ReferenceImageDto[], string>({
      query: (referenceId) => ({
        url: `/admin/references/${referenceId}/images`,
        method: "GET",
      }),
      providesTags: (_res, _err, referenceId) => [
        { type: "AdminReferenceImages", id: referenceId },
      ],
    }),

    /* -------------------- GALLERY CREATE (admin) -------------------- */
    createReferenceImageAdmin: build.mutation<
      ReferenceImageDto[],
      { referenceId: string; payload: ReferenceImageUpsertPayload }
    >({
      query: ({ referenceId, payload }) => ({
        url: `/admin/references/${referenceId}/images`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "AdminReferenceImages", id: arg.referenceId },
      ],
    }),

    /* -------------------- GALLERY UPDATE (admin) -------------------- */
    updateReferenceImageAdmin: build.mutation<
      ReferenceImageDto[],
      {
        referenceId: string;
        imageId: string;
        patch: ReferenceImageUpsertPayload;
      }
    >({
      query: ({ referenceId, imageId, patch }) => ({
        url: `/admin/references/${referenceId}/images/${imageId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "AdminReferenceImages", id: arg.referenceId },
      ],
    }),

    /* -------------------- GALLERY DELETE (admin) -------------------- */
    deleteReferenceImageAdmin: build.mutation<
      void,
      { referenceId: string; imageId: string }
    >({
      query: ({ referenceId, imageId }) => ({
        url: `/admin/references/${referenceId}/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "AdminReferenceImages", id: arg.referenceId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useListReferencesAdminQuery,
  useGetReferenceAdminQuery,
  useGetReferenceBySlugAdminQuery,
  useCreateReferenceAdminMutation,
  useUpdateReferenceAdminMutation,
  useDeleteReferenceAdminMutation,
  useListReferenceImagesAdminQuery,
  useCreateReferenceImageAdminMutation,
  useUpdateReferenceImageAdminMutation,
  useDeleteReferenceImageAdminMutation,
} = referencesAdminApi;
