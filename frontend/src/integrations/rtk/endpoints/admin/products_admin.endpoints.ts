// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/products_admin.endpoints.ts
// Admin Products (CRUD + Images + Category helpers)
// Pattern: services_admin.endpoints.ts ile aynı (credentials include + params ?? {})
// =============================================================

import { baseApi } from '../../baseApi';
import type {
  AdminProductDto,
  AdminProductListQueryParams,
  AdminProductListResponse,
  AdminGetProductParams,
  AdminProductCreatePayload,
  AdminProductUpdatePayload,
  AdminProductSetImagesPayload,
  AdminProductCategoryDto,
  AdminProductSubCategoryDto,
  AdminProductCategoryListQueryParams,
  AdminProductSubCategoryListQueryParams,
  AdminProductsReorderPayload,
} from '@/integrations/types/product_admin.types';

export const productsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // -------- LIST --------
    listProductsAdmin: build.query<AdminProductListResponse, AdminProductListQueryParams | void>({
      query: (params?: AdminProductListQueryParams) => ({
        url: '/admin/products',
        method: 'GET',
        params: params ?? {}, // ✅ services pattern
        credentials: 'include', // ✅ services pattern
      }),
      transformResponse: (response: AdminProductDto[], meta): AdminProductListResponse => {
        const items = response ?? [];
        const header =
          (meta as any)?.response?.headers?.get?.('x-total-count') ??
          (meta as any)?.response?.headers?.get?.('X-Total-Count');
        const total = header ? Number(header) || items.length : items.length;
        return { items, total };
      },
    }),

    // -------- DETAIL --------
    getProductAdmin: build.query<AdminProductDto, AdminGetProductParams>({
      query: ({ id, locale }) => ({
        url: `/admin/products/${encodeURIComponent(id)}`,
        method: 'GET',
        credentials: 'include', // ✅ services pattern
        params: locale ? { locale } : undefined,
      }),
    }),

    // -------- CREATE --------
    createProductAdmin: build.mutation<AdminProductDto, AdminProductCreatePayload>({
      query: (body) => ({
        url: '/admin/products',
        method: 'POST',
        body,
        credentials: 'include', // ✅ services pattern
      }),
    }),

    // -------- UPDATE --------
    updateProductAdmin: build.mutation<
      AdminProductDto,
      { id: string; patch: AdminProductUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/products/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
        credentials: 'include', // ✅ services pattern
      }),
    }),

    // -------- DELETE --------
    deleteProductAdmin: build.mutation<{ ok?: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/products/${encodeURIComponent(id)}`,
        method: 'DELETE',
        credentials: 'include', // ✅ services pattern
      }),
    }),

    // -------- IMAGES (SET) --------
    setProductImagesAdmin: build.mutation<
      AdminProductDto,
      { id: string; payload: AdminProductSetImagesPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/products/${encodeURIComponent(id)}/images`,
        method: 'PUT',
        body: payload,
        credentials: 'include', // ✅ services pattern
      }),
    }),

    // -------- REORDER --------
    reorderProductsAdmin: build.mutation<{ ok: boolean }, AdminProductsReorderPayload>({
      query: (body) => ({
        url: '/admin/products/reorder',
        method: 'POST',
        body,
        credentials: 'include', // ✅ services pattern
      }),
    }),

    // -------- CATEGORY HELPERS --------
    listProductCategoriesAdmin: build.query<
      AdminProductCategoryDto[],
      AdminProductCategoryListQueryParams | void
    >({
      query: (params?: AdminProductCategoryListQueryParams) => ({
        url: '/admin/products/categories',
        method: 'GET',
        params: params ?? {}, // ✅ services pattern
        credentials: 'include', // ✅ services pattern
      }),
    }),

    listProductSubcategoriesAdmin: build.query<
      AdminProductSubCategoryDto[],
      AdminProductSubCategoryListQueryParams | void
    >({
      query: (params?: AdminProductSubCategoryListQueryParams) => ({
        url: '/admin/products/subcategories',
        method: 'GET',
        params: params ?? {}, // ✅ services pattern
        credentials: 'include', // ✅ services pattern
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListProductsAdminQuery,
  useGetProductAdminQuery,
  useCreateProductAdminMutation,
  useUpdateProductAdminMutation,
  useDeleteProductAdminMutation,
  useSetProductImagesAdminMutation,
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
  useReorderProductsAdminMutation,
} = productsAdminApi;
