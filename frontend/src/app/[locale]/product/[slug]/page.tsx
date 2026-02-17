import React from "react";
import Layout from "@/components/layout/Layout";
import ProductDetail from "@/components/containers/product/ProductDetail";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const ProductDetailPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <Layout header={1} footer={1}>
      <ProductDetail slug={slug} itemType="product" basePath="/product" />
    </Layout>
  );
};

export default ProductDetailPage;
