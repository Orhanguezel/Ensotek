"use client";
import React from "react";
import { useCustomPages } from "@/features/custom-pages/customPages.action";
import PageDetail from "./PageDetail";
import { useTranslations } from "next-intl";
import Banner from "@/components/layout/banner/Banner";

const AboutDetailPageContent = () => {
  const t = useTranslations("ensotek.customPage");
  const { data, isLoading, error } = useCustomPages({ 
    module_key: "about", 
    is_published: true,
    limit: 1 
  });

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    );
  }

  const items = data?.data || [];
  const firstItem = items[0];

  if (error || !firstItem) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <h2>{t("pageNotFound")}</h2>
      </div>
    );
  }

  return (
    <>
      <Banner title={firstItem.title} />
      <PageDetail item={firstItem} />
    </>
  );
};

export default AboutDetailPageContent;
