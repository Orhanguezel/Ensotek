'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { applyThemeMode, readThemeMode } from '@/lib/preferences/theme-utils';
import { THEME_STORAGE_KEYS, type ThemeMode } from '@/lib/preferences/theme';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    setMounted(true);
    setMode(readThemeMode());

    function onStorage(event: StorageEvent) {
      if (event.key === THEME_STORAGE_KEYS.mode) {
        setMode(readThemeMode());
      }
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function toggleMode() {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    applyThemeMode(nextMode);
    localStorage.setItem(THEME_STORAGE_KEYS.mode, nextMode);
    setMode(nextMode);
  }

  const isDark = mounted && mode === 'dark';
  const ariaLabel = !mounted
    ? 'Toggle theme'
    : isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode';
  const title = !mounted ? 'Toggle theme' : isDark ? 'Light mode' : 'Dark mode';

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
      aria-label={ariaLabel}
      title={title}
      suppressHydrationWarning
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
