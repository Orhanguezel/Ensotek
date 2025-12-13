// =============================================================
// FILE: src/pages/service/index.tsx
// Public Services Page (list)
// =============================================================

import React from "react";
import Banner from "@/components/layout/banner/Breadcrum";
import Service from "@/components/containers/service/Service";
import ServiceMore from "@/components/containers/service/ServiceMore";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const ServicePage: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_services", locale);

  const title = ui("ui_services_page_title", "Services");

  return (
    <>
      <Banner title={title} />
      <Service />
      <ServiceMore />
    </>
  );
};

export default ServicePage;
