// =============================================================
// FILE: src/components/containers/product/ProductReviewsBlock.tsx
// Ensotek – Product Reviews Block (Müşteri Yorumları)
// - Hook-safe: useMemo YOK
// - Önceki beyaz slide tasarımı korunur
// - Inline style YOK (class ile)
// =============================================================

'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { ProductReviewDto } from '@/integrations/types/product.types';

interface ProductReviewsBlockProps {
  title: string;
  reviews: ProductReviewDto[];
  averageRating: number | null;
  isLoading: boolean;
  emptyText: string; // API uyumu için duruyor (bu blokta gösterilmiyor)
  locale: string;
}

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function safeDate(locale: string, raw: unknown): string {
  const s = safeStr(raw);
  if (!s) return '';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  try {
    return d.toLocaleDateString(locale);
  } catch {
    return d.toLocaleDateString('en');
  }
}

const ProductReviewsBlock: React.FC<ProductReviewsBlockProps> = ({
  title,
  reviews,
  averageRating,
  isLoading,
  locale,
}) => {
  const list = reviews ?? [];
  const hasReviews = list.length > 0;

  // Ne yükleniyor ne de yorum var → hiç render etme
  if (!isLoading && !hasReviews) return null;

  return (
    <div className="product__detail-reviews card p-3 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-10">
        <h3 className="product__detail-subtitle mb-0">{title}</h3>

        {averageRating !== null && hasReviews && (
          <div className="product__review-summary small text-muted">
            {averageRating.toFixed(1)} / 5 · {list.length} {locale === 'de' ? 'yorum' : 'reviews'}
          </div>
        )}
      </div>

      {isLoading && !hasReviews ? <div className="skeleton-line" aria-hidden /> : null}

      {hasReviews ? (
        <div className="product-review-slider-wrapper">
          <Swiper
            slidesPerView={1}
            spaceBetween={24}
            loop={list.length > 1}
            roundLengths
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{
              nextEl: '.product-review-button-next',
              prevEl: '.product-review-button-prev',
            }}
            className="product-review-swiper"
          >
            {list.map((r) => {
              const name = safeStr(r.customer_name) || (locale === 'de' ? 'Müşteri' : 'Customer');
              const rating = Number(r.rating ?? 0) || 0;
              const comment = safeStr(r.comment);
              const dateText = safeDate(locale, r.review_date);

              return (
                <SwiperSlide key={r.id}>
                  <div className="product-review-slide small">
                    <div className="d-flex justify-content-between mb-1">
                      <strong>{name}</strong>
                      <span className="text-muted">{rating} / 5</span>
                    </div>

                    {comment ? <p className="mb-1 product-review-comment">{comment}</p> : null}

                    {dateText ? (
                      <div className="text-muted product-review-date">{dateText}</div>
                    ) : null}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className="product-review-navigation">
            <button
              type="button"
              className="product-review-button-prev"
              aria-label={locale === 'de' ? 'Önceki yorum' : 'Previous testimonial'}
              disabled={list.length <= 1}
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className="product-review-button-next"
              aria-label={locale === 'de' ? 'Sonraki yorum' : 'Next testimonial'}
              disabled={list.length <= 1}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      ) : null}

      {/* Eski görünümü koru; sadece inline style'ları class'a taşıdık */}
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

        .product-review-comment {
          font-size: 14px;
        }

        .product-review-date {
          font-size: 12px;
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

        /* Dark mode override (eski davranış kalsın) */
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
