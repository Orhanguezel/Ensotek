// tests/seo/product.list.spec.ts
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
  expectOgMatchesCanonical,
} from './helpers';

test.describe('SEO: /product (list)', () => {
  const locales = getPlaywrightLocales();

  for (const locale of locales) {
    test(`has valid title/desc/canonical/hreflang and JSON-LD parse ok [${locale}]`, async ({
      page,
    }) => {
      await page.goto(withLocalePath('/product', locale), { waitUntil: 'domcontentloaded' });

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

      expect(head.lang.trim().length).toBeGreaterThan(0);

      const ld = await readJsonLd(page);
      expect(ld.some((x) => x?.__parse_error__)).toBeFalsy();
    });
  }
});
