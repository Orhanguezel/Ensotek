'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { createReview } from '@ensotek/core/services';
import { API_BASE_URL } from '@/lib/utils';

interface Labels {
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
}

interface Props {
  targetType: 'product' | 'service' | 'custom_page';
  targetId: string;
  locale: string;
  labels: Labels;
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5';

export function ReviewForm({ targetType, targetId, locale, labels }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setStatus('loading');
    try {
      await createReview(API_BASE_URL, {
        target_type: targetType,
        target_id: targetId,
        name,
        email,
        rating,
        title: title || undefined,
        comment,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h4 className="font-display text-lg font-bold text-slate-900 mb-2">{labels.successTitle}</h4>
        <p className="text-slate-500 text-sm">{labels.successDetail}</p>
      </div>
    );
  }

  const displayRating = hovered || rating;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h4 className="font-display text-lg font-bold text-slate-900 mb-5">{labels.formTitle}</h4>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Star picker */}
        <div>
          <label className={labelCls}>{labels.ratingLabel} <span className="text-red-500">*</span></label>
          <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onClick={() => setRating(star)}
                className={`text-2xl leading-none transition-colors focus:outline-none ${
                  star <= displayRating ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'
                }`}
                aria-label={`${star} Stern${star > 1 ? 'e' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{labels.nameLabel} <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={labels.namePlaceholder}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{labels.emailLabel} <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={labels.emailPlaceholder}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>{labels.titleLabel}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={labels.titlePlaceholder}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>{labels.commentLabel} <span className="text-red-500">*</span></label>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={labels.commentPlaceholder}
            className={`${inputCls} resize-none`}
          />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{labels.errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || rating === 0}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start px-7 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={14} />
          {status === 'loading' ? labels.submittingLabel : labels.submitLabel}
        </button>
      </form>
    </div>
  );
}
