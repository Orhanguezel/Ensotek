// =============================================================
// FILE: src/integrations/rtk/endpoints/references.endpoints.ts
// Ensotek – References (public API)
// Backend routes:
//   GET    /references
//   GET    /references/:id
//   GET    /references/by-slug/:slug
//   GET    /references/:id/images
// =============================================================

import { baseApi } from "../baseApi";
import type {
  ReferenceDto,
  ReferenceImageDto,
  ReferenceListQueryParams,
  ReferenceListResponse,
} from "../../types/references.types";

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

export const referencesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* -------------------- LIST (public) -------------------- */
    listReferences: build.query<
      ReferenceListResponse,
      ReferenceListQueryParams | void
    >({
      query: (params?: ReferenceListQueryParams) => ({
        url: "/references",
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
              { type: "References", id: "LIST" },
              ...result.items.map((r: ReferenceDto) => ({
                type: "References" as const,
                id: r.id,
              })),
            ]
          : [{ type: "References", id: "LIST" }],
    }),

    /* -------------------- GET BY ID (public) -------------------- */
    getReferenceById: build.query<ReferenceDto, string>({
      query: (id) => ({
        url: `/references/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [
        { type: "References", id },
      ],
    }),

    /* -------------------- GET BY SLUG (public) -------------------- */
    getReferenceBySlug: build.query<ReferenceDto, string>({
      query: (slug) => ({
        url: `/references/by-slug/${slug}`,
        method: "GET",
      }),
      providesTags: (res) =>
        res?.id ? [{ type: "References", id: res.id }] : [],
    }),

    /* -------------------- LIST IMAGES (public) -------------------- */
    listReferenceImages: build.query<ReferenceImageDto[], string>({
      query: (referenceId) => ({
        url: `/references/${referenceId}/images`,
        method: "GET",
      }),
      providesTags: (_res, _err, referenceId) => [
        { type: "ReferenceImages", id: referenceId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useListReferencesQuery,
  useGetReferenceByIdQuery,
  useGetReferenceBySlugQuery,
  useListReferenceImagesQuery,
} = referencesApi;
