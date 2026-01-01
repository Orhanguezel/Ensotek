// =============================================================
// FILE: src/pages/service/index.tsx
// Ensotek – Services Page (list) + SEO (PUBLIC PAGES ROUTER STANDARD)
//   - Route: /service
//   - NO <Head>
//   - SEO override: <LayoutSeoBridge />
//   - UI meta: ui_services_meta_* + optional og image override
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/layout/banner/Breadcrum';
import Service from '@/components/containers/service/Service';
import ServiceMore from '@/components/containers/service/ServiceMore';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import { toCdnSrc } from '@/shared/media';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

const ServicePage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_services', locale as any);

  const bannerTitle = useMemo(() => {
    const key = 'ui_services_page_title';
    const v = safeStr(ui(key, 'Services'));
    return isValidUiText(v, key) ? v : 'Services';
  }, [ui]);

  const pageTitle = useMemo(() => {
    const key = 'ui_services_meta_title';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;
    return bannerTitle || 'Services';
  }, [ui, bannerTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_services_meta_description';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;
    return ''; // empty => Layout default
  }, [ui]);

  const ogImageOverride = useMemo(() => {
    const key = 'ui_services_og_image';
    const raw = safeStr(ui(key, ''));
    if (!raw) return undefined;
    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [ui]);

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />

      <Service />
      <ServiceMore />
    </>
  );
};

export default ServicePage;
