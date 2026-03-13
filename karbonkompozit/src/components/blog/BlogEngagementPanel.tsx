'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import Script from 'next/script';

import api from '@/lib/axios';

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

declare global {
  interface Window {
    grecaptcha?: {
      ready?: (callback: () => void) => void;
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          theme?: 'light' | 'dark';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

type ReviewItem = {
  id: string;
  name: string;
  comment: string | null;
  created_at?: string;
};

type Props = {
  locale: string;
  postId: string;
  texts: {
    title: string;
    subtitle: string;
    likeButton: string;
    emptyTitle: string;
    emptyText: string;
    formLabel: string;
    formTitle: string;
    formDescription: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    commentPlaceholder: string;
    moderationNote: string;
    submit: string;
    submitSuccess: string;
    submitError: string;
  };
  commonTexts: {
    loading: string;
    error: string;
  };
};

export function BlogEngagementPanel({ locale, postId, texts, commonTexts }: Props) {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const captchaLoadingText = locale.startsWith('en')
    ? 'Security verification is loading...'
    : 'Guvenlik dogrulamasi yukleniyor...';
  const captchaPendingText = locale.startsWith('en')
    ? 'Complete the verification box to submit your comment.'
    : 'Yorumu gondermek icin dogrulama kutusunu tamamlayin.';
  const captchaLoadFailedText = locale.startsWith('en')
    ? 'Security verification could not be loaded. Disable ad blockers and refresh the page.'
    : 'Guvenlik dogrulamasi yuklenemedi. Reklam engelleyiciyi kapatip sayfayi yenileyin.';
  const captchaVerifyFailedText = locale.startsWith('en')
    ? 'Security verification failed.'
    : 'Guvenlik dogrulamasi basarisiz oldu.';
  const captchaRequiredText = locale.startsWith('en')
    ? 'Complete the security verification before submitting your comment.'
    : 'Yorumu gondermeden once guvenlik dogrulamasini tamamlayin.';
  const captchaBypassText = locale.startsWith('en')
    ? 'Local development mode: security verification is bypassed.'
    : 'Yerel gelistirme modunda guvenlik dogrulamasi bypass ediliyor.';

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  const [widgetId, setWidgetId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [locale],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLocalhost) return;
    if (!mounted || !captchaLoaded || widgetId != null) return;
    const container = document.getElementById(`blog-comment-captcha-${postId}`);
    if (!container || container.childElementCount > 0) return;

    const theme =
      document.documentElement.dataset.themeMode === 'dark' ? 'dark' : 'light';

    const renderWidget = () => {
      if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') return;
      const nextWidgetId = window.grecaptcha.render(container, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme,
        callback: (token) => {
          setCaptchaToken(token);
          setCaptchaError(null);
        },
        'expired-callback': () => setCaptchaToken(null),
        'error-callback': () => {
          setCaptchaToken(null);
          setCaptchaError(captchaVerifyFailedText);
        },
      });

      setWidgetId(nextWidgetId);
      setCaptchaError(null);
    };

    let attempts = 0;
    const maxAttempts = 20;
    const attemptRender = () => {
      attempts += 1;
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        if (typeof window.grecaptcha.ready === 'function') {
          window.grecaptcha.ready(renderWidget);
        } else {
          renderWidget();
        }
        return;
      }

      if (attempts >= maxAttempts) {
        setCaptchaError(
          captchaLoadFailedText,
        );
        return;
      }

      timer = window.setTimeout(attemptRender, 250);
    };

    let timer = window.setTimeout(attemptRender, 0);
    return () => window.clearTimeout(timer);
  }, [captchaLoaded, isLocalhost, mounted, postId, widgetId, captchaLoadFailedText, captchaVerifyFailedText]);

  async function loadData() {
    setLoading(true);
    try {
      const [reactionRes, reviewRes] = await Promise.all([
        api.get('/content_reactions/summary', {
          params: { target_type: 'custom_page', target_id: postId },
        }),
        api.get('/reviews', {
          params: {
            target_type: 'custom_page',
            target_id: postId,
            approved: 1,
            active: 1,
            locale,
            orderBy: 'created_at',
            order: 'desc',
            limit: 20,
          },
        }),
      ]);

      setLikes(Number(reactionRes.data?.likes_count ?? 0));
      setComments(Array.isArray(reviewRes.data) ? reviewRes.data : []);
    } catch {
      toast.error(commonTexts.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [locale, postId]);

  async function handleLike() {
    setLiking(true);
    try {
      const res = await api.post('/content_reactions', {
        target_type: 'custom_page',
        target_id: postId,
        type: 'like',
      });
      setLikes(Number(res.data?.likes_count ?? likes + 1));
    } catch {
      toast.error(commonTexts.error);
    } finally {
      setLiking(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);

    try {
      await api.post('/reviews', {
        target_type: 'custom_page',
        target_id: postId,
        locale,
        name: fd.get('name'),
        email: fd.get('email'),
        rating: 5,
        comment: fd.get('comment'),
        captcha_token: isLocalhost ? 'local-dev-bypass' : captchaToken,
      });

      toast.success(texts.submitSuccess);
      (e.target as HTMLFormElement).reset();
      setCaptchaToken(null);
      if (widgetId != null && window.grecaptcha) {
        window.grecaptcha.reset(widgetId);
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : '';
      if (message.includes('captcha_required') || message.includes('captcha_verification_failed')) {
        const nextMessage = captchaRequiredText;
        setCaptchaError(nextMessage);
        toast.error(nextMessage);
      } else {
        toast.error(texts.submitError);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)]">
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          if (isLocalhost) return;
        }}
        onLoad={() => {
          if (isLocalhost) return;
          setCaptchaLoaded(true);
          setCaptchaError(null);
        }}
        onError={() => {
          if (isLocalhost) return;
          setCaptchaError(captchaLoadFailedText);
        }}
      />
      <div className="surface-card rounded-[2rem] p-6 lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              {texts.title}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
              {texts.subtitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleLike}
            disabled={liking}
            className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            <Heart className="size-4" />
            {texts.likeButton} ({likes})
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-sm text-[var(--color-text-secondary)]">{commonTexts.loading}</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <article key={comment.id} className="surface-card-muted rounded-[1.5rem] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[var(--color-text-primary)]">{comment.name}</p>
                  {comment.created_at ? (
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {formatter.format(new Date(comment.created_at))}
                    </p>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {comment.comment}
                </p>
              </article>
            ))
          ) : (
            <div className="surface-card-muted rounded-[1.5rem] p-5">
              <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                <MessageSquare className="size-4" />
                <p className="font-medium">{texts.emptyTitle}</p>
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                {texts.emptyText}
              </p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="surface-card space-y-4 rounded-[2rem] p-6 lg:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            {texts.formLabel}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
            {texts.formTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
            {texts.formDescription}
          </p>
        </div>

        <input
          name="name"
          required
          placeholder={texts.namePlaceholder}
          className="field-input w-full rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <input
          name="email"
          type="email"
          required
          placeholder={texts.emailPlaceholder}
          className="field-input w-full rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />
        <textarea
          name="comment"
          required
          minLength={5}
          rows={5}
          placeholder={texts.commentPlaceholder}
          className="field-input w-full rounded-lg px-4 py-2.5 text-sm focus:border-[var(--color-brand)] focus:outline-none"
        />

        <div className="min-h-[78px]">
          {mounted && !isLocalhost ? (
            <div id={`blog-comment-captcha-${postId}`} className="min-h-[78px]" />
          ) : null}
        </div>

        <p
          className={`text-xs leading-6 ${captchaError ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-muted)]'}`}
          suppressHydrationWarning
        >
          {captchaError || (isLocalhost ? captchaBypassText : !mounted || !widgetId ? captchaLoadingText : !captchaToken ? captchaPendingText : '')}
        </p>

        <p className="text-xs leading-6 text-[var(--color-text-muted)]">
          {texts.moderationNote}
        </p>

        <button
          type="submit"
          disabled={submitting || (!isLocalhost && !captchaToken)}
          className="btn-primary rounded-lg px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {submitting ? commonTexts.loading : texts.submit}
        </button>
      </form>
    </section>
  );
}
