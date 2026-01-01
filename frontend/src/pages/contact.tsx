// =============================================================
// FILE: src/pages/contact.tsx
// Ensotek – Contact Page (Public) + SEO (PUBLIC PAGES ROUTER STANDARD)
//   - Route: /contact
//   - NO <Head>
//   - SEO override: <LayoutSeoBridge />
//   - Canonical/og:url/hreflang: _document (SSR) + Layout
//   - UI overrides: ui_contact_* (validated)
//   - Map: site_settings.contact_map (dynamic)
// =============================================================

'use client';

import React, { useMemo } from 'react';

import Banner from '@/layout/banner/Breadcrum';
import Contact from '@/components/containers/contact/Contact';
import ContactMap from '@/components/containers/contact/ContactMap';

import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

import { toCdnSrc } from '@/shared/media';

import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const safeStr = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());

const ContactPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_contact', locale as any);

  // ======================
  // UI / Banner title (validated)
  // ======================
  const bannerTitle = useMemo(() => {
    // Prefer:
    // 1) ui_contact_page_title
    // 2) ui_contact_subprefix + ui_contact_sublabel
    // 3) fallback
    const keyPage = 'ui_contact_page_title';
    const fromPage = safeStr(ui(keyPage, ''));
    if (isValidUiText(fromPage, keyPage)) return fromPage;

    const p = safeStr(ui('ui_contact_subprefix', ''));
    const l = safeStr(ui('ui_contact_sublabel', ''));
    const t = `${p} ${l}`.trim();
    if (t) return t;

    return 'Contact';
  }, [ui]);

  // ======================
  // Map config (DB)
  // ======================
  const { data: mapSetting } = useGetSiteSettingByKeyQuery({ key: 'contact_map', locale });

  const mapConfig = useMemo(() => {
    const raw = (mapSetting?.value ?? {}) as any;
    // keep it permissive; ContactMap should handle missing fields
    return raw && typeof raw === 'object' ? raw : {};
  }, [mapSetting?.value]);

  // ======================
  // SEO override (UI-only; Layout handles global defaults)
  // ======================
  const pageTitle = useMemo(() => {
    const key = 'ui_contact_meta_title';
    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    return bannerTitle || 'Contact';
  }, [ui, bannerTitle]);

  const pageDescription = useMemo(() => {
    const key = 'ui_contact_meta_description';
    const fromUi = safeStr(ui(key, ''));
    if (isValidUiText(fromUi, key)) return fromUi;

    return ''; // empty => Layout default
  }, [ui]);

  const ogImageOverride = useMemo(() => {
    const key = 'ui_contact_og_image';
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
      <Contact />
      <ContactMap config={mapConfig as any} locale={locale} />
    </>
  );
};

export default ContactPage;
