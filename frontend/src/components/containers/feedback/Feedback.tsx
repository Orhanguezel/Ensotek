// =============================================================
// FILE: src/components/containers/feedback/Feedback.tsx
// Public Feedback / Reviews Slider
// =============================================================
"use client";

import React, { useMemo } from "react";
import Image, { type StaticImageData } from "next/image";

// Placeholder avatar
import AvatarPh from "public/img/feedback/author-1.png";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";

import "swiper/css";

// Icons
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

// RTK – Public reviews
import { useListReviewsPublicQuery } from "@/integrations/rtk/hooks";
import type { ReviewDto } from "@/integrations/types/review.types";

// Ortak yardımcılar
import { excerpt } from "@/shared/text";

// i18n UI
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";


type FeedbackSlide = {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: StaticImageData | string;
  rating: number;
};

const Feedback: React.FC = () => {
  const locale = useResolvedLocale();

  // UI metinleri site_settings.ui_feedback
  const { ui } = useUiSection("ui_feedback", locale);

  // ✅ Public reviews list – varsayılan: aktif + onaylı, minRating=3
  const { data, isLoading } = useListReviewsPublicQuery({
    minRating: 3,
    limit: 10,
    orderBy: "display_order",
    order: "asc",
    locale,
  });

  // Slider veri modeli
  const slides: FeedbackSlide[] = useMemo(() => {
    const list: ReviewDto[] = Array.isArray(data) ? data : [];

    if (!list.length) {
      // Basit placeholder'lar (UI metinleri yine key üzerinden)
      return [
        {
          id: "ph-1",
          name: "Jane Cooper",
          role: ui("ui_feedback_role_customer", "Customer"),
          text:
            ui(
              "ui_feedback_placeholder_1",
              "We increased our B2B SaaS client's website traffic by over 300% in just 3 months.",
            ),
          avatar: AvatarPh as StaticImageData,
          rating: 5,
        },
        {
          id: "ph-2",
          name: "Devon Lane",
          role: ui("ui_feedback_role_customer", "Customer"),
          text: ui(
            "ui_feedback_placeholder_2",
            "Targeted content + technical SEO gave us consistent, compounding growth across all funnels.",
          ),
          avatar: AvatarPh as StaticImageData,
          rating: 5,
        },
        {
          id: "ph-3",
          name: "Courtney Henry",
          role: ui("ui_feedback_role_customer", "Customer"),
          text: ui(
            "ui_feedback_placeholder_3",
            "Clear reporting and predictable delivery — exactly what we needed to scale.",
          ),
          avatar: AvatarPh as StaticImageData,
          rating: 5,
        },
      ];
    }

    return list.map<FeedbackSlide>((r) => ({
      id: String(r.id),
      name: r.name || ui("ui_feedback_role_customer", "Customer"),
      role: ui("ui_feedback_role_customer", "Customer"),
      text: excerpt(r.comment || "", 280),
      avatar: AvatarPh as StaticImageData, // Şimdilik avatar backend'de yok → placeholder
      rating: Math.max(1, Math.min(5, Number(r.rating || 5))) | 0,
    }));
  }, [data, ui]);

  // Başlıkta "customers" kelimesini (EN fallback) vurgula; diğer dillerde yoksa düz göster.
  const title = ui(
    "ui_feedback_title",
    "What our customers say about us",
  );
  let titleJsx: React.ReactNode = title;
  const m = title.match(/customers/i);
  if (m && m.index !== undefined) {
    const i = m.index;
    const before = title.slice(0, i);
    const word = title.slice(i, i + m[0].length);
    const after = title.slice(i + m[0].length);
    titleJsx = (
      <>
        {before}
        <span className="down__mark-line">{word}</span>
        {after}
      </>
    );
  }

  return (
    <section className="feedback__area pt-120 pb-60 bg-white">
      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {/* SOL METİN */}
          <div className="col-xl-6 col-lg-6">
            <div className="feedback__content-wrapper mb-60">
              <div className="section__title-wrapper">
                <span className="section__subtitle">
                  <span>
                    {ui("ui_feedback_subprefix", "Ensotek")}{" "}
                  </span>
                  {ui("ui_feedback_sublabel", "Customers")}
                </span>
                <h2 className="section__title mb-30">{titleJsx}</h2>
              </div>

              <p>
                {ui(
                  "ui_feedback_paragraph",
                  "Customer feedback helps us continuously improve our engineering and service quality.",
                )}
              </p>

              {/* Swiper okları */}
              <div className="feedback__navigation">
                <button
                  className="feedback-3__button-prev"
                  aria-label={ui(
                    "ui_feedback_prev",
                    "Previous testimonial",
                  )}
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="feedback-3__button-next"
                  aria-label={ui(
                    "ui_feedback_next",
                    "Next testimonial",
                  )}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>

          {/* SAĞ SLIDER */}
          <div className="col-xl-6 col-lg-6">
            <div className="feedback__right mb-60">
              <div
                className="feedbacK__content-wrapper"
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: "0 15px 40px rgba(27,44,94,.08)",
                  padding: 24,
                }}
              >
                <div className="feedback__active">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={slides.length > 1}
                    roundLengths
                    modules={[Autoplay, Navigation]}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    navigation={{
                      nextEl: ".feedback-3__button-next",
                      prevEl: ".feedback-3__button-prev",
                    }}
                    className="feedback__active-three"
                  >
                    {(isLoading ? slides.slice(0, 1) : slides).map((s) => (
                      <SwiperSlide key={s.id}>
                        <div className="feedbacK__content">
                          {/* yıldızlar */}
                          <div
                            className="feedback__review-icon"
                            aria-hidden="true"
                          >
                            {Array.from({ length: s.rating }).map((_, i) => (
                              <FaStar key={`f-${i}`} />
                            ))}
                            {Array.from({ length: 5 - s.rating }).map(
                              (_, i) => (
                                <FaStar
                                  key={`e-${i}`}
                                  style={{ opacity: 0.3 }}
                                />
                              ),
                            )}
                          </div>

                          <p>{s.text}</p>

                          <div className="feedback__meta">
                            <div className="feedback__meta-author">
                              <h5>{s.name}</h5>
                              <span>{s.role}</span>
                            </div>
                            <div className="feedback__meta-thumb">
                              <Image
                                src={(s.avatar as any) || (AvatarPh as any)}
                                alt={`${s.name} avatar`}
                                width={64}
                                height={64}
                                style={{
                                  width: 64,
                                  height: 64,
                                  borderRadius: "50%",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {isLoading && (
                  <div className="skeleton-line mt-10" aria-hidden />
                )}
              </div>
            </div>
          </div>
          {/* /SAĞ */}
        </div>
      </div>
    </section>
  );
};

export default Feedback;
