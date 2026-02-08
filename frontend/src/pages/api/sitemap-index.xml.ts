// =============================================================
// FILE: pages/api/sitemap-index.xml.ts
// Sitemap Index for managing multiple sitemaps
// =============================================================

import type { NextApiRequest, NextApiResponse } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ensotek.de';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lastmod = new Date().toISOString().split('T')[0];

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-products.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-services.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-blog.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-news.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).send(sitemapIndex);

  } catch (error) {
    console.error('Sitemap index generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap index' });
  }
}