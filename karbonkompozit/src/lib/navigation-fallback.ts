import { localizedPath } from '@/seo';

type TranslateFn = (key: string) => string;

export interface MenuItemLike {
  title: string;
  url: string;
  children?: MenuItemLike[];
}

export interface FooterSectionLike {
  title: string;
  items: Array<{ label: string; url: string }>;
}

export function buildDefaultMenu(locale: string, t: TranslateFn): MenuItemLike[] {
  return [
    { title: t('home'), url: localizedPath(locale, '/') },
    { title: t('products'), url: localizedPath(locale, '/products') },
    { title: t('gallery'), url: localizedPath(locale, '/gallery') },
    { title: t('blog'), url: localizedPath(locale, '/blog') },
    { title: t('about'), url: localizedPath(locale, '/about') },
    { title: t('contact'), url: localizedPath(locale, '/contact') },
  ];
}

export function ensureMenuItems(
  input: Record<string, unknown>[],
  locale: string,
  t: TranslateFn,
): Record<string, unknown>[] {
  const fallback = buildDefaultMenu(locale, t);
  const byUrl = new Map<string, Record<string, unknown>>();

  for (const raw of input) {
    const url = String(raw.url ?? raw.href ?? '').trim();
    if (!url) continue;
    byUrl.set(url, raw);
  }

  for (const item of fallback) {
    if (!byUrl.has(item.url)) {
      byUrl.set(item.url, item as unknown as Record<string, unknown>);
    }
  }

  return Array.from(byUrl.values());
}

export function buildDefaultFooterSections(
  locale: string,
  navT: TranslateFn,
  footerT: TranslateFn,
): FooterSectionLike[] {
  return [
    {
      title: footerT('sections.explore'),
      items: [
        { label: navT('products'), url: localizedPath(locale, '/products') },
        { label: navT('gallery'), url: localizedPath(locale, '/gallery') },
        { label: navT('blog'), url: localizedPath(locale, '/blog') },
        { label: navT('offer'), url: localizedPath(locale, '/offer') },
      ],
    },
    {
      title: footerT('sections.company'),
      items: [
        { label: navT('about'), url: localizedPath(locale, '/about') },
        { label: navT('contact'), url: localizedPath(locale, '/contact') },
      ],
    },
    {
      title: footerT('sections.legal'),
      items: [
        { label: footerT('privacy'), url: localizedPath(locale, '/legal/privacy') },
        { label: footerT('terms'), url: localizedPath(locale, '/legal/terms') },
      ],
    },
  ];
}

export function ensureFooterSections(
  input: Record<string, unknown>[],
  locale: string,
  navT: TranslateFn,
  footerT: TranslateFn,
): Record<string, unknown>[] {
  const fallbackSections = buildDefaultFooterSections(locale, navT, footerT);

  if (input.length === 0) {
    return fallbackSections as unknown as Record<string, unknown>[];
  }

  const existingUrls = new Set<string>();
  for (const section of input) {
    const items = Array.isArray(section.items) ? section.items : [];
    for (const item of items) {
      const url = String((item as any)?.url ?? (item as any)?.href ?? '').trim();
      if (url) existingUrls.add(url);
    }
  }

  const quickLinks = fallbackSections
    .flatMap((section) => section.items)
    .filter((item) => !existingUrls.has(item.url));

  if (quickLinks.length === 0) return input;

  return [
    ...input,
    {
      title: footerT('sections.quickLinks'),
      items: quickLinks,
    },
  ];
}
