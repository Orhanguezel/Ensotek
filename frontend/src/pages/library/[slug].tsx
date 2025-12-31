// =============================================================
// FILE: src/pages/library/[slug].tsx
// Ensotek – Library Detail Page (by slug) + SEO (HOOK-SAFE)
//   - Route: /library/[slug]
//   - i18n: useLocaleShort() + site_settings.ui_library
//   - SEO: seo -> site_seo fallback + library.meta* override (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import LibraryDetail from '@/components/containers/library/LibraryDetail';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
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

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q;
  if (Array.isArray(q)) return String(q[0] ?? '');
  return '';
}

const LibraryDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_library', locale as any);

  // slug normalize
  const slug = useMemo(() => readSlug(router.query.slug).trim(), [router.query.slug]);
  const isSlugReady = !!slug;

  // UI fallbacks
  const listTitleFallback = ui('ui_library_page_title', 'Library');
  const detailTitleFallback = ui('ui_library_detail_page_title', 'Library Detail');

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // Library item (meta override)
  const { data: item } = useGetLibraryBySlugQuery({ slug, locale }, { skip: !isSlugReady }) as {
    data?: LibraryDto;
  };

  // Banner title: item.name -> fallback
  const bannerTitle = useMemo(() => {
    const t = String(item?.name ?? '').trim();
    return t || detailTitleFallback || listTitleFallback;
  }, [item?.name, detailTitleFallback, listTitleFallback]);

  const seoSiteName = useMemo(() => String(seo?.site_name ?? '').trim() || 'Ensotek', [seo]);
  const titleTemplate = useMemo(
    () => String(seo?.title_template ?? '').trim() || '%s | Ensotek',
    [seo],
  );

  // --- SEO fields (detail page) ---
  const pageTitleRaw = useMemo(() => {
    if (!isSlugReady) return String(listTitleFallback || '').trim() || 'Library';

    const metaTitle = String(item?.meta_title ?? '').trim();
    const name = String(item?.name ?? '').trim();

    return metaTitle || name || String(bannerTitle || '').trim() || 'Library';
  }, [isSlugReady, listTitleFallback, item?.meta_title, item?.name, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const globalDesc = String(seo?.description ?? '').trim() || '';

    if (!isSlugReady) return globalDesc;

    const metaDesc = String(item?.meta_description ?? '').trim();
    const desc = String(item?.description ?? '').trim();

    return metaDesc || (desc ? excerpt(desc, 160).trim() : '') || globalDesc || '';
  }, [isSlugReady, item?.meta_description, item?.description, seo?.description]);

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    if (!isSlugReady) return fallback || absUrl('/favicon.svg');

    // Backend DTO fields (schema-safe)
    const rawImg = String(item?.featured_image ?? item?.image_url ?? '').trim();
    const img = rawImg ? toCdnSrc(rawImg, 1200, 630, 'fill') || rawImg : '';

    return (img && absUrl(img)) || fallback || absUrl('/favicon.svg');
  }, [isSlugReady, item?.featured_image, item?.image_url, seo]);

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
      <LibraryDetail />
    </>
  );
};

export default LibraryDetailPage;
