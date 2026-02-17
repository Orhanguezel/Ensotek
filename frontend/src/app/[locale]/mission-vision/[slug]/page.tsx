import React from "react";
import Layout from "@/components/layout/Layout";
import PageSwitch from "@/components/containers/custom-pages/PageSwitch";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const MissionVisionDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <Layout header={1} footer={1}>
      <PageSwitch slug={slug} />
    </Layout>
  );
};

export default MissionVisionDetailPage;
