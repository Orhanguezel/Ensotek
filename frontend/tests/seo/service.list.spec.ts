// src/frontend/tests/seo/service.list.spec.ts
import { test, expect } from '@playwright/test';
import {
  readHead,
  readJsonLd,
  expectAbsolute,
  expectNotLocalhost,
  expectSameOriginAsBase,
  expectMinDescription,
} from './helpers';

test.describe('SEO: /service (list)', () => {
  test('has valid canonical/hreflang/meta and JSON-LD parse ok', async ({ page }) => {
    await page.goto('/service', { waitUntil: 'domcontentloaded' });

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

    const ld = await readJsonLd(page);
    expect(ld.some((x) => x?.__parse_error__)).toBeFalsy();
  });
});
