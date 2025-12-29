// =============================================================
// FILE: src/pages/offer.tsx
// Ensotek – Offer Page (Public) + SEO (HOOK-SAFE) [FINAL]
//   - Route: /offer
//   - i18n: useLocaleShort() + site_settings.ui_offer
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
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

// SEO
import { buildMeta } from '@/seo/meta';
import { asObj, absUrl, pickFirstImageFromSeo } from '@/seo/pageSeo';

// data
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

function safeStr(x: unknown): string {
  return typeof x === 'string' ? x.trim() : '';
}

const OfferPage: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_offer', locale as any);

  const t = useMemo(
    () => (key: string, fallback: string) => safeStr(ui(key, fallback)) || fallback,
    [ui],
  );

  // Banner/UI title
  const bannerTitle = useMemo(() => t('ui_offer_page_title', 'Request an Offer'), [t]);

  // ======================
  // Map config (site_settings.contact_map)
  // ======================
  const { data: mapSetting } = useGetSiteSettingByKeyQuery({ key: 'contact_map', locale } as any);

  const mapConfig = useMemo(() => {
    const raw = (mapSetting as any)?.value ?? mapSetting ?? null;
    return asObj(raw) ?? {};
  }, [mapSetting]);

  // ======================
  // Global SEO settings (seo -> site_seo fallback)
  // ======================
  const { data: seoPrimary } = useGetSiteSettingByKeyQuery({ key: 'seo', locale } as any);
  const { data: seoFallback } = useGetSiteSettingByKeyQuery({ key: 'site_seo', locale } as any);

  const seo = useMemo(() => {
    const raw =
      (seoPrimary as any)?.value ?? (seoFallback as any)?.value ?? seoPrimary ?? seoFallback;
    return asObj(raw) ?? {};
  }, [seoPrimary, seoFallback]);

  // ======================
  // SEO fields (page-level)
  // ======================
  const pageTitleRaw = useMemo(() => {
    const uiTitle = t('ui_offer_meta_title', '');
    return uiTitle || bannerTitle || 'Request an Offer';
  }, [t, bannerTitle]);

  const pageDescRaw = useMemo(() => {
    const uiDesc = t('ui_offer_meta_description', '');
    const seoDesc = safeStr((seo as any)?.description);
    return uiDesc || seoDesc || '';
  }, [t, seo]);

  const seoSiteName = useMemo(() => safeStr((seo as any)?.site_name) || 'Ensotek', [seo]);
  const titleTemplate = useMemo(
    () => safeStr((seo as any)?.title_template) || '%s | Ensotek',
    [seo],
  );

  const pageTitle = useMemo(() => {
    const composed = titleTemplate.includes('%s')
      ? titleTemplate.replace('%s', pageTitleRaw)
      : pageTitleRaw;
    return safeStr(composed);
  }, [titleTemplate, pageTitleRaw]);

  const ogImage = useMemo(() => {
    const fallbackSeoImg = pickFirstImageFromSeo(seo);
    const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : '';
    return fallback || absUrl('/favicon.svg');
  }, [seo]);

  const headSpecs = useMemo(() => {
    const tw = asObj((seo as any)?.twitter) || {};
    const robots = asObj((seo as any)?.robots) || {};
    const noindex = typeof (robots as any).noindex === 'boolean' ? (robots as any).noindex : false;

    // ✅ canonical + og:url YOK (tek kaynak: _document SSR)
    return buildMeta({
      title: pageTitle,
      description: pageDescRaw,
      image: ogImage || undefined,
      siteName: seoSiteName,
      noindex,

      twitterCard: safeStr((tw as any).card) || 'summary_large_image',
      twitterSite: safeStr((tw as any).site) || undefined,
      twitterCreator: safeStr((tw as any).creator) || undefined,
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
      <OfferPageContainer />
      <ContactMap config={mapConfig} locale={String(locale || '')} />
    </>
  );
};

export default OfferPage;
