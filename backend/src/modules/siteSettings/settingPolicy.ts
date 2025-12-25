// =============================================================
// FILE: src/modules/siteSettings/settingPolicy.ts
// Ensotek – Key policy + value normalization/validation
// SEO strict validation uses seo.validation.ts (single source)
// =============================================================

import type { JsonLike } from './validation';
import { STRICT_SEO_KEYS, validateSeoSettingValue, assertSeoLocaleRule } from './seo.validation';

/**
 * Key policy:
 * - GLOBAL_ONLY_KEYS: her zaman locale='*'
 * - STRICT_SEO_KEYS:
 *    - seo/site_seo: locale yoksa '*' (global default); locale varsa override
 *    - site_meta_default: locale '*' yasak (per-locale zorunlu)
 * - default: mevcut davranış (locale yoksa all-locales)
 */

export const GLOBAL_ONLY_KEYS = new Set<string>([
  'app_locales',
  'default_locale',
  'public_base_url',

  // smtp
  'smtp_host',
  'smtp_port',
  'smtp_username',
  'smtp_password',
  'smtp_from_email',
  'smtp_from_name',
  'smtp_ssl',

  // google
  'google_client_id',
  'google_client_secret',

  // storage
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
]);

export function normalizeValueByKey(key: string, value: JsonLike): JsonLike {
  const k = String(key || '')
    .trim()
    .toLowerCase();

  if (STRICT_SEO_KEYS.has(k)) {
    // validateSeoSettingValue throws with ZodError; upstream should map to 400
    return validateSeoSettingValue(k, value) as unknown as JsonLike;
  }

  return value;
}

/**
 * Admin update/create esnasında locale deterministik hale getir.
 */
export function coerceLocaleByKey(key: string, locale: string | null): string | null {
  const k = String(key || '')
    .trim()
    .toLowerCase();

  if (GLOBAL_ONLY_KEYS.has(k)) return '*';

  if (STRICT_SEO_KEYS.has(k)) {
    const effective = locale ?? '*';
    // locale rule: site_meta_default cannot be '*'
    assertSeoLocaleRule(k, effective);
    return effective;
  }

  return locale; // normal davranış
}
