// =============================================================
// AIActionDropdown — AI aksiyonlari dropdown menu
// full | enhance | translate | generate_meta
// =============================================================

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sparkles, Loader2, FileText, Wand2, Languages, Search } from 'lucide-react';
import { useAdminT } from './useAdminT';

export type AIAction = 'full' | 'enhance' | 'translate' | 'generate_meta';

interface AIActionDropdownProps {
  onAction: (action: AIAction) => void;
  loading?: boolean;
  disabled?: boolean;
}

const ACTION_ICONS: Record<AIAction, React.ElementType> = {
  full: FileText,
  enhance: Wand2,
  translate: Languages,
  generate_meta: Search,
};

export function AIActionDropdown({ onAction, loading, disabled }: AIActionDropdownProps) {
  const t = useAdminT('admin.common.ai');

  const actions: { key: AIAction; label: string }[] = [
    { key: 'full', label: t('full', undefined, 'Tam İçerik Oluştur') },
    { key: 'enhance', label: t('enhance', undefined, 'İçeriği Geliştir') },
    { key: 'translate', label: t('translate', undefined, 'Çevir') },
    { key: 'generate_meta', label: t('generateMeta', undefined, 'SEO Meta Oluştur') },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || loading}
          className="border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-300 dark:hover:bg-purple-900/40">
          {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
          {loading ? t('working', undefined, 'AI çalışıyor...') : 'AI'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {actions.map(({ key, label }) => {
          const Icon = ACTION_ICONS[key];
          return (
            <DropdownMenuItem key={key} onClick={() => onAction(key)} disabled={loading}>
              <Icon className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
              {label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
