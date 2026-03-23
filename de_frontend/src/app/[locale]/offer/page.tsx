import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchPageSeo } from "@/i18n/server";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import OfferPage from "@/components/containers/offer/OfferPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, t] = await Promise.all([
    fetchPageSeo("offer", locale),
    getTranslations({ locale, namespace: "seo" }),
  ]);
  return {
    title: pageSeo?.title || t("offer_title"),
    description: pageSeo?.description || t("offer_description"),
    ...(pageSeo?.og_image ? { openGraph: { images: [pageSeo.og_image] } } : {}),
    ...(pageSeo?.no_index ? { robots: { index: false, follow: true } } : {}),
  };
}

export default function Page() {
    return (
        <Layout header={1} footer={1}>
            <OfferPage />
        </Layout>
    );
}
