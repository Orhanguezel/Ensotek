// =============================================================
// FILE: src/pages/team/[slug].tsx
// Ensotek – Team Member Detail Page
//   - Route: /team/[slug]
//   - Layout: Banner + TeamDetail + ServiceCtaTwo
//   - UI i18n: site_settings.ui_team
//   - Data: custom_pages (module_key = "team")
// =============================================================

"use client";

import React from "react";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import TeamDetail from "@/components/containers/team/TeamDetail";
import ServiceCtaTwo from "@/components/containers/cta/CatalogCta";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { useGetCustomPageBySlugPublicQuery } from "@/integrations/rtk/endpoints/custom_pages.endpoints";

const TeamDetailPage: React.FC = () => {
  const router = useRouter();
  const slugParam = router.query.slug;

  const slug =
    typeof slugParam === "string"
      ? slugParam
      : Array.isArray(slugParam)
        ? slugParam[0]
        : "";

  const locale = useResolvedLocale() || "tr";

  const { ui } = useUiSection("ui_team", locale);

  const { data } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    {
      skip: !slug,
    },
  );

  // Banner başlığı:
  //  1) Sayfanın kendi title'ı (ör: "Co-Founder & Managing Director")
  //  2) ui_team_detail_page_title
  //  3) ui_team_page_title
  //  4) locale fallback ("Ekibimiz" / "Our Team")
  const localeFallback = ui(
    "ui_team_page_title",
    locale === "tr" ? "Ekibimiz" : "Our Team",
  );

  const fallbackTitle = ui(
    "ui_team_detail_page_title",
    locale === "tr" ? "Ekip Üyesi" : "Team Member",
  );

  const bannerTitle = (data?.title || "").trim() || fallbackTitle || localeFallback;

  // slug henüz router’dan gelmemişse skeleton göster
  if (!slug) {
    return (
      <>
        <Banner title={fallbackTitle || localeFallback} />
        <section className="team__area pt-120 pb-120">
          <div className="container">
            <div className="accordion-item" aria-hidden>
              <div className="accordion-body">
                <div
                  className="skeleton-line"
                  style={{ height: 32, marginBottom: 16 }}
                />
                <div
                  className="skeleton-line"
                  style={{ height: 20, width: "60%", marginBottom: 24 }}
                />
                <div
                  className="skeleton-line"
                  style={{ height: 16, marginBottom: 8 }}
                />
                <div
                  className="skeleton-line"
                  style={{ height: 16, width: "90%", marginBottom: 8 }}
                />
                <div
                  className="skeleton-line"
                  style={{ height: 16, width: "80%" }}
                />
              </div>
            </div>
          </div>
        </section>
        <ServiceCtaTwo />
      </>
    );
  }

  return (
    <>
      <Banner title={bannerTitle} />
      <TeamDetail slug={slug} />
      <ServiceCtaTwo />
    </>
  );
};

export default TeamDetailPage;
