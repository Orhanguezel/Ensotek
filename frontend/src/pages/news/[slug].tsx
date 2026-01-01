// =============================================================
// FILE: src/pages/news/[slug].tsx
// Ensotek – News Detail Page (by slug) [FINAL / STANDARD]
// - Route: /news/[slug]
// - Data: custom_pages/by-slug (module_key="news")
// - ✅ NO <Head>
// - ✅ Page SEO overrides via <LayoutSeoBridge />
// - ✅ General meta/canonical/hreflang/etc. stays in Layout/_document (no duplication)
// - SEO priority:
//   title: page.meta_title -> page.title -> ui_news_detail_page_title -> ui_news_page_title -> fallback
//   desc : page.meta_description -> page.summary -> excerpt(page.content_html) -> (optional UI fallback) -> Layout default
//   og   : page.featured_image -> undefined (Layout decides)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Banner from '@/layout/banner/Breadcrum';
import NewsDetail from '@/components/containers/news/NewsDetail';
import NewsMore from '@/components/containers/news/NewsMore';

// ✅ Page -> Layout SEO overrides (STANDARD)
import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

// i18n + UI
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// data
import { useGetCustomPageBySlugPublicQuery } from '@/integrations/rtk/hooks';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// ✅ skeleton (shared, no inline styles)
import Skeleton from '@/components/common/public/Skeleton';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q.trim();
  if (Array.isArray(q)) return String(q[0] ?? '').trim();
  return '';
}

const NewsDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_news', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = router.isReady && !!slug;

  const { data: page, isFetching } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  // -----------------------------
  // UI fallbacks
  // -----------------------------
  const listTitleFallback = useMemo(() => {
    const key = 'ui_news_page_title';
    const v = safeStr(ui(key, 'News'));
    return isValidUiText(v, key) ? v : 'News';
  }, [ui]);

  const detailTitleFallback = useMemo(() => {
    const key = 'ui_news_detail_page_title';
    const v = safeStr(ui(key, 'News Detail'));
    return isValidUiText(v, key) ? v : 'News Detail';
  }, [ui]);

  // -----------------------------
  // Banner title
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const t = safeStr(page?.title);
    if (t) return t;

    const d = safeStr(detailTitleFallback);
    if (d) return d;

    return listTitleFallback || 'News';
  }, [page?.title, detailTitleFallback, listTitleFallback]);

  // -----------------------------
  // SEO (page overrides only)
  // -----------------------------
  const pageTitle = useMemo(() => {
    if (!isSlugReady) return listTitleFallback || 'News';

    const mt = safeStr(page?.meta_title);
    if (mt) return mt;

    const t = safeStr(page?.title);
    if (t) return t;

    const d = safeStr(detailTitleFallback);
    if (d) return d;

    return listTitleFallback || 'News';
  }, [isSlugReady, page?.meta_title, page?.title, detailTitleFallback, listTitleFallback]);

  const pageDescription = useMemo(() => {
    if (!isSlugReady) return '';

    const md = safeStr(page?.meta_description);
    if (md) return md;

    const s = safeStr(page?.summary);
    if (s) return s;

    const ex = excerpt(safeStr(page?.content_html), 160).trim();
    if (ex) return ex;

    // optional UI fallback
    const uiDescKey = 'ui_news_detail_meta_description_fallback';
    const uiDesc = safeStr(ui(uiDescKey, ''));
    if (uiDesc && isValidUiText(uiDesc, uiDescKey)) return uiDesc;

    return '';
  }, [isSlugReady, page?.meta_description, page?.summary, page?.content_html, ui]);

  const ogImageOverride = useMemo(() => {
    if (!isSlugReady) return undefined;

    const raw = safeStr(page?.featured_image);
    if (!raw) return undefined;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [isSlugReady, page?.featured_image]);

  const showSkeleton = !isSlugReady || isFetching || !page;

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />

      {showSkeleton ? (
        <Skeleton />
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
