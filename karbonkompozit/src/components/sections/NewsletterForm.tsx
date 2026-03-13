'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function NewsletterForm({ locale }: { locale: string }) {
  const t = useTranslations('home.newsletter');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post('/newsletter/subscribe', {
        email: fd.get('email'),
        source: 'kompozit',
        locale,
      });
      toast.success(t('success'));
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error(t('error'));
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
      <input
        name="email"
        type="email"
        placeholder={t('placeholder')}
        className="field-input flex-1 rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        required
      />
      <button
        type="submit"
        disabled={sending}
        className="btn-primary rounded-lg px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {sending ? '...' : t('subscribe')}
      </button>
    </form>
  );
}
