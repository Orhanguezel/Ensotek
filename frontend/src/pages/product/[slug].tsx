// =============================================================
// FILE: src/pages/product/[slug].tsx
// Ensotek – Product Detail Page + SEO (HOOK-SAFE)
//   - Route: /product/[slug]
//   - Layout is provided by _app.tsx (do NOT wrap here)
//   - Page-specific title/desc via next/head (override Layout defaults)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import ProductDetail from '@/components/containers/product/ProductDetail';
import ProductMore from '@/components/containers/product/ProductMore';
import Feedback from '@/components/containers/feedback/Feedback';
import ServiceCta from '@/components/containers/cta/ServiceCta';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// data
import { useGetSiteSettingByKeyQuery, useGetProductBySlugQuery } from '@/integrations/rtk/hooks';

// helpers
import { excerpt } from '@/shared/text';
import { asObj } from '@/seo/pageSeo';

const toLocaleShort = (l: any) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

const ProductDetailPage: React.FC = () => {
  const router = useRouter();

  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_products', locale);

  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === 'string' ? slugParam : Array.isArray(slugParam) ? slugParam[0] ?? '' : '';

  const isSlugReady = Boolean(slug);

  const listTitleFallback = ui('ui_products_page_title', locale === 'tr' ? 'Ürünler' : 'Products');
  const detailTitleFallback = ui(
    'ui_products_detail_page_title',
    locale === 'tr' ? 'Ürün Detayı' : 'Product',
  );

  // Global SEO settings (fallback desc)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  const { data: product } = useGetProductBySlugQuery({ slug, locale }, { skip: !isSlugReady });

  const bannerTitle = useMemo(() => {
    const t = String(product?.title ?? '').trim();
    return t || detailTitleFallback || listTitleFallback;
  }, [product, detailTitleFallback, listTitleFallback]);

  const pageTitle = useMemo(() => {
    if (!isSlugReady) return String(listTitleFallback).trim();

    const metaTitle = String(product?.meta_title ?? '').trim();
    const title = String(product?.title ?? '').trim();
    return metaTitle || title || String(bannerTitle).trim();
  }, [isSlugReady, listTitleFallback, product, bannerTitle]);

  const pageDesc = useMemo(() => {
    if (!isSlugReady) return String(seo?.description ?? '').trim() || '';

    const metaDesc = String(product?.meta_description ?? '').trim();
    const desc = String(product?.description ?? '').trim();
    return metaDesc || excerpt(desc, 160).trim() || String(seo?.description ?? '').trim() || '';
  }, [isSlugReady, product, seo]);

  return (
    <>
      {/* ✅ Override Layout defaults (Layout still owns canonical/og/hreflang) */}
      <Head>
        <title key="title">{pageTitle}</title>
        <meta key="description" name="description" content={pageDesc} />
      </Head>

      <Banner title={bannerTitle} />

      {!isSlugReady ? (
        <div className="service__area pt-120 pb-90">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="skeleton-line" style={{ height: 24 }} />
                <div className="skeleton-line mt-10" style={{ height: 16 }} />
                <div className="skeleton-line mt-10" style={{ height: 16 }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ProductDetail />
          <ProductMore />
          <Feedback />
          <ServiceCta />
        </>
      )}
    </>
  );
};

export default ProductDetailPage;
