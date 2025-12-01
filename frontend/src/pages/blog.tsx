// src/pages/blog.tsx
import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Breadcrum";
import BlogArea from "@/components/containers/details/BlogArea";

const blog = () => {
  return (
    <Layout >
      <Banner title="Latest Blog" />
      <BlogArea />
    </Layout>
  );
};

export default blog;
