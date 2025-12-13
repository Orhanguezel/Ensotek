// =============================================================
// FILE: src/pages/library/[slug].tsx
// Ensotek – Library Detail Page (by slug)
//   - Data: library + library_i18n (slug + locale)
//   - UI i18n: site_settings.ui_library
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import LibraryDetail from "@/components/containers/library/LibraryDetail";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const LibraryDetailPage: React.FC = () => {
  const locale = useResolvedLocale();

  // ui_library section → sayfa başlığı
  const { ui } = useUiSection("ui_library", locale);

  const title = ui(
    "ui_library_detail_page_title",
    locale === "tr" ? "Teknik Doküman Detayı" : "Library Detail",
  );

  return (
    <>
      <Banner title={title} />
      <LibraryDetail />
    </>
  );
};

export default LibraryDetailPage;
