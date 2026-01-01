// =============================================================
// FILE: src/pages/library/[slug].tsx
// Ensotek – Library Detail Page [FINAL / STANDARD]
// - Route: /library/[slug]
// - ✅ NO <Head>
// - ✅ Page SEO overrides via <LayoutSeoBridge />
// - ✅ General meta/canonical/hreflang/etc. stays in Layout/_document (no duplication)
// - SEO priority (detail):
//   title: item.meta_title -> item.name -> ui fallback -> fallback
//   desc : item.meta_description -> excerpt(item.description) -> Layout default
//   og   : item.featured_image || item.image_url -> undefined (Layout decides)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import LibraryDetail from '@/components/containers/library/LibraryDetail';

// ✅ Page -> Layout SEO overrides (STANDARD)
import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

// i18n + UI
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// data
import { useGetLibraryBySlugQuery } from '@/integrations/rtk/hooks';
import type { LibraryDto } from '@/integrations/types/library.types';

// helpers
import { excerpt } from '@/shared/text';
import { toCdnSrc } from '@/shared/media';

// ✅ Skeleton (shared)
import Skeleton from '@/components/common/public/Skeleton';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q.trim();
  if (Array.isArray(q)) return String(q[0] ?? '').trim();
  return '';
}

const LibraryDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_library', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = router.isReady && !!slug;

  // Library item
  const { data: item, isFetching } = useGetLibraryBySlugQuery(
    { slug, locale },
    { skip: !isSlugReady },
  ) as { data?: LibraryDto; isFetching: boolean };

  // -----------------------------
  // UI fallbacks
  // -----------------------------
  const listTitleFallback = useMemo(() => {
    const key = 'ui_library_page_title';
    const v = safeStr(ui(key, 'Library'));
    return isValidUiText(v, key) ? v : 'Library';
  }, [ui]);

  const detailTitleFallback = useMemo(() => {
    const key = 'ui_library_detail_page_title';
    const v = safeStr(ui(key, 'Library Detail'));
    return isValidUiText(v, key) ? v : 'Library Detail';
  }, [ui]);

  // -----------------------------
  // Banner title
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const t = safeStr(item?.name);
    if (t) return t;

    const d = safeStr(detailTitleFallback);
    if (d) return d;

    return listTitleFallback || 'Library';
  }, [item?.name, detailTitleFallback, listTitleFallback]);

  // -----------------------------
  // SEO overrides (detail)
  // - empty => Layout defaults
  // -----------------------------
  const pageTitle = useMemo(() => {
    if (!isSlugReady) return listTitleFallback || 'Library';

    const mt = safeStr((item as any)?.meta_title);
    if (mt) return mt;

    const name = safeStr(item?.name);
    if (name) return name;

    const d = safeStr(detailTitleFallback);
    if (d) return d;

    return listTitleFallback || 'Library';
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSlugReady, item, item?.name, detailTitleFallback, listTitleFallback]);

  const pageDescription = useMemo(() => {
    if (!isSlugReady) return '';

    const md = safeStr((item as any)?.meta_description);
    if (md) return md;

    const desc = safeStr((item as any)?.description);
    if (desc) {
      const ex = excerpt(desc, 160).trim();
      if (ex) return ex;
    }

    // empty => Layout default description
    return '';
  }, [isSlugReady, item]);

  const ogImageOverride = useMemo(() => {
    if (!isSlugReady) return undefined;

    const raw = safeStr((item as any)?.featured_image) || safeStr((item as any)?.image_url) || '';
    if (!raw) return undefined;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [isSlugReady, item]);

  const showSkeleton = !isSlugReady || isFetching || !item;

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />

      {showSkeleton ? <Skeleton /> : <LibraryDetail />}
    </>
  );
};

export default LibraryDetailPage;
