import React from "react";
import Layout from "@/components/layout/Layout";
import PageList from "@/components/containers/custom-pages/PageList";
import Banner from "@/components/layout/banner/Banner";
import { getTranslations } from "next-intl/server";

const TeamPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.staticPages" });

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("teamTitle")} />
      <PageList moduleKey="team" title={t("teamTitle")} basePath="/team" />
    </Layout>
  );
};

export default TeamPage;
