'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function OfferFormClient({
  locale,
  preselectedProduct,
}: {
  locale: string;
  preselectedProduct?: string;
}) {
  const t = useTranslations('offer.form');
  const tc = useTranslations('common');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post('/offers', {
        name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        company: fd.get('company'),
        product_interest: fd.get('product_interest'),
        quantity: fd.get('quantity'),
        deadline: fd.get('deadline'),
        message: fd.get('details'),
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
    <form onSubmit={handleSubmit} className="surface-card space-y-4 rounded-xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder={tc('name')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="email"
          type="email"
          required
          placeholder={tc('email')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="phone"
          placeholder={tc('phone')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="company"
          placeholder={tc('company')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
      </div>
      <input
        name="product_interest"
        defaultValue={preselectedProduct || ''}
        placeholder={t('productInterest')}
        className="field-input w-full rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="quantity"
          placeholder={t('quantity')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="deadline"
          placeholder={t('deadline')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
      </div>
      <textarea
        name="details"
        rows={5}
        placeholder={t('detailsPlaceholder')}
        className="field-input w-full rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={sending}
        className="btn-primary w-full rounded-lg px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {sending ? tc('loading') : t('submit')}
      </button>
    </form>
  );
}
