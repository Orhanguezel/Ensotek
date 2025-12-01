// src/lib/settings/hooks.ts
"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useSettingsListQuery } from "./api.client";
import type { SupportedLocale } from "@/types/common";
import { useMemo } from "react";

/** Tek anahtar için value (locale hazır değilse istek atmaz) */
export function useSetting(key: string, locale?: SupportedLocale) {
  const args = locale ? { locale } : (skipToken as any);

  const result = useSettingsListQuery(args, {
    refetchOnMountOrArgChange: false,
    // Seçim: sadece aranan key değişince render tetiklensin
    selectFromResult: ({ data, ...rest }) => {
      const value = (data || []).find((s) => s.key === key)?.value;
      return { value, ...rest };
    },
  });

  return result;
}

/** Birden çok anahtarı {key:value} map olarak döndür (stabil & hızlı) */
export function useSettingsMap(keys: string[], locale?: SupportedLocale) {
  // keys için stabil imza
  const keySig = useMemo(() => (keys && keys.length ? [...new Set(keys)].sort().join("|") : ""), [keys]);

  // keys yoksa &/veya locale yoksa istek atma
  const shouldRun = Boolean(locale && keySig);
  const args = shouldRun ? { locale } : (skipToken as any);

  const result = useSettingsListQuery(args, {
    refetchOnMountOrArgChange: false,
    /**
     * store → sadece ilgilendiğimiz subset dönersek,
     * unrelated setting değişikliklerinde ekstra render olmaz.
     */
    selectFromResult: ({ data, ...rest }) => {
      const mapAll: Record<string, any> = {};
      for (const s of data || []) mapAll[s.key] = s.value ?? s;

      const out: Record<string, any> = {};
      if (keySig) {
        for (const k of keySig.split("|")) if (k && k in mapAll) out[k] = mapAll[k];
      }
      return { map: out, ...rest };
    },
  });

  return result as typeof result & { map: Record<string, any> };
}
