// =============================================================
// FILE: src/components/containers/product/ProductReviewsBlock.tsx
// Ensotek – Product Reviews Block (Müşteri Yorumları)
//   - Yorum yoksa ve loading değilse hiç render edilmez
// =============================================================

"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { ProductReviewDto } from "@/integrations/types/product.types";

interface ProductReviewsBlockProps {
    title: string;
    reviews: ProductReviewDto[];
    averageRating: number | null;
    isLoading: boolean;
    emptyText: string; // Şu an kullanılmıyor ama API uyumu için duruyor
    locale: string;
}

const ProductReviewsBlock: React.FC<ProductReviewsBlockProps> = ({
    title,
    reviews,
    averageRating,
    isLoading,
    locale,
}) => {
    const hasReviews = reviews.length > 0;

    // Ne yükleniyor ne de yorum var → hiç render etme
    if (!isLoading && !hasReviews) {
        return null;
    }

    return (
        <div className="product__detail-reviews card p-3 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-10">
                <h3 className="product__detail-subtitle mb-0">{title}</h3>
                {averageRating !== null && hasReviews && (
                    <div className="product__review-summary small text-muted">
                        {averageRating.toFixed(1)} / 5 · {reviews.length}{" "}
                        {locale === "tr" ? "yorum" : "reviews"}
                    </div>
                )}
            </div>

            {isLoading && !hasReviews && (
                <div className="skeleton-line" aria-hidden />
            )}

            {hasReviews && (
                <div className="product-review-slider-wrapper">
                    {/* Slider */}
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={24}
                        loop={reviews.length > 1}
                        roundLengths
                        modules={[Autoplay, Navigation]}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        navigation={{
                            nextEl: ".product-review-button-next",
                            prevEl: ".product-review-button-prev",
                        }}
                        className="product-review-swiper"
                    >
                        {reviews.map((r) => (
                            <SwiperSlide key={r.id}>
                                <div className="product-review-slide small">
                                    <div className="d-flex justify-content-between mb-1">
                                        <strong>
                                            {r.customer_name ||
                                                (locale === "tr" ? "Müşteri" : "Customer")}
                                        </strong>
                                        <span className="text-muted">
                                            {r.rating} / 5
                                        </span>
                                    </div>

                                    {r.comment && (
                                        <p className="mb-1" style={{ fontSize: 14 }}>
                                            {r.comment}
                                        </p>
                                    )}

                                    {r.review_date && (
                                        <div
                                            className="text-muted"
                                            style={{ fontSize: 12 }}
                                        >
                                            {new Date(r.review_date).toLocaleDateString(locale)}
                                        </div>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Ok butonları */}
                    <div className="product-review-navigation">
                        <button
                            className="product-review-button-prev"
                            aria-label={
                                locale === "tr"
                                    ? "Önceki yorum"
                                    : "Previous testimonial"
                            }
                        >
                            <FiChevronLeft />
                        </button>
                        <button
                            className="product-review-button-next"
                            aria-label={
                                locale === "tr"
                                    ? "Sonraki yorum"
                                    : "Next testimonial"
                            }
                        >
                            <FiChevronRight />
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
        .product-review-slider-wrapper {
          position: relative;
        }

        .product-review-slide {
          background: #ffffff;
          border-radius: 12px;
          padding: 14px 16px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          min-height: 90px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .product-review-navigation {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .product-review-button-prev,
        .product-review-button-next {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.6);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
        }

        .product-review-button-prev svg,
        .product-review-button-next svg {
          width: 18px;
          height: 18px;
        }

        @media (prefers-color-scheme: dark) {
          .product-review-slide {
            background: #020617;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
          }
          .product-review-button-prev,
          .product-review-button-next {
            background: #020617;
            border-color: rgba(148, 163, 184, 0.7);
          }
        }
      `}</style>
        </div>
    );
};

export default ProductReviewsBlock;
