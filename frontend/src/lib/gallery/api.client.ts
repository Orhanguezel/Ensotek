// src/lib/gallery/api.client.ts

"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/rtk/axiosBaseQuery";
import { buildCommonHeaders } from "@/lib/http";
import type { SupportedLocale } from "@/types/common";
import type {
  IGallery,
  GalleryCategory,
  GalleryListParams,
  GalleryBySlugParams,
  ApiEnvelope,
} from "./types";

/**
 * RTK Query — Gallery (public)
 */
export const galleryApi = createApi({
  reducerPath: "galleryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Gallery", "GalleryList", "GalleryCategory"],
  endpoints: (builder) => ({
    /** GET /gallery/published — list */
    list: builder.query<IGallery[], GalleryListParams | void>({
      query: (args) => {
        const locale: SupportedLocale | undefined = args?.locale as any;
        const params = new URLSearchParams();

        if (args?.page)   params.set("page", String(args.page));
        if (args?.limit)  params.set("limit", String(args.limit));
        if (args?.sort)   params.set("sort", args.sort);
        if (args?.q)      params.set("q", args.q);
        if (args?.type)   params.set("type", args.type);

        if (args?.category)      params.set("category", args.category);
        else if (args?.categorySlug) params.set("category", args.categorySlug);

        if (args?.tags) {
          const t = Array.isArray(args.tags) ? args.tags : [args.tags];
          if (t.length) params.set("tags", t.join(","));
        }

        if (args?.select)   params.set("select", args.select);
        if (args?.populate) params.set("populate", args.populate);

        return {
          url: `gallery/published${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
          headers: locale ? buildCommonHeaders(locale) : undefined,
        };
      },
      // API bazen direkt array dönebilir; ikisini de karşıla
      transformResponse: (res: ApiEnvelope<IGallery[]> | IGallery[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "GalleryList", id: "LIST" },
              ...result.map((x) => ({ type: "Gallery" as const, id: x._id })),
            ]
          : [{ type: "GalleryList", id: "LIST" }],
    }),

    /** GET /gallery/slug/:slug — single */
    bySlug: builder.query<IGallery, GalleryBySlugParams>({
      query: ({ slug, locale }) => ({
        url: `gallery/slug/${encodeURIComponent(slug)}`,
        method: "GET",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<IGallery> | IGallery) =>
        (res && (res as any).data) ? (res as ApiEnvelope<IGallery>).data : (res as IGallery),
      providesTags: (result) =>
        result ? [{ type: "Gallery", id: result._id }] : [],
    }),

    /** GET /gallerycategory — categories (public) */
    categories: builder.query<GalleryCategory[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "gallerycategory",
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<GalleryCategory[]> | GalleryCategory[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "GalleryCategory", id: "LIST" },
              ...result.map((c) => ({ type: "GalleryCategory" as const, id: c._id })),
            ]
          : [{ type: "GalleryCategory", id: "LIST" }],
    }),
  }),
});

export const {
  useListQuery: useGalleryListQuery,
  useBySlugQuery: useGalleryBySlugQuery,
  useCategoriesQuery: useGalleryCategoriesQuery,
} = galleryApi;
