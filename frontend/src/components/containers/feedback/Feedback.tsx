// =============================================================
// FILE: src/components/containers/feedback/Feedback.tsx
// Ensotek – Public Feedback / Reviews Slider + Write Review Modal (I18N SAFE) [FINAL]
// - i18n: site_settings.ui_feedback
// - GET: /reviews (public)
// - POST: /reviews (public) via modal
// - Uses existing FEEDBACK SCSS classes (no inline styles)
// - Stars: filled = yellow, empty = black
// - ✅ Does NOT show review id in success message
// - ✅ Prev/Next arrows: circular button style (references gibi)
// =============================================================
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { type StaticImageData } from 'next/image';

// Placeholder avatar
import AvatarPh from 'public/img/feedback/author-1.png';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';

// Icons
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

// RTK – Public reviews
import { useCreateReviewPublicMutation, useListReviewsPublicQuery } from '@/integrations/rtk/hooks';
import type { ReviewCreatePayload, ReviewDto } from '@/integrations/types/review.types';

// Helpers
import { excerpt } from '@/shared/text';

// i18n
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';

type FeedbackSlide = {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: StaticImageData | string;
  rating: number;
};

type Props = {
  target_type?: string;
  target_id?: string;
};

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email || '')
      .trim()
      .toLowerCase(),
  );
}

function clampRating(n: number): number {
  const x = Number(n);
  if (!Number.isFinite(x)) return 5;
  return Math.max(1, Math.min(5, x));
}

/**
 * ui() bazı ortamlarda değer yoksa "key" döndürebiliyor.
 * Bu helper bunu yakalar ve fallback’e düşer.
 */
function safeUiText(
  ui: (k: string, f?: any) => any,
  key: string,
  fallback: string,
  opts?: { maxLen?: number },
): string {
  const fb = String(fallback ?? '').trim();
  const raw = ui(key, fb);
  const s = String(raw ?? '').trim();

  if (!s) return fb;
  if (s === key) return fb;
  if (s.startsWith(key)) return fb;
  if (s.includes('ui_') && s.includes(key)) return fb;
  if (opts?.maxLen && s.length > opts.maxLen) return fb;

  return s;
}

