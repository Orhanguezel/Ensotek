// =============================================================
// FILE: src/pages/references.tsx
// Ensotek – References Page (full list) + SEO (HOOK-SAFE)
//   - Route: /references
//   - i18n: useResolvedLocale + site_settings.ui_references
//   - SEO: seo -> site_seo fallback + OG/Twitter (NO canonical here)
//   - Canonical + og:url single source: _document (SSR)
//   - EN-only fallback (no locale branching)
// =============================================================
'use client';

import React, { useMemo, useCallback } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import ReferencesPageContent from '@/components/containers/references/ReferencesPageContent';
import Feedback from '@/components/containers/feedback/Feedback';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data (global SEO settings)
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

const ReferencesPage: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection('ui_references', locale as any);

  const t = useCallback(
    (key: string, fallbackEn: string) => {
      const v = safeStr(ui(key, fallbackEn));
      return v || fallbackEn;
    },
    [ui],
  );

  // Banner title
  const bannerTitle = useMemo(() => t('ui_references_page_title', 'References'), [t]);

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale } as any);
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale } as any);

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // Page-level SEO fields from ui_references (fallback EN only)
  const pageTitleRaw = useMemo(() => {
    const uiTitle = safeStr(ui('ui_references_meta_title', ''));
    return uiTitle || safeStr(bannerTitle) || 'References';
  }, [ui, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const uiDesc = safeStr(ui('ui_references_meta_description', ''));
    if (uiDesc) return uiDesc;

    const uiPageDesc = safeStr(ui('ui_references_page_description', ''));
    if (uiPageDesc) return uiPageDesc;

    return safeStr((seo as any)?.description) || '';
  }, [ui, seo]);

  const seoSiteName = useMemo(() => safeStr((seo as any)?.site_name) || 'Ensotek', [seo]);
  const titleTemplate = useMemo(
    () => safeStr((seo as any)?.title_template) || '%s | Ensotek',
    [seo],
  );

  const pageTitle = useMemo(() => {
    const out = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return safeStr(out);
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';
    return fallback || absUrl('/favicon.svg');
  }, [seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
    const noindex = typeof robots.noindex === 'boolean' ? robots.noindex : false;

    // canonical + og:url yok (SSR _document tek kaynak)
    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,
      twitterCard: safeStr((tw as any).card) || 'summary_large_image',
      twitterSite: typeof (tw as any).site === 'string' ? safeStr((tw as any).site) : undefined,
      twitterCreator:
        typeof (tw as any).creator === 'string' ? safeStr((tw as any).creator) : undefined,
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
      <ReferencesPageContent />
      <Feedback />
    </>
  );
};

export default ReferencesPage;
