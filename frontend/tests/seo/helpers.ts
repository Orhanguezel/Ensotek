// tests/seo/helpers.ts
import { expect, Page } from '@playwright/test';

export type HeadSnapshot = {
  title: string;
  lang: string;
  canonical: string | null;

  robots: string | null;
  description: string | null;

  ogUrl: string | null;
  ogTitle: string | null;
  ogDesc: string | null;
  ogImage: string | null;
  ogLocale: string | null;

  twitterCard: string | null;
  twitterSite: string | null;
  twitterCreator: string | null;

  hreflangs: Array<{ hreflang: string; href: string }>;
};

export async function readHead(page: Page): Promise<HeadSnapshot> {
  return page.evaluate(() => {
    const getMetaName = (name: string) =>
      (document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null)?.content ?? null;

    const getMetaProp = (prop: string) =>
      (document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null)?.content ??
      null;

    const canonical =
      (document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null)?.href ?? null;

    const title = document.title || '';
    const lang = document.documentElement.getAttribute('lang') || '';

    const hreflangs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(
      (el) => {
        const link = el as HTMLLinkElement;
        return { hreflang: link.hreflang, href: link.href };
      },
    );

    return {
      title,
      lang,
      canonical,

      robots: getMetaName('robots'),
      description: getMetaName('description'),

      ogUrl: getMetaProp('og:url'),
      ogTitle: getMetaProp('og:title'),
      ogDesc: getMetaProp('og:description'),
      ogImage: getMetaProp('og:image'),
      ogLocale: getMetaProp('og:locale'),

      twitterCard: getMetaName('twitter:card'),
      twitterSite: getMetaName('twitter:site'),
      twitterCreator: getMetaName('twitter:creator'),

      hreflangs,
    };
  });
}

/** Sayfadaki tüm JSON-LD scriptlerini parse eder (array/object). */
export async function readJsonLd(page: Page): Promise<any[]> {
  return page.evaluate(() => {
    const nodes = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    ) as HTMLScriptElement[];

    const out: any[] = [];
    for (const n of nodes) {
      const raw = (n.textContent || '').trim();
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) out.push(...parsed);
        else out.push(parsed);
      } catch {
        out.push({ __parse_error__: true, raw: raw.slice(0, 200) });
      }
    }
    return out;
  });
}

/** base origin: env > fallback localhost */
export function getBaseOrigin(): string {
  const fromEnv = (process.env.PLAYWRIGHT_BASE_URL ?? '').trim();
  if (fromEnv) {
    try {
      return new URL(fromEnv).origin;
    } catch {
      // ignore
    }
  }
  return 'http://localhost';
}

function isLocalOrigin(origin: string): boolean {
  const o = String(origin || '').toLowerCase();
  return o.includes('://localhost') || o.includes('://127.0.0.1');
}

/** URL’nin localhost olmamasını garanti eder (prod/test için kritik). */
export function expectNotLocalhost(url: string | null) {
  expect(url, 'URL must exist').toBeTruthy();

  // local koşumda localhost'a izin ver
  const baseOrigin = getBaseOrigin();
  if (isLocalOrigin(baseOrigin)) return;

  expect(url!, 'URL must not be localhost').not.toMatch(/:\/\/localhost[:/]/i);
  expect(url!, 'URL must not be 127.0.0.1').not.toMatch(/:\/\/127\.0\.0\.1[:/]/i);
}

/** Absolute URL olmalı */
export function expectAbsolute(url: string | null) {
  expect(url, 'URL must exist').toBeTruthy();
  expect(url!, 'URL must be absolute').toMatch(/^https?:\/\//i);
}

/** Description boş olmasın (SEO test standardı) */
export function expectMinDescription(desc: string | null, minLen = 20) {
  const d = (desc || '').trim();
  expect(d.length, `meta description length must be >= ${minLen}`).toBeGreaterThanOrEqual(minLen);
}

/** canonical/ogUrl gibi URL'ler base origin ile aynı origin olmalı (opsiyonel ama testlerde var) */
export function expectSameOriginAsBase(url: string | null) {
  expect(url, 'URL must exist').toBeTruthy();

  const baseOrigin = getBaseOrigin();
  const targetOrigin = new URL(url!).origin;

  // local koşumda bunu da gevşetmek istersen:
  // if (isLocalOrigin(baseOrigin)) return;

  expect(targetOrigin, 'URL must match base origin').toBe(new URL(baseOrigin).origin);
}
