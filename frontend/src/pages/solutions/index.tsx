// =============================================================
// FILE: src/pages/solutions/index.tsx
// Ensotek – Solutions Index Page + SEO (PUBLIC PAGES ROUTER STANDARD)
//   - Route: /solutions
//   - NO <Head>
//   - SEO override: <LayoutSeoBridge />
//   - Primary meta source (optional): first published custom_page (module_key="solutions")
//   - Fallback order: UI meta -> DB primary -> Layout defaults
//   - Content: <SolutionsPage />
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/layout/banner/Breadcrum';
import SolutionsPage from '@/components/containers/solutions/SolutionsPage';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

const SolutionsIndexPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_solutions', locale as any);

  // -----------------------------
  // Banner Title (UI)
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_solutions_page_title';
    const v = safeStr(ui(key, 'Solutions'));
    return isValidUiText(v, key) ? v : 'Solutions';
  }, [ui]);

  // -----------------------------
  // DB primary (optional): first published custom_page
  // -----------------------------
  const { data: solutionsData } = useListCustomPagesPublicQuery(
    {
      module_key: 'solutions',
      locale,
      limit: 20,
      offset: 0,
      sort: 'created_at',
      orderDir: 'asc',
      is_published: 1,
    } as any,
    { skip: !locale },
  );

  const primary = useMemo<CustomPageDto | null>(() => {
    const items: CustomPageDto[] = ((solutionsData as any)?.items ?? []) as any;
    const published = items.filter((p) => !!p?.is_published);
    return published[0] ?? null;
  }, [solutionsData]);

  // -----------------------------
  // SEO override (UI first, then DB, then fallback)
  // -----------------------------
  const pageTitle = useMemo(() => {
    const key = 'ui_solutions_meta_title';
    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    const mt = safeStr(primary?.meta_title);
    if (mt) return mt;

    const t = safeStr(primary?.title);
    if (t) return t;

    return bannerTitle || 'Solutions';
  }, [ui, primary?.meta_title, primary?.title, bannerTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_solutions_meta_description';
    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    const md = safeStr(primary?.meta_description);
    if (md) return md;

    const sum = safeStr(primary?.summary);
    if (sum) {
      const ex = excerpt(sum, 160).trim();
      if (ex) return ex;
    }

    const ex2 = excerpt(safeStr((primary as any)?.content_html), 160).trim();
    if (ex2) return ex2;

    return ''; // empty => Layout default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui, primary?.meta_description, primary?.summary, (primary as any)?.content_html]);

  const ogImageOverride = useMemo(() => {
    const key = 'ui_solutions_og_image';
    const fromUi = safeStr(ui(key, ''));
    if (fromUi) {
      if (/^https?:\/\//i.test(fromUi)) return fromUi;
      return toCdnSrc(fromUi, 1200, 630, 'fill') || fromUi;
    }

    const raw = safeStr(primary?.featured_image) || safeStr((primary as any)?.image_url);
    if (!raw) return undefined;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui, primary?.featured_image, (primary as any)?.image_url]);

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />
      <SolutionsPage />
    </>
  );
};

export default SolutionsIndexPage;
