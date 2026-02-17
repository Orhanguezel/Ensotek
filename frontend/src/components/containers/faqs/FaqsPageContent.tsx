'use client';

import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { useFaqs } from '@/features/faqs/faqs.action';

const copy = {
  tr: {
    kicker: 'Ensotek - Sık Sorulan Sorular',
    title: 'Sık Sorulan Sorular',
    subtitle: 'Aklınıza takılan soruların yanıtlarını burada bulabilirsiniz.',
    empty: 'Gösterilecek FAQ kaydı bulunamadı.',
    loading: 'Yükleniyor...',
  },
  en: {
    kicker: 'Ensotek - Frequently Asked Questions',
    title: 'Frequently Asked Questions',
    subtitle: 'You can find answers to common questions here.',
    empty: 'No FAQ records to display.',
    loading: 'Loading...',
  },
  de: {
    kicker: 'Ensotek - Haufig gestellte Fragen',
    title: 'Haufig gestellte Fragen',
    subtitle: 'Hier finden Sie Antworten auf haufige Fragen.',
    empty: 'Keine FAQ-Eintrage zum Anzeigen.',
    loading: 'Wird geladen...',
  },
} as const;

export default function FaqsPageContent() {
  const locale = useLocale();
  const t = copy[(locale as 'tr' | 'en' | 'de') || 'tr'] ?? copy.tr;
  const { data, isLoading } = useFaqs({ is_active: true });
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list
      .filter((item) => item.is_active)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [data]);

  return (
    <section className="faq__area pt-120 pb-90 grey-bg-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="section__title-wrapper text-center mb-45">
              <span className="section__title-pre">{t.kicker}</span>
              <h2 className="section__title">{t.title}</h2>
              <p>{t.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-11">
            <div className="bd-faq__wrapper-2 mb-10">
              <div className="bd-faq__accordion" data-aos="fade-up" data-aos-duration="900">
                <div className="accordion" id="faqsAccordionPage">
                  {isLoading && (
                    <div className="alert alert-light border">{t.loading}</div>
                  )}

                  {!isLoading && faqs.length === 0 && (
                    <div className="alert alert-light border">{t.empty}</div>
                  )}

                  {!isLoading &&
                    faqs.map((faq, idx) => {
                      const id = faq.id || String(idx);
                      const headingId = `faqHeading-${id}`;
                      const panelId = `faqCollapse-${id}`;
                      const isOpen = openId === id || (openId === null && idx === 0);

                      return (
                        <div className="accordion-item" key={id}>
                          <h2 className="accordion-header" id={headingId}>
                            <button
                              className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => setOpenId((prev) => (prev === id ? null : id))}
                              aria-expanded={isOpen}
                              aria-controls={panelId}
                            >
                              {faq.question}
                            </button>
                          </h2>

                          <div
                            id={panelId}
                            className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                            aria-labelledby={headingId}
                          >
                            <div className="accordion-body">
                              <div dangerouslySetInnerHTML={{ __html: faq.answer || '' }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
