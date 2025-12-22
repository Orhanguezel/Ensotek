// src/i18n/activeLocales.ts
'use client';

import { useMemo } from 'react';
import { FALLBACK_LOCALE } from '@/i18n/config';
import { useGetAppLocalesPublicQuery } from '@/integrations/rtk/hooks';
import { normLocaleTag } from '@/i18n/localeUtils';

export function useActiveLocales() {
  const { data, isLoading } = useGetAppLocalesPublicQuery();

  const locales = useMemo<string[]>(() => {
    const arr = Array.isArray(data) ? data : [];

    const active = arr
      .filter((x) => x && x.is_active !== false)
      .map((x) => normLocaleTag(x.code))
      .filter(Boolean) as string[];

    const uniq = Array.from(new Set(active));

    const def = arr.find((x) => x?.is_default === true && x?.is_active !== false);
    const defCode = def ? normLocaleTag(def.code) : '';

    const out = defCode ? [defCode, ...uniq.filter((x) => x !== defCode)] : uniq;

    return out.length ? out : [FALLBACK_LOCALE];
  }, [data]);

  return { locales, isLoading };
}
