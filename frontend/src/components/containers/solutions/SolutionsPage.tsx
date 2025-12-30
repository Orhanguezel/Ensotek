// =============================================================
// FILE: src/components/containers/solutions/SolutionsPage.tsx
// Ensotek – Solutions Landing/Detail (DB-backed) + Gallery Lightbox + Sidebar
// - Same component for:
//   - /solutions (landing) => primary: first published
//   - /solutions/[slug] (detail) => primary: matching slug (forcedSlug)
// - Mirrors NewsDetail layout:
//   - Hero + thumbs (gallery)
//   - Content (tp-postbox-details)
//   - Sidebar: Other solutions + Share + Reviews + Contact + Image
// - Data: custom_pages(module_key="solutions") public
// - NO styled-jsx / NO inline styles
// =============================================================

'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// Share / Reviews
import SocialShare from '@/components/common/public/SocialShare';
import ReviewList from '@/components/common/public/ReviewList';
import ReviewForm from '@/components/common/public/ReviewForm';

// Lightbox
import ImageLightboxModal, {
  type LightboxImage,
} from '@/components/common/public/ImageLightboxModal';

// Contact card
import InfoContactCard from '@/components/common/public/InfoContactCard';

// Sidebar image
import SidebarImage from 'public/img/others/sidebar.jpg';

// Fallback hero
import FallbackCover from 'public/img/blog/3/1.jpg';

const HERO_W = 1200;
const HERO_H = 700;

const THUMB_W = 220;
const THUMB_H = 140;

const CARD_W = 900;
const CARD_H = 600;

const DETAIL_SLUGS = [
  'industrial-cooling-solutions',
  'hvac-cooling-solutions',
  'process-cooling-solutions',
] as const;

