import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import OfferPage from "@/components/containers/offer/OfferPage";
import { useTranslations } from "next-intl";

export default function Page() {
    return (
        <Layout header={1} footer={1}>
            <OfferPage />
        </Layout>
    );
}
