import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Breadcrum";
import BlogDetailsArea from "@/components/containers/details/BlogDetailsArea";

const blogDetails = () => {
  return (
    <Layout >
      <Banner title="Blog Single" />
      <BlogDetailsArea />
    </Layout>
  );
};

export default blogDetails;
