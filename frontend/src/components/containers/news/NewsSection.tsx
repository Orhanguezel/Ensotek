// =============================================================
// FILE: src/components/containers/news/NewsSection.tsx
// Ensotek – News Section (Home) – RTK + i18n (PATTERN)
// - 2 latest news (custom_pages module_key='news')
// - Desktop: left list + right thumbs
// - Mobile: stacked content + image
// - No inline styles / uses existing theme classes
// =============================================================

'use client';

import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// i18n + UI (STANDARD PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';
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

function safeUi(ui: (k: string, f?: any) => any, key: string, fallback: string): string {
  const raw = ui(key, fallback);
  if (!isValidUiText(raw, key)) return fallback;
  const s = String(raw ?? '').trim();
  return s || fallback;
}

export default function NewsSection() {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_news', locale as any);
  const t = useCallback((key: string, fb: string) => safeUi(ui as any, key, fb), [ui]);

  // UI strings
  const subprefix = t('ui_news_subprefix', 'Ensotek');
  const sublabel = t('ui_news_sublabel', 'News');

  const titlePrefix = t('ui_news_title_prefix', 'Latest');
  const titleMark = t('ui_news_title_mark', 'News');

  const readMore = t('ui_news_read_more', 'Read more');
  const readMoreAria = t('ui_news_read_more_aria', 'view news details');

  const untitled = t('ui_news_untitled', 'Untitled news');
  const viewAllText = t('ui_news_view_all', 'All news');

  const { data, isLoading } = useListCustomPagesPublicQuery(
    {
      module_key: 'news',
      sort: 'created_at',
      orderDir: 'desc',
      limit: 4,
      is_published: 1,
      locale,
    } as any,
    { skip: !locale },
  );

  const newsListHref = useMemo(() => localizePath(locale as any, '/news'), [locale]);

  const items: NewsCardVM[] = useMemo(() => {
    const list: CustomPageDto[] = ((data as any)?.items ??
      (data as any)?.data ??
      (data as any)?.rows ??
      data ??
      []) as any;

    const arr = Array.isArray(list) ? list : [];

    const mapped = arr
      .filter((n: any) => !!n && !!(n as any).is_published)
      .slice(0, 2)
      .map((n: any) => {
        const id = safeStr(n?.id) || safeStr(n?.slug) || `news-${Math.random()}`;
        const slug = safeStr(n?.slug);

        const title = safeStr(n?.title) || untitled;

        const baseText =
          safeStr(n?.summary) ||
          safeStr(n?.meta_description) ||
          safeStr(n?.content_text) ||
          safeStr(n?.content_html);

        const textExcerpt = excerpt(baseText, 180);

        const imgRaw = safeStr(n?.featured_image);
        const hero = imgRaw ? toCdnSrc(imgRaw, IMG_W, IMG_H, 'fill') || imgRaw : '';

        const alt = safeStr(n?.featured_image_alt) || title || 'news image';

        return {
          id,
          slug,
          title,
          excerpt: textExcerpt,
          hero,
          alt,
        };
      });

    // Tek kayıt geldiyse tasarım bozulmasın diye kopyala
    if (mapped.length === 1) mapped.push({ ...mapped[0], id: `${mapped[0].id}-dup` });

    // Hiç yoksa placeholder’a düş (UI boş kalmasın)
    if (!mapped.length) {
      return [
        {
          id: 'placeholder-1',
          slug: '',
          title: untitled,
          excerpt: t('ui_news_empty_desc', 'News will be published soon.'),
          hero: '',
          alt: untitled,
        },
        {
          id: 'placeholder-2',
          slug: '',
          title: untitled,
          excerpt: t('ui_news_empty_desc', 'News will be published soon.'),
          hero: '',
          alt: untitled,
        },
      ];
    }

    return mapped.slice(0, 2);
  }, [data, untitled, t]);

  return (
    <div className="blog__area pt-120 pb-90 ens-newsSection">
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

        {/* MOBILE */}
        <div
          className="ens-newsSection__mobile d-block d-lg-none"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {items.map((n, idx) => {
            const href = n.slug
              ? localizePath(locale as any, `/news/${encodeURIComponent(n.slug)}`)
              : newsListHref;

            const imgSrc = (n.hero as any) || (FallbackCover as any);

            return (
              <div className="ens-newsSection__mobileItem" key={n.id}>
                <div className="blog__content-wrapper ens-newsSection__contentWrapper">
                  <div className="blog__content">
                    <h3 className="ens-newsSection__title">
                      <Link href={href}>{n.title}</Link>
                    </h3>

                    <p className="ens-newsSection__excerpt">{n.excerpt}</p>

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
                  className="blog__thumb w-img ens-newsSection__thumbCard"
                  aria-label={n.title}
                >
                  <Image
                    src={imgSrc}
                    alt={n.alt}
                    width={IMG_W}
                    height={IMG_H}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="ens-newsSection__thumbImg"
                  />
                </Link>

                {idx !== items.length - 1 ? (
                  <div className="ens-newsSection__mobileDivider" aria-hidden />
                ) : null}
              </div>
            );
          })}

          {isLoading ? (
            <div className="skeleton-line mt-10 ens-skel ens-skel--md" aria-hidden />
          ) : null}
        </div>

        {/* DESKTOP */}
        <div
          className="row align-items-stretch d-none d-lg-flex"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {/* Left */}
          <div className="col-xl-6 col-lg-6">
            <div className="blog__content-wrapper ens-newsSection__contentWrapper mb-30">
              {items.map((n, idx) => {
                const href = n.slug
                  ? localizePath(locale as any, `/news/${encodeURIComponent(n.slug)}`)
                  : newsListHref;

                const isLast = idx === items.length - 1;

                return (
                  <div className="blog__content-item ens-newsSection__contentItem" key={n.id}>
                    <div className="blog__content">
                      <h3 className="ens-newsSection__title">
                        <Link href={href}>{n.title}</Link>
                      </h3>

                      <p className="ens-newsSection__excerpt">{n.excerpt}</p>

                      <Link
                        href={href}
                        className="link-more"
                        aria-label={`${n.title} — ${readMoreAria}`}
                      >
                        {readMore} →
                      </Link>
                    </div>

                    {!isLast ? <div className="ens-newsSection__divider" aria-hidden /> : null}
                  </div>
                );
              })}

              {isLoading ? (
                <div className="skeleton-line mt-10 ens-skel ens-skel--md" aria-hidden />
              ) : null}
            </div>
          </div>

          {/* Right */}
          <div className="col-xl-6 col-lg-6">
            <div className="blog__thumb-wrapper ens-newsSection__thumbWrapper mb-30">
              {items.map((n, idx) => {
                const href = n.slug
                  ? localizePath(locale as any, `/news/${encodeURIComponent(n.slug)}`)
                  : newsListHref;

                const imgSrc = (n.hero as any) || (FallbackCover as any);

                return (
                  <Link
                    href={href}
                    className="blog__thumb w-img ens-newsSection__thumbCard"
                    aria-label={n.title}
                    key={`thumb-${n.id}`}
                  >
                    <Image
                      src={imgSrc}
                      alt={n.alt}
                      width={IMG_W}
                      height={IMG_H}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      className="ens-newsSection__thumbImg"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="row ens-newsSection__ctaRow">
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
}
