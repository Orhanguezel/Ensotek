// =============================================================
// FILE: src/components/common/ReviewForm.tsx
// Ortak yorum formu (public) – target_type / target_id bağlı
// i18n: site_settings.ui_feedback (form_* key'leri)
// =============================================================

"use client";

import React, { useMemo, useState, FormEvent } from "react";
import { toast } from "sonner";

import { useCreateReviewPublicMutation } from "@/integrations/rtk/endpoints/reviews.public.endpoints";
import type { ReviewDto } from "@/integrations/types/review.types";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

type ReviewFormProps = {
  targetType: string;
  targetId: string;
  locale?: string;
  className?: string;
  onSubmitted?: (review: ReviewDto) => void;

  /** ✅ yeni: form ilk açılış durumu */
  initialOpen?: boolean;

  /** ✅ yeni: toggle butonu göster/gizle */
  showToggle?: boolean;

  /** ✅ yeni: toggle buton label override */
  toggleLabel?: string;
};

const ReviewForm: React.FC<ReviewFormProps> = ({
  targetType,
  targetId,
  locale: localeProp,
  className,
  onSubmitted,
  initialOpen = false,
  showToggle = true,
  toggleLabel,
}) => {
  // FE locale (prop öncelikli, yoksa resolvedLocale)
  const resolvedLocale = useResolvedLocale();
  const locale = (localeProp || resolvedLocale || "en").split("-")[0];

  // ui_feedback section'ından metinler
  const { ui } = useUiSection("ui_feedback", locale);

  const title = ui(
    "ui_feedback_form_title",
    locale === "tr"
      ? "Yorum bırakın"
      : locale === "de"
        ? "Bewertung abgeben"
        : "Leave a review",
  );

  const openButtonText = useMemo(() => {
    if (toggleLabel && toggleLabel.trim()) return toggleLabel.trim();
    return ui(
      "ui_feedback_form_open",
      locale === "tr"
        ? "Yorum Gönder"
        : locale === "de"
          ? "Bewertung senden"
          : "Write a review",
    );
  }, [toggleLabel, ui, locale]);

  const closeButtonText = ui(
    "ui_feedback_form_close",
    locale === "tr"
      ? "Kapat"
      : locale === "de"
        ? "Schließen"
        : "Close",
  );

  const nameLabel = ui(
    "ui_feedback_form_name_label",
    locale === "tr"
      ? "Adınız"
      : locale === "de"
        ? "Ihr Name"
        : "Your name",
  );

  const emailLabel = ui(
    "ui_feedback_form_email_label",
    locale === "tr"
      ? "E-posta adresiniz"
      : locale === "de"
        ? "E-Mail-Adresse"
        : "Email address",
  );

  const ratingLabel = ui(
    "ui_feedback_form_rating_label",
    locale === "tr"
      ? "Puanınız"
      : locale === "de"
        ? "Ihre Bewertung"
        : "Your rating",
  );

  const commentLabel = ui(
    "ui_feedback_form_comment_label",
    locale === "tr"
      ? "Yorumunuz"
      : locale === "de"
        ? "Ihre Bewertung"
        : "Your review",
  );

  const submitText = ui(
    "ui_feedback_form_submit",
    locale === "tr"
      ? "Yorumu Gönder"
      : locale === "de"
        ? "Bewertung senden"
        : "Submit review",
  );

  const submittingText = ui(
    "ui_feedback_form_submitting",
    locale === "tr"
      ? "Gönderiliyor..."
      : locale === "de"
        ? "Wird gesendet..."
        : "Submitting...",
  );

  const successText = ui(
    "ui_feedback_form_success",
    locale === "tr"
      ? "Yorumunuz alındı, teşekkürler."
      : locale === "de"
        ? "Ihre Bewertung wurde gespeichert. Vielen Dank!"
        : "Your review has been received. Thank you!",
  );

  const errorText = ui(
    "ui_feedback_form_error",
    locale === "tr"
      ? "Yorum gönderilirken bir hata oluştu."
      : locale === "de"
        ? "Beim Senden der Bewertung ist ein Fehler aufgetreten."
        : "An error occurred while submitting your review.",
  );

  const requiredText = ui(
    "ui_feedback_form_required",
    locale === "tr"
      ? "Bu alan zorunludur."
      : locale === "de"
        ? "Dieses Feld ist erforderlich."
        : "This field is required.",
  );

  const [createReview, { isLoading }] = useCreateReviewPublicMutation();

  const [isOpen, setIsOpen] = useState<boolean>(!!initialOpen);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const onBlurField = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const hasError = (field: "name" | "email" | "comment") => {
    if (!touched[field]) return false;
    if (field === "name") return name.trim().length < 2;
    if (field === "email") return !email.includes("@");
    if (field === "comment") return comment.trim().length < 5;
    return false;
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRating(5);
    setComment("");
    setTouched({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, email: true, comment: true });
    if (
      hasError("name") ||
      hasError("email") ||
      hasError("comment") ||
      rating < 1 ||
      rating > 5
    ) {
      return;
    }

    try {
      const payload = {
        target_type: targetType,
        target_id: targetId,
        locale,
        name: name.trim(),
        email: email.trim(),
        rating,
        comment: comment.trim(),
      };

      const result = await createReview(payload).unwrap();
      toast.success(successText);

      resetForm();

      // ✅ gönderim sonrası kapat
      setIsOpen(false);

      onSubmitted?.(result);
    } catch (err) {
      console.error("createReview error", err);
      toast.error(errorText);
    }
  };

  return (
    <div className={className}>
      {/* ✅ Toggle butonu */}
      {showToggle && (
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="mb-0">{title}</h3>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
          >
            {isOpen ? closeButtonText : openButtonText}
          </button>
        </div>
      )}

      {/* Toggle kapalıysa başlığı eski gibi göster */}
      {!showToggle && <h3 className="mb-3">{title}</h3>}

      {/* ✅ Form sadece açılınca render */}
      {isOpen && (
        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">{nameLabel} *</label>
            <input
              type="text"
              className={`form-control ${hasError("name") ? "is-invalid" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => onBlurField("name")}
            />
            {hasError("name") && <div className="invalid-feedback">{requiredText}</div>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">{emailLabel} *</label>
            <input
              type="email"
              className={`form-control ${hasError("email") ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => onBlurField("email")}
            />
            {hasError("email") && <div className="invalid-feedback">{requiredText}</div>}
          </div>

          {/* Rating */}
          <div className="mb-3">
            <label className="form-label">{ratingLabel} (1–5)</label>
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Comment */}
          <div className="mb-3">
            <label className="form-label">{commentLabel} *</label>
            <textarea
              className={`form-control ${hasError("comment") ? "is-invalid" : ""}`}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onBlur={() => onBlurField("comment")}
            />
            {hasError("comment") && <div className="invalid-feedback">{requiredText}</div>}
          </div>

          <div className="d-flex align-items-center gap-2">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? submittingText : submitText}
            </button>

            <button
              type="button"
              className="btn btn-light"
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
              disabled={isLoading}
            >
              {closeButtonText}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
