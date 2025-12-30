// =============================================================
// FILE: src/components/containers/library/LibraryDetail.tsx
// Ensotek – Library Detail (NewsDetail pattern aligned) [FINAL]
// - Main: hero + thumbs under hero + content (LEFT)
// - Sidebar: Downloads (only if exists) + Share + Reviews + Contact (RIGHT)
// - Lightbox: hero/thumb click => modal
// - i18n: useLocaleShort + useUiSection('ui_library', locale as any) + EN fallback only
// - NO inline styles, NO styled-jsx
// - Router-safe: skip queries until slug ready
// - ✅ Fix: next/image src "[object Object]" crash (StaticImageData normalization)
// =============================================================

'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  useGetLibraryBySlugQuery,
  useListLibraryImagesQuery,
  useListLibraryFilesQuery,
} from '@/integrations/rtk/hooks';

// Helpers
import { toCdnSrc } from '@/shared/media';
import { stripHtml } from '@/shared/text';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

// Share + Reviews
import SocialShare from '@/components/common/public/SocialShare';
import ReviewList from '@/components/common/public/ReviewList';
import ReviewForm from '@/components/common/public/ReviewForm';

// Lightbox
import ImageLightboxModal, {
  type LightboxImage,
} from '@/components/common/public/ImageLightboxModal';

// Contact
import InfoContactCard from '@/components/common/public/InfoContactCard';

// Assets
import ShapePattern from 'public/img/shape/features-shape.png';
import SidebarImage from 'public/img/others/sidebar.jpg';
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

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q;
  if (Array.isArray(q)) return String(q[0] ?? '');
  return '';
}

/**
 * ✅ next/image src normalize:
 * - string => ok
 * - StaticImageData / {src:string} => .src
 * - other => ''
 */
type NextImageLike = string | StaticImageData | { src?: string } | null | undefined;
function normalizeImgSrc(v: NextImageLike): string {
  if (!v) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'object' && typeof (v as any).src === 'string')
    return String((v as any).src).trim();
  return '';
}

/**
 * localizePath yerine:
 * - locale varsa: "/de/library" "/tr/library"
 * - locale yoksa: "/library"
 */
function withLocale(locale: string, path: string): string {
  const loc = safeStr(locale);
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!loc) return p;
  if (p === `/${loc}` || p.startsWith(`/${loc}/`)) return p;
  return `/${loc}${p}`;
}

/** content: JSON-string {"html": "..."} veya plain HTML */
function resolveContentHtml(raw: unknown): string {
  if (!raw) return '';
  if (typeof raw !== 'string') return '';

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && typeof (parsed as any).html === 'string') {
      return String((parsed as any).html);
    }
  } catch {
    // plain HTML
  }
  return raw;
}

function buildGalleryFromLibraryImages(images: any[], title: string): LightboxImage[] {
  const uniq = new Set<string>();
  const out: LightboxImage[] = [];

  const add = (u: string) => {
    const raw = safeStr(u);
    if (!raw) return;
    if (uniq.has(raw)) return;
    uniq.add(raw);

    const thumb = toCdnSrc(raw, THUMB_W, THUMB_H, 'fill') || raw;
    const large = toCdnSrc(raw, 1600, 1200, 'fit') || raw;

    out.push({
      raw: large,
      thumb,
      alt: safeStr(title) || 'image',
    });
  };

  for (const it of images || []) {
    const src =
      safeStr(it?.webp) || safeStr(it?.url) || safeStr(it?.thumbnail) || safeStr(it?.asset?.url);

    if (src) add(src);
    if (out.length >= 12) break;
  }

  // fallback cover (only if nothing)
  if (!out.length) {
    const fallback = normalizeImgSrc(FallbackCover);
    if (fallback) {
      out.push({
        raw: fallback,
        thumb: fallback,
        alt: safeStr(title) || 'image',
      });
    }
  }

  return out;
}

export type LibraryDetailProps = {
  slugOverride?: string;
};

