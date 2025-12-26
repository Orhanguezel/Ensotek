// =============================================================
// FILE: src/modules/siteSettings/service.ts
// Ensotek – SiteSettings Service (FIXED)
// Key fixes:
//  - Always include '*' in fallback chain (global settings).
//  - Normalize locales (trim + lower + de-DE -> de).
//  - Unify global reads via getGlobalSettingValue().
//  - buildLocaleFallbackChain order: requested -> prefix -> effective default -> preferred -> app_locales -> '*'
// =============================================================

import { db } from '@/db/client';
import { siteSettings } from './schema';
import { and, eq, inArray } from 'drizzle-orm';
import { env } from '@/core/env';

// ---------------------------------------------------------------------------
// KEY LISTS
// ---------------------------------------------------------------------------

const SMTP_KEYS = [
  'smtp_host',
  'smtp_port',
  'smtp_username',
  'smtp_password',
  'smtp_from_email',
  'smtp_from_name',
  'smtp_ssl',
] as const;

const STORAGE_KEYS = [
  'storage_driver',
  'storage_local_root',
  'storage_local_base_url',
  'cloudinary_cloud_name',
  'cloudinary_api_key',
  'cloudinary_api_secret',
  'cloudinary_folder',
  'cloudinary_unsigned_preset',
  'storage_cdn_public_base',
  'storage_public_api_base',
] as const;

const GOOGLE_KEYS = ['google_client_id', 'google_client_secret'] as const;

// ---------------------------------------------------------------------------
// COMMON HELPERS
// ---------------------------------------------------------------------------

/**
 * Bu değer "global olmayan" bir locale değildir.
 * site_settings içinde global ayarlar için locale='*' kullanıyoruz.
 */
const GLOBAL_LOCALE = '*' as const;

/**
 * (Opsiyonel) Projede "preferred" locale fallback kullanmak istiyorsan.
 * Not: Ensotek default genelde 'tr' olduğu için burada 'tr' daha mantıklı.
 * Eğer özellikle Almanca öne çıksın istiyorsan 'de' bırakabilirsin.
 */
export const PREFERRED_FALLBACK_LOCALE = 'tr' as const;

const toBool = (v: string | null | undefined): boolean => {
  if (!v) return false;
  const s = v.toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(s);
};

const normalizeStr = (v: string | null | undefined): string | null => {
  if (v == null) return null;
  const trimmed = String(v).trim();
  return trimmed === '' ? null : trimmed;
};

const isNonEmptyString = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;

/** locale normalize: trim + lower; "tr-TR" -> "tr-tr" (candidates üretirken ayrıca prefix alıyoruz) */
function normalizeLocaleLoose(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim().toLowerCase();
  return s ? s : null;
}

/** uniq + normalize (trim/lower) + drop empties */
function uniqLocales(arr: Array<string | null | undefined>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of arr) {
    const s = normalizeLocaleLoose(raw);
    if (!s) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

/**
 * Locale adayları:
 *   exact (de-de) + prefix (de)
 */
export function buildLocaleCandidates(rawLocale?: string | null): string[] {
  const lc = normalizeLocaleLoose(rawLocale);
  if (!lc) return [];
  const langPart = lc.includes('-') ? lc.split('-')[0] : lc;
  return uniqLocales([lc, langPart]);
}

/**
 * DB value alanı TEXT.
 * - JSON primitive ("string"/number/bool) ise primitive string'e indir.
 * - JSON array/object ise JSON string olarak kalır
 */
function normalizeDbValueToString(raw: unknown): string {
  const v = String(raw ?? '');
  try {
    const parsed = JSON.parse(v);
    if (typeof parsed === 'string' || typeof parsed === 'number' || typeof parsed === 'boolean') {
      return String(parsed);
    }
  } catch {
    // plain string
  }
  return v;
}

/**
 * ✅ GLOBAL ayarları tek yerden oku.
 * Öncelik: locale='*' → legacy (herhangi bir locale).
 */
async function getGlobalSettingValue(key: string): Promise<string | null> {
  const star = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(and(eq(siteSettings.key, key), eq(siteSettings.locale, GLOBAL_LOCALE)))
    .limit(1);

  if (star?.[0]?.value != null) return String(star[0].value);

  const anyRow = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);

  return anyRow?.[0]?.value != null ? String(anyRow[0].value) : null;
}

// ---------------------------------------------------------------------------
// LOW-LEVEL READERS (locale-aware)
// ---------------------------------------------------------------------------

type SettingRow = {
  key: string;
  locale: string;
  value: string;
};

