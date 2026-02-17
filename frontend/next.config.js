/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,

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

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://cdn.ensotek.de https://www.ensotek.de https://ensotek.de",
      "font-src 'self' https://fonts.gstatic.com data:",
      `connect-src 'self' ${
        isDev
          ? 'http://127.0.0.1:8086 http://localhost:8086 ws://127.0.0.1:8086 ws://localhost:8086'
          : ''
      } https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://ensotek.de https://www.ensotek.de https://cdn.ensotek.de`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'block-all-mixed-content',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
