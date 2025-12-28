// =============================================================
// FILE: src/pages/service/[slug].tsx
// Public Service Detail Page (by slug) + SEO (NEWS/PRODUCT pattern)
//   - Route: /service/[slug]
//   - i18n: useLocaleShort() + site_settings.ui_services
//   - SEO: seo -> site_seo fallback + service(meta_*) override (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
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
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import {
  useGetSiteSettingByKeyQuery,
  useGetServiceBySlugPublicQuery,
} from '@/integrations/rtk/hooks';

// helpers
import { excerpt } from '@/shared/text';
import { toCdnSrc } from '@/shared/media';

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

function pickServiceImage(service: any): string {
  return (
    safeStr(service?.featured_image_url) ||
    safeStr(service?.image_url) ||
    safeStr(service?.featured_image) ||
    ''
  );
}

const ServiceDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_services', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug).trim(), [router.query.slug]);
  const isSlugReady = !!slug;

  // ✅ default_locale DB’den (locale bağımsız)
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' });

  const defaultLocale = useMemo(() => {
    // useLocaleShort zaten normalize ediyor; burada sadece string trim + fallback yeterli
    const v = safeStr(defaultLocaleRow?.value);
    return v || 'de';
  }, [defaultLocaleRow?.value]);

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // ✅ Service data (single source)
  const { data: service, isLoading: isServiceLoading } = useGetServiceBySlugPublicQuery(
    { slug, locale, default_locale: defaultLocale },
    { skip: !isSlugReady },
  );

  // UI fallbacks
  const listTitleFallback = ui('ui_services_page_title', 'Services');
  const detailTitleFallback = ui('ui_services_detail_page_title', 'Service Detail');

  const bannerTitle = useMemo(() => {
    return (
      safeStr((service as any)?.name) ||
      safeStr((service as any)?.title) || // bazı projelerde name/title olabiliyor
      safeStr(detailTitleFallback) ||
      safeStr(listTitleFallback) ||
      'Service'
    );
  }, [service, detailTitleFallback, listTitleFallback]);

  // --- SEO fields ---
  const pageTitleRaw = useMemo(() => {
    const fallback = safeStr(detailTitleFallback) || safeStr(listTitleFallback) || 'Service';

    if (!isSlugReady) return fallback;

    return (
      safeStr((service as any)?.meta_title) ||
      safeStr((service as any)?.name) ||
      safeStr((service as any)?.title) ||
      safeStr(bannerTitle) ||
      fallback
    );
  }, [isSlugReady, service, bannerTitle, detailTitleFallback, listTitleFallback]);

  const pageDescRaw = useMemo(() => {
    const globalDesc = safeStr((seo as any)?.description) || '';

    if (!isSlugReady) return globalDesc;

    const metaDesc = safeStr((service as any)?.meta_description);

    const summary =
      safeStr((service as any)?.description) ||
      safeStr((service as any)?.includes) ||
      safeStr((service as any)?.summary) ||
      '';

    const uiFallback = safeStr(
      ui(
        'ui_services_detail_meta_description',
        'Explore the service details and contact us for tailored support and consultation.',
      ),
    );

    return (
      metaDesc || (summary ? excerpt(summary, 160).trim() : '') || uiFallback || globalDesc || ''
    );
  }, [isSlugReady, service, seo, ui]);

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

    const rawImg = pickServiceImage(service as any);
    const img = rawImg ? toCdnSrc(rawImg, 1200, 630, 'fill') || rawImg : '';

    return (img && absUrl(img)) || fallback || absUrl('/favicon.svg');
  }, [service, seo]);

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

  const isLoadingState = !isSlugReady || (isServiceLoading && !service);

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
          <ServiceDetail slug={slug} />
          <ServiceMore currentSlug={slug} />
          <ServiceCta />
        </>
      )}
    </>
  );
};

export default ServiceDetailPage;
