// =============================================================
// FILE: src/pages/product/[slug].tsx
// Ensotek – Product Detail Page + SEO (HOOK-SAFE)
//   - Route: /product/[slug]
//   - Page-specific title/desc via next/head
//   - Canonical/og:url/hreflang: single source = _document (SSR) / Layout filtering
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

// ui skeleton
import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';

const toLocaleShort = (l: unknown) =>
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
  const slug = useMemo(() => {
    if (typeof slugParam === 'string') return slugParam;
    if (Array.isArray(slugParam)) return slugParam[0] ?? '';
    return '';
  }, [slugParam]);

  const isSlugReady = !!slug;

  const listTitleFallback = useMemo(
    () => ui('ui_products_page_title', locale === 'tr' ? 'Ürünler' : 'Products'),
    [ui, locale],
  );

  const detailTitleFallback = useMemo(
    () => ui('ui_products_detail_page_title', locale === 'tr' ? 'Ürün Detayı' : 'Product'),
    [ui, locale],
  );

  const detailMetaTitleFallback = useMemo(
    () => ui('ui_products_detail_meta_title', detailTitleFallback),
    [ui, detailTitleFallback],
  );

  const detailMetaDescFallback = useMemo(
    () =>
      ui(
        'ui_products_detail_meta_description',
        locale === 'tr'
          ? 'Ürün detayları, teknik özellikler ve teklif talebi için inceleyiniz.'
          : 'View product details, technical specifications, and request a quote.',
      ),
    [ui, locale],
  );

  // Global SEO settings (final fallback desc)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  const { data: product, isLoading: isProductLoading } = useGetProductBySlugQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  const bannerTitle = useMemo(() => {
    const t = String(product?.title ?? '').trim();
    return t || detailTitleFallback || listTitleFallback;
  }, [product?.title, detailTitleFallback, listTitleFallback]);

  const pageTitle = useMemo(() => {
    if (!isSlugReady) return String(detailTitleFallback || listTitleFallback).trim();

    const metaTitle = String((product as any)?.meta_title ?? '').trim();
    const title = String(product?.title ?? '').trim();

    // ✅ primary: product meta/title; fallback: UI fallback
    return (
      metaTitle || title || String(detailMetaTitleFallback).trim() || String(bannerTitle).trim()
    );
  }, [
    isSlugReady,
    detailTitleFallback,
    listTitleFallback,
    product,
    detailMetaTitleFallback,
    bannerTitle,
  ]);

  const pageDesc = useMemo(() => {
    const globalDesc = String((seo as any)?.description ?? '').trim();

    if (!isSlugReady) return globalDesc || '';

    const metaDesc = String((product as any)?.meta_description ?? '').trim();
    const desc = String((product as any)?.description ?? '').trim();

    // ✅ primary: product meta/description excerpt; fallback: UI fallback; last: global seo
    return (
      metaDesc ||
      excerpt(desc, 160).trim() ||
      String(detailMetaDescFallback).trim() ||
      globalDesc ||
      ''
    );
  }, [isSlugReady, product, seo, detailMetaDescFallback]);

  return (
    <>
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
                <SkeletonStack>
                  <SkeletonLine style={{ height: 24 }} />
                  <SkeletonLine className="mt-10" style={{ height: 16 }} />
                  <SkeletonLine className="mt-10" style={{ height: 16 }} />
                </SkeletonStack>
              </div>
            </div>
          </div>
        </div>
      ) : isProductLoading && !product ? (
        <div className="service__area pt-120 pb-90">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <SkeletonStack>
                  <SkeletonLine style={{ height: 24 }} />
                  <SkeletonLine className="mt-10" style={{ height: 16 }} />
                  <SkeletonLine className="mt-10" style={{ height: 16, width: '80%' }} />
                </SkeletonStack>
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
