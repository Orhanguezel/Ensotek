import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import ServiceDetailWrapper from "./ServiceDetailWrapper";
import { fetchServiceBySlug } from "@/i18n/server";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const item = await fetchServiceBySlug(slug, locale ?? "tr");
  if (!item) return {};
  return {
    title: item.meta_title || item.title || item.name,
    description: item.meta_description || item.summary || undefined,
  };
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
