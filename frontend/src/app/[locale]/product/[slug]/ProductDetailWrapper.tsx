"use client";
import React from "react";
import ProductDetail from "@/components/containers/product/ProductDetail";

interface ProductDetailWrapperProps {
  slug: string;
}

const ProductDetailWrapper = ({ slug }: ProductDetailWrapperProps) => {
  return <ProductDetail slug={slug} itemType="product" basePath="/product" />;
};

export default ProductDetailWrapper;
