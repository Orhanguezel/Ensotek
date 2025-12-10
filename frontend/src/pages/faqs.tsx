// =============================================================
// FILE: src/pages/faqs.tsx
// Ensotek – Faqs Page (full list)
//   - Route: /faqs
//   - Layout: Banner + FaqsPageContent + Feedback
//   - i18n: site_settings.ui_faqs
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import FaqsPageContent from "@/components/containers/faqs/FaqsPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const FaqsPage: React.FC = () => {
    const locale = useResolvedLocale();

    // ui_faqs section → sayfa başlığı
    const { ui } = useUiSection("ui_faqs", locale);

    const title = ui(
        "ui_faqs_page_title",
        locale === "tr" ? "Sıkça Sorulan Sorular" : "FAQs",
    );

    return (
        <>
            <Banner title={title} />
            <FaqsPageContent />
            <Feedback />
        </>
    );
};

export default FaqsPage;
