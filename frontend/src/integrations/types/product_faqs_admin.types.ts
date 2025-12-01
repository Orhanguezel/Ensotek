// =============================================================
// FILE: src/integrations/types/admin/product_faqs_admin.types.ts
// Admin Product FAQs
// =============================================================

import type { BoolLike } from "./product.types";

export type AdminProductFaqDto = {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminProductFaqListParams = {
  productId: string;
  only_active?: BoolLike;
};

export type AdminProductFaqCreatePayload = {
  id?: string;
  question: string;
  answer: string;
  display_order?: number;
  is_active?: BoolLike;
};

export type AdminProductFaqUpdatePayload = Partial<AdminProductFaqCreatePayload>;

export type AdminProductFaqReplacePayload = {
  faqs?: AdminProductFaqCreatePayload[];
  items?: AdminProductFaqCreatePayload[];
};
