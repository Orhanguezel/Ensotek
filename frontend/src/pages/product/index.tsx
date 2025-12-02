// =============================================================
// FILE: src/pages/product/index.tsx
// Ensotek – Products Page (full list)
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import ProductPageContent from "@/components/containers/product/ProductPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const ProductPage: React.FC = () => {
  const locale = useResolvedLocale();

  const { ui } = useUiSection("ui_products", locale);

  const title = ui(
    "ui_products_page_title",
    locale === "tr" ? "Ürünlerimiz" : "Products",
  );

  return (
    <>
      <Banner title={title} />
      <ProductPageContent />
      <Feedback />
    </>
  );
};

export default ProductPage;
