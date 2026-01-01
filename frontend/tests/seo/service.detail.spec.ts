// tests/seo/service.detail.spec.ts
import { test, expect } from '@playwright/test';
import {
  readHead,
  readJsonLd,
  waitForSeoHead,
  getPlaywrightLocales,
  withLocalePath,
  expectNotLocalhost,
  expectAbsolute,
  expectSameOriginAsBase,
  expectMinDescription,
  expectHreflangSet,
  expectOgMatchesCanonical,
} from './helpers';

const slug = (process.env.PLAYWRIGHT_SERVICE_SLUG ?? '').trim();

test.describe('SEO: /service/[slug] (detail)', () => {
  test.skip(!slug, 'Set PLAYWRIGHT_SERVICE_SLUG to run this test.');

  const locales = getPlaywrightLocales();

  for (const locale of locales) {
    test(`has canonical/og/hreflang ok and JSON-LD parse ok [${locale}]`, async ({ page }) => {
      const url = withLocalePath(`/service/${encodeURIComponent(slug)}`, locale);
      await page.goto(url, { waitUntil: 'domcontentloaded' });

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
      }
      expectOgMatchesCanonical(head);

      expectHreflangSet(head.hreflangs);

      const ld = await readJsonLd(page);
      expect(ld.some((x) => x?.__parse_error__)).toBeFalsy();
    });
  }
});
