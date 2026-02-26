import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import LibraryList from "@/components/containers/library/LibraryList";
import WetBulbCalculator from "@/components/containers/library/WetBulbCalculator";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return { title: t("library_title"), description: t("library_description") };
}

const LibraryPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.library" });

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("title")} />
      <LibraryList />
      <WetBulbCalculator />
    </Layout>
  );
};

export default LibraryPage;
