import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import ProjectCta from "@/components/containers/cta/ProjectCta";
import ProjectGallery from "@/components/containers/cta/ProjectGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects | Digitek",
};

const Project = () => {
  return (
    <Layout header={5} footer={5}>
      <Banner title="Our Projects" />
      <ProjectGallery />
      <ProjectCta />
    </Layout>
  );
};

export default Project;
