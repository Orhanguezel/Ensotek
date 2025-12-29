// =============================================================
// FILE: src/components/containers/offer/OfferSection.tsx
// Ensotek – Teklif Formu Bölümü – UI DB’den
//  - i18n PATTERN: useLocaleShort + useUiSection + localizePath
//  - UI: DB (site_settings.ui_offer) + EN-only fallback
// =============================================================

'use client';

import React, { useMemo, useCallback } from 'react';
import Link from 'next/link';

import OfferPublicForm from './OfferPublicForm';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

export type OfferSectionContext = 'product' | 'service' | 'general';

export type OfferSectionProps = {
  productId?: string;
  productName?: string | null;
  contextType?: OfferSectionContext;
};

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

const OfferSection: React.FC<OfferSectionProps> = ({ productId, productName, contextType }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_offer', locale as any);

  // EN-only fallback helper
  const t = useCallback(
    (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    },
    [ui],
  );

  const effectiveContext: OfferSectionContext = useMemo(() => {
    return contextType ?? (productId ? 'product' : 'general');
  }, [contextType, productId]);

  const offerHref = useMemo(() => localizePath(locale, '/offer'), [locale]);

  const headingKey = useMemo(() => {
    if (effectiveContext === 'product') return 'ui_offer_heading_product';
    if (effectiveContext === 'service') return 'ui_offer_heading_service';
    return 'ui_offer_heading_general';
  }, [effectiveContext]);

  const introKey = useMemo(() => {
    if (effectiveContext === 'product') return 'ui_offer_intro_product';
    if (effectiveContext === 'service') return 'ui_offer_intro_service';
    return 'ui_offer_intro_general';
  }, [effectiveContext]);

  const buttonKey = useMemo(() => {
    if (effectiveContext === 'product') return 'ui_offer_button_product';
    if (effectiveContext === 'service') return 'ui_offer_button_service';
    return 'ui_offer_button_general';
  }, [effectiveContext]);

  const heading = useMemo(() => {
    // EN fallback only (DB should provide TR/DE/..)
    if (effectiveContext === 'product') return t(headingKey, 'Request a quote for this product');
    if (effectiveContext === 'service') return t(headingKey, 'Request a quote for this service');
    return t(headingKey, 'Request a quote');
  }, [t, headingKey, effectiveContext]);

  const intro = useMemo(() => {
    if (effectiveContext === 'product') {
      return t(introKey, 'Fill in the form to request a tailored quotation for this product.');
    }
    if (effectiveContext === 'service') {
      return t(introKey, 'Fill in the form to request a tailored quotation for this service.');
    }
    return t(introKey, 'Request a tailored quotation for your needs.');
  }, [t, introKey, effectiveContext]);

  const buttonLabel = useMemo(() => {
    if (effectiveContext === 'general') return t(buttonKey, 'Request an offer');
    return t(buttonKey, 'Go to offer page');
  }, [t, buttonKey, effectiveContext]);

  return (
    <section className="my-4">
      <div className="row">
        <div className="col-12 mb-3">
          <h3 className="h5 mb-1">{heading}</h3>
          <p className="text-muted small mb-0">{intro}</p>

          <div className="mt-2">
            <Link href={offerHref} className="btn btn-primary btn-sm">
              {buttonLabel}
            </Link>
          </div>
        </div>

        <div className="col-12">
          <OfferPublicForm productId={productId ?? null} productName={productName ?? null} />
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
