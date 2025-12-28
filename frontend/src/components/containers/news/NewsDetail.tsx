// =============================================================
// FILE: src/components/containers/news/NewsDetail.tsx
// UPDATED — Multi-image gallery + Lightbox modal (no inline styles)
// - Hero + thumbs under hero
// - Click hero/thumb => opens ImageLightboxModal
// - Other news / Share / Reviews / Contact sidebar pattern preserved
// - Contact Info: ✅ extracted to InfoContactCard (reusable)
// =============================================================

'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// RTK – Custom Pages (public)
import {
  useGetCustomPageBySlugPublicQuery,
  useListCustomPagesPublicQuery,
} from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// Helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

// Reviews + Share
import ReviewList from '@/components/common/public/ReviewList';
import ReviewForm from '@/components/common/public/ReviewForm';
import SocialShare from '@/components/common/public/SocialShare';

// Lightbox
import ImageLightboxModal, {
  type LightboxImage,
} from '@/components/common/public/ImageLightboxModal';

// ✅ Reusable info card extracted from this page
import InfoContactCard from '@/components/common/public/InfoContactCard';

// Assets
import SidebarImage from 'public/img/others/sidebar.jpg';

// Fallback hero
import FallbackCover from 'public/img/blog/3/1.jpg';

const HERO_W = 1200;
const HERO_H = 700;

