// =============================================================
// FILE: src/integrations/types/custom_pages.types.ts
// Ensotek – Custom Pages (Sayfalar) RTK Tipleri
// Backend: src/modules/customPages/*
// =============================================================

/**
 * Backend'deki boolLike ile uyumlu
 */
export type BoolLike =
  | boolean
  | 0
  | 1
  | "0"
  | "1"
  | "true"
  | "false";

/** Sıralama alanları */
export type CustomPageSortField = "created_at" | "updated_at";
export type SortDirection = "asc" | "desc";

/* ------------------------------------------------------------------
 * LIST QUERY PARAMS (public + admin)
 * Backend: customPageListQuerySchema
 * ------------------------------------------------------------------ */

export interface CustomPageListQueryParams {
  order?: string;
  sort?: CustomPageSortField;
  orderDir?: SortDirection;
  limit?: number;
  offset?: number;

  is_published?: BoolLike;
  q?: string;
  slug?: string;
  select?: string;

  category_id?: string;
  sub_category_id?: string;

  module_key?: string;

  /** Liste locale override */
  locale?: string;
}

export type CustomPageListAdminQueryParams = CustomPageListQueryParams;

/**
 * Public list – is_published backend’de zaten filtreleniyor ama
 * ayrı bir alias ile semantik ayrımı koruyoruz.
 */
export type CustomPageListPublicQueryParams = CustomPageListQueryParams;

/* ------------------------------------------------------------------
 * API DTO – Backend CustomPageMerged ile birebir
 * ------------------------------------------------------------------ */

export interface ApiCustomPage {
  id: string;
  is_published: 0 | 1;
  featured_image: string | null;
  featured_image_asset_id: string | null;
  created_at: string;
  updated_at: string;

  category_id: string | null;
  sub_category_id: string | null;

  title: string | null;
  slug: string | null;

  /**
   * Backend: JSON-string {"html":"..."}
   * repo: CustomPageMerged.content
   */
  content: string | null;

  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  locale_resolved: string | null;
}

/* ------------------------------------------------------------------
 * FE DTO – Normalize edilmiş CustomPage
 *  - is_published → boolean
 *  - content_raw: backend JSON-string
 *  - content_html / content: düz HTML
 * ------------------------------------------------------------------ */

export interface CustomPageDto {
  id: string;
  is_published: boolean;
  featured_image: string | null;
  featured_image_asset_id: string | null;
  created_at: string;
  updated_at: string;

  category_id: string | null;
  sub_category_id: string | null;

  title: string | null;
  slug: string | null;

  /**
   * Backend’ten gelen JSON-string ("{\"html\":\"...\"}")
   */
  content_raw: string | null;

  /**
   * Parse edilmiş düz HTML – render ve form için kullanılacak
   */
  content_html: string;

  /**
   * Form komponentleri için kısa alias.
   * CustomPageForm bu alanı okuyor.
   */
  content: string;

  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  locale_resolved: string | null;
}

/* ------------------------------------------------------------------
 * Normalizer helper
 * ------------------------------------------------------------------ */

type ContentJson = {
  html?: string;
  // Diğer key'ler önemli değil, sadece html'i kullanıyoruz.
  [key: string]: unknown;
};

const unpackContent = (raw: string | null): string => {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw) as ContentJson;
    if (typeof parsed.html === "string") {
      return parsed.html;
    }
    // html anahtarı yoksa, direkt string’i dön
    return raw;
  } catch {
    // düzgün JSON değilse olduğu gibi kullan
    return raw;
  }
};

const toBoolFrom01 = (v: 0 | 1): boolean => v === 1;

/**
 * API -> FE DTO dönüşümü
 */
export const normalizeCustomPage = (api: ApiCustomPage): CustomPageDto => {
  const html = unpackContent(api.content);

  return {
    id: api.id,
    is_published: toBoolFrom01(api.is_published),
    featured_image: api.featured_image ?? null,
    featured_image_asset_id: api.featured_image_asset_id ?? null,
    created_at: String(api.created_at),
    updated_at: String(api.updated_at),

    category_id: api.category_id ?? null,
    sub_category_id: api.sub_category_id ?? null,

    title: api.title ?? null,
    slug: api.slug ?? null,

    content_raw: api.content ?? null,
    content_html: html,
    content: html,

    featured_image_alt: api.featured_image_alt ?? null,
    meta_title: api.meta_title ?? null,
    meta_description: api.meta_description ?? null,
    locale_resolved: api.locale_resolved ?? null,
  };
};

/**
 * Eski isimlendirme ile uyum için alias.
 * Endpoint’ler mapApiCustomPageToDto ismini kullanıyor.
 */
export const mapApiCustomPageToDto = normalizeCustomPage;

/* ------------------------------------------------------------------
 * PAYLOAD – CREATE / UPDATE
 * Backend: UpsertCustomPageBody, PatchCustomPageBody
 * ------------------------------------------------------------------ */

/** POST /admin/custom_pages */
export interface CustomPageCreatePayload {
  // i18n zorunlu alanlar
  locale?: string;
  title: string;
  slug: string;
  /** düz HTML – backend packContent ile {"html":"..."} yapar */
  content: string;

  featured_image_alt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;

  // parent alanları
  is_published?: BoolLike;
  featured_image?: string | null;
  featured_image_asset_id?: string | null;

  category_id?: string | null;
  sub_category_id?: string | null;
}

/** PATCH /admin/custom_pages/:id */
export interface CustomPageUpdatePayload {
  locale?: string;

  // parent
  is_published?: BoolLike;
  featured_image?: string | null;
  featured_image_asset_id?: string | null;
  category_id?: string | null;
  sub_category_id?: string | null;

  // i18n (hepsi opsiyonel)
  title?: string;
  slug?: string;
  content?: string;
  featured_image_alt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}
