// tests/seo/product.list.spec.ts
import { test, expect } from '@playwright/test';
import {
  waitForSeoHead,
  readHead,
  readJsonLd,
  expectAbsolute,
  expectNotLocalhost,
  expectSameOriginAsBase,
  expectMinDescription,
  expectHreflangSet,
} from './helpers';

test.describe('SEO: /product (list)', () => {
  test('has valid title/desc/canonical/hreflang and no localhost', async ({ page }) => {
    await page.goto('/product', { waitUntil: 'domcontentloaded' });

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

    // ✅ tek noktadan doğrula
    expectHreflangSet(head.hreflangs);

    expect(head.lang.trim().length).toBeGreaterThan(0);

    const ld = await readJsonLd(page);
    expect(ld.some((x) => x?.__parse_error__)).toBeFalsy();
  });
});
