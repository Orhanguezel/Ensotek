// =============================================================
// FILE: src/components/containers/references/References.tsx
// Public References – logos slider + UI i18n
//   - Featured references (is_featured=1) slider
//   - i18n: useResolvedLocale + useUiSection('ui_references')
//   - NO inline styles / NO styled-jsx
//   - EN-only fallback (no locale branching)
// =============================================================
'use client';

import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';

// Icons
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// RTK – References public
import { useListReferencesQuery } from '@/integrations/rtk/hooks';
import type { ReferenceDto } from '@/integrations/types/references.types';

// Placeholders
import One from 'public/img/brand/1.png';
import Two from 'public/img/brand/2.png';
import Three from 'public/img/brand/3.png';
import Four from 'public/img/brand/4.png';
import Five from 'public/img/brand/5.png';

// Helpers
import { toCdnSrc } from '@/shared/media';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

const CARD_W = 160;
const CARD_H = 60;

const altFromSlug = (slug?: string | null) => (slug || 'reference').replace(/[-_]+/g, ' ').trim();

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/** Başlığın son kelimesini .down__mark-line ile işaretle */
function decorateTitleWithMarkLine(title: string) {
  const parts = (title || '').split(' ').filter(Boolean);
  if (parts.length <= 1) return <span className="down__mark-line">{title}</span>;
  const last = parts.pop()!;
  return (
    <>
      {parts.join(' ')} <span className="down__mark-line">{last}</span>
    </>
  );
}

const References: React.FC = () => {
  const locale = useResolvedLocale();

  // UI → site_settings.key = "ui_references"
  const { ui } = useUiSection('ui_references', locale as any);

  // EN-only fallback helper
  const t = useCallback(
    (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    },
    [ui],
  );

  // Public references list (featured only)
  const { data, isLoading } = useListReferencesQuery({
    limit: 30,
    sort: 'display_order',
    orderDir: 'asc',
    is_published: 1,
    is_featured: 1,
    module_key: 'references',
    locale,
  } as any);

  const logos = useMemo(() => {
    const list: ReferenceDto[] = (data?.items ?? []) as any;

    // FE güvenlik filtresi
    const featured = list.filter(
      (r: any) => Number(r.is_published) === 1 && Number(r.is_featured) === 1,
    );

    const base = featured
      .slice(0, 30)
      .map((r: any) => {
        const imgRaw =
          r.featured_image_url_resolved || r.featured_asset?.url || r.featured_image || null;

        const src = (imgRaw && toCdnSrc(imgRaw, CARD_W, CARD_H, 'fit')) || imgRaw || '';
        if (!src) return null;

        const title = safeStr(r.title);
        const alt = title || safeStr(r.featured_image_alt) || altFromSlug(r.slug) || 'reference';

        return { id: String(r.id || ''), alt, src };
      })
      .filter(Boolean) as { id: string; alt: string; src: string }[];

    // hiç featured yoksa → placeholder
    if (!base.length) {
      return [
        { id: 'ph-1', alt: 'brand', src: One as any },
        { id: 'ph-2', alt: 'brand', src: Two as any },
        { id: 'ph-3', alt: 'brand', src: Three as any },
        { id: 'ph-4', alt: 'brand', src: Four as any },
        { id: 'ph-5', alt: 'brand', src: Five as any },
      ];
    }

    return base;
  }, [data]);

  // UI strings (EN fallback only)
  const title = t('ui_references_title', 'Our References');
  const subprefix = t('ui_references_subprefix', 'Ensotek');
  const sublabel = t('ui_references_sublabel', 'References');
  const viewAllText = t('ui_references_view_all', 'View all references');
  const prevLabel = t('ui_references_prev', 'Previous');
  const nextLabel = t('ui_references_next', 'Next');

  const referencesHref = localizePath(locale, '/references');

  return (
    <div className="brand__area grey-bg pt-60 pb-60 references__sliderWrap">
      <div className="container">
        {/* Başlık + oklar + View All */}
        <div
          className="row align-items-center mb-25 references__sliderHead"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="col-12 col-md-7">
            <div className="section__title-wrapper text-center text-md-start mb-0">
              <span className="section__subtitle">
                <span>{subprefix}</span> {sublabel}
              </span>
              <h2 className="section__title references__sliderTitle">
                {decorateTitleWithMarkLine(title)}
              </h2>
            </div>
          </div>

          <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end align-items-center gap-2">
            <div className="feedback__navigation me-2 d-none d-sm-flex">
              <button className="references__button-prev" aria-label={prevLabel} type="button">
                <FiChevronLeft />
              </button>
              <button className="references__button-next" aria-label={nextLabel} type="button">
                <FiChevronRight />
              </button>
            </div>

            <Link href={referencesHref} className="solid__btn" aria-label={viewAllText}>
              {viewAllText}
            </Link>
          </div>
        </div>

        {/* Slider */}
        <div
          className="row justify-content-center"
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-duration="1000"
        >
          <div className="col-12">
            <Swiper
              modules={[Autoplay, Navigation]}
              navigation={{
                nextEl: '.references__button-next',
                prevEl: '.references__button-prev',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={logos.length > 6}
              spaceBetween={24}
              slidesPerView={2.2}
              breakpoints={{
                480: { slidesPerView: 3.2 },
                768: { slidesPerView: 4.2 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 },
              }}
              className="brand__active"
            >
              {logos.map((logo, i) => (
                <SwiperSlide key={`${logo.id}-${i}`}>
                  <div className="brand__line references__slideLine">
                    <div className="singel__brand">
                      <Image
                        src={logo.src as any}
                        alt={logo.alt}
                        width={CARD_W}
                        height={CARD_H}
                        loading={i < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        draggable={false}
                        className="references__logoImg"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {isLoading && <div className="skeleton-line mt-20" aria-hidden />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default References;
