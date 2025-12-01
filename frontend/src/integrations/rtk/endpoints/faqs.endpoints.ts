// =============================================================
// FILE: src/integrations/rtk/endpoints/faqs.endpoints.ts
// Public (auth'suz) FAQ endpoint'leri
// =============================================================

import { baseApi } from "../baseApi";
import type {
  FaqDto,
  FaqListQueryParams,
} from "@/integrations/types/faqs.types";

export const faqsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /faqs – liste (public) */
    listFaqs: builder.query<FaqDto[], FaqListQueryParams | void>({
      query: (params?: FaqListQueryParams) => ({
        url: "/faqs",
        method: "GET",
        params,
      }),
      // x-total-count lazım olursa meta'dan okunabilir
      // transformResponse: (response: FaqDto[], meta) => ({ items: response, total: Number(meta?.response?.headers?.get("x-total-count") ?? "0") })
    }),

    /** GET /faqs/:id – tek kayıt (public) */
    getFaq: builder.query<FaqDto, string>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: "GET",
      }),
    }),

    /** GET /faqs/by-slug/:slug – slug ile tek kayıt (public) */
    getFaqBySlug: builder.query<FaqDto, string>({
      query: (slug) => ({
        url: `/faqs/by-slug/${slug}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListFaqsQuery,
  useGetFaqQuery,
  useGetFaqBySlugQuery,
} = faqsApi;
