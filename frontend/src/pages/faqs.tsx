// =============================================================
// FILE: src/pages/faqs.tsx
// Ensotek – Faqs Page (full list) + SEO
//   - Route: /faqs
//   - Layout: Banner + FaqsPageContent + Feedback
//   - i18n UI: site_settings.ui_faqs
//   - SEO: seo -> site_seo fallback + OG/Twitter (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import FaqsPageContent from '@/components/containers/faqs/FaqsPageContent';
import Feedback from '@/components/containers/feedback/Feedback';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const FaqsPage: React.FC = () => {
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_faqs', locale as any);

  // ======================
  // Banner title (UI)
  // ======================
  const bannerTitle = useMemo(() => {
    const key = 'ui_faqs_page_title';
    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    return 'FAQs';
  }, [ui]);

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
  // SEO: Title/Description (UI overrides)
  // ======================
  const pageTitleRaw = useMemo(() => {
    // 1) ui_faqs_meta_title
    const key = 'ui_faqs_meta_title';
    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    // 2) banner title
    return bannerTitle;
  }, [ui, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    // 1) ui_faqs_meta_description
    const keyMeta = 'ui_faqs_meta_description';
    const fromMeta = String(ui(keyMeta, '') || '').trim();
    if (isValidUiText(fromMeta, keyMeta)) return fromMeta;

    // 2) ui_faqs_page_description
    const keyPage = 'ui_faqs_page_description';
    const fromPage = String(ui(keyPage, '') || '').trim();
    if (isValidUiText(fromPage, keyPage)) return fromPage;

    // 3) global seo description
    const fromSeo = String((seo as any)?.description ?? '').trim();
    if (fromSeo) return fromSeo;

    return '';
  }, [ui, seo]);

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
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';
    return fallback || absUrl('/favicon.svg');
  }, [seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
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
      <FaqsPageContent />
      <Feedback />
    </>
  );
};

export default FaqsPage;
