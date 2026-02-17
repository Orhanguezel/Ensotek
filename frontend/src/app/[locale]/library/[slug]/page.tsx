import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import LibraryDetail from "@/components/containers/library/LibraryDetail";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

const LibraryDetailPage = async ({ params }: Props) => {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.library" });

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("detailTitle")} />
      <LibraryDetail slug={slug} />
    </Layout>
  );
};

export default LibraryDetailPage;
