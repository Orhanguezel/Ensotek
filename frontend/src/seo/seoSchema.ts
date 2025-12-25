// =============================================================
// FILE: src/seo/seoSchema.ts
// Ensotek – SEO Schema (STRICT) + Defaults (deterministic)
// SINGLE SOURCE OF TRUTH: open_graph.images[]
// =============================================================

import { z } from 'zod';

const nonEmpty = z.string().trim().min(1);

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

export const DEFAULT_SEO_GLOBAL: SeoObject = {
  site_name: 'Ensotek',
  title_default: 'Ensotek',
  title_template: '%s | Ensotek',
  description:
    'Ensotek Energy Systems provides industrial solutions and energy efficiency services.',
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

export const DEFAULT_SITE_SEO_GLOBAL: SeoObject = { ...DEFAULT_SEO_GLOBAL };

export const DEFAULT_SITE_META_DEFAULT_BY_LOCALE: Record<string, SiteMetaDefaultObject> = {
  tr: {
    title: 'Ensotek | Endüstriyel Çözümler',
    description:
      'Endüstriyel soğutma kuleleri, modernizasyon ve enerji verimliliği çözümleri sunan Ensotek Enerji Sistemleri.',
    keywords: 'ensotek, endüstriyel, soğutma kulesi, enerji verimliliği, b2b',
  },
  en: {
    title: 'Ensotek | Industrial Solutions',
    description:
      'Ensotek Energy Systems provides industrial cooling tower engineering and energy efficiency solutions.',
    keywords: 'ensotek, industrial, cooling towers, energy efficiency, b2b',
  },
  de: {
    title: 'Ensotek | Industrielle Lösungen',
    description:
      'Ensotek Energiesysteme bietet industrielle Kühlturmtechnik und Energieeffizienzlösungen.',
    keywords: 'ensotek, industriell, kühlturm, energieeffizienz, b2b',
  },
};
