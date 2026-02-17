"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { reviewsService } from "@/features/reviews/reviews.service";
import type { CreateReviewRequest } from "@/features/reviews/reviews.type";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type FeedbackSlide = {
  id: string;
  comment: string;
  customer_name: string;
  rating: number;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim().toLowerCase());
}

function clampRating(n: number): number {
  const x = Number(n);
  if (!Number.isFinite(x)) return 5;
  return Math.max(1, Math.min(5, x));
}

const FeedbackOne = () => {
  const t = useTranslations("ensotek.feedback");
  const c = useTranslations("common");

  const { data: reviews, isLoading } = useQuery({
    queryKey: queryKeys.reviews.list({ is_active: true, is_approved: true, limit: 10 }),
    queryFn: () => reviewsService.getAll({ is_active: true, is_approved: true, limit: 10 }),
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateReviewRequest) => reviewsService.create(payload),
    onSuccess: () => {
      setSubmitState({ type: "success", message: t("successMessage") });
      setFormName("");
      setFormEmail("");
      setFormRating(5);
      setFormComment("");
    },
    onError: () => {
      setSubmitState({ type: "error", message: t("errorGeneric") });
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [submitState, setSubmitState] = useState<
    { type: "idle" } | { type: "success"; message: string } | { type: "error"; message: string }
  >({ type: "idle" });

  const hasReviews = Array.isArray(reviews) && reviews.length > 0;

  const staticReviews: FeedbackSlide[] = [
    {
      id: "1",
      comment: t("staticReviewComment"),
      customer_name: "Neal Kapur",
      rating: 5,
    },
    {
      id: "2",
      comment: t("staticReviewComment"),
      customer_name: "Neal Kapur",
      rating: 5,
    },
    {
      id: "3",
      comment: t("staticReviewComment"),
      customer_name: "Neal Kapur",
      rating: 5,
    },
  ];

  const displayReviews: FeedbackSlide[] = useMemo(() => {
    if (!hasReviews) return staticReviews;
    return reviews.map((r) => ({
      id: r.id,
      comment: r.comment || "",
      customer_name: r.name || t("anonymous"),
      rating: clampRating(r.rating || 5),
    }));
  }, [hasReviews, reviews, t]);

  const canSubmit =
    formName.trim().length > 0 &&
    isValidEmail(formEmail) &&
    formComment.trim().length > 0 &&
    !createMutation.isPending;

  const renderStars = (rating: number) => (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < clampRating(rating);
        return <Star key={`star-${i}`} size={16} className={filled ? "is-filled" : "is-empty"} />;
      })}
    </>
  );

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState({ type: "idle" });

    if (!formName.trim()) {
      setSubmitState({ type: "error", message: t("errorName") });
      return;
    }
    if (!isValidEmail(formEmail)) {
      setSubmitState({ type: "error", message: t("errorEmail") });
      return;
    }
    if (!formComment.trim()) {
      setSubmitState({ type: "error", message: t("errorComment") });
      return;
    }

    await createMutation.mutateAsync({
      target_type: "site",
      target_id: "ensotek",
      name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      rating: clampRating(formRating),
      comment: formComment.trim(),
    });
  };

  return (
    <section className="feedback__area pt-120 pb-60 bg-white">
      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-6 col-lg-6">
            <div className="feedback__content-wrapper mb-60">
              <div className="section__title-wrapper">
                <span className="section__subtitle">
                  <span>Ensotek </span>
                  {t("subtitle")}
                </span>
                <h2 className="section__title mb-30">{t("title")}</h2>
              </div>

              <p>{t("descriptionOne")}</p>
              <p>{t("descriptionTwo")}</p>

              <div className="d-flex flex-wrap gap-3 align-items-center mt-30">
                <div className="feedback__navigation ens-circle-nav">
                  <button className="feedback-3__button-prev ens-circle-arrow" type="button" aria-label={t("prev")}>
                    <ChevronLeft />
                  </button>
                  <button className="feedback-3__button-next ens-circle-arrow" type="button" aria-label={t("next")}>
                    <ChevronRight />
                  </button>
                </div>

                <div className="feedback__write">
                  <button type="button" className="btn btn-primary" onClick={() => setIsOpen(true)}>
                    {t("writeReview")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-lg-6">
            <div className="feedback__right mb-60">
              <div className="feedbacK__content-wrapper">
                <div className="feedback__active">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={displayReviews.length > 1}
                    roundLengths
                    modules={[Autoplay, Navigation]}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    navigation={{
                      nextEl: ".feedback-3__button-next",
                      prevEl: ".feedback-3__button-prev",
                    }}
                    className="feedback__active-three"
                  >
                    {(isLoading ? displayReviews.slice(0, 1) : displayReviews).map((review) => (
                      <SwiperSlide key={review.id}>
                        <div className="feedbacK__content">
                          <div className="feedback__review-icon" aria-hidden="true">
                            {renderStars(review.rating)}
                          </div>
                          <p>{review.comment}</p>
                          <div className="feedback__meta">
                            <div className="feedback__meta-author">
                              <h5>{review.customer_name}</h5>
                              <span>{t("valuedCustomer")}</span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {isLoading ? <div className="skeleton-line mt-10" aria-hidden /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen ? (
        <div
          className="modal-backdrop-custom"
          role="dialog"
          aria-modal="true"
          aria-label={t("modalTitle")}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="modal-card-custom">
            <div className="modal-head-custom">
              <div className="modal-title-custom">{t("modalTitle")}</div>
              <button
                type="button"
                className="btn btn-link modal-close-custom"
                onClick={() => setIsOpen(false)}
                aria-label={c("close")}
                title={c("close")}
              >
                ×
              </button>
            </div>

            <div className="modal-body-custom">
              <form onSubmit={submitReview}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">{t("fieldName")}</label>
                    <input
                      className="form-control"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">{t("fieldEmail")}</label>
                    <input
                      className="form-control"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">{t("fieldRating")}</label>
                    <div className="ens-rating-picker" role="radiogroup" aria-label={t("fieldRating")}>
                      {Array.from({ length: 5 }).map((_, i) => {
                        const val = i + 1;
                        const active = val <= formRating;
                        return (
                          <button
                            key={`rating-${val}`}
                            type="button"
                            className={`ens-rating-star ${active ? "is-active" : ""}`}
                            onClick={() => setFormRating(val)}
                            aria-label={`${val}/5`}
                            aria-pressed={active}
                          >
                            <Star size={16} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">{t("fieldComment")}</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <div className="d-flex gap-2 justify-content-end">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>
                        {c("close")}
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                        {createMutation.isPending ? t("sending") : c("submit")}
                      </button>
                    </div>
                  </div>

                  {submitState.type === "success" ? (
                    <div className="col-12">
                      <div className="alert alert-success mb-0">{submitState.message}</div>
                    </div>
                  ) : null}

                  {submitState.type === "error" ? (
                    <div className="col-12">
                      <div className="alert alert-danger mb-0">{submitState.message}</div>
                    </div>
                  ) : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default FeedbackOne;
