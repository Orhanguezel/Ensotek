import type { MetadataRoute } from 'next';
import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { API_BASE_URL } from '@/i18n/locale-settings';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.kuhlturm.com';

const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFreq: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '',             priority: 1.0, changeFreq: 'daily'   },
  { path: '/about',       priority: 0.8, changeFreq: 'weekly'  },
  { path: '/service',     priority: 0.9, changeFreq: 'weekly'  },
  { path: '/product',     priority: 0.9, changeFreq: 'weekly'  },
  { path: '/projects',    priority: 0.8, changeFreq: 'weekly'  },
  { path: '/solutions',   priority: 0.7, changeFreq: 'weekly'  },
  { path: '/references',  priority: 0.7, changeFreq: 'weekly'  },
  { path: '/library',     priority: 0.7, changeFreq: 'weekly'  },
  { path: '/news',        priority: 0.7, changeFreq: 'weekly'  },
  { path: '/blog',        priority: 0.7, changeFreq: 'weekly'  },
  { path: '/sparepart',   priority: 0.7, changeFreq: 'weekly'  },
  { path: '/contact',     priority: 0.8, changeFreq: 'monthly' },
  { path: '/offer',       priority: 0.7, changeFreq: 'monthly' },
  { path: '/team',        priority: 0.6, changeFreq: 'monthly' },
  { path: '/faqs',        priority: 0.6, changeFreq: 'monthly' },
];

async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}?limit=500&is_published=true`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items: unknown[] = Array.isArray(data)
      ? data
      : Array.isArray((data as { data?: unknown[] })?.data)
        ? (data as { data: unknown[] }).data
        : [];
    return items
      .map((item) => (item as { slug?: string })?.slug)
      .filter((s): s is string => typeof s === 'string' && s.length > 0);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [serviceSlugs, productSlugs, projectSlugs, librarySlugs, customPageSlugs] =
    await Promise.all([
      fetchSlugs('/services'),
      fetchSlugs('/products'),
      fetchSlugs('/projects'),
      fetchSlugs('/library'),
      fetchSlugs('/custom_pages'),
    ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of AVAILABLE_LOCALES) {
    for (const { path, priority, changeFreq } of STATIC_ROUTES) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: changeFreq,
        priority,
      });
    }

    for (const slug of serviceSlugs) {
      entries.push({ url: `${siteUrl}/${locale}/service/${slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 });
    }
    for (const slug of productSlugs) {
      entries.push({ url: `${siteUrl}/${locale}/product/${slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 });
    }
    for (const slug of projectSlugs) {
      entries.push({ url: `${siteUrl}/${locale}/projects/${slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 });
    }
    for (const slug of librarySlugs) {
      entries.push({ url: `${siteUrl}/${locale}/library/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 });
    }
    for (const slug of customPageSlugs) {
      entries.push({ url: `${siteUrl}/${locale}/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 });
    }
  }

  return entries;
}
