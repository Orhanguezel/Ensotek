// src/lib/library/api.client.ts
"use client";

import { rootApi } from "@/lib/rtk/rootApi";
import { buildCommonHeaders } from "@/lib/http";
import type { SupportedLocale } from "@/types/common";
import type {
  ILibrary,
  LibraryCategory,
  LibraryListParams,
  LibraryBySlugParams,
  ApiEnvelope,
} from "./types";

export const libraryApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /library — list */
    libList: builder.query<ILibrary[], LibraryListParams | void>({
      query: (args) => {
        const locale: SupportedLocale | undefined = args?.locale as any;
        const qs = new URLSearchParams();
        if (args?.page) qs.set("page", String(args.page));
        if (args?.limit) qs.set("limit", String(args.limit));
        if (args?.categorySlug) qs.set("category", args.categorySlug);
        if (args?.q) qs.set("q", args.q);
        if (args?.sort) qs.set("sort", args.sort);

        return {
          url: `library${qs.toString() ? `?${qs.toString()}` : ""}`,
          method: "GET",
          headers: locale ? buildCommonHeaders(locale) : undefined,
        };
      },
      transformResponse: (res: ApiEnvelope<ILibrary[]>) => res.data ?? [],
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "LibraryList", id: "LIST" },
              ...result.map((x) => ({ type: "Library" as const, id: x._id })),
            ]
          : [{ type: "LibraryList", id: "LIST" }],
    }),

    /** GET /library/slug/:slug — single */
    libBySlug: builder.query<ILibrary, LibraryBySlugParams>({
      query: ({ slug, locale }) => ({
        url: `library/slug/${encodeURIComponent(slug)}`,
        method: "GET",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<ILibrary>) => res.data,
      providesTags: (result) => (result ? [{ type: "Library", id: result._id }] : []),
    }),

    /** GET /librarycategory — categories */
    libCategories: builder.query<LibraryCategory[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "librarycategory",
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<LibraryCategory[]>) => res.data ?? [],
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "LibraryCategory", id: "LIST" },
              ...result.map((c) => ({ type: "LibraryCategory" as const, id: c._id })),
            ]
          : [{ type: "LibraryCategory", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

// Hook alias'ları — bileşenlerdeki importlar aynı kalsın
export const {
  useLibListQuery: useLibraryListQuery,
  useLibBySlugQuery: useLibraryBySlugQuery,
  useLibCategoriesQuery: useLibraryCategoriesQuery,
} = libraryApi;
