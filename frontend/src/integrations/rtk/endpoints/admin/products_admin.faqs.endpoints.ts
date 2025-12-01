// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/product_faqs_admin.endpoints.ts
// Admin Product FAQs
// =============================================================

import { baseApi } from "../../baseApi";
import type {
  AdminProductFaqDto,
  AdminProductFaqListParams,
  AdminProductFaqCreatePayload,
  AdminProductFaqUpdatePayload,
  AdminProductFaqReplacePayload,
} from "@/integrations/types/product_faqs_admin.types";

export const productFaqsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // LIST
    listProductFaqsAdmin: build.query<AdminProductFaqDto[], AdminProductFaqListParams>(
      {
        query: ({ productId, only_active }) => ({
          url: `/admin/products/${encodeURIComponent(productId)}/faqs`,
          method: "GET",
          params:
            only_active === undefined
              ? undefined
              : { only_active },
        }),
      },
    ),

    // CREATE
    createProductFaqAdmin: build.mutation<
      AdminProductFaqDto,
      { productId: string; payload: AdminProductFaqCreatePayload }
    >({
      query: ({ productId, payload }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/faqs`,
        method: "POST",
        body: payload,
      }),
    }),

    // UPDATE
    updateProductFaqAdmin: build.mutation<
      AdminProductFaqDto,
      { productId: string; faqId: string; patch: AdminProductFaqUpdatePayload }
    >({
      query: ({ productId, faqId, patch }) => ({
        url: `/admin/products/${encodeURIComponent(
          productId,
        )}/faqs/${encodeURIComponent(faqId)}`,
        method: "PATCH",
        body: patch,
      }),
    }),

    // TOGGLE ACTIVE
    toggleProductFaqActiveAdmin: build.mutation<
      { ok: boolean },
      { productId: string; faqId: string; is_active: boolean }
    >({
      query: ({ productId, faqId, is_active }) => ({
        url: `/admin/products/${encodeURIComponent(
          productId,
        )}/faqs/${encodeURIComponent(faqId)}/active`,
        method: "PATCH",
        body: { is_active },
      }),
    }),

    // DELETE
    deleteProductFaqAdmin: build.mutation<
      { ok: boolean },
      { productId: string; faqId: string }
    >({
      query: ({ productId, faqId }) => ({
        url: `/admin/products/${encodeURIComponent(
          productId,
        )}/faqs/${encodeURIComponent(faqId)}`,
        method: "DELETE",
      }),
    }),

    // REPLACE (PUT /faqs)
    replaceProductFaqsAdmin: build.mutation<
      AdminProductFaqDto[],
      { productId: string; payload: AdminProductFaqReplacePayload }
    >({
      query: ({ productId, payload }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/faqs`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListProductFaqsAdminQuery,
  useCreateProductFaqAdminMutation,
  useUpdateProductFaqAdminMutation,
  useToggleProductFaqActiveAdminMutation,
  useDeleteProductFaqAdminMutation,
  useReplaceProductFaqsAdminMutation,
} = productFaqsAdminApi;
