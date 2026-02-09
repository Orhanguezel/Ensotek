// =============================================================
// FILE: src/i18n/activeLocales.ts
// (DYNAMIC LOCALES) - FIXED (/api tolerant + stable normalization)
// =============================================================

'use client';

import { useMemo } from 'react';
import { FALLBACK_LOCALE } from '@/i18n/config';
import { normLocaleTag } from '@/i18n/localeUtils';
import { useGetAppLocalesPublicQuery } from '@/integrations/rtk/hooks';

type AppLocaleMeta = {
  code?: unknown;
  label?: unknown;
  is_default?: unknown;
  is_active?: unknown;
};

function computeLocales(meta: AppLocaleMeta[] | null | undefined): string[] {
  const arr = Array.isArray(meta) ? meta : [];

  const active = arr
    .filter((x) => x && (x as any).is_active !== false)
    .map((x) => normLocaleTag((x as any).code))
    .filter(Boolean) as string[];

  const uniq = Array.from(new Set(active));

  const def = arr.find((x) => (x as any)?.is_default === true && (x as any)?.is_active !== false);
  const defCode = def ? normLocaleTag((def as any).code) : '';

  const out = defCode ? [defCode, ...uniq.filter((x) => x !== defCode)] : uniq;

  const fb = normLocaleTag(FALLBACK_LOCALE) || 'de';
  return out.length ? out : [fb];
}

export function useActiveLocales() {
  const { data, isLoading } = useGetAppLocalesPublicQuery();
  const locales = useMemo<string[]>(() => computeLocales(data as AppLocaleMeta[]), [data]);
  return { locales, isLoading };
}
