// =============================================================
// FILE: src/pages/product/index.tsx
// Ensotek – Products Page (full list) + SEO (HOOK-SAFE)
//   - Route: /product
//   - Page-specific title/desc via next/head (override Layout defaults)
//   - Canonical/og:url/hreflang: single source = _document (SSR) / Layout filtering
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import ProductPageContent from '@/components/containers/product/ProductPageContent';
import Feedback from '@/components/containers/feedback/Feedback';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// data
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

// seo helpers
import { asObj } from '@/seo/pageSeo';

const toLocaleShort = (l: unknown) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

const ProductPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_products', locale);

  const bannerTitle = useMemo(
    () => ui('ui_products_page_title', locale === 'tr' ? 'Ürünlerimiz' : 'Products'),
    [ui, locale],
  );

  // Global SEO settings (only fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // ✅ LIST META = UI (static)
  const pageTitle = useMemo(() => {
    const t = String(ui('ui_products_meta_title', '')).trim();
    return t || String(bannerTitle).trim();
  }, [ui, bannerTitle]);

  const pageDesc = useMemo(() => {
    const d = String(ui('ui_products_meta_description', '')).trim();
    return d || String((seo as any)?.description ?? '').trim() || '';
  }, [ui, seo]);

  return (
    <>
      <Head>
        <title key="title">{pageTitle}</title>
        <meta key="description" name="description" content={pageDesc} />
      </Head>

      <Banner title={bannerTitle} />
      <ProductPageContent />
      <Feedback />
    </>
  );
};

export default ProductPage;
