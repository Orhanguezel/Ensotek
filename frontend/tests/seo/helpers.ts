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

const stripTrailingSlash = (u: string) =>
  String(u || '')
    .trim()
    .replace(/\/+$/, '');

// Localhost/127.0.0.1 için portu normalize ederek false negative’i engeller
const normalizeLocalhostOrigin = (origin: string): string => {
  const o = stripTrailingSlash(origin);
  if (/^https?:\/\/localhost:\d+$/i.test(o)) return o.replace(/:\d+$/i, '');
  if (/^https?:\/\/127\.0\.0\.1:\d+$/i.test(o)) return o.replace(/:\d+$/i, '');
  return o;
};

function isLocalOrigin(origin: string): boolean {
  const o = String(origin || '').toLowerCase();
  return o.includes('://localhost') || o.includes('://127.0.0.1');
}

/** base origin: env > fallback localhost */
export function getBaseOrigin(): string {
  const fromEnv =
    (process.env.PLAYWRIGHT_BASE_URL ?? '').trim() ||
    (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim();

  if (fromEnv) {
    try {
      const u = new URL(fromEnv);
      // origin normalize: localhost port stripped for comparisons
      return normalizeLocalhostOrigin(u.origin);
    } catch {
      // ignore
    }
  }

  // default fallback (comparisons will normalize)
  return 'http://localhost';
}

/* ----------------------------- locale helpers ----------------------------- */

/**
 * Locale list:
 * - PLAYWRIGHT_LOCALES="tr,en,de"
 * - or PLAYWRIGHT_LOCALE="tr"
 * fallback: ["tr"]
 */
export function getPlaywrightLocales(): string[] {
  const many = (process.env.PLAYWRIGHT_LOCALES ?? '').trim();
  const one = (process.env.PLAYWRIGHT_LOCALE ?? '').trim();

  const raw = many
    ? many
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    : one
    ? [one]
    : ['tr'];

  const uniqLower = Array.from(new Set(raw.map((x) => x.toLowerCase())));
  return uniqLower.length ? uniqLower : ['tr'];
}

/**
 * If routing has NO locale prefix for default locale, set:
 * - PLAYWRIGHT_DEFAULT_NO_PREFIX=1
 * - PLAYWRIGHT_DEFAULT_LOCALE=tr (optional, default "tr")
 */
export function withLocalePath(path: string, locale: string): string {
  const loc =
    String(locale || '')
      .trim()
      .toLowerCase() || 'tr';
  const p = `/${String(path || '').replace(/^\/+/, '')}`; // ensure starts with "/"

  const defaultNoPrefix = (process.env.PLAYWRIGHT_DEFAULT_NO_PREFIX ?? '').trim() === '1';
  const defaultLocale = (process.env.PLAYWRIGHT_DEFAULT_LOCALE ?? 'tr').trim().toLowerCase();

  if (defaultNoPrefix && loc === defaultLocale) {
    return p === '/' ? '/' : p;
  }

  if (p === '/') return `/${loc}`;
  return `/${loc}${p}`;
}

/* ----------------------------- helpers ----------------------------- */

async function safeEval<T>(page: Page, fn: () => T): Promise<T | null> {
  try {
    return await page.evaluate(fn);
  } catch {
    return null;
  }
}

async function pollUntil(
  page: Page,
  predicate: () => boolean,
  opts: { timeoutMs: number; intervalMs?: number },
): Promise<boolean> {
  const timeoutMs = Math.max(0, opts.timeoutMs);
  const intervalMs = Math.max(50, opts.intervalMs ?? 100);

  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await safeEval(page, predicate);
    if (ok === true) return true;
    await page.waitForTimeout(intervalMs);
  }
  return false;
}

type HeadDebug = {
  title: string;
  canonical: string | null;
  desc: string | null;
  hreflangCount: number;
  nextHeadCount: string | null;
  headSample: string;
  bodySample: string;
};

async function readHeadDebug(page: Page): Promise<HeadDebug | null> {
  return safeEval(page, () => {
    const canonical =
      (document.querySelector('link[rel="canonical"][href]') as HTMLLinkElement | null)?.href ??
      null;

    const desc =
      (document.querySelector('meta[name="description"][content]') as HTMLMetaElement | null)
        ?.content ?? null;

    const title = (document.title || '').trim();

    const hreflangCount = document.querySelectorAll('link[rel="alternate"][hreflang][href]').length;

    const nextHeadCount =
      (document.querySelector('meta[name="next-head-count"]') as HTMLMetaElement | null)?.content ??
      null;

    const headHtml = (document.head?.innerHTML || '').trim();
    const bodyTxt = (document.body?.innerText || '').trim();

    return {
      title,
      canonical,
      desc,
      hreflangCount,
      nextHeadCount,
      headSample: headHtml.slice(0, 900),
      bodySample: bodyTxt.slice(0, 900),
    };
  });
}

