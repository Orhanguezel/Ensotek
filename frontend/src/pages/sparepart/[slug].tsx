// =============================================================
// FILE: src/pages/sparepart/[slug].tsx
// Ensotek – Sparepart Detail Page (by slug) + SEO (STANDARD)
// - NO <Head>
// - SEO override: <LayoutSeoBridge />
// - Skeleton: common public Skeleton
// - slug: readSlug(router.query.slug) + router.isReady
// - DB meta precedence
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
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
  const { ui } = useUiSection('ui_spareparts', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = router.isReady && !!slug;

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

  // ✅ IMPORTANT: item_type=sparepart
  const { data: product, isFetching } = useGetProductBySlugQuery(
    { slug, locale, item_type: 'sparepart' } as any,
    { skip: !isSlugReady },
  );

  const bannerTitle = useMemo(() => {
    const t = safeStr((product as any)?.title ?? (product as any)?.name);
    if (t) return t;
    return detailTitleFallback || listTitleFallback;
  }, [product, detailTitleFallback, listTitleFallback]);

  const pageTitle = useMemo(() => {
    if (!isSlugReady) return listTitleFallback;

    const mt = safeStr((product as any)?.meta_title);
    if (mt) return mt;

    const t = safeStr((product as any)?.title ?? (product as any)?.name);
    if (t) return t;

    return detailTitleFallback || listTitleFallback;
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

    const keyNew = 'ui_spareparts_detail_meta_description_fallback';
    const keyOld = 'ui_spareparts_detail_meta_description';

    const vNew = safeStr(
      ui(keyNew, 'View spare part details, technical specifications, and request a quote.'),
    );
    if (isValidUiText(vNew, keyNew)) return vNew;

    const vOld = safeStr(
      ui(keyOld, 'View spare part details, technical specifications, and request a quote.'),
    );
    if (isValidUiText(vOld, keyOld)) return vOld;

    return '';
  }, [isSlugReady, product, ui]);

  const ogImageOverride = useMemo(() => {
    if (!isSlugReady) return undefined;

    const raw =
      safeStr((product as any)?.featured_image) ||
      safeStr((product as any)?.image_url) ||
      safeStr((Array.isArray((product as any)?.images) ? (product as any).images?.[0] : '') || '');

    if (!raw) return undefined;
    if (/^https?:\/\//i.test(raw)) return raw;

    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [isSlugReady, product]);

  const showSkeleton = !isSlugReady || isFetching || !product;

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
          <ProductDetail />
          <ProductMore />
        </>
      )}
    </>
  );
};

export default SparepartDetailPage;
