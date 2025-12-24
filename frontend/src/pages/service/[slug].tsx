// =============================================================
// FILE: src/pages/service/[slug].tsx
// Public Service Detail Page (by slug) + SEO (product pattern)
//   - Route: /service/[slug]
//   - Data source: services/by-slug (single source of truth)
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
  useGetServiceBySlugPublicQuery,
} from '@/integrations/rtk/hooks';

// helpers
import { excerpt } from '@/shared/text';
import { asObj } from '@/seo/pageSeo';
import { toCdnSrc } from '@/shared/media';
import { normLocaleTag } from '@/i18n/localeUtils';

// ui skeleton
import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';

const toLocaleShort = (l: unknown) =>
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
  const slug = useMemo(() => {
    if (typeof slugParam === 'string') return slugParam;
    if (Array.isArray(slugParam)) return slugParam[0] ?? '';
    return '';
  }, [slugParam]);

  const isSlugReady = !!slug;

  // ✅ default_locale DB’den
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' });
  const defaultLocale = useMemo(() => {
    const v = normLocaleTag(defaultLocaleRow?.value);
    return v || 'tr';
  }, [defaultLocaleRow?.value]);

  // Global SEO settings (desc fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // ✅ Service data (single source)
  const { data: service } = useGetServiceBySlugPublicQuery(
    { slug, locale, default_locale: defaultLocale },
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
    return safeStr(service?.name) || safeStr(detailTitleFallback) || safeStr(listTitleFallback);
  }, [service?.name, detailTitleFallback, listTitleFallback]);

  const pageTitle = useMemo(() => {
    if (!isSlugReady) return safeStr(listTitleFallback);

    return (
      safeStr((service as any)?.meta_title) ||
      safeStr(service?.name) ||
      safeStr(bannerTitle) ||
      safeStr(detailTitleFallback) ||
      safeStr(listTitleFallback)
    );
  }, [isSlugReady, listTitleFallback, service, bannerTitle, detailTitleFallback]);

  const pageDesc = useMemo(() => {
    const globalDesc = safeStr((seo as any)?.description) || '';

    if (!isSlugReady) return globalDesc;

    const metaDesc = safeStr((service as any)?.meta_description);

    const summary =
      safeStr((service as any)?.description) || safeStr((service as any)?.includes) || '';

    return metaDesc || (summary ? excerpt(summary, 160).trim() : '') || globalDesc;
  }, [isSlugReady, service, seo]);

  const ogImage = useMemo(() => {
    if (!isSlugReady) return '';

    const imgRaw = safeStr(
      (service as any)?.featured_image_url ||
        (service as any)?.image_url ||
        (service as any)?.featured_image,
    );

    if (!imgRaw) return '';
    return toCdnSrc(imgRaw, 1200, 630, 'fill') || imgRaw;
  }, [isSlugReady, service]);

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
                <SkeletonStack>
                  <SkeletonLine style={{ height: 24 }} />
                  <SkeletonLine className="mt-10" style={{ height: 16 }} />
                  <SkeletonLine className="mt-10" style={{ height: 16 }} />
                </SkeletonStack>
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
