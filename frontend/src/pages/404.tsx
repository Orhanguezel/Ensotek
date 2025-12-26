// =============================================================
// FILE: src/pages/404.tsx
// Ensotek – 404 Page (i18n + dynamic locales)
//  - UI keys: site_settings.ui_errors
//  - Canonical/og:url: _document tek kaynak
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

const toLocaleShort = (l: any) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'de';

const Error404: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_errors', locale);

  const title = ui(
    'ui_404_title',
    locale === 'de'
      ? 'Sayfa Bulunamadı'
      : locale === 'de'
      ? 'Seite nicht gefunden'
      : 'Page Not Found',
  );

  const subtitle = ui(
    'ui_404_subtitle',
    locale === 'de'
      ? 'Aradığınız sayfa bulunamadı veya taşınmış olabilir.'
      : locale === 'de'
      ? 'Die gesuchte Seite wurde möglicherweise verschoben oder existiert nicht.'
      : 'The page you are looking for may have been moved or does not exist.',
  );

  const cta = ui(
    'ui_404_back_home',
    locale === 'de' ? 'Ana Sayfaya Dön' : locale === 'de' ? 'Zur Startseite' : 'Back To Home',
  );

  const homeHref = useMemo(() => localizePath(locale, '/'), [locale]);

  return (
    <div className="pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6 text-center">
            <h2 className="mb-25">{title}</h2>
            <p className="mb-35">{subtitle}</p>

            <Link
              href={homeHref}
              className="border-btn text-dark bg-warning border border-dark text-center ms-3 borderc-btn d-inline-flex"
            >
              {cta}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
