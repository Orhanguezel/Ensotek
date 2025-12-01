"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/rtk/axiosBaseQuery";
import { buildCommonHeaders } from "@/lib/http";
import type { SupportedLocale } from "@/types/common";
import type {
  Iguezelwebdesignprod,
  guezelwebdesignCategory,
  ProductsListParams,
  ProductBySlugParams,
  ApiEnvelope,
} from "./types";

/**
 * RTK Query — Products & Categories (public)
 *  - baseQuery: axiosBaseQuery()
 *  - Accept-Language/Tenant otomatik; gerekirse headers ile locale override et.
 */
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Product", "ProductList", "ProductCategory"],
  endpoints: (builder) => ({
    /** GET /guezelwebdesignprod — list */
    list: builder.query<Iguezelwebdesignprod[], ProductsListParams | void>({
      query: (args) => {
        const locale: SupportedLocale | undefined = args?.locale as any;
        const params = new URLSearchParams();

        if (args?.page) params.set("page", String(args.page));
        if (args?.limit) params.set("limit", String(args.limit));
        if (args?.categorySlug) params.set("category", args.categorySlug);
        if (args?.q) params.set("q", args.q);
        if (args?.sort) params.set("sort", args.sort);
        if (typeof args?.minPrice === "number") params.set("minPrice", String(args.minPrice));
        if (typeof args?.maxPrice === "number") params.set("maxPrice", String(args.maxPrice));
        if (args?.brand) params.set("brand", args.brand);
        if (typeof args?.isPublished === "boolean") params.set("isPublished", String(args.isPublished));

        return {
          url: `guezelwebdesignprod${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          headers: locale ? buildCommonHeaders(locale) : undefined,
        };
      },
      transformResponse: (res: ApiEnvelope<Iguezelwebdesignprod[]>) => res.data ?? [],
      providesTags: (result) =>
        Array.isArray(result)
          ? [
            { type: "ProductList", id: "LIST" },
            ...result.map((x) => ({ type: "Product" as const, id: x._id })),
          ]
          : [{ type: "ProductList", id: "LIST" }],
    }),

    /** GET /guezelwebdesignprod/slug/:slug — single by slug */
    bySlug: builder.query<Iguezelwebdesignprod, ProductBySlugParams>({
      query: ({ slug, locale }) => ({
        url: `guezelwebdesignprod/slug/${encodeURIComponent(slug)}`,
        method: "GET",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<Iguezelwebdesignprod>) => res.data,
      providesTags: (result) =>
        result ? [{ type: "Product", id: result._id }] : [],
    }),

    /** GET /guezelwebdesignprod/:id — single by id (public, gerektiğinde) */
    byId: builder.query<Iguezelwebdesignprod, { id: string; locale?: SupportedLocale }>({
      query: ({ id, locale }) => ({
        url: `guezelwebdesignprod/${encodeURIComponent(id)}`,
        method: "GET",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<Iguezelwebdesignprod>) => res.data,
      providesTags: (result) =>
        result ? [{ type: "Product", id: result._id }] : [],
    }),

    /** GET /guezelwebdesigncategory — categories */
    categories: builder.query<guezelwebdesignCategory[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "guezelwebdesigncategory",
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<guezelwebdesignCategory[]>) => res.data ?? [],
      providesTags: (result) =>
        Array.isArray(result)
          ? [
            { type: "ProductCategory", id: "LIST" },
            ...result.map((c) => ({ type: "ProductCategory" as const, id: c._id })),
          ]
          : [{ type: "ProductCategory", id: "LIST" }],
    }),
  }),
});

export const {
  useListQuery: useProductsListQuery,
  useBySlugQuery: useProductBySlugQuery,
  useByIdQuery: useProductByIdQuery,
  useCategoriesQuery: useProductCategoriesQuery,
} = productsApi;
