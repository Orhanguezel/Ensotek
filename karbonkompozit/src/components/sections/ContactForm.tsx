'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function ContactFormClient({ locale }: { locale: string }) {
  const t = useTranslations('contact.form');
  const tc = useTranslations('common');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post('/contacts', {
        name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        company: fd.get('company'),
        subject: fd.get('subject'),
        message: fd.get('message'),
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
    <form onSubmit={handleSubmit} className="surface-card space-y-4 rounded-2xl p-6">
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder={t('namePlaceholder')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="email"
          type="email"
          required
          placeholder={t('emailPlaceholder')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="phone"
          placeholder={t('phonePlaceholder')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="company"
          placeholder={t('companyPlaceholder')}
          className="field-input rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
      </div>
      <input
        name="subject"
        placeholder={t('subjectPlaceholder')}
        className="field-input w-full rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder={t('messagePlaceholder')}
        className="field-input w-full rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={sending}
        className="btn-primary rounded-lg px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {sending ? tc('loading') : t('submit')}
      </button>
    </form>
  );
}
