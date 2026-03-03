import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import PageSwitch from "@/components/containers/custom-pages/PageSwitch";
import { fetchCustomPage } from "@/i18n/server";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const item = await fetchCustomPage(slug, locale ?? "tr");
  if (!item) return {};
  return {
    title: item.meta_title || item.title,
    description: item.meta_description || item.summary || undefined,
  };
}

const BlogDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <Layout header={1} footer={1}>
      <PageSwitch slug={slug} />
    </Layout>
  );
};

export default BlogDetailPage;
