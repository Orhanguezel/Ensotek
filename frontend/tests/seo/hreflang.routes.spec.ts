import { test, expect } from '@playwright/test';
import {
  waitForSeoHead,
  readHead,
  getPlaywrightLocales,
  withLocalePath,
  expectAbsolute,
  expectNotLocalhost,
  expectSameOriginAsBase,
  expectHreflangSet,
  // opsiyonel:
  // expectHreflangMatchesCanonical,
} from './helpers';

const ROUTES = [
  '/', // home
  '/product',
  '/service',
  '/news',
  '/library',
  '/references',
  '/contact',
  '/offer',
  '/faqs',
  '/terms',
  '/privacy-policy',
  '/privacy-notice',
  '/cookie-policy',
  '/legal-notice',
  '/kvkk',
  '/mission-vision',
  '/quality',
  '/team',
];

test.describe('SEO hreflang: important routes', () => {
  const locales = getPlaywrightLocales();

  for (const locale of locales) {
    for (const route of ROUTES) {
      test(`hreflang set is valid [${locale}] ${route}`, async ({ page }) => {
        const url = withLocalePath(route, locale);
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await waitForSeoHead(page, { waitHreflang: true });

        const head = await readHead(page);

        // canonical sanity
        expectAbsolute(head.canonical);
        expectSameOriginAsBase(head.canonical);
        expectNotLocalhost(head.canonical);

        // og:url varsa canonical ile aynı olmalı (senin standardın)
        if (head.ogUrl) {
          expectAbsolute(head.ogUrl);
          expectSameOriginAsBase(head.ogUrl);
          expectNotLocalhost(head.ogUrl);
          expect(head.ogUrl).toBe(head.canonical);
        }

        // hreflang set (unique + locales + x-default + origin checks)
        expectHreflangSet(head.hreflangs);

        // Opsiyonel: current locale hreflang href === canonical
        // expectHreflangMatchesCanonical(head.canonical, head.hreflangs, locale);

        // html lang boş olmasın
        expect(head.lang.trim().length).toBeGreaterThan(0);
      });
    }
  }
});
