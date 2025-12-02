// =============================================================
// FILE: src/pages/news/[slug].tsx
// Ensotek – News Detail Page (by slug)
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import NewsDetail from "@/components/containers/news/NewsDetail";
import NewsMore from "@/components/containers/news/NewsMore";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const NewsDetailPage: React.FC = () => {
  const locale = useResolvedLocale();

  // ui_news section → sayfa başlığı
  const { ui } = useUiSection("ui_news", locale);

  const title = ui(
    "ui_news_detail_page_title",
    locale === "tr" ? "Haber Detayı" : "News",
  );

  return (
    <>
      <Banner title={title} />
      <NewsDetail />
      <NewsMore />
    </>
  );
};

export default NewsDetailPage;
