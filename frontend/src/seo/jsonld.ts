// src/seo/jsonld.ts
export type Thing = Record<string, unknown>;

export function org(input: {
  id?: string; // e.g. "https://site.com/#org"
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...(input.id ? { '@id': input.id } : {}),
    name: input.name,
    url: input.url,
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
  };
}

export function website(input: {
  id?: string; // e.g. "https://site.com/#website"
  name: string;
  url: string;
  publisherId?: string; // org @id reference
  searchUrlTemplate?: string;
}): Thing {
  const base: Thing = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    ...(input.id ? { '@id': input.id } : {}),
    name: input.name,
    url: input.url,
    ...(input.publisherId ? { publisher: { '@id': input.publisherId } } : {}),
  };

  if (input.searchUrlTemplate) {
    (base as any).potentialAction = {
      '@type': 'SearchAction',
      target: input.searchUrlTemplate,
      'query-input': 'required name=q',
    };
  }

  return base;
}

export function product(input: {
  name: string;
  description?: string;
  image?: string | string[];
  sku?: string;
  brand?: string;
  offers?:
    | {
        price: number;
        priceCurrency: string;
        availability?: string;
        url?: string;
      }
    | Array<{
        price: number;
        priceCurrency: string;
        availability?: string;
        url?: string;
      }>;
}): Thing {
  return { '@context': 'https://schema.org', '@type': 'Product', ...input };
}

export function article(input: {
  headline: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: { name: string };
}): Thing {
  return { '@context': 'https://schema.org', '@type': 'Article', ...input };
}

export function breadcrumb(items: Array<{ name: string; item: string }>): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}
