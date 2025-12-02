// =============================================================
// FILE: src/pages/sparepart/[slug].tsx
// Ensotek – Sparepart Detail Page (by slug)
//   - Data: products
//   - Locale-aware via useResolvedLocale
//   - UI i18n: site_settings.ui_spareparts
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import SparepartDetail from "@/components/containers/sparepart/SparepartDetail";
import SparepartMore from "@/components/containers/sparepart/SparepartMore";
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
      <SparepartDetail />
      <SparepartMore />
      <Feedback />
    </>
  );
};

export default SparepartDetailPage;
