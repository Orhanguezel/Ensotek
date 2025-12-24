// src/seo/HreflangLinks.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FALLBACK_LOCALE } from '@/i18n/config';
import { useResolvedLocale } from '@/i18n/locale';
import { normLocaleTag } from '@/i18n/localeUtils';

type AppLocaleMeta = {
  code?: unknown;
  label?: unknown;
  is_default?: unknown;
  is_active?: unknown;
};

/* -------------------- path helpers -------------------- */

function stripQueryHash(p: string): string {
  const s = String(p || '/');
  return s.split('#')[0].split('?')[0] || '/';
}

function normPath(p: string): string {
  let x = String(p || '/').trim();
  if (!x.startsWith('/')) x = `/${x}`;
  if (x !== '/' && x.endsWith('/')) x = x.slice(0, -1);
  return x || '/';
}

function readClientPathname(): string {
  if (typeof window === 'undefined') return '/';
  return window.location?.pathname || '/';
}

function readClientOrigin(): string {
  if (typeof window === 'undefined') return '';
  return window.location?.origin || '';
}

/** env fallback origin (SSR/client origin yoksa) */
function fallbackOriginFromEnv(): string {
  return String(process.env.NEXT_PUBLIC_SITE_URL || '')
    .trim()
    .replace(/\/+$/, '');
}

/** /{cur}/product -> /product ; /{cur} -> / */
function stripLocalePrefix(pathname: string, currentLocale: string): string {
  const raw = normPath(stripQueryHash(pathname));
  const cur = normLocaleTag(currentLocale) || '';

  if (!cur) return raw;

  if (raw === `/${cur}`) return '/';
  if (raw.startsWith(`/${cur}/`)) return normPath(raw.slice(cur.length + 1));
  return raw;
}

function buildLocalizedPath(basePath: string, targetLocale: string, defaultLocale: string): string {
  const p = normPath(basePath);
  const loc = normLocaleTag(targetLocale) || normLocaleTag(defaultLocale) || 'tr';
  const def = normLocaleTag(defaultLocale) || 'tr';

  // default locale prefixless
  if (loc === def) return p;

  if (p === '/') return `/${loc}`;
  return `/${loc}${p}`;
}

function absWithOrigin(origin: string, path: string): string {
  const o = String(origin || '')
    .trim()
    .replace(/\/+$/, '');
  const p = normPath(path);

  const base = o || fallbackOriginFromEnv();
  if (!base) return p; // worst-case relative
  return `${base}${p}`;
}

/* -------------------- API helpers (DB-driven) -------------------- */

