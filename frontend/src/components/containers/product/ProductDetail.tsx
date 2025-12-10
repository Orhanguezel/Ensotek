// =============================================================
// FILE: src/components/containers/product/ProductDetail.tsx
// Ensotek – Product Detail Content
//   - Data: products (by slug, locale-aware)
//   - FAQs, Specs, Reviews: public uçlar
//   - i18n: site_settings.ui_products
//   - Fiyat GÖSTERME, sadece "Teklif isteyiniz" CTA
//   - Reviews: Carousel ile slider
// =============================================================

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  useGetProductBySlugQuery,
  useListProductFaqsQuery,
  useListProductSpecsQuery,
  useListProductReviewsQuery,
} from "@/integrations/rtk/endpoints/products.endpoints";
import type {
  ProductFaqDto,
  ProductSpecDto,
  ProductReviewDto,
} from "@/integrations/types/product.types";

import { toCdnSrc } from "@/shared/media";
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

import FallbackCover from "public/img/blog/3/1.jpg";

const HERO_W = 960;
const HERO_H = 540;

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();

  const { ui } = useUiSection("ui_products", locale);

  const backToListText = ui(
    "ui_products_back_to_list",
    locale === "tr" ? "Tüm ürünlere dön" : "Back to all products",
  );
  const loadingText = ui(
    "ui_products_loading",
    locale === "tr" ? "Ürün yükleniyor..." : "Loading product...",
  );
  const notFoundText = ui(
    "ui_products_not_found",
    locale === "tr" ? "Ürün bulunamadı." : "Product not found.",
  );
  const specsTitle = ui(
    "ui_products_specs_title",
    locale === "tr" ? "Teknik Özellikler" : "Technical Specifications",
  );
  const tagsTitle = ui(
    "ui_products_tags_title",
    locale === "tr" ? "Etiketler" : "Tags",
  );
  const faqsTitle = ui(
    "ui_products_faqs_title",
    locale === "tr" ? "Sık Sorulan Sorular" : "Frequently Asked Questions",
  );
  const reviewsTitle = ui(
    "ui_products_reviews_title",
    locale === "tr" ? "Müşteri Yorumları" : "Customer Reviews",
  );
  const noFaqsText = ui(
    "ui_products_faqs_empty",
    locale === "tr"
      ? "Bu ürün için kayıtlı SSS bulunmamaktadır."
      : "There are no FAQs for this product yet.",
  );
  const noReviewsText = ui(
    "ui_products_reviews_empty",
    locale === "tr"
      ? "Bu ürün için henüz yorum yapılmamıştır."
      : "There are no reviews for this product yet.",
  );
  const requestQuoteText = ui(
    "ui_products_request_quote",
    locale === "tr" ? "Teklif isteyiniz" : "Request a quote",
  );

  const slugParam = router.query.slug;
  const slug = useMemo(
    () => (Array.isArray(slugParam) ? slugParam[0] : slugParam) || "",
    [slugParam],
  );

  // ---------- ÜRÜN DETAY ----------
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductBySlugQuery(
    { slug, locale },
    { skip: !slug },
  );

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

  const tags = (product?.tags ?? []).filter(Boolean);
  const productId = product?.id ?? "";

  // ---------- FAQS ----------
  const {
    data: faqsData,
    isLoading: isFaqsLoading,
  } = useListProductFaqsQuery(
    { product_id: productId, only_active: 1 },
    { skip: !productId },
  );
  const faqs: ProductFaqDto[] = faqsData ?? [];

  // ---------- SPECS ----------
  const {
    data: specsData,
    isLoading: isSpecsLoading,
  } = useListProductSpecsQuery(
    { product_id: productId },
    { skip: !productId },
  );

  // specs birleşik: önce API'den gelenler, yoksa eski specifications objesi
  const specsEntries = useMemo(() => {
    const entries: Array<{ key: string; label: string; value: string }> = [];

    const specsList: ProductSpecDto[] = specsData ?? [];

    // 1) API’den gelen satırlar
    if (specsList.length) {
      specsList
        .slice()
        .sort((a, b) => a.order_num - b.order_num)
        .forEach((s) => {
          entries.push({
            key: s.id,
            label: s.name,
            value: s.value,
          });
        });
    }

    // 2) Eski structured specifications objesini fallback olarak ekle
    if (!entries.length && product?.specifications) {
      const specs = product.specifications;
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

      Object.entries(specs)
        .filter(([, v]) => !!v)
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

  // ---------- REVIEWS ----------
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
  } = useListProductReviewsQuery(
    {
      product_id: productId,
      only_active: 1,
      limit: 10,
      offset: 0,
    },
    { skip: !productId },
  );

  const reviews: ProductReviewDto[] = useMemo(
    () => (reviewsData ?? []) as ProductReviewDto[],
    [reviewsData],
  );

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const handleRequestQuote = () => {
    // Örnek: iletişim sayfasına ürün slug/id ile git
    const contactPath = localizePath(
      locale,
      `/contact?product=${encodeURIComponent(slug || productId)}`,
    );
    void router.push(contactPath);
  };

  const showSkeleton =
    isProductLoading ||
    (!product && !isProductError && !slug);

  return (
    <section className="product__detail-area grey-bg-3 pt-120 pb-90">
      <div className="container">
        {/* Back link */}
        <div className="row mb-30">
          <div className="col-12">
            <button
              type="button"
              className="link-more"
              onClick={() => router.push(productListHref)}
            >
              ← {backToListText}
            </button>
          </div>
        </div>

        {/* Loading / error / not found */}
        {showSkeleton && (
          <div className="row">
            <div className="col-12">
              <p>{loadingText}</p>
              <div
                className="skeleton-line mt-10"
                style={{ height: 16 }}
                aria-hidden
              />
              <div
                className="skeleton-line mt-10"
                style={{ height: 16, width: "80%" }}
                aria-hidden
              />
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
            {/* Üst blok: görsel + temel bilgiler + teklif CTA */}
            <div
              className="row"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {/* Sol: görsel */}
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

              {/* Sağ: içerik */}
              <div className="col-lg-6 mb-30">
                <article className="product__detail">
                  <header className="product__detail-header mb-20">
                    <h1 className="section__title-3 mb-15">
                      {title || notFoundText}
                    </h1>

                    {/* Fiyat YOK – sadece teklif CTA */}
                    <div className="product__detail-cta mt-15">
                      <button
                        type="button"
                        className="solid__btn"
                        onClick={handleRequestQuote}
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

                  {/* Tags */}
                  {!!tags.length && (
                    <div className="product__detail-tags mb-20">
                      <h4 className="product__detail-subtitle mb-10">
                        {tagsTitle}
                      </h4>
                      <div className="product__tag-list">
                        {tags.map((t) => (
                          <span
                            className="tag"
                            key={t}
                            style={{ marginRight: 6, marginBottom: 4 }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </div>
            </div>

            {/* Alt bloklar: Specs + FAQs */}
            <div className="row mt-10">
              {/* Specs */}
              {(isSpecsLoading || specsEntries.length > 0) && (
                <div className="col-lg-6 mb-30">
                  <div
                    className="product__detail-specs card p-3 h-100"
                    style={{ overflow: "hidden" }}
                  >
                    <h3 className="product__detail-subtitle mb-10">
                      {specsTitle}
                    </h3>

                    {isSpecsLoading && !specsEntries.length && (
                      <div className="skeleton-line" aria-hidden />
                    )}

                    {!!specsEntries.length && (
                      <ul
                        className="product__spec-list"
                        style={{
                          paddingLeft: "1.2rem",
                          marginBottom: 0,
                          overflowWrap: "break-word",
                        }}
                      >
                        {specsEntries.map((s) => (
                          <li key={s.key}>
                            <strong>{s.label}:</strong> {s.value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {(isFaqsLoading || faqs.length > 0) && (
                <div className="col-lg-6 mb-30">
                  <div className="product__detail-faq card p-3 h-100">
                    <h3 className="product__detail-subtitle mb-10">
                      {faqsTitle}
                    </h3>

                    {isFaqsLoading && !faqs.length && (
                      <div className="skeleton-line" aria-hidden />
                    )}

                    {!isFaqsLoading && !faqs.length && (
                      <p className="text-muted small mb-0">
                        {noFaqsText}
                      </p>
                    )}

                    {!!faqs.length && (
                      <div className="accordion" id="productFaq">
                        {faqs
                          .slice()
                          .sort(
                            (a, b) =>
                              a.display_order - b.display_order,
                          )
                          .map((f) => (
                            <details
                              key={f.id}
                              className="mb-2"
                            >
                              <summary
                                style={{
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                {f.question}
                              </summary>
                              <div
                                style={{
                                  marginTop: 4,
                                  fontSize: 14,
                                }}
                              >
                                {f.answer}
                              </div>
                            </details>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews – Carousel */}
            {(isReviewsLoading || reviews.length > 0) && (
              <div className="row mt-10">
                <div className="col-12">
                  <div className="product__detail-reviews card p-3">
                    <div className="d-flex justify-content-between align-items-center mb-10">
                      <h3 className="product__detail-subtitle mb-0">
                        {reviewsTitle}
                      </h3>
                      {averageRating !== null && (
                        <div className="product__review-summary small text-muted">
                          {averageRating.toFixed(1)} / 5 ·{" "}
                          {reviews.length}{" "}
                          {locale === "tr" ? "yorum" : "reviews"}
                        </div>
                      )}
                    </div>

                    {isReviewsLoading && !reviews.length && (
                      <div className="skeleton-line" aria-hidden />
                    )}

                    {!isReviewsLoading && !reviews.length && (
                      <p className="text-muted small mb-0">
                        {noReviewsText}
                      </p>
                    )}

                    {!!reviews.length && (
                      <Carousel className="mt-2">
                        <CarouselContent className="py-2">
                          {reviews.map((r) => (
                            <CarouselItem
                              key={r.id}
                              className="basis-full md:basis-1/2 lg:basis-1/3"
                            >
                              <div className="border rounded-2 p-3 h-100 small">
                                <div className="d-flex justify-content-between mb-1">
                                  <strong>
                                    {r.customer_name ||
                                      (locale === "tr"
                                        ? "Müşteri"
                                        : "Customer")}
                                  </strong>
                                  <span className="text-muted">
                                    {r.rating} / 5
                                  </span>
                                </div>
                                {r.comment && (
                                  <div>{r.comment}</div>
                                )}
                                {r.review_date && (
                                  <div className="text-muted mt-1">
                                    {new Date(
                                      r.review_date,
                                    ).toLocaleDateString(locale)}
                                  </div>
                                )}
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>

                        {/* Oklar sadece md+ ekranlarda görünsün */}
                        <CarouselPrevious className="hidden md:flex" />
                        <CarouselNext className="hidden md:flex" />
                      </Carousel>
                    )}
                  </div>
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
