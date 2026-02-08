// =============================================================
// FILE: pages/api/sitemap.xml.ts
// Next.js API Route for Dynamic Sitemap Generation
// Generates XML sitemap with all public routes
// =============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

// Types for API responses
interface CustomPage {
  slug: string;
  updated_at: string;
  module_key?: string;
}

interface Product {
  slug: string;
  updated_at: string;
}

interface Service {
  slug: string;
  updated_at: string;
}

interface Sparepart {
  slug: string;
  updated_at: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ensotek.de';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.ensotek.de/api';

// Helper function to validate and sanitize slugs
function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;

  // Remove invalid characters and patterns
  const invalidPatterns = [
    /\$$/,        // Ends with $
    /^\$/,        // Starts with $
    /\.html$/,    // Ends with .html (old static files)
    /\.htm$/,     // Ends with .htm
    /[<>'"]/,     // Contains HTML/XSS characters
    /\s/,         // Contains whitespace
    /\/\//,       // Contains double slashes
  ];

  return !invalidPatterns.some(pattern => pattern.test(slug));
}

// Helper function to fetch data from backend
async function fetchApi(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      console.warn(`Failed to fetch ${endpoint}:`, response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

// Generate XML sitemap URL entry
function generateUrl(
  url: string, 
  lastmod?: string, 
  changefreq: string = 'weekly',
  priority: string = '0.8'
): string {
  const lastmodStr = lastmod 
    ? new Date(lastmod).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
    
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmodStr}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Get all locales - adjust based on your i18n setup
const LOCALES = ['de', 'en', 'tr']; // Add your supported locales
const DEFAULT_LOCALE = 'de';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const urls: string[] = [];
    
    // Static pages with high priority
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'daily' }, // Homepage
      { path: '/about', priority: '0.9', changefreq: 'monthly' },
      { path: '/contact', priority: '0.9', changefreq: 'monthly' },
      { path: '/product', priority: '0.9', changefreq: 'weekly' },
      { path: '/service', priority: '0.9', changefreq: 'weekly' },
      { path: '/sparepart', priority: '0.9', changefreq: 'weekly' },
      { path: '/references', priority: '0.8', changefreq: 'monthly' },
      { path: '/library', priority: '0.8', changefreq: 'weekly' },
      { path: '/blog', priority: '0.7', changefreq: 'daily' },
      { path: '/news', priority: '0.7', changefreq: 'daily' },
      { path: '/faqs', priority: '0.6', changefreq: 'monthly' },
      { path: '/team', priority: '0.6', changefreq: 'monthly' },
      { path: '/quality', priority: '0.6', changefreq: 'monthly' },
      { path: '/solutions', priority: '0.6', changefreq: 'monthly' },
    ];

    // Generate static page URLs for all locales
    for (const page of staticPages) {
      for (const locale of LOCALES) {
        const localePath = locale === DEFAULT_LOCALE 
          ? page.path || '/'
          : `/${locale}${page.path}`;
        
        urls.push(generateUrl(
          `${SITE_URL}${localePath}`,
          undefined,
          page.changefreq,
          page.priority
        ));
      }
    }

    // Fetch dynamic content for each locale
    for (const locale of LOCALES) {
      // Custom Pages (blog, news, solutions, etc.)
      const customPagesData = await fetchApi(`/custom_pages?locale=${locale}&limit=1000&is_published=1`);
      if (customPagesData?.items) {
        for (const page of customPagesData.items as CustomPage[]) {
          if (!page.slug || !isValidSlug(page.slug)) continue;
          
          let routePrefix = '';
          switch (page.module_key) {
            case 'blog':
              routePrefix = '/blog';
              break;
            case 'news':
              routePrefix = '/news';
              break;
            case 'solutions':
              routePrefix = '/solutions';
              break;
            case 'library':
              routePrefix = '/library';
              break;
            default:
              // Static pages like privacy-policy, terms, etc.
              routePrefix = '';
          }
          
          const localePath = locale === DEFAULT_LOCALE 
            ? `${routePrefix}/${page.slug}`
            : `/${locale}${routePrefix}/${page.slug}`;
          
          const priority = page.module_key === 'blog' || page.module_key === 'news' ? '0.8' : '0.7';
          const changefreq = page.module_key === 'blog' || page.module_key === 'news' ? 'weekly' : 'monthly';
          
          urls.push(generateUrl(
            `${SITE_URL}${localePath}`,
            page.updated_at,
            changefreq,
            priority
          ));
        }
      }

      // Products
      const productsData = await fetchApi(`/products?locale=${locale}&limit=1000&is_published=1`);
      if (productsData?.items) {
        for (const product of productsData.items as Product[]) {
          if (!product.slug || !isValidSlug(product.slug)) continue;
          
          const localePath = locale === DEFAULT_LOCALE 
            ? `/product/${product.slug}`
            : `/${locale}/product/${product.slug}`;
          
          urls.push(generateUrl(
            `${SITE_URL}${localePath}`,
            product.updated_at,
            'monthly',
            '0.8'
          ));
        }
      }

      // Services
      const servicesData = await fetchApi(`/services?locale=${locale}&limit=1000&is_published=1`);
      if (servicesData?.items) {
        for (const service of servicesData.items as Service[]) {
          if (!service.slug || !isValidSlug(service.slug)) continue;

          const localePath = locale === DEFAULT_LOCALE
            ? `/service/${service.slug}`
            : `/${locale}/service/${service.slug}`;

          urls.push(generateUrl(
            `${SITE_URL}${localePath}`,
            service.updated_at,
            'monthly',
            '0.8'
          ));
        }
      }

      // Spareparts
      const sparepartsData = await fetchApi(`/spareparts?locale=${locale}&limit=1000&is_published=1`);
      if (sparepartsData?.items) {
        for (const sparepart of sparepartsData.items as Sparepart[]) {
          if (!sparepart.slug || !isValidSlug(sparepart.slug)) continue;

          const localePath = locale === DEFAULT_LOCALE
            ? `/sparepart/${sparepart.slug}`
            : `/${locale}/sparepart/${sparepart.slug}`;

          urls.push(generateUrl(
            `${SITE_URL}${localePath}`,
            sparepart.updated_at,
            'monthly',
            '0.8'
          ));
        }
      }
    }

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache for 24 hours
    res.status(200).send(sitemap);

  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}