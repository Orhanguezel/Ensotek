"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useCustomPages } from "@/features/custom-pages/customPages.action";
import type { CustomPage } from "@/features/custom-pages/customPages.type";
import { useTranslations } from "next-intl";

interface MissionVisionListProps {
  title: string;
}

const MissionVisionList = ({ title }: MissionVisionListProps) => {
  const t = useTranslations("ensotek.customPage");

  const { data: missionData, isLoading: isMissionLoading } = useCustomPages({
    module_key: "mission",
    is_published: true,
  });

  const { data: visionData, isLoading: isVisionLoading } = useCustomPages({
    module_key: "vision",
    is_published: true,
  });

  const isLoading = isMissionLoading || isVisionLoading;

  const items = useMemo(() => {
    const missionItems = missionData?.data || [];
    const visionItems = visionData?.data || [];

    return [...missionItems, ...visionItems].sort((a: CustomPage, b: CustomPage) => {
      const orderA = a.order_num ?? a.display_order ?? 0;
      const orderB = b.order_num ?? b.display_order ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [missionData, visionData]);

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <section className="blog__list-area pt-120 pb-90">
      <div className="container">
        <div className="section__title-wrapper mb-60 text-center">
          <h2 className="section__title-3">{title}</h2>
        </div>
        <div className="row">
          {items.map((item: CustomPage) => (
            <div key={item.id} className="col-xl-6 col-lg-6 col-md-6">
              <div
                className="blog__item-3 mb-30 p-relative fix"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                }}
              >
                <div className="blog__thumb-3 w-img">
                  <Link href={`/mission-vision/${encodeURIComponent(item.slug)}`}>
                    <Image
                      src={item.image_url || item.featured_image || "/img/blog/blog-1.jpg"}
                      alt={item.title}
                      width={400}
                      height={250}
                      style={{ objectFit: "cover", height: "250px" }}
                    />
                  </Link>
                </div>
                <div className="blog__content-3 p-4 bg-white">
                  {/* <div className="blog__meta-3 mb-10">
                    <span className="text-muted" style={{ fontSize: "13px" }}>
                      <i className="fal fa-calendar-alt mr-5"></i>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div> */}
                  <h3
                    className="blog__title-3"
                    style={{ fontSize: "20px", lineHeight: "1.4", marginBottom: "15px" }}
                  >
                    <Link href={`/mission-vision/${encodeURIComponent(item.slug)}`}>
                      {item.title}
                    </Link>
                  </h3>
                  <p
                    className="text-muted"
                    style={{
                      fontSize: "14px",
                      marginBottom: "20px",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.summary || (item.content ? t("summaryFallback") : "")}
                  </p>
                  <Link
                    href={`/mission-vision/${encodeURIComponent(item.slug)}`}
                    className="read-more-btn"
                    style={{ color: "#0056b3", fontWeight: "600" }}
                  >
                    {t("readMore")} <i className="fal fa-arrow-right ml-5"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-12 text-center py-5">
              <p>{t("noItems")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MissionVisionList;
