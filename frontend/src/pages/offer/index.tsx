// =============================================================
// FILE: src/pages/offer/index.tsx
// Teklif Sayfası (Public) – DB i18n UI (ui_offer)
// =============================================================

"use client";

import React from "react";
import Banner from "@/components/layout/banner/Breadcrum";
import OfferPageContainer from "@/components/containers/offer/OfferPage";
import ContactMap from "@/components/containers/contact/ContactMap";

// i18n helper’lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const OfferPage: React.FC = () => {
  const locale = useResolvedLocale();

  // ui_offer section → sayfa başlığı buradan gelir
  const { ui } = useUiSection("ui_offer", locale);

  const title = ui(
    "ui_offer_page_title",
    locale === "tr" ? "Teklif Talep Formu" : "Request an Offer"
  );

  return (
    <>
      <Banner title={title} />
      <OfferPageContainer locale={locale} />
      <ContactMap />
    </>
  );
};

export default OfferPage;
