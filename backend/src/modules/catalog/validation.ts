// =============================================================
// FILE: src/modules/catalog/validation.ts
// Ensotek – Catalog Request Module Validation (Zod schemas)
// =============================================================

import { z } from "zod";

export const boolLike = z.union([
  z.boolean(),
  z.literal(0),
  z.literal(1),
  z.literal("0"),
  z.literal("1"),
  z.literal("true"),
  z.literal("false"),
]);

export const CATALOG_REQUEST_STATUSES = [
  "new",
  "sent",
  "failed",
  "archived",
] as const;

export type CatalogRequestStatus = (typeof CATALOG_REQUEST_STATUSES)[number];
export const CATALOG_REQUEST_STATUS_ENUM = z.enum(CATALOG_REQUEST_STATUSES);

/* -------------------------------------------------------------
 * PUBLIC – Catalog request body
 * ------------------------------------------------------------- */

export const catalogRequestBodySchema = z.object({
  locale: z.string().max(10).optional(),
  country_code: z
    .string()
    .min(2)
    .max(2)
    .transform((v) => v.toUpperCase())
    .optional(),

  customer_name: z.string().min(1).max(255).trim(),
  company_name: z.string().max(255).trim().optional().nullable(),

  email: z.string().email().max(255),
  phone: z.string().max(50).trim().optional().nullable(),

  message: z.string().optional().nullable(),

  consent_marketing: boolLike.optional(),
  consent_terms: boolLike, // katalog isteme için zorunlu yapıyorum
});

export type CatalogRequestBody = z.infer<typeof catalogRequestBodySchema>;

/* -------------------------------------------------------------
 * ADMIN – List query
 * ------------------------------------------------------------- */

export const catalogListQuerySchema = z.object({
  order: z.string().optional(),
  sort: z.enum(["created_at", "updated_at"]).optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),

  status: CATALOG_REQUEST_STATUS_ENUM.optional(),
  locale: z.string().max(10).optional(),
  country_code: z.string().max(2).optional(),

  q: z.string().optional(),
  email: z.string().optional(),

  created_from: z.string().optional(),
  created_to: z.string().optional(),
});

export type CatalogListQuery = z.infer<typeof catalogListQuerySchema>;

/* -------------------------------------------------------------
 * ADMIN – Patch body
 * ------------------------------------------------------------- */

export const patchCatalogAdminBodySchema = z.object({
  status: CATALOG_REQUEST_STATUS_ENUM.optional(),
  admin_notes: z.string().optional().nullable(),
});

export type PatchCatalogAdminBody = z.infer<typeof patchCatalogAdminBodySchema>;

/* -------------------------------------------------------------
 * PARAMS
 * ------------------------------------------------------------- */

export const catalogIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CatalogIdParams = z.infer<typeof catalogIdParamsSchema>;
