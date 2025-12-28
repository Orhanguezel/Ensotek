// =============================================================
// FILE: src/pages/contact.tsx
// Ensotek – Contact Page (Public) + SEO (HOOK-SAFE)
//   - Route: /contact
//   - SEO: site_settings seo|site_seo fallback + ui_contact overrides
//   - Map: site_settings.contact_map (dynamic)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import Contact from '@/components/containers/contact/Contact';
import ContactMap from '@/components/containers/contact/ContactMap';

// i18n + UI
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';
import { isValidUiText } from '@/i18n/uiText';

// SEO helpers
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const ContactPage: React.FC = () => {
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_contact', locale as any);

  // ======================
  // UI / Banner title
  // ======================
  const bannerTitle = useMemo(() => {
    // Tercih sırası:
    // 1) ui_contact_page_title (tek alan, en temiz)
    // 2) ui_contact_subprefix + ui_contact_sublabel (senin mevcut tasarımın)
    // 3) fallback
    const keyPage = 'ui_contact_page_title';
    const fromPage = String(ui(keyPage, '') || '').trim();
    if (isValidUiText(fromPage, keyPage)) return fromPage;

    const p = String(ui('ui_contact_subprefix', '') || '').trim();
    const l = String(ui('ui_contact_sublabel', '') || '').trim();
    const t = `${p} ${l}`.trim();
    if (t) return t;

    return 'Contact';
  }, [ui]);

  // ======================
  // Global SEO settings
  // ======================
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale });
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale });

  const seo = useMemo(() => {
    const raw = (seoPrimary?.value ?? seoFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoPrimary?.value, seoFallback?.value]);

  // ======================
  // Map config (DB)
  // ======================
  const { data: mapSetting } = useGetSiteSettingByKeyQuery({
    key: 'contact_map',
    locale,
  });

  const mapConfig = useMemo(() => {
    const raw = (mapSetting?.value ?? {}) as any;
    return asObj(raw) ?? {};
  }, [mapSetting?.value]);

  // ======================
  // SEO fields (page-level)
  // ======================
  const pageTitleRaw = useMemo(() => {
    const key = 'ui_contact_meta_title';

    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    return bannerTitle;
  }, [ui, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const key = 'ui_contact_meta_description';

    const fromUi = String(ui(key, '') || '').trim();
    if (isValidUiText(fromUi, key)) return fromUi;

    const fromSeo = String((seo as any)?.description ?? '').trim();
    if (fromSeo) return fromSeo;

    return '';
  }, [ui, seo]);

  const seoSiteName = useMemo(
    () => String((seo as any)?.site_name ?? '').trim() || 'Ensotek',
    [seo],
  );

  const titleTemplate = useMemo(
    () => String((seo as any)?.title_template ?? '').trim() || '%s | Ensotek',
    [seo],
  );

  const pageTitle = useMemo(() => {
    const t = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return String(t).trim();
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';
    return fallback || absUrl('/favicon.svg');
  }, [seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
    const noindex = typeof robots.noindex === 'boolean' ? robots.noindex : false;

    // ✅ canonical + og:url YOK (tek kaynak: _document SSR)
    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,
      twitterCard: String(tw.card ?? '').trim() || 'summary_large_image',
      twitterSite: typeof tw.site === 'string' ? tw.site.trim() : undefined,
      twitterCreator: typeof tw.creator === 'string' ? tw.creator.trim() : undefined,
    });
  }, [seo, pageTitle, pageDescRaw, ogImage, seoSiteName]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        {headSpecs.map((spec, idx) => {
          if (spec.kind === 'link') {
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          }
          if (spec.kind === 'meta-name') {
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          }
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}
      </Head>

      <Banner title={bannerTitle} />
      <Contact />
      <ContactMap config={mapConfig} locale={locale} />
    </>
  );
};

export default ContactPage;
