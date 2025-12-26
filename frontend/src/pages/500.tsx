// =============================================================
// FILE: src/pages/500.tsx
// Ensotek – 500 Page (i18n + dynamic locales)
//  - UI keys: site_settings.ui_errors
//  - Canonical/og:url: _document tek kaynak
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

const toLocaleShort = (l: any) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'de';

const Error500: React.FC = () => {
  const router = useRouter();
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_errors', locale);

  const title = ui(
    'ui_500_title',
    locale === 'de'
      ? 'Bir Hata Oluştu'
      : locale === 'de'
      ? 'Ein Fehler ist aufgetreten'
      : 'Something Went Wrong',
  );

  const subtitle = ui(
    'ui_500_subtitle',
    locale === 'de'
      ? 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      : locale === 'de'
      ? 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
      : 'An unexpected error occurred. Please try again later.',
  );

  const tryAgain = ui(
    'ui_500_try_again',
    locale === 'de' ? 'Tekrar Dene' : locale === 'de' ? 'Erneut versuchen' : 'Try Again',
  );

  const home = ui(
    'ui_404_back_home',
    locale === 'de' ? 'Ana Sayfaya Dön' : locale === 'de' ? 'Zur Startseite' : 'Back To Home',
  );

  const homeHref = useMemo(() => localizePath(locale, '/'), [locale]);

  return (
    <div className="pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 text-center">
            <h2 className="mb-25">{title}</h2>
            <p className="mb-35">{subtitle}</p>

            <div className="d-flex gap-2 justify-content-center flex-wrap">
              <button
                type="button"
                className="solid__btn d-inline-flex align-items-center"
                onClick={() => router.reload()}
              >
                {tryAgain}
              </button>

              <Link
                href={homeHref}
                className="border-btn text-dark bg-warning border border-dark text-center borderc-btn d-inline-flex"
              >
                {home}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error500;
