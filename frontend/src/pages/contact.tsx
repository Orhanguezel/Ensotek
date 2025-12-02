"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import Contact from "@/components/containers/contact/Contact";
import ContactMap from "@/components/containers/contact/ContactMap";

// Yeni i18n helper’lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const ContactPage: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_contact", locale);

  // Sayfa başlığı: "Get in touch" / "İletişime geçin" vb.
  const title =
    `${ui("ui_contact_subprefix", "Contact")} ${ui(
      "ui_contact_sublabel",
      "",
    )}`.trim() || "Contact";

  return (
    <>
      <Banner title={title} />
      <Contact />
      <ContactMap />
    </>
  );
};

export default ContactPage;
