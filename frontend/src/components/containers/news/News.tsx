'use client';

import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import FallbackCover from 'public/img/blog/1/blog-01.jpg';

const IMG_W = 720;
const IMG_H = 480;

type NewsCardVM = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  hero: string;
  alt: string;
};

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

const News: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_news', locale as any);
  const t = useCallback((key: string, fallback: string) => ui(key, fallback), [ui]);

  // UI strings (DB -> EN fallback only)
  const subprefix = t('ui_news_subprefix', 'Ensotek');
  const sublabel = t('ui_news_sublabel', 'News');

  const titlePrefix = t('ui_news_title_prefix', 'Latest');
  const titleMark = t('ui_news_title_mark', 'News');

  const readMore = t('ui_news_read_more', 'Read more');
  const readMoreAria = t('ui_news_read_more_aria', 'view news details');

  const untitled = t('ui_news_untitled', 'Untitled news');
  const viewAllText = t('ui_news_view_all', 'All news');

  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: 'news',
    sort: 'created_at',
    orderDir: 'desc',
    limit: 4,
    is_published: 1,
    locale,
  });

  const newsListHref = useMemo(() => localizePath(locale, '/news'), [locale]);

  const items: NewsCardVM[] = useMemo(() => {
    const list: CustomPageDto[] = ((data as any)?.items ?? []) as any;

    const mapped = list
      .filter((n) => !!n && !!(n as any).is_published)
      .slice(0, 2)
      .map((n) => {
        const id = safeStr((n as any).id) || safeStr((n as any).slug) || 'news-item';
        const slug = safeStr((n as any).slug);

        const title = safeStr((n as any).title) || untitled;

        const baseText = safeStr((n as any).meta_description) || safeStr((n as any).content_html);

        const textExcerpt = excerpt(baseText, 180);

        const imgRaw = safeStr((n as any).featured_image);
        const hero = imgRaw ? toCdnSrc(imgRaw, IMG_W, IMG_H, 'fill') || imgRaw : '';

        return {
          id,
          slug,
          title,
          excerpt: textExcerpt,
          hero,
          alt: title || 'news image',
        };
      });

    // 1 item geldiyse mobilde ikinci kart boş kalmasın
    if (mapped.length === 1) mapped.push({ ...mapped[0], id: `${mapped[0].id}-dup` });

    return mapped.slice(0, 2);
  }, [data, untitled]);

  return (
    <div className="news__area pt-120 pb-90">
      <div className="container">
        {/* Title */}
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>{subprefix}</span> {sublabel}
              </span>
              <h2 className="section__title">
                {titlePrefix} <span className="down__mark-line">{titleMark}</span>
              </h2>
            </div>
          </div>
        </div>

        {/* MOBILE: each news = (title+excerpt) then image, sequential */}
        <div className="ens-news__mobile d-block d-lg-none" data-aos="fade-up" data-aos-delay="300">
          {items.map((n, idx) => {
            const href = n.slug
              ? localizePath(locale, `/news/${encodeURIComponent(n.slug)}`)
              : newsListHref;

            const imgSrc = (n.hero as any) || (FallbackCover as any);

            return (
              <div className="ens-news__mobileItem" key={n.id}>
                <div className="blog__content-wrapper ens-news__contentWrapper">
                  <div className="blog__content">
                    <h3 className="ens-news__title">
                      <Link href={href}>{n.title}</Link>
                    </h3>

                    <p className="ens-news__excerpt">{n.excerpt}</p>

                    <Link
                      href={href}
                      className="link-more"
                      aria-label={`${n.title} — ${readMoreAria}`}
                    >
                      {readMore} →
                    </Link>
                  </div>
                </div>

                <Link
                  href={href}
                  className="blog__thumb w-img ens-news__thumbCard"
                  aria-label={n.title}
                >
                  <Image
                    src={imgSrc}
                    alt={n.alt}
                    width={IMG_W}
                    height={IMG_H}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="ens-news__thumbImg"
                  />
                </Link>

                {idx !== items.length - 1 ? (
                  <div className="ens-news__mobileDivider" aria-hidden />
                ) : null}
              </div>
            );
          })}

          {isLoading ? (
            <div className="skeleton-line mt-10 ens-skel ens-skel--md" aria-hidden />
          ) : null}
        </div>

        {/* DESKTOP: left list + right thumbs (original concept) */}
        <div
          className="row align-items-stretch d-none d-lg-flex"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {/* Left */}
          <div className="col-lg-6">
            <div className="blog__content-wrapper ens-news__contentWrapper mb-30">
              {items.map((n, idx) => {
                const href = n.slug
                  ? localizePath(locale, `/news/${encodeURIComponent(n.slug)}`)
                  : newsListHref;

                const isLast = idx === items.length - 1;

                return (
                  <div className="blog__content-item ens-news__contentItem" key={n.id}>
                    <div className="blog__content">
                      <h3 className="ens-news__title">
                        <Link href={href}>{n.title}</Link>
                      </h3>

                      <p className="ens-news__excerpt">{n.excerpt}</p>

                      <Link
                        href={href}
                        className="link-more"
                        aria-label={`${n.title} — ${readMoreAria}`}
                      >
                        {readMore} →
                      </Link>
                    </div>

                    {!isLast ? <div className="ens-news__divider" aria-hidden /> : null}
                  </div>
                );
              })}

              {isLoading ? (
                <div className="skeleton-line mt-10 ens-skel ens-skel--md" aria-hidden />
              ) : null}
            </div>
          </div>

          {/* Right */}
          <div className="col-lg-6">
            <div className="blog__thumb-wrapper ens-news__thumbWrapper mb-30">
              {items.map((n, idx) => {
                const href = n.slug
                  ? localizePath(locale, `/news/${encodeURIComponent(n.slug)}`)
                  : newsListHref;

                const imgSrc = (n.hero as any) || (FallbackCover as any);

                return (
                  <Link
                    href={href}
                    className="blog__thumb w-img ens-news__thumbCard"
                    aria-label={n.title}
                    key={`thumb-${n.id}`}
                  >
                    <Image
                      src={imgSrc}
                      alt={n.alt}
                      width={IMG_W}
                      height={IMG_H}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      className="ens-news__thumbImg"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="row ens-news__ctaRow">
          <div className="col-12">
            <div className="project__view text-lg-end">
              <Link className="solid__btn" href={newsListHref}>
                {viewAllText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
