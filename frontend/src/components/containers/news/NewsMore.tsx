// =============================================================
// FILE: src/components/containers/news/NewsMore.tsx
// Ensotek – More News Section (detail page altı)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { toCdnSrc } from '@/shared/media';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import FallbackCover from 'public/img/blog/3/2.jpg';

const CARD_W = 480;
const CARD_H = 320;

function toLocaleShort(l: string): string {
  const s = String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-');
  return s.split('-')[0] || 'de';
}

export interface NewsMoreProps {
  currentSlug?: string;
}

const NewsMore: React.FC<NewsMoreProps> = ({ currentSlug }) => {
  const resolved = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolved), [resolved]);

  const { ui } = useUiSection('ui_news', locale);

  const moreTitle = ui('ui_news_more_title', locale === 'de' ? 'Diğer Haberler' : 'More News');

  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: 'news',
    sort: 'created_at',
    orderDir: 'desc',
    limit: 6,
    is_published: 1,
    locale,
  });

  const newsListHref = localizePath(locale, '/news');

  const items = useMemo(() => {
    const list: CustomPageDto[] = data?.items ?? [];

    return list
      .filter((n) => {
        const s = (n.slug || '').trim();
        if (!n.is_published) return false;
        if (!s) return false;
        if (currentSlug && s === currentSlug) return false;
        return true;
      })
      .slice(0, 3)
      .map((n) => {
        const s = (n.slug || '').trim();
        const title = (n.title || '').trim();
        const imgRaw = (n.featured_image || '').trim();
        const hero = (imgRaw && (toCdnSrc(imgRaw, CARD_W, CARD_H, 'fill') || imgRaw)) || '';

        return {
          id: n.id,
          slug: s,
          title,
          hero,
        };
      });
  }, [data, currentSlug]);

  if (!items.length && !isLoading) return null;

  return (
    <section className="news__area pt-60 pb-90">
      <div className="container">
        <div className="row mb-40">
          <div className="col-12">
            <div className="section__title-wrapper text-center">
              <div className="section__subtitle-3">
                <span>{moreTitle}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="200">
          {items.map((n) => {
            const href = n.slug
              ? localizePath(locale, `/news/${encodeURIComponent(n.slug)}`)
              : newsListHref;

            return (
              <div className="col-xl-4 col-lg-4 col-md-6" key={n.id}>
                <div className="news__item-3 mb-30">
                  <div className="news__thumb-3 w-img">
                    <Image
                      src={(n.hero as any) || (FallbackCover as any)}
                      alt={n.title || 'news image'}
                      width={CARD_W}
                      height={CARD_H}
                      style={{ width: '100%', height: 'auto' }}
                      loading="lazy"
                    />
                  </div>
                  <div className="news__content-3">
                    <h3>
                      <Link href={href}>{n.title}</Link>
                    </h3>
                    <Link href={href} className="link-more">
                      {ui('ui_news_read_more', locale === 'de' ? 'Devamını oku' : 'Read more')} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="col-12">
              <div className="skeleton-line" style={{ height: 16 }} aria-hidden />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsMore;
