import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import OfferPage from "@/components/containers/offer/OfferPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return { title: t("offer_title"), description: t("offer_description") };
}

export default function Page() {
    return (
        <Layout header={1} footer={1}>
            <OfferPage />
        </Layout>
    );
}
