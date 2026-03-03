import { defineRouting } from 'next-intl/routing';
import { AVAILABLE_LOCALES, FALLBACK_LOCALE } from './locales';

export const routing = defineRouting({
  locales: AVAILABLE_LOCALES as [string, ...string[]],
  defaultLocale: FALLBACK_LOCALE,
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

// Typed Link and redirect wrappers
export { createNavigation } from 'next-intl/navigation';

import { createNavigation } from 'next-intl/navigation';

const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

export { Link, redirect, usePathname, useRouter, getPathname };
