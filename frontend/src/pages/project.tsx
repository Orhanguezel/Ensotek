import React from 'react';
import Layout from '@/layout/Layout';
import Banner from '@/layout/banner/Breadcrum';
import ProjectCta from '@/components/containers/cta/ProjectCta';
//import ProjectGallery from "@/components/containers/cta/ProjectGallery";

const project = () => {
  return (
    <Layout>
      <Banner title="Our Projects" />
      {/* <ProjectGallery /> */}
      <ProjectCta />
    </Layout>
  );
};

export default project;
