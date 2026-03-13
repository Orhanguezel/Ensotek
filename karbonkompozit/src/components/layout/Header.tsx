'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Menu, X, ChevronDown } from 'lucide-react';
import { localizedPath } from '@/seo';

const ThemeToggle = dynamic(
  () => import('@/components/theme/ThemeToggle').then((m) => m.ThemeToggle),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-8 w-8 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)]" />
    ),
  },
);

const LanguageSwitcher = dynamic(
  () => import('./LanguageSwitcher').then((m) => m.LanguageSwitcher),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-8 w-10 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)]" />
    ),
  },
);

interface MenuItem {
  title?: string;
  url?: string;
  children?: MenuItem[];
  [key: string]: unknown;
}

function normalizeItems(raw: Record<string, unknown>[]): MenuItem[] {
  return raw
    .map((r) => ({
      title: String(r.title ?? r.label ?? ''),
      url: String(r.url ?? r.href ?? '#'),
      children: Array.isArray(r.children) ? normalizeItems(r.children as any) : [],
    }))
    .filter((i) => i.title);
}

export function Header({
  menuItems,
  logoUrl,
  locale,
}: {
  menuItems: Record<string, unknown>[];
  logoUrl: string;
  locale: string;
}) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = normalizeItems(menuItems);

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/95 backdrop-blur-sm"
      suppressHydrationWarning
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href={localizedPath(locale, '/')} className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="MOE Kompozit"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          ) : (
            <span className="text-xl font-bold font-[var(--font-display)]">
              MOE Kompozit
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {items.map((item) => (
            <div key={item.url} className="group relative">
              <Link
                href={item.url!}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                {item.title}
                {(item.children?.length ?? 0) > 0 && (
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                )}
              </Link>
              {(item.children?.length ?? 0) > 0 && (
                <div className="invisible absolute left-0 top-full w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-2 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  {item.children!.map((child) => (
                    <Link
                      key={child.url}
                      href={child.url!}
                      className="block rounded-md px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher locale={locale} />
          <Link
            href={localizedPath(locale, '/offer')}
            className="btn-primary hidden rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:inline-flex"
          >
            {t('offer')}
          </Link>
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-4 lg:hidden">
          <div className="space-y-1">
            {items.map((item) => (
              <div key={item.url}>
                <Link
                  href={item.url!}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.url}
                    href={child.url!}
                    className="block rounded-md px-6 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href={localizedPath(locale, '/offer')}
              className="btn-primary mt-3 block rounded-lg px-4 py-2.5 text-center text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {t('offer')}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
