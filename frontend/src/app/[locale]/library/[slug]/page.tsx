import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import LibraryDetail from "@/components/containers/library/LibraryDetail";
import { getTranslations } from "next-intl/server";
import { fetchLibraryBySlug } from "@/i18n/server";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const item = await fetchLibraryBySlug(slug, locale ?? "tr");
  if (!item) return {};
  return {
    title: item.meta_title || item.title || item.name,
    description: item.meta_description || item.summary || undefined,
  };
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
