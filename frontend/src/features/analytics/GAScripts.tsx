// src/features/analytics/GAScripts.tsx
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    __setGaConsent?: (c: { analytics_storage: 'granted' | 'denied' }) => void;
    __gaConsentGranted?: boolean;
  }
}

export default function GAScripts() {
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

          // external hook: cookie banner burayı çağıracak
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
