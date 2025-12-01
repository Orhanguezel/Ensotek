// =============================================================
// FILE: src/integrations/types/library.types.ts
// Ensotek – Library tipleri (DB/DTO + payloadlar)
// =============================================================

/**
 * Backend'deki boolLike ile uyumlu tip
 */
export type BoolLike =
  | boolean
  | 0
  | 1
  | "0"
  | "1"
  | "true"
  | "false";

/**
 * Backend'deki LibraryView ile bire bir DTO
 * (listLibraries / getLibrary* controller çıktısı)
 */
export interface LibraryDto {
  id: string;

  is_published: 0 | 1;
  is_active: 0 | 1;
  display_order: number;

  tags: string[] | null;

  category_id: string | null;
  sub_category_id: string | null;

  author: string | null;
  views: number;
  download_count: number;
  /** ISO string veya Date – backend string’e çevirip gönderiyor */
  published_at: string | null;

  created_at: string | Date;
  updated_at: string | Date;

  title: string | null;
  slug: string | null;
  summary: string | null;
  /** packContent(JSON-string) – şimdilik string olarak kullanıyoruz */
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;

  /** hangi locale’den resolve edildi (req vs default) */
  locale_resolved: string | null;
}

/**
 * LIST query parametreleri
 * (libraryListQuerySchema + public ListQuery ile uyumlu)
 */
export interface LibraryListQueryParams {
  /** "created_at.asc" gibi birleşik order paramı (opsiyonel) */
  order?: string;
  sort?:
    | "created_at"
    | "updated_at"
    | "published_at"
    | "display_order"
    | "views"
    | "download_count";
  orderDir?: "asc" | "desc";

  limit?: number;
  offset?: number;

  is_published?: BoolLike;
  is_active?: BoolLike;

  q?: string;
  slug?: string;
  select?: string;

  category_id?: string;
  sub_category_id?: string;
  author?: string;
  locale?: string;

  published_before?: string; // ISO datetime
  published_after?: string; // ISO datetime
}

/**
 * Public list için de aynı query tipini kullanabiliriz.
 */
export type LibraryPublicListQueryParams = LibraryListQueryParams;

/* ============== CREATE / UPDATE payload (library) ============== */

/**
 * Create payload – upsertLibraryBodySchema ile uyumlu
 * (parent + i18n birleşik)
 */
export interface LibraryCreatePayload {
  // parent
  is_published?: BoolLike; // default false
  is_active?: BoolLike; // default true
  display_order?: number;

  tags?: string[]; // backend’de JSON-string’e çevriliyor

  category_id?: string | null;
  sub_category_id?: string | null;

  author?: string | null;

  /** ISO datetime string veya null */
  published_at?: string | null;

  // i18n
  locale?: string;

  title?: string;
  slug?: string;

  summary?: string | null;
  /** HTML veya {"html": "..."} JSON-string */
  content?: string;

  meta_title?: string | null;
  meta_description?: string | null;

  /** create: tüm dillere kopyala? (default: true) */
  replicate_all_locales?: boolean;
}

/**
 * Update payload – patchLibraryBodySchema ile uyumlu
 * (partial + apply_all_locales)
 */
export interface LibraryUpdatePayload {
  // parent (hepsi opsiyonel)
  is_published?: BoolLike;
  is_active?: BoolLike;
  display_order?: number;

  tags?: string[] | null;

  category_id?: string | null;
  sub_category_id?: string | null;

  author?: string | null;

  published_at?: string | null;

  // i18n (hepsi opsiyonel)
  locale?: string;

  title?: string;
  slug?: string;

  summary?: string | null;
  content?: string;
  meta_title?: string | null;
  meta_description?: string | null;

  /** patch: tüm dillere uygula? (default: false) */
  apply_all_locales?: boolean;
}

/* ============== IMAGES DTO + payload ============== */

/**
 * Backend'deki LibraryImageView ile bire bir DTO
 */
export interface LibraryImageDto {
  id: string;
  library_id: string;
  asset_id: string;

  /** resolved url (image_url veya storage publicUrl) */
  url: string | null;
  /** thumb_url veya url */
  thumbnail: string | null;
  /** webp_url veya null */
  webp: string | null;

  alt: string | null;
  caption: string | null;

  display_order: number;
  is_active: 0 | 1;

  created_at: string | Date;
  updated_at: string | Date;

  asset?:
    | {
        bucket: string;
        path: string;
        url: string | null;
        width: number | null;
        height: number | null;
        mime: string | null;
      }
    | null;
}

/**
 * Create payload – upsertLibraryImageBodySchema ile uyumlu
 * (parent + i18n)
 */
export interface LibraryImageCreatePayload {
  asset_id: string;
  image_url?: string | null;
  thumb_url?: string | null;
  webp_url?: string | null;
  display_order?: number;
  is_active?: BoolLike;

  locale?: string;
  alt?: string | null;
  caption?: string | null;

  /** create: tüm dillere kopyala? (default: true) */
  replicate_all_locales?: boolean;
}

/**
 * Update payload – patchLibraryImageBodySchema ile uyumlu
 */
export interface LibraryImageUpdatePayload {
  asset_id?: string;
  image_url?: string | null;
  thumb_url?: string | null;
  webp_url?: string | null;
  display_order?: number;
  is_active?: BoolLike;

  locale?: string;
  alt?: string | null;
  caption?: string | null;

  /** patch: tüm dillere uygula? (default: false) */
  apply_all_locales?: boolean;
}

/* ============== FILES DTO + payload ============== */

/**
 * Backend'deki LibraryFileView ile bire bir DTO
 */
export interface LibraryFileDto {
  id: string;
  library_id: string;
  asset_id: string;

  url: string | null;
  name: string;
  size_bytes: number | null;
  mime_type: string | null;

  display_order: number;
  is_active: 0 | 1;

  created_at: string | Date;
  updated_at: string | Date;

  asset?:
    | {
        bucket: string;
        path: string;
        url: string | null;
        mime: string | null;
      }
    | null;
}

/**
 * Create payload – upsertLibraryFileParentBodySchema ile uyumlu
 */
export interface LibraryFileCreatePayload {
  asset_id: string;
  file_url?: string | null;
  name: string;
  size_bytes?: number | null;
  mime_type?: string | null;
  display_order?: number;
  is_active?: BoolLike;
}

/**
 * Update payload – patchLibraryFileParentBodySchema ile uyumlu
 */
export interface LibraryFileUpdatePayload {
  asset_id?: string;
  file_url?: string | null;
  name?: string;
  size_bytes?: number | null;
  mime_type?: string | null;
  display_order?: number;
  is_active?: BoolLike;
}
