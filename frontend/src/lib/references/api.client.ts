"use client";

import { rootApi } from "@/lib/rtk/rootApi";
import { buildCommonHeaders } from "@/lib/http";
import type { SupportedLocale } from "@/types/common";
import type {
  IReferences,
  ReferencesCategory,
  ReferencesListParams,
  ReferencesBySlugParams,
  ApiEnvelope,
} from "./types";

export const referencesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /references — list (unique name: referencesList) */
    referencesList: builder.query<IReferences[], ReferencesListParams | void>({
      query: (args) => {
        const locale: SupportedLocale | undefined = args?.locale as any;
        const qs = new URLSearchParams();
        if (args?.page) qs.set("page", String(args.page));
        if (args?.limit) qs.set("limit", String(args.limit));
        if (args?.categorySlug) qs.set("category", args.categorySlug);
        if (args?.q) qs.set("q", args.q);
        if (args?.sort) qs.set("sort", args.sort);

        return {
          url: `references${qs.toString() ? `?${qs.toString()}` : ""}`,
          method: "GET",
          headers: locale ? buildCommonHeaders(locale) : undefined,
        };
      },
      // Hem array hem { data: [...] } zarflarını destekle
      transformResponse: (res: ApiEnvelope<IReferences[]> | IReferences[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
    }),

    /** GET /references/slug/:slug — single (unique name: referencesBySlug) */
    referencesBySlug: builder.query<IReferences, ReferencesBySlugParams>({
      query: ({ slug, locale }) => ({
        url: `references/slug/${encodeURIComponent(slug)}`,
        method: "GET",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<IReferences> | IReferences) =>
        (res && (res as any).data) ? (res as ApiEnvelope<IReferences>).data : (res as IReferences),
    }),

    /** GET /referencescategory — categories (unique name: referencesCategories) */
    referencesCategories: builder.query<ReferencesCategory[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "referencescategory",
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<ReferencesCategory[]> | ReferencesCategory[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
    }),
  }),
  // Artık endpoint adları benzersiz, override gerekmez
  overrideExisting: false,
});

// ➜ Üretilen hook’lar yeni endpoint adlarına göre:
export const {
  useReferencesListQuery,
  useReferencesBySlugQuery,
  useReferencesCategoriesQuery,
} = referencesApi;
