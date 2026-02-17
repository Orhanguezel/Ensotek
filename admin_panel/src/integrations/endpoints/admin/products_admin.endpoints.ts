// =============================================================
// FILE: src/integrations/endpoints/admin/products_admin.endpoints.ts
// Admin Products RTK Endpoints
// Routes: /admin/products  (backend: modules/products/admin.routes.ts)
// =============================================================

import { baseApi } from '@/integrations/baseApi';
import type {
  AdminProductDto,
  AdminProductListParams,
  AdminProductListResult,
  AdminProductCreatePayload,
  AdminProductUpdatePayload,
  ProductCategoryOption,
  ProductSubcategoryOption,
} from '@/integrations/shared/product_admin.types';

export const productsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /admin/products
    listProductsAdmin: build.query<AdminProductListResult, AdminProductListParams | void>({
      query: (params) => ({
        url: '/admin/products',
        method: 'GET',
        params: params ?? {},
        credentials: 'include',
      }),
      transformResponse: (response: AdminProductDto[], meta) => {
        const items = Array.isArray(response) ? response : [];
        const totalHeader = meta?.response?.headers.get('x-total-count');
        const total = totalHeader ? Number(totalHeader) : items.length;
        return { items, total };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'AdminProducts' as const, id })),
              { type: 'AdminProducts' as const, id: 'LIST' },
            ]
          : [{ type: 'AdminProducts' as const, id: 'LIST' }],
    }),

    // GET /admin/products/:id
    getProductAdmin: build.query<AdminProductDto, { id: string; locale?: string; item_type?: string }>({
      query: ({ id, locale, item_type }) => ({
        url: `/admin/products/${encodeURIComponent(id)}`,
        method: 'GET',
        credentials: 'include',
        params: { ...(locale ? { locale } : {}), ...(item_type ? { item_type } : {}) },
      }),
      providesTags: (result, error, { id }) => [{ type: 'AdminProducts', id }],
    }),

    // POST /admin/products
    createProductAdmin: build.mutation<AdminProductDto, AdminProductCreatePayload>({
      query: (body) => ({
        url: '/admin/products',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: [{ type: 'AdminProducts', id: 'LIST' }],
    }),

    // PATCH /admin/products/:id
    updateProductAdmin: build.mutation<AdminProductDto, { id: string; patch: AdminProductUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/products/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminProducts', id },
        { type: 'AdminProducts', id: 'LIST' },
      ],
    }),

    // DELETE /admin/products/:id
    deleteProductAdmin: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/products/${encodeURIComponent(id)}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminProducts', id },
        { type: 'AdminProducts', id: 'LIST' },
      ],
    }),

    // GET /admin/products/categories
    listProductCategoriesAdmin: build.query<ProductCategoryOption[], { locale?: string; module_key?: string } | void>({
      query: (params) => ({
        url: '/admin/products/categories',
        method: 'GET',
        params: params ?? {},
        credentials: 'include',
      }),
      transformResponse: (response: ProductCategoryOption[]) =>
        Array.isArray(response) ? response : [],
    }),

    // GET /admin/products/subcategories
    listProductSubcategoriesAdmin: build.query<
      ProductSubcategoryOption[],
      { category_id?: string; locale?: string } | void
    >({
      query: (params) => ({
        url: '/admin/products/subcategories',
        method: 'GET',
        params: params ?? {},
        credentials: 'include',
      }),
      transformResponse: (response: ProductSubcategoryOption[]) =>
        Array.isArray(response) ? response : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListProductsAdminQuery,
  useLazyListProductsAdminQuery,
  useGetProductAdminQuery,
  useCreateProductAdminMutation,
  useUpdateProductAdminMutation,
  useDeleteProductAdminMutation,
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
} = productsAdminApi;
