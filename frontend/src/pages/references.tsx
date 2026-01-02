// =============================================================
// FILE: src/pages/references.tsx
// Ensotek – References Page (full list) + SEO (STANDARD / HOOK-SAFE) [FIXED]
//   - Route: /references
//   - Locale: useResolvedLocale() single source (stabilized)
//   - i18n UI: site_settings.ui_references
//   - SEO: seo -> site_seo fallback + ui overrides
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
//   - ✅ SEO: NO <Head>. Only <LayoutSeoBridge />
//   - ✅ FIX: locale-ready gating to prevent first-render empty-cache issues
// =============================================================

'use client';

import React, { useCallback, useMemo } from 'react';

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
  // ✅ Single source (may be initially empty/unstable depending on app_locales fetch)
  const resolvedLocale = useResolvedLocale();

  // ✅ Stabilize + gate queries until we have a real locale
  const locale = useMemo(() => safeStr(resolvedLocale), [resolvedLocale]);
  const localeReady = Boolean(locale);

  // ✅ UI section (do NOT call with empty locale)
  // If locale isn't ready yet, we return a safe ui() function that yields fallbacks.
  const uiSection = useUiSection('ui_references', localeReady ? (locale as any) : undefined);
  const uiSafe = useCallback(
    (key: string, hardFallback = '') => {
      if (!localeReady) return hardFallback || key;
      return uiSection.ui(key, hardFallback);
    },
    [localeReady, uiSection],
  );

  const t = useCallback(
    (key: string, fallbackEn: string) => {
      const v = safeStr(uiSafe(key, fallbackEn));
      return v || fallbackEn;
    },
    [uiSafe],
  );

  // -----------------------------
  // Banner title (UI)
  // -----------------------------
  const bannerTitle = useMemo(() => t('ui_references_page_title', 'References'), [t]);

  // -----------------------------
  // Global SEO settings (seo -> site_seo fallback)
  // -----------------------------
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery(
    localeReady ? ({ key: 'seo', locale } as any) : (undefined as any),
    { skip: !localeReady } as any,
  );

  const { data: seoFallback } = useGetSiteSettingByKeyQuery(
    localeReady ? ({ key: 'site_seo', locale } as any) : (undefined as any),
    { skip: !localeReady } as any,
  );

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
    const fromUi = safeStr(uiSafe(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    const fallback = safeStr(bannerTitle) || 'References';
    return fallback;
  }, [uiSafe, bannerTitle]);

  const pageDescription = useMemo(() => {
    const keyMeta = 'ui_references_meta_description';
    const fromMeta = safeStr(uiSafe(keyMeta, ''));
    if (isValidUiText(fromMeta, keyMeta)) return fromMeta;

    const keyPage = 'ui_references_page_description';
    const fromPage = safeStr(uiSafe(keyPage, ''));
    if (isValidUiText(fromPage, keyPage)) return fromPage;

    const fromSeo = safeStr((seo as any)?.description);
    return fromSeo || '';
  }, [uiSafe, seo]);

  const ogImageOverride = useMemo(() => {
    const key = 'ui_references_og_image';
    const v = safeStr(uiSafe(key, ''));
    if (isValidUiText(v, key) && v) return v;
    return undefined;
  }, [uiSafe]);

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

      {/* ✅ Gate content until locale is ready to prevent initial empty-cache requests */}
      {localeReady ? <ReferencesPageContent /> : null}

      <Feedback />
    </>
  );
};

export default ReferencesPage;
