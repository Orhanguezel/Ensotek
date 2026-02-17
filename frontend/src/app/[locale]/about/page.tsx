import React from "react";
import Layout from "@/components/layout/Layout";
import PageList from "@/components/containers/custom-pages/PageList";
import Banner from "@/components/layout/banner/Banner";
import { getTranslations } from "next-intl/server";
import { customPagesService } from "@/features/custom-pages/customPages.service";
import { redirect } from "next/navigation";

const AboutListPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.staticPages" });

  let firstSlug = "";
  try {
    const response = await customPagesService.getAll(
      { 
        module_key: "about", 
        is_published: true,
        limit: 1
      },
      {
        headers: {
          'x-locale': locale,
          'accept-language': locale
        }
      }
    );

    if (response.data && response.data.length > 0) {
      firstSlug = response.data[0].slug;
    }
  } catch (error) {
    console.error("Error fetching about pages for redirect:", error);
  }

  if (firstSlug) {
    redirect(`/${locale}/about/${firstSlug}`);
  }

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("aboutTitle")} />
      <PageList moduleKey="about" title={t("aboutTitle")} basePath="/about" />
    </Layout>
  );
};

export default AboutListPage;
