const path = require('node:path');

/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  // Workspace root — bun hoisting nedeniyle paketler üst dizinde çözümlenir
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.ensotek.de' },
      { protocol: 'https', hostname: 'www.ensotek.de' },
      { protocol: 'https', hostname: 'ensotek.de' },

      ...(process.env.NODE_ENV === 'development'
        ? [
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'http', hostname: '127.0.0.1' },
          ]
        : []),
    ],
  },

  async rewrites() {
    return {
      // beforeFiles: runs before static files + pages → transparent rewrite (no redirect)
      // `/` → `/de` so that http://localhost:3002 serves the default locale without a redirect.
      // Update `/de` here if FALLBACK_LOCALE ever changes.
      beforeFiles: [
        { source: '/', destination: '/de' },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  async redirects() {
    return [
      {
        source: '/:locale/services/:path*',
        destination: '/:locale/service/:path*',
        permanent: true,
      },
      {
        source: '/services/:path*',
        destination: '/service/:path*',
        permanent: true,
      },
      // Eski legal route'larını /legal/[slug] altına yönlendir
      { source: '/:locale/privacy-notice', destination: '/:locale/legal/privacy-notice', permanent: true },
      { source: '/:locale/privacy-policy', destination: '/:locale/legal/privacy-policy', permanent: true },
      { source: '/:locale/cookie-policy',  destination: '/:locale/legal/cookie-policy',  permanent: true },
      { source: '/:locale/terms',          destination: '/:locale/legal/terms',          permanent: true },
      { source: '/:locale/kvkk',           destination: '/:locale/legal/kvkk',           permanent: true },
      { source: '/:locale/legal-notice',   destination: '/:locale/legal/legal-notice',   permanent: true },
    ];
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-accordion',
      '@radix-ui/react-select',
    ],
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
            radix: {
              name: 'radix',
              test: /[\\/]node_modules[\\/]@radix-ui/,
              priority: 30,
            },
          },
        },
      };

      if (Array.isArray(config.optimization?.minimizer)) {
        config.optimization.minimizer.forEach((minimizer) => {
          if (minimizer?.constructor?.name === 'TerserPlugin') {
            minimizer.options.terserOptions = {
              ...minimizer.options.terserOptions,
              compress: {
                ...minimizer.options.terserOptions?.compress,
                drop_console: true,
              },
            };
          }
        });
      }
    }

    return config;
  },

  // CSP headers are managed by nginx in production.
  // Adding them here would cause duplicate headers and stricter-than-intended policy.
  async headers() {
    return [];
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
