// =============================================================
// FILE: src/pages/mission-vision.tsx
// Ensotek – Mission & Vision Page (PUBLIC PAGES ROUTER STANDARD)
//   - Route: /mission-vision
//   - NO <Head>
//   - SEO override only via <LayoutSeoBridge />
//   - Canonical/og:url/hreflang: _document (SSR) + Layout
//   - Data: custom_pages (module_key="mission" + "vision") -> first published (meta source)
//   - Meta priority: UI -> custom_page -> Layout default
//   - UI strings: ui_mission_vision
//   - Loading: shared <Skeleton />
//   - Inline style: NONE
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/layout/banner/Breadcrum';
import MissionVisionPageContent from '@/components/containers/about/MissionVisionPageContent';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import Skeleton from '@/components/common/public/Skeleton';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

function pickFirstPublished(items: unknown): CustomPageDto | null {
  const arr: CustomPageDto[] = Array.isArray(items) ? (items as any) : [];
  const published = arr.filter((p) => !!(p as any)?.is_published);
  return published[0] ?? null;
}

const MissionVisionPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_mission_vision', locale as any);

  // -----------------------------
  // Custom pages (meta override)
  // - Prefer vision meta, fallback to mission
  // -----------------------------
  const visionQ = useListCustomPagesPublicQuery(
    {
      module_key: 'vision',
      locale,
      limit: 10,
      offset: 0,
      sort: 'created_at',
      orderDir: 'asc',
      is_published: 1,
    } as any,
    { refetchOnMountOrArgChange: true } as any,
  );

  const missionQ = useListCustomPagesPublicQuery(
    {
      module_key: 'mission',
      locale,
      limit: 10,
      offset: 0,
      sort: 'created_at',
      orderDir: 'asc',
      is_published: 1,
    } as any,
    { refetchOnMountOrArgChange: true } as any,
  );

  const visionPrimary = useMemo(
    () => pickFirstPublished((visionQ.data as any)?.items),
    [visionQ.data],
  );

  const missionPrimary = useMemo(
    () => pickFirstPublished((missionQ.data as any)?.items),
    [missionQ.data],
  );

  const primary = visionPrimary || missionPrimary;

  // -----------------------------
  // UI (Banner Title)
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_mission_vision_page_title';
    const v = safeStr(ui(key, 'Misyonumuz - Vizyonumuz'));
    return isValidUiText(v, key) ? v : 'Misyonumuz - Vizyonumuz';
  }, [ui]);

  // -----------------------------
  // SEO: title/description sources (UI -> custom_page -> Layout default)
  // -----------------------------
  const pageTitle = useMemo(() => {
    const key = 'ui_mission_vision_meta_title';

    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = safeStr((primary as any)?.meta_title);
    if (fromPageMeta) return fromPageMeta;

    const fromPageTitle = safeStr((primary as any)?.title);
    if (fromPageTitle) return fromPageTitle;

    return bannerTitle || 'Misyonumuz - Vizyonumuz';
  }, [ui, primary, bannerTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_mission_vision_meta_description';

    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPageMeta = safeStr((primary as any)?.meta_description);
    if (fromPageMeta) return fromPageMeta;

    const fromSummary = safeStr((primary as any)?.summary);
    if (fromSummary) return fromSummary;

    const html = safeStr((primary as any)?.content_html);
    const ex = html ? excerpt(html, 160).trim() : '';
    if (ex) return ex;

    const fromUiLead = safeStr(ui('ui_mission_vision_page_lead', ''));
    if (fromUiLead && isValidUiText(fromUiLead, 'ui_mission_vision_page_lead')) return fromUiLead;

    return ''; // empty => Layout default
  }, [ui, primary]);

  const ogImageOverride = useMemo(() => {
    const raw =
      safeStr((primary as any)?.featured_image) ||
      safeStr((primary as any)?.image_url) ||
      safeStr(ui('ui_mission_vision_og_image', ''));

    if (!raw) return undefined;
    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [primary, ui]);

  const showSkeleton =
    (!!(visionQ as any)?.isFetching && !visionPrimary) ||
    (!!(missionQ as any)?.isFetching && !missionPrimary);

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />

      {showSkeleton ? <Skeleton /> : <MissionVisionPageContent />}
    </>
  );
};

export default MissionVisionPage;
