// tests/seo/product.detail.spec.ts
import { test, expect } from '@playwright/test';
import {
  readHead,
  readJsonLd,
  expectAbsolute,
  expectNotLocalhost,
  expectSameOriginAsBase,
  expectMinDescription,
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
    if (Array.isArray(x)) {
      for (const i of x) push(i);
      return;
    }
    if (typeof x === 'object') {
      // @graph içindekileri de çıkar
      if (Array.isArray((x as any)['@graph'])) {
        push((x as any)['@graph']);
      }
      out.push(x);
    }
  };

  push(nodes);
  return out;
}

test.describe('SEO: /product/[slug] (detail)', () => {
  test.skip(!slug, 'Set PLAYWRIGHT_PRODUCT_SLUG to run this test.');

  test('has Product JSON-LD + canonical/og ok', async ({ page }) => {
    await page.goto(`/product/${encodeURIComponent(slug)}`, {
      waitUntil: 'domcontentloaded',
    });

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

    if (head.ogImage) {
      expectAbsolute(head.ogImage);
      expectNotLocalhost(head.ogImage); // prod/preview’da enforce, localde no-op
    }

    const rawLd = await readJsonLd(page);
    expect(rawLd.some((x) => x?.__parse_error__)).toBeFalsy();

    const ld = flattenJsonLd(rawLd);

    // Product JSON-LD arıyoruz (string veya array @type)
    const product = ld.find((x) => isType(x, 'Product'));
    expect(product, 'Product JSON-LD must exist').toBeTruthy();

    // url alanı absolute olmalı + prod/preview’da localhost olmamalı
    if (product?.url) {
      const u = String(product.url);
      expect(u).toMatch(/^https?:\/\//i);

      // burada test env'e göre davranmak için helper'ı kullan:
      expectSameOriginAsBase(u);
      expectNotLocalhost(u);
    }

    // image array ise absolute olmalı
    if (Array.isArray(product?.image) && product.image.length) {
      const img0 = String(product.image[0]);
      expect(img0).toMatch(/^https?:\/\//i);
      expectNotLocalhost(img0);
    }

    // offers varsa Offer type olmalı
    if (product?.offers) {
      const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;

      expect(offer, 'Offer must exist when product.offers is present').toBeTruthy();
      expect(offer?.['@type']).toBe('Offer');

      if (offer?.url) {
        const ou = String(offer.url);
        expect(ou).toMatch(/^https?:\/\//i);
        expectNotLocalhost(ou);
      }
    }
  });
});
