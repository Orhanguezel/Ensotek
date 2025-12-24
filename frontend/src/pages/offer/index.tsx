// =============================================================
// FILE: src/pages/offer/index.tsx
// Ensotek – Offer Page (Public) + SEO (HOOK-SAFE)
//   - Route: /offer
//   - SEO: site_settings seo|site_seo fallback + ui_offer overrides
//   - Map: site_settings.contact_map (config JSON)
//   - ✅ Canonical + og:url tek kaynak: _document (SSR)
// =============================================================

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';

import Banner from '@/components/layout/banner/Breadcrum';
import OfferPageContainer from '@/components/containers/offer/OfferPage';
import ContactMap from '@/components/containers/contact/ContactMap';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const toLocaleShort = (l: any) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

const OfferPage: React.FC = () => {
  const resolvedLocale = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolvedLocale), [resolvedLocale]);

  const { ui } = useUiSection('ui_offer', locale);

  // Banner/UI title
  const bannerTitle = useMemo(
    () => ui('ui_offer_page_title', locale === 'tr' ? 'Teklif Talep Formu' : 'Request an Offer'),
    [ui, locale],
  );

  // ======================
  // Map config (site_settings.contact_map)
  // ======================
  const { data: mapSetting } = useGetSiteSettingByKeyQuery({
    key: 'contact_map',
    locale,
  });

  const mapConfig = useMemo(() => {
    // Beklenen örnek:
    // { provider:'google'|'osm', query:'Musterstr. 10, 10115 Berlin', lat:52.52, lng:13.405,
    //   zoom:14, embedUrl:'...', height:420, title:'Ensotek Office' }
    const raw = (mapSetting?.value ?? null) as any;
    const cfg = asObj(raw) ?? {};

    // minimum güvenli fallback (config yoksa ContactMap kendi fallback’ını kullanabilir)
    return cfg;
  }, [mapSetting?.value]);

  // ======================
  // Global SEO settings (seo -> site_seo fallback)
  // ======================
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({
    key: 'seo',
    locale,
  });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({
    key: 'site_seo',
    locale,
  });

  const seo = useMemo(() => {
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return asObj(raw) ?? {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // ======================
  // SEO fields (page-level)
  // ======================
  const pageTitleRaw = useMemo(() => {
    // ui_offer_meta_title / ui_offer_meta_description opsiyonel
    return String(ui('ui_offer_meta_title', String(bannerTitle))).trim();
  }, [ui, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const descFromUi = String(ui('ui_offer_meta_description', '')).trim();
    return descFromUi || String(seo?.description ?? '').trim() || '';
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
      <OfferPageContainer locale={locale} />
      <ContactMap config={mapConfig} locale={locale} />
    </>
  );
};

export default OfferPage;
