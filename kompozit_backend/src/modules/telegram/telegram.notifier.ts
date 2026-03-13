type TelegramNotifyPayload = {
  templateKey?: string;
  chatId?: string | number;
  text?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Kompozit backend'te telegram modulu router seviyesinde ayrildi.
 * Mevcut offer/contact akislarinin kirilmamasi icin notifier burada
 * no-op olarak korunuyor. Sonraki turda bu akislar kendi bildirim
 * stratejisine tasinacak.
 */
export async function telegramNotify(_payload: TelegramNotifyPayload): Promise<void> {
  return;
}
