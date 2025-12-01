"use client";

import { rootApi } from "@/lib/rtk/rootApi";
import { buildCommonHeaders } from "@/lib/http";
import type { SupportedLocale } from "@/types/common";
import type {
  INews,
  NewsCategory,
  NewsListParams,
  NewsBySlugParams,
  ApiEnvelope,
} from "./types";

/** RTK Query — News (public) */
export const newsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /news — list */
    newsList: builder.query<INews[], NewsListParams | void>({
      query: (args) => {
        const locale: SupportedLocale | undefined = args?.locale as any;
        const qs = new URLSearchParams();
        if (args?.page) qs.set("page", String(args.page));
        if (args?.limit) qs.set("limit", String(args.limit));
        if (args?.categorySlug) qs.set("category", args.categorySlug);
        if (args?.q) qs.set("q", args.q);
        if (args?.sort) qs.set("sort", args.sort);

        return {
          url: `news${qs.toString() ? `?${qs.toString()}` : ""}`,
          method: "GET",
          headers: locale ? buildCommonHeaders(locale) : undefined,
        };
      },
      transformResponse: (res: ApiEnvelope<INews[]> | INews[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [{ type: "NewsList" as const, id: "LIST" }, ...result.map((x) => ({ type: "News" as const, id: x._id })) ]
          : [{ type: "NewsList" as const, id: "LIST" }],
    }),

    /** GET /news/slug/:slug — single */
    newsBySlug: builder.query<INews, NewsBySlugParams>({
      query: ({ slug, locale }) => ({
        url: `news/slug/${encodeURIComponent(slug)}`,
        method: "GET",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<INews> | INews) =>
        (res && (res as any).data) ? (res as ApiEnvelope<INews>).data : (res as INews),
      providesTags: (result) => (result ? [{ type: "News" as const, id: result._id }] : []),
    }),

    /** GET /newscategory — categories */
    newsCategories: builder.query<NewsCategory[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "newscategory",
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<NewsCategory[]> | NewsCategory[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
    }),
  }),
  overrideExisting: false, // artık isimler benzersiz, ezmeye gerek yok
});

export const {
  useNewsListQuery,
  useNewsBySlugQuery,
  useNewsCategoriesQuery,
} = newsApi;
