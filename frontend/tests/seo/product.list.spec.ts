// tests/seo/product.list.spec.ts
import { test, expect } from '@playwright/test';
import {
  readHead,
  readJsonLd,
  expectAbsolute,
  expectNotLocalhost,
  expectSameOriginAsBase,
  expectMinDescription,
} from './helpers';

test.describe('SEO: /product (list)', () => {
  test('has valid title/desc/canonical/hreflang and no localhost', async ({ page }) => {
    await page.goto('/product', { waitUntil: 'domcontentloaded' });

    const head = await readHead(page);

    expect(head.title.trim().length).toBeGreaterThan(3);

    // SEO max: description boş olmasın
    expectMinDescription(head.description, 20);

    // canonical kesin olmalı + absolute olmalı
    expectAbsolute(head.canonical);
    expectSameOriginAsBase(head.canonical);
    expectNotLocalhost(head.canonical);

    // og:url genelde canonical ile aynı olmalı
    if (head.ogUrl) {
      expectAbsolute(head.ogUrl);
      expectSameOriginAsBase(head.ogUrl);
      expectNotLocalhost(head.ogUrl);
      expect(head.ogUrl).toBe(head.canonical);
    }

    // hreflang varsa absolute olmalı
    for (const l of head.hreflangs) {
      expect(l.hreflang, 'hreflang must exist').toBeTruthy();

      expectAbsolute(l.href);
      expectSameOriginAsBase(l.href);
      expectNotLocalhost(l.href);
    }

    // html lang boş olmamalı (dynamic olabilir ama empty olmamalı)
    expect(head.lang.trim().length).toBeGreaterThan(0);

    // JSON-LD parse edilmeli (parse_error olmamalı)
    const ld = await readJsonLd(page);
    expect(ld.some((x) => x?.__parse_error__)).toBeFalsy();
  });
});
