// src/seo/jsonld.ts
export type Thing = Record<string, unknown>;

export function graph(items: Thing[]): Thing {
  // Google, @graph formatını sever; çoklu schema objesini tek scriptte basmak için idealdir.
  return {
    '@context': 'https://schema.org',
    '@graph': Array.isArray(items) ? items : [],
  };
}

export function sameAsFromSocials(socials?: Record<string, unknown> | null): string[] {
  const s = socials && typeof socials === 'object' ? socials : {};
  const urls: string[] = [];

  for (const key of Object.keys(s)) {
    const raw = (s as any)[key];
    const v = typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();
    if (!v) continue;

    // Sadece http(s) olanları al
    if (!/^https?:\/\//i.test(v)) continue;

    urls.push(v);
  }

  // uniq
  return Array.from(new Set(urls));
}

export function org(input: {
  id?: string; // e.g. "https://site.com/#org"
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}): Thing {
  return {
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
  manufacturer?: string;
  category?: string;
  url?: string;
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
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
}): Thing {
  const schema: Thing = {
    '@type': 'Product',
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.image && { image: input.image }),
    ...(input.sku && { sku: input.sku }),
    ...(input.brand && { brand: { '@type': 'Brand', name: input.brand } }),
    ...(input.manufacturer && { manufacturer: { '@type': 'Organization', name: input.manufacturer } }),
    ...(input.category && { category: input.category }),
    ...(input.url && { url: input.url }),
  };

  if (input.offers) {
    const offers = Array.isArray(input.offers) ? input.offers : [input.offers];
    schema.offers = offers.map(offer => ({
      '@type': 'Offer',
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: offer.availability || 'https://schema.org/InStock',
      ...(offer.url && { url: offer.url }),
    }));
  }

  if (input.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: input.aggregateRating.ratingValue,
      reviewCount: input.aggregateRating.reviewCount,
      bestRating: input.aggregateRating.bestRating || 5,
      worstRating: input.aggregateRating.worstRating || 1,
    };
  }

  return schema;
}

export function service(input: {
  name: string;
  description?: string;
  provider: string;
  serviceType?: string;
  image?: string | string[];
  url?: string;
  areaServed?: string | string[];
  offers?: {
    price?: number;
    priceCurrency?: string;
    availability?: string;
  };
}): Thing {
  return {
    '@type': 'Service',
    name: input.name,
    ...(input.description && { description: input.description }),
    provider: {
      '@type': 'Organization',
      name: input.provider,
    },
    ...(input.serviceType && { serviceType: input.serviceType }),
    ...(input.image && { image: input.image }),
    ...(input.url && { url: input.url }),
    ...(input.areaServed && { areaServed: input.areaServed }),
    ...(input.offers && {
      offers: {
        '@type': 'Offer',
        ...input.offers,
        availability: input.offers.availability || 'https://schema.org/InStock',
      },
    }),
  };
}

export function faqPage(faqs: Array<{ question: string; answer: string }>): Thing {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function review(input: {
  itemReviewed: {
    '@type': string;
    name: string;
  };
  author: {
    name: string;
  };
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  reviewBody: string;
  datePublished?: string;
}): Thing {
  return {
    '@type': 'Review',
    itemReviewed: input.itemReviewed,
    author: {
      '@type': 'Person',
      name: input.author.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: input.reviewRating.ratingValue,
      bestRating: input.reviewRating.bestRating || 5,
      worstRating: input.reviewRating.worstRating || 1,
    },
    reviewBody: input.reviewBody,
    ...(input.datePublished && { datePublished: input.datePublished }),
  };
}

export function howTo(input: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  supply?: string[];
  tool?: string[];
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
}): Thing {
  return {
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    ...(input.image && { image: input.image }),
    ...(input.totalTime && { totalTime: input.totalTime }),
    ...(input.supply && { supply: input.supply }),
    ...(input.tool && { tool: input.tool }),
    step: input.steps.map((step, index) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
      position: index + 1,
      ...(step.image && { image: step.image }),
    })),
  };
}

export function jobPosting(input: {
  title: string;
  description: string;
  hiringOrganization: string;
  employmentType: string;
  jobLocation: {
    address: string;
    city?: string;
    country?: string;
  };
  baseSalary?: {
    value: number;
    currency: string;
    unitText: string;
  };
  validThrough?: string;
}): Thing {
  return {
    '@type': 'JobPosting',
    title: input.title,
    description: input.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: input.hiringOrganization,
    },
    employmentType: input.employmentType,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: input.jobLocation.address,
        ...(input.jobLocation.city && { addressLocality: input.jobLocation.city }),
        ...(input.jobLocation.country && { addressCountry: input.jobLocation.country }),
      },
    },
    ...(input.baseSalary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        value: input.baseSalary.value,
        currency: input.baseSalary.currency,
        unitText: input.baseSalary.unitText,
      },
    }),
    ...(input.validThrough && { validThrough: input.validThrough }),
  };
}

export function article(input: {
  headline: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: { name: string };
  publisher?: {
    name: string;
    logo?: string;
  };
  description?: string;
  articleBody?: string;
  wordCount?: number;
}): Thing {
  return {
    '@type': 'Article',
    headline: input.headline,
    ...(input.image && { image: input.image }),
    ...(input.datePublished && { datePublished: input.datePublished }),
    ...(input.dateModified && { dateModified: input.dateModified }),
    ...(input.author && {
      author: {
        '@type': 'Person',
        name: input.author.name,
      },
    }),
    ...(input.publisher && {
      publisher: {
        '@type': 'Organization',
        name: input.publisher.name,
        ...(input.publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: input.publisher.logo,
          },
        }),
      },
    }),
    ...(input.description && { description: input.description }),
    ...(input.articleBody && { articleBody: input.articleBody }),
    ...(input.wordCount && { wordCount: input.wordCount }),
  };
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
