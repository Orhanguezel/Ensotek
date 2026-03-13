// =============================================================
// FILE: src/modules/gallery/validation.ts
// =============================================================
import { z } from 'zod';
import { emptyToNull, boolLike } from '@/modules/_shared';

/* ----------------- GALLERY ----------------- */
export const galleryCreateSchema = z.object({
  id: z.string().uuid().optional(),
  module_key: z.string().min(1).max(64).default('general'),
  source_id: emptyToNull(z.string().uuid().optional().nullable()),
  source_type: z.enum(['product', 'blog', 'reference', 'standalone']).default('standalone'),

  // i18n
  locale: z.string().min(2).max(8).optional(),
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: emptyToNull(z.string().optional().nullable()),

  meta_title: emptyToNull(z.string().max(255).optional().nullable()),
  meta_description: emptyToNull(z.string().max(500).optional().nullable()),

  is_active: boolLike.optional(),
  is_featured: boolLike.optional(),
  display_order: z.coerce.number().int().min(0).optional().default(0),
});

export const galleryUpdateSchema = galleryCreateSchema.partial();

export type GalleryCreateInput = z.infer<typeof galleryCreateSchema>;
export type GalleryUpdateInput = z.infer<typeof galleryUpdateSchema>;

/* ----------------- GALLERY IMAGE ----------------- */
export const galleryImageCreateSchema = z.object({
  id: z.string().uuid().optional(),
  gallery_id: z.string().uuid(),
  storage_asset_id: emptyToNull(z.string().max(64).optional().nullable()),
  image_url: emptyToNull(z.string().url().optional().nullable()),
  display_order: z.coerce.number().int().min(0).optional().default(0),
  is_cover: boolLike.optional(),

  // i18n (opsiyonel, inline)
  locale: z.string().min(2).max(8).optional(),
  alt: emptyToNull(z.string().max(255).optional().nullable()),
  caption: emptyToNull(z.string().max(500).optional().nullable()),
});

export const galleryImageUpdateSchema = galleryImageCreateSchema.partial();

export type GalleryImageCreateInput = z.infer<typeof galleryImageCreateSchema>;
export type GalleryImageUpdateInput = z.infer<typeof galleryImageUpdateSchema>;

/* ----------------- BULK IMAGE ADD ----------------- */
export const galleryBulkImagesSchema = z.object({
  gallery_id: z.string().uuid(),
  images: z.array(
    z.object({
      storage_asset_id: z.string().max(64),
      image_url: z.string().url(),
      display_order: z.coerce.number().int().min(0).optional().default(0),
      is_cover: boolLike.optional(),
    }),
  ).min(1),
});

export type GalleryBulkImagesInput = z.infer<typeof galleryBulkImagesSchema>;
