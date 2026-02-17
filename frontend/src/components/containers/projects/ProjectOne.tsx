"use client";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { productsService } from "@/features/products/products.service";
import { ChevronLeft, ChevronRight } from "lucide-react";

import FallbackOne from "public/img/recent/slider/1.png";
import FallbackTwo from "public/img/recent/slider/2.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";

const fallbackSlides = [FallbackOne, FallbackTwo, FallbackOne, FallbackTwo, FallbackOne, FallbackTwo];

const ProjectOne = () => {
  const t = useTranslations("ensotek.productsShowcase");

  const { data: products, isLoading } = useQuery({
    queryKey: queryKeys.products.list({ is_featured: true }),
    queryFn: () => productsService.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });

  const hasProducts = products && products.length > 0;

  return (
    <div className="recent__area pb-120">
      <div className="container">
        <div className="recent__intro__inner mb-60">
          <div className="row align-items-end">
            <div className="col-xl-6 col-lg-6">
              <div className="recent__intro">
                <div className="section__title-wrapper">
                  <div className="section__title-3 mb-15">
                    {t("title")}
                  </div>
                  <p>
                    {t("description")}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
                <div className="recent__right">
                  <div className="recent__view-btn">
                    <Link className="recent__btn" href="/product">
                    {t("viewAll")}<span> {t("productsLabel")}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30.5"
                      height="11"
                      viewBox="0 0 30.5 11"
                    >
                      <g
                        id="Group_14479"
                        data-name="Group 14479"
                        transform="translate(-1167.5 -1688)"
                      >
                        <line
                          id="Line_48"
                          data-name="Line 48"
                          x2="23"
                          transform="translate(1167.5 1693.5)"
                          fill="none"
                          stroke="#3249b3"
                          strokeWidth="1"
                        />
                        <path
                          id="Polygon_2"
                          data-name="Polygon 2"
                          d="M5.5,0,11,9H0Z"
                          transform="translate(1198 1688) rotate(90)"
                          fill="#3249b3"
                        />
                      </g>
                    </svg>
                  </Link>
                </div>
                <div className="recent-navigation">
                  <button className="recent__button-prev" aria-label="Previous">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="recent__button-next" aria-label="Next">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="swiper recent__slider-active">
            <div className="swiper-wrapper">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                roundLengths={true}
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  el: ".recent__sliderpagination",
                  clickable: true,
                }}
                navigation={{
                  nextEl: ".recent__button-next",
                  prevEl: ".recent__button-prev",
                }}
                className="recent__slider-active"
                breakpoints={{
                  768: { slidesPerView: 2 },
                  992: { slidesPerView: 3 },
                }}
              >
                {hasProducts
                  ? products.map((product) => (
                      <SwiperSlide key={product.id}>
                        <div className="swiper-slide">
                          <Link href={`/product/${product.slug}`}>
                            <div className="recent__slider-thumb w-img">
                              {product.image_url ? (
                                <Image
                                  src={product.image_url}
                                  alt={product.alt || product.title}
                                  width={400}
                                  height={300}
                                  style={{ objectFit: "cover", width: "100%", height: "auto" }}
                                />
                              ) : (
                                <Image src={FallbackOne} alt={product.title} />
                              )}
                            </div>
                            <div className="recent__slider-content mt-15">
                              <h4>{product.title}</h4>
                            </div>
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))
                  : fallbackSlides.map((img, i) => (
                      <SwiperSlide key={`fallback-${i}`}>
                        <div className="swiper-slide">
                          <div className="recent__slider-thumb w-img">
                            <Image src={img} alt={t("fallbackAlt")} />
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
  );
};

export default ProjectOne;
