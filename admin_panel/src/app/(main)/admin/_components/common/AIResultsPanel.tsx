// =============================================================
// AIResultsPanel — AI sonuclarini locale kartlari olarak gosterir
// =============================================================

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { LocaleContent } from './useAIContentAssist';

interface AIResultsPanelProps {
  results: LocaleContent[];
  currentLocale: string;
  onApply: (lc: LocaleContent) => void;
  onClose: () => void;
}

const LOCALE_FLAGS: Record<string, string> = {
  de: '🇩🇪', en: '🇬🇧', tr: '🇹🇷', fr: '🇫🇷', ar: '🇸🇦', ru: '🇷🇺',
};

export function AIResultsPanel({ results, currentLocale, onApply, onClose }: AIResultsPanelProps) {
  const others = results.filter((r) => r.locale !== currentLocale);
  if (!others.length) return null;

  return (
    <div className="border-b bg-purple-50/50 p-3 dark:bg-purple-950/20">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
          AI — Diğer Diller ({others.length})
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((r) => (
          <div key={r.locale} className="rounded-md border bg-background p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase">
                {LOCALE_FLAGS[r.locale] || ''} {r.locale}
              </span>
              <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] text-purple-700 dark:text-purple-300"
                onClick={() => onApply(r)}>
                Bu dile geç
              </Button>
            </div>
            <p className="text-xs font-medium truncate">{r.title}</p>
            {r.summary && <p className="text-[10px] text-muted-foreground line-clamp-2">{r.summary}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
