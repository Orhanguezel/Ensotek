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
  },

  // ✅ i18n intentionally removed

  async redirects() {
    const defaultLc = getDefaultLocaleShort();
    const prefixless = getPrefixlessFlag();

    // Prefixless default locale politikasında: /de ve /de/... => / ve /...
    if (prefixless && defaultLc) {
      return [
        { source: `/${defaultLc}`, destination: '/', permanent: true },
        { source: `/${defaultLc}/:path*`, destination: '/:path*', permanent: true },
      ];
    }

    return [];
  },

  async rewrites() {
    // locale-like prefix: xx | xxx | xx-YY | xx-yyy
    const localeSrc = ':lc([a-z]{2,3}(?:-[a-zA-Z]{2,4})?)';

    return {
      beforeFiles: [],
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

  webpack: (config) => {
    config.cache = { type: 'memory' };
    return config;
  },
};

module.exports = nextConfig;
