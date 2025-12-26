// src/features/analytics/GAView.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    __gaConsentGranted?: boolean;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GAView({ locale }: { locale: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sentRef = useRef<string>('');

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return;

    const qs = searchParams?.toString();
    const url = window.location.origin + pathname + (qs ? `?${qs}` : '');

    // Aynı URL için tekrar spam yapmayalım
    if (sentRef.current === url) return;

    let tries = 0;
    const maxTries = 20; // ~ 20 * 250ms = 5sn
    const tick = () => {
      tries++;

      // gtag yoksa bekle
      if (!window.gtag) {
        if (tries < maxTries) setTimeout(tick, 250);
        return;
      }

      // Consent (analytics) verilmediyse page_view göndermeyelim
      // (İstersen consent mode ping’lerine güvenip gönderebilirsin; bu daha “net” kontrol.)
      if (window.__gaConsentGranted !== true) {
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
  }, [pathname, searchParams, locale]);

  return null;
}
