// src/frontend/tests/seo/service.detail.spec.ts

import { test, expect } from '@playwright/test';
import { readHead, readJsonLd, expectNotLocalhost, expectAbsolute } from './helpers';

const slug = process.env.PLAYWRIGHT_SERVICE_SLUG || '';

test.describe('SEO: /service/[slug] (detail)', () => {
  test.skip(!slug, 'Set PLAYWRIGHT_SERVICE_SLUG to run this test.');

  test('has canonical/og ok and JSON-LD parse ok', async ({ page }) => {
    await page.goto(`/service/${encodeURIComponent(slug)}`, { waitUntil: 'domcontentloaded' });

    const head = await readHead(page);

    expect(head.title.trim().length).toBeGreaterThan(3);
    expect(head.description && head.description.trim().length).toBeGreaterThan(20);

    expectAbsolute(head.canonical);
    expectNotLocalhost(head.canonical);

    const ld = await readJsonLd(page);
    expect(ld.some((x) => x?.__parse_error__)).toBeFalsy();

    // Eğer service detail sayfasında ServiceJsonLd render ediyorsan:
    // (render etmiyorsan bu kısmı kaldır veya "optional" yap)
    const hasService = ld.some((x) => x?.['@type'] === 'Service');
    // optional: var mı yok mu projene bağlı
    // expect(hasService).toBeTruthy();
  });
});
