'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { AVAILABLE_LOCALES } from '@/i18n/locales';
import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const LOCALE_META: Record<string, { flag: string; label: string }> = {
  de: { flag: '🇩🇪', label: 'Deutsch' },
  en: { flag: '🇬🇧', label: 'English' },
  tr: { flag: '🇹🇷', label: 'Türkçe' },
};

interface LanguageSwitcherProps {
  iconOnly?: boolean;
  variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ iconOnly = false, variant = 'light' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSwitch = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setOpen(false);
  };

  const current = LOCALE_META[locale] ?? { flag: '🌐', label: locale.toUpperCase() };

  if (AVAILABLE_LOCALES.length <= 1) return null;

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
          isDark
            ? 'text-slate-300 hover:bg-white/10 hover:text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        )}
      >
        <span className="text-base leading-none">{current.flag}</span>
        {!iconOnly && <span>{current.label}</span>}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[130px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {AVAILABLE_LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSwitch(loc)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-slate-50"
            >
              <span className="text-base leading-none">{LOCALE_META[loc]?.flag ?? '🌐'}</span>
              <span className="flex-1 text-left text-slate-700">
                {LOCALE_META[loc]?.label ?? loc.toUpperCase()}
              </span>
              {locale === loc && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
