// src/features/analytics/GAView.tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { useResolvedLocale } from '@/i18n/locale';
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
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
  if (!s) return '';
  return s;
}

export default function GAView() {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ DB’den GA ID oku (primary: locale’li)
  const { data: gaSettingPrimary } = useGetSiteSettingByKeyQuery({
    key: 'ga4_measurement_id',
    locale,
  });

  // ✅ fallback
  const { data: gaSettingFallback } = useGetSiteSettingByKeyQuery({
    key: 'ga4_measurement_id',
  } as any);

  const GA_ID = useMemo(() => {
    const db = coerceGaId(gaSettingPrimary?.value ?? gaSettingFallback?.value);
    const env = coerceGaId(process.env.NEXT_PUBLIC_GA_ID);
    return db || env;
  }, [gaSettingPrimary?.value, gaSettingFallback?.value]);

  const sentRef = useRef<string>('');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return;

    const qs = searchParams?.toString();
    const url = window.location.origin + pathname + (qs ? `?${qs}` : '');

    // URL değiştiyse: yeni gönderime izin ver
    // (aynı url ise spam engeli)
    if (sentRef.current === url) return;

    // önceki timer varsa iptal
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    let tries = 0;
    const maxTries = 40; // ~ 10sn (250ms)
    const tick = () => {
      tries++;

      // gtag yoksa bekle
      if (!window.gtag) {
        if (tries < maxTries) {
          timerRef.current = window.setTimeout(tick, 250);
        }
        return;
      }

      // Consent yoksa bekle (kullanıcı sonra onaylayabilir)
      if (window.__gaConsentGranted !== true) {
        if (tries < maxTries) {
          timerRef.current = window.setTimeout(tick, 250);
        }
        return;
      }

      // Gönder
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: url,
        page_path: pathname,
        language: locale,
      });

      sentRef.current = url;
    };

    tick();

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [GA_ID, pathname, searchParams, locale]);

  return null;
}
