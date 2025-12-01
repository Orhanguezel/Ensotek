// src/pages/library/index.tsx

import React from "react";
import Banner from "@/components/layout/banner/Breadcrum";
import LibrarySection from "@/components/containers/library/Library";

// Yeni i18n helper’lar
import { useResolvedLocale } from "@/lib/i18n/locale";
import { useUiSection } from "@/lib/i18n/uiDb";
import { UI_KEYS } from "@/lib/i18n/ui";

const LibraryPage: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_library", locale, UI_KEYS.library);

  const title = ui("ui_library_page_title", "Library");

  return (
    <>
      <Banner title={title} />
      <LibrarySection />
    </>
  );
};

export default LibraryPage;
