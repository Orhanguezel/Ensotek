import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import LibraryList from "@/components/containers/library/LibraryList";
import WetBulbCalculator from "@/components/containers/library/WetBulbCalculator";
import { getTranslations } from "next-intl/server";
import { fetchPageSeo } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, t] = await Promise.all([
    fetchPageSeo("library", locale),
    getTranslations({ locale, namespace: "seo" }),
  ]);
  return {
    title: pageSeo?.title || t("library_title"),
    description: pageSeo?.description || t("library_description"),
    ...(pageSeo?.og_image ? { openGraph: { images: [pageSeo.og_image] } } : {}),
    ...(pageSeo?.no_index ? { robots: { index: false, follow: true } } : {}),
  };
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
