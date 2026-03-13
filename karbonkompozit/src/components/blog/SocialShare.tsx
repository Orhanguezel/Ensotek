'use client';

import { useMemo } from 'react';
import { Facebook, Linkedin, Link2, MessageCircleMore } from 'lucide-react';
import { toast } from 'sonner';

type SocialShareProps = {
  url: string;
  title: string;
  texts: {
    label: string;
    copyLink: string;
    copied: string;
    copyError: string;
    buttonTitle: string;
  };
};

export function SocialShare({ url, title, texts }: SocialShareProps) {
  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return [
      {
        name: 'Facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        icon: <Facebook className="size-4" />,
      },
      {
        name: 'Twitter',
        href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        icon: <span className="text-sm font-bold leading-none">X</span>,
      },
      {
        name: 'LinkedIn',
        href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
        icon: <Linkedin className="size-4" />,
      },
      {
        name: 'WhatsApp',
        href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        icon: <MessageCircleMore className="size-4" />,
      },
    ];
  }, [title, url]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(texts.copied);
    } catch {
      toast.error(texts.copyError);
    }
  }

  return (
    <div className="surface-card mt-8 flex flex-wrap items-center gap-3 rounded-[1.5rem] p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
        {texts.label}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {shareLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            title={`${texts.buttonTitle} ${item.name}`}
            aria-label={`${texts.buttonTitle} ${item.name}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
        >
          <Link2 className="size-4" />
          <span>{texts.copyLink}</span>
        </button>
      </div>
    </div>
  );
}
