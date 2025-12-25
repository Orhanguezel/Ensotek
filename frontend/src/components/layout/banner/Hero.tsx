// =============================================================
// FILE: src/components/home/Hero.tsx
// Public Hero – Slider + UI i18n (site_settings.ui_hero)
// =============================================================
"use client";

import React, { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

// Dekoratif şekiller + placeholder
import ShapeA from "public/img/shape/hero-shape-3.png";
import ShapeB from "public/img/shape/hero-shape-4.png";
import Dot from "public/img/shape/dot.png";
import ProjectThumb from "public/img/project/project-thumb.jpg";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";

// Icons
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// RTK – PUBLIC sliders
import {
  useListSlidersQuery,
} from "@/integrations/rtk/hooks";
import type { SliderPublicDto } from "@/integrations/types/slider.types";

// Ortak helper'lar
import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

// Yeni i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

type HeroSlide = {
  id: string;
  title: string;
  desc: string;
  src: string | StaticImageData;
  alt: string;
  buttonText?: string;
  buttonLink?: string;
};

const Hero: React.FC = () => {
  const locale = useResolvedLocale();

  // UI metinleri → site_settings.key = "ui_hero"
  const { ui } = useUiSection("ui_hero", locale);

  // ✅ Public slider listesi
  const {
    data: sliderList,
    isLoading: slidersLoading,
  } = useListSlidersQuery({
    locale,
    limit: 5,
    sort: "display_order",
    order: "asc",
  });

  const slides: HeroSlide[] = useMemo(() => {
    const list: SliderPublicDto[] = Array.isArray(sliderList)
      ? sliderList
      : [];

    const active = list.filter((s) => s.isActive);

    if (!active.length) {
      // Placeholder 3 slide – sadece görsel, metinler i18n'den
      return [
        {
          id: "ph-1",
          title: "",
          desc: "",
          src: ProjectThumb as StaticImageData,
          alt: "project placeholder",
        },
        {
          id: "ph-2",
          title: "",
          desc: "",
          src: ProjectThumb as StaticImageData,
          alt: "project placeholder",
        },
        {
          id: "ph-3",
          title: "",
          desc: "",
          src: ProjectThumb as StaticImageData,
          alt: "project placeholder",
        },
      ];
    }

    return active.map<HeroSlide>((s) => {
      const rawImage = s.image || "";
      const src =
        toCdnSrc(rawImage, 1440, 900, "fill") ||
        rawImage ||
        (ProjectThumb as StaticImageData);

      return {
        id: s.id,
        title: (s.title || "").trim(),
        desc: excerpt(s.description || "", 260),
        src,
        alt: s.alt || s.title || "hero slide",
        buttonText: (s.buttonText || "").trim() || undefined,
        buttonLink: (s.buttonLink || "").trim() || undefined,
      };
    });
  }, [sliderList]);

  const [activeIdx, setActiveIdx] = useState(0);
  const current = slides[activeIdx] || slides[0];

  // Başlık & paragraf – önce slider title/desc, yoksa UI fallback
  const h2Text =
    (current?.title || "").trim() ||
    ui(
      "ui_hero_title_fallback",
      "Industrial cooling tower solutions tailored to your process.",
    );

  const text =
    (current?.desc || "").trim() ||
    ui(
      "ui_hero_desc_fallback",
      "We design, install and maintain high-efficiency cooling tower systems for power plants, industrial facilities and commercial buildings.",
    );

  // CTA metni + link
  const ctaText =
    current?.buttonText ||
    ui("ui_hero_cta", "Teklif Al");

  const rawLink =
    current?.buttonLink ||
    "/contact";

  const normalizedLink = rawLink.startsWith("/")
    ? rawLink
    : `/${rawLink}`;

  const ctaHref = localizePath(locale, normalizedLink);

  return (
    <section
      className="hero__area hero__hight d-flex align-items-center p-relative"
      style={{
        paddingTop: 40,
        paddingBottom: 40,
        minHeight: "min(78vh, 820px)",
      }}
    >
      {/* Dekoratif şekiller */}
      <div className="hero__shape-3">
        <Image
          src={ShapeA}
          alt=""
          sizes="(min-width: 1200px) 20vw, 25vw"
          loading="lazy"
        />
      </div>
      <div className="hero__shape-4">
        <Image
          src={ShapeB}
          alt=""
          sizes="(min-width: 1200px) 18vw, 22vw"
          loading="lazy"
        />
      </div>

      <div className="container-fluid">
        <div
          className="hero__main-wrapper"
          style={{ maxWidth: "100%", width: "100%" }}
        >
          <div className="row g-0 align-items-stretch">
            {/* SLIDER (sağ) */}
            <div className="col-12 col-lg-5 d-flex order-1 order-lg-2">
              <div className="hero__thumb-wrapper mb-0 w-100 h-100">
                <div className="hero__shape-1">
                  <Image className="parallaxed" src={Dot} alt="" loading="lazy" />
                </div>
                <div className="hero__shape-2">
                  <Image className="parallaxed" src={Dot} alt="" loading="lazy" />
                </div>

                <div className="project__active w-100 h-100">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={20}
                    loop={slides.length > 1}
                    roundLengths
                    modules={[Autoplay, Navigation]}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    navigation={{
                      nextEl: ".recent-2__button-next",
                      prevEl: ".recent-2__button-prev",
                    }}
                    className="recent__slider-active-3"
                    style={{ width: "100%" }}
                    onSlideChange={(sw) => {
                      const real = sw?.realIndex ?? 0;
                      setActiveIdx(
                        slides.length ? real % slides.length : 0,
                      );
                    }}
                  >
                    {slides.map((s, i) => (
                      <SwiperSlide key={s.id}>
                        <div
                          className="project__item"
                          style={{ width: "100%" }}
                        >
                          <div
                            className="projet__thumb w-img"
                            style={{ width: "100%" }}
                          >
                            <Image
                              src={s.src as any}
                              alt={s.alt}
                              width={1440}
                              height={900}
                              sizes="(min-width: 1200px) 45vw, 100vw"
                              priority={i === 0}
                              loading={i === 0 ? undefined : "lazy"}
                              style={{
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {slidersLoading && (
                  <div className="skeleton-line mt-10" aria-hidden />
                )}
              </div>
            </div>

            {/* METİN (sol) */}
            <div className="col-12 col-lg-7 d-flex order-2 order-lg-1">
              <div
                className="hero__content-wrapper d-flex flex-column h-100 w-100"
                style={{ paddingRight: 24 }}
              >
                <div
                  className="hero__content"
                  style={{ paddingTop: 32, paddingBottom: 16 }}
                >
                  <span
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    {ui("ui_hero_kicker_prefix", "Ensotek")}{" "}
                    <span>
                      {ui("ui_hero_kicker_brand", "Engineering")}
                    </span>
                  </span>

                  <h2
                    data-aos="fade-up"
                    data-aos-delay="500"
                    style={{ lineHeight: 1.1, marginTop: 10 }}
                  >
                    {h2Text}
                  </h2>

                  <p
                    data-aos="fade-up"
                    data-aos-delay="600"
                    style={{ maxWidth: 720 }}
                  >
                    {text}
                  </p>
                </div>

                <div
                  className="d-flex align-items-center gap-3 mt-auto"
                  data-aos="fade-up"
                  data-aos-delay="800"
                  style={{ paddingTop: 8 }}
                >
                  <div className="project__navigation d-flex align-items-center gap-2">
                    <button
                      className="recent-2__button-prev"
                      aria-label={ui("ui_hero_prev", "Previous slide")}
                      type="button"
                    >
                      <FiChevronLeft />
                    </button>
                    <button
                      className="recent-2__button-next"
                      aria-label={ui("ui_hero_next", "Next slide")}
                      type="button"
                    >
                      <FiChevronRight />
                    </button>
                  </div>

                  <Link
                    href={ctaHref}
                    className="cta__btn"
                    aria-label={ctaText}
                  >
                    {ctaText}
                  </Link>
                </div>
              </div>
            </div>
            {/* /METİN */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
