"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { categoriesService } from "@/features/categories/categories.service";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";

import IconOne from "public/img/choose/01.png";
import IconTwo from "public/img/choose/02.png";
import IconThree from "public/img/choose/03.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";

const fallbackIcons = [IconOne, IconTwo, IconThree];

const ChooseOne = () => {
  const t = useTranslations("ensotek.choose");

  // Fetch featured categories (like core services/benefits)
  const { data: categories } = useQuery({
    queryKey: queryKeys.categories.list({ is_featured: true }),
    queryFn: () => categoriesService.getAll({ is_featured: true }),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch site settings for global texts
  const { data: siteSettings } = useQuery({
    queryKey: queryKeys.siteSettings.list(),
    queryFn: siteSettingsService.getAll,
    staleTime: 10 * 60 * 1000,
  });

  const getSetting = (key: string): any => {
    if (!siteSettings) return null;
    return siteSettings.find((s: any) => s.key === key)?.value || null;
  };

  const companyProfile = getSetting("company_profile");

  const hasCategories = categories && categories.length > 0;

  // Fallback static data if API is empty
  const staticItems = [
    { name: t("staticItems.item1.title"), description: t("staticItems.item1.description") },
    { name: t("staticItems.item2.title"), description: t("staticItems.item2.description") },
    { name: t("staticItems.item3.title"), description: t("staticItems.item3.description") },
  ];

  const displayItems = hasCategories
    ? categories.map((cat: any, i: number) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || t("categoryDescriptionFallback"),
        slug: cat.slug,
        fallbackIcon: fallbackIcons[i % fallbackIcons.length],
      }))
    : staticItems.map((s, i) => ({
        id: `static-${i}`,
        name: s.name,
        description: s.description,
        slug: "about",
        fallbackIcon: fallbackIcons[i % fallbackIcons.length],
      }));

  return (
    <section className="choose__area pt-120">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-8">
            <div className="section__title-wrapper mb-40">
              <div className="section__subtitle-3">
                <span>{getSetting("site_title")?.toUpperCase() || t("subtitle")}</span>
              </div>
              <h2 className="section__title-3" style={{ fontSize: "36px", lineHeight: "1.2" }}>
                {companyProfile?.headline || t("title")}
              </h2>
              {companyProfile?.subline && (
                <p className="mt-20" style={{ fontSize: "16px", opacity: 0.8 }}>
                  {companyProfile.subline}
                </p>
              )}
            </div>
          </div>
          <div className="col-xl-5 col-lg-4">
            <div className="choouse__pagination-wrapper text-lg-end">
              <div className="choose__pagination"></div>
            </div>
          </div>
        </div>
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-12">
            <div className="choose__line">
              <div className="swiper choose__active">
                <div className="swiper-wrapper">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    roundLengths={true}
                    modules={[Autoplay, Pagination]}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      el: ".choose__pagination",
                      clickable: true,
                    }}
                    className="choose__active"
                    breakpoints={{
                      768: { slidesPerView: 2 },
                      1200: { slidesPerView: 3 },
                    }}
                  >
                    {displayItems.map((item: any) => (
                      <SwiperSlide key={item.id}>
                        <div className="swiper-slide">
                          <div className="choose__features">
                            <div className="choose__features-icon">
                              <Image src={item.fallbackIcon} alt={item.name} />
                            </div>
                            <div className="choose__features-content">
                              <h3>
                                <Link href={`/categories/${item.slug}`}>{item.name}</Link>
                              </h3>
                              <p>{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseOne;
