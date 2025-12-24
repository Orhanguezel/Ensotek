// =============================================================
// FILE: src/components/containers/faqs/FaqsPageContent.tsx
// Ensotek – Full FAQs Page Content
// =============================================================

'use client';

import React, { useMemo, useState } from 'react';

import { useListFaqsQuery } from '@/integrations/rtk/hooks';
import type { FaqDto } from '@/integrations/types/faqs.types';
import { normalizeFaq } from '@/integrations/types/faqs.types';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

const FaqsPageContent: React.FC = () => {
  const resolved = useResolvedLocale();
  const locale = (resolved || 'tr').split('-')[0];

  const { ui } = useUiSection('ui_faqs', locale);

  const [open, setOpen] = useState<string | null>(null);

  const emptyText = ui(
    'ui_faqs_empty',
    locale === 'tr'
      ? 'Şu anda görüntülenecek soru bulunmamaktadır.'
      : 'There are no FAQs to display at the moment.',
  );

  const { data = [], isLoading } = useListFaqsQuery({
    is_active: 1,
    sort: 'display_order',
    orderDir: 'asc',
    limit: 200,
    locale, // RTK type izin vermezse kaldır
  } as any);

  const faqs = useMemo(() => {
    const list = (Array.isArray(data) ? data : []) as FaqDto[];

    return list
      .map((dto) => normalizeFaq(dto))
      .filter((f) => f.is_active)
      .sort((a, b) => {
        if (a.display_order !== b.display_order) return a.display_order - b.display_order;
        return a.created_at.localeCompare(b.created_at);
      });
  }, [data]);

  return (
    <section className="faq__area pt-120 pb-90 grey-bg-3">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-50">
              <span className="section__subtitle">
                <span>{ui('ui_faqs_kicker_prefix', 'Ensotek')}</span>{' '}
                {ui(
                  'ui_faqs_kicker_label',
                  locale === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions',
                )}
              </span>

              <h2 className="section__title">
                {ui('ui_faqs_page_title_prefix', locale === 'tr' ? 'Merak edilen' : 'Common')}{' '}
                <span className="down__mark-line">
                  {ui('ui_faqs_page_title_mark', locale === 'tr' ? 'sorular' : 'questions')}
                </span>
              </h2>

              <p
                style={{
                  maxWidth: 640,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 16,
                }}
              >
                {ui(
                  'ui_faqs_intro',
                  locale === 'tr'
                    ? 'Ensotek ürünleri, hizmetleri ve süreçleri hakkında sıkça sorulan soruların yanıtlarını burada bulabilirsiniz.'
                    : 'Find answers to the most common questions about Ensotek products, services and processes.',
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="200">
          <div className="col-xl-10 col-lg-11 mx-auto">
            <div className="bd-faq__wrapper mb-10">
              <div className="bd-faq__accordion" data-aos="fade-left" data-aos-duration="1000">
                <div className="accordion" id="faqAccordion">
                  {!isLoading && faqs.length === 0 && (
                    <div className="accordion-item">
                      <div className="accordion-body">
                        <p className="text-center mb-0">{emptyText}</p>
                      </div>
                    </div>
                  )}

                  {faqs.map((faq, idx) => {
                    const isOpen = open === faq.id;
                    const headingId = `faq-heading-${idx}`;
                    const panelId = `faq-collapse-${idx}`;

                    return (
                      <div className="accordion-item" key={faq.id}>
                        <h2 className="accordion-header" id={headingId}>
                          <button
                            className={`accordion-button no-caret d-flex align-items-center${
                              isOpen ? '' : ' collapsed'
                            }`}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setOpen(isOpen ? null : faq.id)}
                            type="button"
                          >
                            <span className="acc-bullet" aria-hidden="true" />
                            <span className="acc-text">
                              {faq.question || ui('ui_faqs_untitled', 'Untitled question')}
                            </span>
                          </button>
                        </h2>

                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={headingId}
                          className={`accordion-collapse collapse${isOpen ? ' show' : ''}`}
                        >
                          <div className="accordion-body">
                            {faq.answer ? (
                              <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                            ) : (
                              <p className="text-muted small mb-0">
                                {ui(
                                  'ui_faqs_no_answer',
                                  locale === 'tr'
                                    ? 'Bu soru için henüz cevap girilmemiştir.'
                                    : 'No answer has been provided for this question yet.',
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="accordion-item" aria-hidden>
                      <div className="accordion-body">
                        <div className="skeleton-line" style={{ height: 12, marginBottom: 8 }} />
                        <div className="skeleton-line" style={{ height: 12, width: '80%' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-20">
              <p className="small text-muted mb-0">
                {ui(
                  'ui_faqs_footer_note',
                  locale === 'tr'
                    ? 'Aradığınız cevabı bulamadıysanız lütfen bizimle iletişime geçin.'
                    : 'If you cannot find the answer you are looking for, please contact us.',
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .accordion-button.no-caret::after {
          display: none !important;
        }
        .accordion-button .acc-bullet {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.18);
          margin-right: 10px;
          flex: 0 0 auto;
        }
        @media (prefers-color-scheme: dark) {
          .accordion-button .acc-bullet {
            background: rgba(255, 255, 255, 0.45);
          }
        }
        .accordion-button .acc-text {
          line-height: 1.3;
        }
      `}</style>
    </section>
  );
};

export default FaqsPageContent;
