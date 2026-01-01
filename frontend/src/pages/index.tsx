// =============================================================
// FILE: src/pages/index.tsx
// Ensotek – Home Page (PUBLIC PAGES ROUTER STANDARD)
// - NO <Head>
// - SEO override only via <LayoutSeoBridge />
// - NO inline styles / NO styled-jsx
// - Locale: useLocaleShort() (Pages Router standard)
// - H1: site_settings.ui_home.ui_home_h1 -> fallback (brand-safe)
// - Optional SEO keys (UI):
//   - ui_home_meta_title
//   - ui_home_meta_description
//   - ui_home_og_image
//
// NOTE:
// - "sr-only" class MUST exist in global stylesheet (template/global scss).
//   (Previously it was defined via styled-jsx; that is removed by standard.)
// =============================================================

'use client';

import type { NextPage } from 'next';
import React, { useMemo } from 'react';

import Hero from '@/components/layout/banner/Hero';
import AboutCounter from '@/components/containers/about/AboutCounter';
import About from '@/components/containers/about/AboutSection';
import Product from '@/components/containers/product/Product';
import ServiceSection from '@/components/containers/service/ServiceSection';
import Newsletter from '@/components/containers/newsletter/Newsletter';
import LibrarySection from '@/components/containers/library/LibrarySection';
import Feedback from '@/components/containers/feedback/Feedback';
import References from '@/components/containers/references/References';
import NewsSection from '@/components/containers/news/NewsSection';
import Contact from '@/components/containers/contact/Contact';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import { toCdnSrc } from '@/shared/media';

import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

const Home: NextPage = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_home', locale as any);

  const { data: siteTitleSetting } = useGetSiteSettingByKeyQuery({
    key: 'site_title',
    locale,
  });

  const siteTitle = useMemo(() => {
    const t = safeStr(siteTitleSetting?.value);
    return t || 'Ensotek';
  }, [siteTitleSetting?.value]);

  // ----------------------------------------
  // H1 (SEO) – dynamic, brand-safe
  // ----------------------------------------
  const h1 = useMemo(() => {
    const key = 'ui_home_h1';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;

    const st = safeStr(siteTitle) || 'Ensotek';
    const generic = 'Cooling Towers and Process Cooling Solutions';

    const stLower = st.toLowerCase();
    const genericLower = generic.toLowerCase();

    return genericLower.includes(stLower) ? generic : `${st} – ${generic}`;
  }, [ui, siteTitle]);

  // ----------------------------------------
  // SEO override (UI-only; Layout handles defaults)
  // ----------------------------------------
  const pageTitle = useMemo(() => {
    const key = 'ui_home_meta_title';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;

    // Home title default: use H1 (already brand-safe)
    return h1 || siteTitle || 'Ensotek';
  }, [ui, h1, siteTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_home_meta_description';
    const v = safeStr(ui(key, ''));
    if (isValidUiText(v, key)) return v;

    return ''; // empty => Layout default
  }, [ui]);

  const ogImageOverride = useMemo(() => {
    const key = 'ui_home_og_image';
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

      {/* SEO-only H1 */}
      <h1 className="sr-only">{h1}</h1>

      <Hero />
      <ServiceSection />
      <AboutCounter />
      <About />
      <Product />
      <Newsletter />
      <LibrarySection />
      <Feedback />
      <References />
      <NewsSection />
      <Contact />
    </>
  );
};

export default Home;