const Feedback: React.FC<Props> = ({ target_type = 'site', target_id = 'ensotek' }) => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection('ui_feedback', locale);

  const { data, isLoading } = useListReviewsPublicQuery({
    minRating: 3,
    limit: 10,
    orderBy: 'display_order',
    order: 'asc',
    locale,
    approved: 1,
    active: 1,
    target_type,
    target_id,
  });

  const [createReview, { isLoading: isCreating }] = useCreateReviewPublicMutation();

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formComment, setFormComment] = useState('');

  const [submitState, setSubmitState] = useState<
    { type: 'idle' } | { type: 'success' } | { type: 'error'; message: string }
  >({ type: 'idle' });

  // ESC ile kapat
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // modal açıkken body scroll kapat
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const slides: FeedbackSlide[] = useMemo(() => {
    const list: ReviewDto[] = Array.isArray(data) ? data : [];

    const roleCustomer = safeUiText(ui as any, 'ui_feedback_role_customer', 'Customer', {
      maxLen: 40,
    });

    if (!list.length) {
      return [
        {
          id: 'ph-1',
          name: 'Jane Cooper',
          role: roleCustomer,
          text: safeUiText(
            ui as any,
            'ui_feedback_placeholder_1',
            "We increased our B2B SaaS client's website traffic by over 300% in just 3 months.",
            { maxLen: 280 },
          ),
          avatar: AvatarPh as StaticImageData,
          rating: 5,
        },
        {
          id: 'ph-2',
          name: 'Devon Lane',
          role: roleCustomer,
          text: safeUiText(
            ui as any,
            'ui_feedback_placeholder_2',
            'Targeted content + technical SEO gave us consistent, compounding growth across all funnels.',
            { maxLen: 280 },
          ),
          avatar: AvatarPh as StaticImageData,
          rating: 5,
        },
        {
          id: 'ph-3',
          name: 'Courtney Henry',
          role: roleCustomer,
          text: safeUiText(
            ui as any,
            'ui_feedback_placeholder_3',
            'Clear reporting and predictable delivery — exactly what we needed to scale.',
            { maxLen: 280 },
          ),
          avatar: AvatarPh as StaticImageData,
          rating: 5,
        },
      ];
    }

    return list.map<FeedbackSlide>((r) => ({
      id: String(r.id),
      name: safeStr(r.name) || roleCustomer,
      role: roleCustomer,
      text: excerpt(safeStr(r.comment), 280),
      avatar: AvatarPh as StaticImageData,
      rating: clampRating(Number(r.rating || 5)) | 0,
    }));
  }, [data, ui]);

  const title = safeUiText(ui as any, 'ui_feedback_title', 'What our customers say about us', {
    maxLen: 120,
  });

  const titleJsx = useMemo(() => {
    const m = title.match(/customers/i);
    if (!m || m.index === undefined) return title;

    const i = m.index;
    const before = title.slice(0, i);
    const word = title.slice(i, i + m[0].length);
    const after = title.slice(i + m[0].length);

    return (
      <>
        {before}
        <span className="down__mark-line">{word}</span>
        {after}
      </>
    );
  }, [title]);

  const t = useMemo(
    () => ({
      subprefix: safeUiText(ui as any, 'ui_feedback_subprefix', 'Ensotek', { maxLen: 40 }),
      sublabel: safeUiText(ui as any, 'ui_feedback_sublabel', 'Customers', { maxLen: 40 }),

      paragraph: safeUiText(
        ui as any,
        'ui_feedback_paragraph',
        'Customer feedback helps us continuously improve our engineering and service quality.',
        { maxLen: 220 },
      ),

      prev: safeUiText(ui as any, 'ui_feedback_prev', 'Previous testimonial', { maxLen: 60 }),
      next: safeUiText(ui as any, 'ui_feedback_next', 'Next testimonial', { maxLen: 60 }),

      writeBtn: safeUiText(ui as any, 'ui_feedback_write_button', 'Write a review', {
        maxLen: 40,
      }),

      // modal
      modalTitle: safeUiText(ui as any, 'ui_feedback_modal_title', 'Write a review', {
        maxLen: 60,
      }),
      close: safeUiText(ui as any, 'ui_common_close', 'Close', { maxLen: 20 }),
      submit: safeUiText(ui as any, 'ui_feedback_submit', 'Submit', { maxLen: 20 }),
      sending: safeUiText(ui as any, 'ui_feedback_sending', 'Sending...', { maxLen: 30 }),

      fName: safeUiText(ui as any, 'ui_feedback_field_name', 'Full Name *', { maxLen: 60 }),
      fEmail: safeUiText(ui as any, 'ui_feedback_field_email', 'Email *', { maxLen: 60 }),
      fRating: safeUiText(ui as any, 'ui_feedback_field_rating', 'Rating *', { maxLen: 60 }),
      fComment: safeUiText(ui as any, 'ui_feedback_field_comment', 'Comment *', { maxLen: 60 }),

      errName: safeUiText(ui as any, 'ui_feedback_error_name', 'Name is required.', {
        maxLen: 120,
      }),
      errEmail: safeUiText(ui as any, 'ui_feedback_error_email', 'Please enter a valid email.', {
        maxLen: 120,
      }),
      errComment: safeUiText(ui as any, 'ui_feedback_error_comment', 'Comment is required.', {
        maxLen: 120,
      }),
      errGeneric: safeUiText(
        ui as any,
        'ui_feedback_error_generic',
        'Could not submit your review. Please try again.',
        { maxLen: 160 },
      ),

      okMsg: safeUiText(
        ui as any,
        'ui_feedback_success',
        'Thank you! Your review has been submitted.',
        { maxLen: 160 },
      ),
    }),
    [ui],
  );

  const openModal = () => {
    setSubmitState({ type: 'idle' });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSubmitState({ type: 'idle' });
  };

  const canSubmit = useMemo(() => {
    const nameOk = safeStr(formName).length > 0;
    const emailOk = isValidEmail(formEmail);
    const commentOk = safeStr(formComment).length > 0;
    return nameOk && emailOk && commentOk && !isCreating;
  }, [formName, formEmail, formComment, isCreating]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState({ type: 'idle' });

    const name = safeStr(formName);
    const email = safeStr(formEmail).toLowerCase();
    const rating = clampRating(formRating);
    const comment = safeStr(formComment);

    if (!name) return setSubmitState({ type: 'error', message: t.errName });
    if (!isValidEmail(email)) return setSubmitState({ type: 'error', message: t.errEmail });
    if (!comment) return setSubmitState({ type: 'error', message: t.errComment });

    const payload: ReviewCreatePayload = {
      target_type,
      target_id,
      locale,
      name,
      email,
      rating,
      comment,
    };

    try {
      await createReview(payload).unwrap();

      setSubmitState({ type: 'success' });

      setFormName('');
      setFormEmail('');
      setFormRating(5);
      setFormComment('');
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.data?.message || err?.error || t.errGeneric;
      setSubmitState({ type: 'error', message: safeStr(msg) || t.errGeneric });
    }
  };

  const renderStars = (rating: number) => {
    const r = clampRating(rating);
    return (
      <>
        {Array.from({ length: 5 }).map((_, i) => {
          const idx = i + 1;
          const filled = idx <= r;
          return <FaStar key={`s-${i}`} className={filled ? 'is-filled' : 'is-empty'} />;
        })}
      </>
    );
  };

  return (
    <section className="feedback__area pt-120 pb-60 bg-white">
      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {/* SOL METİN */}
          <div className="col-xl-6 col-lg-6">
            <div className="feedback__content-wrapper mb-60">
              <div className="section__title-wrapper">
                <span className="section__subtitle">
                  <span>{t.subprefix} </span>
                  {t.sublabel}
                </span>
                <h2 className="section__title mb-30">{titleJsx}</h2>
              </div>

              <p>{t.paragraph}</p>

              <div className="d-flex flex-wrap gap-3 align-items-center mt-30">
                {/* Swiper okları (references gibi dairesel) */}
                <div className="feedback__navigation ens-circle-nav">
                  <button
                    className="feedback-3__button-prev ens-circle-arrow"
                    aria-label={t.prev}
                    type="button"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    className="feedback-3__button-next ens-circle-arrow"
                    aria-label={t.next}
                    type="button"
                  >
                    <FiChevronRight />
                  </button>
                </div>

                {/* Yorum Yaz */}
                <div className="feedback__write">
                  <button type="button" className="btn btn-primary" onClick={openModal}>
                    {t.writeBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ SLIDER */}
          <div className="col-xl-6 col-lg-6">
            <div className="feedback__right mb-60">
              <div className="feedbacK__content-wrapper">
                <div className="feedback__active">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={slides.length > 1}
                    roundLengths
                    modules={[Autoplay, Navigation]}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    navigation={{
                      nextEl: '.feedback-3__button-next',
                      prevEl: '.feedback-3__button-prev',
                    }}
                    className="feedback__active-three"
                  >
                    {(isLoading ? slides.slice(0, 1) : slides).map((s) => (
                      <SwiperSlide key={s.id}>
                        <div className="feedbacK__content">
                          <div className="feedback__review-icon" aria-hidden="true">
                            {renderStars(s.rating)}
                          </div>

                          <p>{s.text}</p>

                          <div className="feedback__meta">
                            <div className="feedback__meta-author">
                              <h5>{s.name}</h5>
                              <span>{s.role}</span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {isLoading && <div className="skeleton-line mt-10" aria-hidden />}
              </div>
            </div>
          </div>
          {/* /SAĞ */}
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className="modal-backdrop-custom"
          role="dialog"
          aria-modal="true"
          aria-label={t.modalTitle}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="modal-card-custom">
            <div className="modal-head-custom">
              <div className="modal-title-custom">{t.modalTitle}</div>

              <button
                type="button"
                className="btn btn-link modal-close-custom"
                onClick={closeModal}
                aria-label={t.close}
                title={t.close}
              >
                ×
              </button>
            </div>

            <div className="modal-body-custom">
              <form onSubmit={submitReview}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">{t.fName}</label>
                    <input
                      className="form-control"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">{t.fEmail}</label>
                    <input
                      className="form-control"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">{t.fRating}</label>
                    <div className="ens-rating-picker" role="radiogroup" aria-label={t.fRating}>
                      {Array.from({ length: 5 }).map((_, i) => {
                        const v = i + 1;
                        const active = v <= formRating;
                        return (
                          <button
                            key={`r-${v}`}
                            type="button"
                            className={`ens-rating-star ${active ? 'is-active' : ''}`}
                            onClick={() => setFormRating(v)}
                            aria-label={`${v}/5`}
                            aria-pressed={active}
                          >
                            <FaStar />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">{t.fComment}</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <div className="d-flex gap-2 justify-content-end">
                      <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        {t.close}
                      </button>

                      <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                        {isCreating ? t.sending : t.submit}
                      </button>
                    </div>
                  </div>

                  {submitState.type === 'success' && (
                    <div className="col-12">
                      <div className="alert alert-success mb-0">{t.okMsg}</div>
                    </div>
                  )}

                  {submitState.type === 'error' && (
                    <div className="col-12">
                      <div className="alert alert-danger mb-0">{submitState.message}</div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* /MODAL */}
    </section>
  );
};

export default Feedback;
