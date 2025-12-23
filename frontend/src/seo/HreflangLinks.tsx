// src/seo/HreflangLinks.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useResolvedLocale } from '@/i18n/locale';
import { normLocaleTag } from '@/i18n/localeUtils';

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

/** /tr/product -> /product ; /tr -> / */
function stripLocalePrefix(pathname: string, currentLocale: string): string {
  const raw = normPath(stripQueryHash(pathname));
  const cur = normLocaleTag(currentLocale) || 'tr';

  if (raw === `/${cur}`) return '/';
  if (raw.startsWith(`/${cur}/`)) return normPath(raw.slice(cur.length + 1));
  return raw;
}

function buildLocalizedPath(basePath: string, targetLocale: string, defaultLocale: string): string {
  const p = normPath(basePath);
  const loc = normLocaleTag(targetLocale) || normLocaleTag(defaultLocale) || 'tr';
  const def = normLocaleTag(defaultLocale) || 'tr';

  if (loc === def) return p;
  if (p === '/') return `/${loc}`;
  return `/${loc}${p}`;
}

function absWithOrigin(origin: string, path: string): string {
  const o = String(origin || '')
    .trim()
    .replace(/\/+$/, '');
  const p = normPath(path);
  if (!o) return p; // origin yoksa relative bas (yine de link.href absolute olur)
  return `${o}${p}`;
}

/**
 * ✅ Redux/RTK Query yok (SSR’de context aramaz).
 * ✅ Head içinde hızlı basar.
 */
export function HreflangLinks() {
  const [pathname, setPathname] = useState<string>(() => readClientPathname());
  const [origin, setOrigin] = useState<string>(() => readClientOrigin());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tick = () => {
      setPathname(readClientPathname());
      setOrigin(readClientOrigin());
    };

    tick();

    window.addEventListener('popstate', tick);

    // pushState/replaceState yakala (SPA)
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

  const resolved = useResolvedLocale();
  const currentLocale = useMemo(() => normLocaleTag(resolved) || 'tr', [resolved]);

  /**
   * Burada DB’den locale çekme yok.
   * Test/SEO için deterministik olsun diye sabit:
   * - defaultLocale: tr
   * - aktifler: tr,en
   *
   * İstersen bunu ileride env ile genişletebilirsin:
   * NEXT_PUBLIC_ACTIVE_LOCALES="tr,en,de"
   */
  const defaultLocale = 'tr';
  const activeLocales = useMemo(() => {
    const fromEnv = (process.env.NEXT_PUBLIC_ACTIVE_LOCALES ?? '').trim();
    const list = fromEnv
      ? fromEnv
          .split(',')
          .map((x) => normLocaleTag(x))
          .filter(Boolean)
      : (['tr', 'en'] as string[]);
    // uniq + default başa
    const def = normLocaleTag(defaultLocale) || 'tr';
    const uniq = Array.from(new Set(list));
    return def ? [def, ...uniq.filter((x) => x !== def)] : uniq;
  }, []);

  const basePath = useMemo(
    () => stripLocalePrefix(pathname || '/', currentLocale),
    [pathname, currentLocale],
  );

  const links = useMemo(() => {
    const def = normLocaleTag(defaultLocale) || 'tr';

    const out: Array<{ hreflang: string; href: string }> = [];

    for (const l of activeLocales) {
      const path = buildLocalizedPath(basePath, l, def);
      out.push({ hreflang: l, href: absWithOrigin(origin, path) });
    }

    // x-default
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
  }, [activeLocales, basePath, defaultLocale, origin]);

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
