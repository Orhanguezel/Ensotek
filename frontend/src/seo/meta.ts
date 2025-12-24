// src/seo/meta.ts
'use client';

export type MetaInput = {
  title?: string;
  description?: string;

  /** og:url için (canonical yoksa buna düşer) */
  url?: string;

  image?: string;
  locale?: string; // e.g., "tr_TR"
  siteName?: string;

  /** link rel=canonical basmak istersen */
  canonical?: string;

  noindex?: boolean;

  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
};

export type TagSpec =
  | { kind: 'meta-name'; key: string; value: string }
  | { kind: 'meta-prop'; key: string; value: string }
  | { kind: 'link'; rel: string; href: string };

const trimOrEmpty = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const has = (v: unknown) => Boolean(trimOrEmpty(v));

/**
 * ✅ NEW STANDARD (Pages Router):
 * Canonical + og:url SSR (_document) tek kaynak.
 * Client tarafında buildMeta çıktısından bu ikisini her yerde filtrele.
 */
export function filterClientHeadSpecs(specs: TagSpec[]): TagSpec[] {
  return specs.filter((spec) => {
    if (spec.kind === 'link' && spec.rel === 'canonical') return false;
    if (spec.kind === 'meta-prop' && spec.key === 'og:url') return false;
    return true;
  });
}

export function buildMeta(meta: MetaInput): TagSpec[] {
  const out: TagSpec[] = [];

  const canonical = trimOrEmpty(meta.canonical);
  const url = trimOrEmpty(meta.url);

  // ✅ OG url tek kaynak: canonical > url
  const ogUrl = canonical || url;

  // ✅ Canonical SADECE verilirse bas
  if (canonical) out.push({ kind: 'link', rel: 'canonical', href: canonical });

  if (has(meta.description)) {
    out.push({ kind: 'meta-name', key: 'description', value: trimOrEmpty(meta.description) });
  }

  if (meta.noindex) {
    out.push({ kind: 'meta-name', key: 'robots', value: 'noindex, nofollow' });
  }

  // OpenGraph
  if (has(meta.title))
    out.push({ kind: 'meta-prop', key: 'og:title', value: trimOrEmpty(meta.title) });
  if (has(meta.description))
    out.push({ kind: 'meta-prop', key: 'og:description', value: trimOrEmpty(meta.description) });

  if (ogUrl) out.push({ kind: 'meta-prop', key: 'og:url', value: ogUrl });

  if (has(meta.image))
    out.push({ kind: 'meta-prop', key: 'og:image', value: trimOrEmpty(meta.image) });

  out.push({ kind: 'meta-prop', key: 'og:type', value: 'website' });

  if (has(meta.siteName))
    out.push({ kind: 'meta-prop', key: 'og:site_name', value: trimOrEmpty(meta.siteName) });
  if (has(meta.locale))
    out.push({ kind: 'meta-prop', key: 'og:locale', value: trimOrEmpty(meta.locale) });

  // Twitter
  out.push({
    kind: 'meta-name',
    key: 'twitter:card',
    value: trimOrEmpty(meta.twitterCard) || 'summary_large_image',
  });

  if (has(meta.twitterSite))
    out.push({ kind: 'meta-name', key: 'twitter:site', value: trimOrEmpty(meta.twitterSite) });
  if (has(meta.twitterCreator))
    out.push({
      kind: 'meta-name',
      key: 'twitter:creator',
      value: trimOrEmpty(meta.twitterCreator),
    });

  if (has(meta.title))
    out.push({ kind: 'meta-name', key: 'twitter:title', value: trimOrEmpty(meta.title) });
  if (has(meta.description))
    out.push({
      kind: 'meta-name',
      key: 'twitter:description',
      value: trimOrEmpty(meta.description),
    });
  if (has(meta.image))
    out.push({ kind: 'meta-name', key: 'twitter:image', value: trimOrEmpty(meta.image) });

  return out;
}
