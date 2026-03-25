import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import PageList from "@/components/containers/custom-pages/PageList";
import Banner from "@/components/layout/banner/Banner";
import { getTranslations } from "next-intl/server";
import { fetchPageSeo } from "@/i18n/server";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, t] = await Promise.all([
    fetchPageSeo("blog", locale),
    getTranslations({ locale, namespace: "seo" }),
  ]);
  return {
    title: pageSeo?.title || t("blog_title"),
    description: pageSeo?.description || t("blog_description"),
    ...(pageSeo?.og_image ? { openGraph: { images: [pageSeo.og_image] } } : {}),
    ...(pageSeo?.no_index ? { robots: { index: false, follow: true } } : {}),
  };
}

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
