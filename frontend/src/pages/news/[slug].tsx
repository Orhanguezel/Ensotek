// =============================================================
// FILE: src/pages/news/[slug].tsx
// Ensotek – News Detail Page (by slug) + SEO
//   - Route: /news/[slug]
//   - Data: custom_pages/by-slug (module_key="news")
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import NewsDetail from '@/components/containers/news/NewsDetail';
import NewsMore from '@/components/containers/news/NewsMore';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import {
  useGetSiteSettingByKeyQuery,
  useGetCustomPageBySlugPublicQuery,
} from '@/integrations/rtk/hooks';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

const NewsDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useResolvedLocale();
  const { ui } = useUiSection('ui_news', locale);

  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === 'string' ? slugParam : Array.isArray(slugParam) ? slugParam[0] ?? '' : '';

  const isSlugReady = Boolean(slug);

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

  // News item data (for SEO + banner)
  const { data: page } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  const listTitleFallback = ui('ui_news_page_title', locale === 'tr' ? 'Haberler' : 'News');
  const detailTitleFallback = ui(
    'ui_news_detail_page_title',
    locale === 'tr' ? 'Haber Detayı' : 'News Detail',
  );

  const bannerTitle = useMemo(() => {
    return safeStr(page?.title) || safeStr(detailTitleFallback) || safeStr(listTitleFallback);
  }, [page?.title, detailTitleFallback, listTitleFallback]);

  // --- SEO fields ---
  const titleFallback = bannerTitle || 'News';

  const pageTitleRaw = safeStr(page?.meta_title) || safeStr(page?.title) || safeStr(titleFallback);

  const pageDescRaw =
    safeStr(page?.meta_description) ||
    safeStr(page?.summary) ||
    safeStr(excerpt(page?.content_html ?? '', 160)) ||
    safeStr(seo?.description) ||
    '';

  const seoSiteName = safeStr(seo?.site_name) || 'Ensotek';
  const titleTemplate = safeStr(seo?.title_template) || '%s | Ensotek';

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return safeStr(t);
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const pageImgRaw = safeStr(page?.featured_image);
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.ico');
  }, [page?.featured_image, seo]);

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
      twitterCard: safeStr(tw.card) || 'summary_large_image',
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

      {!isSlugReady ? (
        <div className="news__area grey-bg-3 pt-120 pb-90">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="skeleton-line" style={{ height: 24 }} />
                <div className="skeleton-line mt-10" style={{ height: 16 }} />
                <div className="skeleton-line mt-10" style={{ height: 16 }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <NewsDetail slug={slug} />
          <NewsMore currentSlug={slug} />
        </>
      )}
    </>
  );
};

export default NewsDetailPage;
