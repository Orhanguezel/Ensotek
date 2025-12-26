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
    return !!(String(gtmId || '').trim() || String(ga4Id || '').trim());
  }, [gtmId, ga4Id]);

  const lastUrlRef = useRef<string>('');

  useEffect(() => {
    if (!hasAnyAnalytics) return;

    const send = (nextUrl: string) => {
      try {
        if (typeof window === 'undefined') return;
        if (!window.gtag) return;
        if (window.__analyticsConsentGranted !== true) return;

        const path = (nextUrl || '/').split(/[?#]/)[0] || '/';
        const abs = window.location.origin + path;

        if (lastUrlRef.current === abs) return;
        lastUrlRef.current = abs;

        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: abs,
          page_path: path,
          language: locale,
        });
      } catch {
        // ignore
      }
    };

    if (router.isReady) {
      send(router.asPath || router.pathname || '/');
    }

    const onRouteChangeComplete = (url: string) => send(url);

    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [router.isReady, router.asPath, router.pathname, router.events, hasAnyAnalytics, locale]);

  return null;
}
