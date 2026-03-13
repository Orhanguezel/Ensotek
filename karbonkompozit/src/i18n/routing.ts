import { defineRouting } from 'next-intl/routing';
import { AVAILABLE_LOCALES, FALLBACK_LOCALE } from './locales';

export const routing = defineRouting({
  locales: AVAILABLE_LOCALES as [string, ...string[]],
  defaultLocale: FALLBACK_LOCALE,
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
