'use client';

import { useState, useEffect } from 'react';
import { Link2, Check, MessageCircle, Facebook, Linkedin, Twitter } from 'lucide-react';

interface Props {
  path: string;   // e.g. "/de/product/some-slug"
  title: string;  // page title for share text
  labels: {
    title: string;
    copyLink: string;
    copied: string;
  };
}

export function SocialShareCard({ path, title, labels }: Props) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const getUrl = () => `${origin}${path}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const encoded = encodeURIComponent;

  const shares = [
    {
      label: 'WhatsApp',
      Icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      href: () => `https://wa.me/?text=${encoded(`${title} ${getUrl()}`)}`,
    },
    {
      label: 'Facebook',
      Icon: Facebook,
      color: 'bg-[#1877f2] hover:bg-[#166fe5]',
      href: () => `https://www.facebook.com/sharer/sharer.php?u=${encoded(getUrl())}`,
    },
    {
      label: 'LinkedIn',
      Icon: Linkedin,
      color: 'bg-[#0a66c2] hover:bg-[#0959aa]',
      href: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encoded(getUrl())}`,
    },
    {
      label: 'X',
      Icon: Twitter,
      color: 'bg-slate-900 hover:bg-slate-700',
      href: () => `https://x.com/intent/tweet?url=${encoded(getUrl())}&text=${encoded(title)}`,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-4">
      <h3 className="font-display text-base font-bold text-slate-900">{labels.title}</h3>

      <div className="flex gap-2 flex-wrap">
        {shares.map(({ label, Icon, color, href }) => (
          <a
            key={label}
            href={href()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors ${color}`}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
      >
        {copied ? (
          <>
            <Check size={15} className="text-green-500" />
            <span className="text-green-600 font-medium">{labels.copied}</span>
          </>
        ) : (
          <>
            <Link2 size={15} />
            {labels.copyLink}
          </>
        )}
      </button>
    </div>
  );
}
