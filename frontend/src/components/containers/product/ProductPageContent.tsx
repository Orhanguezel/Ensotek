// =============================================================
// FILE: src/components/containers/product/ProductPageContent.tsx
// Ensotek – Full Products Page Content (IMAGE + TITLE ONLY) — FINAL
// - Shared container for /product and /sparepart
// - item_type is driven by props (product | sparepart)
// - UI section key + route base path are driven by props
// - Next/Image src never empty (fallback cover used)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useListProductsQuery } from '@/integrations/rtk/hooks';
import type { ProductDto } from '@/integrations/types/product.types';

import { toCdnSrc } from '@/shared/media';
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';

import FallbackCover from 'public/img/blog/3/1.jpg';

const CARD_W = 1200;
const CARD_H = 900;
const PAGE_LIMIT = 12;

const toLocaleShort = (l: unknown) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'de';

type ProductListVM = {
  id: string;
  slug: string;
  title: string;
  hero: string; // may be empty -> fallback used at render
  alt: string;
};

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

export type ProductPageContentProps = {
  itemType: 'product' | 'sparepart';
  uiSectionKey: 'ui_products' | 'ui_spareparts';
  basePath: '/product' | '/sparepart';
};

const ProductPageContent: React.FC<ProductPageContentProps> = ({
  itemType,
  uiSectionKey,
  basePath,
}) => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection(uiSectionKey, locale);

  // ---- UI keys are derived from section ----
  const isProducts = uiSectionKey === 'ui_products';

  const sectionSubtitlePrefix = ui(
    isProducts ? 'ui_products_kicker_prefix' : 'ui_spareparts_kicker_prefix',
    'Ensotek',
  );

  const sectionSubtitleLabel = ui(
    isProducts ? 'ui_products_kicker_label' : 'ui_spareparts_kicker_label',
    locale === 'de'
      ? isProducts
        ? 'Ürünlerimiz'
        : 'Yedek Parçalar'
      : isProducts
      ? 'Our Products'
      : 'Spare Parts',
  );

  const sectionTitle = ui(
    isProducts ? 'ui_products_page_title' : 'ui_spareparts_page_title',
    locale === 'de'
      ? isProducts
        ? 'Ürünlerimiz'
        : 'Yedek Parçalar'
      : isProducts
      ? 'Products'
      : 'Spare Parts',
  );

  const sectionIntro = ui(
    isProducts ? 'ui_products_page_intro' : 'ui_spareparts_page_intro',
    locale === 'de'
      ? isProducts
        ? 'Endüstriyel su soğutma kuleleri ve tamamlayıcı ekipmanlara ait seçili ürünler.'
        : 'Soğutma kuleleri için seçili yedek parça ve bakım bileşenleri.'
      : isProducts
      ? 'Selected products for industrial cooling towers and related equipment.'
      : 'Selected spare parts and maintenance components for cooling towers.',
  );

  const emptyText = ui(
    isProducts ? 'ui_products_empty' : 'ui_spareparts_empty',
    locale === 'de'
      ? 'Şu anda görüntülenecek içerik bulunmamaktadır.'
      : 'There are no items to display at the moment.',
  );

  // ---- Data (single source) ----
  const { data, isLoading } = useListProductsQuery({
    is_active: 1,
    locale,
    limit: PAGE_LIMIT,
    item_type: itemType,
  });

  const items: ProductListVM[] = useMemo(() => {
    const list: ProductDto[] = (data?.items ?? []) as any;

    return list
      .filter((p) => !!p && !!(p as any).is_active)
      .map((p) => {
        const id = safeStr((p as any).id) || safeStr((p as any).slug);
        const title = safeStr((p as any).title) || 'Untitled';
        const slug = safeStr((p as any).slug);

        const imgRaw =
          safeStr((p as any).image_url) ||
          safeStr(((p as any).images && (p as any).images[0]) || '');

        const hero = imgRaw ? toCdnSrc(imgRaw, CARD_W, CARD_H, 'fit') || imgRaw : '';

        return {
          id,
          slug,
          title,
          hero,
          alt: safeStr((p as any).alt) || title || 'product image',
        };
      })
      .filter((x) => !!x.slug && !!x.id);
  }, [data?.items]);

  const listHref = useMemo(() => localizePath(locale, basePath), [locale, basePath]);

  // Senin önceki davranışın: items yok + loading değil => null (sayfada sadece banner/feedback kalsın)
  if (!items.length && !isLoading) return null;

  return (
    <section className="product__area grey-bg-3 pt-120 pb-90">
      <div className="container">
        {/* Head */}
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-70">
              <div className="section__subtitle-3">
                <span>
                  {sectionSubtitlePrefix} {sectionSubtitleLabel}
                </span>
              </div>

              <div className="section__title-3 mb-20">{sectionTitle}</div>

              {sectionIntro ? <p className="ens-products__intro">{sectionIntro}</p> : null}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {!isLoading && items.length === 0 && (
            <div className="col-12">
              <p className="text-center">{emptyText}</p>
            </div>
          )}

          <div className="col-12">
            <div className="work__item-grid ens-productsGrid">
              {items.map((p) => {
                const href = p.slug
                  ? localizePath(locale, `${basePath}/${encodeURIComponent(p.slug)}`)
                  : listHref;

                // IMPORTANT: Next/Image src must not be empty
                const imgSrc = p.hero ? (p.hero as any) : (FallbackCover as any);

                return (
                  <article
                    className="project__item ens-projectCard ens-projectCard--compact"
                    key={p.id}
                  >
                    <Link href={href} className="ens-projectCard__cardLink" aria-label={p.title}>
                      <div className="project__thumb">
                        <span className="ens-projectCard__frame" aria-hidden="true">
                          <Image
                            src={imgSrc}
                            alt={p.alt}
                            fill
                            sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 360px"
                            className="ens-projectCard__img"
                            loading="lazy"
                          />
                        </span>
                      </div>

                      <div className="ens-projectCard__name">
                        <h3 className="ens-projectCard__title">{p.title}</h3>
                      </div>
                    </Link>
                  </article>
                );
              })}

              {isLoading && (
                <div className="ens-products__loading" aria-hidden>
                  <SkeletonStack>
                    <SkeletonLine className="ens-products__skel" />
                    <SkeletonLine className="ens-products__skel" />
                    <SkeletonLine className="ens-products__skel" />
                  </SkeletonStack>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPageContent;
