// =============================================================
// FILE: src/pages/team/index.tsx
// Ensotek – Team Page (full list) + SEO (NEWS/PRODUCT pattern)
//   - Route: /team
//   - i18n: useLocaleShort() + site_settings.ui_team
//   - Data: custom_pages (module_key="team") => meta override
//   - SEO: seo -> site_seo fallback + custom_page meta override (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import TeamPageContent from '@/components/containers/team/TeamPageContent';
import ServiceCtaTwo from '@/components/containers/cta/CatalogCta';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
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

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

const TeamPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_team', locale as any);

  // Banner title (UI)
  const bannerTitle = ui('ui_team_page_title', 'Team');

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // Team pages (meta override için ilk published kayıt)
  const { data: teamData } = useListCustomPagesPublicQuery({
    module_key: 'team',
    locale,
    limit: 10,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const primary = useMemo(() => {
    const items: CustomPageDto[] = (teamData?.items ?? []) as any;
    const published = items.filter((p) => !!(p as any)?.is_published);
    return published[0];
  }, [teamData?.items]);

  // --- SEO: Title/Description ---
  const pageTitleRaw = useMemo(() => {
    const fallback = safeStr(bannerTitle) || 'Team';
    return safeStr(primary?.meta_title) || safeStr(primary?.title) || fallback;
  }, [primary?.meta_title, primary?.title, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    return (
      safeStr(primary?.meta_description) ||
      safeStr(primary?.summary) ||
      safeStr(excerpt((primary as any)?.content_html ?? '', 160)) ||
      safeStr((seo as any)?.description) ||
      ''
    );
  }, [primary, seo]);

  const seoSiteName = useMemo(() => safeStr((seo as any)?.site_name) || 'Ensotek', [seo]);
  const titleTemplate = useMemo(
    () => safeStr((seo as any)?.title_template) || '%s | Ensotek',
    [seo],
  );

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return safeStr(t);
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = safeStr((primary as any)?.featured_image);
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.svg');
  }, [primary, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
    const noindex = typeof (robots as any).noindex === 'boolean' ? (robots as any).noindex : false;

    // ✅ canonical + og:url YOK (tek kaynak: _document SSR)
    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,

      twitterCard: safeStr((tw as any).card) || 'summary_large_image',
      twitterSite: typeof (tw as any).site === 'string' ? (tw as any).site.trim() : undefined,
      twitterCreator:
        typeof (tw as any).creator === 'string' ? (tw as any).creator.trim() : undefined,
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
      <TeamPageContent />
      <ServiceCtaTwo />
    </>
  );
};

export default TeamPage;
