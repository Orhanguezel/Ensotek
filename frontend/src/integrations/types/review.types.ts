// =============================================================
// FILE: src/integrations/types/review.types.ts
// Public Reviews
// =============================================================

/** Backend'deki boolLike ile uyumlu tip */
export type BoolLike =
  | boolean
  | 0
  | 1
  | "0"
  | "1"
  | "true"
  | "false"
  | "yes"
  | "no";

/** Backend ReviewView ile hizalı DTO */
export type ReviewDto = {
  id: string;
  name: string;
  email: string;
  rating: number;

  is_active: boolean;
  is_approved: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;

  // i18n alanları (coalesced)
  comment: string | null;
  locale_resolved: string | null;
};

/* ---------- Public list / detail query tipleri ---------- */

export type ReviewListQueryParams = {
  search?: string;
  approved?: BoolLike;
  active?: BoolLike;
  minRating?: number;
  maxRating?: number;
  limit?: number;
  offset?: number;
  orderBy?: "created_at" | "updated_at" | "display_order" | "rating" | "name";
  order?: "asc" | "desc";

  // Listeleme locale override
  locale?: string;
};

/** Public create input (ReviewCreateInput ile hizalı) */
export type ReviewCreatePayload = {
  locale?: string; // yoksa server req.locale/DEFAULT_LOCALE kullanır

  name: string;
  email: string;
  rating: number;
  comment: string;

  is_active?: boolean;
  is_approved?: boolean;
  display_order?: number;
};

/** Update → tüm alanlar opsiyonel (ReviewUpdateInput.partial) */
export type ReviewUpdatePayload = Partial<ReviewCreatePayload>;
