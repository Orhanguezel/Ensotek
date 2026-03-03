import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import ProductDetail from "@/components/containers/product/ProductDetail";
import { fetchProductBySlug } from "@/i18n/server";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const item = await fetchProductBySlug(slug, locale ?? "tr");
  if (!item) return {};
  return {
    title: item.meta_title || item.title || item.name,
    description: item.meta_description || item.summary || undefined,
  };
}

const SparepartDetailPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <Layout header={1} footer={1}>
      <ProductDetail slug={slug} itemType="sparepart" basePath="/sparepart" />
    </Layout>
  );
};

export default SparepartDetailPage;
