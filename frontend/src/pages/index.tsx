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

const isValidUiText = (value: string, key: string) => {
  const v = String(value ?? '').trim();
  if (!v) return false;

  // Missing durumda bazı çeviri/DB helper’ları key’i aynen döndürür
  if (v === key) return false;

  // Bazı sistemlerde "[key]" / "{{key}}" gibi placeholder dönebilir
  const normalized = v.replace(/\s+/g, '');
  if (normalized === `[${key}]`) return false;
  if (normalized === `{{${key}}}`) return false;

  return true;
};

const Home: NextPage = () => {
  const resolved = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolved), [resolved]);

  // UI override (ui_home)
  const { ui } = useUiSection('ui_home', locale);

  // DB: site_title
  const { data: siteTitleSetting } = useGetSiteSettingByKeyQuery({
    key: 'site_title',
    locale,
  });

  const siteTitle = useMemo(() => {
    const t = String(siteTitleSetting?.value ?? '').trim();
    return t || 'Ensotek';
  }, [siteTitleSetting?.value]);

  const h1 = useMemo(() => {
    const fallback =
      locale === 'tr'
        ? 'Ensotek Su Soğutma Kuleleri ve Proses Soğutma Çözümleri'
        : locale === 'de'
        ? 'Ensotek Kühltürme und Prozesskühlung'
        : 'Ensotek Cooling Towers and Process Cooling Solutions';

    const key = 'ui_home_h1';
    const raw = String(ui(key, '') ?? '');
    const candidate = raw.trim();

    // ✅ 1) UI’dan gelen değer gerçekten geçerliyse onu kullan
    if (isValidUiText(candidate, key)) return candidate;

    // ✅ 2) Fallback içinde marka yoksa başa ekle (duplicate’ı engelle)
    const st = String(siteTitle || '').trim() || 'Ensotek';
    const fb = String(fallback || '').trim() || 'Ensotek';

    const stLower = st.toLowerCase();
    const fbLower = fb.toLowerCase();

    if (!fbLower.includes(stLower)) return `${st} – ${fb}`;
    return fb;
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
