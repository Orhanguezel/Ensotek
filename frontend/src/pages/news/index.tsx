// =============================================================
// FILE: src/pages/news/index.tsx
// Ensotek – News Page (full list) + SEO (EN fallback only)
// - Route: /news
// - Data: custom_pages (module_key="news") for meta override (first published)
// - i18n: useLocaleShort() + site_settings.ui_news (EN fallback only)
// - SEO: seo -> site_seo fallback + custom_page meta override
// - ✅ Canonical + og:url single source: _document (SSR)
// - NO Tailwind, NO inline styles
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import NewsPageContent from '@/components/containers/news/NewsPageContent';
import Feedback from '@/components/containers/feedback/Feedback';

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

const NewsPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_news', locale as any);

  // Banner title (UI)
  const bannerTitle = ui('ui_news_page_title', 'News'); // EN fallback only

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale } as any);
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale } as any);

  const seo = useMemo(() => {
    const raw = (seoPrimary as any)?.value ?? (seoFallback as any)?.value;
    return asObj(raw) ?? {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(seoPrimary as any)?.value, (seoFallback as any)?.value]);

  // News list for meta override (first published)
  const { data: newsData } = useListCustomPagesPublicQuery(
    {
      module_key: 'news',
      locale,
      limit: 10,
      sort: 'created_at',
      order: 'asc',
      orderDir: 'asc',
      is_published: 1,
    } as any,
    { skip: !locale },
  );

  const primary = useMemo(() => {
    const items: CustomPageDto[] = ((newsData as any)?.items ??
      (newsData as any)?.data ??
      (newsData as any)?.rows ??
      []) as any;
    const published = Array.isArray(items) ? items.filter((p) => !!(p as any)?.is_published) : [];
    return published[0] as any;
  }, [newsData]);

  // --- SEO: Title/Description ---
  const pageTitleRaw = useMemo(() => {
    const titleFallback = safeStr(bannerTitle) || 'News';
    return (
      safeStr((primary as any)?.meta_title) || safeStr((primary as any)?.title) || titleFallback
    );
  }, [primary, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const metaDesc = safeStr((primary as any)?.meta_description);
    const summary = safeStr((primary as any)?.summary);
    const html = safeStr((primary as any)?.content_html);
    return (
      metaDesc || summary || safeStr(excerpt(html, 160)) || safeStr((seo as any)?.description) || ''
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
      <NewsPageContent />
      <Feedback />
    </>
  );
};

export default NewsPage;
