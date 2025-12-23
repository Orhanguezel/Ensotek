// tests/seo/product.detail.spec.ts
import { test, expect } from '@playwright/test';
import {
  readHead,
  readJsonLd,
  waitForSeoHead,
  expectAbsolute,
  expectNotLocalhost,
  expectSameOriginAsBase,
  expectMinDescription,
  expectHreflangSet,
} from './helpers';

const slug = (process.env.PLAYWRIGHT_PRODUCT_SLUG ?? '').trim();

function isType(node: any, t: string): boolean {
  const v = node?.['@type'];
  if (!v) return false;
  if (typeof v === 'string') return v === t;
  if (Array.isArray(v)) return v.includes(t);
  return false;
}

function flattenJsonLd(nodes: any[]): any[] {
  const out: any[] = [];
  const push = (x: any) => {
    if (!x) return;
    if (Array.isArray(x)) return x.forEach(push);
    if (typeof x === 'object') {
      if (Array.isArray((x as any)['@graph'])) push((x as any)['@graph']);
      out.push(x);
    }
  };
  push(nodes);
  return out;
}

test.describe('SEO: /product/[slug] (detail)', () => {
  test.skip(!slug, 'Set PLAYWRIGHT_PRODUCT_SLUG to run this test.');

  test('has Product JSON-LD + canonical/og/hreflang ok', async ({ page }) => {
    await page.goto(`/product/${encodeURIComponent(slug)}`, { waitUntil: 'domcontentloaded' });

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

    const rawLd = await readJsonLd(page);
    expect(rawLd.some((x) => x?.__parse_error__)).toBeFalsy();

    const ld = flattenJsonLd(rawLd);
    const product = ld.find((x) => isType(x, 'Product'));
    expect(product, 'Product JSON-LD must exist').toBeTruthy();
  });
});
