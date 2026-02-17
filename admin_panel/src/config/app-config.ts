// =============================================================
// FILE: src/config/app-config.ts
// Admin Panel Config — DB'den gelen branding verileri için fallback
// =============================================================

import packageJson from '../../package.json';

const currentYear = new Date().getFullYear();

export type AdminBrandingConfig = {
  app_name: string;
  app_copyright: string;
  html_lang: string;
  theme_color: string;
  favicon_16: string;
  favicon_32: string;
  apple_touch_icon: string;
  meta: {
    title: string;
    description: string;
    og_url: string;
    og_title: string;
    og_description: string;
    og_image: string;
    twitter_card: string;
  };
};

export const DEFAULT_BRANDING: AdminBrandingConfig = {
  app_name: 'Ensotek Admin Panel',
  app_copyright: 'Ensotek GmbH',
  html_lang: 'de',
  theme_color: '#0066CC',
  favicon_16: '/favicon/favicon-16.svg',
  favicon_32: '/favicon/favicon-32.svg',
  apple_touch_icon: '/favicon/apple-touch-icon.svg',
  meta: {
    title: 'Ensotek - Industrielle Kühl- und Klimatechnik | HVAC Lösungen',
    description:
      'Ensotek: Führender Anbieter für industrielle Kühl- und Klimatechnik. Adiabate Kühlung, Verdunstungskühler und maßgeschneiderte HVAC-Lösungen für Industrie und Gewerbe.',
    og_url: 'https://ensotek.de/',
    og_title: 'Ensotek - Industrielle Kühl- und Klimatechnik',
    og_description:
      'Professionelle HVAC-Lösungen für Industrie und Gewerbe. Adiabate Kühlung, Verdunstungskühler und energieeffiziente Klimatechnik.',
    og_image: '/logo/ensotek-logo.svg',
    twitter_card: 'summary_large_image',
  },
};

export const APP_CONFIG = {
  name: DEFAULT_BRANDING.app_name,
  version: packageJson.version,
  copyright: `© ${currentYear}, ${DEFAULT_BRANDING.app_copyright}.`,
  meta: {
    title: DEFAULT_BRANDING.meta.title,
    description: DEFAULT_BRANDING.meta.description,
  },
  branding: DEFAULT_BRANDING,
} as const;
