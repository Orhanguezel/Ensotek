// =============================================================
// FILE: src/modules/contact/validation.ts
// =============================================================
import { z } from "zod";

export const ContactCreateSchema = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(64),
  subject: z.string().trim().min(2).max(255),
  message: z.string().trim().min(10).max(5000),
  company: z.string().trim().max(255).optional().nullable(),
  attribution: z.object({
    analytics_consent: z.literal(true),
    landing_path: z.string().max(512),
    source_host: z.string().max(255).optional(),
    utm_source: z.string().max(160).optional(),
    utm_medium: z.string().max(160).optional(),
    utm_campaign: z.string().max(160).optional(),
    utm_content: z.string().max(160).optional(),
    utm_term: z.string().max(160).optional(),
  }).optional(),
  // Opsiyonel antispam alanları (honeypot)
  website: z.string().max(255).optional().nullable(),
});

export const ContactUpdateSchema = z.object({
  status: z.enum(["new", "in_progress", "closed"]).optional(),
  is_resolved: z.boolean().optional(),
  admin_note: z.string().max(2000).optional().nullable(),
});

export const ContactListParamsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["new", "in_progress", "closed"]).optional(),
  // 🔧 Query string'den geldiği için coerce et
  resolved: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  orderBy: z.enum(["created_at", "updated_at", "status", "name"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export type ContactCreateInput = z.infer<typeof ContactCreateSchema>;
export type ContactUpdateInput = z.infer<typeof ContactUpdateSchema>;
export type ContactListParams = z.infer<typeof ContactListParamsSchema>;
