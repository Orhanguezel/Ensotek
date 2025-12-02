// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/categories_admin.endpoints.ts
// Ensotek – Admin Kategori RTK Endpoints
// Base URL: /api/admin (baseApi üzerinden)
// =============================================================

import { baseApi } from "../../baseApi";
import type {
  CategoryDto,
  CategoryListQueryParams,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  CategoryReorderPayload,
  CategorySetImagePayload,
} from "@/integrations/types/category.types";

/**
 * Query paramlarından undefined / boş stringleri temizlemek için
 */
const cleanParams = (
  params?: Record<string, unknown>,
): Record<string, string | number | boolean> | undefined => {
  if (!params) return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (
      v === undefined ||
      v === null ||
      v === "" ||
      (typeof v === "number" && Number.isNaN(v))
    ) {
      continue;
    }
    // boolean / number / string dışındaki tipleri string’e çevirme
    if (typeof v === "boolean" || typeof v === "number" || typeof v === "string") {
      out[k] = v;
    } else {
      out[k] = String(v);
    }
  }
  return Object.keys(out).length ? out : undefined;
};

export const categoriesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* --------------------------------------------------------- */
    /* LIST                                                       */
    /* GET /api/admin/categories/list                            */
    /* --------------------------------------------------------- */
    listCategoriesAdmin: build.query<
      CategoryDto[],
      CategoryListQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/categories/list",
        method: "GET",
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
    }),

    /* --------------------------------------------------------- */
    /* GET by id – /api/admin/categories/:id                     */
    /* --------------------------------------------------------- */
    getCategoryAdmin: build.query<CategoryDto, string>({
      query: (id) => ({
        url: `/admin/categories/${encodeURIComponent(id)}`,
        method: "GET",
      }),
    }),

    /* --------------------------------------------------------- */
    /* CREATE – POST /api/admin/categories                       */
    /* --------------------------------------------------------- */
    createCategoryAdmin: build.mutation<CategoryDto, CategoryCreatePayload>({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
    }),

    /* --------------------------------------------------------- */
    /* PATCH (partial update) – /api/admin/categories/:id        */
    /* --------------------------------------------------------- */
    updateCategoryAdmin: build.mutation<
      CategoryDto,
      { id: string; patch: CategoryUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/categories/${encodeURIComponent(id)}`,
        method: "PATCH",
        // 🔴 ÖNEMLİ: backend categoryUpdateSchema.partial() top-level body bekliyor
        body: patch,
      }),
    }),

    /* --------------------------------------------------------- */
    /* DELETE – /api/admin/categories/:id                        */
    /* --------------------------------------------------------- */
    deleteCategoryAdmin: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/categories/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
    }),

    /* --------------------------------------------------------- */
    /* REORDER – /api/admin/categories/reorder                   */
    /* Body: { items: [{id, display_order}, ...] }               */
    /* --------------------------------------------------------- */
    reorderCategoriesAdmin: build.mutation<
      { ok: boolean },
      CategoryReorderPayload
    >({
      query: (payload) => ({
        url: "/admin/categories/reorder",
        method: "POST",
        body: payload,
      }),
    }),

    /* --------------------------------------------------------- */
    /* TOGGLE ACTIVE – PATCH /api/admin/categories/:id/active    */
    /* Body: { is_active: boolean }                              */
    /* --------------------------------------------------------- */
    toggleCategoryActiveAdmin: build.mutation<
      CategoryDto,
      { id: string; is_active: boolean }
    >({
      query: ({ id, is_active }) => ({
        url: `/admin/categories/${encodeURIComponent(id)}/active`,
        method: "PATCH",
        body: { is_active },
      }),
    }),

    /* --------------------------------------------------------- */
    /* TOGGLE FEATURED – PATCH /api/admin/categories/:id/featured*/
    /* Body: { is_featured: boolean }                            */
    /* --------------------------------------------------------- */
    toggleCategoryFeaturedAdmin: build.mutation<
      CategoryDto,
      { id: string; is_featured: boolean }
    >({
      query: ({ id, is_featured }) => ({
        url: `/admin/categories/${encodeURIComponent(id)}/featured`,
        method: "PATCH",
        body: { is_featured },
      }),
    }),

    /* --------------------------------------------------------- */
    /* SET IMAGE – PATCH /api/admin/categories/:id/image         */
    /* Body: { asset_id?: string|null, alt?: string|null }       */
    /* --------------------------------------------------------- */
    setCategoryImageAdmin: build.mutation<
      CategoryDto,
      CategorySetImagePayload
    >({
      query: ({ id, asset_id, alt }) => ({
        url: `/admin/categories/${encodeURIComponent(id)}/image`,
        method: "PATCH",
        body: {
          asset_id: asset_id ?? null,
          alt: alt ?? null,
        },
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useListCategoriesAdminQuery,
  useLazyListCategoriesAdminQuery,
  useGetCategoryAdminQuery,
  useLazyGetCategoryAdminQuery,
  useCreateCategoryAdminMutation,
  useUpdateCategoryAdminMutation,
  useDeleteCategoryAdminMutation,
  useReorderCategoriesAdminMutation,
  useToggleCategoryActiveAdminMutation,
  useToggleCategoryFeaturedAdminMutation,
  useSetCategoryImageAdminMutation,
} = categoriesAdminApi;
