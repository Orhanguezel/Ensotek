// =============================================================
// FILE: src/pages/mission-vision.tsx
// Ensotek – Mission & Vision Page + SEO (FIXED / I18N SAFE)
//   - Route: /mission-vision  (pages router: file ideally mission-vision.tsx, but kept as requested)
//   - Data: custom_pages (module_key="mission" + "vision") -> first published (meta source)
//   - SEO: seo -> site_seo fallback + OG/Twitter (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
//   - UI strings: ui_mission_vision
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import MissionVisionPageContent from '@/components/containers/about/MissionVisionPageContent';

// i18n + UI
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import {
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery,
} from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

function pickFirstPublished(items: any): CustomPageDto | null {
  const arr: CustomPageDto[] = Array.isArray(items) ? (items as any) : [];
  const published = arr.filter((p) => !!p?.is_published);
  return published[0] ?? null;
}

const MissionVisionPage: React.FC = () => {
  const locale = useLocaleShort();

  // ✅ Page UI section (mission_vision)
  const { ui } = useUiSection('ui_mission_vision', locale as any);

  // -----------------------------
  // Banner Title
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_mission_vision_page_title';
    const v = String(ui(key, '') || '').trim();
    return isValidUiText(v, key) ? v : 'Misyonumuz - Vizyonumuz';
  }, [ui]);

  // -----------------------------
  // Global SEO settings (seo -> site_seo fallback)
  // -----------------------------
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // -----------------------------
  // Custom pages (meta override)
  // - Prefer vision meta, fallback to mission
  // -----------------------------
  const visionQ = useListCustomPagesPublicQuery({
    module_key: 'vision',
    locale,
    limit: 10,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const missionQ = useListCustomPagesPublicQuery({
    module_key: 'mission',
    locale,
    limit: 10,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const visionPrimary = useMemo(
    () => pickFirstPublished((visionQ.data as any)?.items),
    [visionQ.data],
  );

  const missionPrimary = useMemo(
    () => pickFirstPublished((missionQ.data as any)?.items),
    [missionQ.data],
  );

  const primary = visionPrimary || missionPrimary; // ✅ meta source

  // -----------------------------
  // SEO: title/description sources (UI -> custom_page -> seo)
  // -----------------------------
  const pageTitleRaw = useMemo(() => {
    const key = 'ui_mission_vision_meta_title';

    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = String(primary?.meta_title ?? '').trim();
    if (fromPageMeta) return fromPageMeta;

    const fromPageTitle = String(primary?.title ?? '').trim();
    if (fromPageTitle) return fromPageTitle;

    // fallback
    return (
      String(ui('ui_mission_vision_page_title', 'Misyonumuz - Vizyonumuz') || '').trim() ||
      'Misyonumuz - Vizyonumuz'
    );
  }, [ui, primary?.meta_title, primary?.title]);

  const pageDescRaw = useMemo(() => {
    const key = 'ui_mission_vision_meta_description';

    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = String(primary?.meta_description ?? '').trim();
    if (fromPageMeta) return fromPageMeta;

    const fromSummary = String(primary?.summary ?? '').trim();
    if (fromSummary) return fromSummary;

    const fromExcerpt = excerpt((primary as any)?.content_html ?? '', 160).trim();
    if (fromExcerpt) return fromExcerpt;

    const fromUiDesc = String(ui('ui_mission_vision_page_lead', '') || '').trim();
    if (fromUiDesc && isValidUiText(fromUiDesc, 'ui_mission_vision_page_lead')) return fromUiDesc;

    const fromSeo = String((seo as any)?.description ?? '').trim();
    if (fromSeo) return fromSeo;

    return 'Ensotek misyonu ve vizyonu hakkında bilgiler.';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui, primary?.meta_description, primary?.summary, (primary as any)?.content_html, seo]);

  const seoSiteName = useMemo(
    () => String((seo as any)?.site_name ?? '').trim() || 'Ensotek',
    [seo],
  );

  const titleTemplate = useMemo(
    () => String((seo as any)?.title_template ?? '').trim() || '%s | Ensotek',
    [seo],
  );

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = String((primary as any)?.featured_image ?? '').trim();
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.svg');
  }, [primary, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
    const noindex = typeof robots.noindex === 'boolean' ? robots.noindex : false;

    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,
      twitterCard: String(tw.card ?? '').trim() || 'summary_large_image',
      twitterSite: typeof tw.site === 'string' ? tw.site.trim() : undefined,
      twitterCreator: typeof tw.creator === 'string' ? tw.creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, ogImage, seoSiteName]);

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
      <MissionVisionPageContent />
    </>
  );
};

export default MissionVisionPage;
