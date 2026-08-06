// src/modules/_shared/adminNotify.ts
// Sipariş/teklif/iletişim gibi olaylarda admin'e mail bildirimi gidecek alıcıları çözer.
//
// NOT: siteSettings modülü dolaylı olarak _shared'e bağımlı; bu yüzden burada üst seviyede
// (static) import KULLANMA — _shared -> siteSettings -> ... -> _shared döngüsü oluşur ve
// Bun/Node ESM modül grafiğinde "Cannot access 'env' before initialization" ile process
// başlatılamaz hale gelir. Dinamik import (fonksiyon içinde, çağrı anında) bu döngüyü kırar
// — contact/controller.ts'deki orijinal desenle aynı.

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
  const { getGlobalSettingValue } = await import('../siteSettings/helpers');

  const direct = parseEmailList(await getGlobalSettingValue('admin_notification_email'));
  if (direct.length) return direct;

  const offersFallback = parseEmailList(await getGlobalSettingValue('offers_admin_email'));
  if (offersFallback.length) return offersFallback;

  const { getSmtpSettings } = await import('../siteSettings');
  const smtp = await getSmtpSettings().catch(() => null);
  const fallback = smtp?.fromEmail || smtp?.username || '';
  return fallback ? [fallback] : [];
}
