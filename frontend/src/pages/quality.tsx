// =============================================================
// FILE: src/pages/quality.tsx
// Ensotek – Quality Page + SEO (STANDARD / HOOK-SAFE) [FINAL]
//   - Route: /quality
//   - Data: custom_pages (module_key="quality") meta override (select by slug/id)
//   - SEO: NO <Head>. Only <LayoutSeoBridge />
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/components/layout/banner/Breadcrum';
import QualityPageContent from '@/components/containers/about/QualityPageContent';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import { asObj } from '@/seo/pageSeo';

import {
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery,
} from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { excerpt } from '@/shared/text';

function safeStr(v: unknown): string {
  if (v == null) return '';
  return String(v).trim();
}

const QUALITY_SLUGS: Record<string, string> = {
  tr: 'kalite-belgelerimiz-kalite-standartlarimiz',
  en: 'quality-certificates-quality-standards',
  de: 'zertifikate-qualitaetsstandards',
};

const QUALITY_PAGE_ID = '55550001-5555-4555-8555-555555550001';

const QualityPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_quality', locale as any);

  // -----------------------------
  // UI (Banner Title)
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_quality_page_title';
    const v = safeStr(ui(key, ''));
    return isValidUiText(v, key) ? v : 'Quality';
  }, [ui]);

  // -----------------------------
  // Slug selector (legacy mapping)
  // -----------------------------
  const qualitySlug = useMemo(() => {
    // locale hook normalize ediyor; burada sadece güvenli erişim
    const l = safeStr(locale).toLowerCase();
    return QUALITY_SLUGS[l] ?? QUALITY_SLUGS.tr;
  }, [locale]);

  // -----------------------------
  // Global SEO settings (seo -> site_seo fallback) [robots/noindex + description fallback]
  // -----------------------------
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale } as any);
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({
    key: 'site_seo',
    locale,
  } as any);

  const seo = useMemo(() => {
    const raw =
      (seoSettingPrimary as any)?.value ??
      (seoSettingFallback as any)?.value ??
      seoSettingPrimary ??
      seoSettingFallback;

    return asObj(raw) ?? {};
  }, [seoSettingPrimary, seoSettingFallback]);

  // -----------------------------
  // Quality pages list
  // -----------------------------
  const { data: qualityData, isLoading } = useListCustomPagesPublicQuery(
    {
      module_key: 'quality',
      locale,
      limit: 50,
      offset: 0,
      sort: 'display_order',
      orderDir: 'asc',
      is_published: 1,
    } as any,
    { refetchOnMountOrArgChange: true },
  );

  const primary = useMemo<CustomPageDto | null>(() => {
    const items: CustomPageDto[] = ((qualityData as any)?.items ?? []) as any;
    const published = items.filter((p) => !!(p as any)?.is_published);
    if (!published.length) return null;

    const targetSlug = qualitySlug.toLowerCase();
    const bySlug =
      published.find((p) => safeStr((p as any)?.slug).toLowerCase() === targetSlug) ?? null;

    const byId = published.find((p) => safeStr((p as any)?.id) === QUALITY_PAGE_ID) ?? null;

    return (bySlug ?? byId ?? published[0] ?? null) as any;
  }, [qualityData, qualitySlug]);

  // -----------------------------
  // SEO: sources (UI -> custom_page -> seo fallback)
  // -----------------------------
  const pageTitle = useMemo(() => {
    const key = 'ui_quality_meta_title';
    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = safeStr((primary as any)?.meta_title);
    if (fromPageMeta) return fromPageMeta;

    const fromPageTitle = safeStr((primary as any)?.title);
    if (fromPageTitle) return fromPageTitle;

    return bannerTitle || 'Quality';
  }, [ui, primary, bannerTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_quality_meta_description';
    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = safeStr((primary as any)?.meta_description);
    if (fromPageMeta) return fromPageMeta;

    const fromSummary = safeStr((primary as any)?.summary);
    if (fromSummary) return fromSummary;

    const html = safeStr((primary as any)?.content_html);
    const fromExcerpt = html ? excerpt(html, 160).trim() : '';
    if (fromExcerpt) return fromExcerpt;

    const fromUiDesc = safeStr(ui('ui_quality_page_description', ''));
    if (fromUiDesc && isValidUiText(fromUiDesc, 'ui_quality_page_description')) return fromUiDesc;

    const fromSeo = safeStr((seo as any)?.description);
    if (fromSeo) return fromSeo;

    return 'Ensotek quality certificates and quality standards.';
  }, [ui, primary, seo]);

  const ogImageOverride = useMemo(() => {
    // optional: UI override > page featured image > undefined (Layout handles fallback)
    const uiImgKey = 'ui_quality_og_image';
    const fromUi = safeStr(ui(uiImgKey, ''));
    if (isValidUiText(fromUi, uiImgKey) && fromUi) return fromUi;

    const raw = safeStr((primary as any)?.featured_image);
    return raw || undefined;
  }, [ui, primary]);

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
      <QualityPageContent pageData={primary} isLoading={isLoading} />
    </>
  );
};

export default QualityPage;
