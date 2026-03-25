// src/modules/services/validation.ts
// =============================================================

import { z } from "zod";

/* ------- shared ------- */
export const boolLike = z.union([
  z.boolean(),
  z.literal(0),
  z.literal(1),
  z.literal("0"),
  z.literal("1"),
  z.literal("true"),
  z.literal("false"),
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
  .regex(/^[a-zA-Z]{2,3}([_-][a-zA-Z0-9]{2,8})?$/, "invalid_locale");

/* ------- enums ------- */
/**
 * Ensotek service tipleri (seed ile uyumlu):
 *
 *  - maintenance_repair
 *  - modernization
 *  - spare_parts_components
 *  - applications_references
 *  - engineering_support
 *  - production
 *  - other
 */
const SERVICE_TYPES = [
  "maintenance_repair",
  "modernization",
  "spare_parts_components",
  "applications_references",
  "engineering_support",
  "production",
  "other",
] as const;

export const ServiceTypeEnum = z.enum(SERVICE_TYPES);

/* ------- list (public/admin) ------- */
export const serviceListQuerySchema = z.object({
  order: z.string().optional(),
  sort: z.enum(["created_at", "updated_at", "display_order"]).optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),

  // filters
  q: z.string().optional(),
  type: ServiceTypeEnum.optional(),

  // category relations
  category_id: z.string().uuid().optional(),
  sub_category_id: z.string().uuid().optional(),

  featured: boolLike.optional(),
  is_active: boolLike.optional(),

  // 🔑 FE’den gelebilen i18n paramları (statik enum YOK)
  locale: LOCALE_SCHEMA.optional(),
  default_locale: LOCALE_SCHEMA.optional(),
});
export type ServiceListQuery = z.infer<typeof serviceListQuerySchema>;

/* ------- parent (non-i18n) ------- */

export const upsertServiceParentBodySchema = z.object({
  type: ServiceTypeEnum.optional().default("other"),

  // kategori bağları (categories / sub_categories)
  category_id: z.string().uuid().nullable().optional(),
  sub_category_id: z.string().uuid().nullable().optional(),

  featured: boolLike.optional().default(false),
  is_active: boolLike.optional().default(true),
  display_order: z.coerce.number().int().min(0).optional().default(1),

  // ana görsel (legacy + storage)
  featured_image: z.union([z.string().max(500).refine((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'), 'URL veya relative path olmalı'), z.literal('')]).transform(v => v === '' ? null : v).nullable().optional(),
  image_url: z.union([z.string().max(500).refine((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'), 'URL veya relative path olmalı'), z.literal('')]).transform(v => v === '' ? null : v).nullable().optional(),
  image_asset_id: z.union([z.string().length(36), z.literal('')]).transform(v => v === '' ? null : v).nullable().optional(),

  // çoklu galeri resimleri
  images: z.array(z.string().min(1)).optional(),
});
export type UpsertServiceParentBody = z.infer<typeof upsertServiceParentBodySchema>;

export const patchServiceParentBodySchema = upsertServiceParentBodySchema.partial();
export type PatchServiceParentBody = z.infer<typeof patchServiceParentBodySchema>;

/* ------- i18n (service) ------- */

export const upsertServiceI18nBodySchema = z.object({
  /** Locale hedefi (yoksa header’daki req.locale kullanılır) */
  locale: LOCALE_SCHEMA.optional(),

  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug sadece küçük harf, rakam ve tire içermelidir")
    .optional(),
  description: z.string().optional(),
  material: z.string().max(255).optional(),
  price: z.string().max(128).optional(),
  includes: z.string().max(255).optional(),
  warranty: z.string().max(128).optional(),
  image_alt: z.string().max(255).optional(),

  // tags + SEO meta
  tags: z.string().max(255).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().max(500).optional(),
  meta_keywords: z.string().max(255).optional(),

  /** create: aynı içeriği tüm dillere kopyala? (default: true) */
  replicate_all_locales: z.coerce.boolean().default(true).optional(),
});
export type UpsertServiceI18nBody = z.infer<typeof upsertServiceI18nBodySchema>;

export const patchServiceI18nBodySchema = z.object({
  locale: LOCALE_SCHEMA.optional(),

  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug sadece küçük harf, rakam ve tire içermelidir")
    .optional(),
  description: z.string().optional(),
  material: z.string().max(255).optional(),
  price: z.string().max(128).optional(),
  includes: z.string().max(255).optional(),
  warranty: z.string().max(128).optional(),
  image_alt: z.string().max(255).optional(),

  tags: z.string().max(255).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().max(500).optional(),
  meta_keywords: z.string().max(255).optional(),

  /** patch: tüm dillere uygula? (default: false) */
  apply_all_locales: z.coerce.boolean().default(false).optional(),
});
export type PatchServiceI18nBody = z.infer<typeof patchServiceI18nBodySchema>;

/* ------- combined (service) ------- */

export const upsertServiceBodySchema = upsertServiceParentBodySchema.merge(upsertServiceI18nBodySchema);
export type UpsertServiceBody = z.infer<typeof upsertServiceBodySchema>;

export const patchServiceBodySchema = patchServiceParentBodySchema.merge(patchServiceI18nBodySchema);
export type PatchServiceBody = z.infer<typeof patchServiceBodySchema>;

/* ------- images (gallery) ------- */

/** Base obje → hem upsert hem patch için ortak */
const upsertServiceImageBodyBase = z.object({
  // storage bağ(ı) → en az birisi zorunlu (yalnızca UPSERT’te kontrol edeceğiz)
  image_asset_id: z.union([z.string().length(36), z.literal('')]).transform(v => v === '' ? null : v).nullable().optional(),
  image_url: z.union([z.string().max(500).refine((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'), 'URL veya relative path olmalı'), z.literal('')]).transform(v => v === '' ? null : v).nullable().optional(),

  is_active: boolLike.optional().default(true),
  display_order: z.coerce.number().int().min(0).optional().default(0),

  // i18n alanları
  title: z.string().max(255).nullable().optional(),
  alt: z.string().max(255).nullable().optional(),
  caption: z.string().max(500).nullable().optional(),
  locale: LOCALE_SCHEMA.optional(),

  /** create: tüm dillere kopyala? */
  replicate_all_locales: z.coerce.boolean().default(true).optional(),

  /** patch: tüm dillere uygula? */
  apply_all_locales: z.coerce.boolean().default(false).optional(),
});

/** UPSERT: en az bir görsel referansı şart */
export const upsertServiceImageBodySchema = upsertServiceImageBodyBase.superRefine((b, ctx) => {
  if (!b.image_asset_id && !b.image_url) {
    ctx.addIssue({
      code: "custom",
      message: "image_asset_id_or_url_required",
      path: ["image_asset_id"],
    });
  }
});
export type UpsertServiceImageBody = z.infer<typeof upsertServiceImageBodySchema>;

/** PATCH: kısmi güncelleme, görsel zorunluluğu yok */
export const patchServiceImageBodySchema = upsertServiceImageBodyBase.partial();
export type PatchServiceImageBody = z.infer<typeof patchServiceImageBodySchema>;
