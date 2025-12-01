import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/choose/01.png";
import Two from "public/img/choose/02.png";
import Three from "public/img/choose/03.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";

const ChooseOne = () => {
  return (
    <section className="choose__area pt-120">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6 col-lg-7">
            <div className="section__title-wrapper mb-40">
              <div className="section__subtitle-3">
                <span>WHY CHOOSE US</span>
              </div>
              <div className="section__title-3">
                Our Mission is to change Your View for SEO
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-5">
            <div className="choouse__pagination-wrapper text-lg-end">
              <div className="choose__pagination"></div>
            </div>
          </div>
        </div>
        <div className="row " data-aos="fade-up" data-aos-delay="300">
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
                      768: {
                        slidesPerView: 2,
                      },

                      1200: {
                        slidesPerView: 3,
                      },
                    }}
                  >
                    <SwiperSlide>
                      <div className="swiper-slide">
                        <div className="choose__features">
                          <div className="choose__features-icon">
                            <Image src={One} alt="image not found" />
                          </div>
                          <div className="choose__features-content">
                            <h3>
                              <Link href="/about">Free Cash Withdraw</Link>
                            </h3>
                            <p>
                              Lorem ipsum dummy text dolor best amet console
                              procedez now!
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="swiper-slide">
                        <div className="choose__features">
                          <div className="choose__features-icon">
                            <Image src={Two} alt="image not found" />
                          </div>
                          <div className="choose__features-content">
                            <h3>
                              <Link href="/about">Crypto Support</Link>
                            </h3>
                            <p>
                              Lorem ipsum dummy text dolor best amet console
                              procedez now!
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="swiper-slide">
                        <div className="choose__features">
                          <div className="choose__features-icon">
                            <Image src={Three} alt="image not found" />
                          </div>
                          <div className="choose__features-content">
                            <h3>
                              <Link href="/about">24/7 Customer support</Link>
                            </h3>
                            <p>
                              Lorem ipsum dummy text dolor best amet console
                              procedez now!
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="swiper-slide">
                        <div className="choose__features">
                          <div className="choose__features-icon">
                            <Image src={One} alt="image not found" />
                          </div>
                          <div className="choose__features-content">
                            <h3>
                              <Link href="/about">Free Cash Withdraw</Link>
                            </h3>
                            <p>
                              Lorem ipsum dummy text dolor best amet console
                              procedez now!
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="swiper-slide">
                        <div className="choose__features">
                          <div className="choose__features-icon">
                            <Image src={Two} alt="image not found" />
                          </div>
                          <div className="choose__features-content">
                            <h3>
                              <Link href="/about">Crypto Support</Link>
                            </h3>
                            <p>
                              Lorem ipsum dummy text dolor best amet console
                              procedez now!
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="swiper-slide">
                        <div className="choose__features">
                          <div className="choose__features-icon">
                            <Image src={Three} alt="image not found" />
                          </div>
                          <div className="choose__features-content">
                            <h3>
                              <Link href="/about">24/7 Customer support</Link>
                            </h3>
                            <p>
                              Lorem ipsum dummy text dolor best amet console
                              procedez now!
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
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
