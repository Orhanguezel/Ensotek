import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import ServiceList from "@/components/containers/service/ServiceList";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return { title: t("services_title"), description: t("services_description") };
}

const ServicesPage = () => {
    return (
        <Layout header={1} footer={1}>
            <Banner title="Services" />
            <ServiceList />
        </Layout>
    );
};

export default ServicesPage;
