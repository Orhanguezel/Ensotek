"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { sliderService } from "@/features/slider/slider.service";
import { useSiteSetting } from "@/features/site-settings/siteSettings.action";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HomeBannerOne = () => {
  const t = useTranslations("ensotek.banner");
  const locale = useLocale();
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});
  
  // Fetch contact_info from database for current locale
  const { data: contactInfoSetting } = useSiteSetting("contact_info");

  const { data: sliders, isLoading } = useQuery({
    queryKey: queryKeys.slider.list(),
    queryFn: sliderService.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // Filter active sliders
  const activeSliders = sliders?.filter((s: any) => s.isActive !== false) || [];
  const hasSliders = activeSliders.length > 0;

  const isLikelyBrokenSliderImage = (url?: string | null) => {
    if (!url) return true;
    const trimmed = String(url).trim();
    if (!trimmed) return true;

    // Seed/placeholder URL pattern that returns 404 in current dataset.
    if (/-123456789\.(webp|jpg|jpeg|png)$/i.test(trimmed)) return true;
    return false;
  };

  return (
    <section className="hero__area-3 p-relative overflow-hidden">

      <div className="hero__wrapper-v3">
          {isLoading ? (
            <div className="hero__loading" />
          ) : hasSliders ? (
            <div className="hero__slider-container p-relative">
              <Swiper
                slidesPerView={1}
                loop={true}
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                navigation={{
                  nextEl: ".hero-button-next",
                  prevEl: ".hero-button-prev",
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: false
                }}
                className="hero__slider-full"
              >
                {activeSliders.map((slider: any) => (
                  <SwiperSlide key={slider.id}>
                    <div className="hero__item p-relative d-flex align-items-center">
                      {/* Background Layer */}
                      <div className="hero__bg-img p-absolute">
                          {!isLikelyBrokenSliderImage(slider.image) && !failedImageIds[String(slider.id)] ? (
                              <Image
                                src={slider.image}
                                alt={slider.alt || slider.title || t("defaultTitle")}
                                fill
                                priority
                                sizes="100vw"
                                onError={() =>
                                  setFailedImageIds((prev) => ({
                                    ...prev,
                                    [String(slider.id)]: true,
                                  }))
                                }
                              />
                          ) : (
                              <div className="hero__bg-fallback" />
                          )}
                      </div>

                      <div className="container p-relative hero__content-z">
                        <div className="row">
                          <div className="col-xl-9 col-lg-11">
                            <div className="hero__content-3">
                              <h2 className="hero-title-animate text-white mb-25">
                                {slider.title}
                              </h2>
                              <p className="hero-desc-animate mb-45">
                                {slider.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Blue Bar with Company Name */}
                      <div className="hero__bottom-bar">
                        <div className="hero__bottom-bar-content">
                          <span className="hero__company-name">
                            {(() => {
                              const value = contactInfoSetting?.value;
                              if (!value) return t("companyName");
                              
                              // Backend might have already parsed it, or it might be a string
                              const contactInfo = typeof value === 'string' ? JSON.parse(value) : value;
                              return contactInfo?.companyName || t("companyName");
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Arrows */}
              <div className="hero__navigation d-none d-md-flex">
                  <button className="hero-button-prev" aria-label="Previous slide">
                    <ChevronLeft />
                  </button>
                  <button className="hero-button-next" aria-label="Next slide">
                    <ChevronRight />
                  </button>
              </div>
            </div>
          ) : (
            <div className="hero__loading" />
          )}
      </div>
    </section>
  );
};

export default HomeBannerOne;
