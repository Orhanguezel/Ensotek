import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Breadcrum";
import AnalysArea from "@/components/containers/details/AnalysArea";

const analys = () => {
  return (
    <Layout>
      <Banner title="Analys & Backup Blockchain" />
      <AnalysArea />
    </Layout>
  );
};

export default analys;
