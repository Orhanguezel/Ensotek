import createMiddleware from 'next-intl/middleware';
import { AVAILABLE_LOCALES, FALLBACK_LOCALE } from './i18n/locales';

export default createMiddleware({
  locales: AVAILABLE_LOCALES,
  defaultLocale: FALLBACK_LOCALE,
  localePrefix: 'always',
});

export const config = {
  matcher: [
    // Match all pathnames except static files, api routes, and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};
