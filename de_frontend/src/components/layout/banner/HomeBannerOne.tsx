"use client";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { sliderService } from "@/features/slider/slider.service";
import type { Slider } from "@/features/slider/slider.type";
import { useSiteSetting } from "@/features/site-settings/siteSettings.action";
import { resolveMediaUrl } from "@/lib/media";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface HomeBannerOneProps {
  initialSliders?: Record<string, unknown>[];
}

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HomeBannerOne = ({ initialSliders }: HomeBannerOneProps) => {
  const t = useTranslations("ensotek.banner");
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

  const { data: contactInfoSetting } = useSiteSetting("contact_info");

  const { data: sliders, isLoading } = useQuery({
    queryKey: queryKeys.slider.list(),
    queryFn: sliderService.getAll,
    staleTime: 5 * 60 * 1000,
    initialData: initialSliders?.length ? (initialSliders as unknown as Slider[]) : undefined,
  });

  const activeSliders = sliders?.filter((s: any) => s.isActive !== false) || [];
  const hasSliders = activeSliders.length > 0;

  const isLikelyBrokenSliderImage = (url?: string | null) => {
    if (!url) return true;
    const trimmed = String(url).trim();
    if (!trimmed) return true;
    if (/-123456789\.(webp|jpg|jpeg|png)$/i.test(trimmed)) return true;
    return false;
  };

  const getCompanyName = () => {
    const value = contactInfoSetting?.value;
    if (!value) return t("companyName");
    const contactInfo = typeof value === 'string' ? JSON.parse(value) : value;
    return contactInfo?.companyName || t("companyName");
  };

  const renderSlideImage = (slider: any) => {
    const imageUrl = resolveMediaUrl(slider.image) || "";
    return (
      <div className="hero__bg-img">
        {!isLikelyBrokenSliderImage(imageUrl) && !failedImageIds[String(slider.id)] ? (
          <Image
            src={imageUrl}
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
    );
  };

  const renderSlideContent = (slider: any, isFirst = false) => (
    <div className="hero__content-3">
      {isFirst ? (
        <h1 className="hero-title-animate mb-25">{slider.title}</h1>
      ) : (
        <h2 className="hero-title-animate mb-25">{slider.title}</h2>
      )}
      {slider.description && (
        <div
          className="hero-desc-animate slider-description mb-45"
          dangerouslySetInnerHTML={{ __html: slider.description }}
        />
      )}
      {(slider.buttonText || t("cta")) && (
        <div className="hero-btn-animate">
          <Link
            href={slider.buttonLink || "/service"}
            className="ens-hero-btn"
          >
            {slider.buttonText || t("cta")}
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );

  const renderBottomBar = () => (
    <div className="hero__bottom-bar">
      <div className="hero__bottom-bar-content">
        <span className="hero__company-name">
          {getCompanyName()}
        </span>
      </div>
    </div>
  );

  const showLoading = (isLoading && !initialSliders?.length) || (!isLoading && !hasSliders);

  if (showLoading) {
    return (
      <section className="hero__area-3 p-relative overflow-hidden">
        <div className="hero__wrapper-v3">
          <div className="hero__loading" />
        </div>
      </section>
    );
  }

  return (
    <section className="hero__area-3 p-relative overflow-hidden">
      <div className="hero__wrapper-v3">

        {/* === MOBILE: Swiper with touch swipe === */}
        <div className="hero__mobile-view d-md-none">
          <Swiper
            slidesPerView={1}
            direction="horizontal"
            speed={500}
            loop={activeSliders.length > 1}
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            grabCursor={true}
            className="hero__mobile-swiper"
          >
            {activeSliders.map((slider: any, idx: number) => (
              <SwiperSlide key={slider.id}>
                <div className="hero__mobile-item">
                  {renderSlideImage(slider)}
                  <div className="hero__mobile-content">
                    {renderSlideContent(slider, idx === 0)}
                  </div>
                  {renderBottomBar()}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* === DESKTOP: Swiper with fade effect === */}
        <div className="hero__desktop-view d-none d-md-block">
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
              {activeSliders.map((slider: any) => {
                const desktopImageUrl = resolveMediaUrl(slider.image) || "";
                return (
                <SwiperSlide key={slider.id}>
                  <div className="hero__item p-relative d-flex align-items-center">
                    <div className="hero__bg-img p-absolute">
                      {!isLikelyBrokenSliderImage(desktopImageUrl) && !failedImageIds[String(slider.id)] ? (
                        <Image
                          src={desktopImageUrl}
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
                            {slider.description && (
                              <div
                                className="hero-desc-animate slider-description mb-45"
                                dangerouslySetInnerHTML={{ __html: slider.description }}
                              />
                            )}
                            {(slider.buttonText || t("cta")) && (
                              <div className="hero-btn-animate">
                                <Link
                                  href={slider.buttonLink || "/service"}
                                  className="ens-hero-btn"
                                >
                                  {slider.buttonText || t("cta")}
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {renderBottomBar()}
                  </div>
                </SwiperSlide>
              );
              })}
            </Swiper>

            <div className="hero__navigation d-none d-md-flex">
              <button className="hero-button-prev" aria-label="Previous slide">
                <ChevronLeft />
              </button>
              <button className="hero-button-next" aria-label="Next slide">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeBannerOne;
