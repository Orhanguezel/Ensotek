'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8086/api';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string; // honeypot — must stay empty
}

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState, t: ReturnType<typeof useTranslations<'contact'>>): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = t('errorMinName');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = t('errorEmail');
  if (f.phone.trim().length < 5) e.phone = t('errorPhone');
  if (f.subject.trim().length < 3) e.subject = t('errorSubject');
  if (f.message.trim().length < 10) e.message = t('errorMessage');
  return e;
}

export function ContactForm() {
  const t = useTranslations('contact');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (form.website) return;

    const errs = validate(form, t);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          website: form.website,
        }),
      });

      if (!res.ok) throw new Error(`${res.status}`);

      setStatus('success');
      setForm(EMPTY);
      toast.success(t('success'));
    } catch {
      setStatus('idle');
      toast.error(t('error'));
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
          {t('successTitle')}
        </h3>
        <p className="text-slate-500 max-w-sm">{t('successBody')}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-semibold text-blue-600 hover:underline"
        >
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  const inputBase =
    'w-full px-4 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  const inputNormal = `${inputBase} border-slate-200 hover:border-slate-300`;
  const inputError = `${inputBase} border-red-300 focus:ring-red-400`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set('website')}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        autoComplete="off"
      />

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('name')} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Max Mustermann"
            autoComplete="name"
            className={errors.name ? inputError : inputNormal}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('phone')} <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="+49 000 0000000"
            autoComplete="tel"
            className={errors.phone ? inputError : inputNormal}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {t('email')} <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="max@beispiel.de"
          autoComplete="email"
          className={errors.email ? inputError : inputNormal}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {t('subject')} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.subject}
          onChange={set('subject')}
          placeholder={t('subjectPlaceholder')}
          className={errors.subject ? inputError : inputNormal}
        />
        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {t('message')} <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={5}
          value={form.message}
          onChange={set('message')}
          placeholder={t('messagePlaceholder')}
          className={`${errors.message ? inputError : inputNormal} resize-none`}
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t('sending')}
          </>
        ) : (
          <>
            <Send size={16} />
            {t('submit')}
          </>
        )}
      </button>

      <p className="text-xs text-slate-400 text-center">{t('privacyNote')}</p>
    </form>
  );
}
