// =============================================================
// FILE: src/pages/references.tsx
// Ensotek – References Page (full list) + SEO (STANDARD / HOOK-SAFE) [FINAL]
//   - Route: /references
//   - Locale: useResolvedLocale() single source
//   - i18n UI: site_settings.ui_references
//   - SEO: seo -> site_seo fallback + ui overrides
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
//   - SEO: NO <Head>. Only <LayoutSeoBridge />
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/layout/banner/Breadcrum';
import ReferencesPageContent from '@/components/containers/references/ReferencesPageContent';
import Feedback from '@/components/containers/feedback/Feedback';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// SEO helpers
import { asObj } from '@/seo/pageSeo';

// data
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

function safeStr(v: unknown): string {
  if (v == null) return '';
  return String(v).trim();
}

const ReferencesPage: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection('ui_references', locale as any);

  const t = useMemo(() => {
    return (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    };
  }, [ui]);

  // -----------------------------
  // Banner title (UI)
  // -----------------------------
  const bannerTitle = useMemo(() => t('ui_references_page_title', 'References'), [t]);

  // -----------------------------
  // Global SEO settings (seo -> site_seo fallback)
  // -----------------------------
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale } as any);
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale } as any);

  const seo = useMemo(() => {
    const raw =
      (seoPrimary as any)?.value ?? (seoFallback as any)?.value ?? seoPrimary ?? seoFallback;
    return asObj(raw) ?? {};
  }, [seoPrimary, seoFallback]);

  // -----------------------------
  // SEO sources (UI -> seo fallback)
  // -----------------------------
  const pageTitle = useMemo(() => {
    const key = 'ui_references_meta_title';
    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    const fallback = safeStr(bannerTitle) || 'References';
    return fallback;
  }, [ui, bannerTitle]);

  const pageDescription = useMemo(() => {
    const keyMeta = 'ui_references_meta_description';
    const fromMeta = safeStr(ui(keyMeta, ''));
    if (isValidUiText(fromMeta, keyMeta)) return fromMeta;

    const keyPage = 'ui_references_page_description';
    const fromPage = safeStr(ui(keyPage, ''));
    if (isValidUiText(fromPage, keyPage)) return fromPage;

    const fromSeo = safeStr((seo as any)?.description);
    return fromSeo || '';
  }, [ui, seo]);

  const ogImageOverride = useMemo(() => {
    // optional UI override; LayoutSeoBridge will fallback to seo/site default if undefined
    const key = 'ui_references_og_image';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key) && v) return v;
    return undefined;
  }, [ui]);

  const noindex = useMemo(() => {
    const robots = asObj((seo as any)?.robots) || {};
    return typeof (robots as any).noindex === 'boolean' ? (robots as any).noindex : false;
  }, [seo]);

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={noindex}
      />

      <Banner title={bannerTitle} />
      <ReferencesPageContent />
      <Feedback />
    </>
  );
};

export default ReferencesPage;
