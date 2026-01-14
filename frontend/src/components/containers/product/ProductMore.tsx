// =============================================================
// FILE: src/components/containers/product/ProductMore.tsx
// Ensotek – More Products Carousel (detail page altı)
// PATTERN: NewsMore (Swiper + teamThumbHover + nameBelow)
// - Inline style YOK
// - i18n: useLocaleShort() + site_settings ui_products/ui_spareparts (DB) + EN fallback
// - Route'a göre item_type: product | sparepart
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

// RTK
import { useListProductsQuery } from '@/integrations/rtk/hooks';
import type { ProductDto } from '@/integrations/types';

// helpers
import { toCdnSrc } from '@/shared/media';
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';

import FallbackCover from 'public/img/blog/3/2.jpg';

const CARD_W = 640;
const CARD_H = 420;

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

const ProductMore: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  // ✅ product vs sparepart
  const itemType = useMemo<'product' | 'sparepart'>(() => {
    const p = safeStr(router.pathname);
    const a = safeStr(router.asPath);
    if (p.startsWith('/sparepart') || a.startsWith('/sparepart')) return 'sparepart';
    return 'product';
  }, [router.pathname, router.asPath]);

  const basePath = itemType === 'sparepart' ? '/sparepart' : '/product';
  const uiSectionKey = itemType === 'sparepart' ? 'ui_spareparts' : 'ui_products';

  const { ui } = useUiSection(uiSectionKey as any, locale as any);

  const moreTitle = ui(
    itemType === 'sparepart' ? 'ui_spareparts_more_title' : 'ui_products_more_title',
    itemType === 'sparepart' ? 'More Spare Parts' : 'More Products',
  );

  const goToItemText = ui(
    itemType === 'sparepart' ? 'ui_spareparts_go_to_item' : 'ui_products_go_to_item',
    itemType === 'sparepart' ? 'View spare part' : 'View product',
  );

  const slugParam = router.query.slug;
  const currentSlug = useMemo(
    () => safeStr(Array.isArray(slugParam) ? slugParam[0] : slugParam),
    [slugParam],
  );

  const { data, isLoading } = useListProductsQuery({
    is_active: 1,
    locale,
    limit: 12,
    item_type: itemType,
  } as any);

  const listHref = useMemo(() => localizePath(locale, basePath), [locale, basePath]);

  const items = useMemo(() => {
    const list: ProductDto[] = (data as any)?.items ?? [];

    return list
      .filter((p) => {
        const slug = safeStr((p as any)?.slug);
        if (!(p as any)?.is_active) return false;
        if (!slug) return false;
        if (slug === currentSlug) return false;
        return true;
      })
      .slice(0, 9)
      .map((p) => {
        const slug = safeStr((p as any)?.slug);
        const title = safeStr((p as any)?.title);
        const summary = safeStr((p as any)?.summary || (p as any)?.short_description || '');

        const imgRaw =
          safeStr((p as any)?.image_url) ||
          safeStr(((p as any)?.images && (p as any)?.images[0]) || '');

        return {
          id: safeStr((p as any)?.id) || slug,
          slug,
          title: title || 'Untitled',
          summary,
          hero: (imgRaw && (toCdnSrc(imgRaw, CARD_W, CARD_H, 'fill') || imgRaw)) || '',
          alt: safeStr((p as any)?.alt) || title || 'product image',
        };
      });
  }, [data, currentSlug]);

  // ✅ NewsMore ile aynı davranış
  if (!items.length && !isLoading) return null;

  return (
    <section className="news__area pt-60 pb-90">
      <div className="container">
        {/* Başlık */}
        <div className="row mb-40">
          <div className="col-12">
            <div className="section__title-wrapper text-center">
              <div className="section__subtitle-3">
                <span>{moreTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={3}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          navigation
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {items.map((p) => {
            const href = p.slug
              ? localizePath(locale, `${basePath}/${encodeURIComponent(p.slug)}`)
              : listHref;

            return (
              <SwiperSlide key={p.id}>
                <div className="team__item teamItem--nameBelow">
                  <div className="team__thumb teamThumbHover">
                    <Link href={href}>
                      <Image
                        src={(p.hero as any) || (FallbackCover as any)}
                        alt={p.alt}
                        width={CARD_W}
                        height={CARD_H}
                        loading="lazy"
                      />
                    </Link>

                    <div className="teamThumbHover__overlay">
                      <div className="teamThumbHover__box">
                        <div className="teamThumbHover__role">{p.title}</div>
                        {p.summary ? <div className="teamThumbHover__note">{p.summary}</div> : null}
                      </div>
                    </div>
                  </div>

                  <div className="team__content teamContent--nameOnly">
                    <h3 className="teamNameOnly">
                      <Link href={href}>{p.title}</Link>
                    </h3>

                    <Link href={href} className="link-more">
                      {goToItemText} →
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {isLoading ? (
          <div className="row mt-20">
            <div className="col-12">
              <div className="skeleton-line ens-skel-16" aria-hidden />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProductMore;
