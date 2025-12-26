// src/features/analytics/GAScripts.tsx
'use client';

import Script from 'next/script';
import { useMemo } from 'react';

import { useResolvedLocale } from '@/i18n/locale';
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    __setGaConsent?: (c: { analytics_storage: 'granted' | 'denied' }) => void;
    __gaConsentGranted?: boolean;
  }
}

const toLocaleShort = (l: any) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

function coerceGaId(v: any): string {
  const s = String(v ?? '').trim();
  // GA4 Measurement ID genelde G-... formatında
  if (!s) return '';
  return s;
}

export default function GAScripts() {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  // ✅ DB’den GA ID oku (primary: locale’li)
  const { data: gaSettingPrimary } = useGetSiteSettingByKeyQuery({
    key: 'ga4_measurement_id',
    locale,
  });

  // ✅ fallback: locale’siz (backend destekliyorsa)
  const { data: gaSettingFallback } = useGetSiteSettingByKeyQuery({
    key: 'ga4_measurement_id',
    // locale: undefined  -> hooks typing izin vermezse kaldır; backend “default locale” döndürecek şekilde de olabilir.
  } as any);

  const gaIdFromDb = useMemo(() => {
    const v = gaSettingPrimary?.value ?? gaSettingFallback?.value ?? '';
    return coerceGaId(v);
  }, [gaSettingPrimary?.value, gaSettingFallback?.value]);

  // ✅ ENV fallback (opsiyonel)
  const gaIdFromEnv = useMemo(() => coerceGaId(process.env.NEXT_PUBLIC_GA_ID), []);

  const GA_ID = gaIdFromDb || gaIdFromEnv;

  const isProd = process.env.NODE_ENV === 'production';
  if (!GA_ID || !isProd) return null;

  return (
    <>
      {/* Consent Mode / dataLayer init */}
      <Script id="ga-consent" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          // default: denied (privacy by default)
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });

          // external hook: cookie banner bunu çağıracak
          window.__setGaConsent = function(next){
            try {
              var v = next && next.analytics_storage === 'granted' ? 'granted' : 'denied';
              window.__gaConsentGranted = (v === 'granted');
              gtag('consent', 'update', { analytics_storage: v });
            } catch (e) {}
          };
        `}
      </Script>

      {/* GA library */}
      <Script
        id="ga-src"
        src={'https://www.googletagmanager.com/gtag/js?id=' + GA_ID}
        strategy="afterInteractive"
      />

      {/* GA base config */}
      <Script id="ga-base" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
