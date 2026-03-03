"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { referencesService } from "@/features/references/references.service";

import FallbackOne from "public/img/brand/1.png";
import FallbackTwo from "public/img/brand/2.png";
import FallbackThree from "public/img/brand/3.png";
import FallbackFour from "public/img/brand/4.png";
import FallbackFive from "public/img/brand/5.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";

const fallbackImages = [FallbackOne, FallbackTwo, FallbackThree, FallbackFour, FallbackFive];

const SponsorOne = () => {
  const t = useTranslations("ensotek.sponsor");

  const { data: references, isLoading } = useQuery({
    queryKey: queryKeys.references.list({ is_featured: true }),
    queryFn: () => referencesService.getAll({ is_featured: true }),
    staleTime: 5 * 60 * 1000,
  });

  // Use backend references or fallback to static images
  const hasReferences = references && references.length > 0;

  return (
    <div className="brand__area grey-bg-2 pt-0 pb-120">
      <div className="container">
        <div className="brand__title">
          <span>{t("title")}</span>
        </div>
        <div
          className="row justify-content-center"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-12">
            <div className="swiper brand__active">
              <div className="swiper-wer">
                <Swiper
                  spaceBetween={30}
                  slidesPerView={1}
                  pagination={false}
                  loop={true}
                  navigation={false}
                  className="swiper-wrapper"
                  modules={[Autoplay]}
                  autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    400: { slidesPerView: 2 },
                    600: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1500: { slidesPerView: 5 },
                  }}
                >
                  {hasReferences
                    ? references.map((ref) => (
                        <SwiperSlide key={ref.id}>
                          <div className="swiper-slide brand__line">
                            <div className="singel__brand">
                              {ref.featured_image ? (
                                <Image
                                  src={ref.featured_image}
                                  alt={ref.featured_image_alt || ref.title}
                                  width={150}
                                  height={50}
                                  style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "100%" }}
                                />
                              ) : (
                                <span className="brand__text">{ref.title}</span>
                              )}
                            </div>
                          </div>
                        </SwiperSlide>
                      ))
                    : // Fallback to static images
                      [...fallbackImages, ...fallbackImages, ...fallbackImages].map((img, i) => (
                        <SwiperSlide key={`fallback-${i}`}>
                          <div className="swiper-slide brand__line">
                            <div className="singel__brand">
                              <Image src={img} alt="Partner" />
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
  );
};

export default SponsorOne;
