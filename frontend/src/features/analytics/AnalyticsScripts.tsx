// =============================================================
// FILE: src/features/analytics/AnalyticsScripts.tsx
// Ensotek – GTM preferred, fallback to GA4 gtag.js (consent-mode)
// =============================================================
'use client';

import Script from 'next/script';
import { useEffect, useMemo } from 'react';
import { useAnalyticsSettings } from './useAnalyticsSettings';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;

    __setAnalyticsConsent?: (c: { analytics_storage: 'granted' | 'denied' }) => void;
    __analyticsConsentGranted?: boolean;
  }
}

function isProdEnv() {
  return process.env.NODE_ENV === 'production';
}

export default function AnalyticsScripts() {
  const { gtmId, ga4Id } = useAnalyticsSettings();

  const isProd = isProdEnv();
  const hasGtm = useMemo(() => !!(gtmId && String(gtmId).startsWith('GTM-')), [gtmId]);
  const hasGa = useMemo(() => !!(ga4Id && String(ga4Id).startsWith('G-')), [ga4Id]);

  // noscript fallback (client-side append). Bu, “_document.tsx yoksa” pratik çözüm.
  useEffect(() => {
    if (!isProd || !hasGtm || typeof document === 'undefined') return;

    const existing = document.getElementById('gtm-noscript');
    if (existing) return;

    const ns = document.createElement('noscript');
    ns.id = 'gtm-noscript';

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(String(gtmId))}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';

    ns.appendChild(iframe);

    // body'nin en başına yakın ekle
    document.body.insertBefore(ns, document.body.firstChild);
  }, [isProd, hasGtm, gtmId]);

  if (!isProd) return null;

  // Hiçbiri yoksa: hiçbir şey basma
  if (!hasGtm && !hasGa) return null;

  return (
    <>
      {/* 1) Consent Mode init (default denied) + external setter */}
      <Script id="analytics-consent-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ window.dataLayer.push(arguments); }
          window.gtag = window.gtag || gtag;

          // privacy by default
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });

          window.__analyticsConsentGranted = false;

          // cookie banner bunu çağıracak
          window.__setAnalyticsConsent = function(next){
            try {
              var v = next && next.analytics_storage === 'granted' ? 'granted' : 'denied';
              window.__analyticsConsentGranted = (v === 'granted');
              gtag('consent', 'update', { analytics_storage: v });
            } catch (e) {}
          };
        `}
      </Script>

      {/* 2A) GTM varsa: sadece GTM bas (GA4 tag GTM içinden yönetilecek) */}
      {hasGtm ? (
        <Script id="gtm-src" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${String(gtmId)}');
          `}
        </Script>
      ) : (
        <>
          {/* 2B) GTM yoksa: gtag.js + GA4 config */}
          <Script
            id="ga-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(String(ga4Id))}`}
            strategy="afterInteractive"
          />
          <Script id="ga-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){ window.dataLayer.push(arguments); }
              window.gtag = window.gtag || gtag;

              gtag('js', new Date());
              gtag('config', '${String(ga4Id)}', {
                anonymize_ip: true,
                send_page_view: false
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
