"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";
import Banner from "@/components/layout/banner/Banner";
import OfferForm from "./OfferForm";

type ContactMap = {
  title?: string;
  height?: number;
  query?: string;
  embed_url?: string;
};

const OfferPage = () => {
  const t = useTranslations("ensotek.offer");
  
  const { data: siteSettings } = useQuery({
    queryKey: queryKeys.siteSettings.list(),
    queryFn: siteSettingsService.getAll,
    staleTime: 60 * 1000,
  });

  const settingsByKey = useMemo(() => {
    const map = new Map<string, unknown>();
    (siteSettings || []).forEach((item: any) => {
      map.set(item.key, item.value);
    });
    return map;
  }, [siteSettings]);

  const contactMap = (settingsByKey.get("contact_map") || {}) as ContactMap;
  const mapHeight = Number(contactMap.height || 420);
  const mapEmbedUrl =
    contactMap.embed_url ||
    (contactMap.query
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          contactMap.query,
        )}&output=embed`
      : "");

  return (
    <>
      <Banner title={t("title") || "Technical Cooling Tower Offer Form"} />

      <section className="offer__area touch__area pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-11">
              <div className="section__title-wrapper text-center mb-60">
                <span className="section__subtitle">
                  <span>{t("subtitle") || "Request an Offer"}</span>
                </span>
                <p className="mt-20">
                  {t("description") || 
                   "Please provide the technical specifications of your project. Our engineering team will prepare a tailored solution for you."}
                </p>
              </div>
              
              <OfferForm />
            </div>
          </div>
        </div>
      </section>

      {mapEmbedUrl && (
        <section className="google__map-area">
          <div className="container-fluid p-0">
             <iframe
                src={mapEmbedUrl}
                title={contactMap.title || "Ensotek Map"}
                style={{ width: "100%", height: `${mapHeight}px`, border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
          </div>
        </section>
      )}
    </>
  );
};

export default OfferPage;
