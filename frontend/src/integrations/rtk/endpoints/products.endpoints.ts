// =============================================================
// FILE: src/integrations/rtk/endpoints/products.endpoints.ts
// Public Products + FAQ + Specs + Reviews
// =============================================================

import { baseApi } from "../baseApi";
import type {
  ProductDto,
  ProductListQueryParams,
  GetProductByIdOrSlugParams,
  GetProductBySlugParams,
  GetProductByIdParams,
  ProductFaqDto,
  ProductFaqListQueryParams,
  ProductSpecDto,
  ProductSpecListQueryParams,
  ProductReviewDto,
  ProductReviewListQueryParams,
} from "@/integrations/types/product.types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ---------- Products list ----------
    listProducts: build.query<ProductDto[], ProductListQueryParams | undefined>(
      {
        // arg: ProductListQueryParams | undefined
        query: (params?: ProductListQueryParams) => ({
          url: "/products",
          method: "GET",
          // params: ProductListQueryParams | undefined
          params,
        }),
      },
    ),

    // ---------- Detail (id veya slug) ----------
    getProductByIdOrSlug: build.query<ProductDto, GetProductByIdOrSlugParams>({
      query: ({ idOrSlug, ...params }) => ({
        url: `/products/${encodeURIComponent(idOrSlug)}`,
        method: "GET",
        params,
      }),
    }),

    getProductBySlug: build.query<ProductDto, GetProductBySlugParams>({
      query: ({ slug, ...params }) => ({
        url: `/products/by-slug/${encodeURIComponent(slug)}`,
        method: "GET",
        params,
      }),
    }),

    getProductById: build.query<ProductDto, GetProductByIdParams>({
      query: ({ id }) => ({
        url: `/products/id/${encodeURIComponent(id)}`,
        method: "GET",
      }),
    }),

    // ---------- Public FAQ ----------
    listProductFaqs: build.query<
      ProductFaqDto[],
      ProductFaqListQueryParams | undefined
    >({
      query: (params?: ProductFaqListQueryParams) => ({
        url: "/product_faqs",
        method: "GET",
        params,
      }),
    }),

    // ---------- Public Specs ----------
    listProductSpecs: build.query<
      ProductSpecDto[],
      ProductSpecListQueryParams | undefined
    >({
      query: (params?: ProductSpecListQueryParams) => ({
        url: "/product_specs",
        method: "GET",
        params,
      }),
    }),

    // ---------- Public Reviews ----------
    listProductReviews: build.query<
      ProductReviewDto[],
      ProductReviewListQueryParams
    >({
      query: (params) => ({
        url: "/product_reviews",
        method: "GET",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListProductsQuery,
  useGetProductByIdOrSlugQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useListProductFaqsQuery,
  useListProductSpecsQuery,
  useListProductReviewsQuery,
} = productsApi;
