// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/faqs_admin.endpoints.ts
// Admin FAQ endpoint'leri (auth gerektirir)
// =============================================================

import { baseApi } from "../../baseApi";
import type {
  FaqDto,
  FaqListQueryParams,
  FaqCreatePayload,
  FaqUpdatePayload,
} from "@/integrations/types/faqs.types";

export const faqsAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /admin/faqs – liste (coalesced) */
    listFaqsAdmin: builder.query<FaqDto[], FaqListQueryParams | void>({
      query: (params?: FaqListQueryParams) => ({
        url: "/admin/faqs",
        method: "GET",
        params,
      }),
    }),

    /** GET /admin/faqs/:id – tek kayıt */
    getFaqAdmin: builder.query<FaqDto, string>({
      query: (id) => ({
        url: `/admin/faqs/${id}`,
        method: "GET",
      }),
    }),

    /** GET /admin/faqs/by-slug/:slug – slug ile tek kayıt */
    getFaqBySlugAdmin: builder.query<FaqDto, string>({
      query: (slug) => ({
        url: `/admin/faqs/by-slug/${slug}`,
        method: "GET",
      }),
    }),

    /** POST /admin/faqs – create */
    createFaqAdmin: builder.mutation<FaqDto, FaqCreatePayload>({
      query: (body) => ({
        url: "/admin/faqs",
        method: "POST",
        body,
      }),
    }),

    /** PATCH /admin/faqs/:id – update (partial) */
    updateFaqAdmin: builder.mutation<
      FaqDto,
      { id: string; patch: FaqUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/faqs/${id}`,
        method: "PATCH",
        body: patch,
      }),
    }),

    /** DELETE /admin/faqs/:id – delete */
    deleteFaqAdmin: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/faqs/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListFaqsAdminQuery,
  useGetFaqAdminQuery,
  useGetFaqBySlugAdminQuery,
  useCreateFaqAdminMutation,
  useUpdateFaqAdminMutation,
  useDeleteFaqAdminMutation,
} = faqsAdminApi;
