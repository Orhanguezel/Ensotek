import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import QualityDetailContent from "@/components/containers/custom-pages/QualityDetailContent";
import Banner from "@/components/layout/banner/Banner";
import { getTranslations } from "next-intl/server";
import { fetchPageSeo } from "@/i18n/server";
import { customPagesService } from "@/features/custom-pages/customPages.service";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, t] = await Promise.all([
    fetchPageSeo("quality", locale),
    getTranslations({ locale, namespace: "seo" }),
  ]);
  return {
    title: pageSeo?.title || t("quality_title"),
    description: pageSeo?.description || t("quality_description"),
    ...(pageSeo?.og_image ? { openGraph: { images: [pageSeo.og_image] } } : {}),
    ...(pageSeo?.no_index ? { robots: { index: false, follow: true } } : {}),
  };
}

const QualityListPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.staticPages" });

  let items: any[] = [];
  let uiData = null;
  try {
    const [pageRes, uiRes] = await Promise.all([
      customPagesService.getAll(
        { module_key: "quality", is_published: true },
        { headers: { 'x-locale': locale, 'accept-language': locale } }
      ),
      siteSettingsService.getByKey("ui_quality", {
        headers: { 'x-locale': locale, 'accept-language': locale }
      }).catch(() => null)
    ]);
    
    items = pageRes.data || [];
    
    if (uiRes && uiRes.value) {
      try {
        uiData = typeof uiRes.value === 'string' ? JSON.parse(uiRes.value) : uiRes.value;
      } catch (e) {
        console.error("Error parsing ui_quality JSON:", e);
      }
    }
  } catch (error) {
    console.error("Error fetching quality page data:", error);
  }

  return (
    <Layout header={1} footer={1}>
      <Banner title={uiData?.ui_quality_page_title || t("qualityTitle")} />
      <QualityDetailContent items={items} ui={uiData} />
    </Layout>
  );
};

export default QualityListPage;
