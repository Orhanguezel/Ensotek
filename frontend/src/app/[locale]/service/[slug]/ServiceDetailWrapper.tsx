"use client";
import React from "react";
import ServiceDetail from "@/components/containers/service/ServiceDetail";
import Banner from "@/components/layout/banner/Banner";
import { useServiceBySlug } from "@/features/services/services.action";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface ServiceDetailWrapperProps {
  slug: string;
}

const ServiceDetailWrapper = ({ slug }: ServiceDetailWrapperProps) => {
    const t = useTranslations("ensotek.customPage");
    const { data: item, isLoading, error } = useServiceBySlug(slug);
    const bannerTitle = item?.name || t("pageDetailTitle");

    if (isLoading) {
        return (
            <>
                <Banner title={bannerTitle} />
                <div className="container pt-120 pb-120 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        );
    }

    if (error || !item) {
        return (
            <>
                <Banner title={bannerTitle} />
                <div className="container pt-120 pb-120 text-center">
                    <h2>Service not found</h2>
                    <p className="mb-4">The service you are looking for does not exist or has been removed.</p>
                    <Link href="/service" className="btn btn-primary">Back to Services</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Banner title={bannerTitle} />
            <ServiceDetail item={item} />
        </>
    );
};

export default ServiceDetailWrapper;
