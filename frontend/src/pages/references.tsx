// =============================================================
// FILE: src/pages/references.tsx
// Ensotek – References Page (full list)
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import ReferencesPageContent from "@/components/containers/references/ReferencesPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const ReferencesPage = () => {
  const locale = useResolvedLocale();

  // ui_references section → sayfa başlığı
  const { ui } = useUiSection("ui_references", locale);

  const title = ui(
    "ui_references_page_title",
    locale === "tr" ? "Referanslarımız" : "References",
  );

  return (
    <>
      <Banner title={title} />
      <ReferencesPageContent />
      <Feedback />
    </>
  );
};

export default ReferencesPage;
