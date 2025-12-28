// =============================================================
// FILE: src/components/containers/blog/BlogPageContent.tsx
// UPDATED — SCSS-driven (NO Tailwind, NO inline styles)
// - Uses BLOG SCSS classes: blog__item-3, blog__thumb, blog__content-3, postbox__text
// - Data: custom_pages (module_key="blog")
// - UI i18n: site_settings.ui_blog
// - Locale: useLocaleShort() (hydration-safe)
// - URL: no localizePath -> "/{locale}/blog" or "/blog"
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// RTK – Custom Pages Public
import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// Helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

import FallbackCover from 'public/img/blog/3/1.jpg';

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

  if (typeof c === 'object') {
    const html = (c as any)?.html;
    return safeStr(html);
  }

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
 * - locale varsa: "/de/blog" "/tr/blog"
 * - locale yoksa: "/blog"
 */
function withLocale(locale: string, path: string): string {
  const loc = safeStr(locale);
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!loc) return p;

  // çift slash önle
  if (p === `/${loc}` || p.startsWith(`/${loc}/`)) return p;
  return `/${loc}${p}`;
}

const BlogPageContent: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_blog', locale as any);

  const sectionSubtitlePrefix = ui('ui_blog_subprefix', 'Ensotek');
  const sectionSubtitleLabel = ui('ui_blog_sublabel', 'Blog');
  const sectionTitle = ui('ui_blog_page_title', 'Blog');

  const sectionIntro = ui(
    'ui_blog_page_intro',
    'Ensotek blog posts, technical content and updates.',
  );

  const readMore = ui('ui_blog_read_more', 'Read more');
  const readMoreAria = ui('ui_blog_read_more_aria', 'view blog details');

  const untitled = ui('ui_blog_untitled', 'Untitled post');
  const emptyText = ui('ui_blog_empty', 'There are no blog posts to display at the moment.');

  const { data, isLoading } = useListCustomPagesPublicQuery({
    module_key: 'blog',
    sort: 'created_at',
    order: 'desc', // ✅ backend pattern
    orderDir: 'desc', // ✅ some endpoints still use this
    limit: PAGE_LIMIT,
    is_published: 1,
    locale,
  } as any);

  const blogItems = useMemo(() => {
    const items: CustomPageDto[] = ((data as any)?.items ?? []) as any;

    return items.map((p) => {
      const title = safeStr((p as any)?.title) || safeStr(untitled) || 'Untitled';
      const slug = safeStr((p as any)?.slug);

      const metaDesc = safeStr((p as any)?.meta_description);
      const sum = safeStr((p as any)?.summary);
      const html = extractHtmlFromAny(p);

      const baseText = metaDesc || sum || html;
      const textExcerpt = excerpt(baseText, 220).trim();

      const imgRaw = safeStr((p as any)?.featured_image);
      const hero = imgRaw ? toCdnSrc(imgRaw, CARD_W, CARD_H, 'fill') || imgRaw : '';

      return { id: safeStr((p as any)?.id), slug, title, excerpt: textExcerpt, hero };
    });
  }, [data, untitled]);

  const blogListHref = withLocale(locale, '/blog');

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

              {safeStr(sectionIntro) && <p>{sectionIntro}</p>}
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {blogItems.length === 0 && !isLoading && (
            <div className="col-12">
              <p className="text-center">{emptyText}</p>
            </div>
          )}

          {blogItems.map((p, idx) => {
            const detailHref = p.slug
              ? withLocale(locale, `/blog/${encodeURIComponent(p.slug)}`)
              : blogListHref;

            const key = p.id || p.slug || String(idx);

            return (
              <div className="col-xl-4 col-lg-6 col-md-6" key={key}>
                {/* ✅ Use BLOG SCSS card */}
                <div className="blog__item-3 mb-30">
                  <div className="blog__thumb w-img">
                    <Link href={detailHref} aria-label={p.title}>
                      <Image
                        src={(p.hero as any) || (FallbackCover as any)}
                        alt={p.title || 'blog image'}
                        width={CARD_W}
                        height={CARD_H}
                        className="img-fluid"
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  <div className="blog__content-3">
                    <h3>
                      <Link href={detailHref}>{p.title}</Link>
                    </h3>

                    {!!safeStr(p.excerpt) && (
                      <div className="postbox__text">
                        <p>{p.excerpt}</p>
                      </div>
                    )}

                    <Link
                      href={detailHref}
                      className="link-more"
                      aria-label={`${p.title} — ${readMoreAria}`}
                    >
                      {readMore} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* LOADING */}
          {isLoading && (
            <div className="col-12">
              <div className="ens-skel ens-skel--md" />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPageContent;
