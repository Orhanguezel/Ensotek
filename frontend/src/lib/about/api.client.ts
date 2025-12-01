"use client";

import { rootApi } from "@/lib/rtk/rootApi";
import type { SupportedLocale } from "@/types/common";
import type { IAbout, AboutCategory, AboutBySlugParams, ApiEnvelope } from "./types";

/** Public list query params */
export type AboutListParams = {
  category?: string;
  onlyLocalized?: boolean;
  locale?: SupportedLocale;
};

/** RTK Query — About (public, ABOUTUS kullan) */
export const aboutApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /aboutus — public list */
    aboutList: builder.query<IAbout[], AboutListParams | void>({
      query: (args) => {
        const params: Record<string, any> = {};
        if (args?.category) params.category = String(args.category);
        if (args?.onlyLocalized) params.onlyLocalized = "true";

        const headers = args?.locale
          ? { "accept-language": String(args.locale) }
          : undefined;

        return { url: "aboutus", method: "GET", params, headers };
      },
      transformResponse: (res: ApiEnvelope<IAbout[]> | IAbout[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [{ type: "AboutList" as const, id: "LIST" }, ...result.map((x) => ({ type: "About" as const, id: x._id })) ]
          : [{ type: "AboutList" as const, id: "LIST" }],
    }),

    /** GET /aboutus/slug/:slug — public single */
    aboutBySlug: builder.query<IAbout, AboutBySlugParams>({
      query: ({ slug, locale }) => ({
        url: `aboutus/slug/${encodeURIComponent(slug)}`,
        method: "GET",
        headers: locale ? { "accept-language": String(locale) } : undefined,
      }),
      transformResponse: (res: ApiEnvelope<IAbout> | IAbout) =>
        (res as any)?.data ?? (res as IAbout),
      providesTags: (result) => (result ? [{ type: "About" as const, id: result._id }] : []),
    }),

    /** GET /aboutcategory — categories (public) */
    aboutCategories: builder.query<AboutCategory[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "aboutcategory",
        method: "GET",
        headers: args?.locale ? { "accept-language": String(args.locale) } : undefined,
      }),
      transformResponse: (res: ApiEnvelope<AboutCategory[]> | AboutCategory[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [{ type: "AboutCategory" as const, id: "LIST" }, ...result.map((c) => ({ type: "AboutCategory" as const, id: c._id })) ]
          : [{ type: "AboutCategory" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAboutListQuery,
  useAboutBySlugQuery,
  useAboutCategoriesQuery,
} = aboutApi;
