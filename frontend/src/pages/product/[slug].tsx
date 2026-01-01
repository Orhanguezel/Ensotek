// =============================================================
// FILE: src/pages/product/[slug].tsx
// Ensotek – Product Detail Page [FINAL / STANDARD]
// - Route: /product/[slug]
// - ✅ NO <Head>
// - ✅ Page SEO overrides via <LayoutSeoBridge />
// - ✅ General meta/canonical/hreflang/etc. stays in Layout/_document (no duplication)
// - SEO priority (detail):
//   title: product.meta_title -> product.title -> ui_products_detail_page_title -> ui_products_page_title -> fallback
//   desc : product.meta_description -> excerpt(product.description) -> ui fallback -> Layout default
//   og   : product.featured_image || product.image_url -> undefined (Layout decides)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import ProductDetail from '@/components/containers/product/ProductDetail';
import ProductMore from '@/components/containers/product/ProductMore';
import ServiceCta from '@/components/containers/cta/ServiceCta';

// ✅ Page -> Layout SEO overrides (STANDARD)
import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

// i18n + UI
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// data
import { useGetProductBySlugQuery } from '@/integrations/rtk/hooks';

// helpers
import { excerpt } from '@/shared/text';
import { toCdnSrc } from '@/shared/media';

// ✅ shared skeleton (NO inline styles)
import Skeleton from '@/components/common/public/Skeleton';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q.trim();
  if (Array.isArray(q)) return String(q[0] ?? '').trim();
  return '';
}

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_products', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = router.isReady && !!slug;

  // Product data
  const { data: product, isFetching } = useGetProductBySlugQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  // -----------------------------
  // UI fallbacks
  // -----------------------------
  const listTitleFallback = useMemo(() => {
    const key = 'ui_products_page_title';
    const v = safeStr(ui(key, 'Products'));
    return isValidUiText(v, key) ? v : 'Products';
  }, [ui]);

  const detailTitleFallback = useMemo(() => {
    const key = 'ui_products_detail_page_title';
    const v = safeStr(ui(key, 'Product'));
    return isValidUiText(v, key) ? v : 'Product';
  }, [ui]);

  // -----------------------------
  // Banner title
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const t = safeStr((product as any)?.title);
    if (t) return t;

    const d = safeStr(detailTitleFallback);
    if (d) return d;

    return listTitleFallback || 'Product';
  }, [product, detailTitleFallback, listTitleFallback]);

  // -----------------------------
  // SEO overrides (detail)
  // - empty => Layout defaults
  // -----------------------------
  const pageTitle = useMemo(() => {
    if (!isSlugReady) return listTitleFallback || 'Products';

    const mt = safeStr((product as any)?.meta_title);
    if (mt) return mt;

    const t = safeStr((product as any)?.title);
    if (t) return t;

    const d = safeStr(detailTitleFallback);
    if (d) return d;

    return listTitleFallback || 'Product';
  }, [isSlugReady, product, detailTitleFallback, listTitleFallback]);

  const pageDescription = useMemo(() => {
    if (!isSlugReady) return '';

    const md = safeStr((product as any)?.meta_description);
    if (md) return md;

    const desc = safeStr((product as any)?.description);
    if (desc) {
      const ex = excerpt(desc, 160).trim();
      if (ex) return ex;
    }

    // Optional UI fallback
    const key = 'ui_products_detail_meta_description';
    const uiFallback = safeStr(
      ui(key, 'View product details, technical specifications, and request a quote.'),
    );
    if (isValidUiText(uiFallback, key)) return uiFallback;

    // empty => Layout default description
    return '';
  }, [isSlugReady, product, ui]);

  const ogImageOverride = useMemo(() => {
    if (!isSlugReady) return undefined;

    const raw =
      safeStr((product as any)?.featured_image) || safeStr((product as any)?.image_url) || '';
    if (!raw) return undefined;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [isSlugReady, product]);

  const showSkeleton = !isSlugReady || isFetching || !product;

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />

      {showSkeleton ? (
        <Skeleton />
      ) : (
        <>
          <ProductDetail />
          <ProductMore />
          <ServiceCta />
        </>
      )}
    </>
  );
};

export default ProductDetailPage;
