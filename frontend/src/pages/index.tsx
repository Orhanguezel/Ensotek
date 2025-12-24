// src/pages/index.tsx
import type { NextPage } from 'next';
import React, { useMemo } from 'react';

import Hero from '@/components/layout/banner/Hero';
import About from '@/components/containers/about/About';
import Product from '@/components/containers/product/Product';
import Service from '@/components/containers/service/Service';
import Newsletter from '@/components/containers/newsletter/Newsletter';
import LibrarySection from '@/components/containers/library/LibrarySection';
import Feedback from '@/components/containers/feedback/Feedback';
import References from '@/components/containers/references/References';
import News from '@/components/containers/news/News';
import Contact from '@/components/containers/contact/Contact';

// i18n + UI
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

// data
import { useGetSiteSettingByKeyQuery } from '@/integrations/rtk/hooks';

const toLocaleShort = (l: any) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

const Home: NextPage = () => {
  const resolved = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolved), [resolved]);

  // İsteğe bağlı: UI override (ui_home)
  const { ui } = useUiSection('ui_home', locale);

  // DB: site_title (senin seed’de var)
  const { data: siteTitleSetting } = useGetSiteSettingByKeyQuery({
    key: 'site_title',
    locale,
  });

  const siteTitle = useMemo(() => {
    const t = String(siteTitleSetting?.value ?? '').trim();
    return t || 'Ensotek';
  }, [siteTitleSetting?.value]);

  // ✅ SEO-friendly H1 (tek kaynak)
  const h1 = useMemo(() => {
    // Önce ui_home override, yoksa default
    const fallback =
      locale === 'tr'
        ? 'Ensotek Su Soğutma Kuleleri ve Proses Soğutma Çözümleri'
        : locale === 'de'
        ? 'Ensotek Kühltürme und Prozesskühlung'
        : 'Ensotek Cooling Towers and Process Cooling Solutions';

    const candidate = String(ui('ui_home_h1', '') || '').trim();
    if (candidate) return candidate;

    // fallback içinde marka geçmiyorsa başa ekle
    if (!fallback.toLowerCase().includes(siteTitle.toLowerCase())) {
      return `${siteTitle} – ${fallback}`;
    }
    return fallback;
  }, [ui, locale, siteTitle]);

  return (
    <>
      {/* ✅ H1: tasarım bozulmasın diye sr-only */}
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

      {/* sr-only utility */}
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
