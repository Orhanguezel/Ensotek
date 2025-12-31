// =============================================================
// FILE: src/components/containers/library/Library.tsx
// Ensotek – Library Landing Section (Accordion List)
// - Public list: GET /library (LibraryDto[])
// - i18n: useUiSection('ui_library')
// - Hero: parent featured_image/image_url (schema-safe)
// =============================================================

'use client';

import React, { useMemo, useState, useCallback } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';

import { useListLibraryQuery } from '@/integrations/rtk/hooks';
import type { LibraryDto } from '@/integrations/types/library.types';

// Pattern + fallback görseller
import One from 'public/img/shape/features-shape.png';
import Two from 'public/img/features/1.png';

// React Icons
import { FiArrowRight, FiPlus, FiMinus } from 'react-icons/fi';

// Helpers
import { toCdnSrc } from '@/shared/media';
import { stripHtml, excerpt } from '@/shared/text';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

type LibraryItemVM = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  hero: string;
};

const Library: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_library', locale as any);

  // EN fallback only
  const t = useCallback(
    (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    },
    [ui],
  );

  const listHref = useMemo(() => localizePath(locale, '/library'), [locale]);
  const [open, setOpen] = useState<number>(0);

  const { data = [], isLoading } = useListLibraryQuery({
    locale,
    limit: 200,

    // mevcut düzeni bozmadım
    order: 'display_order.desc',
    sort: 'published_at',
    orderDir: 'desc',

    // public schema: is_published / is_active yok (publicLibraryListQuerySchema)
    // Eğer backend public list'te otomatik filtreliyorsa bu alanları göndermeyelim.
  });

  const items: LibraryItemVM[] = useMemo(() => {
    const arr = Array.isArray(data) ? (data as LibraryDto[]) : [];

    const base = arr.map((it) => {
      const title =
        safeStr(it.name) || safeStr(it.slug) || t('ui_library_untitled', 'Untitled content');

      // Tip: description alanını özet gibi kullanıyoruz (HTML olabilir)
      const descRaw = safeStr(it.description);
      const summary = descRaw ? excerpt(stripHtml(descRaw), 220) : '';

      // Hero: sadece schema-safe parent alanları
      const rawImg = safeStr(it.featured_image) || safeStr(it.image_url);
      const hero = rawImg ? toCdnSrc(rawImg, 720, 520, 'fill') || rawImg : '';

      return {
        id: safeStr(it.id),
        slug: safeStr(it.slug),
        title,
        summary: summary || '—',
        hero,
      };
    });

    if (!base.length) {
      return [
        {
          id: 'ph-1',
          slug: '',
          title: t('ui_library_sample_one', 'Sample article 1'),
          summary: '—',
          hero: '',
        },
        {
          id: 'ph-2',
          slug: '',
          title: t('ui_library_sample_two', 'Sample article 2'),
          summary: '—',
          hero: '',
        },
      ];
    }

    return base;
  }, [data, t]);

  const firstWithHero = items.find((x) => !!safeStr(x.hero));
  const leftHero: string | StaticImageData =
    (firstWithHero?.hero as string) || (Two as StaticImageData);

  const leftAlt = firstWithHero?.title || t('ui_library_cover_alt', 'library cover image');

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
              <div className="features__thumb ens-library__thumb">
                <Image
                  src={leftHero as any}
                  alt={leftAlt}
                  width={720}
                  height={520}
                  sizes="(max-width: 992px) 100vw, 50vw"
                  className="ens-media--fluid"
                  loading={typeof leftHero === 'string' ? 'lazy' : undefined}
                  priority={typeof leftHero !== 'string'}
                />
              </div>
            </div>
          </div>

          {/* Sağ içerik (dinamik akordeon) */}
          <div className="col-xl-6 col-lg-6">
            <div className="features__content-wrapper">
              <div className="section__title-wrapper mb-10">
                <span className="section__subtitle">
                  <span>{t('ui_library_subprefix', 'Ensotek')}</span>{' '}
                  {t('ui_library_sublabel', 'Knowledge Hub')}
                </span>

                <h2 className="section__title">
                  {t('ui_library_title_prefix', 'Engineering and')}{' '}
                  <span className="down__mark-line">{t('ui_library_title_mark', 'Documents')}</span>
                </h2>
              </div>

              <div className="bd-faq__wrapper mb-40">
                <div className="bd-faq__accordion" data-aos="fade-left" data-aos-duration="1000">
                  <div className="accordion" id="libAccordion">
                    {items.map((it, idx) => {
                      const isOpen = open === idx;

                      const href = it.slug
                        ? localizePath(locale, `/library/${encodeURIComponent(it.slug)}`)
                        : listHref;

                      const headingId = `lib-heading-${idx}`;
                      const panelId = `lib-collapse-${idx}`;

                      return (
                        <div className="accordion-item" key={it.id}>
                          <h2 className="accordion-header" id={headingId}>
                            <button
                              className={`accordion-button ens-acc-btn d-flex align-items-center${
                                isOpen ? '' : ' collapsed'
                              }`}
                              aria-expanded={isOpen}
                              aria-controls={panelId}
                              onClick={() => setOpen(isOpen ? -1 : idx)}
                              type="button"
                            >
                              <span className="ens-acc-icon" aria-hidden="true">
                                {isOpen ? <FiMinus size={22} /> : <FiPlus size={22} />}
                              </span>
                              <span className="ens-acc-text">{it.title}</span>
                            </button>
                          </h2>

                          <div
                            id={panelId}
                            role="region"
                            aria-labelledby={headingId}
                            className={`accordion-collapse collapse${isOpen ? ' show' : ''}`}
                          >
                            <div className="accordion-body">
                              <p className="ens-acc-summary">{it.summary}</p>

                              <Link
                                href={href}
                                className="link-more d-inline-flex align-items-center gap-1"
                                aria-label={`${it.title} – ${t(
                                  'ui_library_view_detail_aria',
                                  'view details',
                                )}`}
                              >
                                {t('ui_library_view_detail', 'View details')} <FiArrowRight />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isLoading && (
                      <div className="accordion-item" aria-hidden>
                        <div className="accordion-body">
                          <div className="skeleton-line ens-skel--h10" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="project__view">
                <Link href={listHref} className="solid__btn">
                  {t('ui_library_view_all', 'View all documents')}
                </Link>
              </div>
            </div>
          </div>
          {/* /Sağ içerik */}
        </div>
      </div>
    </section>
  );
};

export default Library;
