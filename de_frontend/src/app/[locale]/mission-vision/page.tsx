import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import MissionVisionContent from "@/components/containers/custom-pages/MissionVisionContent";
import { getTranslations } from "next-intl/server";
import { fetchPageSeo } from "@/i18n/server";
import { customPagesService } from "@/features/custom-pages/customPages.service";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, t] = await Promise.all([
    fetchPageSeo("mission_vision", locale),
    getTranslations({ locale, namespace: "seo" }),
  ]);
  return {
    title: pageSeo?.title || t("mission_vision_title"),
    description: pageSeo?.description || t("mission_vision_description"),
    ...(pageSeo?.og_image ? { openGraph: { images: [pageSeo.og_image] } } : {}),
    ...(pageSeo?.no_index ? { robots: { index: false, follow: true } } : {}),
  };
}

const MissionVisionListPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.staticPages" });

  const fetchItem = async (moduleKey: string) => {
    try {
      const response = await customPagesService.getAll(
        { module_key: moduleKey, is_published: true, limit: 1 },
        { headers: { 'x-locale': locale, 'accept-language': locale } }
      );
      return response.data?.[0] || null;
    } catch (error) {
      console.error(`Error fetching ${moduleKey}:`, error);
      return null;
    }
  };

  const [mission, vision] = await Promise.all([
    fetchItem("mission"),
    fetchItem("vision")
  ]);

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("missionVisionTitle")} />
      <MissionVisionContent 
        mission={mission} 
        vision={vision} 
        title={t("missionVisionTitle")} 
      />
    </Layout>
  );
};

export default MissionVisionListPage;
