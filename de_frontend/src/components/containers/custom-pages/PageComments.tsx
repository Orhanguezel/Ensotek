"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewFormData } from "@/features/reviews/reviews.schema";
import { useSubmitReview, useReviews } from "@/features/reviews/reviews.action";
import { useTranslations } from "next-intl";

interface PageCommentsProps {
  targetType: string;
  targetId: string;
}

const PageComments = ({ targetType, targetId }: PageCommentsProps) => {
  const t = useTranslations("ensotek.customPage");
  const { data: reviews, isLoading } = useReviews({ target_type: targetType, target_id: targetId, status: 'approved' });
  const submitMutation = useSubmitReview();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      target_type: targetType,
      target_id: targetId,
      rating: 5,
      name: "",
      email: "",
      comment: "",
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    submitMutation.mutate(data, {
      onSuccess: () => {
        reset();
        alert(t("successMessage"));
      },
    });
  };

  return (
    <div className="postbox__comment-wrapper mt-60 pt-60 border-top">
      {/* List Comments */}
      <div className="postbox__comment mb-50">
        <h3 className="postbox__comment-title mb-30">
          {(reviews?.length || 0)} {t("comments")}
        </h3>
        {isLoading ? (
          <div>{t("loading")}</div>
        ) : (
          <ul>
            {reviews?.map((review) => (
              <li key={review.id} className="mb-30">
                <div className="postbox__comment-box d-flex">
                  <div className="postbox__comment-info grow bg-light p-4" style={{ borderRadius: '12px' }}>
                    <div className="postbox__comment-avater-inner d-flex justify-content-between mb-10">
                      <div className="postbox__comment-name">
                        <h5 style={{ margin: 0 }}>{review.name}</h5>
                        {/* <span className="text-muted" style={{ fontSize: '12px' }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span> */}
                      </div>
                      <div className="postbox__comment-rating text-warning">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fa-solid fa-star ${i < review.rating ? "" : "text-muted"}`} style={{ fontSize: '12px' }}></i>
                        ))}
                      </div>
                    </div>
                    <p style={{ margin: 0, color: '#444' }}>{review.comment}</p>
                  </div>
                </div>
              </li>
            ))}
            {reviews?.length === 0 && <p className="text-muted">{t("noComments")}</p>}
          </ul>
        )}
      </div>

      {/* Comment Form */}
      <div className="postbox__comment-form border-top pt-50">
        <h3 className="postbox__comment-form-title mb-30">{t("leaveComment")}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-xxl-12">
              <div className="postbox__comment-input mb-30">
                <textarea 
                    {...register("comment")} 
                    placeholder={t("commentPlaceholder")}
                    className={errors.comment ? "is-invalid form-control" : "form-control"}
                    style={{ minHeight: '150px' }}
                ></textarea>
                {errors.comment && <div className="text-danger small mt-1">{errors.comment.message}</div>}
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6">
              <div className="postbox__comment-input mb-30">
                <input 
                    type="text" 
                    {...register("name")} 
                    placeholder={t("namePlaceholder")} 
                    className={errors.name ? "is-invalid form-control" : "form-control"}
                />
                {errors.name && <div className="text-danger small mt-1">{errors.name.message}</div>}
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6">
              <div className="postbox__comment-input mb-30">
                <input 
                    type="email" 
                    {...register("email")} 
                    placeholder={t("emailPlaceholder")} 
                    className={errors.email ? "is-invalid form-control" : "form-control"}
                />
                {errors.email && <div className="text-danger small mt-1">{errors.email.message}</div>}
              </div>
            </div>
            <div className="col-xxl-12">
                <div className="mb-30">
                    <label className="mr-10 font-weight-bold">{t("ratingLabel")}:</label>
                    <select {...register("rating", { valueAsNumber: true })} className="form-select w-auto d-inline-block shadow-sm">
                        <option value="5">{t("stars5")}</option>
                        <option value="4">{t("stars4")}</option>
                        <option value="3">{t("stars3")}</option>
                        <option value="2">{t("stars2")}</option>
                        <option value="1">{t("star1")}</option>
                    </select>
                </div>
            </div>
            <div className="col-xxl-12">
              <div className="postbox__comment-btn">
                <button 
                    className="solid__btn" 
                    type="submit" 
                    disabled={submitMutation.isPending}
                    style={{ padding: '12px 30px' }}
                >
                  {submitMutation.isPending ? t("submitting") : t("postComment")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageComments;
