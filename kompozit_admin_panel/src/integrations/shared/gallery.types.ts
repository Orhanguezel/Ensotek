// =============================================================
// FILE: src/integrations/shared/gallery.types.ts
// Ensotek – Gallery (Galeri) tipleri
// Backend: src/modules/gallery/*
// =============================================================

import type { BoolLike } from '@/integrations/shared';

/* -------------------------------------------------------------
 * LIST QUERY (public + admin ortak)
 * ----------------------------------------------------------- */

export type GalleryListQueryParams = {
  order?: string;
  sort?: 'created_at' | 'updated_at' | 'display_order';
  orderDir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;

  is_active?: BoolLike;
  is_featured?: BoolLike;

  q?: string;
  slug?: string;

  module_key?: string;
  source_type?: string;
  source_id?: string;

  locale?: string;
};

/* -------------------------------------------------------------
 * GalleryDto (admin list/detail)
 * ----------------------------------------------------------- */

export interface GalleryAssetInfo {
  bucket: string;
  path: string;
  url: string | null;
  width: number | null;
  height: number | null;
  mime: string | null;
}

export interface GalleryDto {
  id: string;
  is_active: 0 | 1;
  is_featured: 0 | 1;
  display_order: number;

  module_key: string | null;
  source_type: string | null;
  source_id: string | null;

  cover_image: string | null;
  cover_asset_id: string | null;

  created_at: string | Date;
  updated_at: string | Date;

  // i18n fields
  title: string | null;
  slug: string | null;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  cover_image_alt: string | null;

  locale_resolved: string | null;
  locale?: string | null;

  cover_image_url_resolved: string | null;
  cover_asset?: GalleryAssetInfo | null;

  image_count?: number;
}

/* -------------------------------------------------------------
 * CREATE / UPDATE gövdesi (admin)
 * ----------------------------------------------------------- */

export interface GalleryUpsertPayload {
  is_active?: BoolLike;
  is_featured?: BoolLike;
  display_order?: number;

  module_key?: string | null;
  source_type?: string | null;
  source_id?: string | null;

  cover_image?: string | null;
  cover_asset_id?: string | null;

  // i18n
  locale?: string;
  title?: string;
  slug?: string;
  description?: string | null;
  cover_image_alt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;

  replicate_all_locales?: boolean;
  apply_all_locales?: boolean;
}

/* -------------------------------------------------------------
 * GALLERY IMAGE tipleri
 * ----------------------------------------------------------- */

export interface GalleryImageAssetInfo {
  bucket: string;
  path: string;
  url: string | null;
  width: number | null;
  height: number | null;
  mime: string | null;
}

export interface GalleryImageDto {
  id: string;
  gallery_id: string;
  asset_id: string;
  image_url: string | null;
  display_order: number;
  is_active: 0 | 1;
  created_at: string | Date;
  updated_at: string | Date;

  alt: string | null;
  caption: string | null;
  locale_resolved: string | null;

  image_url_resolved: string | null;
  asset?: GalleryImageAssetInfo | null;
}

export interface GalleryImageUpsertPayload {
  asset_id?: string;
  image_url?: string | null;
  display_order?: number;
  is_active?: BoolLike;

  locale?: string;
  alt?: string | null;
  caption?: string | null;

  replicate_all_locales?: boolean;
  apply_all_locales?: boolean;
}

/* -------------------------------------------------------------
 * LIST response
 * ----------------------------------------------------------- */

export interface GalleryListResponse {
  items: GalleryDto[];
  total: number;
}

/* -------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------- */

export const serializeGalleryListQuery = (q?: GalleryListQueryParams): Record<string, any> => {
  if (!q) return {};
  const params: Record<string, any> = {};

  if (q.order) params.order = q.order;
  if (q.sort) params.sort = q.sort;
  if (q.orderDir) params.orderDir = q.orderDir;
  if (typeof q.limit === 'number') params.limit = q.limit;
  if (typeof q.offset === 'number') params.offset = q.offset;

  if (typeof q.is_active !== 'undefined') params.is_active = q.is_active;
  if (typeof q.is_featured !== 'undefined') params.is_featured = q.is_featured;

  if (q.q) params.q = q.q;
  if (q.slug) params.slug = q.slug;

  if (q.module_key) params.module_key = q.module_key;
  if (q.source_type) params.source_type = q.source_type;
  if (q.source_id) params.source_id = q.source_id;

  if (q.locale) params.locale = q.locale;

  return params;
};

export const withResolvedGalleryLocale = (r: GalleryDto): GalleryDto => ({
  ...r,
  locale: (r.locale_resolved ?? r.locale ?? null) as any,
});
