import React from "react";
import Layout from "@/components/layout/Layout";
import ServiceDetailWrapper from "./ServiceDetailWrapper";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const ServiceDetailPage = async ({ params }: Props) => {
    const { slug } = await params;
    return (
        <Layout header={1} footer={1}>
            <ServiceDetailWrapper slug={slug} />
        </Layout>
    );
};

export default ServiceDetailPage;
