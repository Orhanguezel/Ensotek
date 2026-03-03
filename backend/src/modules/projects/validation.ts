// ---------------------------------------------------------------------
// FILE: modules/projects/validation.ts
// Ensotek endüstriyel proje alanları
// ---------------------------------------------------------------------
import { z } from 'zod';
import { boolLike, LOCALE_ENUM, REL_OR_URL } from '@/modules/_shared';


export const projectListQuerySchema = z.object({
  order: z.string().optional(),
  sort: z.enum(['created_at', 'updated_at', 'display_order']).optional(),
  orderDir: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),

  is_published: boolLike.optional(),
  is_featured: boolLike.optional(),

  q: z.string().optional(),
  slug: z.string().optional(),

  category: z.string().optional(),
  location: z.string().optional(),
  client: z.string().optional(),

  view: z.enum(['card', 'detail']).optional(),
  select: z.string().optional(),
});
export type ProjectListQuery = z.infer<typeof projectListQuerySchema>;

/* ================= PARENT (projects) ================= */
export const upsertProjectParentBodySchema = z.object({
  is_published: boolLike.optional().default(false),
  is_featured: boolLike.optional().default(false),
  display_order: z.coerce.number().int().min(0).optional(),

  featured_image: REL_OR_URL.nullable().optional(),
  featured_image_asset_id: z.string().length(36).nullable().optional(),

  // Ensotek industrial fields
  category: z.string().max(100).nullable().optional(),          // "Su Soğutma Kulesi", "HVAC"
  product_type: z.string().max(150).nullable().optional(),      // "CTP Kaportalı Açık Tip"
  location: z.string().max(255).nullable().optional(),          // "İstanbul"
  client_name: z.string().max(255).nullable().optional(),
  unit_count: z.coerce.number().int().min(0).nullable().optional(),
  fan_count: z.coerce.number().int().min(0).nullable().optional(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  complete_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  completion_time_label: z.string().max(100).nullable().optional(),
  website_url: z.string().url().nullable().optional(),
  youtube_url: z.string().url().nullable().optional(),

  services: z.array(z.string().min(1).max(200)).max(50).optional(),
  techs: z.array(z.string().min(1).max(100)).max(100).optional(),
});
export type UpsertProjectParentBody = z.infer<typeof upsertProjectParentBodySchema>;

export const patchProjectParentBodySchema = upsertProjectParentBodySchema.partial();
export type PatchProjectParentBody = z.infer<typeof patchProjectParentBodySchema>;

/* ================= I18N (projects_i18n) ================= */
export const upsertProjectI18nBodySchema = z.object({
  locale: LOCALE_ENUM.optional(),
  title: z.string().min(1).max(255).trim(),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug sadece küçük harf, rakam ve tire içermelidir')
    .trim(),

  summary: z.string().max(4000).nullable().optional(),
  content: z.string().min(1),

  featured_image_alt: z.string().max(255).nullable().optional(),
  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().max(500).nullable().optional(),
});
export type UpsertProjectI18nBody = z.infer<typeof upsertProjectI18nBodySchema>;

export const patchProjectI18nBodySchema = z.object({
  locale: LOCALE_ENUM.optional(),
  title: z.string().min(1).max(255).trim().optional(),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug sadece küçük harf, rakam ve tire içermelidir')
    .trim()
    .optional(),

  summary: z.string().max(4000).nullable().optional(),
  content: z.string().min(1).optional(),

  featured_image_alt: z.string().max(255).nullable().optional(),
  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().max(500).nullable().optional(),
});
export type PatchProjectI18nBody = z.infer<typeof patchProjectI18nBodySchema>;

/* ================= COMBINED ================= */
export const upsertProjectBodySchema = upsertProjectParentBodySchema.merge(
  upsertProjectI18nBodySchema,
);
export type UpsertProjectBody = z.infer<typeof upsertProjectBodySchema>;

export const patchProjectBodySchema = patchProjectParentBodySchema.merge(
  patchProjectI18nBodySchema,
);
export type PatchProjectBody = z.infer<typeof patchProjectBodySchema>;

/* ================= GALLERY ================= */
export const upsertProjectImageBodySchema = z.object({
  locale: LOCALE_ENUM.optional(),

  asset_id: z.string().length(36),
  image_url: REL_OR_URL.nullable().optional(),

  display_order: z.coerce.number().int().min(0).optional(),
  is_active: boolLike.optional().default(true),

  alt: z.string().max(255).nullable().optional(),
  caption: z.string().max(4000).nullable().optional(),
});
export type UpsertProjectImageBody = z.infer<typeof upsertProjectImageBodySchema>;

export const patchProjectImageBodySchema = z.object({
  locale: LOCALE_ENUM.optional(),

  asset_id: z.string().length(36).optional(),
  image_url: REL_OR_URL.nullable().optional(),

  display_order: z.coerce.number().int().min(0).optional(),
  is_active: boolLike.optional(),

  alt: z.string().max(255).nullable().optional(),
  caption: z.string().max(4000).nullable().optional(),
});
export type PatchProjectImageBody = z.infer<typeof patchProjectImageBodySchema>;
