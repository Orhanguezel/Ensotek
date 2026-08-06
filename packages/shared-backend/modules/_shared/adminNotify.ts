// src/modules/_shared/adminNotify.ts
// Sipariş/teklif/iletişim gibi olaylarda admin'e mail bildirimi gidecek alıcıları çözer.

import { getGlobalSettingValue } from '../siteSettings/helpers';
import { getSmtpSettings } from '../siteSettings';

function parseEmailList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/[;,]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Sıra: admin_notification_email (site_settings) → offers_admin_email (offer modülüyle paylaşılan
 * fallback) → smtp gönderim kutusu (son çare). İlk dolu olan kullanılır.
 */
export async function getAdminNotificationEmails(): Promise<string[]> {
  const direct = parseEmailList(await getGlobalSettingValue('admin_notification_email'));
  if (direct.length) return direct;

  const offersFallback = parseEmailList(await getGlobalSettingValue('offers_admin_email'));
  if (offersFallback.length) return offersFallback;

  const smtp = await getSmtpSettings().catch(() => null);
  const fallback = smtp?.fromEmail || smtp?.username || '';
  return fallback ? [fallback] : [];
}
