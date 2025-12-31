// src/modules/library/validation.ts
// =============================================================

import { z } from 'zod';

/* ------- shared ------- */
export const boolLike = z.union([
  z.boolean(),
  z.literal(0),
  z.literal(1),
  z.literal('0'),
  z.literal('1'),
  z.literal('true'),
  z.literal('false'),
]);

/**
 * Locale doğrulaması (ASYNC olamaz, DB okuyamaz)
 * Bu yüzden burada sadece format kontrolü yapıyoruz.
 * Gerçek "destekli mi?" kontrolü controller'da DB üzerinden yapılacak.
 */
const LOCALE_SCHEMA = z
  .string()
  .min(2)
  .max(10)
  .regex(/^[a-zA-Z]{2,3}([_-][a-zA-Z0-9]{2,8})?$/, 'invalid_locale');

/* ============== LIST QUERY (public/admin) ============== */
/**
 * NOT: Library.type hardcode enum OLMAYACAK.
 * - DB tarafında categories.module_key / tags_json vs. ile filtrelenebilir.
 * - type alanı validation’da free-form string olarak doğrulanır.
 */
export const libraryListQuerySchema = z.object({
  order: z.string().optional(),
  sort: z
    .enum(['created_at', 'updated_at', 'published_at', 'display_order', 'views', 'download_count'])
    .optional(),
  orderDir: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),

  // filters
  q: z.string().optional(),

  // type (non-i18n) — hard enum yok
  type: z.string().min(1).max(32).optional(),

  // category relations
  category_id: z.string().uuid().optional(),
  sub_category_id: z.string().uuid().optional(),

  // category module_key filter
  module_key: z.string().max(100).optional(),

  featured: boolLike.optional(),
  is_published: boolLike.optional(),
  is_active: boolLike.optional(),

  // metrics/date filters
  published_before: z.string().datetime().optional(),
  published_after: z.string().datetime().optional(),

  // 🔑 FE’den gelebilen i18n paramları (statik enum YOK)
  locale: LOCALE_SCHEMA.optional(),
  default_locale: LOCALE_SCHEMA.optional(),
});
export type LibraryListQuery = z.infer<typeof libraryListQuerySchema>;

/** PUBLIC list query – admin alanları dışarıdan alınmıyor */
export const publicLibraryListQuerySchema = libraryListQuerySchema.omit({
  is_published: true,
  is_active: true,
});
export type PublicLibraryListQuery = z.infer<typeof publicLibraryListQuerySchema>;

/* ============== PARENT (library) ============== */

export const upsertLibraryParentBodySchema = z.object({
  // type (non-i18n) — hard enum yok
  type: z.string().min(1).max(32).optional().default('other'),

  // kategori bağları (categories / sub_categories)
  category_id: z.string().uuid().nullable().optional(),
  sub_category_id: z.string().uuid().nullable().optional(),

  featured: boolLike.optional().default(false),
  is_published: boolLike.optional().default(false),
  is_active: boolLike.optional().default(true),
  display_order: z.coerce.number().int().min(0).optional().default(0),

  // ana görsel (legacy + storage)
  featured_image: z.string().max(500).nullable().optional(),
  image_url: z.string().url().max(500).nullable().optional(),
  image_asset_id: z.string().length(36).nullable().optional(),

  published_at: z.string().datetime().nullable().optional(),
});
export type UpsertLibraryParentBody = z.infer<typeof upsertLibraryParentBodySchema>;

export const patchLibraryParentBodySchema = upsertLibraryParentBodySchema.partial();
export type PatchLibraryParentBody = z.infer<typeof patchLibraryParentBodySchema>;

/* ============== I18N (library_i18n) ============== */

export const upsertLibraryI18nBodySchema = z.object({
  /** Locale hedefi (yoksa header’daki req.locale kullanılır) */
  locale: LOCALE_SCHEMA.optional(),

  // schema: library_i18n.name + slug NOT NULL
  // (create flow’da controller zorunlulukları enforce edebilir)
  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug sadece küçük harf, rakam ve tire içermelidir')
    .optional(),

  description: z.string().optional(),
  image_alt: z.string().max(255).optional(),

  // tags + SEO meta
  tags: z.string().max(255).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().max(500).optional(),
  meta_keywords: z.string().max(255).optional(),

  /** create: aynı içeriği tüm dillere kopyala? (default: true) */
  replicate_all_locales: z.coerce.boolean().default(true).optional(),
});
export type UpsertLibraryI18nBody = z.infer<typeof upsertLibraryI18nBodySchema>;