async function fetchSettingsRows(opts: {
  keys: readonly string[];
  localeCandidates?: string[] | null;
}): Promise<SettingRow[]> {
  const { keys, localeCandidates } = opts;

  const rows = await db
    .select({
      key: siteSettings.key,
      locale: siteSettings.locale,
      value: siteSettings.value,
    })
    .from(siteSettings)
    .where(
      localeCandidates && localeCandidates.length
        ? and(inArray(siteSettings.key, keys), inArray(siteSettings.locale, localeCandidates))
        : inArray(siteSettings.key, keys),
    );

  return rows.map((r) => ({
    key: String(r.key),
    locale: String(r.locale),
    value: normalizeDbValueToString(r.value as any),
  }));
}

async function loadSettingsMap(opts: {
  keys: readonly string[];
  localeCandidates: string[];
}): Promise<Map<string, string>> {
  const { keys, localeCandidates } = opts;

  const rows = await fetchSettingsRows({ keys, localeCandidates });
  const map = new Map<string, string>();

  for (const key of keys) {
    const sameKey = rows.filter((r) => r.key === key);

    for (const loc of localeCandidates) {
      const hit = sameKey.find((r) => r.locale === loc);
      if (hit) {
        map.set(key, hit.value);
        break;
      }
    }
  }

  return map;
}

async function getFirstNonEmptySetting(opts: {
  key: string;
  localeCandidates: string[];
}): Promise<string | null> {
  const rows = await fetchSettingsRows({
    keys: [opts.key],
    localeCandidates: opts.localeCandidates,
  });

  // localeCandidates sırasına göre seç
  for (const loc of opts.localeCandidates) {
    const hit = rows.find((r) => r.locale === loc);
    const norm = normalizeStr(hit?.value ?? null);
    if (norm) return norm;
  }
  return null;
}

// ---------------------------------------------------------------------------
// LOCALE HELPERS (DB-driven) ✅ FIXED + META
// ---------------------------------------------------------------------------

type AppLocaleItem = {
  code: string;
  label?: string;
  is_default?: boolean;
  is_active?: boolean;
};

function parseAppLocalesValueToCodes(v: unknown): string[] {
  if (v == null) return [];

  if (Array.isArray(v)) {
    const items = v
      .map((x: any) => {
        if (!x) return null;

        if (typeof x === 'string') {
          const code = x.trim();
          if (!code) return null;
          return { code, is_active: true } as AppLocaleItem;
        }

        const code = String(x.code ?? x.value ?? '').trim();
        if (!code) return null;

        const is_active = x.is_active !== false;
        return { code, is_active } as AppLocaleItem;
      })
      .filter(Boolean) as AppLocaleItem[];

    return uniqLocales(items.filter((it) => it.is_active !== false).map((it) => String(it.code)));
  }

  if (typeof v === 'string') {
    const s = v.trim();
    if (!s) return [];

    try {
      const parsed = JSON.parse(s);
      return parseAppLocalesValueToCodes(parsed);
    } catch {
      return uniqLocales(s.split(/[;,]+/).map((x) => x.trim()));
    }
  }

  return [];
}

// META
export type AppLocaleMeta = {
  code: string;
  label: string;
  is_default: boolean;
  is_active: boolean;
};

function parseAppLocalesValueToMeta(v: unknown): AppLocaleMeta[] {
  if (v == null) return [];

  const normalizeOne = (x: any): AppLocaleMeta | null => {
    if (!x) return null;

    if (typeof x === 'string') {
      const code = normalizeLocaleLoose(x);
      if (!code) return null;
      return {
        code,
        label: code.toUpperCase(),
        is_default: false,
        is_active: true,
      };
    }

    const code = normalizeLocaleLoose(String(x.code ?? x.value ?? ''));
    if (!code) return null;

    const label = String(x.label ?? code.toUpperCase()).trim() || code.toUpperCase();
    const is_active = x.is_active !== false;
    const is_default = x.is_default === true || x.isDefault === true;

    return { code, label, is_default, is_active };
  };

  if (Array.isArray(v)) {
    const items = v.map(normalizeOne).filter(Boolean) as AppLocaleMeta[];
    const active = items.filter((it) => it.is_active !== false);

    // default yoksa first'i default yap
    const hasDefault = active.some((it) => it.is_default);
    if (!hasDefault && active.length) active[0] = { ...active[0], is_default: true };

    // uniq by code
    const map = new Map<string, AppLocaleMeta>();
    for (const it of active) map.set(it.code, it);
    return Array.from(map.values());
  }

  if (typeof v === 'string') {
    const s = v.trim();
    if (!s) return [];

    try {
      const parsed = JSON.parse(s);
      return parseAppLocalesValueToMeta(parsed);
    } catch {
      const codes = uniqLocales(s.split(/[;,]+/).map((x) => x.trim()));
      return codes.map((code, i) => ({
        code,
        label: code.toUpperCase(),
        is_default: i === 0,
        is_active: true,
      }));
    }
  }

  return [];
}

