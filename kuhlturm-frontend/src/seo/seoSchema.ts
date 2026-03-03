// =============================================================
// FILE: src/seo/seoSchema.ts
// Kühlturm — SEO Schema (STRICT) + DB-backed Defaults
// SINGLE SOURCE OF TRUTH: open_graph.images[]
// =============================================================

import { z } from 'zod';

const nonEmpty = z.string().trim().min(1);

/** -------------------------------------------------------------
 * STRICT SCHEMAS
 * ------------------------------------------------------------ */

export const seoOpenGraphSchema = z
  .object({
    type: z.enum(['website', 'article', 'product']).default('website'),
    /** ✅ SINGLE SOURCE: images[] only */
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

    open_graph: seoOpenGraphSchema.default({
      type: 'website',
      images: ['/img/og-default.jpg'],
    }),

    twitter: seoTwitterSchema.default({
      card: 'summary_large_image',
      site: '',
      creator: '',
    }),

    robots: seoRobotsSchema.default({
      noindex: false,
      index: true,
      follow: true,
    }),
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

export const DEFAULT_OG_IMAGE = '/img/og-default.jpg';

/** -------------------------------------------------------------
 * GLOBAL FALLBACKS (DB boş/kırık ise)
 * ------------------------------------------------------------ */

export const DEFAULT_SEO_GLOBAL: SeoObject = {
  site_name: 'Kühlturm',
  title_default: 'Kühlturm — Professionelle Kühllösungen',
  title_template: '%s | Kühlturm',
  description:
    'Leistungsstarke Kühltürme für Industrie und Gewerbe — zuverlässig, energieeffizient, maßgefertigt.',
  open_graph: {
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    site: '',
    creator: '',
  },
  robots: {
    noindex: false,
    index: true,
    follow: true,
  },
};

export const DEFAULT_SITE_META_DEFAULT_BY_LOCALE: Record<string, SiteMetaDefaultObject> = {
  de: {
    title: 'Kühlturm — Professionelle Kühllösungen für Industrie und Gewerbe',
    description:
      'Leistungsstarke Kühltürme und Kühlanlagen — zuverlässig, energieeffizient und maßgefertigt für Ihre Anforderungen.',
    keywords:
      'kühlturm, kühlanlagen, industriekühlung, verdunstungskühlung, rückkühler, maßgefertigt, energieeffizient',
  },
  en: {
    title: 'Cooling Tower — Professional Cooling Solutions for Industry',
    description:
      'High-performance cooling towers and cooling systems — reliable, energy-efficient, and custom-built for your requirements.',
    keywords:
      'cooling tower, cooling systems, industrial cooling, evaporative cooling, recooler, custom-built, energy-efficient',
  },
  tr: {
    title: 'Soğutma Kulesi — Endüstri İçin Profesyonel Soğutma Çözümleri',
    description:
      'Güçlü soğutma kuleleri ve soğutma sistemleri — güvenilir, enerji verimli ve ihtiyaçlarınıza özel üretim.',
    keywords:
      'soğutma kulesi, soğutma sistemleri, endüstriyel soğutma, buharlaşmalı soğutma, özel üretim',
  },
};

/* ------------------------------------------------------------------
 * HELPERS — DB site_settings.value -> Tip güvenli objeler
 * ------------------------------------------------------------------ */

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

function normalizeOgImages(input: unknown): string[] {
  const out: string[] = [];

  const pushIfString = (v: unknown) => {
    if (typeof v === 'string') {
      const s = v.trim();
      if (s) out.push(s);
    }
  };

  if (!input) return out;

  if (Array.isArray(input)) {
    for (const item of input) {
      if (typeof item === 'string') pushIfString(item);
      else if (item && typeof item === 'object' && !Array.isArray(item)) {
        const anyObj = item as Record<string, unknown>;
        pushIfString(anyObj.url);
        pushIfString(anyObj.src);
      }
    }
    return out;
  }

  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    if (Array.isArray(obj.images)) {
      return normalizeOgImages(obj.images);
    }
    pushIfString(obj.url);
    pushIfString(obj.src);
    return out;
  }

  pushIfString(input);
  return out;
}

export function parseSeoFromSettings(input: unknown): SeoObject {
  const base = DEFAULT_SEO_GLOBAL;

  if (input === null || input === undefined) return base;

  const raw = tryParseJson(input);

  try {
    const partial = seoSchema.partial().parse(raw) as Partial<SeoObject>;

    const images = normalizeOgImages(partial.open_graph?.images);

    return {
      ...base,
      ...partial,
      open_graph: {
        ...base.open_graph,
        ...(partial.open_graph ?? {}),
        images: images.length ? images : base.open_graph.images,
      },
      twitter: {
        ...base.twitter,
        ...(partial.twitter ?? {}),
      },
      robots: {
        ...base.robots,
        ...(partial.robots ?? {}),
      },
    };
  } catch {
    return base;
  }
}

export function parseSiteMetaDefaultByLocale(
  input: unknown,
): Record<string, SiteMetaDefaultObject> {
  const base = DEFAULT_SITE_META_DEFAULT_BY_LOCALE;

  if (input === null || input === undefined) return base;

  const raw = tryParseJson(input);

  const looksLikeSingle = (v: unknown) => {
    return (
      !!v &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      'title' in (v as object) &&
      'description' in (v as object)
    );
  };

  const looksLikeMap = (v: unknown) => {
    return !!v && typeof v === 'object' && !Array.isArray(v) && !looksLikeSingle(v);
  };

  if (looksLikeSingle(raw)) {
    try {
      const single = siteMetaDefaultSchema.parse(raw);
      return { ...base, de: single };
    } catch {
      return base;
    }
  }

  if (!looksLikeMap(raw)) return base;

  const result: Record<string, SiteMetaDefaultObject> = {};

  for (const [locale, val] of Object.entries(raw as Record<string, unknown>)) {
    try {
      result[locale] = siteMetaDefaultSchema.parse(val);
    } catch {
      const fb = base[locale] || base.de || base.en;
      if (fb) result[locale] = fb;
    }
  }

  for (const [loc, def] of Object.entries(base)) {
    if (!result[loc]) result[loc] = def;
  }

  return result;
}

export function parseSiteMetaDefault(input: unknown, locale: string): SiteMetaDefaultObject {
  const base =
    DEFAULT_SITE_META_DEFAULT_BY_LOCALE[locale] ?? DEFAULT_SITE_META_DEFAULT_BY_LOCALE['de']!;

  if (input === null || input === undefined) return base;

  const raw = tryParseJson(input);

  try {
    return siteMetaDefaultSchema.parse(raw);
  } catch {
    return base;
  }
}
