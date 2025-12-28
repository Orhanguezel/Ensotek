// =============================================================
// FILE: src/pages/news/[slug].tsx
// Ensotek – News Detail Page (by slug) + SEO
//   - Route: /news/[slug]
//   - Data: custom_pages/by-slug (module_key="news")
//   - i18n: useLocaleShort() + site_settings.ui_news
//   - SEO: seo -> site_seo fallback + page.meta_* override (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import NewsDetail from '@/components/containers/news/NewsDetail';
import NewsMore from '@/components/containers/news/NewsMore';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
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

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q;
  if (Array.isArray(q)) return String(q[0] ?? '');
  return '';
}

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

const NewsDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_news', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug).trim(), [router.query.slug]);
  const isSlugReady = !!slug;

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // News item data (for SEO + banner)
  const { data: page } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  const listTitleFallback = ui('ui_news_page_title', 'News');
  const detailTitleFallback = ui('ui_news_detail_page_title', 'News Detail');

  const bannerTitle = useMemo(() => {
    return safeStr(page?.title) || safeStr(detailTitleFallback) || safeStr(listTitleFallback);
  }, [page?.title, detailTitleFallback, listTitleFallback]);

  // --- SEO fields ---
  const pageTitleRaw = useMemo(() => {
    const t =
      safeStr(page?.meta_title) ||
      safeStr(page?.title) ||
      safeStr(bannerTitle) ||
      safeStr(listTitleFallback) ||
      'News';
    return t;
  }, [page?.meta_title, page?.title, bannerTitle, listTitleFallback]);

  const pageDescRaw = useMemo(() => {
    const globalDesc = safeStr(seo?.description) || '';

    if (!isSlugReady) return globalDesc;

    return (
      safeStr(page?.meta_description) ||
      safeStr(page?.summary) ||
      safeStr(excerpt(page?.content_html ?? '', 160)) ||
      globalDesc ||
      ''
    );
  }, [isSlugReady, page?.meta_description, page?.summary, page?.content_html, seo?.description]);

  const seoSiteName = useMemo(() => safeStr(seo?.site_name) || 'Ensotek', [seo?.site_name]);
  const titleTemplate = useMemo(
    () => safeStr(seo?.title_template) || '%s | Ensotek',
    [seo?.title_template],
  );

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return safeStr(t);
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    const pageImgRaw = safeStr(page?.featured_image);
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.svg');
  }, [page?.featured_image, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj(seo?.twitter) || {};
    const robots = asObj(seo?.robots) || {};
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
