// =============================================================
// FILE: src/components/containers/product/ProductDetail.tsx
// FINAL — NewsDetail pattern applied + FIXES (PATCHED)
// - ✅ NO inline styles
// - ✅ Hero + thumbs under hero
// - ✅ Click hero/thumb => opens ImageLightboxModal
// - ✅ Sidebar pattern: Other items / Share / Reviews / Contact / Sidebar image
// - ✅ Works for BOTH: /product/[slug] and /sparepart/[slug] (itemType auto)
// - ✅ Locale-safe: useLocaleShort + useUiSection(sectionKey, locale as any)
// - ✅ FIX: Specs & FAQs stacked
// - ✅ FIX: Tags style (chips + wrap) without bootstrap
// - ✅ FIX: Tags parsing supports array OR json-string OR hash-delimited OR plain string
// - ✅ FIX: Reviews block rendered + reviews variable used (no lint error)
// - ✅ FIX: Request quote click scrolls + focuses Offer form
// - ✅ FIX (CRITICAL): remove withLocale() + use localizePath everywhere (single routing source)
// - ✅ FIX (CRITICAL): isSlugReady uses router.isReady to avoid noise/duplicate calls
// - ✅ FIX (CRITICAL): listProducts params aligned (is_active instead of only_active; removed orderDir)
// =============================================================

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

// RTK
import {
  useGetProductBySlugQuery,
  useListProductFaqsQuery,
  useListProductSpecsQuery,
  useListProductReviewsQuery,
  useListProductsQuery,
} from '@/integrations/rtk/hooks';

import type {
  ProductFaqDto,
  ProductSpecDto,
  ProductReviewDto,
  ProductSpecifications,
} from '@/integrations/types';

// Helpers
import { toCdnSrc } from '@/shared/media';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

// Blocks
import ProductSpecsBlock, {
  type ProductSpecEntry,
} from '@/components/containers/product/ProductSpecsBlock';
import ProductFaqBlock from '@/components/containers/product/ProductFaqBlock';
import ProductReviewsBlock from '@/components/containers/product/ProductReviewsBlock';

// Share / Reviews / Contact (sidebar)
import SocialShare from '@/components/common/public/SocialShare';
import ReviewList from '@/components/common/public/ReviewList';
import ReviewForm from '@/components/common/public/ReviewForm';
import InfoContactCard from '@/components/common/public/InfoContactCard';

// Lightbox
import ImageLightboxModal, {
  type LightboxImage,
} from '@/components/common/public/ImageLightboxModal';

// Offer
import OfferSection from '@/components/containers/offer/OfferSection';

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
 * Product kaydından “gallery images” toparla:
 * - image_url
 * - images (array) veya json-string
 */
