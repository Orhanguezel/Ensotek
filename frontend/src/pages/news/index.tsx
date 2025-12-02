// =============================================================
// FILE: src/pages/news/index.tsx
// Ensotek – News Page (full list)
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import NewsPageContent from "@/components/containers/news/NewsPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const NewsPage: React.FC = () => {
  const locale = useResolvedLocale();

  // ui_news section → sayfa başlığı
  const { ui } = useUiSection("ui_news", locale);

  const title = ui(
    "ui_news_page_title",
    locale === "tr" ? "Haberler" : "News",
  );

  return (
    <>
      <Banner title={title} />
      <NewsPageContent />
      <Feedback />
    </>
  );
};

export default NewsPage;
