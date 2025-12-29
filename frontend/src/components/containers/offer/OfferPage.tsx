// =============================================================
// FILE: src/components/containers/offer/OfferPage.tsx
// Ensotek – Offer Page Container (I18N PATTERN, DB UI, EN-only fallback) [FINAL]
// - i18n (PATTERN): useLocaleShort + useUiSection + localizePath
// - UI strings: site_settings.ui_offer
// - Fallback: EN only (no locale branching)
// =============================================================

'use client';

import React, { useMemo, useCallback } from 'react';

import  OfferPublicForm  from '@/components/containers/offer/OfferPublicForm';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

const OfferPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_offer', locale as any);

  // DB -> EN fallback only
  const t = useCallback((key: string, fallback: string) => ui(key, fallback), [ui]);

  // UI strings
  const subprefix = t('ui_offer_subprefix', 'Ensotek');
  const sectionLabel = t('ui_offer_section_label', 'Technical Offers');

  const heading = t('ui_offer_heading_general', 'Request an Offer');

  const subText = t('ui_offer_subtitle', 'Tailored cooling solutions and technical consulting.');
  const longDescription = t(
    'ui_offer_description',
    'Fill in the form and our sales team will contact you as soon as possible.',
  );

  // If you later add buttons/links, you already have the pattern + helper.
  // Example usage:
  // const offersHref = useMemo(() => localizePath(locale, '/offer'), [locale]);
  useMemo(() => localizePath(locale, '/offer'), [locale]); // keeps pattern + avoids unused import risk

  // Country code default: do NOT branch on locale for 30-language scaling.
  // Use a stable default; form itself should be resilient and allow change.
  const defaultCountryCode = 'DE';

  return (
    <section className="features__area pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="200">
          {/* Title + description */}
          <div className="col-xl-8 col-lg-9">
            <div className="section__title-wrapper text-center mb-40">
              <span className="section__subtitle">
                <span>{subprefix}</span> {sectionLabel}
              </span>

              <h2 className="section__title">{heading}</h2>

              <p className="mb-0 text-muted mt-15">
                {subText}
                <br />
                {longDescription}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="col-xl-8 col-lg-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3 p-md-4 p-lg-5">
                <OfferPublicForm
                  defaultCountryCode={defaultCountryCode}
                  productId={null}
                  productName={null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferPage;
