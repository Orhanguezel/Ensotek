// =============================================================
// FILE: src/pages/news/index.tsx
// Ensotek – News Page (list) [FINAL / STANDARD]
// - Route: /news
// - Data: custom_pages (module_key="news") for meta override (first published)
// - ✅ NO <Head>
// - ✅ Page SEO overrides via <LayoutSeoBridge />
// - ✅ General meta/canonical/hreflang/etc. stays in Layout/_document (no duplication)
// - SEO priority:
//   title: primary.meta_title -> primary.title -> ui_news_page_title -> fallback
//   desc : primary.meta_description -> primary.summary -> excerpt(primary.content_html) -> Layout default
//   og   : primary.featured_image -> undefined (Layout decides)
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/layout/banner/Breadcrum';
import NewsPageContent from '@/components/containers/news/NewsPageContent';
import Feedback from '@/components/containers/feedback/Feedback';

// ✅ Page -> Layout SEO overrides (STANDARD)
import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

// i18n + UI
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// data
import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

const NewsPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_news', locale as any);

  // -----------------------------
  // Banner title (UI)
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_news_page_title';
    const v = safeStr(ui(key, 'News'));
    return isValidUiText(v, key) ? v : 'News';
  }, [ui]);

  // -----------------------------
  // News list for meta override (first published)
  // PERF: limit small
  // -----------------------------
  const { data: newsData } = useListCustomPagesPublicQuery({
    module_key: 'news',
    locale,
    limit: 5,
    sort: 'created_at',
    orderDir: 'asc',
  });

  const primary = useMemo<CustomPageDto | null>(() => {
    const items = (newsData?.items ?? []) as any[];
    if (!Array.isArray(items) || items.length === 0) return null;

    for (const it of items) {
      if (it && it.is_published) return it as CustomPageDto;
    }
    return null;
  }, [newsData?.items]);

  // -----------------------------
  // SEO (page overrides only)
  // -----------------------------
  const pageTitle = useMemo(() => {
    const mt = safeStr(primary?.meta_title);
    if (mt) return mt;

    const t = safeStr(primary?.title);
    if (t) return t;

    return bannerTitle || 'News';
  }, [primary?.meta_title, primary?.title, bannerTitle]);

  const pageDescription = useMemo(() => {
    const md = safeStr(primary?.meta_description);
    if (md) return md;

    const s = safeStr(primary?.summary);
    if (s) return s;

    const ex = excerpt(safeStr(primary?.content_html), 160).trim();
    if (ex) return ex;

    // empty => Layout default description
    return '';
  }, [primary?.meta_description, primary?.summary, primary?.content_html]);

  const ogImageOverride = useMemo(() => {
    const raw = safeStr(primary?.featured_image);
    if (!raw) return undefined;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [primary?.featured_image]);

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />
      <NewsPageContent />
      <Feedback />
    </>
  );
};

export default NewsPage;