/**
 * ✅ app_locales META: GLOBAL ayar
 */
export async function getAppLocalesMeta(): Promise<AppLocaleMeta[]> {
  const raw = await getGlobalSettingValue('app_locales');
  if (!raw) {
    return [{ code: 'tr', label: 'Türkçe', is_default: true, is_active: true }];
  }

  const v: unknown = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  })();

  const metas = parseAppLocalesValueToMeta(v);
  if (metas.length) return metas;

  // minimum fallback
  return [
    { code: 'tr', label: 'Türkçe', is_default: true, is_active: true },
    { code: 'en', label: 'English', is_default: false, is_active: true },
    { code: 'de', label: 'Deutsch', is_default: false, is_active: true },
  ];
}

/**
 * ✅ app_locales codes: tek kaynak META
 */
export async function getAppLocales(_locale?: string | null): Promise<string[]> {
  const metas = await getAppLocalesMeta();
  return uniqLocales(metas.filter((m) => m.is_active !== false).map((m) => m.code));
}

/**
 * ✅ default_locale: GLOBAL ayar.
 * - locale='*' öncelikli
 * - yoksa legacy herhangi bir satır
 * - yoksa "tr"
 */
export async function getDefaultLocale(_locale?: string | null): Promise<string> {
  const raw = await getGlobalSettingValue('default_locale');
  const s = normalizeLocaleLoose(raw);
  return s || 'tr';
}

/**
 * ✅ default_locale'i app_locales meta ile doğrula.
 */
export async function getEffectiveDefaultLocale(): Promise<string> {
  const def = (await getDefaultLocale(null)).trim().toLowerCase();
  const metas = await getAppLocalesMeta();
  const active = metas.filter((m) => m.is_active !== false);

  if (active.some((m) => m.code === def)) return def;

  const fromMeta = active.find((m) => m.is_default)?.code;
  return (fromMeta || active[0]?.code || def || 'tr').trim().toLowerCase();
}

/**
 * ✅ Tek bir yerde locale fallback zinciri üret.
 *
 * Sıra:
 *  1) requested exact (de-de)
 *  2) requested prefix (de)
 *  3) effective default_locale (global)
 *  4) preferred fallback (opsiyonel)
 *  5) app_locales (aktif)
 *  6) '*' (GLOBAL)  <-- KRİTİK
 */
export async function buildLocaleFallbackChain(opts: {
  requested?: string | null;
  preferred?: string; // default PREFERRED_FALLBACK_LOCALE
}): Promise<string[]> {
  const req = normalizeLocaleLoose(opts.requested) || '';
  const preferred = normalizeLocaleLoose(opts.preferred) || PREFERRED_FALLBACK_LOCALE;

  const candidates = buildLocaleCandidates(req);
  const def = await getEffectiveDefaultLocale();
  const appLocales = await getAppLocales(null);

  return uniqLocales([
    candidates[0],
    candidates[1],
    def,
    preferred,
    ...appLocales,
    GLOBAL_LOCALE, // ✅ mutlaka en sonda
  ]);
}

// ---------------------------------------------------------------------------
// SMTP SETTINGS (site_settings only)  ✅ NOTE: SMTP zaten global olabilir; '*' fallback chain ile çalışır
// ---------------------------------------------------------------------------

export type SmtpSettings = {
  host: string | null;
  port: number | null;
  username: string | null;
  password: string | null;
  fromEmail: string | null;
  fromName: string | null;
  secure: boolean;
};

