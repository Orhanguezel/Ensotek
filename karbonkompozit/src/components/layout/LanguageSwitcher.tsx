'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

const LOCALE_META: Record<string, { label: string; flag: string }> = {
  tr: { label: 'Türkçe', flag: '🇹🇷' },
  en: { label: 'English', flag: '🇬🇧' },
};

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const locales = Object.keys(LOCALE_META);
  if (locales.length <= 1) return null;

  function switchLocale(next: string) {
    const segments = pathname.split('/');
    if (segments[1] && segments[1] in LOCALE_META) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join('/') || '/');
  }

  return (
    <div className="relative group" suppressHydrationWarning>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline">{LOCALE_META[locale]?.flag}</span>
      </button>
      <div
        className="invisible absolute right-0 top-full w-36 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-2 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100"
        suppressHydrationWarning
      >
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => switchLocale(l)}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
              l === locale
                ? 'bg-[var(--color-bg-muted)] font-medium text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]'
            }`}
          >
            <span>{LOCALE_META[l]?.flag}</span>
            <span>{LOCALE_META[l]?.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
