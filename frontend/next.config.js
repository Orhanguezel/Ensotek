// next.config.js
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const locales = require("./src/types/locales.json");

const envDefault = String(process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "").trim();
const defaultLocale = locales.includes(envDefault)
  ? envDefault
  : (locales.includes("en") ? "en" : locales[0]);

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
  },

  i18n: {
    locales,
    defaultLocale,
    localeDetection: true,
  },

  webpack: (config) => {
    // Disk bazlı persistent cache yerine memory cache kullan
    config.cache = {
      type: "memory",
    };
    return config;
  },
};

module.exports = nextConfig;