export async function getSmtpSettings(locale?: string | null): Promise<SmtpSettings> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });

  const [host, portStr, username, password, fromEmail, fromName, sslStr] = await Promise.all([
    getFirstNonEmptySetting({ key: 'smtp_host', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_port', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_username', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_password', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_from_email', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_from_name', localeCandidates }),
    getFirstNonEmptySetting({ key: 'smtp_ssl', localeCandidates }),
  ]);

  const port = portStr ? Number(portStr) : null;
  const secure = toBool(sslStr);

  return {
    host: normalizeStr(host),
    port: Number.isFinite(port as any) ? port : null,
    username: normalizeStr(username),
    password: normalizeStr(password),
    fromEmail: normalizeStr(fromEmail),
    fromName: normalizeStr(fromName),
    secure,
  };
}

// ---------------------------------------------------------------------------
// STORAGE SETTINGS (Cloudinary / Local) - site_settings + ENV fallback
// ---------------------------------------------------------------------------

export type StorageDriver = 'local' | 'cloudinary';

export type StorageSettings = {
  driver: StorageDriver;
  localRoot: string | null;
  localBaseUrl: string | null;
  cloudName: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  folder: string | null;
  unsignedUploadPreset: string | null;
  cdnPublicBase: string | null;
  publicApiBase: string | null;
};

const toDriver = (raw: string | null | undefined): StorageDriver => {
  const v = (raw || '').trim().toLowerCase();
  if (v === 'local' || v === 'cloudinary') return v;

  const envRaw = (env.STORAGE_DRIVER || '').trim().toLowerCase();
  if (envRaw === 'local' || envRaw === 'cloudinary') return envRaw as StorageDriver;

  return 'cloudinary';
};

export async function getStorageSettings(locale?: string | null): Promise<StorageSettings> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });
  const map = await loadSettingsMap({ keys: STORAGE_KEYS, localeCandidates });

  const driver = toDriver(map.get('storage_driver'));

  const localRoot =
    normalizeStr(map.get('storage_local_root')) ?? normalizeStr(env.LOCAL_STORAGE_ROOT) ?? null;

  const localBaseUrl =
    normalizeStr(map.get('storage_local_base_url')) ??
    normalizeStr(env.LOCAL_STORAGE_BASE_URL) ??
    null;

  const cdnPublicBase =
    normalizeStr(map.get('storage_cdn_public_base')) ??
    normalizeStr(env.STORAGE_CDN_PUBLIC_BASE) ??
    null;

  const publicApiBase =
    normalizeStr(map.get('storage_public_api_base')) ??
    normalizeStr(env.STORAGE_PUBLIC_API_BASE) ??
    null;

  const cloudName =
    normalizeStr(map.get('cloudinary_cloud_name')) ??
    normalizeStr(env.CLOUDINARY_CLOUD_NAME) ??
    normalizeStr(env.CLOUDINARY?.cloudName) ??
    null;

  const apiKey =
    normalizeStr(map.get('cloudinary_api_key')) ??
    normalizeStr(env.CLOUDINARY_API_KEY) ??
    normalizeStr(env.CLOUDINARY?.apiKey) ??
    null;

  const apiSecret =
    normalizeStr(map.get('cloudinary_api_secret')) ??
    normalizeStr(env.CLOUDINARY_API_SECRET) ??
    normalizeStr(env.CLOUDINARY?.apiSecret) ??
    null;

  const folder =
    normalizeStr(map.get('cloudinary_folder')) ??
    normalizeStr(env.CLOUDINARY_FOLDER) ??
    normalizeStr(env.CLOUDINARY?.folder) ??
    null;

  const unsignedUploadPreset =
    normalizeStr(map.get('cloudinary_unsigned_preset')) ??
    normalizeStr(env.CLOUDINARY_UNSIGNED_PRESET) ??
    normalizeStr((env.CLOUDINARY as any)?.unsignedUploadPreset) ??
    normalizeStr((env.CLOUDINARY as any)?.uploadPreset) ??
    null;

  return {
    driver,
    localRoot,
    localBaseUrl,
    cloudName,
    apiKey,
    apiSecret,
    folder,
    unsignedUploadPreset,
    cdnPublicBase,
    publicApiBase,
  };
}

// ---------------------------------------------------------------------------
// GOOGLE OAUTH SETTINGS - site_settings + ENV fallback (locale-aware)
// ---------------------------------------------------------------------------

export type GoogleSettings = {
  clientId: string | null;
  clientSecret: string | null;
};

export async function getGoogleSettings(locale?: string | null): Promise<GoogleSettings> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });
  const map = await loadSettingsMap({ keys: GOOGLE_KEYS, localeCandidates });

  const clientId =
    normalizeStr(map.get('google_client_id')) ?? normalizeStr(env.GOOGLE_CLIENT_ID) ?? null;

  const clientSecret =
    normalizeStr(map.get('google_client_secret')) ?? normalizeStr(env.GOOGLE_CLIENT_SECRET) ?? null;

  return { clientId, clientSecret };
}

// ---------------------------------------------------------------------------
// PUBLIC BASE URL (locale-aware)
// ---------------------------------------------------------------------------

export async function getPublicBaseUrl(locale?: string | null): Promise<string | null> {
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale });

  const v = await getFirstNonEmptySetting({
    key: 'public_base_url',
    localeCandidates,
  });
  if (v) return v.replace(/\/+$/, '');

  const envV =
    normalizeStr((env as any).PUBLIC_BASE_URL) ?? normalizeStr(process.env.PUBLIC_BASE_URL);

  return envV ? envV.replace(/\/+$/, '') : null;
}
