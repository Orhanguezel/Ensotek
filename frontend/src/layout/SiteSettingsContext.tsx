// =============================================================
// FILE: src/layout/SiteSettingsContext.tsx
// Ensotek – Shared site_settings context (layout-level)
// =============================================================

'use client';

import React, { createContext, useContext } from 'react';
import type { SettingValue } from '@/integrations/types';

export type SiteSettingsContextValue = {
  locale: string;
  localeMap: Record<string, SettingValue>;
  globalMap: Record<string, SettingValue>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettingsContextValue;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettingsContext() {
  return useContext(SiteSettingsContext);
}

export function pickSettingValue(
  ctx: SiteSettingsContextValue | null,
  key: string,
): SettingValue | null {
  if (!ctx) return null;
  const a = ctx.localeMap[key];
  if (a !== null && a !== undefined) return a;
  const b = ctx.globalMap[key];
  if (b !== null && b !== undefined) return b;
  return null;
}
