// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/custom_pages_admin.endpoints.ts
// Ensotek – Custom Pages Admin RTK Endpoints
// Backend: src/modules/customPages/admin.routes.ts
// =============================================================

import { baseApi } from "../../baseApi";
import type {
  ApiCustomPage,
  CustomPageDto,
  CustomPageListAdminQueryParams,
  CustomPageCreatePayload,
  CustomPageUpdatePayload,
} from "@/integrations/types/custom_pages.types";
import { mapApiCustomPageToDto } from "@/integrations/types/custom_pages.types";

const getTotalFromHeaders = (
  responseHeaders: Headers | undefined,
  fallbackLength: number,
): number => {
  const headerValue =
    responseHeaders?.get("x-total-count") ??
    responseHeaders?.get("X-Total-Count");
  if (!headerValue) return fallbackLength;
  const n = Number(headerValue);
  return Number.isFinite(n) && n >= 0 ? n : fallbackLength;
};

export const customPagesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * GET /admin/custom_pages
     * Admin – coalesced custom pages list
     */
    listCustomPagesAdmin: build.query<
      { items: CustomPageDto[]; total: number },
      CustomPageListAdminQueryParams | void
    >({
      query: (params?: CustomPageListAdminQueryParams) => ({
        url: "/admin/custom_pages",
        method: "GET",
        params,
      }),
      transformResponse: (response: ApiCustomPage[], meta) => {
        const total = getTotalFromHeaders(
          meta?.response?.headers,
          response.length,
        );
        return {
          items: response.map((row) => mapApiCustomPageToDto(row)),
          total,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((p) => ({
                type: "CustomPage" as const,
                id: p.id,
              })),
              { type: "CustomPage" as const, id: "ADMIN_LIST" },
            ]
          : [{ type: "CustomPage" as const, id: "ADMIN_LIST" }],
    }),

    /**
     * GET /admin/custom_pages/:id
     * Admin – tekil page (id)
     */
    getCustomPageAdmin: build.query<CustomPageDto, string>({
      query: (id) => ({
        url: `/admin/custom_pages/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      transformResponse: (response: ApiCustomPage) =>
        mapApiCustomPageToDto(response),
      providesTags: (_result, _error, id) => [
        { type: "CustomPage" as const, id },
      ],
    }),

    /**
     * GET /admin/custom_pages/by-slug/:slug
     * Admin – tekil page (slug)
     */
    getCustomPageBySlugAdmin: build.query<CustomPageDto, string>({
      query: (slug) => ({
        url: `/admin/custom_pages/by-slug/${encodeURIComponent(slug)}`,
        method: "GET",
      }),
      transformResponse: (response: ApiCustomPage) =>
        mapApiCustomPageToDto(response),
      providesTags: (_result, _error, slug) => [
        { type: "CustomPageSlug" as const, id: slug },
      ],
    }),

    /**
     * POST /admin/custom_pages
     * Admin – create
     */
    createCustomPageAdmin: build.mutation<
      CustomPageDto,
      CustomPageCreatePayload
    >({
      query: (body) => ({
        url: "/admin/custom_pages",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiCustomPage) =>
        mapApiCustomPageToDto(response),
      invalidatesTags: () => [
        { type: "CustomPage" as const, id: "ADMIN_LIST" },
        { type: "CustomPage" as const, id: "PUBLIC_LIST" },
      ],
    }),

    /**
     * PATCH /admin/custom_pages/:id
     * Admin – update (partial)
     */
    updateCustomPageAdmin: build.mutation<
      CustomPageDto,
      { id: string; patch: CustomPageUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/custom_pages/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response: ApiCustomPage) =>
        mapApiCustomPageToDto(response),
      invalidatesTags: (result) => {
        const id = result?.id;
        return id
          ? [
              { type: "CustomPage" as const, id },
              { type: "CustomPage" as const, id: "ADMIN_LIST" },
              { type: "CustomPage" as const, id: "PUBLIC_LIST" },
            ]
          : [
              { type: "CustomPage" as const, id: "ADMIN_LIST" },
              { type: "CustomPage" as const, id: "PUBLIC_LIST" },
            ];
      },
    }),

    /**
     * DELETE /admin/custom_pages/:id
     * Admin – delete
     */
    deleteCustomPageAdmin: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/custom_pages/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "CustomPage" as const, id: arg.id },
        { type: "CustomPage" as const, id: "ADMIN_LIST" },
        { type: "CustomPage" as const, id: "PUBLIC_LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListCustomPagesAdminQuery,
  useGetCustomPageAdminQuery,
  useGetCustomPageBySlugAdminQuery,
  useCreateCustomPageAdminMutation,
  useUpdateCustomPageAdminMutation,
  useDeleteCustomPageAdminMutation,
} = customPagesAdminApi;