/**
 * ✅ FAIL-FAST SEO head readiness guard
 * - marker (Layout) -> title/canonical/description -> optional hreflang
 */
export async function waitForSeoHead(
  page: Page,
  opts?: { waitHreflang?: boolean; timeoutMs?: number },
) {
  const timeout = typeof opts?.timeoutMs === 'number' ? opts.timeoutMs : 20_000;
  const hreflangWait = 8_000;

  // Best-effort: dom ready
  try {
    await page.waitForLoadState('domcontentloaded', { timeout: Math.min(10_000, timeout) });
  } catch {
    // ignore
  }

  // 0) Fatal overlay / server error sinyalleri (kısa)
  const fatalDetected = await pollUntil(
    page,
    () => {
      const txt = (document.body?.innerText || '').toLowerCase();

      if (txt.includes('nextrouter was not mounted')) return true;
      if (txt.includes('server error')) return true;
      if (txt.includes('application error')) return true;
      if (txt.includes('unhandled error')) return true;

      const overlay =
        document.querySelector('div[data-nextjs-error-overlay]') ||
        document.querySelector('#__next .next-error-h1') ||
        document.querySelector('body > div#__next-error');

      return Boolean(overlay);
    },
    { timeoutMs: Math.min(3_000, timeout), intervalMs: 100 },
  );

  if (fatalDetected) {
    const dbg = await readHeadDebug(page);
    throw new Error(
      `FATAL page error detected before SEO head was ready. ` +
        `title="${dbg?.title ?? ''}", canonical="${dbg?.canonical ?? ''}", ` +
        `descLen=${(dbg?.desc ?? '').length}, hreflangCount=${dbg?.hreflangCount ?? 0}. ` +
        `bodySample="${(dbg?.bodySample ?? '').replace(/\s+/g, ' ').slice(0, 240)}"`,
    );
  }

  // 1) Layout marker
  const markerOk = await pollUntil(
    page,
    () => Boolean(document.querySelector('meta[name="app:layout"][content="public"]')),
    { timeoutMs: timeout, intervalMs: 100 },
  );

  if (!markerOk) {
    const dbg = await readHeadDebug(page);
    throw new Error(
      `Layout head marker not found within ${timeout}ms. ` +
        `next-head-count="${dbg?.nextHeadCount ?? ''}". ` +
        `headSample="${(dbg?.headSample ?? '').replace(/\s+/g, ' ').slice(0, 260)}" ` +
        `bodySample="${(dbg?.bodySample ?? '').replace(/\s+/g, ' ').slice(0, 260)}"`,
    );
  }

  // 2) title + canonical + description
  const readyOk = await pollUntil(
    page,
    () => {
      const t = (document.title || '').trim();

      const canonical =
        (document.querySelector('link[rel="canonical"][href]') as HTMLLinkElement | null)?.href ||
        '';

      const desc =
        (document.querySelector('meta[name="description"][content]') as HTMLMetaElement | null)
          ?.content || '';

      return Boolean(t.length > 0 && canonical.trim().length > 0 && desc.trim().length > 0);
    },
    { timeoutMs: timeout, intervalMs: 100 },
  );

  if (!readyOk) {
    const dbg = await readHeadDebug(page);
    throw new Error(
      `SEO head not ready within ${timeout}ms. ` +
        `title="${dbg?.title ?? ''}", canonical="${dbg?.canonical ?? ''}", ` +
        `descLen=${(dbg?.desc ?? '').length}, hreflangCount=${dbg?.hreflangCount ?? 0}. ` +
        `headSample="${(dbg?.headSample ?? '').replace(/\s+/g, ' ').slice(0, 260)}"`,
    );
  }

  if (!opts?.waitHreflang) return;

  // 3) hreflang
  const hreflangOk = await pollUntil(
    page,
    () => document.querySelectorAll('link[rel="alternate"][hreflang][href]').length > 0,
    { timeoutMs: hreflangWait, intervalMs: 100 },
  );

  if (!hreflangOk) {
    const dbg = await readHeadDebug(page);
    throw new Error(
      `hreflang links not found within ${hreflangWait}ms. ` +
        `title="${dbg?.title ?? ''}", canonical="${dbg?.canonical ?? ''}", ` +
        `descLen=${(dbg?.desc ?? '').length}, hreflangCount=${dbg?.hreflangCount ?? 0}. ` +
        `headSample="${(dbg?.headSample ?? '').replace(/\s+/g, ' ').slice(0, 260)}"`,
    );
  }
}

