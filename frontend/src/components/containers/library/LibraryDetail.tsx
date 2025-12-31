// =============================================================
// FILE: src/components/containers/library/LibraryDetail.tsx
// Ensotek – Library Detail (NewsDetail style aligned) [FINAL / SCHEMA-SAFE]
// - Main: Hero + thumbs (multi-image) + content (LEFT)
// - Sidebar: Other documents + Downloads (ONLY if any downloadable file_url exists) + Share + Reviews + Contact + Image (RIGHT)
// - Lightbox: hero/thumb click => modal
// - i18n: useLocaleShort + useUiSection('ui_library', locale as any) + EN fallback only
// - NO inline styles, NO styled-jsx
// - Router-safe: skip queries until slug ready
// - ✅ Uses FIXED types: LibraryDto / LibraryImageDto / LibraryFileDto
// - ✅ Fix: next/image src "[object Object]" crash
// - ✅ PDF preview: if a PDF exists, show iframe preview in hero area
// - ✅ NEW: Other documents list (BlogDetails "Other blogs" pattern)
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

  // ✅ NEW: list other docs (public list)
  // Not: Hook adı projende farklıysa burada sadece ismi düzelt.
  useListLibraryQuery,
} from '@/integrations/rtk/hooks';

import type {
  LibraryDto,
  LibraryImageDto,
  LibraryFileDto,
} from '@/integrations/types/library.types';

// Helpers
import { toCdnSrc } from '@/shared/media';
import { stripHtml } from '@/shared/text';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

// Reviews + Share
import ReviewList from '@/components/common/public/ReviewList';
import ReviewForm from '@/components/common/public/ReviewForm';
import SocialShare from '@/components/common/public/SocialShare';

// Lightbox
import ImageLightboxModal, {
  type LightboxImage,
} from '@/components/common/public/ImageLightboxModal';

// Contact
import InfoContactCard from '@/components/common/public/InfoContactCard';

// PDF Preview (public)
import LibraryPdfPreview from '@/components/containers/library/LibraryPdfPreview';

// Assets
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
  if (typeof v === 'object' && typeof (v as any).src === 'string') {
    return String((v as any).src).trim();
  }
  return '';
}

