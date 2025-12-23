// =============================================================
// FILE: src/pages/service/[slug].tsx
// Public Service Detail Page (by slug) + SEO (product pattern)
//   - Route: /service/[slug]
//   - Data: custom_pages/by-slug (module_key="service")
//   - Layout is provided by _app.tsx (do NOT wrap here)
//   - Page-specific SEO override via next/head (title/description/og:image)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import ServiceDetail from '@/components/containers/service/ServiceDetail';
import ServiceMore from '@/components/containers/service/ServiceMore';
import ServiceCta from '@/components/containers/cta/ServiceCta';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// data
import {
  useGetSiteSettingByKeyQuery,
  useGetCustomPageBySlugPublicQuery,
} from '@/integrations/rtk/hooks';

// helpers
import { excerpt } from '@/shared/text';
import { asObj } from '@/seo/pageSeo';
import { toCdnSrc } from '@/shared/media';

const toLocaleShort = (l: any) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

const ServiceDetailPage: React.FC = () => {
  const router = useRouter();

  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_services', locale);

  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === 'string' ? slugParam : Array.isArray(slugParam) ? slugParam[0] ?? '' : '';
  const isSlugReady = Boolean(slug);

  // Global SEO settings (desc fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // Page data
  const { data: page } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  // UI fallbacks
  const listTitleFallback = ui(
    'ui_services_page_title',
    locale === 'tr' ? 'Hizmetler' : 'Services',
  );
  const detailTitleFallback = ui(
    'ui_services_detail_page_title',
    locale === 'tr' ? 'Hizmet Detayı' : 'Service Detail',
  );

  const bannerTitle = useMemo(() => {
    return safeStr(page?.title) || safeStr(detailTitleFallback) || safeStr(listTitleFallback);
  }, [page?.title, detailTitleFallback, listTitleFallback]);

  const pageTitle = useMemo(() => {
    if (!isSlugReady) return safeStr(listTitleFallback);

    return (
      safeStr(page?.meta_title) ||
      safeStr(page?.title) ||
      safeStr(bannerTitle) ||
      safeStr(detailTitleFallback) ||
      safeStr(listTitleFallback)
    );
  }, [
    isSlugReady,
    listTitleFallback,
    page?.meta_title,
    page?.title,
    bannerTitle,
    detailTitleFallback,
  ]);

  const pageDesc = useMemo(() => {
    if (!isSlugReady) return safeStr(seo?.description) || '';

    return (
      safeStr(page?.meta_description) ||
      safeStr(page?.summary) ||
      safeStr(excerpt(page?.content_html ?? '', 160)) ||
      safeStr(seo?.description) ||
      ''
    );
  }, [isSlugReady, page?.meta_description, page?.summary, page?.content_html, seo?.description]);

  const ogImage = useMemo(() => {
    if (!isSlugReady) return '';

    const pageImgRaw = safeStr(page?.featured_image);
    if (!pageImgRaw) return '';

    return toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw;
  }, [isSlugReady, page?.featured_image]);

  return (
    <>
      {/* ✅ Override Layout defaults (Layout still owns canonical/hreflang/og:url) */}
      <Head>
        <title key="title">{pageTitle}</title>
        <meta key="description" name="description" content={pageDesc} />
        {ogImage ? <meta key="og:image" property="og:image" content={ogImage} /> : null}
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
          <ServiceDetail slug={slug} />
          <ServiceMore currentSlug={slug} />
          <ServiceCta />
        </>
      )}
    </>
  );
};

export default ServiceDetailPage;
