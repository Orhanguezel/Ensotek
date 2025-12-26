// =============================================================
// FILE: src/components/containers/news/NewsDetail.tsx
// Ensotek – News Detail Content
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useGetCustomPageBySlugPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { toCdnSrc } from '@/shared/media';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import ReviewList from '@/components/common/ReviewList';
import ReviewForm from '@/components/common/ReviewForm';

import FallbackCover from 'public/img/blog/3/1.jpg';

const HERO_W = 960;
const HERO_H = 540;

function toLocaleShort(l: string): string {
  const s = String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-');
  return s.split('-')[0] || 'de';
}

export interface NewsDetailProps {
  slug: string;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ slug }) => {
  const resolved = useResolvedLocale();
  const localeShort = useMemo(() => toLocaleShort(resolved), [resolved]);

  const { ui } = useUiSection('ui_news', localeShort);

  const backToListText = ui(
    'ui_news_back_to_list',
    localeShort === 'de' ? 'Tüm haberlere dön' : 'Back to all news',
  );
  const loadingText = ui(
    'ui_news_loading',
    localeShort === 'de' ? 'Haber yükleniyor...' : 'Loading news...',
  );
  const notFoundText = ui(
    'ui_news_not_found',
    localeShort === 'de' ? 'Haber bulunamadı.' : 'News not found.',
  );

  const { data, isLoading, isError } = useGetCustomPageBySlugPublicQuery(
    { slug, locale: localeShort },
    { skip: !slug },
  );

  const news = data as CustomPageDto | undefined;

  const newsListHref = localizePath(localeShort, '/news');

  const title = (news?.title || '').trim();

  const heroSrc = useMemo(() => {
    const raw = (news?.featured_image || '').trim();
    if (!raw) return '';
    return toCdnSrc(raw, HERO_W, HERO_H, 'fill') || raw;
  }, [news?.featured_image]);

  const contentHtml = news?.content_html || '';

  return (
    <section className="news__area grey-bg-3 pt-120 pb-90">
      <div className="container">
        {/* Back link */}
        <div className="row mb-30">
          <div className="col-12">
            <Link href={newsListHref} className="link-more">
              ← {backToListText}
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="row">
            <div className="col-12">
              <p>{loadingText}</p>
              <div className="skeleton-line mt-10" style={{ height: 16 }} aria-hidden />
              <div
                className="skeleton-line mt-10"
                style={{ height: 16, width: '80%' }}
                aria-hidden
              />
            </div>
          </div>
        )}

        {!isLoading && (isError || !news) && (
          <div className="row">
            <div className="col-12">
              <p>{notFoundText}</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && news && (
          <>
            <div className="row" data-aos="fade-up" data-aos-delay="200">
              <div className="col-12">
                <article className="news__detail">
                  <header className="news__detail-header mb-30">
                    <h1 className="section__title-3 mb-20">{title || notFoundText}</h1>
                  </header>

                  <div className="news__detail-hero w-img mb-30">
                    <Image
                      src={(heroSrc as any) || (FallbackCover as any)}
                      alt={news.featured_image_alt || title || 'news image'}
                      width={HERO_W}
                      height={HERO_H}
                      style={{ width: '100%', height: 'auto' }}
                      priority
                    />
                  </div>

                  <div
                    className="news__detail-content tp-postbox-details"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                </article>
              </div>
            </div>

            <div className="row mt-60" data-aos="fade-up" data-aos-delay="250">
              <div className="col-lg-7 col-md-12 mb-30">
                <ReviewList
                  targetType="news"
                  targetId={news.id}
                  locale={localeShort}
                  showHeader={true}
                  className="news__detail-reviews"
                />
              </div>

              <div className="col-lg-5 col-md-12 mb-30">
                <ReviewForm
                  targetType="news"
                  targetId={news.id}
                  locale={localeShort}
                  className="news__detail-review-form"
                  toggleLabel={ui(
                    'ui_news_write_comment',
                    localeShort === 'de' ? 'Yorum Gönder' : 'Write a review',
                  )}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsDetail;
