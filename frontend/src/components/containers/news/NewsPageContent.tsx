// =============================================================
// FILE: src/components/containers/news/NewsPageContent.tsx
// Ensotek – News Listing Page (All news + pagination)
//  - Style: same pattern as Home News section (mobile sequential)
//  - Desktop: blog grid cards
//  - Pagination: offset/limit + Load more
//  - Inline style: NONE
// =============================================================

'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// RTK – Custom Pages (public)
import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// Helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

// Fallback image
import FallbackCover from 'public/img/blog/1/blog-01.jpg';

const IMG_W = 720;
const IMG_H = 480;

const PAGE_LIMIT = 12;

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function safeJson<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === 'object') return v as T;
  if (typeof v !== 'string') return fallback;

  const s = v.trim();
  if (!s) return fallback;

  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function extractHtmlFromAny(page: any): string {
  const ch = safeStr(page?.content_html);
  if (ch) return ch;

  const c = page?.content ?? page?.content_json ?? page?.contentJson;
  if (!c) return '';

  if (typeof c === 'object') return safeStr((c as any)?.html);

  if (typeof c === 'string') {
    const s = c.trim();
    if (!s) return '';
    if (s.startsWith('{') || s.startsWith('[')) {
      const obj = safeJson<any>(s, null);
      const html = safeStr(obj?.html);
      if (html) return html;
    }
    return s;
  }

  return '';
}

type NewsCardVM = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  hero: string;
  alt: string;
};

const NewsPageContent: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_news', locale as any);
  const t = useCallback((key: string, fallback: string) => ui(key, fallback), [ui]);

  // Header strings
  const sectionSubtitlePrefix = t('ui_news_subprefix', 'Ensotek');
  const sectionSubtitleLabel = t('ui_news_sublabel', 'News');
  const sectionTitle = t('ui_news_page_title', 'News');

  const sectionIntro = t(
    'ui_news_page_intro',
    'Latest news, announcements and press releases about Ensotek.',
  );

  const readMore = t('ui_news_read_more', 'Read more');
  const readMoreAria = t('ui_news_read_more_aria', 'view news details');

  const untitled = t('ui_news_untitled', 'Untitled news');
  const emptyText = t('ui_news_empty', 'There are no news items to display at the moment.');

  const loadMoreText = t('ui_news_load_more', 'Load more');

  // Pagination
  const [page, setPage] = useState(1);

  // locale değişince resetle
  useEffect(() => {
    setPage(1);
  }, [locale]);

  const queryArgs = useMemo(
    () => ({
      module_key: 'news',
      sort: 'created_at',
      orderDir: 'desc',
      limit: PAGE_LIMIT,
      offset: (page - 1) * PAGE_LIMIT,
      is_published: 1,
      locale,
    }),
    [locale, page],
  );

  const { data, isLoading, isFetching } = useListCustomPagesPublicQuery(
    queryArgs as any,
    {
      skip: !locale,
    } as any,
  );

  const newsListHref = useMemo(() => localizePath(locale, '/news'), [locale]);

  const items: NewsCardVM[] = useMemo(() => {
    const raw: CustomPageDto[] = ((data as any)?.items ?? []) as any;

    return raw
      .filter((n) => !!n && !!(n as any).is_published)
      .map((n, idx) => {
        const id = safeStr((n as any)?.id) || safeStr((n as any)?.slug) || `news-${idx}`;
        const slug = safeStr((n as any)?.slug);
        const title = safeStr((n as any)?.title) || untitled || 'Untitled';

        const metaDesc = safeStr((n as any)?.meta_description);
        const sum = safeStr((n as any)?.summary);
        const html = extractHtmlFromAny(n);

        const baseText = metaDesc || sum || html;
        const textExcerpt = excerpt(baseText, 220).trim();

        const imgRaw = safeStr((n as any)?.featured_image);
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
  }, [data, untitled]);

  // total (RTK response total varsa)
  const total = Number((data as any)?.total ?? 0) || 0;
  const canLoadMore = total ? page * PAGE_LIMIT < total : items.length === PAGE_LIMIT;

  const onLoadMore = useCallback(() => {
    if (isFetching) return;
    setPage((p) => p + 1);
  }, [isFetching]);

  return (
    <section className="news__area grey-bg-3 pt-120 pb-90">
      <div className="container">
        {/* HEADER */}
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-70">
              <div className="section__subtitle-3">
                <span>
                  {sectionSubtitlePrefix} {sectionSubtitleLabel}
                </span>
              </div>

              <div className="section__title-3 mb-20">{sectionTitle}</div>

              {safeStr(sectionIntro) ? <p>{sectionIntro}</p> : null}
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {items.length === 0 && !isLoading ? (
          <div className="row">
            <div className="col-12">
              <p className="text-center">{emptyText}</p>
            </div>
          </div>
        ) : null}

        {/* MOBILE: sequential (content then image for each) */}
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

                    {safeStr(n.excerpt) ? <p className="ens-news__excerpt">{n.excerpt}</p> : null}

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
                    loading={idx < 2 ? 'eager' : 'lazy'}
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

        {/* DESKTOP: grid cards (blog__item-3) */}
        <div className="row d-none d-lg-flex" data-aos="fade-up" data-aos-delay="300">
          {items.map((n) => {
            const href = n.slug
              ? localizePath(locale, `/news/${encodeURIComponent(n.slug)}`)
              : newsListHref;

            return (
              <div className="col-xl-4 col-lg-6 col-md-6" key={n.id}>
                <div className="blog__item-3 mb-30">
                  <div className="blog__thumb w-img">
                    <Link href={href} aria-label={n.title}>
                      <Image
                        src={(n.hero as any) || (FallbackCover as any)}
                        alt={n.alt}
                        width={IMG_W}
                        height={IMG_H}
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  <div className="blog__content-3">
                    <h3>
                      <Link href={href}>{n.title}</Link>
                    </h3>

                    {safeStr(n.excerpt) ? (
                      <div className="postbox__text">
                        <p>{n.excerpt}</p>
                      </div>
                    ) : null}

                    <Link
                      href={href}
                      className="link-more"
                      aria-label={`${n.title} — ${readMoreAria}`}
                    >
                      {readMore} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading ? (
            <div className="col-12">
              <div className="ens-skel ens-skel--md" aria-hidden />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" aria-hidden />
            </div>
          ) : null}
        </div>

        {/* LOAD MORE */}
        {!isLoading && items.length > 0 ? (
          <div className="row mt-30">
            <div className="col-12 d-flex justify-content-center">
              {canLoadMore ? (
                <button
                  type="button"
                  className="border__btn s-2"
                  onClick={onLoadMore}
                  disabled={isFetching}
                  aria-disabled={isFetching ? 'true' : 'false'}
                >
                  {loadMoreText}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* fetching indicator */}
        {isFetching && !isLoading ? (
          <div className="row mt-15">
            <div className="col-12">
              <div className="skeleton-line ens-skel ens-skel--md" aria-hidden />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default NewsPageContent;
