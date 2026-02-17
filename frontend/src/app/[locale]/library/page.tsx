import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import LibraryList from "@/components/containers/library/LibraryList";
import WetBulbCalculator from "@/components/containers/library/WetBulbCalculator";
import { getTranslations } from "next-intl/server";

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
