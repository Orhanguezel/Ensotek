import React from "react";
import Banner from "@/components/layout/banner/Breadcrum";
import AboutCounter from "@/components/containers/counter/AboutCounter";
import About from "@/components/containers/about/AboutPageContent";
import AboutTeam from "@/components/containers/team/AboutTeam";
import Sponsor from "@/components/containers/references/References";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const AboutPage = () => {
  const locale = useResolvedLocale();

  // ui_about section → sayfa başlığı vs.
  const { ui } = useUiSection("ui_about", locale);

  const title = ui(
    "ui_about_page_title",
    locale === "tr" ? "Hakkımızda" : "About Us",
  );

  return (
    <>
      <Banner title={title} />
      <About />
      <AboutCounter />
      <AboutTeam />
      <Sponsor />
      <Feedback />
    </>
  );
};

export default AboutPage;
