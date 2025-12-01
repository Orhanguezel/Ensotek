/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const locales = require("./src/types/locales.json");

// env'deki defaultLocale listede yoksa 'tr' → yoksa ilk eleman
const envDefault = String(process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "").trim();
const defaultLocale = locales.includes(envDefault)
  ? envDefault
  : (locales.includes("tr") ? "tr" : locales[0]);

const nextConfig = {
  reactStrictMode: true,

  images: {
    // İstersen bu satırı tamamen silebilirsin, istersen iki host'u da ekleyebilirsin
    // domains: ["res.cloudinary.com", "images.unsplash.com"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
       {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },

  i18n: {
    locales,
    defaultLocale,
    localeDetection: true,
  },
};

module.exports = nextConfig;
