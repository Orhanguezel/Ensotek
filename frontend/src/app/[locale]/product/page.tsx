import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import ProductList from "@/components/containers/product/ProductList";
import { getTranslations } from "next-intl/server";

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
