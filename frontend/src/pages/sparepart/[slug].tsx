// =============================================================
// FILE: src/pages/sparepart/[slug].tsx
// Ensotek – Sparepart Detail Page (by slug) + SEO
//   - Route: /sparepart/[slug]
//   - i18n: useLocaleShort() + site_settings.ui_spareparts
//   - SEO: seo -> site_seo fallback + product(meta_*) override (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import ProductDetail from '@/components/containers/product/ProductDetail';
import ProductMore from '@/components/containers/product/ProductMore';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import { useGetSiteSettingByKeyQuery, useGetProductBySlugQuery } from '@/integrations/rtk/hooks';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// ui skeleton
import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q;
  if (Array.isArray(q)) return String(q[0] ?? '');
  return '';
}

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

function firstImageFromAny(product: any): string {
  const raw1 = safeStr(product?.image_url);
  if (raw1) return raw1;

  const images = Array.isArray(product?.images) ? product.images : [];
  const raw2 = safeStr(images?.[0]);
  if (raw2) return raw2;

  const raw3 = safeStr(product?.featured_image);
  return raw3;
}

const SparepartDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_spareparts', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug).trim(), [router.query.slug]);
  const isSlugReady = !!slug;

  // UI fallbacks (minimum; DB/UI overrides should win)
  const listTitleFallback = ui('ui_spareparts_page_title', 'Spare Parts');
  const detailTitleFallback = ui('ui_spareparts_detail_page_title', 'Spare Part');

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // Item data
  const { data: product, isLoading: isLoadingItem } = useGetProductBySlugQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  const bannerTitle = useMemo(() => {
    return (
      safeStr((product as any)?.title) ||
      safeStr(detailTitleFallback) ||
      safeStr(listTitleFallback) ||
      'Spare Part'
    );
  }, [product, detailTitleFallback, listTitleFallback]);

  // --- SEO fields ---
  const pageTitleRaw = useMemo(() => {
    const globalFallback =
      safeStr(detailTitleFallback) || safeStr(listTitleFallback) || 'Spare Part';

    if (!isSlugReady) return globalFallback;

    return (
      safeStr((product as any)?.meta_title) ||
      safeStr((product as any)?.title) ||
      safeStr(bannerTitle) ||
      globalFallback
    );
  }, [isSlugReady, product, bannerTitle, detailTitleFallback, listTitleFallback]);

  const pageDescRaw = useMemo(() => {
    const globalDesc = safeStr((seo as any)?.description) || '';

    if (!isSlugReady) return globalDesc;

    const metaDesc = safeStr((product as any)?.meta_description);
    const desc = safeStr((product as any)?.description);

    const uiFallback = safeStr(
      ui(
        'ui_spareparts_detail_meta_description',
        'View spare part details, technical specifications, and request a quote.',
      ),
    );

    return metaDesc || (desc ? excerpt(desc, 160).trim() : '') || uiFallback || globalDesc || '';
  }, [isSlugReady, product, seo, ui]);

  const seoSiteName = useMemo(() => safeStr((seo as any)?.site_name) || 'Ensotek', [seo]);
  const titleTemplate = useMemo(
    () => safeStr((seo as any)?.title_template) || '%s | Ensotek',
    [seo],
  );

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return safeStr(t);
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    const rawImg = firstImageFromAny(product as any);
    const img = rawImg ? toCdnSrc(rawImg, 1200, 630, 'fill') || rawImg : '';

    return (img && absUrl(img)) || fallback || absUrl('/favicon.svg');
  }, [product, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
    const noindex = typeof (robots as any).noindex === 'boolean' ? (robots as any).noindex : false;

    // ✅ canonical + og:url YOK (tek kaynak: _document SSR)
    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,

      twitterCard: safeStr((tw as any).card) || 'summary_large_image',
      twitterSite: typeof (tw as any).site === 'string' ? (tw as any).site.trim() : undefined,
      twitterCreator:
        typeof (tw as any).creator === 'string' ? (tw as any).creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, ogImage, seoSiteName]);

  const isLoadingState = !isSlugReady || (isLoadingItem && !product);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {headSpecs.map((spec, idx) => {
          if (spec.kind === 'link') {
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          }
          if (spec.kind === 'meta-name') {
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          }
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}
      </Head>

      <Banner title={bannerTitle} />

      {isLoadingState ? (
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
        </>
      )}
    </>
  );
};

export default SparepartDetailPage;