function getApiBase(): string {
  const raw =
    (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim() ||
    (process.env.NEXT_PUBLIC_API_URL || '').trim() ||
    (process.env.API_BASE_URL || '').trim();
  return raw.replace(/\/+$/, '');
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { credentials: 'omit', cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function normalizeDefaultLocaleValue(v: any): string {
  if (v && typeof v === 'object' && 'data' in v) return normLocaleTag((v as any).data) || '';
  return normLocaleTag(v) || '';
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
    .map((x) => normLocaleTag((x as any).code))
    .filter(Boolean) as string[];

  const uniq = Array.from(new Set(active));

  const def = arr.find((x) => (x as any)?.is_default === true && (x as any)?.is_active !== false);
  const defCode = def ? normLocaleTag((def as any).code) : '';

  const out = defCode ? [defCode, ...uniq.filter((x) => x !== defCode)] : uniq;

  const fb = normLocaleTag(FALLBACK_LOCALE) || 'tr';
  return out.length ? out : [fb];
}

/* -------------------- in-memory cache -------------------- */

let __cache: null | {
  at: number;
  defaultLocale: string;
  activeLocales: string[];
} = null;

const CACHE_TTL_MS = 60_000;

/* -------------------- Component -------------------- */

export function HreflangLinks() {
  const [pathname, setPathname] = useState<string>(() => readClientPathname());
  const [origin, setOrigin] = useState<string>(() => readClientOrigin());

  const [activeLocales, setActiveLocales] = useState<string[] | null>(
    () => __cache?.activeLocales ?? null,
  );
  const [defaultLocale, setDefaultLocale] = useState<string | null>(
    () => __cache?.defaultLocale ?? null,
  );

  const didFetchRef = useRef(false);

  // SPA navigation tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tick = () => {
      setPathname(readClientPathname());
      setOrigin(readClientOrigin());
    };

    tick();
    window.addEventListener('popstate', tick);

    const origPush = history.pushState;
    const origReplace = history.replaceState;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (history as any).pushState = function (...args: any[]) {
      const ret = origPush.apply(this, args as any);
      tick();
      return ret;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (history as any).replaceState = function (...args: any[]) {
      const ret = origReplace.apply(this, args as any);
      tick();
      return ret;
    };

    return () => {
      window.removeEventListener('popstate', tick);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  // DB-driven locales fetch (client)
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    if (__cache && Date.now() - __cache.at < CACHE_TTL_MS) {
      setActiveLocales(__cache.activeLocales);
      setDefaultLocale(__cache.defaultLocale);
      return;
    }

    const base = getApiBase();
    if (!base) {
      const fb = normLocaleTag(FALLBACK_LOCALE) || 'tr';
      __cache = { at: Date.now(), defaultLocale: fb, activeLocales: [fb] };
      setActiveLocales([fb]);
      setDefaultLocale(fb);
      return;
    }

    (async () => {
      const [appLocalesRaw, defaultLocaleRaw] = await Promise.all([
        fetchJson<any>(`${base}/site_settings/app-locales`),
        fetchJson<any>(`${base}/site_settings/default-locale`),
      ]);

      const meta = normalizeAppLocalesValue(appLocalesRaw);
      const actives = computeActiveLocales(meta.length ? meta : null);

      const defFromEndpoint = normalizeDefaultLocaleValue(defaultLocaleRaw);
      const def = defFromEndpoint || actives[0] || normLocaleTag(FALLBACK_LOCALE) || 'tr';

      __cache = { at: Date.now(), defaultLocale: def, activeLocales: actives };

      setActiveLocales(actives);
      setDefaultLocale(def);
    })();
  }, []);

  const resolved = useResolvedLocale();
  const currentLocale = useMemo(
    () => normLocaleTag(resolved) || normLocaleTag(FALLBACK_LOCALE) || 'tr',
    [resolved],
  );

  const basePath = useMemo(
    () => stripLocalePrefix(pathname || '/', currentLocale),
    [pathname, currentLocale],
  );

  const links = useMemo(() => {
    const act = (
      activeLocales && activeLocales.length
        ? activeLocales
        : [normLocaleTag(FALLBACK_LOCALE) || 'tr']
    )
      .map((x) => normLocaleTag(x))
      .filter(Boolean) as string[];

    const def = normLocaleTag(defaultLocale) || act[0] || normLocaleTag(FALLBACK_LOCALE) || 'tr';

    const out: Array<{ hreflang: string; href: string }> = [];

    for (const l of act) {
      const path = buildLocalizedPath(basePath, l, def);
      out.push({ hreflang: l, href: absWithOrigin(origin, path) });
    }

    out.push({
      hreflang: 'x-default',
      href: absWithOrigin(origin, buildLocalizedPath(basePath, def, def)),
    });

    // uniq
    const seen = new Set<string>();
    return out.filter((x) => {
      const k = `${x.hreflang}|${x.href}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [activeLocales, defaultLocale, basePath, origin]);

  return (
    <>
      {links.map((x) => (
        <link
          key={`alt:${x.hreflang}:${x.href}`}
          rel="alternate"
          hrefLang={x.hreflang}
          href={x.href}
        />
      ))}
    </>
  );
}
