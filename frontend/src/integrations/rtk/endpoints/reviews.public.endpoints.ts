// =============================================================
// FILE: src/integrations/rtk/endpoints/reviews.public.endpoints.ts
// Public Reviews RTK Query endpoints
// =============================================================

import type {
  ReviewDto,
  ReviewListQueryParams,
  ReviewCreatePayload,
} from "@/integrations/types/review.types";

import { baseApi } from "../baseApi";

export const reviewsPublicEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /reviews
    listReviewsPublic: build.query<ReviewDto[], ReviewListQueryParams | void>({
      query: (params) => {
        // RTK FetchArgs.params: Record<string, any> | undefined bekliyor
        const queryParams: Record<string, any> | undefined = params
          ? (params as Record<string, any>)
          : undefined;

        return {
          url: "/reviews",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result && result.length
          ? [
              ...result.map((r) => ({ type: "Review" as const, id: r.id })),
              { type: "Review" as const, id: "LIST" },
            ]
          : [{ type: "Review" as const, id: "LIST" }],
    }),

    // GET /reviews/:id
    getReviewPublic: build.query<ReviewDto, string>({
      query: (id) => ({
        url: `/reviews/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Review" as const, id }],
    }),

    // POST /reviews
    createReviewPublic: build.mutation<ReviewDto, ReviewCreatePayload>({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Review" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListReviewsPublicQuery,
  useGetReviewPublicQuery,
  useCreateReviewPublicMutation,
} = reviewsPublicEndpoints;
