import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  images: {
    dangerouslyAllowLocalIP: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'kuhlturm.com' },
      { protocol: 'https', hostname: 'www.kuhlturm.com' },
      { protocol: 'https', hostname: 'ensotek.de' },
      { protocol: 'https', hostname: 'www.ensotek.de' },
      { protocol: 'https', hostname: 'cdn.ensotek.de' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      ...(process.env.NODE_ENV === 'development'
        ? [
            { protocol: 'http' as const, hostname: 'localhost', port: '' },
            { protocol: 'http' as const, hostname: 'localhost', port: '8086' },
            { protocol: 'http' as const, hostname: 'localhost', port: '3010' },
            { protocol: 'http' as const, hostname: '127.0.0.1', port: '' },
            { protocol: 'http' as const, hostname: '127.0.0.1', port: '8086' },
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
