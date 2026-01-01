// =============================================================
// FILE: src/pages/library/index.tsx
// Ensotek – Library Page [FINAL / STANDARD]
// - Route: /library
// - ✅ NO <Head>
// - ✅ Page SEO overrides via <LayoutSeoBridge />
// - ✅ General meta/canonical/hreflang/etc. stays in Layout/_document (no duplication)
// - SEO priority (page):
//   title: ui_library_meta_title -> ui_library_page_title -> fallback
//   desc : ui_library_meta_description -> (optional UI desc) -> fallback (Layout defaults)
//   og   : ui_library_og_image (optional) -> undefined (Layout decides)
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/layout/banner/Breadcrum';
import LibrarySection from '@/components/containers/library/Library';
import WetBulbCalculator from '@/components/containers/library/WetBulbCalculator';

// ✅ Page -> Layout SEO overrides (STANDARD)
import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

// i18n + UI
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// helpers
import { toCdnSrc } from '@/shared/media';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

const LibraryPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_library', locale as any);

  // -----------------------------
  // Banner title (UI)
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_library_page_title';
    const v = safeStr(ui(key, 'Library'));
    return isValidUiText(v, key) ? v : 'Library';
  }, [ui]);

  // -----------------------------
  // SEO Overrides (ONLY what you need)
  // - If empty, let Layout defaults handle it.
  // -----------------------------
  const pageTitle = useMemo(() => {
    const key = 'ui_library_meta_title';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;
    return bannerTitle || 'Library';
  }, [ui, bannerTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_library_meta_description';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;

    // optional extra fallback (if you have it)
    const key2 = 'ui_library_page_description';
    const d = safeStr(ui(key2, ''));
    if (isValidUiText(d, key2)) return d;

    // return empty => Layout default description kicks in
    return '';
  }, [ui]);

  const ogImageOverride = useMemo(() => {
    const key = 'ui_library_og_image';
    const raw = safeStr(ui(key, ''));
    if (!raw) return undefined;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || raw;
  }, [ui]);

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

      <Banner title={bannerTitle} />
      <LibrarySection />
      <WetBulbCalculator />
    </>
  );
};

export default LibraryPage;
