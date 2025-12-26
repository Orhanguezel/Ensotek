'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import CookieSettingsModal from './CookieSettingsModal';

// i18n (senin patternin)
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

type ConsentState = {
  necessary: true;
  analytics: boolean;
};

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
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => {
    return (
      String(resolvedLocale || 'tr')
        .trim()
        .toLowerCase()
        .replace('_', '-')
        .split('-')[0] || 'tr'
    );
  }, [resolvedLocale]);

  // UI metinleri (DB’den)
  const { ui } = useUiSection('ui_cookie', locale);

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

  const policyHref = useMemo(() => localizePath(locale, '/cookie-policy'), [locale]);

  const onRejectAll = () => {
    const next: ConsentState = { necessary: true, analytics: false };
    setConsent(next);
    persistConsent(next);
    applyAnalyticsConsent(false);
    setHasChoice(true);
    setOpenSettings(false);
  };

  const onAcceptAll = () => {
    const next: ConsentState = { necessary: true, analytics: true };
    setConsent(next);
    persistConsent(next);
    applyAnalyticsConsent(true);
    setHasChoice(true);
    setOpenSettings(false);
  };

  const onSaveSettings = (next: ConsentState) => {
    setConsent(next);
    persistConsent(next);
    applyAnalyticsConsent(!!next.analytics);
    setHasChoice(true);
    setOpenSettings(false);
  };

  // SSR/hydration güvenliği
  if (!ready) return null;

  // Seçim yapıldıysa banner gizli kalsın
  if (hasChoice) {
    return (
      <>
        {openSettings && (
          <CookieSettingsModal
            open={openSettings}
            consent={consent}
            onClose={() => setOpenSettings(false)}
            onSave={onSaveSettings}
            title={ui('ui_cookie_settings_title', 'Çerez Ayarları')}
            description={ui(
              'ui_cookie_settings_desc',
              'Hangi çerez kategorilerine izin verdiğinizi seçebilirsiniz. Gerekli çerezler her zaman açıktır.',
            )}
            labelNecessary={ui('ui_cookie_cat_necessary', 'Gerekli')}
            descNecessary={ui(
              'ui_cookie_cat_necessary_desc',
              'Sitenin temel işlevleri için zorunludur.',
            )}
            labelAnalytics={ui('ui_cookie_cat_analytics', 'Analitik')}
            descAnalytics={ui(
              'ui_cookie_cat_analytics_desc',
              'Site trafiğini ve performansı anlamamıza yardımcı olur.',
            )}
            btnCancel={ui('ui_cookie_btn_cancel', 'Vazgeç')}
            btnSave={ui('ui_cookie_btn_save', 'Kaydet')}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="ccb__wrap" role="region" aria-label="Cookie consent">
        <div className="ccb__inner">
          <div className="ccb__text">
            <div className="ccb__title">
              {ui('ui_cookie_title', locale === 'tr' ? 'Çerez Politikası' : 'Cookie Policy')}
            </div>
            <div className="ccb__desc">
              {ui(
                'ui_cookie_desc',
                locale === 'tr'
                  ? 'Sitemizin doğru şekilde çalışmasını sağlamak ve trafik analizi yapmak için çerezler kullanıyoruz. Tercihlerinizi yönetebilirsiniz.'
                  : 'We use cookies to ensure the site works properly and to analyze traffic. You can manage your preferences.',
              )}{' '}
              <Link className="ccb__link" href={policyHref}>
                {ui('ui_cookie_link_policy', 'Cookie Policy')}
              </Link>
            </div>
          </div>

          <div className="ccb__actions">
            <button
              type="button"
              className="ccb__btn ccb__btn--ghost"
              onClick={() => setOpenSettings(true)}
            >
              {ui('ui_cookie_btn_settings', 'Çerez Ayarları')}
            </button>

            <button type="button" className="ccb__btn ccb__btn--outline" onClick={onRejectAll}>
              {ui('ui_cookie_btn_reject', 'Tümünü Reddet')}
            </button>

            <button type="button" className="ccb__btn ccb__btn--primary" onClick={onAcceptAll}>
              {ui('ui_cookie_btn_accept', 'Tümünü Kabul Et')}
            </button>
          </div>

          <button
            type="button"
            className="ccb__close"
            onClick={onRejectAll}
            aria-label="Close"
            title="Close"
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
        title={ui('ui_cookie_settings_title', 'Çerez Ayarları')}
        description={ui(
          'ui_cookie_settings_desc',
          'Hangi çerez kategorilerine izin verdiğinizi seçebilirsiniz. Gerekli çerezler her zaman açıktır.',
        )}
        labelNecessary={ui('ui_cookie_cat_necessary', 'Gerekli')}
        descNecessary={ui(
          'ui_cookie_cat_necessary_desc',
          'Sitenin temel işlevleri için zorunludur.',
        )}
        labelAnalytics={ui('ui_cookie_cat_analytics', 'Analitik')}
        descAnalytics={ui(
          'ui_cookie_cat_analytics_desc',
          'Site trafiğini ve performansı anlamamıza yardımcı olur.',
        )}
        btnCancel={ui('ui_cookie_btn_cancel', 'Vazgeç')}
        btnSave={ui('ui_cookie_btn_save', 'Kaydet')}
      />

      <style jsx>{`
        .ccb__wrap {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9998;
          padding: 14px;
          background: transparent;
        }

        .ccb__inner {
          --ccb-primary: var(--tp-theme-1, #2563eb);
          --ccb-text: rgba(17, 24, 39, 0.92);
          --ccb-muted: rgba(17, 24, 39, 0.72);
          --ccb-border: rgba(0, 0, 0, 0.08);

          max-width: 1180px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: 1fr auto;
          gap: 14px 18px;
          align-items: center;
          position: relative;

          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border: 1px solid var(--ccb-border);
          border-radius: 18px;
          box-shadow: 0 18px 46px rgba(0, 0, 0, 0.14);
          padding: 14px 14px;
        }

        .ccb__text {
          min-width: 0;
          padding-right: 10px;
        }

        .ccb__title {
          color: var(--ccb-text);
          font-weight: 900;
          font-size: 14px;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .ccb__desc {
          color: var(--ccb-muted);
          margin-top: 6px;
          font-size: 13px;
          line-height: 1.45;
        }

        .ccb__link {
          color: var(--ccb-primary);
          font-weight: 800;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .ccb__actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: center;
        }

        .ccb__btn {
          border-radius: 12px;
          padding: 10px 14px;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease,
            border-color 0.12s ease, color 0.12s ease;
          border: 1px solid transparent;
          user-select: none;
          line-height: 1;
          white-space: nowrap;
        }

        .ccb__btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }

        .ccb__btn--ghost {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(0, 0, 0, 0.12);
          color: var(--ccb-text);
        }

        .ccb__btn--outline {
          background: rgba(17, 24, 39, 0.04);
          border-color: rgba(17, 24, 39, 0.14);
          color: rgba(17, 24, 39, 0.9);
        }

        .ccb__btn--primary {
          background: var(--ccb-primary);
          color: #fff;
          border-color: rgba(0, 0, 0, 0.08);
        }

        .ccb__btn--primary:hover {
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.16);
        }

        .ccb__close {
          position: absolute;
          right: 10px;
          top: 8px;

          width: 34px;
          height: 34px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(255, 255, 255, 0.75);

          display: grid;
          place-items: center;

          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          opacity: 0.75;
          transition: 0.12s ease;
        }

        .ccb__close:hover {
          opacity: 1;
          transform: translateY(-1px);
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
        }

        @media (max-width: 900px) {
          .ccb__inner {
            grid-template-columns: 1fr;
            padding: 14px 12px 12px;
          }

          .ccb__actions {
            justify-content: flex-start;
          }

          .ccb__close {
            right: 8px;
            top: 8px;
          }
        }
      `}</style>
    </>
  );
}
