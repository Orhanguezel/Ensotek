// =============================================================
// FILE: src/components/containers/product/Product.tsx
// Ensotek – Products section (Home / Landing)
//   - Data: products (module: product)
//   - i18n: site_settings.key = "ui_products"
//   - Category bazlı filtre için optional categoryId prop
//   - Locale-aware routes with localizePath
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

// Haberlerde olduğu gibi; sadece hero boş kalırsa devreye girecek
import FallbackCover from 'public/img/blog/1/blog-01.jpg';

const CARD_W = 720;
const CARD_H = 480;

export interface ProductSectionProps {
  /** İstenirse sadece belli bir kategori ürünleri listelensin */
  categoryId?: string;
}

const toLocaleShort = (l: unknown) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'de';

type ProductCardVM = {
  id: string;
  slug: string;
  title: string;
  hero: string;
  alt: string;
  price?: any;
};

const Product: React.FC<ProductSectionProps> = ({ categoryId }) => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  // UI yazıları → site_settings.key = "ui_products"
  const { ui } = useUiSection('ui_products', locale);

  const kickerPrefix = ui('ui_products_kicker_prefix', 'Ensotek');
  const kickerLabel = ui(
    'ui_products_kicker_label',
    locale === 'de' ? 'Ürünlerimiz' : 'Our Products',
  );

  const titlePrefix = ui('ui_products_title_prefix', locale === 'de' ? 'Su Soğutma' : 'Cooling');
  const titleMark = ui('ui_products_title_mark', locale === 'de' ? 'Kuleleri' : 'Towers');

  const readMore = ui(
    'ui_products_read_more',
    locale === 'de' ? 'Detayları görüntüle' : 'View details',
  );
  const readMoreAria = ui(
    'ui_products_read_more_aria',
    locale === 'de' ? 'ürün detayını görüntüle' : 'view product details',
  );

  const viewAllText = ui('ui_products_view_all', locale === 'de' ? 'Tüm Ürünler' : 'All products');

  const emptyText = ui(
    'ui_products_empty',
    locale === 'de'
      ? 'Şu anda görüntülenecek ürün bulunmamaktadır.'
      : 'There are no products to display at the moment.',
  );

  // Ürün listesi – optional kategori filtresi
  const { data, isLoading } = useListProductsQuery({
    is_active: 1,
    locale, // ✅ short locale
    limit: 6,
    ...(categoryId ? { category_id: categoryId } : {}),
  });

  const items: ProductCardVM[] = useMemo(() => {
    const list: ProductDto[] = (data?.items ?? []) as any;

    return list
      .filter((p) => !!p && !!p.is_active)
      .slice(0, 3)
      .map((p) => {
        const title = String(p.title || '').trim();
        const slug = String(p.slug || '').trim();

        const imgRaw =
          String(p.image_url || '').trim() || String((p.images && p.images[0]) || '').trim();

        const hero = (imgRaw && (toCdnSrc(imgRaw, CARD_W, CARD_H, 'fill') || imgRaw)) || '';

        return {
          id: String((p as any).id ?? ''),
          slug,
          title,
          price: (p as any).price,
          hero,
          alt: String((p as any).alt || title || 'product image'),
        };
      });
  }, [data?.items]);

  const productListHref = useMemo(() => localizePath(locale, '/product'), [locale]);

  return (
    <section className="product__area pt-120 pb-90">
      <div className="container">
        {/* Başlık */}
        <div className="row" data-aos="fade-up" data-aos-delay="200">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>{kickerPrefix}</span> {kickerLabel}
              </span>
              <h2 className="section__title">
                {titlePrefix} <span className="down__mark-line">{titleMark}</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {!isLoading && items.length === 0 && (
            <div className="col-12">
              <p className="text-center">{emptyText}</p>
            </div>
          )}

          {items.map((p) => {
            const href = p.slug
              ? localizePath(locale, `/product/${encodeURIComponent(p.slug)}`)
              : productListHref;

            return (
              <div className="col-xl-4 col-lg-4 col-md-6" key={p.id || p.slug}>
                <div className="product__item mb-30">
                  <div className="product__thumb w-img mb-20">
                    <Image
                      src={(p.hero as any) || (FallbackCover as any)}
                      alt={p.alt}
                      width={CARD_W}
                      height={CARD_H}
                      style={{ width: '100%', height: 'auto' }}
                      loading="lazy"
                    />
                  </div>

                  <div className="product__content">
                    <h3 className="product__title">
                      <Link href={href}>{p.title}</Link>
                    </h3>

                    <div className="product__meta" style={{ marginTop: 8, marginBottom: 10 }} />

                    <Link
                      href={href}
                      className="link-more"
                      aria-label={`${p.title} — ${readMoreAria}`}
                    >
                      {readMore} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="col-12" aria-hidden>
              <SkeletonStack>
                <SkeletonLine style={{ height: 16 }} />
              </SkeletonStack>
            </div>
          )}
        </div>

        {/* Tüm ürünler CTA */}
        <div className="row" style={{ marginTop: 24 }}>
          <div className="col-12">
            <div className="project__view text-lg-end">
              <Link className="solid__btn" href={productListHref}>
                {viewAllText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
