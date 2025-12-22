// =============================================================
// FILE: src/pages/service/index.tsx
// Public Services Page (list) + SEO
// =============================================================

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import Service from '@/components/containers/service/Service';
import ServiceMore from '@/components/containers/service/ServiceMore';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import {
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery,
  useGetDefaultLocalePublicQuery,
} from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';
import { normLocaleTag } from '@/i18n/localeUtils';

const SERVICE_PATH = '/service';
const SERVICE_MODULE_KEY = 'service';

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

function ensureMinDescription(desc: string, minLen = 20): string {
  const d = safeStr(desc);
  if (d.length >= minLen) return d;
  return 'Explore our services and solutions. Contact us for tailored support and consultation.';
}

/**
 * ✅ Default locale prefixless canonical:
 * - default locale => "/service"
 * - other locales  => "/{locale}/service"
 */
function canonicalPathFor(locale: string, defaultLocale: string, pathname: string): string {
  const loc = normLocaleTag(locale);
  const def = normLocaleTag(defaultLocale);

  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (loc && def && loc === def) return p;
  if (!loc) return p;
  return p === '/' ? `/${loc}` : `/${loc}${p}`;
}

const ServicePage: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();
  const { ui } = useUiSection('ui_services', locale);

  const bannerTitle = ui('ui_services_page_title', 'Services');

  // ✅ default locale META (public endpoint)
  const { data: defaultLocaleMeta } = useGetDefaultLocalePublicQuery();
  const defaultLocale = useMemo(() => {
    const d = normLocaleTag(defaultLocaleMeta);
    return d || 'tr';
  }, [defaultLocaleMeta]);

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // Services list (meta override için ilk published kayıt)
  const { data: serviceData } = useListCustomPagesPublicQuery({
    module_key: SERVICE_MODULE_KEY,
    locale,
    limit: 10,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const primary = useMemo(() => {
    const items: CustomPageDto[] = (serviceData?.items ?? []) as any;
    const published = items.filter((p) => Boolean(p?.is_published));
    return published[0];
  }, [serviceData]);

  const pageTitleRaw = useMemo(() => {
    return (
      safeStr(primary?.meta_title) || safeStr(primary?.title) || safeStr(bannerTitle) || 'Services'
    );
  }, [primary?.meta_title, primary?.title, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const fromPrimary =
      safeStr(primary?.meta_description) ||
      safeStr(primary?.summary) ||
      safeStr(excerpt(primary?.content_html ?? '', 160)) ||
      safeStr(seo?.description);

    const uiFallback = safeStr(
      ui(
        'ui_services_page_description',
        'Explore our services and solutions. Contact us for tailored support and consultation.',
      ),
    );

    return ensureMinDescription(fromPrimary || uiFallback, 20);
  }, [primary?.meta_description, primary?.summary, primary?.content_html, seo?.description, ui]);

  // ✅ Canonical: default locale prefixless
  const canonical = useMemo(() => {
    const path = canonicalPathFor(locale, defaultLocale, SERVICE_PATH);
    return absUrl(path);
  }, [locale, defaultLocale]);

  const seoSiteName = safeStr(seo?.site_name) || 'Ensotek';
  const titleTemplate = safeStr(seo?.title_template) || '%s | Ensotek';

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return safeStr(t) || pageTitleRaw;
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = safeStr(primary?.featured_image);
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.ico');
  }, [primary?.featured_image, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj(seo?.twitter) || {};
    const robots = asObj(seo?.robots) || {};
    const noindex = typeof robots.noindex === 'boolean' ? robots.noindex : false;

    // ✅ url ve canonical aynı => og:url da canonical olur (buildMeta içinde)
    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      canonical,
      url: canonical,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,

      twitterCard: safeStr(tw.card) || 'summary_large_image',
      twitterSite: typeof tw.site === 'string' ? tw.site.trim() : undefined,
      twitterCreator: typeof tw.creator === 'string' ? tw.creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, canonical, ogImage, seoSiteName]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        {headSpecs.map((spec, idx) => {
          if (spec.kind === 'link')
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          if (spec.kind === 'meta-name')
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}
      </Head>

      <Banner title={bannerTitle} />
      <Service />
      <ServiceMore />
    </>
  );
};

export default ServicePage;
