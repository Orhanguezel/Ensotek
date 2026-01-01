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

async function waitForProductJsonLd(page: any, timeoutMs = 12_000) {
  await page.waitForFunction(
    () => {
      const nodes = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      ) as HTMLScriptElement[];

      const parseAny = (raw: string) => {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      };

      const flatten = (x: any, acc: any[]) => {
        if (!x) return;
        if (Array.isArray(x)) return x.forEach((y) => flatten(y, acc));
        if (typeof x === 'object') {
          if (Array.isArray((x as any)['@graph'])) flatten((x as any)['@graph'], acc);
          acc.push(x);
        }
      };

      const all: any[] = [];
      for (const n of nodes) {
        const raw = (n.textContent || '').trim();
        if (!raw) continue;
        const parsed = parseAny(raw);
        if (!parsed) continue;
        flatten(parsed, all);
      }

      const hasProduct = all.some((obj) => {
        const t = (obj as any)?.['@type'];
        if (!t) return false;
        if (typeof t === 'string') return t === 'Product';
        if (Array.isArray(t)) return t.includes('Product');
        return false;
      });

      return hasProduct;
    },
    { timeout: timeoutMs },
  );
}

test.describe('SEO: /product/[slug] (detail)', () => {
  test.skip(!slug, 'Set PLAYWRIGHT_PRODUCT_SLUG to run this test.');

  const locales = getPlaywrightLocales();

  for (const locale of locales) {
    test(`has Product JSON-LD + canonical/og/hreflang ok [${locale}]`, async ({ page }) => {
      // locale-aware url
      await page.goto(withLocalePath(`/product/${encodeURIComponent(slug)}`, locale), {
        waitUntil: 'domcontentloaded',
      });

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

      // ✅ JSON-LD wait (CSR/RTK fetch gecikmesi için)
      try {
        await waitForProductJsonLd(page, 12_000);
      } catch {
        // debug: hangi type'lar var?
        const rawLd = await readJsonLd(page);
        const flat = flattenJsonLd(rawLd);

        const types = flat
          .map((x) => x?.['@type'])
          .filter(Boolean)
          .map((t) => (Array.isArray(t) ? t.join(',') : String(t)))
          .slice(0, 30);

        throw new Error(
          `Product JSON-LD not found. Found types: [${types.join(' | ')}]. ` +
            `ldCount=${flat.length}, scriptCount=${rawLd.length}`,
        );
      }

      const rawLd = await readJsonLd(page);
      expect(rawLd.some((x) => x?.__parse_error__)).toBeFalsy();

      const ld = flattenJsonLd(rawLd);
      const product = ld.find((x) => isType(x, 'Product'));
      expect(product, 'Product JSON-LD must exist').toBeTruthy();
    });
  }
});
