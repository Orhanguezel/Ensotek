// =============================================================
// FILE: src/integrations/types/faqs.types.ts
// =============================================================

export type Bool01 = 0 | 1;
export type BoolLike = boolean | 0 | 1 | "0" | "1" | "true" | "false";

export type FaqSortable = "created_at" | "updated_at" | "display_order";

/**
 * Backend'in döndürdüğü birleşik model (FaqMerged)
 * controller.ts -> list/get/getBySlug
 */
export interface FaqDto {
  id: string;
  is_active: Bool01;
  display_order: number;
  created_at: string | Date;
  updated_at: string | Date;

  question: string | null;
  answer: string | null;
  slug: string | null;
  category: string | null;

  /** Hangi locale’den geldiğini gösteren alan (fi_req vs fi_def) */
  locale_resolved: string | null;
}

/**
 * UI tarafında kullanmak için normalize edilmiş model (opsiyonel ama faydalı)
 */
export interface Faq {
  id: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  question: string;
  answer: string;
  slug: string;
  category: string | null;
  locale_resolved: string | null;
}

export const normalizeFaq = (dto: FaqDto): Faq => ({
  id: dto.id,
  // Backend artık 0 | 1 döndürüyor; string/boolean beklemiyoruz.
  is_active: dto.is_active === 1,
  display_order: dto.display_order ?? 0,
  created_at:
    typeof dto.created_at === "string"
      ? dto.created_at
      : dto.created_at?.toISOString?.() ?? "",
  updated_at:
    typeof dto.updated_at === "string"
      ? dto.updated_at
      : dto.updated_at?.toISOString?.() ?? "",
  question: dto.question ?? "",
  answer: dto.answer ?? "",
  slug: dto.slug ?? "",
  category: dto.category ?? null,
  locale_resolved: dto.locale_resolved ?? null,
});

/**
 * LIST query params – backend'deki FaqListQuery ile uyumlu
 * (validation.ts -> faqListQuerySchema)
 */
export interface FaqListQueryParams {
  order?: string; // "created_at.asc" gibi
  sort?: FaqSortable;
  orderDir?: "asc" | "desc";
  limit?: number;
  offset?: number;

  is_active?: BoolLike;
  q?: string;
  slug?: string;
  category?: string;
  select?: string;
}

/**
 * CREATE payload – upsertFaqBodySchema ile uyumlu
 */
export interface FaqCreatePayload {
  // i18n
  question: string;
  answer: string;
  slug: string;
  category?: string | null;
  locale?: string;

  // parent
  is_active?: BoolLike;
  display_order?: number;
}

/**
 * UPDATE payload – patchFaqBodySchema ile uyumlu
 */
export interface FaqUpdatePayload {
  // i18n (hepsi opsiyonel)
  question?: string;
  answer?: string;
  slug?: string;
  category?: string | null;
  locale?: string;

  // parent
  is_active?: BoolLike;
  display_order?: number;
}
