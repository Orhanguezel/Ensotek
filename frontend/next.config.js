// next.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    ],
  },

  // ✅ i18n intentionally removed

  async rewrites() {
    // locale-like prefix: xx | xxx | xx-YY | xx-yyy
    const localeSrc = ':lc([a-z]{2,3}(?:-[a-zA-Z]{2,4})?)';

    return {
      beforeFiles: [],
      afterFiles: [],
      // ✅ 404'e düşmeden önce en sonda da olsa uygulanır
      fallback: [
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

  webpack: (config) => {
    config.cache = { type: 'memory' };
    return config;
  },
};

module.exports = nextConfig;
