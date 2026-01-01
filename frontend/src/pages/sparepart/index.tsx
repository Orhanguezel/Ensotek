// =============================================================
// FILE: src/pages/sparepart/index.tsx
// Ensotek – Spareparts Page (full list) + SEO (STANDARD)
//   - Route: /sparepart
//   - NO <Head>
//   - SEO override: <LayoutSeoBridge />
//   - UI fallbacks + optional UI meta
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/layout/banner/Breadcrum';
import ProductPageContent from '@/components/containers/product/ProductPageContent';
import Feedback from '@/components/containers/feedback/Feedback';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import { toCdnSrc } from '@/shared/media';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

const SparepartPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_spareparts', locale as any);

  const bannerTitle = useMemo(() => {
    const key = 'ui_spareparts_page_title';
    const v = safeStr(ui(key, 'Spare Parts'));
    return isValidUiText(v, key) ? v : 'Spare Parts';
  }, [ui]);

  const pageTitle = useMemo(() => {
    const key = 'ui_spareparts_meta_title';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;
    return bannerTitle || 'Spare Parts';
  }, [ui, bannerTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_spareparts_meta_description';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;
    return ''; // empty => Layout default
  }, [ui]);

  const ogImageOverride = useMemo(() => {
    const key = 'ui_spareparts_og_image';
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

      <ProductPageContent itemType="sparepart" uiSectionKey="ui_spareparts" basePath="/sparepart" />
      <Feedback />
    </>
  );
};

export default SparepartPage;
