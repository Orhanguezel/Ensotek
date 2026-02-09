// =============================================================
// FILE: src/i18n/locale.ts  (DYNAMIC via META endpoints) - PROVIDER SAFE
// =============================================================
'use client';

import { useEffect, useMemo, useState } from 'react';
import { FALLBACK_LOCALE } from '@/i18n/config';
import { normLocaleTag } from '@/i18n/localeUtils';
import { ensureLocationEventsPatched } from '@/i18n/locationEvents';
import {
  useGetAppLocalesPublicQuery,
  useGetDefaultLocalePublicQuery,
} from '@/integrations/rtk/hooks';

function readLocaleFromCookie(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  return m ? normLocaleTag(decodeURIComponent(m[1])) : '';
}

function readLocaleFromQuery(): string {
  if (typeof window === 'undefined') return '';
  try {
    const usp = new URLSearchParams(window.location.search || '');
    return normLocaleTag(usp.get('__lc'));
  } catch {
    return '';
  }
}

function computeActiveLocales(meta: any[] | undefined): string[] {
  const arr = Array.isArray(meta) ? meta : [];

  const active = arr
    .filter((x) => x && (x as any).is_active !== false)
    .map((x) => normLocaleTag((x as any).code))
    .filter(Boolean) as string[];

  const uniq = Array.from(new Set(active));

  const def = arr.find((x) => (x as any)?.is_default === true && (x as any)?.is_active !== false);
  const defCode = def ? normLocaleTag((def as any).code) : '';
  const out = defCode ? [defCode, ...uniq.filter((x) => x !== defCode)] : uniq;

  return out.length ? out : [normLocaleTag(FALLBACK_LOCALE) || 'de'];
}

export function useResolvedLocale(explicitLocale?: string | null): string {
  // pathname sadece SPA değişimini tetiklemek için tutuluyor
  const [pathname, setPathname] = useState<string>('/');

  const { data: appLocalesMeta } = useGetAppLocalesPublicQuery();
  const { data: defaultLocaleMeta } = useGetDefaultLocalePublicQuery();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    ensureLocationEventsPatched();

    const read = () => setPathname(window.location.pathname || '/');

    read();

    window.addEventListener('locationchange', read);
    window.addEventListener('popstate', read);
    window.addEventListener('hashchange', read);

    return () => {
      window.removeEventListener('locationchange', read);
      window.removeEventListener('popstate', read);
      window.removeEventListener('hashchange', read);
    };
  }, []);

  return useMemo(() => {
    const activeLocales = computeActiveLocales((appLocalesMeta || []) as any);
    const activeSet = new Set(activeLocales.map(normLocaleTag));

    // ✅ 1) __lc query: rewrite’ın tek kaynağı
    const fromQuery = readLocaleFromQuery();
    if (fromQuery && activeSet.has(fromQuery)) return fromQuery;

    // ✅ 2) cookie
    const fromCookie = readLocaleFromCookie();
    if (fromCookie && activeSet.has(fromCookie)) return fromCookie;

    // ✅ 3) explicit
    const fromExplicit = normLocaleTag(explicitLocale);
    if (fromExplicit && activeSet.has(fromExplicit)) return fromExplicit;

    // ✅ 4) DB default
    const candDefault = normLocaleTag(defaultLocaleMeta);
    if (candDefault && activeSet.has(candDefault)) return candDefault;

    // ✅ 5) first active
    const firstActive = normLocaleTag(activeLocales[0]);
    if (firstActive) return firstActive;

    // ✅ 6) fallback
    return normLocaleTag(FALLBACK_LOCALE) || 'de';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, explicitLocale, appLocalesMeta, defaultLocaleMeta]);
}
