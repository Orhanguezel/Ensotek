// next.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
  },

  // ✅ i18n intentionally removed

  async rewrites() {
    return [
      // ✅ /tr  => /
      {
        source: "/:lc([a-zA-Z]{2})",
        destination: "/?__lc=:lc",
      },

      // ✅ /tr/blog  => /blog
      {
        source: "/:lc([a-zA-Z]{2})/:path*",
        destination: "/:path*?__lc=:lc",
      },
    ];
  },

  // İstersen tüm site prefix'li olsun diye ana sayfayı default locale'e at:
  // (DB default_locale dinamik olduğu için burada sabit tutmak zorundasın.)
  // async redirects() {
  //   return [{ source: "/", destination: "/tr", permanent: false }];
  // },

  webpack: (config) => {
    config.cache = { type: "memory" };
    return config;
  },
};

module.exports = nextConfig;
