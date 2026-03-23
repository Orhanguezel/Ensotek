import { getReviews } from '@ensotek/core/services';
import { API_BASE_URL } from '@/i18n/locale-settings';
import type { Review } from '@ensotek/core/types';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';

interface Props {
  targetType: 'product' | 'service' | 'custom_page';
  targetId: string;
  locale: string;
  labels: {
    title: string;
    noReviews: string;
    beFirst: string;
    avgRating: string;
    totalReviews: string;
    helpful: string;
    adminReply: string;
    // form labels
    formTitle: string;
    nameLabel: string;
    emailLabel: string;
    ratingLabel: string;
    titleLabel: string;
    commentLabel: string;
    submitLabel: string;
    submittingLabel: string;
    successTitle: string;
    successDetail: string;
    errorMessage: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    titlePlaceholder: string;
    commentPlaceholder: string;
  };
}

function AvgStars({ avg }: { avg: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, avg - i));
        return (
          <span key={i} className={`text-xl leading-none ${fill >= 0.5 ? 'text-amber-400' : 'text-slate-200'}`}>
            ★
          </span>
        );
      })}
    </div>
  );
}

export async function ReviewsSection({ targetType, targetId, locale, labels }: Props) {
  let reviews: Review[] = [];
  let total = 0;

  try {
    const result = await getReviews(API_BASE_URL, {
      target_type: targetType,
      target_id: targetId,
      is_approved: true,
      is_active: true,
      language: locale,
      limit: 20,
    });
    reviews = result.data ?? (result as unknown as Review[]) ?? [];
    total = (result as any).total ?? reviews.length;
  } catch {
    reviews = [];
  }

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="py-(--section-py) bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              {labels.title}
            </h2>
            {reviews.length > 0 && (
              <div className="mt-2 flex items-center gap-3">
                <AvgStars avg={avg} />
                <span className="text-slate-500 text-sm">
                  {avg.toFixed(1)} · {total} {labels.totalReviews}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {reviews.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
                <p className="text-lg mb-1">{labels.noReviews}</p>
                <p className="text-sm">{labels.beFirst}</p>
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  labels={{ helpful: labels.helpful, adminReply: labels.adminReply }}
                />
              ))
            )}
          </div>

          {/* Review form */}
          <div className="lg:col-span-1">
            <ReviewForm
              targetType={targetType}
              targetId={targetId}
              locale={locale}
              labels={{
                formTitle: labels.formTitle,
                nameLabel: labels.nameLabel,
                emailLabel: labels.emailLabel,
                ratingLabel: labels.ratingLabel,
                titleLabel: labels.titleLabel,
                commentLabel: labels.commentLabel,
                submitLabel: labels.submitLabel,
                submittingLabel: labels.submittingLabel,
                successTitle: labels.successTitle,
                successDetail: labels.successDetail,
                errorMessage: labels.errorMessage,
                namePlaceholder: labels.namePlaceholder,
                emailPlaceholder: labels.emailPlaceholder,
                titlePlaceholder: labels.titlePlaceholder,
                commentPlaceholder: labels.commentPlaceholder,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
