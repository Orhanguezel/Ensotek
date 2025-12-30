// =============================================================
// FILE: src/pages/solutions.tsx
// Ensotek – Solutions Page + SEO
//   - Route: /solutions
//   - Data: custom_pages (module_key="solutions") meta override
//   - SEO: seo -> site_seo fallback + OG/Twitter (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import SolutionsPage from '@/components/containers/solutions/SolutionsPage';

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

const SolutionsIndexPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_solutions', locale as any);

  // -----------------------------
  // UI (Banner Title)
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_solutions_page_title';
    const v = String(ui(key, '') || '').trim();
    return isValidUiText(v, key) ? v : 'Solutions';
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
  // Solutions custom pages (meta override için: ilk published kayıt)
  // -----------------------------
  const { data: solutionsData } = useListCustomPagesPublicQuery({
    module_key: 'solutions',
    locale,
    limit: 10,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const primary = useMemo(() => {
    const items: CustomPageDto[] = (solutionsData?.items ?? []) as any;
    const published = items.filter((p) => p?.is_published);
    return published[0] ?? null;
  }, [solutionsData?.items]);

  // -----------------------------
  // SEO: title/description sources (UI -> custom_page -> seo)
  // -----------------------------
  const pageTitleRaw = useMemo(() => {
    const key = 'ui_solutions_meta_title';

    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = String(primary?.meta_title ?? '').trim();
    if (fromPageMeta) return fromPageMeta;

    const fromPageTitle = String(primary?.title ?? '').trim();
    if (fromPageTitle) return fromPageTitle;

    return 'Solutions';
  }, [ui, primary?.meta_title, primary?.title]);

  const pageDescRaw = useMemo(() => {
    const key = 'ui_solutions_meta_description';
    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = String(primary?.meta_description ?? '').trim();
    if (fromPageMeta) return fromPageMeta;

    const fromSummary = String(primary?.summary ?? '').trim();
    if (fromSummary) return fromSummary;

    const fromExcerpt = excerpt(primary?.content_html ?? '', 160).trim();
    if (fromExcerpt) return fromExcerpt;

    const fromUiDesc = String(ui('ui_solutions_page_description', '') || '').trim();
    if (fromUiDesc && isValidUiText(fromUiDesc, 'ui_solutions_page_description')) return fromUiDesc;

    const fromSeo = String((seo as any)?.description ?? '').trim();
    if (fromSeo) return fromSeo;

    return 'Solutions page of Ensotek.';
  }, [ui, primary?.meta_description, primary?.summary, primary?.content_html, seo]);

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
    const pageImgRaw = String(primary?.featured_image ?? '').trim();
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.svg');
  }, [primary?.featured_image, seo]);

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
      <SolutionsPage />
    </>
  );
};

export default SolutionsIndexPage;
