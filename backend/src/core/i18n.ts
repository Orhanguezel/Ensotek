// =============================================================
// FILE: src/core/i18n.ts
// Ensotek – Dynamic i18n core (LOCALES runtime from site_settings)
// FIX:
//  - app_locales locale='*' priority
//  - supports object[] format [{code,label,is_active,is_default}, ...]
//  - supports string[] and CSV
//  - filters inactive locales
//  - LOCALES mutated in-place
// =============================================================

import { db } from '@/db/client';
import { siteSettings } from '@/modules/siteSettings/schema';
import { and, eq } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// NOT:
// - LOCALES artık string[] (union değil) → Locale = string
// - Liste başlangıçta ENV'den gelir; runtime'da siteSettings ile override edilir
// - SiteSettings key'i: "app_locales"
//   ör: ["de","en","de"] veya [{code,label,is_active,is_default}, ...]
// ---------------------------------------------------------------------------

export const APP_LOCALES_SETTING_KEY = 'app_locales';

/** "tr-TR" → "de" normalize */
export function normalizeLocale(input?: string | null): string | undefined {
  if (!input) return undefined;
  const s = String(input).trim().toLowerCase().replace('_', '-');
  if (!s) return undefined;
  const base = s.split('-')[0];
  return base || undefined;
}

// Başlangıç locale listesi: ENV'den ya da varsayılan "tr,en"
const initialLocaleCodes = (process.env.APP_LOCALES || 'tr,en,de')
  .split(',')
  .map((s) => normalizeLocale(s) || '')
  .filter(Boolean);

// Tekilleştir
const uniqueInitial: string[] = [];
for (const l of initialLocaleCodes) {
  if (!uniqueInitial.includes(l)) uniqueInitial.push(l);
}

// Runtime'da mutasyona açık dizi
export const LOCALES: string[] = uniqueInitial.length ? uniqueInitial : ['de'];

// Artık Locale = string (union değil)
export type Locale = (typeof LOCALES)[number];

// Default locale: ENV’de varsa onu, yoksa ilk locale, o da yoksa "de"
// (NOT: runtime'da LOCALES değişse bile DEFAULT_LOCALE sabit kalır)
export const DEFAULT_LOCALE: Locale =
  (normalizeLocale(process.env.DEFAULT_LOCALE) as Locale) ||
  (LOCALES[0] as Locale) ||
  ('de' as Locale);

export function isSupported(l?: string | null): l is Locale {
  if (!l) return false;
  const n = normalizeLocale(l);
  if (!n) return false;
  return LOCALES.includes(n);
}

