// =============================================================
// FILE: src/modules/sites/validation.ts
// =============================================================

import { z } from 'zod';

// ---------- Shared ----------

export const boolLike = z.union([
  z.boolean(),
  z.literal(0),
  z.literal(1),
  z.literal('0'),
  z.literal('1'),
  z.literal('true'),
  z.literal('false'),
]);

// ---------- Public ----------

export const siteListQuerySchema = z.object({
  is_active: boolLike.optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});
export type SiteListQuery = z.infer<typeof siteListQuerySchema>;

// ---------- Admin ----------

export const adminSiteListQuerySchema = z.object({
  q: z.string().optional(),
  is_active: boolLike.optional(),
  sort: z.enum(['name', 'slug', 'domain', 'created_at']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});
export type AdminSiteListQuery = z.infer<typeof adminSiteListQuerySchema>;

export const adminSiteCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'slug_invalid_chars'),
  domain: z.string().min(1).max(255),
  is_active: boolLike.optional().default(true),
});
export type AdminSiteCreate = z.infer<typeof adminSiteCreateSchema>;

export const adminSiteUpdateSchema = adminSiteCreateSchema.partial();
export type AdminSiteUpdate = z.infer<typeof adminSiteUpdateSchema>;

// ---------- SiteLocales Admin ----------

export const adminSiteLocaleCreateSchema = z.object({
  locale_code: z
    .string()
    .min(2)
    .max(8)
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'locale_code_invalid'),
  is_default: boolLike.optional().default(false),
  is_active: boolLike.optional().default(true),
});
export type AdminSiteLocaleCreate = z.infer<typeof adminSiteLocaleCreateSchema>;

export const adminSiteLocaleUpdateSchema = adminSiteLocaleCreateSchema.partial();
export type AdminSiteLocaleUpdate = z.infer<typeof adminSiteLocaleUpdateSchema>;
