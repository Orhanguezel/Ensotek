// src/pages/sitemap.xml.tsx
import type { GetServerSideProps, NextPage } from 'next';
import { getRequestBaseUrl } from '@/seo/serverBase';

// === Ayarlar ===
const revalidateSeconds = 3600;

const LOCALES = (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || 'tr,en')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const DEFAULT_LOCALE = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'tr').trim();

/** API BASE (backend origin → /api), yoksa public base */
const API_BASE = (() => {
  const be = (process.env.BACKEND_ORIGIN || process.env.NEXT_PUBLIC_BACKEND_ORIGIN || '').replace(
    /\/+$/,
    '',
  );
  if (be) return `${be}/api`;

  const pubA = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (pubA) return pubA;

  const pubB = (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ''
  ).replace(/\/+$/, '');

  return pubB || '';
})();

/** slug okuma */
function pickSlug(rec: any, locale: string) {
  const s = rec?.slug;
  if (typeof s === 'string' && s.trim()) return s.trim();

  if (s && typeof s === 'object') {
    const loc = s?.[locale] || s?.[DEFAULT_LOCALE];
    if (typeof loc === 'string' && loc.trim()) return loc.trim();
  }

  if (typeof rec?.slugCanonical === 'string' && rec.slugCanonical.trim()) {
    return rec.slugCanonical.trim();
  }

  return '';
}

async function fetchList(path: string) {
  if (!API_BASE) return [] as any[];
  const url = `${API_BASE}/${path}?limit=500`;
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) return [];
  const j = await r.json();
  const data = Array.isArray(j) ? j : j?.data;
  return Array.isArray(data) ? data : [];
}

const MODULES: Array<{
  key: string;
  path: string; // URL segment
  api: string; // backend endpoint
  priority?: number;
  changefreq?: 'daily' | 'weekly' | 'monthly';
}> = [
  { key: 'about', path: 'about', api: 'about', priority: 0.7, changefreq: 'weekly' },
  { key: 'products', path: 'products', api: 'products', priority: 0.7, changefreq: 'weekly' },
  { key: 'spareparts', path: 'spareparts', api: 'sparepart', priority: 0.7, changefreq: 'weekly' },
  {
    key: 'references',
    path: 'references',
    api: 'references',
    priority: 0.6,
    changefreq: 'monthly',
  },
  { key: 'library', path: 'library', api: 'library', priority: 0.6, changefreq: 'monthly' },
  { key: 'news', path: 'news', api: 'news', priority: 0.6, changefreq: 'weekly' },
];

type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  alternates?: Record<string, string>;
};

function joinUrl(base: string, path: string) {
  const b = String(base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

function buildUrlTag(u: UrlEntry) {
  const alt = u.alternates || {};

  const altLinks = Object.entries(alt)
    .filter(([k]) => k !== 'x-default')
    .map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
    .join('');

  const xDefault = alt['x-default']
    ? `<xhtml:link rel="alternate" hreflang="x-default" href="${alt['x-default']}"/>`
    : '';

  return [
    '<url>',
    `<loc>${u.loc}</loc>`,
    u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '',
    u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : '',
    u.priority ? `<priority>${u.priority}</priority>` : '',
    altLinks,
    xDefault,
    '</url>',
  ].join('');
}

const SitemapPage: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { res } = ctx;

  // ✅ DOMAIN request’ten gelsin (localhost ise http zorlar)
  const SITE = getRequestBaseUrl(ctx);

  /** hreflang map helper (SITE closure) */
  function langAlt(pathFactory: (l: string) => string) {
    const map: Record<string, string> = {};
    for (const l of LOCALES) map[l] = joinUrl(SITE, pathFactory(l));
    // ✅ x-default: default locale’nin aynı path’i
    map['x-default'] = joinUrl(SITE, pathFactory(DEFAULT_LOCALE));
    return map;
  }

  const entries: UrlEntry[] = [];

  // 1) Locale ana sayfalar
  const homeAlt = langAlt((l) => `/${l}`);
  for (const l of LOCALES) {
    entries.push({
      loc: joinUrl(SITE, `/${l}`),
      changefreq: 'daily',
      priority: '1.0',
      alternates: homeAlt,
    });
  }

  // 2) Liste sayfaları
  const staticSections = [
    'about',
    'products',
    'spareparts',
    'references',
    'library',
    'news',
    'contact',
  ];
  for (const seg of staticSections) {
    const alt = langAlt((l) => `/${l}/${seg}`);
    for (const l of LOCALES) {
      entries.push({
        loc: alt[l],
        changefreq: seg === 'news' ? 'daily' : 'weekly',
        priority: seg === 'contact' ? '0.5' : '0.8',
        alternates: alt,
      });
    }
  }

  // 3) Detay sayfaları (API'den)
  if (API_BASE) {
    const lists = await Promise.all(
      MODULES.map(async (m) => {
        try {
          const data = await fetchList(m.api);
          return { mod: m, data };
        } catch {
          return { mod: m, data: [] as any[] };
        }
      }),
    );

    for (const { mod, data } of lists) {
      for (const rec of data) {
        const last =
          rec?.updatedAt || rec?.publishedAt || rec?.createdAt || new Date().toISOString();

        const alt = langAlt((l) => {
          const slug = pickSlug(rec, l);
          if (!slug) return `/${l}/${mod.path}`;
          return `/${l}/${mod.path}/${encodeURIComponent(slug)}`;
        });

        for (const l of LOCALES) {
          const slug = pickSlug(rec, l);
          if (!slug) continue;

          entries.push({
            loc: alt[l],
            lastmod: new Date(last).toISOString(),
            changefreq: mod.changefreq || 'weekly',
            priority: (mod.priority ?? 0.7).toFixed(1),
            alternates: alt,
          });
        }
      }
    }
  }

  // XML oluştur
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">` +
    entries.map(buildUrlTag).join('') +
    `</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    `public, max-age=0, s-maxage=${revalidateSeconds}, stale-while-revalidate=86400`,
  );
  res.write(body);
  res.end();

  return { props: {} };
};

export default SitemapPage;
