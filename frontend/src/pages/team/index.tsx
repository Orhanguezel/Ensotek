// =============================================================
// FILE: src/pages/team/index.tsx
// Ensotek – Team Page (full list)
//   - Route: /team
//   - Layout: Banner + TeamPageContent + ServiceCtaTwo
//   - i18n: site_settings.ui_team
//   - Data: custom_pages (module_key = "team")
// =============================================================

"use client";

import React from "react";

import Banner from "@/components/layout/banner/Breadcrum";
import TeamPageContent from "@/components/containers/team/TeamPageContent";
import ServiceCtaTwo from "@/components/containers/cta/ServiceCtaTwo";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const TeamPage: React.FC = () => {
  const locale = useResolvedLocale() || "tr";

  const { ui } = useUiSection("ui_team", locale);

  // Artık başlık tamamen site_settings içeriğine göre geliyor;
  // kod tarafında sadece nötr bir fallback var.
  const title = ui("ui_team_page_title", "Team");

  return (
    <>
      <Banner title={title} />
      <TeamPageContent />
      <ServiceCtaTwo />
    </>
  );
};

export default TeamPage;
