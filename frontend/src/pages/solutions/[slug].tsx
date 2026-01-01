// =============================================================
// FILE: src/pages/solutions/[slug].tsx
// Ensotek – Solutions Detail Page (by slug) + SEO (PUBLIC PAGES ROUTER STANDARD)
//   - Route: /solutions/[slug]
//   - NO <Head>
//   - SEO override: <LayoutSeoBridge />
//   - Canonical/og:url/hreflang: _document (SSR) + Layout
//   - Skeleton: common public Skeleton (single source)
//   - slug: readSlug(router.query.slug) + router.isReady
//   - DB meta precedence: meta_title/meta_description + featured_image/image_url
//   - Content: <SolutionsPage forcedSlug />
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import SolutionsPage from '@/components/containers/solutions/SolutionsPage';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import Skeleton from '@/components/common/public/Skeleton';

import { excerpt } from '@/shared/text';
import { toCdnSrc } from '@/shared/media';

import {
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery,
} from '@/integrations/rtk/hooks';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q.trim();
  if (Array.isArray(q)) return String(q[0] ?? '').trim();
  return '';
}

function pickPageImage(page: any): string {
  return safeStr(page?.featured_image) || safeStr(page?.image_url) || '';
}

const SolutionsDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_solutions', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = router.isReady && !!slug;

  // ✅ default_locale DB’den (locale bağımsız)
  const { data: defaultLocaleRow } = useGetSiteSettingByKeyQuery({ key: 'default_locale' });
  const defaultLocale = useMemo(
    () => safeStr(defaultLocaleRow?.value) || 'de',
    [defaultLocaleRow?.value],
  );

  // ✅ Solutions pages list; slug meta için listeden bul
  const { data: listData, isFetching } = useListCustomPagesPublicQuery(
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
    return items.find((x) => safeStr(x?.slug).toLowerCase() === target) ?? null;
  }, [items, isSlugReady, slug]);

  // UI fallbacks (validated)
  const listTitleFallback = useMemo(() => {
    const key = 'ui_solutions_page_title';
    const v = safeStr(ui(key, 'Solutions'));
    return isValidUiText(v, key) ? v : 'Solutions';
  }, [ui]);

  const bannerTitle = useMemo(() => {
    const t = safeStr(page?.title);
    if (t) return t;
    return listTitleFallback || 'Solutions';
  }, [page, listTitleFallback]);

  // --- SEO override (DB meta first; UI only fallback) ---

  const pageTitle = useMemo(() => {
    if (!isSlugReady) return listTitleFallback;

    const mt = safeStr(page?.meta_title);
    if (mt) return mt;

    const t = safeStr(page?.title);
    if (t) return t;

    return listTitleFallback;
  }, [isSlugReady, page, listTitleFallback]);

  const pageDescription = useMemo(() => {
    if (!isSlugReady) return '';

    const md = safeStr(page?.meta_description);
    if (md) return md;

    const sum = safeStr(page?.summary);
    if (sum) {
      const ex = excerpt(sum, 160).trim();
      if (ex) return ex;
    }

    // Optional UI fallback (new key preferred; old supported)
    const keyNew = 'ui_solutions_detail_meta_description_fallback';
    const keyOld = 'ui_solutions_detail_meta_description';

    const vNew = safeStr(
      ui(
        keyNew,
        'Explore the solution details and contact us for tailored support and consultation.',
      ),
    );
    if (isValidUiText(vNew, keyNew)) return vNew;

    const vOld = safeStr(
      ui(
        keyOld,
        'Explore the solution details and contact us for tailored support and consultation.',
      ),
    );
    if (isValidUiText(vOld, keyOld)) return vOld;

    return '';
  }, [isSlugReady, page, ui]);

  const ogImageOverride = useMemo(() => {
    if (!isSlugReady) return undefined;

    const raw = pickPageImage(page);
    if (!raw) return undefined;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [isSlugReady, page]);

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

      {showSkeleton ? <Skeleton /> : <SolutionsPage forcedSlug={slug} />}
    </>
  );
};

export default SolutionsDetailPage;
