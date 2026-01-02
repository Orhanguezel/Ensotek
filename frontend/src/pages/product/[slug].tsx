// =============================================================
// FILE: src/pages/product/[slug].tsx
// Ensotek – Product Detail Page [FINAL / STANDARD] (NO DUPLICATE FETCH)
// - Route: /product/[slug]
// - ✅ NO <Head>
// - ✅ Page SEO overrides via <LayoutSeoBridge /> (UI fallbacks only)
// - ✅ NO getProductBySlug query here (ProductDetail is single source)
// - ✅ 404/error UI handled inside <ProductDetail />
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Banner from '@/layout/banner/Breadcrum';
import ProductDetail from '@/components/containers/product/ProductDetail';
import ProductMore from '@/components/containers/product/ProductMore';
import ServiceCta from '@/components/containers/cta/ServiceCta';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

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

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = router.isReady && !!slug;

  // ✅ same item_type detection as ProductDetail
  const itemType = useMemo<'product' | 'sparepart'>(() => {
    const p = safeStr(router.pathname);
    const a = safeStr(router.asPath);
    if (p.startsWith('/sparepart') || a.startsWith('/sparepart')) return 'sparepart';
    return 'product';
  }, [router.pathname, router.asPath]);

  const uiSectionKey = itemType === 'sparepart' ? 'ui_spareparts' : 'ui_products';
  const { ui } = useUiSection(uiSectionKey as any, locale as any);

  // -----------------------------
  // UI fallbacks (page-level SEO and banner)
  // -----------------------------
  const listTitleFallback = useMemo(() => {
    const key = itemType === 'sparepart' ? 'ui_spareparts_page_title' : 'ui_products_page_title';
    const def = itemType === 'sparepart' ? 'Spare Parts' : 'Products';
    const v = safeStr(ui(key, def));
    return isValidUiText(v, key) ? v : def;
  }, [ui, itemType]);

  const detailTitleFallback = useMemo(() => {
    const key =
      itemType === 'sparepart'
        ? 'ui_spareparts_detail_page_title'
        : 'ui_products_detail_page_title';
    const def = itemType === 'sparepart' ? 'Spare Part' : 'Product';
    const v = safeStr(ui(key, def));
    return isValidUiText(v, key) ? v : def;
  }, [ui, itemType]);

  const bannerTitle = useMemo(() => {
    // Page does not fetch product; keep deterministic banner fallback
    const d = safeStr(detailTitleFallback);
    if (d) return d;
    return listTitleFallback || (itemType === 'sparepart' ? 'Spare Part' : 'Product');
  }, [detailTitleFallback, listTitleFallback, itemType]);

  const pageTitle = useMemo(() => {
    // No product meta here; rely on UI fallbacks
    return bannerTitle || (itemType === 'sparepart' ? 'Spare Part' : 'Product');
  }, [bannerTitle, itemType]);

  const pageDescription = useMemo(() => {
    const key =
      itemType === 'sparepart'
        ? 'ui_spareparts_detail_meta_description'
        : 'ui_products_detail_meta_description';

    const def =
      itemType === 'sparepart'
        ? 'View spare part details, technical specifications, and request a quote.'
        : 'View product details, technical specifications, and request a quote.';

    const v = safeStr(ui(key, def));
    return isValidUiText(v, key) ? v : def;
  }, [ui, itemType]);

  // Page-level skeleton: only while slug isn't ready
  if (!isSlugReady) {
    return <Skeleton />;
  }

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={undefined}
        noindex={false}
      />

      <Banner title={bannerTitle} />

      <ProductDetail />
      <ProductMore />
      <ServiceCta />
    </>
  );
};

export default ProductDetailPage;
