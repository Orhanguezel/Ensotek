// src/seo/meta.ts
'use client';

export type MetaInput = {
  title?: string;
  description?: string;
  url?: string; // optional, but og:url prefers canonical
  image?: string;
  locale?: string; // e.g., "tr_TR"
  siteName?: string;
  canonical?: string;
  noindex?: boolean;

  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
};

type TagSpec =
  | { kind: 'meta-name'; key: string; value: string }
  | { kind: 'meta-prop'; key: string; value: string }
  | { kind: 'link'; rel: string; href: string };

const trimOrEmpty = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const has = (v: unknown) => Boolean(trimOrEmpty(v));

export function buildMeta(meta: MetaInput): TagSpec[] {
  const out: TagSpec[] = [];

  const canonical = trimOrEmpty(meta.canonical);
  const url = trimOrEmpty(meta.url);

  // ✅ OG url tek kaynak: canonical > url (canonical yoksa url)
  const ogUrl = canonical || url;

  if (canonical) out.push({ kind: 'link', rel: 'canonical', href: canonical });

  if (has(meta.description)) {
    out.push({
      kind: 'meta-name',
      key: 'description',
      value: trimOrEmpty(meta.description),
    });
  }

  if (meta.noindex) {
    out.push({ kind: 'meta-name', key: 'robots', value: 'noindex, nofollow' });
  }

  // OpenGraph (property)
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

export function applyMeta(meta: MetaInput): void {
  const specs = buildMeta(meta);
  const head = document.head;

  for (const spec of specs) {
    if (spec.kind === 'link') {
      let link = head.querySelector<HTMLLinkElement>(`link[rel="${spec.rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = spec.rel;
        head.appendChild(link);
      }
      link.href = spec.href;
      continue;
    }

    if (spec.kind === 'meta-name') {
      let tag = head.querySelector<HTMLMetaElement>(`meta[name="${spec.key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = spec.key;
        head.appendChild(tag);
      }
      tag.content = spec.value;
      continue;
    }

    // meta-prop
    let tag = head.querySelector<HTMLMetaElement>(`meta[property="${spec.key}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', spec.key);
      head.appendChild(tag);
    }
    tag.setAttribute('content', spec.value);
  }
}
