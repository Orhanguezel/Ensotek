// next.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  images: {
    // Modern ve kontrollü allowlist
    remotePatterns: [
      // Cloudinary
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },

      // Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },

      // Dev local (Image optimizer için)
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },

      // Seed placeholder (hata aldığın host)
      { protocol: 'https', hostname: 'cdn.example.com', pathname: '/**' },

      // PRODUCTION: kendi domain/CDN’lerin (örnekler)
      // Not: burada gerçekten kullandığın hostları yaz.
      { protocol: 'https', hostname: 'ensotek.guezelwebdesign.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ensotek.de', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.ensotek.guezelwebdesign.com', pathname: '/**' },
      { protocol: 'https', hostname: 'your-real-cdn.com', pathname: '/**' },

      // Eğer S3/R2 public endpoint kullanıyorsan (örnek)
      // { protocol: "https", hostname: "your-bucket.s3.amazonaws.com", pathname: "/**" },
      // { protocol: "https", hostname: "pub-xxxx.r2.dev", pathname: "/**" },
    ],

    // İsteğe bağlı: performans/format
    formats: ['image/avif', 'image/webp'],

    // Varsayılan olarak SVG optimize edilmez; güvenlik açısından açma
    // dangerouslyAllowSVG: false,

    // İsteğe bağlı: cache TTL
    // minimumCacheTTL: 60,
  },

  // ✅ i18n intentionally removed

  async rewrites() {
    // locale-like prefix: xx | xxx | xx-YY | xx-yyy
    const localeSrc = ':lc([a-z]{2,3}(?:-[a-zA-Z]{2,4})?)';

    return {
      beforeFiles: [],
      afterFiles: [],
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
    // Eğer build süreni iyileştiriyorsa kalsın; fakat bazı ortamlarda disk cache daha stabil olur.
    config.cache = { type: 'memory' };
    return config;
  },
};

module.exports = nextConfig;
