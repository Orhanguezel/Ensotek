// =============================================================
// FILE: src/seo/seoSchema.ts
// Ensotek — SEO Zod Schemas (sadece validation, icerik yok)
// =============================================================

import { z } from 'zod';

const nonEmpty = z.string().trim().min(1);

export const seoOpenGraphSchema = z
  .object({
    type: z.enum(['website', 'article', 'product']).default('website'),
    images: z.array(z.string().trim().min(1)).default([]),
  })
  .strict();

export const seoTwitterSchema = z
  .object({
    card: z
      .enum(['summary', 'summary_large_image', 'app', 'player'])
      .default('summary_large_image'),
    site: z.string().trim().optional(),
    creator: z.string().trim().optional(),
  })
  .strict();

export const seoRobotsSchema = z
  .object({
    noindex: z.boolean().default(false),
    index: z.boolean().default(true),
    follow: z.boolean().default(true),
  })
  .strict();

export const seoSchema = z
  .object({
    site_name: nonEmpty,
    title_default: nonEmpty,
    title_template: nonEmpty,
    description: z.string().trim().optional(),
    open_graph: seoOpenGraphSchema.optional(),
    twitter: seoTwitterSchema.optional(),
    robots: seoRobotsSchema.optional(),
  })
  .strict();

export type SeoObject = z.infer<typeof seoSchema>;

export const siteMetaDefaultSchema = z
  .object({
    title: nonEmpty,
    description: nonEmpty,
    keywords: z.string().trim().optional(),
  })
  .strict();

export type SiteMetaDefaultObject = z.infer<typeof siteMetaDefaultSchema>;

/* ── Helpers — DB'den gelen veriyi parse et ── */

function tryParseJson(input: unknown): unknown {
  if (typeof input !== 'string') return input;
  const s = input.trim();
  if (!s) return {};
  if (!((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']')))) {
    return input;
  }
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

export function parseSeoFromSettings(input: unknown): Partial<SeoObject> {
  if (input === null || input === undefined) return {};
  const raw = tryParseJson(input);
  try {
    return seoSchema.partial().parse(raw) as Partial<SeoObject>;
  } catch {
    return {};
  }
}

export function parseSiteMetaDefaultByLocale(
  input: unknown,
): Record<string, SiteMetaDefaultObject> {
  if (input === null || input === undefined) return {};
  const raw = tryParseJson(input);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const result: Record<string, SiteMetaDefaultObject> = {};
  for (const [locale, val] of Object.entries(raw as Record<string, unknown>)) {
    try {
      result[locale] = siteMetaDefaultSchema.parse(val);
    } catch {
      // gecersiz locale verisi atla
    }
  }
  return result;
}