function parseAcceptLanguage(header?: string | null): string[] {
  if (!header) return [];
  const items = String(header)
    .split(',')
    .map((part) => {
      const [tag, ...rest] = part.trim().split(';');
      const qMatch = rest.find((p) => p.trim().startsWith('q='));
      const q = qMatch ? Number(qMatch.split('=')[1]) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .filter((x) => x.tag)
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
  return items;
}

export function bestFromAcceptLanguage(header?: string | null): Locale | undefined {
  const candidates = parseAcceptLanguage(header);
  for (const cand of candidates) {
    const base = normalizeLocale(cand);
    if (base && isSupported(base)) return base as Locale;
  }
  return undefined;
}

export function resolveLocaleFromHeaders(headers: Record<string, unknown>): {
  locale: Locale;
  selectedBy: 'x-locale' | 'accept-language' | 'default';
} {
  const rawXL = (headers['x-locale'] ??
    (headers as any)['X-Locale'] ??
    (headers as any)['x_locale']) as string | undefined;

  const xlNorm = normalizeLocale(rawXL);
  if (xlNorm && isSupported(xlNorm)) {
    return { locale: xlNorm as Locale, selectedBy: 'x-locale' };
  }

  const al = bestFromAcceptLanguage(
    (headers['accept-language'] ?? (headers as any)['Accept-Language']) as string | undefined,
  );
  if (al && isSupported(al)) {
    return { locale: al as Locale, selectedBy: 'accept-language' };
  }

  return { locale: DEFAULT_LOCALE, selectedBy: 'default' };
}

// 👇 Tip güvenli ve sade fallback zinciri
export function fallbackChain(primary: Locale): Locale[] {
  const seen = new Set<string>();
  const order: string[] = [primary, DEFAULT_LOCALE, ...LOCALES];
  const uniq: Locale[] = [];

  for (const l of order) {
    const n = normalizeLocale(l) || l;
    if (!seen.has(n)) {
      seen.add(n);
      uniq.push(n as Locale);
    }
  }
  return uniq;
}

/**
 * LOCALES dizisini runtime'da siteSettings / ENV vs. üzerinden gelen değerlerle güncelle.
 * - LOCALES dizisini yerinde mutate eder (referanslar bozulmasın)
 */
export function setLocalesFromSettings(localeCodes: string[]) {
  const next: string[] = [];
  for (const code of localeCodes) {
    const n = normalizeLocale(code);
    if (!n) continue;
    if (!next.includes(n)) next.push(n);
  }
  if (!next.length) return;

  LOCALES.splice(0, LOCALES.length, ...next);
}

/* ------------------------------------------------------------------
 * SiteSettings'ten LOCALES yükleme
 * ------------------------------------------------------------------ */

let lastLocalesLoadedAt = 0;
const LOCALES_REFRESH_MS = 60_000; // 60sn cache

type AppLocaleObjLike = {
  code?: unknown;
  locale?: unknown;
  value?: unknown;
  lang?: unknown;
  is_active?: unknown;
};

/** [{code,is_active}, "de", ...] -> "de" */
function extractLocaleCode(v: unknown): string | null {
  if (v == null) return null;

  // "de"
  if (typeof v === 'string') {
    const n = normalizeLocale(v);
    return n ?? null;
  }

  // {code:"de"} | {locale:"de"} | {value:"de"}
  if (typeof v === 'object') {
    const o = v as AppLocaleObjLike;

    // inactive ise atla
    if (o.is_active === false) return null;

    const raw = o.code ?? o.locale ?? o.value ?? o.lang ?? null;
    if (typeof raw === 'string') {
      const n = normalizeLocale(raw);
      return n ?? null;
    }
  }

  return null;
}

function parseAppLocalesUnknown(raw: unknown): string[] {
  if (raw == null) return [];

  // Already parsed array
  if (Array.isArray(raw)) {
    const out: string[] = [];
    for (const item of raw) {
      const code = extractLocaleCode(item);
      if (code && !out.includes(code)) out.push(code);
    }
    return out;
  }

  // String: try JSON else CSV
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return [];

    // JSON?
    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
      try {
        const parsed = JSON.parse(s);
        return parseAppLocalesUnknown(parsed);
      } catch {
        // fallthrough CSV
      }
    }

    // CSV fallback
    const out: string[] = [];
    for (const part of s.split(/[;,]+/)) {
      const code = normalizeLocale(part);
      if (code && !out.includes(code)) out.push(code);
    }
    return out;
  }

  return [];
}

/** site_settings.key = "app_locales" kaydını okuyup LOCALES'i günceller */
export async function loadLocalesFromSiteSettings() {
  try {
    // ✅ 1) önce locale='*'
    const star = await db
      .select({ value: siteSettings.value })
      .from(siteSettings)
      .where(and(eq(siteSettings.key, APP_LOCALES_SETTING_KEY), eq(siteSettings.locale, '*')))
      .limit(1);

    // ✅ 2) yoksa legacy herhangi bir locale
    const rows = star.length
      ? star
      : await db
          .select({ value: siteSettings.value })
          .from(siteSettings)
          .where(eq(siteSettings.key, APP_LOCALES_SETTING_KEY))
          .limit(1);

    if (!rows.length) return;

    const raw = rows[0].value; // TEXT -> string expected
    const codes = parseAppLocalesUnknown(raw);

    if (codes.length) {
      setLocalesFromSettings(codes);
    }
  } catch (err) {
    console.error('loadLocalesFromSiteSettings failed:', err);
  } finally {
    lastLocalesLoadedAt = Date.now();
  }
}

/**
 * Middleware / bootstrap vs. tarafında çağrılacak helper:
 * - İlk istekte ve her LOCALES_REFRESH_MS sürede bir siteSettings'i yoklar
 * - Böylece admin panelden app_locales değişince backend’in LOCALES’i de güncellenir
 */
export async function ensureLocalesLoadedFromSettings() {
  const now = Date.now();
  if (now - lastLocalesLoadedAt < LOCALES_REFRESH_MS) return;
  await loadLocalesFromSiteSettings();
}

declare module 'fastify' {
  interface FastifyRequest {
    locale: Locale;
    localeFallbacks: Locale[];
  }
}