function buildProductGalleryImages(product: any, title: string): LightboxImage[] {
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

  // 1) main
  add(safeStr(product?.image_url), safeStr(product?.alt));

  // 2) images candidates (array or json-string)
  const candidates = [product?.images, product?.images_json, product?.gallery, product?.media];

  for (const c of candidates) {
    if (!c) continue;

    if (Array.isArray(c)) {
      for (const it of c) {
        if (typeof it === 'string') add(it);
        else if (it && typeof it === 'object') {
          add((it as any).url || (it as any).src || (it as any).raw, (it as any).alt);
        }
      }
      continue;
    }

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

  // minimum 1 fallback
  if (!gallery.length) {
    const fb = FallbackCover as any as string;
    gallery.push({
      raw: fb,
      thumb: fb,
      alt: safeStr(title) || 'image',
    });
  }

  return gallery.slice(0, 12);
}

/**
 * Tags normalize:
 * - array
 * - json-string array
 * - hash-delimited string "#a#b#c"
 * - plain string ("a b, c; d")
 */
function normalizeTags(raw: unknown): string[] {
  const clean = (x: unknown) => safeStr(x).replace(/^#+/, '').trim();

  // 1) Array
  if (Array.isArray(raw)) {
    return raw.map(clean).filter(Boolean);
  }

  const s0 = safeStr(raw);
  if (!s0) return [];

  // 2) JSON array string
  const parsed = tryParseJson<any>(s0);
  if (Array.isArray(parsed)) {
    return parsed.map(clean).filter(Boolean);
  }

  // 3) Hash-delimited: "#a#b#c" veya "a#b#c"
  if (s0.includes('#')) {
    return s0
      .split('#')
      .map((x) => clean(x))
      .filter(Boolean);
  }

  // 4) comma/semicolon/whitespace split
  return s0
    .replace(/[,;]+/g, ' ')
    .split(/\s+/)
    .map((x) => clean(x))
    .filter(Boolean);
}

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  // ✅ Route'a göre tip tespiti (product vs sparepart)
  const itemType = useMemo<'product' | 'sparepart'>(() => {
    const p = safeStr(router.pathname);
    const a = safeStr(router.asPath);
    if (p.startsWith('/sparepart') || a.startsWith('/sparepart')) return 'sparepart';
    return 'product';
  }, [router.pathname, router.asPath]);

  const basePath = itemType === 'sparepart' ? '/sparepart' : '/product';
  const uiSectionKey = itemType === 'sparepart' ? 'ui_spareparts' : 'ui_products';

  const { ui } = useUiSection(uiSectionKey as any, locale as any);

  const t = useMemo(
    () => ({
      backToList: ui(
        itemType === 'sparepart' ? 'ui_spareparts_back_to_list' : 'ui_products_back_to_list',
        itemType === 'sparepart' ? 'Back to all spare parts' : 'Back to all products',
      ),
      loading: ui(
        itemType === 'sparepart' ? 'ui_spareparts_loading' : 'ui_products_loading',
        itemType === 'sparepart' ? 'Loading spare part...' : 'Loading product...',
      ),
      notFound: ui(
        itemType === 'sparepart' ? 'ui_spareparts_not_found' : 'ui_products_not_found',
        itemType === 'sparepart' ? 'Spare part not found.' : 'Product not found.',
      ),
      specsTitle: ui(
        itemType === 'sparepart' ? 'ui_spareparts_specs_title' : 'ui_products_specs_title',
        'Technical Specifications',
      ),
      tagsTitle: ui(
        itemType === 'sparepart' ? 'ui_spareparts_tags_title' : 'ui_products_tags_title',
        'Tags',
      ),
      faqsTitle: ui(
        itemType === 'sparepart' ? 'ui_spareparts_faqs_title' : 'ui_products_faqs_title',
        'Frequently Asked Questions',
      ),
      noFaqs: ui(
        itemType === 'sparepart' ? 'ui_spareparts_faqs_empty' : 'ui_products_faqs_empty',
        'There are no FAQs for this item yet.',
      ),
      reviewsTitle: ui(
        itemType === 'sparepart' ? 'ui_spareparts_reviews_title' : 'ui_products_reviews_title',
        'Customer Reviews',
      ),
      shareTitle: ui(
        itemType === 'sparepart' ? 'ui_spareparts_share_title' : 'ui_products_share_title',
        'Share',
      ),
      writeReview: ui(
        itemType === 'sparepart' ? 'ui_spareparts_write_comment' : 'ui_products_write_comment',
        'Write a review',
      ),
      contactTitle: ui(
        itemType === 'sparepart'
          ? 'ui_spareparts_sidebar_contact_title'
          : 'ui_products_sidebar_contact_title',
        'Contact Info',
      ),
      otherTitle: ui(
        itemType === 'sparepart' ? 'ui_spareparts_other_title' : 'ui_products_other_title',
        itemType === 'sparepart' ? 'Other spare parts' : 'Other products',
      ),
      requestQuote: ui(
        itemType === 'sparepart' ? 'ui_spareparts_request_quote' : 'ui_products_request_quote',
        'Request a quote',
      ),
      galleryTitle: ui(
        itemType === 'sparepart' ? 'ui_spareparts_gallery_title' : 'ui_products_gallery_title',
        'Gallery',
      ),
    }),
    [ui, itemType],
  );

  const slugParam = router.query.slug;
  const slug = useMemo(
    () => safeStr(Array.isArray(slugParam) ? slugParam[0] : slugParam),
    [slugParam],
  );

  // ✅ CRITICAL: router.isReady gate (avoid noise calls)
  const isSlugReady = router.isReady && !!safeStr(slug);

  // ✅ CRITICAL: use localizePath (single source of truth)
  const listHref = useMemo(() => localizePath(locale as any, basePath), [locale, basePath]);

  // ✅ PRODUCT/SPAREPART (locale short)
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductBySlugQuery({ slug, locale, item_type: itemType } as any, {
    skip: !isSlugReady,
  });

  const productId = useMemo(() => safeStr((product as any)?.id), [product]);
  const hasProduct = !!product && !!productId && !isProductError;

  const title = useMemo(() => safeStr((product as any)?.title), [product]);
  const description = useMemo(() => safeStr((product as any)?.description), [product]);

  // -----------------------------
  // Gallery (multi-image)
  // -----------------------------
  const galleryImages = useMemo<LightboxImage[]>(
    () => buildProductGalleryImages(product as any, title),
    [product, title],
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

  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  const openLightboxAt = useCallback((idx: number) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  // -----------------------------
  // Tags
  // -----------------------------
  const tags = useMemo(() => normalizeTags((product as any)?.tags), [product]);

  // ✅ FAQ (align params: use only_active if your backend expects it; keep as-is if currently required)
  const { data: faqsData, isLoading: isFaqsLoading } = useListProductFaqsQuery(
    { product_id: productId, only_active: 1, locale, item_type: itemType } as any,
    { skip: !productId },
  );
  const faqs: ProductFaqDto[] = useMemo(() => (faqsData ?? []) as any, [faqsData]);

  // ✅ SPECS
  const { data: specsData, isLoading: isSpecsLoading } = useListProductSpecsQuery(
    { product_id: productId, locale, item_type: itemType } as any,
    { skip: !productId },
  );

  const specsEntries: ProductSpecEntry[] = useMemo(() => {
    const entries: ProductSpecEntry[] = [];
    const specsList: ProductSpecDto[] = (specsData ?? []) as any;

    if (specsList.length) {
      specsList
        .slice()
        .sort((a, b) => (a.order_num ?? 0) - (b.order_num ?? 0))
        .forEach((s) => entries.push({ key: s.id, label: s.name, value: s.value }));
    }

    // fallback (EN labels)
    if (!entries.length && (product as any)?.specifications) {
      const labels: Record<string, string> = {
        dimensions: 'Dimensions',
        weight: 'Weight',
        thickness: 'Thickness',
        surfaceFinish: 'Surface finish',
        warranty: 'Warranty',
        installationTime: 'Installation time',
      };

      Object.entries((product as any).specifications as ProductSpecifications)
        .filter(([, value]) => !!value)
        .forEach(([key, value]) => {
          entries.push({ key, label: labels[key] ?? key, value: String(value) });
        });
    }

    return entries;
  }, [specsData, product]);

  // ✅ REVIEWS
  const { data: reviewsRaw, isLoading: isReviewsLoading } = useListProductReviewsQuery(
    {
      product_id: productId,
      only_active: 1,
      limit: 10,
      offset: 0,
      locale,
      item_type: itemType,
    } as any,
    { skip: !productId },
  );

  const reviews: ProductReviewDto[] = useMemo(() => (reviewsRaw ?? []) as any, [reviewsRaw]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    let sum = 0;
    let count = 0;
    for (const r of reviews) {
      const n = Number((r as any)?.rating ?? 0);
      if (!Number.isFinite(n) || n <= 0) continue;
      sum += n;
      count += 1;
    }
    return count ? sum / count : null;
  }, [reviews]);

  // -----------------------------
  // OTHER ITEMS (sidebar list)
  // -----------------------------
  // ✅ CRITICAL: align with ProductListQueryParams (is_active; remove orderDir/only_active)
  const { data: otherData } = useListProductsQuery(
    {
      locale,
      item_type: itemType,
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'desc',
      is_active: 1,
    } as any,
    { skip: !isSlugReady },
  );

  const otherItems = useMemo(() => {
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
      .filter((x) => x.slug !== safeStr(slug) && x.id !== productId)
      .slice(0, 8);
  }, [otherData, slug, productId]);

  // ✅ Offer open state + target ref (scroll/focus)
  const [offerOpen, setOfferOpen] = useState<boolean>(false);
  const offerRef = useRef<HTMLDivElement | null>(null);

  const focusOfferForm = useCallback(() => {
    const node = offerRef.current;
    if (!node) return;

    node.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const focusable = node.querySelector<HTMLElement>(
      'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    window.setTimeout(() => {
      focusable?.focus();
    }, 150);
  }, []);

  useEffect(() => {
    if (!offerOpen) return;
    window.setTimeout(() => focusOfferForm(), 0);
  }, [offerOpen, focusOfferForm]);

  const handleRequestQuote = useCallback(() => {
    setOfferOpen(true);

    if (offerOpen) {
      window.setTimeout(() => focusOfferForm(), 0);
    }
  }, [offerOpen, focusOfferForm]);

  // ✅ show skeleton only while loading; avoid “infinite skeleton” on 404
  const showSkeleton = !isSlugReady || isProductLoading;

  const hasSpecs = specsEntries.length > 0;
  const hasFaqs = faqs.length > 0;

  const showSpecsBlock = isSpecsLoading || hasSpecs;
  const showFaqsBlock = isFaqsLoading || hasFaqs;

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

  if (showSkeleton) {
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

  if (!hasProduct) {
    return (
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.notFound}</p>
              <div className="ens-blog__back mt-10">
                <Link href={listHref} className="link-more" aria-label={t.backToList}>
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
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            {/* MAIN */}
            <div className="col-xl-8 col-lg-12">
              <div className="technical__main-wrapper mb-60">
                {/* Back */}
                <div className="ens-blog__back mb-35">
                  <Link href={listHref} className="link-more" aria-label={t.backToList}>
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
                      alt={safeStr((product as any)?.alt) || title || 'product image'}
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

                      {description && <p className="postbox__lead">{description}</p>}

                      {/* CTA (Offer) */}
                      <div className="product__detail-cta mt-15">
                        <button
                          type="button"
                          className="solid__btn"
                          onClick={handleRequestQuote}
                          aria-label={t.requestQuote}
                        >
                          {t.requestQuote}
                        </button>
                      </div>
                    </div>

                    {/* TAGS (chips + wrap) */}
                    {!!tags.length && (
                      <div className="technical__content mb-25">
                        <div className="sidebar__contact-title mb-15">
                          <h3>{t.tagsTitle}</h3>
                        </div>

                        <div className="ens-tags" aria-label={t.tagsTitle}>
                          {tags.map((tg) => (
                            <span key={tg} className="ens-tag">
                              #{tg}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ✅ SPECS + FAQ — STACKED */}
                    {(showSpecsBlock || showFaqsBlock) && (
                      <div className="row mt-10">
                        {showSpecsBlock && (
                          <div className="col-12 mb-30">
                            <ProductSpecsBlock
                              title={t.specsTitle}
                              entries={specsEntries}
                              isLoading={isSpecsLoading}
                            />
                          </div>
                        )}

                        {showFaqsBlock && (
                          <div className="col-12 mb-30">
                            <ProductFaqBlock
                              title={t.faqsTitle}
                              faqs={faqs}
                              isLoading={isFaqsLoading}
                              emptyText={t.noFaqs}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* ✅ REVIEWS SLIDER BLOCK */}
                    <div className="technical__content mt-20">
                      <ProductReviewsBlock
                        title={t.reviewsTitle}
                        reviews={reviews}
                        averageRating={averageRating}
                        isLoading={isReviewsLoading}
                        emptyText=""
                        locale={locale}
                        uiSectionKey={uiSectionKey as any}
                      />
                    </div>

                    {/* OFFER (scroll target) */}
                    {offerOpen && !!productId && (
                      <div className="technical__content mt-20" ref={offerRef} id="offer-form">
                        <OfferSection
                          productId={productId}
                          productName={title || safeStr((product as any)?.slug) || ''}
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
                {/* Other items */}
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__category">
                    <div className="sidebar__contact-title mb-35">
                      <h3>{t.otherTitle}</h3>
                    </div>

                    <ul>
                      {otherItems.length > 0 ? (
                        otherItems.map((n) => (
                          <li key={n.slug}>
                            <Link
                              href={localizePath(
                                locale as any,
                                `${basePath}/${encodeURIComponent(n.slug)}`,
                              )}
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
                      text={description || title}
                      showLabel={false}
                      showCompanySocials={true}
                    />
                  </div>
                </div>

                {/* Reviews (Write review) */}
                {!!productId && (
                  <div className="sideber__widget-item mb-40">
                    <div className="sidebar__contact">
                      <div className="sidebar__contact-title mb-35">
                        <h3>{t.writeReview}</h3>
                      </div>

                      <div className="sidebar__contact-inner">
                        <div className="mb-25">
                          <ReviewList
                            targetType={itemType}
                            targetId={productId}
                            locale={locale}
                            showHeader={false}
                            className="product__detail-reviews"
                          />
                        </div>

                        <ReviewForm
                          targetType={itemType}
                          targetId={productId}
                          locale={locale}
                          className="product__detail-review-form"
                          toggleLabel={t.writeReview}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Info */}
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
        title={safeStr(title)}
        onClose={closeLightbox}
        onIndexChange={(i: number) => setActiveIdx(i)}
        showThumbs={true}
      />
    </>
  );
};

export default ProductDetail;
