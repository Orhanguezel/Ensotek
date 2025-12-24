// src/pages/_document.tsx
import Document, { Html, Head, Main, NextScript, type DocumentContext } from 'next/document';
import { FALLBACK_LOCALE } from '@/i18n/config';

/* -------------------- URL helpers -------------------- */

function stripTrailingSlash(u: string) {
  return String(u || '')
    .trim()
    .replace(/\/+$/, '');
}

function normalizeLocalhostOrigin(origin: string): string {
  const o = stripTrailingSlash(origin);
  if (/^https?:\/\/localhost:\d+$/i.test(o)) return o.replace(/:\d+$/i, '');
  if (/^https?:\/\/127\.0\.0\.1:\d+$/i.test(o)) return o.replace(/:\d+$/i, '');
  return o;
}

function firstHeader(v: unknown): string {
  return String(v || '')
    .split(',')[0]
    .trim();
}

function getReqOrigin(ctx: DocumentContext): string {
  const req = ctx.req;
  const xfProto = firstHeader(req?.headers?.['x-forwarded-proto']);
  const xfHost = firstHeader(req?.headers?.['x-forwarded-host']);
  const host = xfHost || firstHeader(req?.headers?.host);

  const protoRaw = xfProto || 'http';
  const proto =
    host?.toLowerCase().startsWith('localhost') || host?.toLowerCase().startsWith('127.0.0.1')
      ? 'http'
      : protoRaw;

  const origin = host ? `${proto}://${host}` : 'http://localhost';
  return normalizeLocalhostOrigin(origin);
}

function splitUrl(u: string): { pathname: string; search: string } {
  const raw = String(u || '/');
  const [noHash] = raw.split('#');
  const idx = noHash.indexOf('?');
  if (idx >= 0) return { pathname: noHash.slice(0, idx) || '/', search: noHash.slice(idx) || '' };
  return { pathname: noHash || '/', search: '' };
}

function normPathname(p?: string): string {
  let x = String(p || '/').trim();
  if (!x.startsWith('/')) x = `/${x}`;
  if (x !== '/' && x.endsWith('/')) x = x.slice(0, -1);
  return x || '/';
}

/**
 * URL prefix’te sadece short (2 harf) kullanıyoruz.
 * DB’de full tag gelse bile burada short’a indiriyoruz: "de-DE" -> "de".
 */
function normLocaleShort(x: any, fallback: string): string {
  const v = String(x || '')
    .trim()
    .toLowerCase()
    .replace('_', '-');
  const short = (v.split('-')[0] || '').trim();
  const out =
    short ||
    String(fallback || '')
      .trim()
      .toLowerCase();
  return (out || '').slice(0, 2);
}

function readLcFromSearch(search: string): string {
  const s = String(search || '');
  if (!s || s === '?') return '';
  try {
    const usp = new URLSearchParams(s.startsWith('?') ? s.slice(1) : s);
    return normLocaleShort(usp.get('__lc'), '');
  } catch {
    return '';
  }
}

function readLocaleFromPathPrefix(pathname: string): string {
  const p = normPathname(pathname);
  const m = p.match(/^\/([a-zA-Z]{2})(\/|$)/);
  return normLocaleShort(m?.[1], '');
}

/**
 * ✅ Strict strip:
 * - activeSet verildiyse sadece o set içindeki locale’leri strip eder
 * - aksi halde strip ETME (yanlışlıkla "/depot" gibi path’leri bozmasın)
 */
function stripLocalePrefixStrict(pathname: string, activeSet: Set<string>): string {
  const p = normPathname(pathname);
  const m = p.match(/^\/([a-zA-Z]{2})(\/|$)/);
  if (!m) return p;

  const cand = normLocaleShort(m?.[1], '');
  if (!cand) return p;

  // strict: aktif değilse dokunma
  if (activeSet.size > 0 && !activeSet.has(cand)) return p;

  const rest = p.slice(cand.length + 1); // "/{xx}" length + "/"
  return normPathname(rest || '/');
}

function ensureLocalePrefix(pathname: string, localeShort: string): string {
  const loc = normLocaleShort(localeShort, '');
  const p = normPathname(pathname);
  if (!loc) return p;
  if (p === '/') return `/${loc}`;
  if (p === `/${loc}`) return p;
  if (p.startsWith(`/${loc}/`)) return p;
  return `/${loc}${p}`;
}

/* -------------------- DB-driven locale fetch (server) -------------------- */

type AppLocaleMeta = {
  code?: unknown;
  label?: unknown;
  is_default?: unknown;
  is_active?: unknown;
};

