import { z } from "zod";
import { LOCALES } from "../../core/i18n";

export const boolLike = z.union([
  z.boolean(),
  z.literal(0),
  z.literal(1),
  z.literal("0"),
  z.literal("1"),
  z.literal("true"),
  z.literal("false"),
]);

const LOCALE_ENUM = z.enum(LOCALES as [string, ...string[]]);

export const footerSectionListQuerySchema = z.object({
  q: z.string().optional(),
  slug: z.string().optional(),
  is_active: boolLike.optional(),
  sort: z.enum(["display_order", "created_at", "updated_at"]).optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),
  order: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  locale: LOCALE_ENUM.optional(),
});

export type FooterSectionListQuery = z.infer<typeof footerSectionListQuerySchema>;

export const footerSectionCreateSchema = z.object({
  title: z.string().min(1).max(150),
  slug: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  is_active: boolLike.optional().default(true),
  display_order: z.number().int().min(0).optional(),
  locale: LOCALE_ENUM.optional(),
});

export type FooterSectionCreateInput = z.infer<typeof footerSectionCreateSchema>;

export const footerSectionUpdateSchema = footerSectionCreateSchema.partial();

export type FooterSectionUpdateInput = z.infer<typeof footerSectionUpdateSchema>;
