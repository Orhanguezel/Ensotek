import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'kuhlturm.com' },
      { protocol: 'https', hostname: 'www.kuhlturm.com' },
      ...(process.env.NODE_ENV === 'development'
        ? [
            { protocol: 'http' as const, hostname: 'localhost' },
            { protocol: 'http' as const, hostname: '127.0.0.1' },
          ]
        : []),
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [
        // Root `/` transparently serves the default locale without redirect
        { source: '/', destination: '/de' },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  compress: true,
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
