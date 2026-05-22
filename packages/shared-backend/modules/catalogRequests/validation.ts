import { z } from 'zod';

export const catalogRequestStatuses = ['new', 'sent', 'failed', 'archived'] as const;

const boolLike = z.union([z.boolean(), z.literal(0), z.literal(1), z.string()]).transform((value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
});

export const createCatalogRequestSchema = z.object({
  locale: z.string().trim().min(2).max(10).optional().nullable(),
  country_code: z.string().trim().min(2).max(10).optional().nullable(),
  customer_name: z.string().trim().min(2).max(255),
  company_name: z.string().trim().max(255).optional().nullable(),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(64).optional().nullable(),
  message: z.string().trim().max(5000).optional().nullable(),
  catalog_url: z.string().trim().max(1000).optional().nullable(),
  consent_marketing: boolLike.optional().default(false),
  consent_terms: boolLike.refine(Boolean, 'consent_terms_required'),
  website: z.string().max(255).optional().nullable(),
});

export const listCatalogRequestsSchema = z.object({
  order: z.string().optional(),
  sort: z.enum(['created_at', 'updated_at']).optional(),
  orderDir: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional().default(100),
  offset: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(catalogRequestStatuses).optional(),
  locale: z.string().trim().max(10).optional(),
  country_code: z.string().trim().max(10).optional(),
  q: z.string().trim().max(255).optional(),
  email: z.string().trim().max(255).optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
});

export const patchCatalogRequestSchema = z.object({
  status: z.enum(catalogRequestStatuses).optional(),
  admin_notes: z.string().max(10000).optional().nullable(),
});

export type CreateCatalogRequestInput = z.infer<typeof createCatalogRequestSchema>;
export type ListCatalogRequestsInput = z.infer<typeof listCatalogRequestsSchema>;
export type PatchCatalogRequestInput = z.infer<typeof patchCatalogRequestSchema>;
