import { test, expect } from '@playwright/test';
import {
  readHead,
  readJsonLd,
  waitForSeoHead,
  expectNotLocalhost,
  expectAbsolute,
  expectSameOriginAsBase,
  expectMinDescription,
  expectHreflangSet,
} from './helpers';

const slug = (process.env.PLAYWRIGHT_LIBRARY_SLUG ?? '').trim();

test.describe('SEO: /library/[slug] (detail)', () => {
  test.skip(!slug, 'Set PLAYWRIGHT_LIBRARY_SLUG to run this test.');

  test('has canonical/og/hreflang ok and JSON-LD parse ok', async ({ page }) => {
    await page.goto(`/library/${encodeURIComponent(slug)}`, { waitUntil: 'domcontentloaded' });

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
});
