// =============================================================
// FILE: src/features/analytics/useAnalyticsSettings.ts
// Ensotek – Analytics settings from DB (locale + fallback)
// =============================================================
'use client';

import { useMemo } from 'react';
import { useResolvedLocale } from '@/i18n/locale';
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const toLocaleShort = (l: any) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

function coerceId(v: any): string {
  return String(v ?? '').trim();
}

export function useAnalyticsSettings() {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  // Tek query: backend fallback chain (requested -> default -> app_locales -> '*') ile döndürür.
  const { data: ga } = useGetSiteSettingByKeyQuery({
    key: 'ga4_measurement_id',
    locale,
  });

  const { data: gtm } = useGetSiteSettingByKeyQuery({
    key: 'gtm_container_id',
    locale,
  });

  const ga4Id = useMemo(() => {
    const db = coerceId(ga?.value);
    const env = coerceId(process.env.NEXT_PUBLIC_GA_ID);
    return db || env;
  }, [ga?.value]);

  const gtmId = useMemo(() => {
    const db = coerceId(gtm?.value);
    const env = coerceId(process.env.NEXT_PUBLIC_GTM_ID);
    return db || env;
  }, [gtm?.value]);

  return { locale, ga4Id, gtmId };
}
