import React from "react";
import Banner from "@/components/layout/banner/Breadcrum";
import Service from "@/components/containers/service/Service";
import HomeThreeFeatures from "@/components/containers/features/Features";
import ServiceBoost from "@/components/containers/boost/ServiceBoost";
import ServiceCta from "@/components/containers/cta/ServiceCta";

import { useResolvedLocale } from "@/lib/i18n/locale";
import { useUiSection } from "@/lib/i18n/uiDb";
import { UI_KEYS } from "@/lib/i18n/ui";

const ServicePage: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_services", locale, UI_KEYS.services);

  const title = ui("ui_services_page_title", "Services");

  return (
    <>
      <Banner title={title} />
      <Service />
      <HomeThreeFeatures />
      <ServiceBoost />
      <ServiceCta />
    </>
  );
};

export default ServicePage;
