// =============================================================
// FILE: src/pages/index.tsx
// Ensotek – Home Page (SEO H1 dynamic)
// - Locale: useResolvedLocale() single source of truth
// - H1: site_settings.ui_home.ui_home_h1 -> fallback (brand-safe)
// =============================================================

import type { NextPage } from 'next';
import React, { useMemo } from 'react';

import Hero from '@/components/layout/banner/Hero';
import About from '@/components/containers/about/AboutSection';
import Product from '@/components/containers/product/Product';
import Service from '@/components/containers/service/Service';
import Newsletter from '@/components/containers/newsletter/Newsletter';
import LibrarySection from '@/components/containers/library/LibrarySection';
import Feedback from '@/components/containers/feedback/Feedback';
import References from '@/components/containers/references/References';
import News from '@/components/containers/news/News';
import Contact from '@/components/containers/contact/Contact';

import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { normLocaleTag } from '@/i18n/localeUtils';
import { isValidUiText } from '@/i18n/uiText';

import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const Home: NextPage = () => {
  const resolved = useResolvedLocale();
  const locale = useMemo(() => normLocaleTag(resolved) || 'de', [resolved]);

  const { ui } = useUiSection('ui_home', locale);

  const { data: siteTitleSetting } = useGetSiteSettingByKeyQuery({
    key: 'site_title',
    locale,
  });

  const siteTitle = useMemo(() => {
    const t = String(siteTitleSetting?.value ?? '').trim();
    return t || 'Ensotek';
  }, [siteTitleSetting?.value]);

  const h1 = useMemo(() => {
    const key = 'ui_home_h1';

    const v = ui(key, '');
    if (isValidUiText(v, key)) return v;

    // locale bazlı if-else yok (30 dil için stabil)
    const st = String(siteTitle || '').trim() || 'Ensotek';
    const generic = 'Cooling Towers and Process Cooling Solutions';

    const stLower = st.toLowerCase();
    const genericLower = generic.toLowerCase();

    return genericLower.includes(stLower) ? generic : `${st} – ${generic}`;
  }, [ui, siteTitle]);

  return (
    <>
      <h1 className="sr-only">{h1}</h1>

      <Hero />
      <Service />
      <About />
      <Product />
      <Newsletter />
      <LibrarySection />
      <Feedback />
      <References />
      <News />
      <Contact />

      <style jsx global>{`
        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
      `}</style>
    </>
  );
};

export default Home;
