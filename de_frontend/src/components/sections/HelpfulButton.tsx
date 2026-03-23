'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { addReviewReaction } from '@ensotek/core/services';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  reviewId: string;
  initialCount: number;
  label: string;
}

export function HelpfulButton({ reviewId, initialCount, label }: Props) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (voted || loading) return;
    setLoading(true);
    try {
      const res = await addReviewReaction(API_BASE_URL, reviewId);
      setCount(res.helpful_count ?? count + 1);
      setVoted(true);
    } catch {
      setCount((c) => c + 1);
      setVoted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={voted || loading}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
        voted
          ? 'bg-blue-50 border-blue-200 text-blue-600 cursor-default'
          : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <ThumbsUp size={13} />
      {label}
      {count > 0 && <span className="ml-0.5 font-bold">{count}</span>}
    </button>
  );
}
