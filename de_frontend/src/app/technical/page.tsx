import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import TechnicalArea from "@/components/containers/cta/TechnicalArea";
import TechnicalProject from "@/components/containers/projects/TechnicalProject";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical SEO | Digitek",
};

const Technical = () => {
  return (
    <Layout header={5} footer={2}>
      <Banner title="Technical SEO" />
      <TechnicalArea />
      <TechnicalProject />
    </Layout>
  );
};

export default Technical;