export const patchLibraryI18nBodySchema = z.object({
  locale: LOCALE_SCHEMA.optional(),

  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug sadece küçük harf, rakam ve tire içermelidir')
    .optional(),

  description: z.string().optional(),
  image_alt: z.string().max(255).optional(),

  tags: z.string().max(255).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().max(500).optional(),
  meta_keywords: z.string().max(255).optional(),

  /** patch: tüm dillere uygula? (default: false) */
  apply_all_locales: z.coerce.boolean().default(false).optional(),
});
export type PatchLibraryI18nBody = z.infer<typeof patchLibraryI18nBodySchema>;

/* ============== COMBINED (kolay kullanım) ============== */

export const upsertLibraryBodySchema = upsertLibraryParentBodySchema.merge(
  upsertLibraryI18nBodySchema,
);
export type UpsertLibraryBody = z.infer<typeof upsertLibraryBodySchema>;

export const patchLibraryBodySchema = patchLibraryParentBodySchema.merge(
  patchLibraryI18nBodySchema,
);
export type PatchLibraryBody = z.infer<typeof patchLibraryBodySchema>;

/* ============== GALLERY: IMAGES (library_images + i18n fields inline) ============== */

const upsertLibraryImageBodyBase = z.object({
  // schema: library_images.image_asset_id / image_url
  image_asset_id: z.string().length(36).nullable().optional(),
  image_url: z.string().url().max(500).nullable().optional(),

  is_active: boolLike.optional().default(true),
  display_order: z.coerce.number().int().min(0).optional().default(0),

  // schema: library_images_i18n fields
  title: z.string().max(255).nullable().optional(),
  alt: z.string().max(255).nullable().optional(),
  caption: z.string().max(500).nullable().optional(),
  locale: LOCALE_SCHEMA.optional(),

  replicate_all_locales: z.coerce.boolean().default(true).optional(),
  apply_all_locales: z.coerce.boolean().default(false).optional(),
});

/** UPSERT: en az bir görsel referansı şart */
export const upsertLibraryImageBodySchema = upsertLibraryImageBodyBase.superRefine((b, ctx) => {
  if (!b.image_asset_id && !b.image_url) {
    ctx.addIssue({
      code: 'custom',
      message: 'image_asset_id_or_url_required',
      path: ['image_asset_id'],
    });
  }
});
export type UpsertLibraryImageBody = z.infer<typeof upsertLibraryImageBodySchema>;

/** PATCH: kısmi güncelleme */
export const patchLibraryImageBodySchema = upsertLibraryImageBodyBase.partial();
export type PatchLibraryImageBody = z.infer<typeof patchLibraryImageBodySchema>;

/* ============== FILES (library_files) ============== */

const upsertLibraryFileBodyBase = z.object({
  // schema: library_files.asset_id / file_url
  asset_id: z.string().length(36).nullable().optional(),
  file_url: z.string().url().max(500).nullable().optional(),

  name: z.string().min(1).max(255),

  size_bytes: z.coerce.number().int().min(0).nullable().optional(),
  mime_type: z.string().max(255).nullable().optional(),

  // schema: tags_json (DTO'da string[] gibi kullanılıyor)
  tags: z.array(z.string().max(100)).max(100).optional(),

  display_order: z.coerce.number().int().min(0).optional().default(0),
  is_active: boolLike.optional().default(true),
});

/** UPSERT: en az bir dosya referansı şart (asset_id veya file_url) */
export const upsertLibraryFileBodySchema = upsertLibraryFileBodyBase.superRefine((b, ctx) => {
  if (!b.asset_id && !b.file_url) {
    ctx.addIssue({
      code: 'custom',
      message: 'asset_id_or_file_url_required',
      path: ['asset_id'],
    });
  }
});
export type UpsertLibraryFileBody = z.infer<typeof upsertLibraryFileBodySchema>;

/**
 * PATCH:
 * - name opsiyonel
 * - tags null ile temizlenebilir
 * - dosya referansı zorunlu DEĞİL (metadata update)
 */
export const patchLibraryFileBodySchema = upsertLibraryFileBodyBase
  .omit({ name: true })
  .extend({
    name: z.string().min(1).max(255).optional(),
    tags: z.array(z.string().max(100)).max(100).nullable().optional(),
  })
  .partial();

export type PatchLibraryFileBody = z.infer<typeof patchLibraryFileBodySchema>;
