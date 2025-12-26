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

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// SEO helpers
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const toLocaleShort = (l: any) =>
  String(l || 'de')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'de';

const ContactPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_contact', locale);

  // ======================
  // UI / Banner title
  // ======================
  const bannerTitle = useMemo(() => {
    const p = String(ui('ui_contact_subprefix', '') || '').trim();
    const l = String(ui('ui_contact_sublabel', '') || '').trim();
    const t = `${p} ${l}`.trim();
    if (t) return t;
    return locale === 'de' ? 'İletişim' : locale === 'de' ? 'Kontakt' : 'Contact';
  }, [ui, locale]);

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
    // ui_contact üzerinden meta override
    const t = String(ui('ui_contact_meta_title', '') || '').trim();
    return t || bannerTitle;
  }, [ui, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const uiDesc = String(ui('ui_contact_meta_description', '') || '').trim();
    return uiDesc || String(seo?.description ?? '').trim() || '';
  }, [ui, seo]);

  const seoSiteName = useMemo(() => String(seo?.site_name ?? '').trim() || 'Ensotek', [seo]);
  const titleTemplate = useMemo(
    () => String(seo?.title_template ?? '').trim() || '%s | Ensotek',
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
    return fallback || absUrl('/favicon.ico');
  }, [seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj(seo?.twitter) || {};
    const robots = asObj(seo?.robots) || {};
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
