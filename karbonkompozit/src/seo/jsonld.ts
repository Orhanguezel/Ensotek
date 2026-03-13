type Thing = Record<string, unknown>;

export function graph(items: Thing[]): Thing {
  return { '@context': 'https://schema.org', '@graph': items };
}

export function org(input: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: string;
  sameAs?: string[];
}): Thing {
  return {
    '@type': 'Organization',
    name: input.name,
    url: input.url,
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.email ? { email: input.email } : {}),
    ...(input.telephone ? { telephone: input.telephone } : {}),
    ...(input.address ? { address: input.address } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
  };
}

export function website(input: {
  name: string;
  url: string;
  description?: string;
}): Thing {
  return {
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
  };
}

export function localBusiness(input: {
  name: string;
  url: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: string;
  openingHours?: string;
}): Thing {
  return {
    '@type': 'LocalBusiness',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.email ? { email: input.email } : {}),
    ...(input.telephone ? { telephone: input.telephone } : {}),
    ...(input.address ? { address: input.address } : {}),
    ...(input.openingHours ? { openingHours: input.openingHours } : {}),
  };
}

export function product(input: {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  brand?: string;
}): Thing {
  return {
    '@type': 'Product',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.url ? { url: input.url } : {}),
    ...(input.brand
      ? { brand: { '@type': 'Brand', name: input.brand } }
      : {}),
  };
}

export function article(input: {
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  publisher?: {
    name: string;
    logo?: string;
  };
}): Thing {
  return {
    '@type': 'Article',
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.author
      ? { author: { '@type': 'Person', name: input.author } }
      : {}),
    ...(input.publisher
      ? {
          publisher: {
            '@type': 'Organization',
            name: input.publisher.name,
            ...(input.publisher.logo ? { logo: input.publisher.logo } : {}),
          },
        }
      : {}),
  };
}

export function breadcrumb(
  items: { name: string; url: string }[],
): Thing {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemList(
  items: { name: string; url: string }[],
): Thing {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function imageObject(input: {
  contentUrl: string;
  name?: string;
  caption?: string;
  width?: number;
  height?: number;
  dateModified?: string;
}): Thing {
  return {
    '@type': 'ImageObject',
    contentUrl: input.contentUrl,
    ...(input.name ? { name: input.name } : {}),
    ...(input.caption ? { caption: input.caption } : {}),
    ...(input.width ? { width: input.width } : {}),
    ...(input.height ? { height: input.height } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function imageGallery(input: {
  name: string;
  description?: string;
  url: string;
  images: Thing[];
}): Thing {
  return {
    '@type': 'ImageGallery',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    hasPart: input.images,
  };
}

export function collectionPage(input: {
  name: string;
  description?: string;
  url: string;
  mainEntity?: Thing;
}): Thing {
  return {
    '@type': 'CollectionPage',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.mainEntity ? { mainEntity: input.mainEntity } : {}),
  };
}
