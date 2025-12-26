// =============================================================
// FILE: src/pages/library/[slug].tsx
// Ensotek – Library Detail Page (by slug) + SEO (HOOK-SAFE)
//   - Route: /library/[slug]
//   - SEO: site_settings seo|site_seo fallback + library.meta_* override
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import LibraryDetail from '@/components/containers/library/LibraryDetail';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import { useGetSiteSettingByKeyQuery, useGetLibraryBySlugQuery } from '@/integrations/rtk/hooks';
import type { LibraryDto } from '@/integrations/types/library.types';

// helpers
import { excerpt } from '@/shared/text';
import { toCdnSrc } from '@/shared/media';

const toLocaleShort = (l: any) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .split('-')[0] || 'de';

const LibraryDetailPage: React.FC = () => {
  const router = useRouter();

  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_library', locale);

  // slug normalize
  const slugParam = router.query.slug;
  const slug =
    typeof slugParam === 'string' ? slugParam : Array.isArray(slugParam) ? slugParam[0] ?? '' : '';

  const isSlugReady = Boolean(slug);

  // UI fallbacks
  const listTitleFallback = ui('ui_library_page_title', 'Library');
  const detailTitleFallback = ui(
    'ui_library_detail_page_title',
    locale === 'de' ? 'Teknik Doküman Detayı' : 'Library Detail',
  );

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // Library item (meta override)
  const { data: item } = useGetLibraryBySlugQuery({ slug, locale }, { skip: !isSlugReady }) as {
    data?: LibraryDto;
  };

  // Banner title: item.title -> fallback
  const bannerTitle = useMemo(() => {
    const t = String((item as any)?.title ?? '').trim();
    return t || detailTitleFallback || listTitleFallback;
  }, [item, detailTitleFallback, listTitleFallback]);

  const seoSiteName = useMemo(() => String(seo?.site_name ?? '').trim() || 'Ensotek', [seo]);
  const titleTemplate = useMemo(
    () => String(seo?.title_template ?? '').trim() || '%s | Ensotek',
    [seo],
  );

  // --- SEO fields (detail page) ---
  const pageTitleRaw = useMemo(() => {
    if (!isSlugReady) return String(listTitleFallback).trim();

    const metaTitle = String((item as any)?.meta_title ?? '').trim();
    const title = String((item as any)?.title ?? '').trim();

    return metaTitle || title || String(bannerTitle).trim();
  }, [isSlugReady, listTitleFallback, item, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    if (!isSlugReady) return String(seo?.description ?? '').trim() || '';

    const metaDesc = String((item as any)?.meta_description ?? '').trim();
    const summary = String((item as any)?.summary ?? '').trim();

    // content_html varsa excerpt ile
    const contentHtml = String((item as any)?.content_html ?? '').trim();

    return (
      metaDesc ||
      summary ||
      (contentHtml ? excerpt(contentHtml, 160).trim() : '') ||
      String(seo?.description ?? '').trim() ||
      ''
    );
  }, [isSlugReady, item, seo]);

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    if (!isSlugReady) return fallback || absUrl('/favicon.ico');

    // Sende alan adı farklı olabilir: featured_image / cover / file_thumb vb.
    const rawImg = String((item as any)?.featured_image ?? (item as any)?.image_url ?? '').trim();
    const img = rawImg ? toCdnSrc(rawImg, 1200, 630, 'fill') || rawImg : '';

    return (img && absUrl(img)) || fallback || absUrl('/favicon.ico');
  }, [isSlugReady, item, seo]);

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
          if (spec.kind === 'link')
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          if (spec.kind === 'meta-name')
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}
      </Head>

      <Banner title={bannerTitle} />
      <LibraryDetail />
    </>
  );
};

export default LibraryDetailPage;
