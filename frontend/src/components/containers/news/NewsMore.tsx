// =============================================================
// FILE: src/components/containers/news/NewsMore.tsx
// Ensotek – More News Carousel (detail page altı)
// FIX: accepts currentSlug as prop (avoids IntrinsicAttributes error)
// PATTERN: useLocaleShort + useUiSection + localizePath
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types';

import { toCdnSrc } from '@/shared/media';

// i18n PATTERN
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';

import FallbackCover from 'public/img/blog/3/2.jpg';

const CARD_W = 640;
const CARD_H = 420;

type Props = {
  currentSlug?: string;
};

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

const NewsMore: React.FC<Props> = ({ currentSlug }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_news', locale as any);

  const current = useMemo(() => safeStr(currentSlug), [currentSlug]);

  const moreTitle = useMemo(() => ui('ui_news_more_title', 'More News'), [ui]);

  const readMoreLabel = useMemo(() => ui('ui_news_more_read_more', 'Read more'), [ui]);

  const newsListHref = useMemo(() => localizePath(locale, '/news'), [locale]);

  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: 'news',
    is_published: 1,
    sort: 'created_at',
    orderDir: 'desc',
    limit: 12,
    locale,
  });

  const items = useMemo(() => {
    const list: CustomPageDto[] = ((data as any)?.items ?? []) as any;

    return list
      .filter((n) => {
        if (!n || !n.is_published) return false;

        const slug = safeStr((n as any).slug);
        if (!slug) return false;

        // currentSlug varsa onu çıkar
        if (current && slug === current) return false;

        return true;
      })
      .slice(0, 9)
      .map((n) => {
        const slug = safeStr((n as any).slug);
        const title = safeStr((n as any).title);
        const summary = safeStr((n as any).summary);
        const imgRaw = safeStr((n as any).featured_image);

        return {
          id: safeStr((n as any).id) || slug,
          slug,
          title,
          summary,
          hero: (imgRaw && (toCdnSrc(imgRaw, CARD_W, CARD_H, 'fill') || imgRaw)) || '',
          alt: title || ui('ui_news_more_image_alt', 'news image'),
        };
      });
  }, [data, current, ui]);

  // ✅ empty state: hiç item yok ve loading değilse render etme
  if (!items.length && !isLoading) return null;

  return (
    <section className="news__area pt-60 pb-90">
      <div className="container">
        {/* Title */}
        <div className="row mb-40">
          <div className="col-12">
            <div className="section__title-wrapper text-center">
              <div className="section__subtitle-3">
                <span>{moreTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={3}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          navigation
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {items.map((n) => {
            const href = n.slug
              ? localizePath(locale, `/news/${encodeURIComponent(n.slug)}`)
              : newsListHref;

            return (
              <SwiperSlide key={n.id}>
                <div className="team__item teamItem--nameBelow">
                  <div className="team__thumb teamThumbHover">
                    <Link href={href}>
                      <Image
                        src={(n.hero as any) || (FallbackCover as any)}
                        alt={n.alt}
                        width={CARD_W}
                        height={CARD_H}
                        loading="lazy"
                      />
                    </Link>

                    <div className="teamThumbHover__overlay">
                      <div className="teamThumbHover__box">
                        <div className="teamThumbHover__role">{n.title}</div>
                        {n.summary ? <div className="teamThumbHover__note">{n.summary}</div> : null}
                      </div>
                    </div>
                  </div>

                  <div className="team__content teamContent--nameOnly">
                    <h3 className="teamNameOnly">
                      <Link href={href}>{n.title}</Link>
                    </h3>

                    <Link href={href} className="link-more">
                      {readMoreLabel} →
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {isLoading ? (
          <div className="row mt-20">
            <div className="col-12">
              <div className="skeleton-line" style={{ height: 16 }} aria-hidden />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default NewsMore;
