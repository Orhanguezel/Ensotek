import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import LegalModulePage from "@/components/containers/legal/LegalModulePage";
import { getTranslations } from "next-intl/server";

const TermsPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.legalPages" });

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("termsTitle")} />
      <LegalModulePage moduleKey="terms" />
    </Layout>
  );
};

export default TermsPage;
