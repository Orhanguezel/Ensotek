// =============================================================
// FILE: src/i18n/activeLocales.ts  (DYNAMIC via META endpoint)
// =============================================================
'use client';

import { useMemo } from 'react';
import { useGetAppLocalesPublicQuery } from '@/integrations/rtk/hooks';
import { normLocaleTag } from '@/i18n/localeUtils';

/**
 * Public META: /site_settings/app-locales
 * - is_default olanı başa al
 * - is_active=false olanı çıkar
 */
export function useActiveLocales() {
  const { data, isLoading } = useGetAppLocalesPublicQuery();

  const locales = useMemo<string[]>(() => {
    const arr = Array.isArray(data) ? data : [];

    const active = arr
      .filter((x) => x && x.is_active !== false)
      .map((x) => normLocaleTag(x.code))
      .filter(Boolean) as string[];

    const uniq = Array.from(new Set(active));

    // is_default olanı başa çek
    const def = arr.find((x) => x?.is_default === true && x?.is_active !== false);
    const defCode = def ? normLocaleTag(def.code) : '';
    if (defCode) {
      const rest = uniq.filter((x) => x !== defCode);
      return [defCode, ...rest];
    }

    return uniq;
  }, [data]);

  return { locales, isLoading };
}
