// =============================================================
// FILE: src/components/common/ReviewList.tsx
// Ortak yorum listesi (public) + reaction/like butonu
// i18n: site_settings.ui_feedback (list_* ve reaction_* key'leri)
// =============================================================

"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useListReviewsPublicQuery,
  useAddReviewReactionPublicMutation,
} from "@/integrations/rtk/endpoints/reviews.public.endpoints";
import type { ReviewDto } from "@/integrations/types/review.types";

// Yeni i18n helper'lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

type ReviewListProps = {
  targetType: string;
  targetId: string;
  locale?: string;
  className?: string;
  showHeader?: boolean;
};

function renderStars(rating: number) {
  const full = Math.round(rating);
  return (
    <span>
      {Array.from({ length: 5 }).map((_, idx) => (
        <span key={idx} style={{ color: idx < full ? "#f5c518" : "#ddd" }}>
          ★
        </span>
      ))}
    </span>
  );
}

const ReviewList: React.FC<ReviewListProps> = ({
  targetType,
  targetId,
  locale: localeProp,
  className,
  showHeader = true,
}) => {
  // FE locale (prop öncelikli)
  const resolvedLocale = useResolvedLocale();
  const locale = (localeProp || resolvedLocale) ?? "en";

  const { ui } = useUiSection("ui_feedback", locale);

  const title = ui(
    "ui_feedback_list_title",
    locale === "tr"
      ? "Müşteri Yorumları"
      : locale === "de"
        ? "Kundenbewertungen"
        : "Customer Reviews",
  );
  const noReviewsText = ui(
    "ui_feedback_list_no_reviews",
    locale === "tr"
      ? "Bu içerik için henüz yorum yok."
      : locale === "de"
        ? "Für diesen Inhalt gibt es noch keine Bewertungen."
        : "There are no reviews for this item yet.",
  );
  const avgRatingLabel = ui(
    "ui_feedback_list_avg_rating",
    locale === "tr"
      ? "Ortalama Puan"
      : locale === "de"
        ? "Durchschnittliche Bewertung"
        : "Average Rating",
  );
  const reviewsSuffix = ui(
    "ui_feedback_list_reviews_suffix",
    locale === "tr"
      ? "yorum"
      : locale === "de"
        ? "Bewertungen"
        : "reviews",
  );
  const helpfulLabel = ui(
    "ui_feedback_list_helpful",
    locale === "tr"
      ? "Faydalı"
      : locale === "de"
        ? "Hilfreich"
        : "Helpful",
  );
  const likeLabel = ui(
    "ui_feedback_list_like",
    locale === "tr"
      ? "Faydalı buldum"
      : locale === "de"
        ? "Als hilfreich markieren"
        : "Mark as helpful",
  );
  const likedLabel = ui(
    "ui_feedback_list_liked",
    locale === "tr"
      ? "Teşekkürler"
      : locale === "de"
        ? "Danke"
        : "Thanks",
  );
  const errorText = ui(
    "ui_feedback_list_error",
    locale === "tr"
      ? "İşlem sırasında bir hata oluştu."
      : locale === "de"
        ? "Beim Vorgang ist ein Fehler aufgetreten."
        : "An error occurred while processing your request.",
  );
  const loadingText = ui(
    "ui_feedback_list_loading",
    locale === "tr"
      ? "Yorumlar yükleniyor..."
      : locale === "de"
        ? "Bewertungen werden geladen..."
        : "Loading reviews...",
  );

  const { data, isLoading, isError } = useListReviewsPublicQuery({
    target_type: targetType,
    target_id: targetId,
    locale,
    approved: true,
    active: true,
    orderBy: "created_at",
    order: "desc",
    limit: 100,
  });

  const [addReaction, { isLoading: isReacting }] =
    useAddReviewReactionPublicMutation();
  const [reactionReviewId, setReactionReviewId] = useState<string | null>(
    null,
  );

  const reviews: ReviewDto[] = data ?? [];

  const stats = useMemo(() => {
    if (!reviews.length) {
      return { avg: 0, count: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return {
      avg: parseFloat((sum / reviews.length).toFixed(2)),
      count: reviews.length,
    };
  }, [reviews]);

  const handleLike = async (review: ReviewDto) => {
    try {
      setReactionReviewId(review.id);
      await addReaction({ id: review.id }).unwrap();
      // RTK invalidate sonrası liste yeniden gelecek, count güncellenir
      toast.success(likedLabel);
    } catch (err) {
      console.error("addReaction error", err);
      toast.error(errorText);
    } finally {
      setReactionReviewId(null);
    }
  };

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-3">
          <h3 className="mb-1">{title}</h3>
          {stats.count > 0 && (
            <div className="d-flex align-items-center gap-2">
              <strong>
                {avgRatingLabel}: {stats.avg.toFixed(1)}/5
              </strong>
              <span className="text-muted">
                {renderStars(stats.avg)} • {stats.count} {reviewsSuffix}
              </span>
            </div>
          )}
        </div>
      )}

      {isLoading && <p>{loadingText}</p>}
      {isError && <p className="text-danger">{errorText}</p>}

      {!isLoading && !isError && reviews.length === 0 && (
        <p className="text-muted">{noReviewsText}</p>
      )}

      <div className="list-group">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="list-group-item mb-2"
            style={{ borderRadius: 4 }}
          >
            <div className="d-flex justify-content-between align-items-start mb-1">
              <div>
                <strong>{r.name}</strong>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {renderStars(r.rating)} • {r.rating}/5
                </div>
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                {new Date(r.created_at).toLocaleDateString(locale)}
              </div>
            </div>

            {r.comment && (
              <p className="mb-2" style={{ whiteSpace: "pre-line" }}>
                {r.comment}
              </p>
            )}

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={isReacting && reactionReviewId === r.id}
                onClick={() => handleLike(r)}
              >
                👍 {helpfulLabel} ({r.helpful_count ?? 0})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
