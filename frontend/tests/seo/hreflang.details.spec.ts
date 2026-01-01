import { test, expect } from '@playwright/test';
import {
  waitForSeoHead,
  readHead,
  getPlaywrightLocales,
  withLocalePath,
  expectAbsolute,
  expectNotLocalhost,
  expectSameOriginAsBase,
  expectHreflangSet,
} from './helpers';

type Detail = { name: string; env: string; path: string };

const DETAILS: Detail[] = [
  { name: 'product', env: 'PLAYWRIGHT_PRODUCT_SLUG', path: '/product/[slug]' },
  { name: 'service', env: 'PLAYWRIGHT_SERVICE_SLUG', path: '/service/[slug]' },
  { name: 'news', env: 'PLAYWRIGHT_NEWS_SLUG', path: '/news/[slug]' },
  { name: 'library', env: 'PLAYWRIGHT_LIBRARY_SLUG', path: '/library/[slug]' },
  { name: 'team', env: 'PLAYWRIGHT_TEAM_SLUG', path: '/team/[slug]' },
];

test.describe('SEO hreflang: detail pages', () => {
  const locales = getPlaywrightLocales();

  for (const d of DETAILS) {
    const slug = (process.env[d.env] || '').trim();
    test.skip(!slug, `Set ${d.env} to run ${d.name} detail hreflang tests.`);

    for (const locale of locales) {
      test(`hreflang ok [${locale}] /${d.name}/[slug]`, async ({ page }) => {
        const path = d.path.replace('[slug]', encodeURIComponent(slug));
        const url = withLocalePath(path, locale);

        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await waitForSeoHead(page, { waitHreflang: true });

        const head = await readHead(page);

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

        expect(head.lang.trim().length).toBeGreaterThan(0);
      });
    }
  }
});
