// =============================================================
// FILE: src/pages/sparepart/[slug].tsx
// Ensotek – Sparepart Detail Page (by slug, products modülü reuse)
//   - Data: products
//   - Locale-aware via useResolvedLocale
//   - UI i18n: site_settings.ui_spareparts (sadece sayfa başlığı için)
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import ProductDetail from "@/components/containers/product/ProductDetail";
import ProductMore from "@/components/containers/product/ProductMore";
import Feedback from "@/components/containers/feedback/Feedback";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const SparepartDetailPage: React.FC = () => {
  const locale = useResolvedLocale();

  const { ui } = useUiSection("ui_spareparts", locale);

  const title = ui(
    "ui_spareparts_detail_page_title",
    locale === "tr" ? "Yedek Parça Detayı" : "Spare Part",
  );

  return (
    <>
      <Banner title={title} />
      {/* Ürün detayı, specs, FAQ, reviews: products container’ları */}
      <ProductDetail />
      <ProductMore />
      <Feedback />
    </>
  );
};

export default SparepartDetailPage;
