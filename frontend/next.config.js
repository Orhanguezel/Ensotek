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
    formats: ['image/avif', 'image/webp'], // AVIF öncelik, fallback WebP
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Small images için
    minimumCacheTTL: 2592000, // 30 gün cache
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.ensotek.de' },
      { protocol: 'https', hostname: 'www.ensotek.de' },
      { protocol: 'https', hostname: 'ensotek.de' },
      // Localhost patterns (development only)
      ...(process.env.NODE_ENV === 'development' ? [
        { protocol: 'http', hostname: 'localhost' },
        { protocol: 'http', hostname: '127.0.0.1' },
      ] : []),
    ],
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
      // Production client-side optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
            // Radix UI separate chunk
            radix: {
              name: 'radix',
              test: /[\\/]node_modules[\\/]@radix-ui/,
              priority: 30,
            },
          },
        },
      };

      // Remove console.log in production
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            compress: {
              ...minimizer.options.terserOptions.compress,
              drop_console: true,
            },
          };
        }
      });
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
