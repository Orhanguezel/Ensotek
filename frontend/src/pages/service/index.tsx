// =============================================================
// FILE: src/pages/service/index.tsx
// Public Services Page (list) + SEO (product pattern)
//   - Route: /service
//   - Layout is provided by _app.tsx (do NOT wrap here)
//   - Page-specific SEO override via next/head (title/description/og:image)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import Service from '@/components/containers/service/Service';
import ServiceMore from '@/components/containers/service/ServiceMore';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// data
import {
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery,
} from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// helpers
import { excerpt } from '@/shared/text';
import { asObj } from '@/seo/pageSeo';
import { toCdnSrc } from '@/shared/media';

const SERVICE_MODULE_KEY = 'service';

const toLocaleShort = (l: any) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

function ensureMinDescription(desc: string, minLen = 20): string {
  const d = safeStr(desc);
  if (d.length >= minLen) return d;
  return 'Explore our services and solutions. Contact us for tailored support and consultation.';
}

const ServicePage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_services', locale);

  const bannerTitle = ui('ui_services_page_title', locale === 'tr' ? 'Hizmetler' : 'Services');

  // Global SEO settings (desc fallback)
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

  const pageTitle = useMemo(() => {
    return (
      safeStr(primary?.meta_title) ||
      safeStr(primary?.title) ||
      safeStr(bannerTitle) ||
      (locale === 'tr' ? 'Hizmetler' : 'Services')
    );
  }, [primary?.meta_title, primary?.title, bannerTitle, locale]);

  const pageDesc = useMemo(() => {
    const fromPrimary =
      safeStr(primary?.meta_description) ||
      safeStr(primary?.summary) ||
      safeStr(excerpt(primary?.content_html ?? '', 160)) ||
      safeStr(seo?.description);

    const uiFallback = safeStr(
      ui(
        'ui_services_page_description',
        locale === 'tr'
          ? 'Hizmetlerimizi ve çözümlerimizi inceleyin. Size özel destek ve danışmanlık için iletişime geçin.'
          : 'Explore our services and solutions. Contact us for tailored support and consultation.',
      ),
    );

    return ensureMinDescription(fromPrimary || uiFallback, 20);
  }, [
    primary?.meta_description,
    primary?.summary,
    primary?.content_html,
    seo?.description,
    ui,
    locale,
  ]);

  const ogImage = useMemo(() => {
    const pageImgRaw = safeStr(primary?.featured_image);
    if (!pageImgRaw) return '';
    return toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw;
  }, [primary?.featured_image]);

  return (
    <>
      {/* ✅ Override Layout defaults (Layout still owns canonical/hreflang/og:url) */}
      <Head>
        <title key="title">{pageTitle}</title>
        <meta key="description" name="description" content={pageDesc} />
        {ogImage ? <meta key="og:image" property="og:image" content={ogImage} /> : null}
      </Head>

      <Banner title={bannerTitle} />
      <Service />
      <ServiceMore />
    </>
  );
};

export default ServicePage;
