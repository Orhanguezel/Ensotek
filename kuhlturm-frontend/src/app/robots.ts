import type { MetadataRoute } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.kuhlturm.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/*/login', '/*/register', '/*/logout', '/*/dashboard'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
