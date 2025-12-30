// =============================================================
// FILE: src/pages/solutions/[slug].tsx
// Ensotek – Solutions Detail Page (by slug) + SEO
//   - Route: /solutions/[slug]
//   - Uses: <SolutionsPage forcedSlug />
//   - SEO: seo -> site_seo fallback + custom_page(meta_*) override (NO canonical here)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import SolutionsPage from '@/components/containers/solutions/SolutionsPage';

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

// helpers
import { excerpt } from '@/shared/text';
import { toCdnSrc } from '@/shared/media';

// ui skeleton
import { SkeletonLine, SkeletonStack } from '@/components/ui/skeleton';

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q;
  if (Array.isArray(q)) return String(q[0] ?? '');
  return '';
}

function s(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function pickPageImage(page: any): string {
  return s(page?.featured_image) || s(page?.image_url) || '';
}

const SolutionsDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_solutions', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug).trim(), [router.query.slug]);
  const isSlugReady = !!slug;

  // ✅ default_locale DB’den (locale bağımsız)
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' });
  const defaultLocale = useMemo(
    () => s(defaultLocaleRow?.value) || 'de',
    [defaultLocaleRow?.value],
  );

  // Global SEO settings (seo -> site_seo fallback)
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // ✅ Solutions pages list; slug detail meta için içinden bulacağız
  const { data: listData, isLoading: isListLoading } = useListCustomPagesPublicQuery(
    {
      module_key: 'solutions',
      locale,
      default_locale: defaultLocale,
      limit: 100,
      offset: 0,
      sort: 'created_at',
      orderDir: 'asc',
      is_published: 1,
    } as any,
    { skip: !isSlugReady },
  );

  const items = useMemo<any[]>(() => ((listData as any)?.items ?? []) as any, [listData]);

  const page = useMemo(() => {
    if (!isSlugReady) return null;
    const target = slug.toLowerCase();
    return items.find((x) => s(x?.slug).toLowerCase() === target) ?? null;
  }, [items, isSlugReady, slug]);

  // Banner title
  const listTitleFallback = s(ui('ui_solutions_page_title', 'Solutions')) || 'Solutions';
  const bannerTitle = useMemo(() => {
    return s(page?.title) || listTitleFallback || 'Solutions';
  }, [page, listTitleFallback]);

  // --- SEO fields ---
  const pageTitleRaw = useMemo(() => {
    const fallback = bannerTitle || 'Solutions';
    if (!isSlugReady) return fallback;

    return s(page?.meta_title) || s(page?.title) || fallback;
  }, [isSlugReady, page, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const globalDesc = s((seo as any)?.description) || '';
    if (!isSlugReady) return globalDesc;

    const metaDesc = s(page?.meta_description);
    const summary = s(page?.summary) || '';

    const uiFallback =
      s(
        ui(
          'ui_solutions_detail_meta_description',
          'Explore the solution details and contact us for tailored support and consultation.',
        ),
      ) || '';

    return (
      metaDesc || (summary ? excerpt(summary, 160).trim() : '') || uiFallback || globalDesc || ''
    );
  }, [isSlugReady, page, seo, ui]);

  const seoSiteName = useMemo(() => s((seo as any)?.site_name) || 'Ensotek', [seo]);
  const titleTemplate = useMemo(() => s((seo as any)?.title_template) || '%s | Ensotek', [seo]);

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return s(t);
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';

    const rawImg = pickPageImage(page);
    const img = rawImg ? toCdnSrc(rawImg, 1200, 630, 'fill') || rawImg : '';

    return (img && absUrl(img)) || fallback || absUrl('/favicon.svg');
  }, [page, seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
    const noindex = typeof (robots as any).noindex === 'boolean' ? (robots as any).noindex : false;

    // ✅ canonical + og:url YOK (tek kaynak: _document SSR)
    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,
      twitterCard: s((tw as any).card) || 'summary_large_image',
      twitterSite: typeof (tw as any).site === 'string' ? (tw as any).site.trim() : undefined,
      twitterCreator:
        typeof (tw as any).creator === 'string' ? (tw as any).creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, ogImage, seoSiteName]);

  const isLoadingState = !isSlugReady || (isListLoading && !page);

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

      {isLoadingState ? (
        <div className="technical__area pt-120 pb-60 cus-faq">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <SkeletonStack>
                  <SkeletonLine style={{ height: 24 }} />
                  <SkeletonLine className="mt-10" style={{ height: 16 }} />
                  <SkeletonLine className="mt-10" style={{ height: 16, width: '80%' }} />
                </SkeletonStack>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SolutionsPage forcedSlug={slug} />
      )}
    </>
  );
};

export default SolutionsDetailPage;
