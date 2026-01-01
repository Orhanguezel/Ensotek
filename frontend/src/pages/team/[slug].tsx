// =============================================================
// FILE: src/pages/team/[slug].tsx
// Ensotek – Team Member Detail Page (by slug) + SEO (PUBLIC PAGES ROUTER STANDARD)
//   - Route: /team/[slug]
//   - NO <Head>
//   - SEO override: <LayoutSeoBridge />
//   - Canonical/og:url/hreflang: _document (SSR) + Layout
//   - Skeleton: common public Skeleton (single source)
//   - slug: readSlug(router.query.slug) + router.isReady
//   - Data: custom_pages/by-slug (module_key="team" expected in backend)
//   - DB meta precedence: meta_title/meta_description + featured_image/image_url
// =============================================================

'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import Banner from '@/components/layout/banner/Breadcrum';
import TeamDetail from '@/components/containers/team/TeamDetail';
import ServiceCtaTwo from '@/components/containers/cta/CatalogCta';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import Skeleton from '@/components/common/public/Skeleton';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

import { useGetCustomPageBySlugPublicQuery } from '@/integrations/rtk/hooks';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q.trim();
  if (Array.isArray(q)) return String(q[0] ?? '').trim();
  return '';
}

const TeamDetailPage: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_team', locale as any);

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = router.isReady && !!slug;

  // UI fallbacks (validated)
  const listTitleFallback = useMemo(() => {
    const key = 'ui_team_page_title';
    const v = safeStr(ui(key, 'Team'));
    return isValidUiText(v, key) ? v : 'Team';
  }, [ui]);

  const detailTitleFallback = useMemo(() => {
    const key = 'ui_team_detail_page_title';
    const v = safeStr(ui(key, 'Team Member'));
    return isValidUiText(v, key) ? v : 'Team Member';
  }, [ui]);

  // Team member data (by slug)
  const { data: page, isFetching } = useGetCustomPageBySlugPublicQuery({ slug, locale } as any, {
    skip: !isSlugReady,
  });

  const bannerTitle = useMemo(() => {
    const t = safeStr(page?.title);
    if (t) return t;
    return detailTitleFallback || listTitleFallback;
  }, [page?.title, detailTitleFallback, listTitleFallback]);

  // --- SEO override (DB meta first; UI fallback only) ---

  const pageTitle = useMemo(() => {
    if (!isSlugReady) return listTitleFallback;

    const mt = safeStr((page as any)?.meta_title);
    if (mt) return mt;

    const t = safeStr((page as any)?.title);
    if (t) return t;

    return detailTitleFallback || listTitleFallback;
  }, [isSlugReady, page, detailTitleFallback, listTitleFallback]);

  const pageDescription = useMemo(() => {
    if (!isSlugReady) return '';

    const md = safeStr((page as any)?.meta_description);
    if (md) return md;

    const sum = safeStr((page as any)?.summary);
    if (sum) {
      const ex = excerpt(sum, 160).trim();
      if (ex) return ex;
    }

    const ex2 = excerpt(safeStr((page as any)?.content_html), 160).trim();
    if (ex2) return ex2;

    // Optional UI fallback (new key preferred; old supported if you used it before)
    const keyNew = 'ui_team_detail_meta_description_fallback';
    const keyOld = 'ui_team_detail_meta_description';

    const vNew = safeStr(
      ui(keyNew, 'Learn more about our team member and contact us for further information.'),
    );
    if (isValidUiText(vNew, keyNew)) return vNew;

    const vOld = safeStr(
      ui(keyOld, 'Learn more about our team member and contact us for further information.'),
    );
    if (isValidUiText(vOld, keyOld)) return vOld;

    return '';
  }, [isSlugReady, page, ui]);

  const ogImageOverride = useMemo(() => {
    if (!isSlugReady) return undefined;

    const raw =
      safeStr((page as any)?.featured_image) ||
      safeStr((page as any)?.image_url) ||
      safeStr((page as any)?.featured_image_url) ||
      '';

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

      {showSkeleton ? <Skeleton /> : <TeamDetail slug={slug} />}

      <ServiceCtaTwo />
    </>
  );
};

export default TeamDetailPage;