const THUMB_W = 220;
const THUMB_H = 140;

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function tryParseJson<T>(v: unknown): T | null {
  try {
    if (v == null) return null;
    if (typeof v === 'object') return v as T;
    const s = safeStr(v);
    if (!s) return null;
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

/**
 * localizePath yok.
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

/**
 * Tailwind uygulanmasın:
 * - class/style attr kaldır
 * - ilk h1'i düşür (sayfa başlığını component basıyor)
 */
function stripPresentationAttrs(html: string): string {
  const src = safeStr(html);
  if (!src) return '';

  const noClass = src.replace(/\sclass="[^"]*"/gi, '');
  const noStyle = noClass.replace(/\sstyle="[^"]*"/gi, '');
  const dropFirstH1 = noStyle.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');

  return dropFirstH1.trim();
}

/** content_html içinden img src yakala (basit ve güvenli) */
function extractImgSrcListFromHtml(html: string): string[] {
  const src = safeStr(html);
  if (!src) return [];

  const out: string[] = [];
  const re = /<img\b[^>]*?\ssrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;

  while ((m = re.exec(src))) {
    const u = safeStr(m[1]);
    if (u) out.push(u);
    if (out.length >= 12) break;
  }

  return out;
}

/**
 * News kaydından “gallery images” toparla:
 * - featured_image
 * - images/gallery/media alanları (array veya json-string)
 * - content_html içindeki img tag'leri
 */
function buildGalleryImages(news: any, title: string): LightboxImage[] {
  const unique = new Set<string>();
  const gallery: LightboxImage[] = [];

  const add = (rawUrl: string, alt?: string) => {
    const u = safeStr(rawUrl);
    if (!u) return;
    if (unique.has(u)) return;
    unique.add(u);

    const thumb = toCdnSrc(u, THUMB_W, THUMB_H, 'fill') || u;
    const raw = toCdnSrc(u, 1600, 1200, 'fit') || u;

    gallery.push({
      raw,
      thumb,
      alt: safeStr(alt) || safeStr(title) || 'image',
    });
  };

  // 1) featured
  add(safeStr(news?.featured_image), safeStr(news?.featured_image_alt));

  // 2) common fields
  const candidates = [
    news?.images,
    news?.images_json,
    news?.gallery_images,
    news?.gallery,
    news?.media,
    news?.media_items,
  ];

  for (const c of candidates) {
    if (!c) continue;

    // array
    if (Array.isArray(c)) {
      for (const it of c) {
        if (typeof it === 'string') add(it);
        else if (it && typeof it === 'object')
          add((it as any).url || (it as any).src || (it as any).raw, (it as any).alt);
      }
      continue;
    }

    // json string
    if (typeof c === 'string') {
      const parsed = tryParseJson<any>(c);
      if (Array.isArray(parsed)) {
        for (const it of parsed) {
          if (typeof it === 'string') add(it);
          else if (it && typeof it === 'object') add(it.url || it.src || it.raw, it.alt);
        }
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
        for (const it of parsed.items) {
          if (typeof it === 'string') add(it);
          else if (it && typeof it === 'object') add(it.url || it.src || it.raw, it.alt);
        }
      }
    }
  }

  // 3) content_html img src
  const htmlImgs = extractImgSrcListFromHtml(safeStr(news?.content_html));
  for (const u of htmlImgs) add(u);

  // minimum 1 fallback
  if (!gallery.length) {
    gallery.push({
      raw: FallbackCover as any as string,
      thumb: FallbackCover as any as string,
      alt: safeStr(title) || 'image',
    });
  }

  return gallery.slice(0, 12);
}

export interface NewsDetailProps {
  slug: string;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ slug }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_news', locale as any);

  const t = useMemo(
    () => ({
      backToList: ui('ui_news_back_to_list', 'Back to all news'),
      loading: ui('ui_news_loading', 'Loading news...'),
      notFound: ui('ui_news_not_found', 'News not found.'),
      otherTitle: ui('ui_news_other_title', 'Other news'),
      contactTitle: ui('ui_news_sidebar_contact_title', 'Contact Info'),
      shareTitle: ui('ui_news_share_title', 'Share'),
      writeReview: ui('ui_news_write_comment', 'Write a review'),
      galleryTitle: ui('ui_news_gallery_title', 'Gallery'),
    }),
    [ui],
  );

  const isSlugReady = !!safeStr(slug);

  const { data, isLoading, isError } = useGetCustomPageBySlugPublicQuery({ slug, locale } as any, {
    skip: !isSlugReady,
  });

  const news = data as CustomPageDto | undefined;

  const newsId = useMemo(() => safeStr((news as any)?.id), [news]);
  const hasNews = !!news && !!newsId && !isError;

  const title = useMemo(() => safeStr((news as any)?.title), [news]);

  const rawHtml = useMemo(() => {
    const html = safeStr((news as any)?.content_html);
    if (html) return html;

    const c = (news as any)?.content;
    if (c && typeof c === 'object' && typeof (c as any).html === 'string') {
      const h = safeStr((c as any).html);
      if (h) return h;
    }

    const summary = safeStr((news as any)?.summary);
    if (summary) return `<p>${summary}</p>`;

    const txt = excerpt(safeStr((news as any)?.content_text), 1000).trim();
    return txt ? `<p>${txt}</p>` : '';
  }, [news]);

  const contentHtml = useMemo(() => stripPresentationAttrs(rawHtml), [rawHtml]);

  const newsListHref = useMemo(() => withLocale(locale, '/news'), [locale]);

  // -----------------------------
  // Gallery (multi-image)
  // -----------------------------
  const galleryImages = useMemo<LightboxImage[]>(
    () => buildGalleryImages(news as any, title),
    [news, title],
  );

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const safeActiveIdx = useMemo(() => {
    const len = galleryImages.length;
    if (!len) return 0;
    const i = activeIdx % len;
    return i < 0 ? i + len : i;
  }, [activeIdx, galleryImages.length]);

  const activeImage = galleryImages[safeActiveIdx];

  const heroSrc = useMemo(() => {
    const raw = safeStr(activeImage?.raw);
    if (!raw) return '';
    return toCdnSrc(raw, HERO_W, HERO_H, 'fill') || raw;
  }, [activeImage?.raw]);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightboxAt = useCallback((idx: number) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  // -----------------------------------------
  // OTHER NEWS LIST (DB) for sidebar
  // -----------------------------------------
  const { data: otherData } = useListCustomPagesPublicQuery(
    {
      module_key: 'news',
      locale,
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'desc',
      orderDir: 'desc',
      is_published: 1,
    } as any,
    { skip: !isSlugReady },
  );

  const otherNews = useMemo(() => {
    const raw =
      (otherData as any)?.items ??
      (otherData as any)?.data ??
      (otherData as any)?.rows ??
      otherData ??
      [];
    const arr = Array.isArray(raw) ? raw : [];

    return arr
      .map((x: any) => ({
        id: safeStr(x?.id),
        slug: safeStr(x?.slug),
        title: safeStr(x?.title),
      }))
      .filter((x) => x.slug && x.title)
      .filter((x) => x.slug !== safeStr(slug) && x.id !== newsId)
      .slice(0, 8);
  }, [otherData, slug, newsId]);

  // -----------------------------------------
  // RENDER STATES
  // -----------------------------------------
  if (!isSlugReady) {
    return (
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.loading}</p>
              <div className="ens-skel ens-skel--md mt-10" />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.loading}</p>
              <div className="ens-skel ens-skel--md mt-10" />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!hasNews) {
    return (
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.notFound}</p>
              <div className="ens-blog__back mt-10">
                <Link href={newsListHref} className="link-more" aria-label={t.backToList}>
                  ← {t.backToList}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // -----------------------------------------
  // MAIN RENDER
  // -----------------------------------------
  return (
    <>
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            {/* MAIN */}
            <div className="col-xl-8 col-lg-12">
              <div className="technical__main-wrapper mb-60">
                {/* Back */}
                <div className="ens-blog__back mb-35">
                  <Link href={newsListHref} className="link-more" aria-label={t.backToList}>
                    ← {t.backToList}
                  </Link>
                </div>

                {/* HERO (click => modal) */}
                <button
                  type="button"
                  className="ens-gallery__heroBtn"
                  onClick={() => openLightboxAt(safeActiveIdx)}
                  aria-label={t.galleryTitle}
                  title={t.galleryTitle}
                >
                  <div className="technical__thumb mb-20 ens-blog__hero">
                    <Image
                      src={(heroSrc as any) || (FallbackCover as any)}
                      alt={safeStr((news as any)?.featured_image_alt) || title || 'news image'}
                      width={HERO_W}
                      height={HERO_H}
                      priority
                    />
                  </div>
                </button>

                {/* THUMBS under hero */}
                {galleryImages.length > 1 && (
                  <div className="ens-gallery__thumbs" aria-label={t.galleryTitle}>
                    {galleryImages.map((img, i) => {
                      const src = safeStr(img.thumb || img.raw);
                      if (!src) return null;

                      const isActive = i === safeActiveIdx;
                      return (
                        <button
                          key={`${img.raw}-${i}`}
                          type="button"
                          className={`ens-gallery__thumb ${isActive ? 'is-active' : ''}`}
                          onClick={() => setActiveIdx(i)}
                          onDoubleClick={() => openLightboxAt(i)}
                          aria-label={`${t.galleryTitle} ${i + 1}`}
                          title={`${i + 1}/${galleryImages.length}`}
                        >
                          <span className="ens-gallery__thumbImg">
                            <Image
                              src={src}
                              alt={safeStr(img.alt) || title || 'thumbnail'}
                              fill
                              sizes="96px"
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* CONTENT */}
                <div className="blog__content-wrapper">
                  <div className="blog__content-item">
                    <div className="technical__content mb-25">
                      <div className="technical__title">
                        <h3 className="postbox__title">{title || t.notFound}</h3>
                      </div>

                      {safeStr((news as any)?.summary) && (
                        <p className="postbox__lead">{safeStr((news as any)?.summary)}</p>
                      )}
                    </div>

                    {!!contentHtml && (
                      <div className="technical__content">
                        <div
                          className="tp-postbox-details"
                          dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="col-xl-4 col-lg-6">
              <div className="sideber__widget">
                {/* Other news */}
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__category">
                    <div className="sidebar__contact-title mb-35">
                      <h3>{t.otherTitle}</h3>
                    </div>

                    <ul>
                      {otherNews.length > 0 ? (
                        otherNews.map((n) => (
                          <li key={n.slug}>
                            <Link
                              href={withLocale(locale, `/news/${encodeURIComponent(n.slug)}`)}
                              aria-label={n.title}
                            >
                              {n.title}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span>-</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Share */}
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__category">
                    <div className="sidebar__contact-title mb-35">
                      <h3>{t.shareTitle}</h3>
                    </div>

                    <SocialShare
                      title={title}
                      text={safeStr((news as any)?.summary) || title}
                      showLabel={false}
                      showCompanySocials={true}
                    />
                  </div>
                </div>

                {/* Reviews */}
                {!!newsId && (
                  <div className="sideber__widget-item mb-40">
                    <div className="sidebar__contact">
                      <div className="sidebar__contact-title mb-35">
                        <h3>{t.writeReview}</h3>
                      </div>

                      <div className="sidebar__contact-inner">
                        <div className="mb-25">
                          <ReviewList
                            targetType="news"
                            targetId={newsId}
                            locale={locale}
                            showHeader={false}
                            className="news__detail-reviews"
                          />
                        </div>

                        <ReviewForm
                          targetType="news"
                          targetId={newsId}
                          locale={locale}
                          className="news__detail-review-form"
                          toggleLabel={t.writeReview}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ Contact Info Card extracted */}
                <div className="sideber__widget-item mb-40">
                  <InfoContactCard locale={locale} title={t.contactTitle} fallbackLocale="en" />
                </div>

                {/* Sidebar image */}
                <div className="sideber__widget-item">
                  <div className="slideber__thumb w-img">
                    <Image src={SidebarImage} alt="Sidebar" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox modal */}
      <ImageLightboxModal
        open={lightboxOpen}
        images={galleryImages}
        index={safeActiveIdx}
        title={title}
        onClose={closeLightbox}
        onIndexChange={(i) => setActiveIdx(i)}
        showThumbs={true}
      />
    </>
  );
};

export default NewsDetail;
