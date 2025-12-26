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
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
      value,
    )}; path=/; max-age=${maxAge}; samesite=lax`;
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

function applyAnalyticsConsent(analytics: boolean) {
  try {
    (window as any).__gaConsentGranted = analytics === true;
    // GA Consent Mode update (GAScripts içinde window.__setGaConsent tanımlı olmalı)
    (window as any).__setGaConsent?.({
      analytics_storage: analytics ? 'granted' : 'denied',
    });
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

  // Seçim yapıldıysa banner gizli kalsın (istersen “manage cookies” linki footer’da ayrıca eklenebilir)
  if (hasChoice) {
    return (
      <>
        {/* Settings modal yine de kullanılabilsin istersen: dışarıdan tetikleyeceğin bir event ekleyebilirsin */}
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
          padding: 14px 14px 18px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .ccb__inner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 14px 18px;
          align-items: center;
          position: relative;
        }

        .ccb__text {
          min-width: 0;
        }

        .ccb__title {
          font-weight: 800;
          font-size: 14px;
          line-height: 1.2;
        }

        .ccb__desc {
          margin-top: 6px;
          font-size: 13px;
          line-height: 1.45;
          opacity: 0.8;
        }

        .ccb__link {
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .ccb__actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .ccb__btn {
          border-radius: 12px;
          padding: 10px 14px;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          transition: 0.15s ease;
          border: 1px solid transparent;
          user-select: none;
        }

        .ccb__btn--ghost {
          background: #fff;
          border-color: rgba(0, 0, 0, 0.14);
        }

        .ccb__btn--outline {
          background: rgba(255, 255, 255, 0.65);
          border-color: rgba(0, 0, 0, 0.14);
        }

        .ccb__btn--primary {
          background: #f6b700; /* ekrandaki örneğe benzer sarı */
          color: #111;
          border-color: rgba(0, 0, 0, 0.08);
        }

        .ccb__btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 22px rgba(0, 0, 0, 0.1);
        }

        .ccb__close {
          position: absolute;
          right: -2px;
          top: -6px;
          border: 0;
          background: transparent;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
          opacity: 0.55;
          padding: 2px 8px;
        }
        .ccb__close:hover {
          opacity: 1;
        }

        @media (max-width: 900px) {
          .ccb__inner {
            grid-template-columns: 1fr;
          }
          .ccb__actions {
            justify-content: flex-start;
          }
          .ccb__close {
            right: -6px;
            top: -10px;
          }
        }
      `}</style>
    </>
  );
}
