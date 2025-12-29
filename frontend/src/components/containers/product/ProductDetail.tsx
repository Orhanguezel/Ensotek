'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import {
  useGetProductBySlugQuery,
  useListProductFaqsQuery,
  useListProductSpecsQuery,
  useListProductReviewsQuery,
} from '@/integrations/rtk/hooks';

import type {
  ProductFaqDto,
  ProductSpecDto,
  ProductReviewDto,
  ProductSpecifications,
} from '@/integrations/types/product.types';

import { toCdnSrc } from '@/shared/media';

// ✅ Pattern: useLocaleShort + useUiSection(sectionKey, locale as any)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import ProductSpecsBlock, {
  type ProductSpecEntry,
} from '@/components/containers/product/ProductSpecsBlock';
import ProductFaqBlock from '@/components/containers/product/ProductFaqBlock';
import ProductReviewsBlock from '@/components/containers/product/ProductReviewsBlock';

import  OfferSection  from '@/components/containers/offer/OfferSection';

import FallbackCover from 'public/img/blog/3/1.jpg';

const HERO_W = 960;
const HERO_H = 540;

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

const ProductDetail: React.FC = () => {
  const router = useRouter();

  // ✅ API + UI için kısa locale (tek kaynak)
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

  // ✅ Static strings: DB -> fallback EN only
  const backToListText = ui(
    itemType === 'sparepart' ? 'ui_spareparts_back_to_list' : 'ui_products_back_to_list',
    itemType === 'sparepart' ? 'Back to all spare parts' : 'Back to all products',
  );

  const loadingText = ui(
    itemType === 'sparepart' ? 'ui_spareparts_loading' : 'ui_products_loading',
    itemType === 'sparepart' ? 'Loading spare part...' : 'Loading product...',
  );

  const notFoundText = ui(
    itemType === 'sparepart' ? 'ui_spareparts_not_found' : 'ui_products_not_found',
    itemType === 'sparepart' ? 'Spare part not found.' : 'Product not found.',
  );

  const specsTitle = ui(
    itemType === 'sparepart' ? 'ui_spareparts_specs_title' : 'ui_products_specs_title',
    'Technical Specifications',
  );

  const tagsTitle = ui(
    itemType === 'sparepart' ? 'ui_spareparts_tags_title' : 'ui_products_tags_title',
    'Tags',
  );

  const faqsTitle = ui(
    itemType === 'sparepart' ? 'ui_spareparts_faqs_title' : 'ui_products_faqs_title',
    'Frequently Asked Questions',
  );

  const reviewsTitle = ui(
    itemType === 'sparepart' ? 'ui_spareparts_reviews_title' : 'ui_products_reviews_title',
    'Customer Reviews',
  );

  const noFaqsText = ui(
    itemType === 'sparepart' ? 'ui_spareparts_faqs_empty' : 'ui_products_faqs_empty',
    'There are no FAQs for this item yet.',
  );

  const noReviewsText = ui(
    itemType === 'sparepart' ? 'ui_spareparts_reviews_empty' : 'ui_products_reviews_empty',
    'There are no reviews for this item yet.',
  );

  const requestQuoteText = ui(
    itemType === 'sparepart' ? 'ui_spareparts_request_quote' : 'ui_products_request_quote',
    'Request a quote',
  );

  const [showOfferForm, setShowOfferForm] = useState(false);
  const offerFormRef = useRef<HTMLDivElement | null>(null);

  const slugParam = router.query.slug;
  const slug = useMemo(
    () => safeStr(Array.isArray(slugParam) ? slugParam[0] : slugParam),
    [slugParam],
  );

  // ✅ PRODUCT/SPAREPART (locale short)
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductBySlugQuery({ slug, locale, item_type: itemType } as any, { skip: !slug });

  const productId = safeStr(product?.id);
  const listHref = useMemo(() => localizePath(locale, basePath), [locale, basePath]);

  const title = safeStr((product as any)?.title);
  const description = safeStr((product as any)?.description);

  const heroSrc = useMemo(() => {
    if (!product) return '';
    const raw =
      safeStr((product as any).image_url) ||
      safeStr(((product as any).images && (product as any).images[0]) || '');
    if (!raw) return '';
    return toCdnSrc(raw, HERO_W, HERO_H, 'fill') || raw;
  }, [product]);

  const tags = useMemo(() => {
    const arr = ((product as any)?.tags ?? []) as any[];
    return arr.map((t) => safeStr(t)).filter((t) => t.length > 0);
  }, [product]);

  // ✅ FAQ (locale short)
  const { data: faqsData, isLoading: isFaqsLoading } = useListProductFaqsQuery(
    { product_id: productId, only_active: 1, locale, item_type: itemType } as any,
    { skip: !productId },
  );
  const faqs: ProductFaqDto[] = (faqsData ?? []) as any;

  // ✅ SPECS (locale short)
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

    // ✅ Fallback specs labels: EN only (DB yoksa)
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
          entries.push({
            key,
            label: labels[key] ?? key,
            value: String(value),
          });
        });
    }

    return entries;
  }, [specsData, product]);

  // REVIEWS (mevcut endpoint locale-aware değil)
  const { data: reviewsRaw, isLoading: isReviewsLoading } = useListProductReviewsQuery(
    { product_id: productId, only_active: 1, limit: 10, offset: 0 } as any,
    { skip: !productId },
  );

  const reviews: ProductReviewDto[] = useMemo(() => (reviewsRaw ?? []) as any, [reviewsRaw]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  useEffect(() => {
    if (showOfferForm && offerFormRef.current) {
      offerFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showOfferForm]);

  const showSkeleton = isProductLoading || (!slug && !product && !isProductError);

  const hasSpecs = specsEntries.length > 0;
  const hasFaqs = faqs.length > 0;
  const hasReviews = reviews.length > 0;

  const showSpecsBlock = isSpecsLoading || hasSpecs;
  const showFaqsBlock = isFaqsLoading || hasFaqs;
  const showSpecsOrFaqsRow = showSpecsBlock || showFaqsBlock;

  const showReviewsBlock = isReviewsLoading || hasReviews;

  return (
    <section className="product__detail-area grey-bg-3 pt-120 pb-90">
      <div className="container">
        <div className="row mb-30">
          <div className="col-12">
            <button type="button" className="link-more" onClick={() => router.push(listHref)}>
              ← {backToListText}
            </button>
          </div>
        </div>

        {showSkeleton && (
          <div className="row">
            <div className="col-12">
              <p>{loadingText}</p>
              <div className="skeleton-line mt-10 product__detail-skel-line" />
              <div className="skeleton-line mt-10 product__detail-skel-line product__detail-skel-line--w80" />
            </div>
          </div>
        )}

        {!showSkeleton && (isProductError || !product) && (
          <div className="row">
            <div className="col-12">
              <p>{notFoundText}</p>
            </div>
          </div>
        )}

        {!showSkeleton && !isProductError && product && (
          <>
            <div className="row" data-aos="fade-up" data-aos-delay="200">
              <div className="col-lg-6 mb-30">
                <div className="product__detail-hero w-img project__thumb">
                  <Image
                    src={(heroSrc as any) || (FallbackCover as any)}
                    alt={safeStr((product as any).alt) || title || 'product image'}
                    width={HERO_W}
                    height={HERO_H}
                    priority
                    className="product__detail-heroImg"
                    sizes="(max-width: 992px) 92vw, 50vw"
                  />
                </div>
              </div>

              <div className="col-lg-6 mb-30">
                <article className="product__detail">
                  <header className="product__detail-header mb-20">
                    <h1 className="section__title-3 mb-15">{title || notFoundText}</h1>

                    <div className="product__detail-cta mt-15">
                      <button
                        type="button"
                        className="solid__btn"
                        onClick={() => setShowOfferForm(true)}
                      >
                        {requestQuoteText}
                      </button>
                    </div>
                  </header>

                  {description && (
                    <div className="product__detail-desc mb-20">
                      <p>{description}</p>
                    </div>
                  )}

                  {!!tags.length && (
                    <div className="product__detail-tags mb-20">
                      <h4 className="product__detail-subtitle mb-10">{tagsTitle}</h4>
                      <div className="product__tag-list d-flex flex-wrap">
                        {tags.map((t: string) => (
                          <span
                            key={t}
                            className="badge bg-light text-dark border rounded-pill me-2 mb-2"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </div>
            </div>

            {showSpecsOrFaqsRow && (
              <div className="row mt-10">
                {showSpecsBlock && (
                  <div className="col-lg-6 mb-30">
                    <ProductSpecsBlock
                      title={specsTitle}
                      entries={specsEntries}
                      isLoading={isSpecsLoading}
                    />
                  </div>
                )}

                {showFaqsBlock && (
                  <div className="col-lg-6 mb-30">
                    <ProductFaqBlock
                      title={faqsTitle}
                      faqs={faqs}
                      isLoading={isFaqsLoading}
                      emptyText={noFaqsText}
                    />
                  </div>
                )}
              </div>
            )}

            {showReviewsBlock && (
              <div className="row mt-10">
                <div className="col-12">
                  <ProductReviewsBlock
                    title={reviewsTitle}
                    reviews={reviews}
                    averageRating={averageRating}
                    isLoading={isReviewsLoading}
                    emptyText={noReviewsText}
                    locale={locale as any}
                  />
                </div>
              </div>
            )}

            {showOfferForm && productId && (
              <div className="row mt-40" ref={offerFormRef}>
                <div className="col-12">
                  <OfferSection
                    productId={productId}
                    productName={title || safeStr((product as any).slug) || ''}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
