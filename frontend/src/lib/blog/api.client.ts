"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/rtk/axiosBaseQuery";
import { buildCommonHeaders } from "@/lib/http";
import type { SupportedLocale } from "@/types/common";
import type {
  IBlog,
  BlogCategory,
  BlogListParams,
  BlogBySlugParams,
  ApiEnvelope,
} from "./types";

/**
 * RTK Query — Blog & Category (public uçlar)
 *  - baseQuery: axiosBaseQuery() (tenant + Accept-Language interceptor’ları sizde zaten hazır)
 *  - locale override lazımsa buildCommonHeaders(locale) ile gönderiyoruz
 */
export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Blog", "BlogList", "BlogCategory"],
  endpoints: (builder) => ({
    /** /blog — list */
    list: builder.query<IBlog[], BlogListParams | void>({
      query: (args) => {
        const locale: SupportedLocale | undefined = args?.locale as any;
        const params = new URLSearchParams();

        if (args?.page) params.set("page", String(args.page));
        if (args?.limit) params.set("limit", String(args.limit));
        if (args?.categorySlug) params.set("category", args.categorySlug);
        if (args?.q) params.set("q", args.q);
        if (args?.sort) params.set("sort", args.sort);

        return {
          url: `blog${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          headers: locale ? buildCommonHeaders(locale) : undefined,
        };
      },
      transformResponse: (res: ApiEnvelope<IBlog[]>) => res.data ?? [],
      providesTags: (result) =>
        Array.isArray(result)
          ? [
            { type: "BlogList", id: "LIST" },
            ...result.map((x) => ({ type: "Blog" as const, id: x._id })),
          ]
          : [{ type: "BlogList", id: "LIST" }],
    }),

    /** /blog/slug/:slug — single */
    bySlug: builder.query<IBlog, BlogBySlugParams>({
      query: ({ slug, locale }) => ({
        url: `blog/slug/${encodeURIComponent(slug)}`,
        method: "GET",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<IBlog>) => res.data,
      providesTags: (result) =>
        result ? [{ type: "Blog", id: result._id }] : [],
    }),

    /** /blogcategory — categories (public) */
    categories: builder.query<BlogCategory[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "blogcategory",
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<BlogCategory[]>) => res.data ?? [],
      providesTags: (result) =>
        Array.isArray(result)
          ? [
            { type: "BlogCategory", id: "LIST" },
            ...result.map((c) => ({ type: "BlogCategory" as const, id: c._id })),
          ]
          : [{ type: "BlogCategory", id: "LIST" }],
    }),

    // ────────────────────────────────
    // Admin uçları gerektiğinde ekleyebiliriz (create/update/delete/togglePublish)
    // create: builder.mutation(...), update: builder.mutation(...), vs.
    // ────────────────────────────────
  }),
});

export const {
  useListQuery: useBlogListQuery,
  useBySlugQuery: useBlogBySlugQuery,
  useCategoriesQuery: useBlogCategoriesQuery,
  // Admin mutations eklendiğinde export edin
} = blogApi;
