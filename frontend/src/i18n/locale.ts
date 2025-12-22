// =============================================================
// FILE: src/i18n/locale.ts  (DYNAMIC via META endpoints)
// =============================================================
'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { normLocaleTag } from '@/i18n/localeUtils';
import {
  useGetAppLocalesPublicQuery,
  useGetDefaultLocalePublicQuery,
} from '@/integrations/rtk/hooks';

function readLocaleFromPath(asPath?: string): string {
  const p = String(asPath || '/').trim();
  const seg = p.replace(/^\/+/, '').split('/')[0] || '';
  return normLocaleTag(seg);
}

function readLocaleFromCookie(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  return m ? normLocaleTag(decodeURIComponent(m[1])) : '';
}

function computeActiveLocales(meta: any[] | undefined): string[] {
  const arr = Array.isArray(meta) ? meta : [];

  const active = arr
    .filter((x) => x && x.is_active !== false)
    .map((x) => normLocaleTag(x.code))
    .filter(Boolean) as string[];

  const uniq = Array.from(new Set(active));

  const def = arr.find((x) => x?.is_default === true && x?.is_active !== false);
  const defCode = def ? normLocaleTag(def.code) : '';
  if (defCode) {
    const rest = uniq.filter((x) => x !== defCode);
    return [defCode, ...rest];
  }

  return uniq;
}

/**
 * ✅ Runtime locale resolver (client):
 * Priority:
 *  1) URL prefix (must be ACTIVE)
 *  2) cookie NEXT_LOCALE (must be ACTIVE)
 *  3) explicit param (must be ACTIVE)
 *  4) default-locale META (must be ACTIVE)
 *  5) app-locales META is_default / first active
 *  6) last resort: URL/cookie/explicit varsa onu döndür, yoksa "tr"
 */
export function useResolvedLocale(explicitLocale?: string | null): string {
  const router = useRouter();

  const { data: appLocalesMeta } = useGetAppLocalesPublicQuery();
  const { data: defaultLocaleMeta } = useGetDefaultLocalePublicQuery();

  return useMemo(() => {
    const activeLocales = computeActiveLocales(appLocalesMeta as any);
    const activeSet = new Set(activeLocales.map(normLocaleTag));

    // 1) URL prefix
    const fromPath = readLocaleFromPath(router.asPath);
    if (fromPath && activeSet.has(fromPath)) return fromPath;

    // 2) Cookie
    const fromCookie = readLocaleFromCookie();
    if (fromCookie && activeSet.has(fromCookie)) return fromCookie;

    // 3) Explicit
    const fromExplicit = normLocaleTag(explicitLocale);
    if (fromExplicit && activeSet.has(fromExplicit)) return fromExplicit;

    // 4) default-locale META
    const candDefault = normLocaleTag(defaultLocaleMeta);
    if (candDefault && activeSet.has(candDefault)) return candDefault;

    // 5) app-locales first (is_default başa çekilmiş olabilir)
    const firstActive = normLocaleTag(activeLocales[0]);
    if (firstActive) return firstActive;

    // 6) DB/API down ya da boşsa: elde olanı döndür
    if (fromPath) return fromPath;
    if (fromCookie) return fromCookie;
    if (fromExplicit) return fromExplicit;

    return 'tr';
  }, [router.asPath, explicitLocale, appLocalesMeta, defaultLocaleMeta]);
}
