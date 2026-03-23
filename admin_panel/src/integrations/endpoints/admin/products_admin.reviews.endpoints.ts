// =============================================================
// FILE: src/integrations/endpoints/admin/products_admin.reviews.endpoints.ts
// Admin Product Reviews RTK Endpoints
// Routes: /admin/products/:id/reviews
// =============================================================

import { baseApi } from "@/integrations/baseApi";
import type {
  AdminProductReviewCreatePayload,
  AdminProductReviewDto,
  AdminProductReviewListParams,
} from "@/integrations/shared/product_reviews_admin.types";

export const productReviewsAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /admin/products/:id/reviews
    listProductReviewsAdmin: build.query<AdminProductReviewDto[], AdminProductReviewListParams>({
      query: ({ productId, order }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/reviews`,
        method: "GET",
        params: order ? { order } : {},
        credentials: "include",
      }),
      transformResponse: (response: AdminProductReviewDto[]) => (Array.isArray(response) ? response : []),
      providesTags: (_result, _error, { productId }) => [
        { type: "AdminProducts" as const, id: `REVIEWS_${productId}` },
      ],
    }),

    // POST /admin/products/:id/reviews
    createProductReviewAdmin: build.mutation<
      AdminProductReviewDto,
      { productId: string; payload: AdminProductReviewCreatePayload }
    >({
      query: ({ productId, payload }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/reviews`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "AdminProducts" as const, id: `REVIEWS_${productId}` },
        { type: "AdminProducts" as const, id: productId },
      ],
    }),

    // PATCH /admin/products/:id/reviews/:reviewId/active  (toggle)
    toggleProductReviewActiveAdmin: build.mutation<
      AdminProductReviewDto,
      { productId: string; reviewId: string; is_active: boolean }
    >({
      query: ({ productId, reviewId, is_active }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/reviews/${encodeURIComponent(reviewId)}/active`,
        method: "PATCH",
        body: { is_active },
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "AdminProducts" as const, id: `REVIEWS_${productId}` },
      ],
    }),

    // DELETE /admin/products/:id/reviews/:reviewId
    deleteProductReviewAdmin: build.mutation<void, { productId: string; reviewId: string }>({
      query: ({ productId, reviewId }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/reviews/${encodeURIComponent(reviewId)}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "AdminProducts" as const, id: `REVIEWS_${productId}` },
        { type: "AdminProducts" as const, id: productId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListProductReviewsAdminQuery,
  useCreateProductReviewAdminMutation,
  useToggleProductReviewActiveAdminMutation,
  useDeleteProductReviewAdminMutation,
} = productReviewsAdminApi;
