// Kuhlturm locale settings — delegates to @ensotek/core shared utility
import { getRuntimeLocaleSettings } from '@ensotek/core/i18n';
import { AVAILABLE_LOCALES, FALLBACK_LOCALE } from './locales';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8086/api';

export { getRuntimeLocaleSettings };

export function getLocaleSettings() {
  return getRuntimeLocaleSettings(API_BASE_URL, AVAILABLE_LOCALES, FALLBACK_LOCALE);
}
