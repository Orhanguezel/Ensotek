import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import PageList from "@/components/containers/custom-pages/PageList";
import Banner from "@/components/layout/banner/Banner";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return { title: t("news_title"), description: t("news_description") };
}

const NewsListPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.news" });

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("title")} />
      <PageList moduleKey="news" title={t("title")} />
    </Layout>
  );
};

export default NewsListPage;
