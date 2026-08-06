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
 * Sıra: admin_notification_email (site_settings, elle girilmiş genel ayar) → contact_info.email
 * (sitede zaten görünen, locale'e göre değişebilen gerçek iletişim adresi) → offers_admin_email
 * (offer modülüyle paylaşılan fallback) → smtp gönderim kutusu (son çare). İlk dolu olan kullanılır.
 *
 * `locale`: isteği yapan sitenin/formun locale'i (örn. 'de','tr') — ensotek_de ve kuhlturm aynı DB'yi
 * paylaştığı ve contact_info locale'e göre farklı marka/e-posta taşıdığı için (kuhlturm: de/en →
 * info@kuhlturm.com, ensotek: tr → ensotek@ensotek.com.tr) bu parametre olmadan yanlış adrese
 * bildirim gidebilir.
 */
export async function getAdminNotificationEmails(locale?: string | null): Promise<string[]> {
  const { getGlobalSettingValue, getFirstNonEmptySetting } = await import('../siteSettings/helpers');

  const direct = parseEmailList(await getGlobalSettingValue('admin_notification_email'));
  if (direct.length) return direct;

  const { buildLocaleFallbackChain } = await import('../siteSettings');
  const localeCandidates = await buildLocaleFallbackChain({ requested: locale ?? null });
  // kompozit'in contact_info'su tarihsel olarak 'kompozit__contact_info' anahtarıyla seed edilmiş
  // (sistematik bir prefix mekanizması yok, sadece o repoya özgü isimlendirme) — ikisini de dene.
  for (const key of ['contact_info', 'kompozit__contact_info']) {
    const contactInfoRaw = await getFirstNonEmptySetting({ key, localeCandidates });
    if (!contactInfoRaw) continue;
    try {
      const parsed = JSON.parse(contactInfoRaw);
      const email = typeof parsed?.email === 'string' ? parsed.email.trim() : '';
      if (email) return [email];
    } catch {
      // contact_info JSON parse edilemedi — sıradaki key/fallback'e düş
    }
  }

  const offersFallback = parseEmailList(await getGlobalSettingValue('offers_admin_email'));
  if (offersFallback.length) return offersFallback;

  const { getSmtpSettings } = await import('../siteSettings');
  const smtp = await getSmtpSettings().catch(() => null);
  const fallback = smtp?.fromEmail || smtp?.username || '';
  // Bazı eski kayıtlarda değer yanlışlıkla JSON-string olarak saklanmış (örn. literal '""') —
  // gerçek bir e-posta gibi görünmeyeni fallback olarak kullanma.
  return fallback.includes('@') ? [fallback] : [];
}
