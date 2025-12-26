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
  const s = String(v ?? '').trim();
  return s;
}

export function useAnalyticsSettings() {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  // GA4
  const { data: gaPrimary } = useGetSiteSettingByKeyQuery({
    key: 'ga4_measurement_id',
    locale,
  });

  const { data: gaFallback } = useGetSiteSettingByKeyQuery({
    key: 'ga4_measurement_id',
  } as any);

  // GTM
  const { data: gtmPrimary } = useGetSiteSettingByKeyQuery({
    key: 'gtm_container_id',
    locale,
  });

  const { data: gtmFallback } = useGetSiteSettingByKeyQuery({
    key: 'gtm_container_id',
  } as any);

  const ga4Id = useMemo(() => {
    const db = coerceId(gaPrimary?.value ?? gaFallback?.value);
    const env = coerceId(process.env.NEXT_PUBLIC_GA_ID);
    return db || env;
  }, [gaPrimary?.value, gaFallback?.value]);

  const gtmId = useMemo(() => {
    const db = coerceId(gtmPrimary?.value ?? gtmFallback?.value);
    const env = coerceId(process.env.NEXT_PUBLIC_GTM_ID);
    return db || env;
  }, [gtmPrimary?.value, gtmFallback?.value]);

  return { locale, ga4Id, gtmId };
}
