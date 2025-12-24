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
import { useGetSiteSettingByKeyQuery, useListServicesPublicQuery } from '@/integrations/rtk/hooks';
import type { ServiceDto } from '@/integrations/types/services.types';

// helpers
import { excerpt } from '@/shared/text';
import { asObj } from '@/seo/pageSeo';
import { toCdnSrc } from '@/shared/media';
import { normLocaleTag } from '@/i18n/localeUtils';

const toLocaleShort = (l: unknown) =>
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

  // ✅ default_locale DB’den
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' });
  const defaultLocale = useMemo(() => {
    const v = normLocaleTag(defaultLocaleRow?.value);
    return v || 'tr';
  }, [defaultLocaleRow?.value]);

  const bannerTitle = ui('ui_services_page_title', locale === 'tr' ? 'Hizmetler' : 'Services');

  // Global SEO settings (desc fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // ✅ Services list (meta override için ilk published kayıt)
  const { data: serviceData } = useListServicesPublicQuery({
    locale,
    default_locale: defaultLocale,
    limit: 20,
    order: 'display_order.asc,created_at.asc',
  });

  const primary = useMemo(() => {
    const items: ServiceDto[] = (serviceData?.items ?? []) as any;
    const published = items.filter((p) => Boolean((p as any)?.is_published ?? true));
    return published[0];
  }, [serviceData?.items]);

  const pageTitle = useMemo(() => {
    return (
      safeStr((primary as any)?.meta_title) ||
      safeStr(primary?.name) ||
      safeStr(bannerTitle) ||
      (locale === 'tr' ? 'Hizmetler' : 'Services')
    );
  }, [primary, bannerTitle, locale]);

  const pageDesc = useMemo(() => {
    const fromPrimary =
      safeStr((primary as any)?.meta_description) ||
      safeStr((primary as any)?.description) ||
      safeStr((primary as any)?.includes) ||
      safeStr(excerpt(String((primary as any)?.content_html ?? ''), 160)) ||
      safeStr((seo as any)?.description);

    const uiFallback = safeStr(
      ui(
        'ui_services_page_description',
        locale === 'tr'
          ? 'Hizmetlerimizi ve çözümlerimizi inceleyin. Size özel destek ve danışmanlık için iletişime geçin.'
          : 'Explore our services and solutions. Contact us for tailored support and consultation.',
      ),
    );

    return ensureMinDescription(fromPrimary || uiFallback, 20);
  }, [primary, seo, ui, locale]);

  const ogImage = useMemo(() => {
    const raw = safeStr(
      (primary as any)?.featured_image_url ||
        (primary as any)?.image_url ||
        (primary as any)?.featured_image,
    );
    if (!raw) return '';
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [primary]);

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
