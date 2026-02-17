import React from "react";
import Layout from "@/components/layout/Layout";
import PageList from "@/components/containers/custom-pages/PageList";
import Banner from "@/components/layout/banner/Banner";
import { getTranslations } from "next-intl/server";

const BlogListPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.blog" });

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("title")} />
      <PageList moduleKey="blog" title={t("title")} />
    </Layout>
  );
};

export default BlogListPage;
