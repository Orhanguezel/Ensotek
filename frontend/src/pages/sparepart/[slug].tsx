// =============================================================
// FILE: src/pages/sparepart/[slug].tsx
// Ensotek – Sparepart Detail Page [FINAL / STANDARD]
// - Route: /sparepart/[slug]
// - ✅ NO <Head>
// - ✅ Page SEO overrides via <LayoutSeoBridge />
// - ✅ Query args aligned with ProductDetail (item_type=sparepart) => RTK cache dedupe
// - ✅ 404/error state: no infinite skeleton
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Banner from '@/layout/banner/Breadcrum';
import ProductDetail from '@/components/containers/product/ProductDetail';
import ProductMore from '@/components/containers/product/ProductMore';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import Skeleton from '@/components/common/public/Skeleton';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

import { useGetProductBySlugQuery } from '@/integrations/rtk/hooks';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q.trim();
  if (Array.isArray(q)) return String(q[0] ?? '').trim();
  return '';
}

const SparepartDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  // ✅ spareparts UI
  const { ui } = useUiSection('ui_spareparts', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = router.isReady && !!slug;

  // -----------------------------
  // UI fallbacks
  // -----------------------------
  const listTitleFallback = useMemo(() => {
    const key = 'ui_spareparts_page_title';
    const v = safeStr(ui(key, 'Spare Parts'));
    return isValidUiText(v, key) ? v : 'Spare Parts';
  }, [ui]);

  const detailTitleFallback = useMemo(() => {
    const key = 'ui_spareparts_detail_page_title';
    const v = safeStr(ui(key, 'Spare Part'));
    return isValidUiText(v, key) ? v : 'Spare Part';
  }, [ui]);

  // ✅ IMPORTANT: item_type=sparepart (must match ProductDetail)
  const {
    data: product,
    isFetching,
    isLoading,
    isError,
  } = useGetProductBySlugQuery({ slug, locale, item_type: 'sparepart' } as any, {
    skip: !isSlugReady,
  });

  // -----------------------------
  // Banner title
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const t = safeStr((product as any)?.title ?? (product as any)?.name);
    if (t) return t;

    const d = safeStr(detailTitleFallback);
    if (d) return d;

    return listTitleFallback || 'Spare Part';
  }, [product, detailTitleFallback, listTitleFallback]);

  // -----------------------------
  // SEO overrides
  // -----------------------------
  const pageTitle = useMemo(() => {
    if (!isSlugReady) return listTitleFallback || 'Spare Parts';

    const mt = safeStr((product as any)?.meta_title);
    if (mt) return mt;

    const t = safeStr((product as any)?.title ?? (product as any)?.name);
    if (t) return t;

    const d = safeStr(detailTitleFallback);
    if (d) return d;

    return listTitleFallback || 'Spare Part';
  }, [isSlugReady, product, detailTitleFallback, listTitleFallback]);

  const pageDescription = useMemo(() => {
    if (!isSlugReady) return '';

    const md = safeStr((product as any)?.meta_description);
    if (md) return md;

    const rawDesc = safeStr((product as any)?.summary ?? (product as any)?.description ?? '');
    if (rawDesc) {
      const ex = excerpt(rawDesc, 160).trim();
      if (ex) return ex;
    }

    // keep backward compatible keys
    const keyNew = 'ui_spareparts_detail_meta_description_fallback';
    const keyOld = 'ui_spareparts_detail_meta_description';
    const def = 'View spare part details, technical specifications, and request a quote.';

    const vNew = safeStr(ui(keyNew, def));
    if (isValidUiText(vNew, keyNew)) return vNew;

    const vOld = safeStr(ui(keyOld, def));
    if (isValidUiText(vOld, keyOld)) return vOld;

    return '';
  }, [isSlugReady, product, ui]);

  const ogImageOverride = useMemo(() => {
    if (!isSlugReady) return undefined;

    const img0 = Array.isArray((product as any)?.images) ? (product as any).images?.[0] : '';
    const raw =
      safeStr((product as any)?.featured_image) ||
      safeStr((product as any)?.image_url) ||
      safeStr(img0);

    if (!raw) return undefined;
    if (/^https?:\/\//i.test(raw)) return raw;

    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [isSlugReady, product]);

  // ✅ Critical fix: do NOT keep skeleton forever on 404/error
  const showSkeleton = !isSlugReady || isLoading || (isFetching && !isError);

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
          {/* ProductDetail already handles notFound UI via its own query/error handling */}
          <ProductDetail />
          <ProductMore />
        </>
      )}
    </>
  );
};

export default SparepartDetailPage;
