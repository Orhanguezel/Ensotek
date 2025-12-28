// =============================================================
// FILE: src/pages/blog/index.tsx
// Ensotek – Blog Page (full list) + SEO
//   - Route: /blog
//   - Data: custom_pages (module_key="blog") => meta override (first published)
//   - i18n: useLocaleShort() + site_settings.ui_blog
//   - SEO: seo -> site_seo fallback + OG/Twitter (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import BlogPageContent from '@/components/containers/blog/BlogPageContent';
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

const BlogPage: React.FC = () => {
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_blog', locale as any);

  // ======================
  // Banner title (UI)
  // ======================
  const bannerTitle = ui('ui_blog_page_title', 'Blog');

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
  // Blog custom pages (meta override için: ilk published kayıt)
  // ======================
  const { data: blogData } = useListCustomPagesPublicQuery({
    module_key: 'blog',
    locale,
    limit: 10,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const primary = useMemo<CustomPageDto | undefined>(() => {
    const items: CustomPageDto[] = (blogData?.items ?? []) as any;
    const published = items.filter((p) => !!p?.is_published);
    return published[0];
  }, [blogData]);

  // ======================
  // SEO fields (page-level)
  // ======================
  const pageTitleRaw = useMemo(() => {
    const uiMeta = String(ui('ui_blog_meta_title', '') || '').trim();
    if (uiMeta) return uiMeta;

    const meta = String(primary?.meta_title ?? '').trim();
    if (meta) return meta;

    const title = String(primary?.title ?? '').trim();
    if (title) return title;

    return String(bannerTitle || '').trim() || 'Blog';
  }, [ui, primary?.meta_title, primary?.title, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const uiMeta = String(ui('ui_blog_meta_description', '') || '').trim();
    if (uiMeta) return uiMeta;

    const meta = String(primary?.meta_description ?? '').trim();
    if (meta) return meta;

    const sum = String(primary?.summary ?? '').trim();
    if (sum) return sum;

    const ex = excerpt(primary?.content_html ?? '', 160).trim();
    if (ex) return ex;

    return String(seo?.description ?? '').trim() || '';
  }, [ui, primary?.meta_description, primary?.summary, primary?.content_html, seo?.description]);

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
    const pageImgRaw = String(primary?.featured_image ?? '').trim();
    const pageImg = pageImgRaw ? toCdnSrc(pageImgRaw, 1200, 630, 'fill') || pageImgRaw : '';

    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    return (pageImg && absUrl(pageImg)) || fallback || absUrl('/favicon.svg');
  }, [primary?.featured_image, seo]);

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
      <BlogPageContent />
      <Feedback />
    </>
  );
};

export default BlogPage;
