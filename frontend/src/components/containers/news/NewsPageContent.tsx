// =============================================================
// FILE: src/components/containers/news/NewsProjectGallery.tsx
// Uses ProjectGallery SCSS (project__area / project__item ...)
// Data: custom_pages (module_key="news") via RTK (public)
// UI i18n: site_settings.ui_news (PATTERN)
// Locale: useLocaleShort() (hydration-safe)
// URL: "/{locale}/news" + "/{locale}/news/[slug]" (NO localizePath)
// Pagination: offset/limit + Load more
// NO Tailwind, NO inline styles
// =============================================================
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

// RTK – Custom Pages Public
import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types';

// Helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

import FallbackCover from 'public/img/blog/1/blog-01.jpg';

const CARD_W = 720;
const CARD_H = 480;

const PAGE_LIMIT = 12;

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
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

/**
 * DB content uyumu:
 * - content_html (string)
 * - content (object: { html })
 * - content (json-string: {"html":"..."})
 * - content (raw html string)
 */
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

/**
 * localizePath kullanmıyoruz.
 * - locale varsa: "/de/news" "/tr/news"
 * - locale yoksa: "/news"
 */
function withLocale(locale: string, path: string): string {
  const loc = safeStr(locale);
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!loc) return p;

  if (p === `/${loc}` || p.startsWith(`/${loc}/`)) return p;
  return `/${loc}${p}`;
}

type NewsCardVM = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  hero: string;
  area: string; // filter label
  links: string[]; // chips
};

function normalizeTags(page: any): string[] {
  const raw = (page as any)?.tags ?? (page as any)?.tag ?? (page as any)?.keywords;
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((x) => safeStr(x))
      .filter(Boolean)
      .slice(0, 3);
  }

  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return [];
    if (s.startsWith('[')) {
      const arr = safeJson<any[]>(s, []);
      return (arr || [])
        .map((x) => safeStr(x))
        .filter(Boolean)
        .slice(0, 3);
    }
    return s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  return [];
}

function normalizeArea(page: any, fallback: string): string {
  const a =
    safeStr((page as any)?.category) ||
    safeStr((page as any)?.category_name) ||
    safeStr((page as any)?.sub_category) ||
    safeStr((page as any)?.type);

  return a || fallback;
}

const NewsProjectGallery: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_news', locale as any);
  const t = useCallback((key: string, fb: string) => ui(key, fb), [ui]);

  const allLabel = t('ui_news_filter_all', 'All');
  const defaultArea = t('ui_news_filter_default', 'News');
  const untitled = t('ui_news_untitled', 'Untitled news');
  const emptyText = t('ui_news_empty', 'There are no news items to display at the moment.');
  const loadMoreText = t('ui_news_load_more', 'Load more');
  const readMoreAria = t('ui_news_read_more_aria', 'view news details');

  // pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [locale]);

  const queryArgs = useMemo(
    () => ({
      module_key: 'news',
      sort: 'created_at',
      order: 'desc',
      orderDir: 'desc',
      limit: PAGE_LIMIT,
      offset: (page - 1) * PAGE_LIMIT,
      is_published: 1,
      locale,
    }),
    [locale, page],
  );

  const { data, isLoading, isFetching } = useListCustomPagesPublicQuery(queryArgs as any);

  const listHref = withLocale(locale, '/news');

  const allItems = useMemo<NewsCardVM[]>(() => {
    const items: CustomPageDto[] = ((data as any)?.items ?? []) as any;

    return items
      .filter((p: any) => !!p && !!(p as any)?.is_published)
      .map((p: any, idx: number) => {
        const id =
          safeStr(p?.id) ||
          safeStr(p?.slug) ||
          `news-${idx}-${Math.random().toString(16).slice(2)}`;
        const title = safeStr(p?.title) || untitled;

        const metaDesc = safeStr(p?.meta_description);
        const sum = safeStr(p?.summary);
        const html = extractHtmlFromAny(p);

        const baseText = metaDesc || sum || html;
        const textExcerpt = excerpt(baseText, 140).trim();

        const imgRaw = safeStr(p?.featured_image);
        const hero = imgRaw ? toCdnSrc(imgRaw, CARD_W, CARD_H, 'fill') || imgRaw : '';

        const links = normalizeTags(p);
        const area = normalizeArea(p, defaultArea);

        return {
          id,
          title,
          excerpt: textExcerpt,
          slug: safeStr(p?.slug),
          hero,
          area,
          links,
        };
      });
  }, [data, untitled, defaultArea]);

  // Filter buttons (same concept as BlogProjectGallery)
  const filterButtons = useMemo<string[]>(() => {
    const unique = Array.from(new Set(allItems.map((x) => x.area).filter(Boolean)));
    if (!unique.length) return [allLabel];
    return [allLabel, ...unique];
  }, [allItems, allLabel]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKey = filterButtons[selectedIndex] || allLabel;

  const visibleItems = useMemo(() => {
    if (selectedKey === allLabel) return allItems;
    return allItems.filter((x) => x.area === selectedKey);
  }, [allItems, selectedKey, allLabel]);

  const total = Number((data as any)?.total ?? 0) || 0;
  const canLoadMore = total ? page * PAGE_LIMIT < total : allItems.length === PAGE_LIMIT;

  const onLoadMore = useCallback(() => {
    if (isFetching) return;
    setPage((p) => p + 1);
  }, [isFetching]);

  return (
    <section className="project__area pt-115 pb-90">
      <div className="container">
        {/* FILTER */}
        <div className="row">
          <div className="col-12">
            <div className="project__filter-button text-center p-relative mb-55">
              {filterButtons.map((cat, index) => (
                <button
                  type="button"
                  key={`${cat}-${index}`}
                  onClick={() => setSelectedIndex(index)}
                  className={'filter-btn' + (selectedIndex === index ? ' active' : '')}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {!isLoading && visibleItems.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <p className="text-center">{emptyText}</p>
            </div>
          </div>
        ) : null}

        {/* GRID */}
        <div className="row grid portfolio-grid-items" data-aos="fade-up" data-aos-delay="300">
          {visibleItems.map((it, index) => {
            const href = it.slug
              ? withLocale(locale, `/news/${encodeURIComponent(it.slug)}`)
              : listHref;

            return (
              <motion.div
                layout
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="col-xl-6 col-lg-6 col-md-6 grid-item c-3 c-2"
                key={it.id || index}
              >
                <div className="project__item mb-30">
                  <div className="project__thumb">
                    <Link href={href} aria-label={it.title || readMoreAria}>
                      <Image
                        src={(it.hero as any) || (FallbackCover as any)}
                        alt={it.title || 'news image'}
                        width={CARD_W}
                        height={CARD_H}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </Link>
                  </div>

                  <div className="project__content">
                    <h3>
                      <Link href={href}>{it.title}</Link>
                    </h3>

                    {safeStr(it.excerpt) ? <p>{it.excerpt}</p> : null}

                    <div className="project__tag">
                      {(it.links?.length ? it.links : [t('ui_news_tag_default', 'News')])
                        .slice(0, 3)
                        .map((tag) => (
                          <Link
                            key={`${it.id}-${tag}`}
                            href={href}
                            aria-label={`${it.title} — ${tag}`}
                          >
                            {tag}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Loading */}
          {isLoading ? (
            <div className="col-12">
              <div className="ens-skel ens-skel--md" />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
            </div>
          ) : null}
        </div>

        {/* LOAD MORE */}
        {!isLoading && allItems.length > 0 ? (
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

export default NewsProjectGallery;
