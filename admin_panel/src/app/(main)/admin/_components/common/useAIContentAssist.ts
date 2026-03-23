// =============================================================
// useAIContentAssist — AI destekli icerik olusturma hook'u
// =============================================================

'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

type LocaleContent = {
  locale: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  meta_title: string;
  meta_description: string;
  tags: string;
};

type AIRequest = {
  title?: string;
  summary?: string;
  content?: string;
  tags?: string;
  locale: string;
  target_locales?: string[];
  module_key?: string;
  action: 'enhance' | 'translate' | 'generate_meta' | 'full';
};

type AIResponse = {
  ok: boolean;
  data?: { locales: LocaleContent[] };
  error?: { message: string };
};

export type { LocaleContent, AIRequest };

export function useAIContentAssist() {
  const [loading, setLoading] = useState(false);

  const assist = useCallback(async (req: AIRequest): Promise<LocaleContent[] | null> => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(req),
      });

      const data: AIResponse = await res.json();

      if (!res.ok || !data.ok) {
        toast.error(data.error?.message || 'AI icerik hatasi');
        return null;
      }

      const locales = data.data?.locales;
      if (!locales?.length) {
        toast.error('AI bos yanit dondurdu');
        return null;
      }

      toast.success(`AI ${locales.length} dilde icerik hazirladi`);
      return locales;
    } catch (err: any) {
      toast.error(err.message || 'AI baglanti hatasi');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { assist, loading };
}