/* ------------------------- read head / ld+json ------------------------- */

export async function readHead(page: Page): Promise<HeadSnapshot> {
  return page.evaluate(() => {
    const getMetaName = (name: string) =>
      (document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null)?.content ?? null;

    const getMetaProp = (prop: string) =>
      (document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null)?.content ??
      null;

    const canonical =
      (document.querySelector('link[rel="canonical"][href]') as HTMLLinkElement | null)?.href ??
      null;

    const title = document.title || '';
    const lang = document.documentElement.getAttribute('lang') || '';

    const hreflangs = Array.from(
      document.querySelectorAll('link[rel="alternate"][hreflang][href]'),
    ).map((el) => {
      const link = el as HTMLLinkElement;
      return { hreflang: link.hreflang, href: link.href };
    });

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

/* ------------------------- expectations ------------------------- */

export function expectNotLocalhost(url: string | null) {
  expect(url, 'URL must exist').toBeTruthy();

  const baseOrigin = getBaseOrigin();
  if (isLocalOrigin(baseOrigin)) return; // local env: allow localhost urls

  expect(url!, 'URL must not be localhost').not.toMatch(/:\/\/localhost[:/]/i);
  expect(url!, 'URL must not be 127.0.0.1').not.toMatch(/:\/\/127\.0\.0\.1[:/]/i);
}

export function expectAbsolute(url: string | null) {
  expect(url, 'URL must exist').toBeTruthy();
  expect(url!, 'URL must be absolute').toMatch(/^https?:\/\//i);
}

export function expectMinDescription(desc: string | null, minLen = 20) {
  const d = (desc || '').trim();
  expect(d.length, `meta description length must be >= ${minLen}`).toBeGreaterThanOrEqual(minLen);
}

export function expectSameOriginAsBase(url: string | null) {
  expect(url, 'URL must exist').toBeTruthy();

  const baseOrigin = normalizeLocalhostOrigin(getBaseOrigin());
  const targetOrigin = normalizeLocalhostOrigin(new URL(url!).origin);

  expect(targetOrigin, 'URL must match base origin').toBe(baseOrigin);
}

export function expectOgMatchesCanonical(head: HeadSnapshot) {
  if (!head.ogUrl || !head.canonical) return;
  expect(head.ogUrl, 'og:url must equal canonical').toBe(head.canonical);
}

/**
 * ✅ Locale-aware hreflang set validation
 * - includes all locales from getPlaywrightLocales()
 * - includes x-default
 * - unique hreflang (strict)
 *
 * NOTE:
 * - href uniqueness is NOT enforced because it is valid that:
 *   - x-default points to the same URL as the default locale
 *   - some setups intentionally reuse the same URL for multiple hreflang values
 */
export function expectHreflangSet(hreflangs: Array<{ hreflang: string; href: string }>) {
  expect(Array.isArray(hreflangs), 'hreflang links must be an array').toBeTruthy();
  expect(hreflangs.length, 'hreflang links must exist').toBeGreaterThan(0);

  const langs = new Set<string>();
  const hrefs = new Set<string>();

  for (const x of hreflangs) {
    const hreflang = String(x?.hreflang || '').trim().toLowerCase();
    const href = String(x?.href || '').trim();

    expect(hreflang, 'hreflang must exist').toBeTruthy();
    expect(href, 'hreflang href must exist').toBeTruthy();

    expectAbsolute(href);
    expectSameOriginAsBase(href);
    expectNotLocalhost(href);

    // ✅ strict: hreflang must be unique
    expect(langs.has(hreflang), `duplicate hreflang: ${hreflang}`).toBeFalsy();

    langs.add(hreflang);

    // href duplicates are allowed; keep set only for optional debugging
    hrefs.add(href);
  }

  const expectedLocales = getPlaywrightLocales();
  for (const l of expectedLocales) {
    expect(langs.has(l), `hreflang must include locale: ${l}`).toBeTruthy();
  }

  expect(langs.has('x-default'), 'hreflang must include x-default').toBeTruthy();
}

