// =============================================================
// FILE: src/integrations/shared/review_admin.types.ts
// Admin Reviews
// =============================================================

import type { ReviewCreatePayload, ReviewDto, ReviewListQueryParams, ReviewUpdatePayload } from "@/integrations/shared";

export type AdminReviewDto = ReviewDto;

export type AdminReviewListQueryParams = ReviewListQueryParams;

export type AdminReviewListResponse = {
  items: AdminReviewDto[];
  total: number;
};

export type AdminGetReviewParams = {
  id: string;
};

export type AdminReviewCreatePayload = ReviewCreatePayload;
export type AdminReviewUpdatePayload = ReviewUpdatePayload;
