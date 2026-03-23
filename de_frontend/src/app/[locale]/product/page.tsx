import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import ProductList from "@/components/containers/product/ProductList";
import { getTranslations } from "next-intl/server";
import { fetchPageSeo } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, t] = await Promise.all([
    fetchPageSeo("product", locale),
    getTranslations({ locale, namespace: "seo" }),
  ]);
  return {
    title: pageSeo?.title || t("products_title"),
    description: pageSeo?.description || t("products_description"),
    ...(pageSeo?.og_image ? { openGraph: { images: [pageSeo.og_image] } } : {}),
    ...(pageSeo?.no_index ? { robots: { index: false, follow: true } } : {}),
  };
}

const ProductsPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.products" });

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("listTitle")} />
      <ProductList itemType="product" basePath="/product" />
    </Layout>
  );
};

export default ProductsPage;
