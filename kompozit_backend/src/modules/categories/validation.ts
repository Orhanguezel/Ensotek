// =============================================================
// FILE: src/modules/categories/validation.ts
// =============================================================
import { z } from 'zod';
import { boolLike, emptyToNull, urlOrRelativePath, UUID36 } from '@/modules/_shared/validation';

/**
 * Base category schema
 * NOT: DB artık base + i18n (categories + category_i18n)
 */
const baseCategorySchema = z
  .object({
    id: z.string().uuid().optional(),

    /** Çoklu dil (i18n tablosu için) */
    locale: z.string().min(2).max(8).default('de'),

    /** Hangi modül / domain için bu kategori? */
    module_key: z.string().min(1).max(64).default('general'),

    /** i18n alanları */
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),

    description: emptyToNull(z.string().optional().nullable()),

    /** Base tablo görsel alanları */
    image_url: emptyToNull(urlOrRelativePath.optional().nullable()),
    storage_asset_id: emptyToNull(UUID36.optional().nullable()),
    alt: emptyToNull(z.string().max(255).optional().nullable()),

    icon: emptyToNull(z.string().max(255).optional().nullable()),

    is_active: boolLike.optional(),
    is_featured: boolLike.optional(),
    display_order: z.coerce.number().int().min(0).optional(),

    // FE'den gelebilecek ama DB'de olmayan alanları tolere et
    seo_title: emptyToNull(z.string().max(255).optional().nullable()),
    seo_description: emptyToNull(z.string().max(500).optional().nullable()),
  })
  .passthrough();

/**
 * CREATE şeması
 */
export const categoryCreateSchema = baseCategorySchema.superRefine((data, ctx) => {
  // parent_id bu tabloda yok
  if ('parent_id' in (data as Record<string, unknown>)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'parent_id_not_supported_on_categories',
      path: ['parent_id'],
    });
  }
});

/**
 * UPDATE şeması (PATCH / PUT)
 */
export const categoryUpdateSchema = baseCategorySchema.partial().superRefine((data, ctx) => {
  if ('parent_id' in (data as Record<string, unknown>)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'parent_id_not_supported_on_categories',
      path: ['parent_id'],
    });
  }
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

/**
 * ✅ Storage asset ile kategori görselini ayarlama/silme (+ alt)
 */
export const categorySetImageSchema = z
  .object({
    storage_asset_id: UUID36.nullable().optional(),
    asset_id: UUID36.nullable().optional(), // backward compatible

    alt: emptyToNull(z.string().max(255).optional().nullable()),
  })
  .strict()
  .transform((data) => {
    const resolved = data.storage_asset_id ?? data.asset_id ?? null;
    return {
      storage_asset_id: resolved,
      alt: data.alt ?? null,
    };
  });

export type CategorySetImageInput = z.infer<typeof categorySetImageSchema>;
