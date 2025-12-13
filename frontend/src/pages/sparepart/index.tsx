// =============================================================
// FILE: src/pages/sparepart/index.tsx
// Ensotek – Spareparts Page (full list, products modülü reuse)
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import ProductPageContent from "@/components/containers/product/ProductPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const SparepartPage: React.FC = () => {
  const locale = useResolvedLocale();

  // Sayfa başlığını yine ui_spareparts üzerinden alıyoruz
  const { ui } = useUiSection("ui_spareparts", locale);

  const title = ui(
    "ui_spareparts_page_title",
    locale === "tr" ? "Yedek Parçalar" : "Spare Parts",
  );

  return (
    <>
      <Banner title={title} />
      {/* Liste tarafında direkt ProductPageContent kullanıyoruz */}
      <ProductPageContent />
      <Feedback />
    </>
  );
};

export default SparepartPage;
