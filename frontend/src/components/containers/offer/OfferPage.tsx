// =============================================================
// FILE: src/components/containers/offer/OfferPage.tsx
// Teklif Sayfası Container – UI db’den gelir
// =============================================================

'use client';

import React from 'react';
import { OfferPublicForm } from '@/components/containers/offer/OfferPublicForm';

// i18n UI
import { useUiSection } from '@/i18n/uiDb';

export type OfferPageProps = {
  locale: string;
};

const OfferPage: React.FC<OfferPageProps> = ({ locale }) => {
  const { ui } = useUiSection('ui_offer', locale);

  const heading = ui(
    'ui_offer_heading_general',
    locale === 'de' ? 'Teklif Talep Formu' : 'Request an Offer',
  );

  const subText = ui(
    'ui_offer_subtitle',
    locale === 'de'
      ? 'İhtiyacınıza özel soğutma çözümleri ve teknik danışmanlık.'
      : 'Tailored cooling solutions and technical consulting.',
  );

  const longDescription = ui(
    'ui_offer_description',
    locale === 'de'
      ? 'Formu doldurun, satış ekibimiz en kısa sürede sizinle iletişime geçsin.'
      : 'Fill in the form and our sales team will contact you as soon as possible.',
  );

  return (
    <section className="features__area pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="200">
          {/* Başlık + açıklama */}
          <div className="col-xl-8 col-lg-9">
            <div className="section__title-wrapper text-center mb-40">
              <span className="section__subtitle">
                <span>Ensotek</span>{' '}
                {ui(
                  'ui_offer_section_label',
                  locale === 'de' ? 'Teknik Teklifler' : 'Technical Offers',
                )}
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
                  locale={locale}
                  defaultCountryCode={locale === 'de' ? 'TR' : 'DE'}
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
