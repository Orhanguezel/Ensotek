// =============================================================
// FILE: src/components/containers/product/Product.tsx
// Ensotek – Products section (Home / Landing) — CAROUSEL VERSION
//   - Pattern: References.tsx (Swiper + Navigation buttons)
//   - i18n: useLocaleShort + ui_products (DB) + EN fallback
//   - Optional categoryId filter
//   - Inline style YOK
//   - Fix: remote images görünmüyorsa => Image unoptimized
// =============================================================

'use client';

import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Swiper (References pattern)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { useListProductsQuery } from '@/integrations/rtk/hooks';
import type { ProductDto } from '@/integrations/types/product.types';

import { toCdnSrc } from '@/shared/media';

// i18n (PATTERN)
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import FallbackCover from 'public/img/blog/1/blog-01.jpg';

const CARD_W = 720;
const CARD_H = 480;

export interface ProductSectionProps {
  categoryId?: string;
}

type ProductCardVM = {
  id: string;
  slug: string;
  title: string;
  hero: string;
  alt: string;
};

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

/** Başlığın son kelimesini .down__mark-line ile işaretle (References ile aynı yaklaşım) */
function decorateTitleWithMarkLine(title: string) {
  const parts = safeStr(title).split(' ').filter(Boolean);
  if (parts.length <= 1) return <span className="down__mark-line">{title}</span>;
  const last = parts.pop()!;
  return (
    <>
      {parts.join(' ')} <span className="down__mark-line">{last}</span>
    </>
  );
}

const Product: React.FC<ProductSectionProps> = ({ categoryId }) => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_products', locale as any);

  const t = useCallback((key: string, fallback: string) => ui(key, fallback), [ui]);

  // UI strings (DB -> EN fallback only)
  const subprefix = t('ui_products_kicker_prefix', 'Ensotek');
  const sublabel = t('ui_products_kicker_label', 'Our Products');

  const title = t('ui_products_section_title', 'Our Products'); // istersen DB key’i netleştir
  const viewAllText = t('ui_products_view_all', 'All products');

  const readMore = t('ui_products_read_more', 'View details');
  const prevLabel = t('ui_products_prev', 'Previous');
  const nextLabel = t('ui_products_next', 'Next');

  const emptyText = t('ui_products_empty', 'There are no products to display at the moment.');

  const listArgs = useMemo(
    () => ({
      is_active: 1,
      locale,
      limit: 12,
      ...(categoryId ? { category_id: categoryId } : {}),
      // gerekiyorsa:
      // item_type: 'product',
    }),
    [locale, categoryId],
  );

  const { data, isLoading } = useListProductsQuery(listArgs as any);

  const productListHref = useMemo(() => localizePath(locale, '/product'), [locale]);

  const items: ProductCardVM[] = useMemo(() => {
    const list: ProductDto[] = ((data as any)?.items ?? []) as any;

    return list
      .filter((p) => !!p && !!(p as any).is_active)
      .slice(0, 12)
      .map((p) => {
        const id = safeStr((p as any).id) || safeStr((p as any).slug);
        const slug = safeStr((p as any).slug);
        const title = safeStr((p as any).title) || 'Untitled';

        const imgRaw =
          safeStr((p as any).image_url) ||
          safeStr(((p as any).images && (p as any).images[0]) || '');

        // NOTE: toCdnSrc bazen boş dönebilir; ham url fallback var
        const hero = imgRaw ? toCdnSrc(imgRaw, CARD_W, CARD_H, 'fill') || imgRaw : '';

        const alt = safeStr((p as any).alt) || title || 'product image';

        return { id, slug, title, hero, alt };
      })
      .filter((x) => !!x.id && !!x.slug);
  }, [data]);

  // items yok + loading değil => hiç render etme (istersen emptyText göster)
  if (!isLoading && items.length === 0) {
    return (
      <section className="product__area pt-120 pb-90">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="200">
            <div className="col-12">
              <div className="section__title-wrapper text-center mb-65">
                <span className="section__subtitle">
                  <span>{subprefix}</span> {sublabel}
                </span>
                <h2 className="section__title">{decorateTitleWithMarkLine(title)}</h2>
              </div>
              <p className="text-center">{emptyText}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product__area pt-120 pb-90">
      <div className="container">
        {/* Title + Nav + CTA (References pattern) */}
        <div className="row align-items-center mb-25" data-aos="fade-up" data-aos-delay="200">
          <div className="col-12 col-md-7">
            <div className="section__title-wrapper text-center text-md-start mb-0">
              <span className="section__subtitle">
                <span>{subprefix}</span> {sublabel}
              </span>
              <h2 className="section__title" style={{ marginBottom: 0 }}>
                {decorateTitleWithMarkLine(title)}
              </h2>
            </div>
          </div>

          <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end align-items-center gap-2">
            <div className="feedback__navigation me-2 d-none d-sm-flex">
              <button className="products__button-prev" aria-label={prevLabel}>
                <FiChevronLeft />
              </button>
              <button className="products__button-next" aria-label={nextLabel}>
                <FiChevronRight />
              </button>
            </div>

            <Link href={productListHref} className="solid__btn" aria-label={viewAllText}>
              {viewAllText}
            </Link>
          </div>
        </div>

        {/* Slider */}
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-12">
            <Swiper
              modules={[Autoplay, Navigation]}
              navigation={{
                nextEl: '.products__button-next',
                prevEl: '.products__button-prev',
              }}
              autoplay={{
                delay: 4200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={items.length > 3}
              spaceBetween={24}
              slidesPerView={1.1}
              breakpoints={{
                480: { slidesPerView: 1.4 },
                768: { slidesPerView: 2.2 },
                992: { slidesPerView: 3 },
              }}
              className="brand__active"
            >
              {items.map((p) => {
                const href = localizePath(locale, `/product/${encodeURIComponent(p.slug)}`);

                return (
                  <SwiperSlide key={p.id}>
                    <div className="product__item mb-30">
                      <div className="product__thumb w-img mb-20">
                        <Link href={href}>
                          <Image
                            src={(p.hero as any) || (FallbackCover as any)}
                            alt={p.alt}
                            width={CARD_W}
                            height={CARD_H}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            // ✅ remote/CDN images görünmüyorsa bunu koy:
                            unoptimized
                          />
                        </Link>
                      </div>

                      <div className="product__content">
                        <h3 className="product__title">
                          <Link href={href}>{p.title}</Link>
                        </h3>

                        <Link
                          href={href}
                          className="link-more"
                          aria-label={`${p.title} — ${readMore}`}
                        >
                          {readMore} →
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {isLoading && <div className="skeleton-line mt-20" aria-hidden />}
          </div>
        </div>

        {/* Okların stili (References ile aynı) */}
        <style jsx>{`
          .feedback__navigation button {
            display: inline-flex;
            width: 50px;
            height: 50px;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.12);
            background: #fff;
            color: #111;
            transition: all 0.2s ease;
          }
          .feedback__navigation button + button {
            margin-left: 6px;
          }
          .feedback__navigation button:hover {
            background: var(--clr-theme-1);
            color: #fff;
            border-color: transparent;
            transform: translateY(-1px);
          }
        `}</style>
      </div>
    </section>
  );
};

export default Product;
