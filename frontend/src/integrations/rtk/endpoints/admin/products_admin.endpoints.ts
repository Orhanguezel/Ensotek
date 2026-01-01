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

// ✅ NEW: product_images admin types
import type {
  ProductImageDto,
  ProductImageCreatePayload,
} from '@/integrations/types/product_images_admin.types';

const BASE = '/admin/products';

export const productsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // -------- LIST --------
    listProductsAdmin: build.query<AdminProductListResponse, AdminProductListQueryParams | void>({
      query: (params?: AdminProductListQueryParams) => ({
        url: `${BASE}`,
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
      providesTags: (res) =>
        res?.items
          ? [
              { type: 'AdminProducts' as const, id: 'LIST' },
              ...res.items.map((x) => ({ type: 'AdminProducts' as const, id: x.id })),
            ]
          : [{ type: 'AdminProducts' as const, id: 'LIST' }],
    }),

    // -------- DETAIL --------
    getProductAdmin: build.query<AdminProductDto, AdminGetProductParams>({
      query: ({ id, locale, module_key, item_type }) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'GET',
        credentials: 'include',
        params:
          locale || module_key || item_type
            ? {
                ...(locale ? { locale } : {}),
                ...(module_key ? { module_key } : {}),
                ...(item_type ? { item_type } : {}),
              }
            : undefined,
      }),
      providesTags: (_res, _err, arg) => [{ type: 'AdminProducts' as const, id: arg.id }],
    }),

    // -------- CREATE --------
    createProductAdmin: build.mutation<AdminProductDto, AdminProductCreatePayload>({
      query: (body) => ({
        url: `${BASE}`,
        method: 'POST',
        body,
        credentials: 'include', // ✅ services pattern
      }),
      invalidatesTags: [{ type: 'AdminProducts' as const, id: 'LIST' }],
    }),

    // -------- UPDATE --------
    updateProductAdmin: build.mutation<
      AdminProductDto,
      { id: string; patch: AdminProductUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
        credentials: 'include', // ✅ services pattern
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminProducts' as const, id: arg.id },
        { type: 'AdminProductImages' as const, id: arg.id }, // cover değişince gallery UI da güncellensin
      ],
    }),

    // -------- DELETE --------
    deleteProductAdmin: build.mutation<{ ok?: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'DELETE',
        credentials: 'include', // ✅ services pattern
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminProducts' as const, id: arg.id },
        { type: 'AdminProducts' as const, id: 'LIST' },
      ],
    }),

    // -------- IMAGES (SET) --------
    setProductImagesAdmin: build.mutation<
      AdminProductDto,
      { id: string; payload: AdminProductSetImagesPayload }
    >({
      query: ({ id, payload }) => ({
        url: `${BASE}/${encodeURIComponent(id)}/images`,
        method: 'PUT',
        body: payload,
        credentials: 'include', // ✅ services pattern
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminProducts' as const, id: arg.id },
        { type: 'AdminProductImages' as const, id: arg.id },
      ],
    }),

    // =============================================================
    // ✅ NEW: PRODUCT IMAGES POOL (product_images)
    // - GET    /admin/products/:id/images
    // - POST   /admin/products/:id/images
    // - DELETE /admin/products/:id/images/:imageId
    // =============================================================

    listProductImagesAdmin: build.query<ProductImageDto[], string>({
      query: (productId) => ({
        url: `${BASE}/${encodeURIComponent(productId)}/images`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (_res, _err, productId) => [
        { type: 'AdminProductImages' as const, id: productId },
      ],
    }),

    createProductImageAdmin: build.mutation<
      ProductImageDto[] | ProductImageDto,
      { productId: string; payload: ProductImageCreatePayload }
    >({
      query: ({ productId, payload }) => ({
        url: `${BASE}/${encodeURIComponent(productId)}/images`,
        method: 'POST',
        body: payload,
        credentials: 'include',
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminProductImages' as const, id: arg.productId },
      ],
    }),

    deleteProductImageAdmin: build.mutation<
      ProductImageDto[] | { ok?: boolean },
      { productId: string; imageId: string }
    >({
      query: ({ productId, imageId }) => ({
        url: `${BASE}/${encodeURIComponent(productId)}/images/${encodeURIComponent(
          imageId,
        )}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminProductImages' as const, id: arg.productId },
      ],
    }),

    // -------- REORDER --------
    reorderProductsAdmin: build.mutation<{ ok: boolean }, AdminProductsReorderPayload>({
      query: (body) => ({
        url: `${BASE}/reorder`,
        method: 'POST',
        body,
        credentials: 'include', // ✅ services pattern
      }),
      invalidatesTags: [{ type: 'AdminProducts' as const, id: 'LIST' }],
    }),

    // -------- CATEGORY HELPERS --------
    listProductCategoriesAdmin: build.query<
      AdminProductCategoryDto[],
      AdminProductCategoryListQueryParams | void
    >({
      query: (params?: AdminProductCategoryListQueryParams) => ({
        url: `${BASE}/categories`,
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
        url: `${BASE}/subcategories`,
        method: 'GET',
        params: params ?? {}, // ✅ services pattern
        credentials: 'include', // ✅ services pattern
      }),
    }),
  }),
  overrideExisting: false,
});

// ✅ Eğer baseApi tagTypes içinde yoksa eklenmeli:
// tagTypes: ['AdminProducts','AdminProductImages', ...]
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

  // ✅ NEW exports
  useListProductImagesAdminQuery,
  useCreateProductImageAdminMutation,
  useDeleteProductImageAdminMutation,
} = productsAdminApi;
