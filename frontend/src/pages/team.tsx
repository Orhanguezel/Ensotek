import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Breadcrum";
import TeamArea from "@/components/containers/details/TeamArea";
import ServiceCtaTwo from "@/components/containers/cta/ServiceCtaTwo";

const team = () => {
  return (
    <Layout>
      <Banner title="Our SEO Expert" />
      <TeamArea />
      <ServiceCtaTwo />
    </Layout>
  );
};

export default team;
