// =============================================================
// FILE: src/modules/siteSettings/service.ts
// =============================================================

import { db } from "@/db/client";
import { siteSettings } from "./schema";
import { and, eq, inArray } from "drizzle-orm";
import { env } from "@/core/env";

// ---------------------------------------------------------------------------
// KEY LISTELERİ
// ---------------------------------------------------------------------------

const SMTP_KEYS = [
  "smtp_host",
  "smtp_port",
  "smtp_username",
  "smtp_password",
  "smtp_from_email",
  "smtp_from_name",
  "smtp_ssl",
] as const;

const STORAGE_KEYS = [
  "storage_driver",
  "storage_local_root",
  "storage_local_base_url",
  "cloudinary_cloud_name",
  "cloudinary_api_key",
  "cloudinary_api_secret",
  "cloudinary_folder",
  "cloudinary_unsigned_preset",
  "storage_cdn_public_base",
  "storage_public_api_base",
] as const;

const GOOGLE_KEYS = ["google_client_id", "google_client_secret"] as const;

const APP_LOCALES_KEYS = ["app_locales"] as const;

const DEFAULT_LOCALE_KEYS = ["default_locale"] as const;

// ---------------------------------------------------------------------------
// COMMON HELPERS
// ---------------------------------------------------------------------------

const toBool = (v: string | null | undefined): boolean => {
  if (!v) return false;
  const s = v.toLowerCase();
  return ["1", "true", "yes", "on"].includes(s);
};

/** Boş stringleri null say. */
const normalizeStr = (v: string | null | undefined): string | null => {
  if (v == null) return null;
  const trimmed = String(v).trim();
  return trimmed === "" ? null : trimmed;
};

function uniq(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean)));
}

/**
 * Locale fallback sırası:
 *   exact (tr-TR) → prefix (tr) → en → tr
 */
export function buildLocaleCandidates(rawLocale?: string | null): string[] {
  const lc = (rawLocale || "").trim();
  const langPart = lc.includes("-") ? lc.split("-")[0] : lc;
  return uniq([lc, langPart, "en", "tr"].map((x) => x?.trim()).filter(Boolean));
}

/**
 * DB value alanı TEXT.
 * - JSON primitive ("string"/number/bool) ise primitive string'e indir.
 * - JSON array/object ise olduğu gibi JSON string kalır (parse eden fonksiyon ayrıca ele alır)
 */
function normalizeDbValueToString(raw: unknown): string {
  const v = String(raw ?? "");
  try {
    const parsed = JSON.parse(v);
    if (
      typeof parsed === "string" ||
      typeof parsed === "number" ||
      typeof parsed === "boolean"
    ) {
      return String(parsed);
    }
  } catch {
    // plain string
  }
  return v;
}

// ---------------------------------------------------------------------------
// LOW-LEVEL READERS (locale-aware)
// ---------------------------------------------------------------------------

type SettingRow = {
  key: string;
  locale: string;
  value: string;
};

/**
 * Verilen key listesi için, verilen locale adaylarında kayıtları getirir.
 * Eğer locale verilmezse: tüm locale’ler gelir (legacy kullanım).
 */
async function fetchSettingsRows(opts: {
  keys: readonly string[];
  locale?: string | null;
}): Promise<SettingRow[]> {
  const { keys, locale } = opts;
  const candidates = locale ? buildLocaleCandidates(locale) : null;

  const rows = await db
    .select({
      key: siteSettings.key,
      locale: siteSettings.locale,
      value: siteSettings.value,
    })
    .from(siteSettings)
    .where(
      candidates
        ? and(inArray(siteSettings.key, keys), inArray(siteSettings.locale, candidates))
        : inArray(siteSettings.key, keys),
    );

  return rows.map((r) => ({
    key: r.key as string,
    locale: r.locale as string,
    value: normalizeDbValueToString(r.value as any),
  }));
}

/**
 * Locale-aware “effective map”:
 * - Her key için candidates sırasına göre ilk bulunan satır seçilir.
 * - Sonuç: key → string (bulunamazsa yok)
 */