function s(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function tryParseJson<T>(v: unknown): T | null {
  try {
    if (v == null) return null;
    if (typeof v === 'object') return v as T;
    const str = s(v);
    if (!str) return null;
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

/**
 * localizePath yok.
 * - locale varsa: "/de/solutions" "/tr/solutions"
 * - locale yoksa: "/solutions"
 */
function withLocale(locale: string, path: string): string {
  const loc = s(locale);
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
  const src = s(html);
  if (!src) return '';

  const noClass = src.replace(/\sclass="[^"]*"/gi, '');
  const noStyle = noClass.replace(/\sstyle="[^"]*"/gi, '');
  const dropFirstH1 = noStyle.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');

  return dropFirstH1.trim();
}

/** content_html içinden img src yakala (basit) */
function extractImgSrcListFromHtml(html: string): string[] {
  const src = s(html);
  if (!src) return [];

  const out: string[] = [];
  const re = /<img\b[^>]*?\ssrc\s*=\s*["']([^"']+)["'][^>]*>/gi;

  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const u = s(m[1]);
    if (u) out.push(u);
    if (out.length >= 12) break;
  }

  return out;
}

/**
 * custom_pages kaydından gallery images toparla:
 * - featured_image
 * - images (array / json-string)
 * - content_html içindeki img src
 */
function buildGalleryImages(page: any, title: string): LightboxImage[] {
  const unique = new Set<string>();
  const gallery: LightboxImage[] = [];

  const add = (rawUrl: string, alt?: string) => {
    const u = s(rawUrl);
    if (!u) return;
    if (unique.has(u)) return;
    unique.add(u);

    const thumb = toCdnSrc(u, THUMB_W, THUMB_H, 'fill') || u;
    const raw = toCdnSrc(u, 1600, 1200, 'fit') || u;

    gallery.push({
      raw,
      thumb,
      alt: s(alt) || s(title) || 'image',
    });
  };

  // 1) featured
  add(s(page?.featured_image || page?.image_url), s(page?.featured_image_alt));

  // 2) images array / json string
  const imgs = page?.images;
  if (Array.isArray(imgs)) {
    imgs
      .map((x: any) => s(x))
      .filter(Boolean)
      .forEach((u: string) => add(u));
  } else if (typeof imgs === 'string') {
    const parsed = tryParseJson<any>(imgs);
    if (Array.isArray(parsed)) {
      parsed.forEach((it: any) => {
        if (typeof it === 'string') add(it);
        else if (it && typeof it === 'object') add(it.url || it.src || it.raw, it.alt);
      });
    }
  }

  // 3) content_html img src
  const htmlImgs = extractImgSrcListFromHtml(s(page?.content_html));
  htmlImgs.forEach((u) => add(u));

  // minimum 1 fallback
  if (!gallery.length) {
    gallery.push({
      raw: FallbackCover as any as string,
      thumb: FallbackCover as any as string,
      alt: s(title) || 'image',
    });
  }

  return gallery.slice(0, 12);
}

/**
 * primary: first published (created_at asc)
 */
function pickLandingPrimary(items: CustomPageDto[] | undefined | null): CustomPageDto | null {
  const list = (items ?? []) as any[];
  const published = list.filter((p) => !!p?.is_published);
  return (published[0] as any) ?? null;
}

/**
 * primary: by slug (detail page)
 */
function pickBySlug(items: CustomPageDto[] | undefined | null, slug: string): CustomPageDto | null {
  const target = s(slug).toLowerCase();
  if (!target) return null;

  const list = (items ?? []) as any[];
  const hit = list.find((p) => s(p?.slug).toLowerCase() === target);
  return (hit as any) ?? null;
}

/** DTO: content_html fallback to content.html, summary, content_text */
function getRawHtml(p: any): string {
  const fromHtml = s(p?.content_html);
  if (fromHtml) return fromHtml;

  const c = p?.content;
  if (c && typeof c === 'object' && typeof c.html === 'string') {
    const h = s(c.html);
    if (h) return h;
  }

  const sum = s(p?.summary);
  if (sum) return `<p>${sum}</p>`;

  const txt = excerpt(s(p?.content_text), 1200).trim();
  return txt ? `<p>${txt}</p>` : '';
}

type Mini = { id: string; slug: string; title: string; featured_image?: string };

export type SolutionsPageProps = {
  /** /solutions/[slug] sayfası için: slug gelince component “detail primary” render eder */
  forcedSlug?: string;
};

const SolutionsPage: React.FC<SolutionsPageProps> = ({ forcedSlug }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_solutions', locale as any);

  const t = useMemo(
    () => ({
      backToList: ui('ui_solutions_back_to_list', 'Back to solutions'),
      loading: ui('ui_solutions_loading', 'Loading solutions...'),
      notFound: ui('ui_solutions_not_found', 'Solutions not found.'),
      otherTitle: ui('ui_solutions_other_title', 'Other solutions'),
      contactTitle: ui('ui_solutions_sidebar_contact_title', 'Contact Info'),
      shareTitle: ui('ui_solutions_share_title', 'Share'),
      writeReview: ui('ui_solutions_write_comment', 'Write a review'),
      galleryTitle: ui('ui_solutions_gallery_title', 'Gallery'),
      kicker: ui('ui_solutions_kicker', 'COOLING TOWER SOLUTIONS') || 'COOLING TOWER SOLUTIONS',
      ctaOffer: ui('ui_solutions_cta_offer', 'Get a Quote') || 'Get a Quote',
      ctaServices: ui('ui_solutions_cta_services', 'Explore Services') || 'Explore Services',
      cardMore: ui('ui_solutions_card_more', 'View Details') || 'View Details',
      empty:
        ui('ui_solutions_empty', 'Solutions content will be available soon.') ||
        'Solutions content will be available soon.',
    }),
    [ui],
  );

  // Main module list (landing + detail pages)
  const { data, isLoading, isError } = useListCustomPagesPublicQuery({
    module_key: 'solutions',
    locale,
    limit: 50,
    offset: 0,
    sort: 'created_at',
    orderDir: 'asc',
    is_published: 1,
  } as any);

  const items = useMemo<CustomPageDto[]>(() => ((data as any)?.items ?? []) as any, [data]);

  // ✅ primary selection: slug => match; otherwise landing
  const primary = useMemo(() => {
    const bySlug = pickBySlug(items, s(forcedSlug));
    if (bySlug && (bySlug as any)?.is_published) return bySlug;

    // slug yoksa veya bulunamazsa landing primary
    return pickLandingPrimary(items);
  }, [items, forcedSlug]);

  const pageId = useMemo(() => s((primary as any)?.id), [primary]);
  const hasPage = !!primary && !!pageId && !isError;

  const isDetailMode = !!s(forcedSlug);

  const title = useMemo(() => {
    // Detail page: başlık kaynaksal olarak DB title olmalı
    if (isDetailMode) {
      const fromPage = s((primary as any)?.title);
      return fromPage || 'Solution';
    }

    // Landing: UI -> page title -> fallback
    const key = 'ui_solutions_page_h1';
    const v = s(ui(key, ''));
    if (isValidUiText(v, key)) return v;

    const fromPage = s((primary as any)?.title);
    if (fromPage) return fromPage;

    return 'Solutions';
  }, [ui, primary, isDetailMode]);

  const subtitle = useMemo(() => {
    // Detail page: summary öncelikli
    if (isDetailMode) {
      return s((primary as any)?.summary) || '';
    }

    // Landing: UI -> summary -> fallback
    const key = 'ui_solutions_page_lead';
    const v = s(ui(key, ''));
    if (isValidUiText(v, key)) return v;

    const fromSummary = s((primary as any)?.summary);
    if (fromSummary) return fromSummary;

    return (
      s(ui('ui_solutions_page_lead_fallback', 'Cooling tower solutions tailored to your needs.')) ||
      'Cooling tower solutions tailored to your needs.'
    );
  }, [ui, primary, isDetailMode]);

  const rawHtml = useMemo(() => getRawHtml(primary as any), [primary]);
  const contentHtml = useMemo(() => stripPresentationAttrs(rawHtml), [rawHtml]);

  // Gallery for primary
  const galleryImages = useMemo<LightboxImage[]>(
    () => buildGalleryImages(primary as any, title),
    [primary, title],
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
    const raw = s(activeImage?.raw);
    if (!raw) return '';
    return toCdnSrc(raw, HERO_W, HERO_H, 'fill') || raw;
  }, [activeImage?.raw]);

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightboxAt = useCallback((idx: number) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  // DETAIL PAGES (sidebar list + cards)
  const detailPages = useMemo<Mini[]>(() => {
    const mapped = (items ?? [])
      .map((x: any) => ({
        id: s(x?.id),
        slug: s(x?.slug),
        title: s(x?.title),
        featured_image: s(x?.featured_image || x?.image_url),
      }))
      .filter((x) => x.slug && x.title);

    const bySlug = new Map<string, Mini>();
    mapped.forEach((m) => bySlug.set(m.slug, m));

    return DETAIL_SLUGS.map((sl) => bySlug.get(sl))
      .filter(Boolean)
      .map((x) => x as Mini);
  }, [items]);

  const solutionsListHref = useMemo(() => withLocale(locale, '/solutions'), [locale]);

  const cards = useMemo(() => {
    const imgFallbacks = [
      s(galleryImages[0]?.raw) || s((primary as any)?.featured_image) || '',
      s(galleryImages[1]?.raw) || s((primary as any)?.featured_image) || '',
      s(galleryImages[2]?.raw) || s((primary as any)?.featured_image) || '',
    ];

    const uiTitle = (k: string, fb: string) => s(ui(k, fb)) || fb;
    const uiDesc = (k: string, fb: string) => s(ui(k, fb)) || fb;

    const fallback = [
      {
        slug: DETAIL_SLUGS[0],
        title: uiTitle('ui_solutions_card_1_title', 'Industrial Cooling Solutions'),
        desc: uiDesc(
          'ui_solutions_card_1_desc',
          'High-efficiency tower solutions for plants, power generation and demanding environments.',
        ),
        img: imgFallbacks[0],
      },
      {
        slug: DETAIL_SLUGS[1],
        title: uiTitle('ui_solutions_card_2_title', 'HVAC Cooling Solutions'),
        desc: uiDesc(
          'ui_solutions_card_2_desc',
          'Stable approach temperature and energy optimization for commercial HVAC systems.',
        ),
        img: imgFallbacks[1],
      },
      {
        slug: DETAIL_SLUGS[2],
        title: uiTitle('ui_solutions_card_3_title', 'Process Cooling Solutions'),
        desc: uiDesc(
          'ui_solutions_card_3_desc',
          'Open/closed circuit selection and auxiliary components for process-critical water quality.',
        ),
        img: imgFallbacks[2],
      },
    ];

    const bySlug = new Map(detailPages.map((d) => [d.slug, d] as const));

    return fallback.map((c) => {
      const db = bySlug.get(c.slug);
      const img = s(db?.featured_image) || c.img;
      return {
        key: c.slug,
        title: s(db?.title) || c.title,
        desc: c.desc,
        href: `/solutions/${c.slug}`,
        img,
      };
    });
  }, [ui, detailPages, galleryImages, primary]);

  // RENDER STATES
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

  if (!hasPage) {
    return (
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.notFound}</p>
              <div className="ens-blog__back mt-10">
                <Link href={solutionsListHref} className="link-more" aria-label={t.backToList}>
                  ← {t.backToList}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          {/* Page header */}
          <div className="row justify-content-center">
            <div className="col-xl-11">
              <div className="section__title-wrapper text-center mb-70">
                <div className="section__subtitle-3">
                  <span>{t.kicker}</span>
                </div>

                <div className="section__title-3">{title}</div>
                {subtitle ? <p className="mt-20">{subtitle}</p> : null}
              </div>
            </div>
          </div>

          <div className="row" data-aos="fade-up" data-aos-delay="300">
            {/* MAIN */}
            <div className="col-xl-8 col-lg-12">
              <div className="technical__main-wrapper mb-60">
                {/* HERO */}
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
                      alt={s((primary as any)?.featured_image_alt) || title || 'solutions image'}
                      width={HERO_W}
                      height={HERO_H}
                      priority
                    />
                  </div>
                </button>

                {/* THUMBS */}
                {galleryImages.length > 1 && (
                  <div className="ens-gallery__thumbs" aria-label={t.galleryTitle}>
                    {galleryImages.map((img, i) => {
                      const src = s(img.thumb || img.raw);
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
                              alt={s(img.alt) || title || 'thumbnail'}
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
                        <h3 className="postbox__title">{title}</h3>
                      </div>

                      {s((primary as any)?.summary) && (
                        <p className="postbox__lead">{s((primary as any)?.summary)}</p>
                      )}
                    </div>

                    {contentHtml ? (
                      <div className="technical__content">
                        <div
                          className="tp-postbox-details"
                          dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                      </div>
                    ) : (
                      <div className="technical__content">
                        <p>{t.empty}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA row: landing’de anlamlı; detail’de de kalabilir (istersen conditional yaparsın) */}
                <div className="ens-solutions__cta mt-30">
                  <div className="row">
                    <div className="col-md-6 mb-15">
                      <div className="development__btn">
                        <Link href={withLocale(locale, '/offer')}>{t.ctaOffer}</Link>
                      </div>
                    </div>
                    <div className="col-md-6 mb-15">
                      <div className="development__btn">
                        <Link href={withLocale(locale, '/service')}>{t.ctaServices}</Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cards */}
                <div className="row mt-40" data-aos="fade-up" data-aos-delay="350">
                  {cards.map((c) => {
                    const img = c.img ? toCdnSrc(c.img, CARD_W, CARD_H, 'fill') || c.img : '';
                    return (
                      <div key={c.key} className="col-xl-4 col-lg-4 col-md-6">
                        <div className="tp-service-item mb-30">
                          {img ? (
                            <div className="tp-service-thumb w-img">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt={c.title} />
                            </div>
                          ) : null}

                          <div className="tp-service-content">
                            <h3 className="tp-service-title">
                              <Link href={withLocale(locale, c.href)}>{c.title}</Link>
                            </h3>

                            <p>{c.desc}</p>

                            <div className="tp-service-btn">
                              <Link href={withLocale(locale, c.href)}>{t.cardMore}</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detail modunda listeye dönüş linki (isteğe bağlı ama UX iyi) */}
                {isDetailMode && (
                  <div className="ens-blog__back mt-30">
                    <Link href={solutionsListHref} className="link-more" aria-label={t.backToList}>
                      ← {t.backToList}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="col-xl-4 col-lg-6">
              <div className="sideber__widget">
                {/* Other solutions */}
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__category">
                    <div className="sidebar__contact-title mb-35">
                      <h3>{t.otherTitle}</h3>
                    </div>

                    <ul>
                      {detailPages.length > 0 ? (
                        detailPages.map((n) => (
                          <li key={n.slug}>
                            <Link
                              href={withLocale(locale, `/solutions/${encodeURIComponent(n.slug)}`)}
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
                      text={s((primary as any)?.summary) || title}
                      showLabel={false}
                      showCompanySocials={true}
                    />
                  </div>
                </div>

                {/* Reviews */}
                {!!pageId && (
                  <div className="sideber__widget-item mb-40">
                    <div className="sidebar__contact">
                      <div className="sidebar__contact-title mb-35">
                        <h3>{t.writeReview}</h3>
                      </div>

                      <div className="sidebar__contact-inner">
                        <div className="mb-25">
                          <ReviewList
                            targetType="custom_page"
                            targetId={pageId}
                            locale={locale}
                            showHeader={false}
                            className="solutions__detail-reviews"
                          />
                        </div>

                        <ReviewForm
                          targetType="custom_page"
                          targetId={pageId}
                          locale={locale}
                          className="solutions__detail-review-form"
                          toggleLabel={t.writeReview}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="sideber__widget-item mb-40">
                  <InfoContactCard locale={locale} title={t.contactTitle} fallbackLocale="de" />
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

export default SolutionsPage;
