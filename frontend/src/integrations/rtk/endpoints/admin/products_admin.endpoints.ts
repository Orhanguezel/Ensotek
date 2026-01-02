// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/products_admin.endpoints.ts
// Admin Products (CRUD + Images + Category helpers)
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
        params: params ?? {},
        credentials: 'include',
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
        credentials: 'include',
      }),
      invalidatesTags: [{ type: 'AdminProducts' as const, id: 'LIST' }],
    }),

    // -------- UPDATE --------
    // ✅ locale gibi parametreleri ileride querystring’e taşıyabilmek için params ekledik
    updateProductAdmin: build.mutation<
      AdminProductDto,
      { id: string; patch: AdminProductUpdatePayload; params?: Record<string, any> }
    >({
      query: ({ id, patch, params }) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
        params: params && Object.keys(params).length ? params : undefined,
        credentials: 'include',
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminProducts' as const, id: arg.id },
        { type: 'AdminProductImages' as const, id: arg.id },
      ],
    }),

    // -------- DELETE --------
    deleteProductAdmin: build.mutation<{ ok?: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `${BASE}/${encodeURIComponent(id)}`,
        method: 'DELETE',
        credentials: 'include',
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
        credentials: 'include',
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'AdminProducts' as const, id: arg.id },
        { type: 'AdminProductImages' as const, id: arg.id },
      ],
    }),

    // =============================================================
    // PRODUCT IMAGES POOL (product_images)
    // =============================================================

    // ✅ locale param destekli (backend filtreliyorsa boş dönmesin)
    listProductImagesAdmin: build.query<ProductImageDto[], { productId: string; locale?: string }>({
      query: ({ productId, locale }) => ({
        url: `${BASE}/${encodeURIComponent(productId)}/images`,
        method: 'GET',
        credentials: 'include',
        params: locale ? { locale } : undefined,
      }),
      providesTags: (_res, _err, arg) => [
        { type: 'AdminProductImages' as const, id: arg.productId },
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
        url: `${BASE}/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`,
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
        credentials: 'include',
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
        params: params ?? {},
        credentials: 'include',
      }),
    }),

    listProductSubcategoriesAdmin: build.query<
      AdminProductSubCategoryDto[],
      AdminProductSubCategoryListQueryParams | void
    >({
      query: (params?: AdminProductSubCategoryListQueryParams) => ({
        url: `${BASE}/subcategories`,
        method: 'GET',
        params: params ?? {},
        credentials: 'include',
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

  useListProductImagesAdminQuery,
  useCreateProductImageAdminMutation,
  useDeleteProductImageAdminMutation,
} = productsAdminApi;