async function loadSettingsMap(opts: {
  keys: readonly string[];
  locale?: string | null;
}): Promise<Map<string, string>> {
  const { keys, locale } = opts;
  const candidates = buildLocaleCandidates(locale);

  const rows = await fetchSettingsRows({ keys, locale });

  const map = new Map<string, string>();

  for (const key of keys) {
    const sameKey = rows.filter((r) => r.key === key);

    // candidate sırasına göre ilk match
    for (const loc of candidates) {
      const hit = sameKey.find((r) => r.locale === loc);
      if (hit) {
        map.set(key, hit.value);
        break;
      }
    }

    // hiç bulamazsa: map'e koyma
  }

  return map;
}

/**
 * Locale-aware: bir key için “boş olmayan” değeri seç.
 * - candidates sırasına göre gider, normalizeStr sonrası dolu olan ilk değeri döndürür.
 * - yoksa null
 */
async function getFirstNonEmptySetting(opts: {
  key: string;
  locale?: string | null;
}): Promise<string | null> {
  const candidates = buildLocaleCandidates(opts.locale);
  const rows = await fetchSettingsRows({ keys: [opts.key], locale: opts.locale });

  for (const loc of candidates) {
    const hit = rows.find((r) => r.locale === loc);
    const norm = normalizeStr(hit?.value ?? null);
    if (norm) return norm;
  }
  return null;
}

// ---------------------------------------------------------------------------
// SMTP SETTINGS  💡 SADECE site_settings TABLOSUNDAN OKUR (ENV FALLBACK YOK)
// ---------------------------------------------------------------------------

export type SmtpSettings = {
  host: string | null;
  port: number | null;
  username: string | null;
  password: string | null;
  fromEmail: string | null;
  fromName: string | null;
  secure: boolean; // smtp_ssl
};

/**
 * SMTP ayar okuyucu:
 * - locale-aware, boş olmayan ilk değer (locale → prefix → en → tr)
 * - ENV FALLBACK YOK
 *
 * locale paramı opsiyonel: vermezsen yine (en,tr) ile çalışır.
 */
