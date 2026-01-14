// =============================================================
// FILE: src/pages/index.tsx
// Ensotek – Home Page (PUBLIC PAGES ROUTER STANDARD) — FINAL
// - Fix: ui() missing key may return the key itself => avoid bogus og:image (/ui_home_og_image)
// - OG source of truth: DB site_settings(key='site_og_default_image', locale='*') -> $.url (or plain url)
// - UI optional overrides still allowed, but guarded
// =============================================================

'use client';

import type { NextPage } from 'next';
import React, { useMemo } from 'react';

import Hero from '@/layout/banner/Hero';
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

function tryParseJson(input: unknown): any {
  if (typeof input !== 'string') return input;
  const s = input.trim();
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function pickOgUrlFromSettingValue(value: unknown): string | undefined {
  const raw = tryParseJson(value);
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const url = safeStr((raw as any).url);
    if (url && /^https?:\/\//i.test(url)) return url;
  }
  const plain = safeStr(value);
  if (plain && /^https?:\/\//i.test(plain)) return plain;
  return undefined;
}

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

  // ✅ DB global OG default (single source)
  const { data: ogDefaultSetting } = useGetSiteSettingByKeyQuery({
    key: 'site_og_default_image',
    locale: '*',
  });

  const ogDefaultUrl = useMemo(() => {
    return pickOgUrlFromSettingValue(ogDefaultSetting?.value);
  }, [ogDefaultSetting?.value]);

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
    // ✅ Guard: if ui() echoes key, treat as missing
    if (v && v !== key && isValidUiText(v, key)) return v;

    return h1 || siteTitle || 'Ensotek';
  }, [ui, h1, siteTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_home_meta_description';
    const v = safeStr(ui(key, ''));
    // ✅ Guard: if ui() echoes key, treat as missing
    if (v && v !== key && isValidUiText(v, key)) return v;

    return ''; // empty => Layout default
  }, [ui]);

  // ----------------------------------------
  // OG image override
  // Priority:
  // 1) ui_home_og_image (only if exists and NOT key-echo)
  // 2) DB global site_og_default_image
  // 3) undefined => Layout default fallback
  // ----------------------------------------
  const ogImageOverride = useMemo(() => {
    const key = 'ui_home_og_image';
    const raw = safeStr(ui(key, ''));

    // ✅ if missing-key echo (== key) or empty -> ignore
    if (!raw || raw === key) return ogDefaultUrl;

    if (/^https?:\/\//i.test(raw)) return raw;
    return toCdnSrc(raw, 1200, 630, 'fill') || ogDefaultUrl || raw;
  }, [ui, ogDefaultUrl]);

  return (
    <>
      <LayoutSeoBridge
        title={pageTitle}
        description={pageDescription || undefined}
        ogImage={ogImageOverride}
        noindex={false}
      />

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
