import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import ProductList from "@/components/containers/product/ProductList";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return { title: t("sparepart_title"), description: t("sparepart_description") };
}

const SparepartsPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.products" });

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("spareListTitle")} />
      <ProductList itemType="sparepart" basePath="/sparepart" />
    </Layout>
  );
};

export default SparepartsPage;
