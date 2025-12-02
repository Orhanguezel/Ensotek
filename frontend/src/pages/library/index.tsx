// src/pages/library/index.tsx

import React from "react";
import Banner from "@/components/layout/banner/Breadcrum";
import LibrarySection from "@/components/containers/library/Library";

// Yeni i18n helper’lar
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
    </>
  );
};

export default LibraryPage;
