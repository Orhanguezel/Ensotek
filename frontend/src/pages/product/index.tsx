// =============================================================
// FILE: src/pages/product/index.tsx
// Ensotek – Products Page (list) [FINAL / STANDARD]
// - Route: /product
// - ✅ NO <Head>
// - ✅ Page SEO overrides via <LayoutSeoBridge />
// - ✅ General meta/canonical/hreflang/etc. stays in Layout/_document (no duplication)
// - Content: ProductPageContent itemType="product"
// - SEO priority (list):
//   title: ui_products_meta_title -> ui_products_page_title -> fallback
//   desc : ui_products_meta_description -> Layout default
//   og   : (optional) ui_products_og_image -> undefined (Layout decides)
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/components/layout/banner/Breadcrum';
import ProductPageContent from '@/components/containers/product/ProductPageContent';
import Feedback from '@/components/containers/feedback/Feedback';

// ✅ Page -> Layout SEO overrides (STANDARD)
import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

// i18n + UI
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// helpers
import { toCdnSrc } from '@/shared/media';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

const ProductPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_products', locale as any);

  // -----------------------------
  // Banner title
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_products_page_title';
    const v = safeStr(ui(key, 'Products'));
    return isValidUiText(v, key) ? v : 'Products';
  }, [ui]);

  // -----------------------------
  // SEO overrides (list)
  // - empty => Layout defaults
  // -----------------------------
  const pageTitle = useMemo(() => {
    const key = 'ui_products_meta_title';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;

    return bannerTitle || 'Products';
  }, [ui, bannerTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_products_meta_description';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;

    // empty => Layout default description
    return '';
  }, [ui]);

  const ogImageOverride = useMemo(() => {
    const key = 'ui_products_og_image';
    const raw = safeStr(ui(key, ''));
    if (!raw) return undefined;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [ui]);

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />

      <ProductPageContent itemType="product" uiSectionKey="ui_products" basePath="/product" />

      <Feedback />
    </>
  );
};

export default ProductPage;
