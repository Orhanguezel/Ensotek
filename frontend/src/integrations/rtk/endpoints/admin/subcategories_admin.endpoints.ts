// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/subcategories_admin.endpoints.ts
// Ensotek – ADMIN SubCategories RTK endpoints
// =============================================================

import { baseApi } from "../../baseApi";

import type {
  ApiSubCategory,
  SubCategoryDto,
  SubCategoryAdminListQueryParams,
  SubCategoryCreatePayload,
  SubCategoryUpdatePayload,
  SubCategoryReorderItem,
  SubCategorySetImagePayload,
} from "../../../types/subcategory.types";
import { normalizeSubCategory } from "../../../types/subcategory.types";

export const subCategoriesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* --------------------------------------------------------- */
    /*  ADMIN: Liste                                              */
    /*  GET /admin/sub-categories/list                            */
    /* --------------------------------------------------------- */
    listSubCategoriesAdmin: build.query<
      SubCategoryDto[],
      SubCategoryAdminListQueryParams | void
    >({
      query: (params) => {
        // ❗ RTK FetchArgs.params => Record<string, any> | undefined olmalı
        const qp: Record<string, any> | undefined = params
          ? { ...(params as SubCategoryAdminListQueryParams) }
          : undefined;

        return {
          url: "/admin/sub-categories/list",
          method: "GET",
          params: qp,
        };
      },
      transformResponse: (response: ApiSubCategory[]) =>
        Array.isArray(response) ? response.map(normalizeSubCategory) : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({
                type: "SubCategories" as const,
                id: r.id,
              })),
              { type: "SubCategories" as const, id: "LIST" },
            ]
          : [{ type: "SubCategories" as const, id: "LIST" }],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: Tekil (ID)                                         */
    /*  GET /admin/sub-categories/:id                             */
    /* --------------------------------------------------------- */
    getSubCategoryAdmin: build.query<SubCategoryDto, string>({
      query: (id) => ({
        url: `/admin/sub-categories/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiSubCategory) =>
        normalizeSubCategory(response),
      providesTags: (_res, _err, id) => [
        { type: "SubCategories" as const, id },
      ],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: Slug                                               */
    /*  GET /admin/sub-categories/by-slug/:slug?category_id=...   */
    /* --------------------------------------------------------- */
    getSubCategoryBySlugAdmin: build.query<
      SubCategoryDto,
      { slug: string; category_id?: string }
    >({
      query: ({ slug, category_id }) => ({
        url: `/admin/sub-categories/by-slug/${slug}`,
        method: "GET",
        params: { category_id },
      }),
      transformResponse: (response: ApiSubCategory) =>
        normalizeSubCategory(response),
      providesTags: (res) =>
        res
          ? [{ type: "SubCategories" as const, id: res.id }]
          : [{ type: "SubCategories" as const, id: "SLUG" }],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: CREATE                                             */
    /*  POST /admin/sub-categories                                */
    /* --------------------------------------------------------- */
    createSubCategoryAdmin: build.mutation<
      SubCategoryDto,
      SubCategoryCreatePayload
    >({
      query: (body) => ({
        url: "/admin/sub-categories",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSubCategory) =>
        normalizeSubCategory(response),
      invalidatesTags: [{ type: "SubCategories" as const, id: "LIST" }],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: UPDATE (PATCH)                                     */
    /*  PATCH /admin/sub-categories/:id                           */
    /* --------------------------------------------------------- */
    updateSubCategoryAdmin: build.mutation<
      SubCategoryDto,
      { id: string; patch: SubCategoryUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/sub-categories/${id}`,
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response: ApiSubCategory) =>
        normalizeSubCategory(response),
      invalidatesTags: (_res, _err, arg) => [
        { type: "SubCategories" as const, id: arg.id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: DELETE                                             */
    /*  DELETE /admin/sub-categories/:id                          */
    /* --------------------------------------------------------- */
    deleteSubCategoryAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/sub-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "SubCategories" as const, id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: REORDER                                            */
    /*  POST /admin/sub-categories/reorder                        */
    /* --------------------------------------------------------- */
    reorderSubCategoriesAdmin: build.mutation<
      { ok: boolean },
      { items: SubCategoryReorderItem[] }
    >({
      query: (body) => ({
        url: "/admin/sub-categories/reorder",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SubCategories" as const, id: "LIST" }],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: Toggle Active                                      */
    /*  PATCH /admin/sub-categories/:id/active                    */
    /* --------------------------------------------------------- */
    toggleSubCategoryActiveAdmin: build.mutation<
      SubCategoryDto,
      { id: string; is_active: boolean }
    >({
      query: ({ id, is_active }) => ({
        url: `/admin/sub-categories/${id}/active`,
        method: "PATCH",
        body: { is_active },
      }),
      transformResponse: (response: ApiSubCategory) =>
        normalizeSubCategory(response),
      invalidatesTags: (_res, _err, arg) => [
        { type: "SubCategories" as const, id: arg.id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: Toggle Featured                                    */
    /*  PATCH /admin/sub-categories/:id/featured                  */
    /* --------------------------------------------------------- */
    toggleSubCategoryFeaturedAdmin: build.mutation<
      SubCategoryDto,
      { id: string; is_featured: boolean }
    >({
      query: ({ id, is_featured }) => ({
        url: `/admin/sub-categories/${id}/featured`,
        method: "PATCH",
        body: { is_featured },
      }),
      transformResponse: (response: ApiSubCategory) =>
        normalizeSubCategory(response),
      invalidatesTags: (_res, _err, arg) => [
        { type: "SubCategories" as const, id: arg.id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: Set Image                                          */
    /*  PATCH /admin/sub-categories/:id/image                     */
    /* --------------------------------------------------------- */
    setSubCategoryImageAdmin: build.mutation<
      SubCategoryDto,
      { id: string; payload: SubCategorySetImagePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/sub-categories/${id}/image`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response: ApiSubCategory) =>
        normalizeSubCategory(response),
      invalidatesTags: (_res, _err, arg) => [
        { type: "SubCategories" as const, id: arg.id },
        { type: "SubCategories" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListSubCategoriesAdminQuery,
  useGetSubCategoryAdminQuery,
  useGetSubCategoryBySlugAdminQuery,
  useCreateSubCategoryAdminMutation,
  useUpdateSubCategoryAdminMutation,
  useDeleteSubCategoryAdminMutation,
  useReorderSubCategoriesAdminMutation,
  useToggleSubCategoryActiveAdminMutation,
  useToggleSubCategoryFeaturedAdminMutation,
  useSetSubCategoryImageAdminMutation,
} = subCategoriesAdminApi;
