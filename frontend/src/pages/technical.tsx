import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Breadcrum";
import TechnicalArea from "@/components/containers/cta/TechnicalArea";
import TechnicalProject from "@/components/containers/projects/Project";

const technical = () => {
  return (
    <Layout >
      <Banner title="Technical SEO" />
      <TechnicalArea />
      <TechnicalProject />
    </Layout>
  );
};

export default technical;
