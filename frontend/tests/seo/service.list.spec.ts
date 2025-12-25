// tests/seo/service.list.spec.ts
import { test, expect } from '@playwright/test';
import {
  readHead,
  readJsonLd,
  waitForSeoHead,
  getPlaywrightLocales,
  withLocalePath,
  expectAbsolute,
  expectNotLocalhost,
  expectSameOriginAsBase,
  expectMinDescription,
  expectHreflangSet,
} from './helpers';

test.describe('SEO: /service (list)', () => {
  const locales = getPlaywrightLocales();

  for (const locale of locales) {
    test(`has valid canonical/hreflang/meta and JSON-LD parse ok [${locale}]`, async ({ page }) => {
      await page.goto(withLocalePath('/service', locale), { waitUntil: 'domcontentloaded' });

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

      const ld = await readJsonLd(page);
      expect(ld.some((x) => x?.__parse_error__)).toBeFalsy();
    });
  }
});
