// =============================================================
// FILE: src/pages/library/index.tsx
// Ensotek – Library Page + Wet-Bulb Calculator Section + SEO (HOOK-SAFE)
//   - Route: /library
//   - i18n: useLocaleShort() + site_settings.ui_library
//   - SEO: seo -> site_seo fallback + ui_library overrides (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import LibrarySection from '@/components/containers/library/Library';
import WetBulbCalculator from '@/components/containers/library/WetBulbCalculator';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const LibraryPage: React.FC = () => {
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_library', locale as any);

  // ======================
  // Banner title (UI)
  // ======================
  const bannerTitle = ui('ui_library_page_title', 'Library');

  // ======================
  // Global SEO settings (seo -> site_seo fallback)
  // ======================
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // ======================
  // SEO fields (page-level)
  // ======================
  const pageTitleRaw = useMemo(() => {
    const t = String(ui('ui_library_meta_title', '') || '').trim();
    return t || String(bannerTitle || '').trim() || 'Library';
  }, [ui, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const t = String(ui('ui_library_meta_description', '') || '').trim();
    return t || String(seo?.description ?? '').trim() || '';
  }, [ui, seo?.description]);

  const seoSiteName = useMemo(() => String(seo?.site_name ?? '').trim() || 'Ensotek', [seo]);
  const titleTemplate = useMemo(
    () => String(seo?.title_template ?? '').trim() || '%s | Ensotek',
    [seo],
  );

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';
    return fallback || absUrl('/favicon.svg');
  }, [seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj(seo?.twitter) || {};
    const robots = asObj(seo?.robots) || {};
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
      <LibrarySection />
      <WetBulbCalculator />
    </>
  );
};

export default LibraryPage;
