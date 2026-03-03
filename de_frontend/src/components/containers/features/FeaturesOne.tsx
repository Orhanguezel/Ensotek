"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { servicesService } from "@/features/services/services.service";

import IconOne from "public/img/features/icon-1.png";
import IconTwo from "public/img/features/icon-2.png";
import IconThree from "public/img/features/icon-3.png";
import IconFour from "public/img/features/icon-4.png";

const fallbackIcons = [IconOne, IconTwo, IconThree, IconFour];

const FeaturesOne = () => {
  const t = useTranslations("ensotek.features");

  const { data: services, isLoading } = useQuery({
    queryKey: queryKeys.services.list({ featured: true }),
    queryFn: () => servicesService.getAll({ featured: true, is_active: true }),
    staleTime: 5 * 60 * 1000,
  });

  const hasServices = services && services.length > 0;

  // Fallback static data
  const staticServices = [
    { name: t("staticItems.item1.title"), description: t("staticItems.item1.description") },
    { name: t("staticItems.item2.title"), description: t("staticItems.item2.description") },
    { name: t("staticItems.item3.title"), description: t("staticItems.item3.description") },
    { name: t("staticItems.item4.title"), description: t("staticItems.item4.description") },
  ];

  const displayServices = hasServices
    ? services.slice(0, 4).map((s, i) => ({
        id: s.id,
        name: s.name,
        description: s.description || "",
        slug: s.slug,
        icon: s.image_url,
        fallbackIcon: fallbackIcons[i % fallbackIcons.length],
      }))
    : staticServices.map((s, i) => ({
        id: `static-${i}`,
        name: s.name,
        description: s.description,
        slug: "service",
        icon: null,
        fallbackIcon: fallbackIcons[i],
      }));

  return (
    <section className="features__area grey-bg-3 pt-120 pb-60">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6">
            <div className="section__title-wrapper text-center mb-70">
              <div className="section__subtitle-3">
                <span>{t("subtitle")}</span>
              </div>
              <div className="section__title-3">
                {t("title")}
              </div>
            </div>
          </div>
        </div>
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {displayServices.map((item) => (
            <div key={item.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <div className="features__items mb-60">
                <div className="features__items-icon">
                  {item.icon ? (
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={60}
                      height={60}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <Image src={item.fallbackIcon} alt={item.name} />
                  )}
                </div>
                <div className="features__items-content">
                  <h3>
                    <Link href={`/service/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <p>{item.description}</p>
                </div>
                <Link className="features__btn" href={`/service/${item.slug}`}>
                  {t("viewDetails")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesOne;