const LibraryDetail: React.FC<LibraryDetailProps> = ({ slugOverride }) => {
  const router = useRouter();
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_library', locale as any);

  // DB -> EN fallback only
  const t = useCallback(
    (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    },
    [ui],
  );

  const slug = useMemo(() => {
    const s = safeStr(slugOverride) || safeStr(readSlug(router.query.slug));
    return s.trim();
  }, [slugOverride, router.query.slug]);

  const isSlugReady = !!slug;
  const listHref = useMemo(() => withLocale(locale, '/library'), [locale]);

  // --------------------
  // Main doc
  // --------------------
  const {
    data: library,
    isLoading: libraryLoading,
    isError: libraryError,
  } = useGetLibraryBySlugQuery({ slug, locale } as any, { skip: !isSlugReady });

  const libraryId = useMemo(() => safeStr((library as any)?.id), [library]);
  const hasLibrary = !!library && !!libraryId && !libraryError;

  // --------------------
  // Images + Files
  // --------------------
  const { data: images = [] } = useListLibraryImagesQuery({ id: libraryId, locale } as any, {
    skip: !libraryId,
  });

  const { data: files = [], isLoading: filesLoading } = useListLibraryFilesQuery(
    { id: libraryId, locale } as any,
    { skip: !libraryId },
  );

  // ✅ Downloads render gate:
  // - only render if there are files
  // - do NOT render while loading if empty/unknown
  const hasDownloads = useMemo(() => Array.isArray(files) && files.length > 0, [files]);

  // --------------------
  // Derived
  // --------------------
  const title = useMemo(() => {
    return safeStr((library as any)?.title) || t('ui_library_untitled', 'Untitled content');
  }, [library, t]);

  const summaryText = useMemo(() => {
    const s = safeStr((library as any)?.summary);
    return s ? stripHtml(s).slice(0, 260) : '';
  }, [library]);

  const contentHtml = useMemo(() => {
    const raw = resolveContentHtml((library as any)?.content);
    return raw ? raw : '';
  }, [library]);

  const heroAlt = useMemo(() => {
    return safeStr((library as any)?.title) || t('ui_library_cover_alt', 'library cover');
  }, [library, t]);

  // --------------------
  // Gallery (hero + thumbs)
  // --------------------
  const galleryImages = useMemo<LightboxImage[]>(
    () => buildGalleryFromLibraryImages(images as any[], title),
    [images, title],
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
    const raw = normalizeImgSrc(activeImage?.raw as any);
    if (!raw) return '';
    return toCdnSrc(raw, HERO_W, HERO_H, 'fill') || raw;
  }, [activeImage?.raw]);

  const fallbackHero = useMemo(() => normalizeImgSrc(FallbackCover), []);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openLightboxAt = useCallback((idx: number) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  // --------------------
  // Render states
  // --------------------
  const loading = !isSlugReady || libraryLoading;
  

  if (loading) {
    return (
      <section className="features__area p-relative features-bg pt-120 pb-60 cus-faq">
        <div className="features__pattern">
          <Image src={ShapePattern} alt="pattern" loading="lazy" sizes="200px" />
        </div>

        <div className="container">
          <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="200">
            <div className="col-xl-8 col-lg-8 text-center">
              <p>{t('ui_library_detail_loading', 'Loading document...')}</p>
              <div className="ens-skel ens-skel--md mt-10" />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!hasLibrary) {
    return (
      <section className="features__area p-relative features-bg pt-120 pb-60 cus-faq">
        <div className="features__pattern">
          <Image src={ShapePattern} alt="pattern" loading="lazy" sizes="200px" />
        </div>

        <div className="container">
          <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="200">
            <div className="col-xl-8 col-lg-8 text-center">
              <h3 className="mb-3">{t('ui_library_detail_not_found', 'Document not found')}</h3>
              <p className="mb-4">
                {t(
                  'ui_library_detail_not_found_desc',
                  'The requested document could not be found or is not available.',
                )}
              </p>

              <Link
                href={listHref}
                className="solid__btn"
                aria-label={t('ui_library_back_to_list', 'Back to library')}
              >
                {t('ui_library_back_to_list', 'Back to library')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --------------------
  // Main render (NewsDetail-like)
  // --------------------
  return (
    <>
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            {/* MAIN (LEFT) */}
            <div className="col-xl-8 col-lg-12">
              <div className="technical__main-wrapper mb-60">
                {/* Back */}
                <div className="ens-blog__back mb-35">
                  <Link
                    href={listHref}
                    className="link-more"
                    aria-label={t('ui_library_back_to_list', 'Back to library')}
                  >
                    ← {t('ui_library_back_to_list', 'Back to library')}
                  </Link>
                </div>

                {/* HERO (click => lightbox) */}
                <button
                  type="button"
                  className="ens-gallery__heroBtn"
                  onClick={() => openLightboxAt(safeActiveIdx)}
                  aria-label={t('ui_library_gallery_title', 'Gallery')}
                  title={t('ui_library_gallery_title', 'Gallery')}
                >
                  <div className="technical__thumb mb-20 ens-blog__hero">
                    <Image
                      src={(heroSrc as any) || (fallbackHero as any)}
                      alt={heroAlt || 'library image'}
                      width={HERO_W}
                      height={HERO_H}
                      priority
                    />
                  </div>
                </button>

                {/* THUMBS under hero */}
                {galleryImages.length > 1 && (
                  <div
                    className="ens-gallery__thumbs"
                    aria-label={t('ui_library_gallery_title', 'Gallery')}
                  >
                    {galleryImages.map((img, i) => {
                      const src =
                        normalizeImgSrc((img as any)?.thumb) || normalizeImgSrc((img as any)?.raw);

                      if (!src) return null;

                      const isActive = i === safeActiveIdx;

                      return (
                        <button
                          key={`${normalizeImgSrc((img as any)?.raw)}-${i}`}
                          type="button"
                          className={`ens-gallery__thumb ${isActive ? 'is-active' : ''}`}
                          onClick={() => setActiveIdx(i)}
                          onDoubleClick={() => openLightboxAt(i)}
                          aria-label={`${t('ui_library_gallery_title', 'Gallery')} ${i + 1}`}
                          title={`${i + 1}/${galleryImages.length}`}
                        >
                          <span className="ens-gallery__thumbImg">
                            <Image
                              src={src}
                              alt={safeStr((img as any)?.alt) || title || 'thumbnail'}
                              fill
                              sizes="96px"
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* TITLE + SUMMARY */}
                <div className="blog__content-wrapper">
                  <div className="blog__content-item">
                    <div className="technical__content mb-25">
                      <div className="technical__title">
                        <h3 className="postbox__title">{title}</h3>
                      </div>

                      {summaryText ? <p className="postbox__lead">{summaryText}</p> : null}
                    </div>

                    {/* BODY */}
                    {contentHtml ? (
                      <div className="technical__content">
                        <div
                          className="tp-postbox-details"
                          dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR (RIGHT) */}
            <div className="col-xl-4 col-lg-6">
              <div className="sideber__widget">
                {/* ✅ Downloads: only if files exist (no loading placeholder) */}
                {hasDownloads && (
                  <div className="sideber__widget-item mb-40">
                    <div className="sidebar__category">
                      <div className="sidebar__contact-title mb-35">
                        <h3>{t('ui_library_files_title', 'Downloads')}</h3>
                      </div>

                      <ul>
                        {files.map((f: any) => {
                          const href = safeStr(f?.url);
                          const name = safeStr(f?.name) || t('ui_library_file_unnamed', 'File');

                          // If a file has no URL, skip it (otherwise dead list item)
                          if (!href) return null;

                          return (
                            <li key={safeStr(f?.id) || `${name}-${href}`}>
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={name}
                              >
                                {name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Share */}
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__category">
                    <div className="sidebar__contact-title mb-35">
                      <h3>{t('ui_library_share_title', 'Share')}</h3>
                    </div>

                    <SocialShare
                      title={title}
                      text={summaryText || title}
                      showLabel={false}
                      showCompanySocials={true}
                    />
                  </div>
                </div>

                {/* Reviews */}
                {!!libraryId && (
                  <div className="sideber__widget-item mb-40">
                    <div className="sidebar__contact">
                      <div className="sidebar__contact-title mb-35">
                        <h3>{t('ui_library_write_comment', 'Write a review')}</h3>
                      </div>

                      <div className="sidebar__contact-inner">
                        <div className="mb-25">
                          <ReviewList
                            targetType="library"
                            targetId={libraryId}
                            locale={locale}
                            showHeader={false}
                            className="library__detail-reviews"
                          />
                        </div>

                        <ReviewForm
                          targetType="library"
                          targetId={libraryId}
                          locale={locale}
                          className="library__detail-review-form"
                          toggleLabel={t('ui_library_write_comment', 'Write a review')}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="sideber__widget-item mb-40">
                  <InfoContactCard
                    locale={locale}
                    title={t('ui_library_sidebar_contact_title', 'Contact Info')}
                    fallbackLocale="en"
                  />
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

export default LibraryDetail;
