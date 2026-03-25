import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchPageSeo } from "@/i18n/server";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import ServiceList from "@/components/containers/service/ServiceList";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, t] = await Promise.all([
    fetchPageSeo("service", locale),
    getTranslations({ locale, namespace: "seo" }),
  ]);
  return {
    title: pageSeo?.title || t("services_title"),
    description: pageSeo?.description || t("services_description"),
    ...(pageSeo?.og_image ? { openGraph: { images: [pageSeo.og_image] } } : {}),
    ...(pageSeo?.no_index ? { robots: { index: false, follow: true } } : {}),
  };
}

const ServicesPage = async ({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });
    
    return (
        <Layout header={1} footer={1}>
            <Banner title={t("services_title")} />
            <ServiceList />
        </Layout>
    );
};

export default ServicesPage;
