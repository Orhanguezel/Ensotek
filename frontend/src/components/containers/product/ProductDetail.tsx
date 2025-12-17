"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  useGetProductBySlugQuery,
  useListProductFaqsQuery,
  useListProductSpecsQuery,
  useListProductReviewsQuery,
} from "@/integrations/rtk/hooks";

import type {
  ProductFaqDto,
  ProductSpecDto,
  ProductReviewDto,
  ProductSpecifications,
} from "@/integrations/types/product.types";

import { toCdnSrc } from "@/shared/media";
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

import ProductSpecsBlock, { type ProductSpecEntry } from "@/components/containers/product/ProductSpecsBlock";
import ProductFaqBlock from "@/components/containers/product/ProductFaqBlock";
import ProductReviewsBlock from "@/components/containers/product/ProductReviewsBlock";

import { OfferSection } from "@/components/containers/offer/OfferSection";

import FallbackCover from "public/img/blog/3/1.jpg";

const HERO_W = 960;
const HERO_H = 540;

const toLocaleShort = (l: any) =>
  String(l || "tr").trim().toLowerCase().split("-")[0] || "tr";

const ProductDetail: React.FC = () => {
  const router = useRouter();

  // ✅ API + UI için kısa locale
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection("ui_products", locale);

  const backToListText = ui("ui_products_back_to_list", locale === "tr" ? "Tüm ürünlere dön" : "Back to all products");
  const loadingText = ui("ui_products_loading", locale === "tr" ? "Ürün yükleniyor..." : "Loading product...");
  const notFoundText = ui("ui_products_not_found", locale === "tr" ? "Ürün bulunamadı." : "Product not found.");
  const specsTitle = ui("ui_products_specs_title", locale === "tr" ? "Teknik Özellikler" : "Technical Specifications");
  const tagsTitle = ui("ui_products_tags_title", locale === "tr" ? "Etiketler" : "Tags");
  const faqsTitle = ui("ui_products_faqs_title", locale === "tr" ? "Sık Sorulan Sorular" : "Frequently Asked Questions");
  const reviewsTitle = ui("ui_products_reviews_title", locale === "tr" ? "Müşteri Yorumları" : "Customer Reviews");
  const noFaqsText = ui("ui_products_faqs_empty", locale === "tr" ? "Bu ürün için kayıtlı SSS bulunmamaktadır." : "There are no FAQs for this product yet.");
  const noReviewsText = ui("ui_products_reviews_empty", locale === "tr" ? "Bu ürün için henüz yorum yapılmamıştır." : "There are no reviews for this product yet.");
  const requestQuoteText = ui("ui_products_request_quote", locale === "tr" ? "Teklif isteyiniz" : "Request a quote");

  const [showOfferForm, setShowOfferForm] = useState(false);
  const offerFormRef = useRef<HTMLDivElement | null>(null);

  const slugParam = router.query.slug;
  const slug = useMemo(
    () => (Array.isArray(slugParam) ? slugParam[0] : slugParam) || "",
    [slugParam],
  );

  // ✅ PRODUCT (locale short)
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductBySlugQuery(
    { slug, locale },
    { skip: !slug },
  );

  const productId = product?.id ?? "";
  const productListHref = localizePath(locale, "/product");

  const title = (product?.title || "").trim();
  const description = (product?.description || "").trim();

  const heroSrc = useMemo(() => {
    if (!product) return "";
    const raw =
      (product.image_url || "").trim() ||
      ((product.images && product.images[0]) || "").trim();
    if (!raw) return "";
    return toCdnSrc(raw, HERO_W, HERO_H, "fill") || raw;
  }, [product]);

  const tags = useMemo(
    () =>
      (product?.tags ?? [])
        .map((t) => (t || "").trim())
        .filter((t) => t.length > 0),
    [product],
  );

  // ✅ FAQ (locale short)
  const { data: faqsData, isLoading: isFaqsLoading } = useListProductFaqsQuery(
    { product_id: productId, only_active: 1, locale },
    { skip: !productId },
  );
  const faqs: ProductFaqDto[] = faqsData ?? [];

  // ✅ SPECS (locale short)
  const { data: specsData, isLoading: isSpecsLoading } = useListProductSpecsQuery(
    { product_id: productId, locale },
    { skip: !productId },
  );

  const specsEntries: ProductSpecEntry[] = useMemo(() => {
    const entries: ProductSpecEntry[] = [];
    const specsList: ProductSpecDto[] = specsData ?? [];

    if (specsList.length) {
      specsList
        .slice()
        .sort((a, b) => a.order_num - b.order_num)
        .forEach((s) => {
          entries.push({ key: s.id, label: s.name, value: s.value });
        });
    }

    if (!entries.length && product?.specifications) {
      const labels: Record<string, string> =
        locale === "tr"
          ? {
            dimensions: "Ölçüler",
            weight: "Ağırlık",
            thickness: "Kalınlık",
            surfaceFinish: "Yüzey",
            warranty: "Garanti",
            installationTime: "Montaj süresi",
          }
          : {
            dimensions: "Dimensions",
            weight: "Weight",
            thickness: "Thickness",
            surfaceFinish: "Surface finish",
            warranty: "Warranty",
            installationTime: "Installation time",
          };

      Object.entries(product.specifications as ProductSpecifications)
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
  }, [specsData, product, locale]);

  // REVIEWS (locale-aware değil)
  const { data: reviewsRaw, isLoading: isReviewsLoading } = useListProductReviewsQuery(
    { product_id: productId, only_active: 1, limit: 10, offset: 0 },
    { skip: !productId },
  );

  const reviews: ProductReviewDto[] = useMemo(
    () => (reviewsRaw ?? []) as ProductReviewDto[],
    [reviewsRaw],
  );

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  useEffect(() => {
    if (showOfferForm && offerFormRef.current) {
      offerFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showOfferForm]);

  const showSkeleton = isProductLoading || (!product && !isProductError && !slug);

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
            <button type="button" className="link-more" onClick={() => router.push(productListHref)}>
              ← {backToListText}
            </button>
          </div>
        </div>

        {showSkeleton && (
          <div className="row">
            <div className="col-12">
              <p>{loadingText}</p>
              <div className="skeleton-line mt-10" style={{ height: 16 }} />
              <div className="skeleton-line mt-10" style={{ height: 16, width: "80%" }} />
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
                <div className="product__detail-hero w-img">
                  <Image
                    src={(heroSrc as any) || (FallbackCover as any)}
                    alt={product.alt || title || "product image"}
                    width={HERO_W}
                    height={HERO_H}
                    style={{ width: "100%", height: "auto" }}
                    priority
                  />
                </div>
              </div>

              <div className="col-lg-6 mb-30">
                <article className="product__detail">
                  <header className="product__detail-header mb-20">
                    <h1 className="section__title-3 mb-15">{title || notFoundText}</h1>

                    <div className="product__detail-cta mt-15">
                      <button type="button" className="solid__btn" onClick={() => setShowOfferForm(true)}>
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
                        {tags.map((t) => (
                          <span key={t} className="badge bg-light text-dark border rounded-pill me-2 mb-2">
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
                    <ProductSpecsBlock title={specsTitle} entries={specsEntries} isLoading={isSpecsLoading} />
                  </div>
                )}

                {showFaqsBlock && (
                  <div className="col-lg-6 mb-30">
                    <ProductFaqBlock title={faqsTitle} faqs={faqs} isLoading={isFaqsLoading} emptyText={noFaqsText} />
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
                    locale={locale}
                  />
                </div>
              </div>
            )}

            {showOfferForm && productId && (
              <div className="row mt-40" ref={offerFormRef}>
                <div className="col-12">
                  <OfferSection locale={locale} productId={productId} productName={title || product.slug || ""} />
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
