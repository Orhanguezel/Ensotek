// =============================================================
// FILE: src/pages/product/[slug].tsx
// Ensotek – Product Detail Page (by slug)
//   - Data: products
//   - Locale-aware via useResolvedLocale
//   - UI i18n: site_settings.ui_products
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import ProductDetail from "@/components/containers/product/ProductDetail";
import ProductMore from "@/components/containers/product/ProductMore";
import Feedback from "@/components/containers/feedback/Feedback";
import ServiceCta from "@/components/containers/cta/ServiceCta";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const ProductDetailPage: React.FC = () => {
  const locale = useResolvedLocale();

  const { ui } = useUiSection("ui_products", locale);

  const title = ui(
    "ui_products_detail_page_title",
    locale === "tr" ? "Ürün Detayı" : "Product",
  );

  return (
    <>
      <Banner title={title} />
      <ProductDetail />
      <ProductMore />
      <Feedback />
      <ServiceCta />
    </>
  );
};

export default ProductDetailPage;
