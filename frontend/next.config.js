// next.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const getDefaultLocaleShort = () => {
  const raw = String(process.env.NEXT_PUBLIC_DEFAULT_LOCALE || '')
    .trim()
    .toLowerCase();
  const short = raw.replace('_', '-').split('-')[0] || '';
  return short || 'de'; // env yoksa fallback (prod’da zaten env var)
};

const getPrefixlessFlag = () => {
  // opsiyonel: env ile kontrol et
  // NEXT_PUBLIC_DEFAULT_LOCALE_PREFIXLESS=true/false
  const raw = String(process.env.NEXT_PUBLIC_DEFAULT_LOCALE_PREFIXLESS || '')
    .trim()
    .toLowerCase();
  if (!raw) return true; // mevcut standardın
  return raw === '1' || raw === 'true' || raw === 'yes';
};

const cspHeader = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://ensotek.de https://www.ensotek.de https://cdn.ensotek.de https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net",
  "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://ensotek.de https://www.ensotek.de http://localhost:8086 http://127.0.0.1:8086",
  "frame-src 'self' https://www.googletagmanager.com",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.example.com', pathname: '/**' },

      { protocol: 'https', hostname: 'ensotek.de', pathname: '/**' },
      { protocol: 'https', hostname: 'www.ensotek.de', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.ensotek.de', pathname: '/**' },
      { protocol: 'https', hostname: 'your-real-cdn.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@/components', '@/utils', 'framer-motion', 'swiper'],
    scrollRestoration: true,
  },

  // ✅ i18n intentionally removed

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },

  async redirects() {
    const defaultLc = getDefaultLocaleShort();
    const prefixless = getPrefixlessFlag();

    const redirects = [];

    // Prefixless default locale politikasında: /de ve /de/... => / ve /...
    if (prefixless && defaultLc) {
      redirects.push(
        { source: `/${defaultLc}`, destination: '/', permanent: true },
        { source: `/${defaultLc}/:path*`, destination: '/:path*', permanent: true }
      );
    }

    // Production'da non-www -> www redirect (SEO için)
    // Development'ta bu redirect'i devre dışı bırak
    if (process.env.NODE_ENV === 'production') {
      redirects.push({
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'ensotek.de',
          },
        ],
        destination: 'https://www.ensotek.de/:path*',
        permanent: true,
      });
    }

    return redirects;
  },

  async rewrites() {
    // locale-like prefix: xx | xxx | xx-YY | xx-yyy
    const localeSrc = ':lc([a-z]{2,3}(?:-[a-zA-Z]{2,4})?)';

    return {
      beforeFiles: [
        // SEO: Sitemap rewrites
        { source: '/sitemap.xml', destination: '/api/sitemap.xml' },
        { source: '/sitemap-index.xml', destination: '/api/sitemap-index.xml' },
        { source: '/sitemap-pages.xml', destination: '/api/sitemap-pages.xml' },
        { source: '/sitemap-products.xml', destination: '/api/sitemap-products.xml' },
        { source: '/sitemap-services.xml', destination: '/api/sitemap-services.xml' },
        { source: '/sitemap-blog.xml', destination: '/api/sitemap-blog.xml' },
        { source: '/sitemap-news.xml', destination: '/api/sitemap-news.xml' },
      ],
      afterFiles: [],
      fallback: [
        // locale prefix’i query’e çevir (SSR canonical builder __lc ile doğru locale seçsin)
        {
          source: `/${localeSrc}/:path*`,
          destination: '/:path*?__lc=:lc',
        },
        {
          source: `/${localeSrc}`,
          destination: '/?__lc=:lc',
        },
      ],
    };
  },

  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer (enable only when needed)
    if (process.env.ANALYZE === 'true' && !dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    
    // Performance optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244 * 1024, // 244KB
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              maxSize: 244 * 1024,
            },
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
      };

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Cache optimization
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    } else {
      // Cache optimization for development
      config.cache = { type: 'memory' };
    }

    return config;
  },
};

module.exports = nextConfig;