export async function getSmtpSettings(locale?: string | null): Promise<SmtpSettings> {
  const [host, portStr, username, password, fromEmail, fromName, sslStr] =
    await Promise.all([
      getFirstNonEmptySetting({ key: "smtp_host", locale }),
      getFirstNonEmptySetting({ key: "smtp_port", locale }),
      getFirstNonEmptySetting({ key: "smtp_username", locale }),
      getFirstNonEmptySetting({ key: "smtp_password", locale }),
      getFirstNonEmptySetting({ key: "smtp_from_email", locale }),
      getFirstNonEmptySetting({ key: "smtp_from_name", locale }),
      getFirstNonEmptySetting({ key: "smtp_ssl", locale }),
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

export type StorageDriver = "local" | "cloudinary";

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

/**
 * Driver seçimi:
 *   1) site_settings.storage_driver  ✅ (öncelik)
 *   2) ENV (STORAGE_DRIVER)          🔁 (fallback)
 *   3) default: "cloudinary"
 */
const toDriver = (raw: string | null | undefined): StorageDriver => {
  const v = (raw || "").trim().toLowerCase();
  if (v === "local" || v === "cloudinary") return v;

  const envRaw = (env.STORAGE_DRIVER || "").trim().toLowerCase();
  if (envRaw === "local" || envRaw === "cloudinary") {
    return envRaw as StorageDriver;
  }

  return "cloudinary";
};

export async function getStorageSettings(locale?: string | null): Promise<StorageSettings> {
  const map = await loadSettingsMap({ keys: STORAGE_KEYS, locale });

  const driver = toDriver(map.get("storage_driver"));

  const localRoot =
    normalizeStr(map.get("storage_local_root")) ??
    normalizeStr(env.LOCAL_STORAGE_ROOT) ??
    null;

  const localBaseUrl =
    normalizeStr(map.get("storage_local_base_url")) ??
    normalizeStr(env.LOCAL_STORAGE_BASE_URL) ??
    null;

  const cdnPublicBase =
    normalizeStr(map.get("storage_cdn_public_base")) ??
    normalizeStr(env.STORAGE_CDN_PUBLIC_BASE) ??
    null;

  const publicApiBase =
    normalizeStr(map.get("storage_public_api_base")) ??
    normalizeStr(env.STORAGE_PUBLIC_API_BASE) ??
    null;

  const cloudName =
    normalizeStr(map.get("cloudinary_cloud_name")) ??
    normalizeStr(env.CLOUDINARY_CLOUD_NAME) ??
    normalizeStr(env.CLOUDINARY?.cloudName) ??
    null;

  const apiKey =
    normalizeStr(map.get("cloudinary_api_key")) ??
    normalizeStr(env.CLOUDINARY_API_KEY) ??
    normalizeStr(env.CLOUDINARY?.apiKey) ??
    null;

  const apiSecret =
    normalizeStr(map.get("cloudinary_api_secret")) ??
    normalizeStr(env.CLOUDINARY_API_SECRET) ??
    normalizeStr(env.CLOUDINARY?.apiSecret) ??
    null;

  const folder =
    normalizeStr(map.get("cloudinary_folder")) ??
    normalizeStr(env.CLOUDINARY_FOLDER) ??
    normalizeStr(env.CLOUDINARY?.folder) ??
    null;

  const unsignedUploadPreset =
    normalizeStr(map.get("cloudinary_unsigned_preset")) ??
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
  const map = await loadSettingsMap({ keys: GOOGLE_KEYS, locale });

  const clientId =
    normalizeStr(map.get("google_client_id")) ??
    normalizeStr(env.GOOGLE_CLIENT_ID) ??
    null;

  const clientSecret =
    normalizeStr(map.get("google_client_secret")) ??
    normalizeStr(env.GOOGLE_CLIENT_SECRET) ??
    null;

  return { clientId, clientSecret };
}

// ---------------------------------------------------------------------------
// APP LOCALES – site_settings.app_locales (locale-aware)
// ---------------------------------------------------------------------------

export async function getAppLocales(locale?: string | null): Promise<string[]> {
  const map = await loadSettingsMap({ keys: APP_LOCALES_KEYS, locale });

  const raw = map.get("app_locales");
  if (!raw) return ["tr", "en"];

  // JSON array beklenir; değilse CSV kabul
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const list = parsed.map((v) => String(v).trim()).filter(Boolean);
      return list.length ? list : ["tr", "en"];
    }
  } catch {
    // CSV
  }

  const list = raw
    .split(/[;,]+/)
    .map((v) => v.trim())
    .filter(Boolean);

  return list.length ? list : ["tr", "en"];
}

// ---------------------------------------------------------------------------
// DEFAULT LOCALE – site_settings.default_locale (locale-aware)
//  - Seed'in mantığı: her locale için value="tr" yazıyorsun.
//    Bu fonksiyon: mevcut locale için okur, yoksa en/tr fallback.
// ---------------------------------------------------------------------------

export async function getDefaultLocale(locale?: string | null): Promise<string> {
  const map = await loadSettingsMap({ keys: DEFAULT_LOCALE_KEYS, locale });
  const raw = normalizeStr(map.get("default_locale") ?? null);
  return raw ?? "tr";
}

// ---------------------------------------------------------------------------
// PUBLIC BASE URL – mail linkleri, absolute URL üretimi için (locale-aware)
// ---------------------------------------------------------------------------

export async function getPublicBaseUrl(locale?: string | null): Promise<string | null> {
  // DB: public_base_url
  const v = await getFirstNonEmptySetting({ key: "public_base_url", locale });
  if (v) return v.replace(/\/+$/, "");

  // opsiyonel env fallback (istersen kapatabilirsin)
  const envV = normalizeStr((env as any).PUBLIC_BASE_URL) ?? normalizeStr(process.env.PUBLIC_BASE_URL);
  return envV ? envV.replace(/\/+$/, "") : null;
}
