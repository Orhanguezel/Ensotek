// =============================================================
// FILE: src/pages/about.tsx
// Ensotek – About Page + SEO
//   - Route: /about
//   - Data: custom_pages (module_key="about") meta override
//   - SEO: seo -> site_seo fallback + OG/Twitter (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import AboutCounter from '@/components/containers/counter/AboutCounter';
import AboutPageContent from '@/components/containers/about/AboutPageContent';
import TeamPageContent from '@/components/containers/team/TeamPageContent';
import Sponsor from '@/components/containers/references/References';
import Feedback from '@/components/containers/feedback/Feedback';

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
} from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

const toLocaleShort = (l: any) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

const AboutPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_about', locale);

  // Banner title (UI)
  const bannerTitle = ui(
    'ui_about_page_title',
    locale === 'tr' ? 'Hakkımızda' : locale === 'de' ? 'Über uns' : 'About Us',
  );

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({
    key: 'seo',
    locale,
  });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({
    key: 'site_seo',
    locale,
  });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // About custom pages (meta override için: ilk published kayıt)
  const { data: aboutData } = useListCustomPagesPublicQuery({
    module_key: 'about',
    locale,
    limit: 10,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const primary = useMemo(() => {
    const items: CustomPageDto[] = (aboutData?.items ?? []) as any;
    const published = items.filter((p) => p.is_published);
    return published[0];
  }, [aboutData]);

  // --- SEO: Title/Description (UI meta overrides + custom_page meta) ---
  const titleFallback = ui(
    'ui_about_fallback_title',
    locale === 'tr'
      ? 'Ensotek Su Soğutma Kuleleri Hakkında'
      : locale === 'de'
      ? 'Über Ensotek Wasserkühltürme'
      : 'About Ensotek Water Cooling Towers',
  );

  const pageTitleRaw =
    String(ui('ui_about_meta_title', '') || '').trim() ||
    (primary?.meta_title ?? '').trim() ||
    (primary?.title ?? '').trim() ||
    String(titleFallback).trim();

  const descFallback =
    locale === 'tr'
      ? 'Ensotek hakkında bilgi, kurumsal yaklaşımımız ve faaliyet alanlarımız.'
      : locale === 'de'
      ? 'Informationen über Ensotek, unser Unternehmen und unsere Kompetenzen.'
      : 'Information about Ensotek, our company and capabilities.';

  const pageDescRaw =
    String(ui('ui_about_meta_description', '') || '').trim() ||
    (primary?.meta_description ?? '').trim() ||
    (primary?.summary ?? '').trim() ||
    excerpt(primary?.content_html ?? '', 160).trim() ||
    String(ui('ui_about_page_description', descFallback) || '').trim() ||
    String(seo?.description ?? '').trim() ||
    '';

  const seoSiteName = String(seo?.site_name ?? '').trim() || 'Ensotek';
  const titleTemplate = String(seo?.title_template ?? '').trim() || '%s | Ensotek';

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = (primary?.featured_image ?? '').trim();
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.ico');
  }, [primary?.featured_image, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj(seo?.twitter) || {};
    const robots = asObj(seo?.robots) || {};
    const noindex = typeof robots.noindex === 'boolean' ? robots.noindex : false;

    // ✅ canonical + og:url YOK (tek kaynak: _document SSR)
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
      <AboutPageContent />
      <AboutCounter />
      <TeamPageContent />
      <Sponsor />
      <Feedback />
    </>
  );
};

export default AboutPage;
