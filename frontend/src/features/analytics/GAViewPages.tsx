// =============================================================
// FILE: src/features/analytics/GAViewPages.tsx
// Ensotek – Page view tracking (Pages Router) respecting consent
// =============================================================
'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAnalyticsSettings } from './useAnalyticsSettings';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    __analyticsConsentGranted?: boolean;
  }
}

export default function GAViewPages() {
  const router = useRouter();
  const { locale, ga4Id, gtmId } = useAnalyticsSettings();

  const hasAnyAnalytics = useMemo(() => {
    // GTM varsa da page_view event’i dataLayer/gtag ile push edebiliriz
    // (GTM tarafında GA4 event tag "page_view" dinleyebilir)
    return !!(gtmId || ga4Id);
  }, [gtmId, ga4Id]);

  const lastUrlRef = useRef<string>('');

  useEffect(() => {
    if (!hasAnyAnalytics) return;

    const send = (url: string) => {
      try {
        if (typeof window === 'undefined') return;
        if (!window.gtag) return;
        if (window.__analyticsConsentGranted !== true) return;

        const abs = window.location.origin + (url.startsWith('/') ? url : `/${url}`);

        // spam guard
        if (lastUrlRef.current === abs) return;
        lastUrlRef.current = abs;

        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: abs,
          page_path: url.split(/[?#]/)[0] || '/',
          language: locale,
        });
      } catch {
        // ignore
      }
    };

    // first paint (route hazır olunca)
    if (router.isReady) {
      send(router.asPath || router.pathname || '/');
    }

    const onRouteChangeComplete = (nextUrl: string) => send(nextUrl);

    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [router.isReady, router.asPath, router.pathname, router.events, hasAnyAnalytics, locale]);

  return null;
}
