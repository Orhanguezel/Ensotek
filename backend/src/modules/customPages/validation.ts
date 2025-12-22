// =============================================================
// FILE: src/modules/customPages/validation.ts
// FINAL — locale validation runtime-safe (no z.enum(LOCALES))
// =============================================================

import { z } from 'zod';
import { normalizeLocale } from '@/core/i18n';

export const boolLike = z.union([
  z.boolean(),
  z.literal(0),
  z.literal(1),
  z.literal('0'),
  z.literal('1'),
  z.literal('true'),
  z.literal('false'),
]);

const LOCALE_LIKE = z
  .string()
  .trim()
  .min(1)
  .transform((s) => normalizeLocale(s) || s.toLowerCase());

/** LIST query (public/admin ortak) */
export const customPageListQuerySchema = z.object({
  order: z.string().optional(),
  sort: z.enum(['created_at', 'updated_at', 'display_order']).optional(),
  orderDir: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  is_published: boolLike.optional(),
  q: z.string().optional(),
  slug: z.string().optional(),
  select: z.string().optional(),

  category_id: z.string().uuid().optional(),
  sub_category_id: z.string().uuid().optional(),

  module_key: z.string().optional(),

  // ✅ locale override (runtime-safe)
  locale: LOCALE_LIKE.optional(),
  // ✅ optional default override
  default_locale: LOCALE_LIKE.optional(),
});

export type CustomPageListQuery = z.infer<typeof customPageListQuerySchema>;

/** Parent (dil-bağımsız) create/update */
export const upsertCustomPageParentBodySchema = z.object({
  is_published: boolLike.optional().default(false),

  featured_image: z.string().url().nullable().optional(),
  featured_image_asset_id: z.string().length(36).nullable().optional(),

  category_id: z.string().uuid().nullable().optional(),
  sub_category_id: z.string().uuid().nullable().optional(),
});

export type UpsertCustomPageParentBody = z.infer<typeof upsertCustomPageParentBodySchema>;

export const patchCustomPageParentBodySchema = upsertCustomPageParentBodySchema.partial();
export type PatchCustomPageParentBody = z.infer<typeof patchCustomPageParentBodySchema>;

/** i18n create/update */
export const upsertCustomPageI18nBodySchema = z.object({
  locale: LOCALE_LIKE.optional(),

  title: z.string().min(1).max(255).trim(),

  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug sadece küçük harf, rakam ve tire içermelidir')
    .trim(),

  content: z.string().min(1),

  summary: z.string().max(1000).nullable().optional(),
  featured_image_alt: z.string().max(255).nullable().optional(),

  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().max(500).nullable().optional(),

  tags: z.string().max(1000).nullable().optional(),
});

export type UpsertCustomPageI18nBody = z.infer<typeof upsertCustomPageI18nBodySchema>;

export const patchCustomPageI18nBodySchema = z.object({
  locale: LOCALE_LIKE.optional(),

  title: z.string().min(1).max(255).trim().optional(),

  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug sadece küçük harf, rakam ve tire içermelidir')
    .trim()
    .optional(),

  content: z.string().min(1).optional(),

  summary: z.string().max(1000).nullable().optional(),
  featured_image_alt: z.string().max(255).nullable().optional(),

  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().max(500).nullable().optional(),

  tags: z.string().max(1000).nullable().optional(),
});

export type PatchCustomPageI18nBody = z.infer<typeof patchCustomPageI18nBodySchema>;

/** Backward-compatible: tek body */
export const upsertCustomPageBodySchema = upsertCustomPageI18nBodySchema.extend({
  is_published: boolLike.optional().default(false),
  featured_image: z.string().url().nullable().optional(),
  featured_image_asset_id: z.string().length(36).nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  sub_category_id: z.string().uuid().nullable().optional(),
});

export type UpsertCustomPageBody = z.infer<typeof upsertCustomPageBodySchema>;

export const patchCustomPageBodySchema = patchCustomPageI18nBodySchema.extend({
  is_published: boolLike.optional(),
  featured_image: z.string().url().nullable().optional(),
  featured_image_asset_id: z.string().length(36).nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  sub_category_id: z.string().uuid().nullable().optional(),
});

export type PatchCustomPageBody = z.infer<typeof patchCustomPageBodySchema>;

/** BY-SLUG params */
export const customPageBySlugParamsSchema = z.object({
  slug: z.string().min(1),
});

/** BY-SLUG query */
export const customPageBySlugQuerySchema = z.object({
  locale: LOCALE_LIKE.optional(),
  default_locale: LOCALE_LIKE.optional(),
});

export type CustomPageBySlugParams = z.infer<typeof customPageBySlugParamsSchema>;
export type CustomPageBySlugQuery = z.infer<typeof customPageBySlugQuerySchema>;
