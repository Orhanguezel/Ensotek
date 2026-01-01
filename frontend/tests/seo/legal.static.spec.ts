import { test, expect } from '@playwright/test';
import {
  waitForSeoHead,
  readHead,
  readJsonLd,
  getPlaywrightLocales,
  withLocalePath,
  expectAbsolute,
  expectNotLocalhost,
  expectSameOriginAsBase,
  expectMinDescription,
  expectHreflangSet,
} from './helpers';

const ROUTES = [
  '/contact',
  '/offer',
  '/faqs',
  '/references',
  '/quality',
  '/mission-vision',
  '/cookie-policy',
  '/privacy-policy',
  '/privacy-notice',
  '/legal-notice',
  '/terms',
  '/kvkk',
];

test.describe('SEO: static/legal routes', () => {
  const locales = getPlaywrightLocales();

  for (const locale of locales) {
    for (const route of ROUTES) {
      test(`has valid title/desc/canonical/hreflang [${locale}] ${route}`, async ({ page }) => {
        await page.goto(withLocalePath(route, locale), { waitUntil: 'domcontentloaded' });

        await waitForSeoHead(page, { waitHreflang: true });

        const head = await readHead(page);

        expect(head.title.trim().length).toBeGreaterThan(3);
        expectMinDescription(head.description, 20);

        expectAbsolute(head.canonical);
        expectSameOriginAsBase(head.canonical);
        expectNotLocalhost(head.canonical);

        if (head.ogUrl) {
          expectAbsolute(head.ogUrl);
          expectSameOriginAsBase(head.ogUrl);
          expectNotLocalhost(head.ogUrl);
          expect(head.ogUrl).toBe(head.canonical);
        }

        expectHreflangSet(head.hreflangs);
        expect(head.lang.trim().length).toBeGreaterThan(0);

        const ld = await readJsonLd(page);
        expect(ld.some((x) => x?.__parse_error__)).toBeFalsy();
      });
    }
  }
});