function getApiBaseServer(): string {
  const raw =
    (process.env.API_BASE_URL || '').trim() ||
    (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim() ||
    (process.env.NEXT_PUBLIC_API_URL || '').trim();

  const base = stripTrailingSlash(raw);

  // ✅ FE logların /api/... gidiyor. Document de aynı olmalı.
  if (base && !/\/api$/i.test(base)) return `${base}/api`;
  return base;
}

async function fetchJsonWithTimeout<T>(url: string, timeoutMs: number): Promise<T | null> {
  if (!url) return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      signal: ctrl.signal,
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function normalizeDefaultLocaleValue(v: any): string {
  if (v && typeof v === 'object' && 'data' in v) return normLocaleShort((v as any).data, '');
  return normLocaleShort(v, '');
}

function normalizeAppLocalesValue(v: any): AppLocaleMeta[] {
  if (Array.isArray(v)) return v as AppLocaleMeta[];
  if (v && typeof v === 'object' && 'data' in v && Array.isArray((v as any).data)) {
    return (v as any).data as AppLocaleMeta[];
  }
  return [];
}

function computeActiveLocales(meta: AppLocaleMeta[] | null | undefined): string[] {
  const arr = Array.isArray(meta) ? meta : [];

  const active = arr
    .filter((x) => x && (x as any).is_active !== false)
    .map((x) => normLocaleShort((x as any).code, ''))
    .filter(Boolean) as string[];

  const uniq = Array.from(new Set(active));

  const def = arr.find((x) => (x as any)?.is_default === true && (x as any)?.is_active !== false);
  const defCode = def ? normLocaleShort((def as any).code, '') : '';

  const out = defCode ? [defCode, ...uniq.filter((x) => x !== defCode)] : uniq;

  const fb = normLocaleShort(FALLBACK_LOCALE, 'tr') || 'tr';
  return out.length ? out : [fb];
}

let __docLocaleCache: null | {
  at: number;
  defaultLocale: string;
  activeLocales: string[];
} = null;

const DOC_CACHE_TTL_MS = 60_000;
const DOC_FETCH_TIMEOUT_MS = 1200;

async function resolveLocalesFromDb(): Promise<{ defaultLocale: string; activeLocales: string[] }> {
  if (__docLocaleCache && Date.now() - __docLocaleCache.at < DOC_CACHE_TTL_MS) {
    return {
      defaultLocale: __docLocaleCache.defaultLocale,
      activeLocales: __docLocaleCache.activeLocales,
    };
  }

  const base = getApiBaseServer();
  if (!base) {
    const fb = normLocaleShort(FALLBACK_LOCALE, 'tr') || 'tr';
    const out = { defaultLocale: fb, activeLocales: [fb] };
    __docLocaleCache = { at: Date.now(), ...out };
    return out;
  }

  const [appLocalesRaw, defaultLocaleRaw] = await Promise.all([
    fetchJsonWithTimeout<any>(`${base}/site_settings/app-locales`, DOC_FETCH_TIMEOUT_MS),
    fetchJsonWithTimeout<any>(`${base}/site_settings/default-locale`, DOC_FETCH_TIMEOUT_MS),
  ]);

  const appArr = normalizeAppLocalesValue(appLocalesRaw);
  const activeLocales = computeActiveLocales(appArr.length ? appArr : null);

  const fromDefaultEndpoint = normalizeDefaultLocaleValue(defaultLocaleRaw);
  const defaultLocale =
    fromDefaultEndpoint || activeLocales[0] || normLocaleShort(FALLBACK_LOCALE, 'tr') || 'tr';

  const out = { defaultLocale, activeLocales };
  __docLocaleCache = { at: Date.now(), ...out };
  return out;
}

/* -------------------- Document -------------------- */

export default class MyDocument extends Document<{
  canonicalAbs?: string;
  htmlLang?: string;

  // debug (istersen kaldır)
  debugLocale?: string;
  debugReqUrl?: string;
  debugDefaultLocale?: string;
  debugActiveLocales?: string;
}> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    const origin = getReqOrigin(ctx);

    const reqUrl = String(ctx.req?.url || '/');
    const { pathname: rawPathname, search } = splitUrl(reqUrl);
    const pathname = normPathname(rawPathname);

    // DB locales (server)
    const { defaultLocale: dbDefault, activeLocales: dbActives } = await resolveLocalesFromDb();
    const dbDefaultShort = normLocaleShort(
      dbDefault,
      normLocaleShort(FALLBACK_LOCALE, 'tr') || 'tr',
    );
    const activeSet = new Set((dbActives || []).map((x) => normLocaleShort(x, '')).filter(Boolean));

    // ✅ Locale detection
    const lcFromQuery = readLcFromSearch(search);
    const lcFromCtx = normLocaleShort((ctx as any).locale, '');
    const lcFromPath = readLocaleFromPathPrefix(pathname);

    // ✅ Base path: sadece aktif locale ise strip et
    const basePath = stripLocalePrefixStrict(pathname, activeSet);

    const DEFAULT_LOCALE_PREFIXLESS = true;

    const effectiveLocale = normLocaleShort(
      lcFromQuery || lcFromCtx || lcFromPath || dbDefaultShort || FALLBACK_LOCALE,
      normLocaleShort(FALLBACK_LOCALE, 'tr') || 'tr',
    );

    // ✅ Safe locale: aktif değilse DB default’a düş
    const safeLocale =
      activeSet.size > 0 && activeSet.has(effectiveLocale) ? effectiveLocale : dbDefaultShort;

    // ✅ Canonical path
    const canonicalPath =
      DEFAULT_LOCALE_PREFIXLESS && safeLocale === dbDefaultShort
        ? basePath
        : ensureLocalePrefix(basePath, safeLocale);

    const canonicalAbs = `${origin}${
      canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`
    }`;

    return {
      ...initialProps,
      canonicalAbs: normalizeLocalhostOrigin(canonicalAbs),
      htmlLang: safeLocale || dbDefaultShort || FALLBACK_LOCALE,

      // debug (istersen sonra kaldır)
      debugLocale: safeLocale,
      debugReqUrl: reqUrl,
      debugDefaultLocale: dbDefaultShort,
      debugActiveLocales: Array.from(activeSet).join(','),
    };
  }

  render() {
    const { canonicalAbs, htmlLang } = this.props as any;

    return (
      <Html lang={htmlLang || FALLBACK_LOCALE}>
        <Head>
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

          {canonicalAbs ? <link rel="canonical" href={canonicalAbs} /> : null}
          {canonicalAbs ? <meta property="og:url" content={canonicalAbs} /> : null}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
