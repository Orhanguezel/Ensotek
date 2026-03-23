'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '@ensotek/core/services';
import { API_BASE_URL } from '@/lib/utils';

interface Props {
  locale: string;
  title: string;
  subtitle: string;
  placeholder: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  errorMessage: string;
  privacyNote: string;
}

export function NewsletterSection({
  locale,
  title,
  subtitle,
  placeholder,
  submitLabel,
  submittingLabel,
  successMessage,
  errorMessage,
  privacyNote,
}: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await subscribeNewsletter(API_BASE_URL, { email, locale });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="py-(--section-py) bg-linear-to-br from-blue-700 via-blue-600 to-blue-500 text-white overflow-hidden relative">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
          <Mail size={22} className="text-white" />
        </div>

        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{title}</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">{subtitle}</p>

        {status === 'success' ? (
          <div className="bg-white/20 rounded-2xl px-8 py-6 inline-block">
            <p className="font-semibold text-white text-lg">✓ {successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-colors shrink-0"
            >
              {status === 'loading' ? submittingLabel : submitLabel}
              {status !== 'loading' && <ArrowRight size={15} />}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm text-red-200">{errorMessage}</p>
        )}

        <p className="mt-5 text-xs text-blue-200">{privacyNote}</p>
      </div>
    </section>
  );
}
