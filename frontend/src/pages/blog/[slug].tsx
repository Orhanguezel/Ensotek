// =============================================================
// FILE: src/pages/blog/[slug].tsx
// Ensotek – Blog Detail Page (by slug) + SEO
//   - Route: /blog/[slug]
//   - Data: custom_pages/by-slug (module_key="blog")
//   - i18n: useLocaleShort() + site_settings.ui_blog
//   - SEO: seo -> site_seo fallback + page.meta_* override (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import BlogDetailsArea from '@/components/containers/blog/BlogDetails';
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
  useGetCustomPageBySlugPublicQuery,
} from '@/integrations/rtk/hooks';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

const BlogDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_blog', locale as any);

  const slug = useMemo(() => {
    const q = router.query.slug;
    if (typeof q === 'string') return q.trim();
    if (Array.isArray(q)) return String(q[0] ?? '').trim();
    return '';
  }, [router.query.slug]);

  const isSlugReady = !!slug;

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // Blog item data (for SEO + banner)
  const { data: page } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  const listTitleFallback = ui('ui_blog_page_title', 'Blog');
  const detailTitleFallback = ui('ui_blog_detail_page_title', 'Blog Detail');

  const bannerTitle = useMemo(() => {
    const t = String(page?.title ?? '').trim();
    if (t) return t;

    const d = String(detailTitleFallback ?? '').trim();
    if (d) return d;

    const l = String(listTitleFallback ?? '').trim();
    return l || 'Blog';
  }, [page?.title, detailTitleFallback, listTitleFallback]);

  // --- SEO fields ---
  const pageTitleRaw = useMemo(() => {
    const mt = String(page?.meta_title ?? '').trim();
    if (mt) return mt;

    const t = String(page?.title ?? '').trim();
    if (t) return t;

    const b = String(bannerTitle ?? '').trim();
    if (b) return b;

    const l = String(listTitleFallback ?? '').trim();
    return l || 'Blog';
  }, [page?.meta_title, page?.title, bannerTitle, listTitleFallback]);

  const pageDescRaw = useMemo(() => {
    const globalDesc = String((seo as any)?.description ?? '').trim();

    if (!isSlugReady) return globalDesc || '';

    const md = String(page?.meta_description ?? '').trim();
    if (md) return md;

    const s = String(page?.summary ?? '').trim();
    if (s) return s;

    const ex = excerpt(String(page?.content_html ?? ''), 160).trim();
    if (ex) return ex;

    return globalDesc || '';
  }, [isSlugReady, page?.meta_description, page?.summary, page?.content_html, seo]);

  const seoSiteName = useMemo(() => {
    return String((seo as any)?.site_name ?? '').trim() || 'Ensotek';
  }, [seo]);

  const titleTemplate = useMemo(() => {
    return String((seo as any)?.title_template ?? '').trim() || '%s | Ensotek';
  }, [seo]);

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    const pageImgRaw = String(page?.featured_image ?? '').trim();
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.svg');
  }, [page?.featured_image, seo]);

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

      twitterCard: String((tw as any).card ?? '').trim() || 'summary_large_image',
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
          <BlogDetailsArea />
          <Feedback />
        </>
      )}
    </>
  );
};

export default BlogDetailPage;