function isPdfUrl(u: string): boolean {
  const s = safeStr(u).toLowerCase();
  if (!s) return false;
  if (s.includes('application/pdf')) return true;
  return /\.pdf(\?|#|$)/i.test(s);
}

/**
 * Tailwind / inline presentation temizliği:
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

/**
 * Library body:
 * - content yok, summary yok → description HTML kullanıyoruz.
 */
function resolveBodyHtml(description: unknown): string {
  const html = safeStr(description);
  if (!html) return '';
  return stripPresentationAttrs(html);
}

/**
 * Gallery builder:
 * - 1) images[].image_url
 * - 2) parent featured_image / image_url
 * - 3) fallback cover
 */
function buildLibraryGalleryImages(
  images: LibraryImageDto[] | undefined,
  parentHeroRaw: string,
  title: string,
  heroAlt: string,
): LightboxImage[] {
  const unique = new Set<string>();
  const out: LightboxImage[] = [];

  const add = (rawUrl: string, alt?: string | null) => {
    const u = safeStr(rawUrl);
    if (!u) return;
    if (unique.has(u)) return;
    unique.add(u);

    const thumb = toCdnSrc(u, THUMB_W, THUMB_H, 'fill') || u;
    const raw = toCdnSrc(u, 1600, 1200, 'fit') || u;

    out.push({
      raw,
      thumb,
      alt: safeStr(alt) || safeStr(heroAlt) || safeStr(title) || 'image',
    });
  };

  for (const it of images || []) {
    const src = safeStr(it.image_url);
    if (src) add(src, (it as any).alt);
    if (out.length >= 12) break;
  }

  if (!out.length) {
    const p = safeStr(parentHeroRaw);
    if (p) add(p, heroAlt || title);
  }

  if (!out.length) {
    const fallback = normalizeImgSrc(FallbackCover);
    if (fallback) add(fallback, heroAlt || title);
  }

  return out.slice(0, 12);
}

export type LibraryDetailProps = {
  slugOverride?: string;
};

const LibraryDetail: React.FC<LibraryDetailProps> = ({ slugOverride }) => {
  const router = useRouter();
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_library', locale as any);

  // EN fallback only
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
  const listHref = useMemo(() => localizePath(locale, '/library'), [locale]);

  // --------------------
  // Main doc
  // --------------------
  const { data, isLoading, isError } = useGetLibraryBySlugQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  const library = data as LibraryDto | undefined;
  const libraryId = useMemo(() => safeStr(library?.id), [library]);
  const hasLibrary = !!library && !!libraryId && !isError;

  // --------------------
  // Images + Files
  // --------------------
  const { data: imagesData = [] } = useListLibraryImagesQuery(
    { id: libraryId, locale },
    { skip: !libraryId },
  );
  const images = imagesData as LibraryImageDto[];

  const { data: filesData = [] } = useListLibraryFilesQuery(
    { id: libraryId },
    { skip: !libraryId },
  );
  const files = filesData as LibraryFileDto[];

  const downloadableFiles = useMemo(() => {
    const arr = Array.isArray(files) ? files : [];
    return arr
      .map((f) => ({
        id: safeStr((f as any).id),
        name: safeStr((f as any).name),
        href: safeStr((f as any).file_url),
        mime: safeStr((f as any).mime_type),
      }))
      .filter((x) => !!x.href);
  }, [files]);

  const hasDownloads = downloadableFiles.length > 0;

  const pdfUrl = useMemo(() => {
    const arr = downloadableFiles;
    const byMime = arr.find((x) => safeStr(x.mime).toLowerCase() === 'application/pdf');
    if (byMime?.href) return byMime.href;

    const byExt = arr.find((x) => isPdfUrl(x.href));
    return byExt?.href || null;
  }, [downloadableFiles]);

  const hasPdfPreview = !!pdfUrl;

  // --------------------
  // Derived fields
  // --------------------
  const title = useMemo(
    () => safeStr(library?.name) || t('ui_library_untitled', 'Untitled'),
    [library, t],
  );

  const heroAlt = useMemo(() => {
    return (
      safeStr((library as any)?.image_alt) ||
      safeStr((library as any)?.name) ||
      t('ui_library_cover_alt', 'library cover')
    );
  }, [library, t]);

  const parentHeroRaw = useMemo(
    () => safeStr((library as any)?.featured_image) || safeStr((library as any)?.image_url),
    [library],
  );

  const bodyHtml = useMemo(() => resolveBodyHtml((library as any)?.description), [library]);

  const leadText = useMemo(() => {
    const raw = safeStr(bodyHtml);
    if (!raw) return '';
    const s = stripHtml(raw).trim();
    return s ? s.slice(0, 260) : '';
  }, [bodyHtml]);

  // -----------------------------
  // Gallery (multi-image)
  // -----------------------------
  const galleryImages = useMemo<LightboxImage[]>(
    () => buildLibraryGalleryImages(images, parentHeroRaw, title, heroAlt),
    [images, parentHeroRaw, title, heroAlt],
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

  const fallbackHero = useMemo(() => normalizeImgSrc(FallbackCover), []);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openLightboxAt = useCallback((idx: number) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  // =============================================================
  // ✅ OTHER DOCUMENTS (BlogDetails "Other blogs" pattern)
  // =============================================================

  const { data: otherDocsData, isLoading: isOtherLoading } = useListLibraryQuery(
    {
      locale,
      limit: 10,
      offset: 0,
      sort: 'published_at',
      order: 'desc',
      is_published: 1,
    } as any,
    { skip: !isSlugReady },
  );

  const otherDocs = useMemo(() => {
    const raw =
      (otherDocsData as any)?.items ??
      (otherDocsData as any)?.data ??
      (otherDocsData as any)?.rows ??
      otherDocsData ??
      [];

    const arr = Array.isArray(raw) ? raw : [];

    return arr
      .map((x: any) => ({
        id: safeStr(x?.id),
        slug: safeStr(x?.slug),
        name: safeStr(x?.name),
      }))
      .filter((x) => x.slug && x.name)
      .filter((x) => x.slug !== slug && x.id !== libraryId)
      .slice(0, 8);
  }, [otherDocsData, slug, libraryId]);

  // No hardcoded "/library": use current route template
  const makeOtherHref = useCallback(
    (s: string) => ({
      pathname: router.pathname,
      query: { ...router.query, slug: s },
    }),
    [router.pathname, router.query],
  );

  // -----------------------------------------
  // RENDER STATES
  // -----------------------------------------
  if (!isSlugReady) {
    return (
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t('ui_library_detail_loading', 'Loading document...')}</p>
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
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t('ui_library_detail_not_found', 'Document not found')}</p>
              <div className="ens-blog__back mt-10">
                <Link
                  href={listHref}
                  className="link-more"
                  aria-label={t('ui_library_back_to_list', 'Back to library')}
                >
                  ← {t('ui_library_back_to_list', 'Back to library')}
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
                  <Link
                    href={listHref}
                    className="link-more"
                    aria-label={t('ui_library_back_to_list', 'Back to library')}
                  >
                    ← {t('ui_library_back_to_list', 'Back to library')}
                  </Link>
                </div>

                {/* HERO: PDF varsa iframe preview, yoksa image+lightbox */}
                {hasPdfPreview ? (
                  <div className="technical__thumb mb-20 ens-blog__hero">
                    <LibraryPdfPreview pdfUrl={pdfUrl} title={title} height={650} />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="ens-gallery__heroBtn"
                    onClick={() => openLightboxAt(safeActiveIdx)}
                    aria-label={t('ui_library_gallery_title', 'Gallery')}
                    title={t('ui_library_gallery_title', 'Gallery')}
                  >
                    <div className="technical__thumb mb-20 ens-blog__hero">
                      <Image
                        src={heroSrc || parentHeroRaw || fallbackHero}
                        alt={heroAlt || title || 'library image'}
                        width={HERO_W}
                        height={HERO_H}
                        priority
                      />
                    </div>
                  </button>
                )}

                {/* THUMBS */}
                {!hasPdfPreview && galleryImages.length > 1 && (
                  <div
                    className="ens-gallery__thumbs"
                    aria-label={t('ui_library_gallery_title', 'Gallery')}
                  >
                    {galleryImages.map((img, i) => {
                      const src = safeStr(img.thumb || img.raw);
                      if (!src) return null;

                      const isActive = i === safeActiveIdx;

                      return (
                        <button
                          key={`${safeStr(img.raw)}-${i}`}
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
                        <h3 className="postbox__title">{title}</h3>
                      </div>

                      {leadText ? <p className="postbox__lead">{leadText}</p> : null}
                    </div>

                    {!!bodyHtml && (
                      <div className="technical__content">
                        <div
                          className="tp-postbox-details"
                          dangerouslySetInnerHTML={{ __html: bodyHtml }}
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
                {/* ✅ Other documents */}
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__category">
                    <div className="sidebar__contact-title mb-35">
                      <h3>{t('ui_library_other_docs_title', 'Other documents')}</h3>
                    </div>

                    <ul>
                      {isOtherLoading ? (
                        <li>
                          <span>{t('ui_library_other_docs_loading', 'Loading...')}</span>
                        </li>
                      ) : otherDocs.length ? (
                        otherDocs.map((d) => (
                          <li key={d.slug}>
                            <Link href={makeOtherHref(d.slug)} aria-label={d.name}>
                              {d.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span>{t('ui_library_other_docs_empty', 'No other documents')}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Downloads */}
                {hasDownloads && (
                  <div className="sideber__widget-item mb-40">
                    <div className="sidebar__category">
                      <div className="sidebar__contact-title mb-35">
                        <h3>{t('ui_library_files_title', 'Downloads')}</h3>
                      </div>

                      <ul>
                        {downloadableFiles.map((f) => (
                          <li key={f.id || `${f.name}-${f.href}`}>
                            <a
                              href={f.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={f.name}
                            >
                              {f.name || t('ui_library_file_unnamed', 'File')}
                            </a>
                          </li>
                        ))}
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
                      text={leadText || title}
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
