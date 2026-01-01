// =============================================================
// FILE: src/pages/offer.tsx
// Ensotek – Offer Page (Public) + SEO (STANDARD / HOOK-SAFE) [FINAL]
//   - Route: /offer
//   - i18n: useLocaleShort() + site_settings.ui_offer
//   - SEO: NO <Head>. Only <LayoutSeoBridge />
//   - Map: site_settings.contact_map (config JSON)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/components/layout/banner/Breadcrum';
import OfferPageContainer from '@/components/containers/offer/OfferPage';
import ContactMap from '@/components/containers/contact/ContactMap';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import { asObj } from '@/seo/pageSeo';

import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

const OfferPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_offer', locale as any);

  // -----------------------------
  // Banner title (UI)
  // -----------------------------
  const bannerTitle = useMemo(() => {
    const key = 'ui_offer_page_title';
    const v = safeStr(ui(key, 'Request an Offer'));
    return isValidUiText(v, key) ? v : 'Request an Offer';
  }, [ui]);

  // -----------------------------
  // Map config (site_settings.contact_map)
  // -----------------------------
  const { data: mapSetting } = useGetSiteSettingByKeyQuery({ key: 'contact_map', locale } as any);

  const mapConfig = useMemo(() => {
    const raw = (mapSetting as any)?.value ?? mapSetting ?? null;
    return asObj(raw) ?? {};
  }, [mapSetting]);

  // -----------------------------
  // SEO (UI overrides -> Layout default)
  // -----------------------------
  const pageTitle = useMemo(() => {
    const key = 'ui_offer_meta_title';
    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    return bannerTitle || 'Request an Offer';
  }, [ui, bannerTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_offer_meta_description';
    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromPage = safeStr(ui('ui_offer_page_description', ''));
    if (fromPage && isValidUiText(fromPage, 'ui_offer_page_description')) return fromPage;

    return ''; // empty => Layout default
  }, [ui]);

  const ogImageOverride = useMemo(() => {
    const raw = safeStr(ui('ui_offer_og_image', ''));
    if (!raw) return undefined;
    return raw; // absolute url preferred; LayoutSeoBridge should handle normalization if needed
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
      <OfferPageContainer />
      <ContactMap config={mapConfig} locale={safeStr(locale) || 'de'} />
    </>
  );
};

export default OfferPage;
