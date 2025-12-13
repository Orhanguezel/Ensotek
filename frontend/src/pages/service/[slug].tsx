// =============================================================
// FILE: src/pages/service/[slug].tsx
// Public Service Detail Page (by slug)
// =============================================================

import React from "react";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import ServiceDetail from "@/components/containers/service/ServiceDetail";
import ServiceMore from "@/components/containers/service/ServiceMore";
import ServiceCta from "@/components/containers/cta/ServiceCta";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const ServiceDetailPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_services", locale);

  const pageTitle = ui("ui_services_page_title", "Services");

  if (!slug || typeof slug !== "string") {
    return (
      <>
        <Banner title={pageTitle} />
        <div className="service__area pt-120 pb-90">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="skeleton-line" style={{ height: 24 }} />
                <div className="skeleton-line mt-10" style={{ height: 16 }} />
                <div className="skeleton-line mt-10" style={{ height: 16 }} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Banner title={pageTitle} />
      <ServiceDetail slug={slug} />
      <ServiceMore currentSlug={slug} />
      <ServiceCta />
    </>
  );
};

export default ServiceDetailPage;
