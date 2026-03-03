import type { Review } from '@ensotek/core/types';
import { HelpfulButton } from './HelpfulButton';

interface Props {
  review: Review;
  labels: {
    helpful: string;
    adminReply: string;
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-base leading-none ${i < rating ? 'text-amber-400' : 'text-slate-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ReviewCard({ review, labels }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} />
          </div>
          <p className="font-semibold text-slate-800 text-sm">{review.name}</p>
          <p className="text-xs text-slate-400">{formatDate(review.created_at)}</p>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <p className="font-semibold text-slate-800 text-sm">{review.title}</p>
      )}

      {/* Comment */}
      <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>

      {/* Admin reply */}
      {review.admin_reply && (
        <div className="mt-1 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
          <p className="text-xs font-semibold text-blue-700 mb-1">{labels.adminReply}</p>
          <p className="text-sm text-blue-800">{review.admin_reply}</p>
        </div>
      )}

      {/* Helpful */}
      <div className="pt-1 border-t border-slate-100 flex">
        <HelpfulButton
          reviewId={review.id}
          initialCount={review.helpful_count}
          label={labels.helpful}
        />
      </div>
    </div>
  );
}
