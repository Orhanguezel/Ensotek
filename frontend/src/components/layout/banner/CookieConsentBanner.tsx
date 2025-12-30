// src/components/layout/banner/CookieConsentBanner.tsx

'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';

import CookieSettingsModal, { type ConsentState } from './CookieSettingsModal';

// i18n + UI (STANDARD)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

const CONSENT_COOKIE = 'ensotek_cookie_consent_v1';
const CONSENT_LS = 'ensotek_cookie_consent_v1';
const COOKIE_DAYS = 180;

function setCookie(name: string, value: string, days: number) {
  try {
    const maxAge = days * 24 * 60 * 60;

    const isHttps =
      typeof window !== 'undefined' && window.location && window.location.protocol === 'https:';

    // SameSite=Lax + (https prod’da) Secure
    const secure = isHttps ? '; secure' : '';

    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
      value,
    )}; path=/; max-age=${maxAge}; samesite=lax${secure}`;
  } catch {}
}

function getCookie(name: string): string | null {
  try {
    const pattern = new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`);
    const m = document.cookie.match(pattern);
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

function safeParseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (typeof obj !== 'object' || !obj) return null;
    const analytics = !!(obj as any).analytics;
    return { necessary: true, analytics };
  } catch {
    return null;
  }
}

function persistConsent(consent: ConsentState) {
  const raw = JSON.stringify({ analytics: !!consent.analytics });
  try {
    localStorage.setItem(CONSENT_LS, raw);
  } catch {}
  setCookie(CONSENT_COOKIE, raw, COOKIE_DAYS);
}

function loadConsent(): ConsentState | null {
  const fromCookie = safeParseConsent(getCookie(CONSENT_COOKIE));
  if (fromCookie) return fromCookie;

  try {
    const fromLs = safeParseConsent(localStorage.getItem(CONSENT_LS));
    if (fromLs) return fromLs;
  } catch {}

  return null;
}

function queueConsent(payload: { analytics_storage: 'granted' | 'denied' } | boolean) {
  try {
    (window as any).__pendingAnalyticsConsent = (window as any).__pendingAnalyticsConsent || [];
    const q = (window as any).__pendingAnalyticsConsent as any[];

    // dedupe: aynı payload üst üste birikmesin
    const last = q.length ? q[q.length - 1] : null;
    const same =
      JSON.stringify(last ?? null) === JSON.stringify(payload ?? null) ||
      (typeof last === 'boolean' && typeof payload === 'boolean' && last === payload);

    if (!same) q.push(payload);
  } catch {}
}

function applyAnalyticsConsent(analytics: boolean) {
  try {
    const payload = { analytics_storage: analytics ? 'granted' : 'denied' } as const;

    // UI tarafında da güncel tutalım
    (window as any).__analyticsConsentGranted = analytics === true;

    if (typeof (window as any).__setAnalyticsConsent === 'function') {
      (window as any).__setAnalyticsConsent(payload);
    } else {
      queueConsent(payload);
    }
  } catch {}
}

export default function CookieConsentBanner() {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_cookie', locale as any);



  const [ready, setReady] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({ necessary: true, analytics: false });
  const [hasChoice, setHasChoice] = useState<boolean>(false);

  useEffect(() => {
    const existing = loadConsent();
    if (existing) {
      setConsent(existing);
      setHasChoice(true);
      applyAnalyticsConsent(existing.analytics);
    } else {
      setHasChoice(false);
      // default: analytics denied (privacy by default)
      applyAnalyticsConsent(false);
    }
    setReady(true);
  }, []);

  const policyHref = useMemo(() => localizePath(locale as any, '/cookie-policy'), [locale]);

  const onRejectAll = useCallback(() => {
    const next: ConsentState = { necessary: true, analytics: false };
    setConsent(next);
    persistConsent(next);
    applyAnalyticsConsent(false);
    setHasChoice(true);
    setOpenSettings(false);
  }, []);

  const onAcceptAll = useCallback(() => {
    const next: ConsentState = { necessary: true, analytics: true };
    setConsent(next);
    persistConsent(next);
    applyAnalyticsConsent(true);
    setHasChoice(true);
    setOpenSettings(false);
  }, []);

  const onSaveSettings = useCallback((next: ConsentState) => {
    setConsent(next);
    persistConsent(next);
    applyAnalyticsConsent(!!next.analytics);
    setHasChoice(true);
    setOpenSettings(false);
  }, []);

  // SSR/hydration güvenliği
  if (!ready) return null;

  // Seçim yapıldıysa banner gizli kalsın; ayar modalı yine açılabilir.
  if (hasChoice) {
    return (
      <CookieSettingsModal
        open={openSettings}
        consent={consent}
        onClose={() => setOpenSettings(false)}
        onSave={onSaveSettings}
      />
    );
  }

  // Banner metinleri (ui_cookie)
  const titleText = ui('cc_banner_title', 'Cookie Policy');
  const descText = ui(
    'cc_banner_desc',
    'We use cookies to ensure the site works properly and to analyze traffic. You can manage your preferences.',
  );
  const policyLabel = ui('cc_banner_link_policy', 'Cookie Policy');

  const btnSettings = ui('cc_banner_btn_settings', 'Cookie Settings');
  const btnReject = ui('cc_banner_btn_reject', 'Reject All');
  const btnAccept = ui('cc_banner_btn_accept', 'Accept All');

  const ariaClose = ui('cc_banner_aria_close', 'Close');

  return (
    <>
      <div
        className="ccb__wrap"
        role="region"
        aria-label={ui('cc_banner_aria_region', 'Cookie consent')}
      >
        <div className="ccb__inner">
          <div className="ccb__text">
            <div className="ccb__title">{titleText}</div>

            <div className="ccb__desc">
              {descText}{' '}
              <Link className="ccb__link" href={policyHref}>
                {policyLabel}
              </Link>
            </div>
          </div>

          <div className="ccb__actions">
            <button
              type="button"
              className="ccb__btn ccb__btn--ghost"
              onClick={() => setOpenSettings(true)}
            >
              {btnSettings}
            </button>

            <button type="button" className="ccb__btn ccb__btn--outline" onClick={onRejectAll}>
              {btnReject}
            </button>

            <button type="button" className="ccb__btn ccb__btn--primary" onClick={onAcceptAll}>
              {btnAccept}
            </button>
          </div>

          <button
            type="button"
            className="ccb__close"
            onClick={onRejectAll}
            aria-label={ariaClose}
            title={ariaClose}
          >
            ×
          </button>
        </div>
      </div>

      <CookieSettingsModal
        open={openSettings}
        consent={consent}
        onClose={() => setOpenSettings(false)}
        onSave={onSaveSettings}
      />
    </>
  );
}
