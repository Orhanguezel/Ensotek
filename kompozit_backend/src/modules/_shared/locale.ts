// src/modules/_shared/locale.ts

import { z } from 'zod';

import {
  LOCALES,
  normalizeLocale,
  ensureLocalesLoadedFromSettings,
  isSupported,
  getRuntimeDefaultLocale,
} from '@/core/i18n';

// Re-export normalizeLocale
export { normalizeLocale };

export type LocaleQueryLike = { locale?: string; default_locale?: string };
export type ResolvedLocales = { locale: string; def: string };

export const LOCALE_SCHEMA = z
  .string()
  .min(2)
  .max(10)
  .regex(/^[a-zA-Z]{2,3}([_-][a-zA-Z0-9]{2,8})?$/, 'invalid_locale');

// ⚠️ Dynamic locales: avoid static enum (LOCALES can change at runtime)
export const LOCALE_ENUM = LOCALE_SCHEMA;



function normalizeLooseLocale(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!s) return null;
  return normalizeLocale(s) || s.toLowerCase();
}

function pickSafeDefault(): string {
  const base = normalizeLocale(getRuntimeDefaultLocale()) || getRuntimeDefaultLocale() || 'de';
  if (LOCALES.includes(base)) return base;
  return LOCALES[0] || 'de';
}

export async function resolveRequestLocales(req: any, query?: LocaleQueryLike): Promise<ResolvedLocales> {
  await ensureLocalesLoadedFromSettings();

  const q = query ?? ((req.query ?? {}) as LocaleQueryLike);
  const reqRaw = normalizeLooseLocale(q.locale) ?? normalizeLooseLocale(req.locale);
  const defRawFromQuery = normalizeLooseLocale(q.default_locale);

  const safeDefault = pickSafeDefault();
  const safeLocale = reqRaw && isSupported(reqRaw) ? reqRaw : safeDefault;
  const safeDef = defRawFromQuery && isSupported(defRawFromQuery) ? defRawFromQuery : safeDefault;

  return { locale: safeLocale, def: safeDef };
}

/**
 * Create operasyonu için locale listesi hazırla
 * ENV'den veya LOCALES array'inden locale listesi alınır
 */
export function getLocalesForCreate(baseLocale: string): string[] {
  const FALLBACK_LOCALES = ['de'];
  const base = normalizeLocale(baseLocale) || 'de';

  // LOCALES array'i mevcut mu kontrol et
  let list = LOCALES && LOCALES.length > 0 ? [...LOCALES] : [...FALLBACK_LOCALES];

  // Base locale listede yoksa ekle
  if (!list.includes(base)) list.unshift(base);

  // Duplicate'leri temizle
  list = Array.from(new Set(list));
  return list;
}
