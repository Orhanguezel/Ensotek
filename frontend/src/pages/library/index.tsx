// =============================================================
// FILE: src/pages/library/index.tsx
// Ensotek – Library Page + Wet-Bulb Calculator Section
// =============================================================

import React from "react";
import Banner from "@/components/layout/banner/Breadcrum";
import LibrarySection from "@/components/containers/library/Library";

// Yeni eklenen hesaplayıcı
import WetBulbCalculator from "@/components/containers/library/WetBulbCalculator";

// i18n helper’lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const LibraryPage: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_library", locale);

  const title = ui("ui_library_page_title", "Library");

  return (
    <>
      <Banner title={title} />
      <LibrarySection />
      <WetBulbCalculator />
    </>
  );
};

export default LibraryPage;
