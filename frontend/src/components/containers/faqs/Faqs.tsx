// =============================================================
// FILE: src/components/containers/faq/Faq.tsx
// Ensotek – Global FAQ / SSS Section (Home / SSS sayfası)
//   - Data: faqs (public)
//   - i18n: site_settings.key = "ui_faqs"
//   - Locale-aware routes with localizePath
//   - RTK: useListFaqsQuery (FaqDto → normalizeFaq)
// =============================================================
'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// RTK – PUBLIC FAQs
import { useListFaqsQuery } from '@/integrations/rtk/hooks';
import { type FaqDto, type Faq, normalizeFaq } from '@/integrations/types';

// Pattern + fallback görseller (library ile aynı görsel pattern)
import One from 'public/img/shape/features-shape.png';
import Two from 'public/img/features/1.png';

// React Icons
import { FiArrowRight, FiPlus, FiMinus } from 'react-icons/fi';

// i18n helper’lar
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

const FaqSection: React.FC = () => {
  const locale = useResolvedLocale();

  // Bu sefer UI key = "ui_faqs"
  const { ui } = useUiSection('ui_faqs', locale);

  const listHref = localizePath(locale, '/faq');
  const [open, setOpen] = useState<number>(0);

  // İlk 8 SSS, aktif olanlar, display_order’a göre
  const { data = [], isLoading } = useListFaqsQuery({
    // locale paramı FaqListQueryParams'ta yok, o yüzden göndermiyoruz.
    limit: 8,
    order: 'display_order.asc', // backend: "kolon.yön" pattern
    sort: 'display_order',
    orderDir: 'asc',
    is_active: '1',
  });

  // DTO → normalizeFaq → aktifleri al
  const faqs: Faq[] = useMemo(() => {
    const rawList: FaqDto[] = Array.isArray(data) ? data : [];
    return rawList.map(normalizeFaq).filter((f) => f.is_active);
  }, [data]);

  // UI’da göstereceğimiz liste (fallback dummy SSS’ler dahil)
  const items = useMemo(() => {
    if (!faqs.length) {
      return [
        {
          id: 'ph-1',
          question: ui(
            'ui_faqs_sample_one_q',
            locale === 'de' ? 'Örnek soru 1 nedir?' : 'What is sample question 1?',
          ),
          answer: ui(
            'ui_faqs_sample_one_a',
            locale === 'de' ? 'Bu bir örnek SSS içeriğidir.' : 'This is a sample FAQ entry.',
          ),
          slug: '',
        },
        {
          id: 'ph-2',
          question: ui(
            'ui_faqs_sample_two_q',
            locale === 'de' ? 'Örnek soru 2 nedir?' : 'What is sample question 2?',
          ),
          answer: ui(
            'ui_faqs_sample_two_a',
            locale === 'de'
              ? 'İçerik girilene kadar bu alan placeholder olarak kullanılır.'
              : 'Placeholder content until real FAQs are added.',
          ),
          slug: '',
        },
      ];
    }

    // Gerçek SSS listesi
    return faqs
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        slug: f.slug,
      }));
  }, [faqs, ui, locale]);

  // SSS’lerin görseli yok; direkt statik görseli kullanıyoruz
  const leftHero = Two;
  const leftAlt = ui('ui_faqs_cover_alt', 'faq cover image');

  return (
    <section className="features__area p-relative features-bg pt-120 pb-35 cus-faq">
      <div className="features__pattern">
        <Image src={One} alt="pattern" loading="lazy" sizes="200px" />
      </div>

      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {/* Sol görsel */}
          <div className="col-xl-6 col-lg-6">
            <div className="features__thumb-wrapper mb-60">
              <div className="features__thumb">
                <Image
                  src={leftHero}
                  alt={leftAlt}
                  width={720}
                  height={520}
                  sizes="(max-width: 992px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Sağ içerik (dinamik akordeon) */}
          <div className="col-xl-6 col-lg-6">
            <div className="features__content-wrapper">
              <div className="section__title-wrapper mb-10">
                <span className="section__subtitle">
                  <span>{ui('ui_faqs_subprefix', 'Ensotek')}</span>{' '}
                  {ui('ui_faqs_sublabel', 'Sık Sorulan Sorular')}
                </span>
                <h2 className="section__title">
                  {ui(
                    'ui_faqs_title_prefix',
                    locale === 'de' ? 'Müşterilerimizden gelen' : 'Frequently asked',
                  )}{' '}
                  <span className="down__mark-line">
                    {ui('ui_faqs_title_mark', locale === 'de' ? 'sorular' : 'questions')}
                  </span>
                </h2>
              </div>

              <div className="bd-faq__wrapper mb-40">
                <div className="bd-faq__accordion" data-aos="fade-left" data-aos-duration="1000">
                  <div className="accordion" id="faqAccordion">
                    {items.map((it, idx) => {
                      const isOpen = open === idx;
                      const href = it.slug
                        ? localizePath(locale, `/faq/${encodeURIComponent(it.slug)}`)
                        : listHref;

                      const headingId = `faq-heading-${idx}`;
                      const panelId = `faq-collapse-${idx}`;

                      return (
                        <div className="accordion-item" key={it.id}>
                          <h2 className="accordion-header" id={headingId}>
                            <button
                              className={`accordion-button no-caret d-flex align-items-center${
                                isOpen ? '' : ' collapsed'
                              }`}
                              aria-expanded={isOpen}
                              aria-controls={panelId}
                              onClick={() => setOpen(isOpen ? -1 : idx)}
                              type="button"
                            >
                              <span className="acc-icon" aria-hidden="true">
                                {isOpen ? <FiMinus size={22} /> : <FiPlus size={22} />}
                              </span>
                              <span className="acc-text">{it.question}</span>
                            </button>
                          </h2>
                          <div
                            id={panelId}
                            role="region"
                            aria-labelledby={headingId}
                            className={`accordion-collapse collapse${isOpen ? ' show' : ''}`}
                          >
                            <div className="accordion-body">
                              <p style={{ marginBottom: 12 }}>{it.answer}</p>

                              {/* Detay sayfası istersen slug üzerinden gider */}
                              {it.slug && (
                                <Link
                                  href={href}
                                  className="link-more d-inline-flex align-items-center gap-1"
                                  aria-label={`${it.question} – ${ui(
                                    'ui_faqs_view_detail_aria',
                                    'view details',
                                  )}`}
                                >
                                  {ui(
                                    'ui_faqs_view_detail',
                                    locale === 'de' ? 'Detayları görüntüle' : 'View details',
                                  )}{' '}
                                  <FiArrowRight />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isLoading && (
                      <div className="accordion-item" aria-hidden>
                        <div className="accordion-body">
                          <div className="skeleton-line" style={{ height: 10 }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tümünü gör */}
              <div className="project__view">
                <Link href={listHref} className="solid__btn">
                  {ui(
                    'ui_faqs_view_all',
                    locale === 'de' ? 'Tüm soruları görüntüle' : 'View all questions',
                  )}
                </Link>
              </div>
            </div>
          </div>
          {/* /Sağ içerik */}
        </div>
      </div>

      {/* Varsayılan Bootstrap caret'ini gizle + ikonları büyüt */}
      <style jsx>{`
        .accordion-button.no-caret::after {
          display: none !important;
        }
        .accordion-button .acc-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          margin-right: 10px;
          flex: 0 0 auto;
        }
        @media (prefers-color-scheme: dark) {
          .accordion-button .acc-icon {
            border-color: rgba(255, 255, 255, 0.25);
          }
        }
        .accordion-button .acc-text {
          line-height: 1.2;
        }
      `}</style>
    </section>
  );
};

export default FaqSection;
