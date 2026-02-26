import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Layout from "@/components/layout/Layout";
import ContactPage from "@/components/containers/contact/ContactPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return { title: t("contact_title"), description: t("contact_description") };
}

export default function ContactRoutePage() {
  return (
    <Layout header={1} footer={1}>
      <ContactPage />
    </Layout>
  );
}
