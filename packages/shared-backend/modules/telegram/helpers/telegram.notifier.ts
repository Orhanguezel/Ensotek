// src/modules/telegram/helpers/telegram.notifier.ts
// corporate-backend — Telegram notifier (site_settings templates + flags)
// Fail-safe: never throws; logs errors for debugging

import { getTelegramSettings, type TelegramEvent } from '../settings';
import { env } from '../../../core/env';

type TelegramNotifyInput =
  | {
      event: TelegramEvent;
      chatId?: string;
      data: Record<string, unknown>;
    }
  | {
      title: string;
      message: string;
      type?: string;
      createdAt?: Date;
      chatId?: string;
    };

const escapeTelegramMarkdown = (text: string): string => {
  return text.replace(/([\\_*`\[\]])/g, '\\$1');
};

const renderTemplate = (tpl: string, data: Record<string, unknown>): string => {
  // Admin panelden/seed'den bazı şablonlar gerçek satır sonu yerine literal "\n" metniyle
  // girilmiş olabiliyor — Telegram bunu render etmiyor, tek satır basıyor. Normalize et.
  const normalized = tpl.replace(/\\n/g, '\n');
  return normalized.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key: string) => {
    const v = (data as Record<string, unknown>)[key];
    if (v === null || typeof v === 'undefined') return '';
    if (v instanceof Date) return escapeTelegramMarkdown(v.toISOString());
    return escapeTelegramMarkdown(String(v));
  });
};

const defaultFallbackMessage = (input: { title: string; message: string }): string => {
  const siteName = escapeTelegramMarkdown(env.SITE_NAME);
  const title = escapeTelegramMarkdown(input.title);
  const message = escapeTelegramMarkdown(input.message);
  return `🌐 ${siteName}\n*${title}*\n\n${message}`;
};

async function sendTelegramMessage(opts: {
  botToken: string;
  chatId: string;
  text: string;
  /**
   * Varsayilan Markdown. Hata uyarilari duz metin gonderilir: bozuk Markdown
   * yuzunden UYARININ KENDISI de basarisiz olursa hata tamamen gorunmez olur.
   */
  parseMode?: 'Markdown' | null;
}): Promise<void> {
  const url = `https://api.telegram.org/bot${opts.botToken}/sendMessage`;
  const parseMode = opts.parseMode === undefined ? 'Markdown' : opts.parseMode;
  const payload = {
    chat_id: opts.chatId,
    text: opts.text,
    ...(parseMode ? { parse_mode: parseMode } : {}),
    disable_web_page_preview: true,
  };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`telegram_send_failed status=${r.status} body=${body}`);
  }
}

/**
 * Asil hedefe (grup/kanal) gonderim basarisiz olursa yoneticinin ozel sohbetine uyarir.
 *
 * NEDEN: onceki davranista hata yalnizca console.error'a yaziliyordu — yani bildirim
 * sessizce kayboluyordu. En sinsi senaryo: Telegram bir "basic group"u uye sayisi
 * artinca otomatik SUPERGROUP'a yukseltir ve chat_id degisir; eski id'ye gonderim
 * kalici olarak hata verir ama kimse fark etmez.
 *
 * Uyarinin icine ORIJINAL METIN de konur: boylece bildirim kaybolmaz, en azindan
 * yonetici gorur ve elle isleyebilir.
 */
async function reportDeliveryFailure(opts: {
  botToken: string;
  errorChatId: string | null;
  failedChatId: string;
  label: string;
  originalText: string;
  error: unknown;
}): Promise<void> {
  const { errorChatId, failedChatId } = opts;
  if (!errorChatId) return;
  // Ayni hedefse uyari da ayni sebeple duser; tekrar denemenin anlami yok.
  if (errorChatId === failedChatId) return;

  const reason = String((opts.error as Error)?.message ?? opts.error).slice(0, 300);
  const text =
    `⚠️ Telegram bildirimi GONDERILEMEDI\n\n` +
    `Site: ${env.SITE_NAME}\n` +
    `Olay: ${opts.label}\n` +
    `Hedef chat_id: ${failedChatId}\n` +
    `Sebep: ${reason}\n\n` +
    `--- gonderilemeyen mesaj ---\n` +
    opts.originalText.slice(0, 2500);

  try {
    // Duz metin: bozuk Markdown yuzunden uyarinin kendisi dusmesin.
    await sendTelegramMessage({
      botToken: opts.botToken,
      chatId: errorChatId,
      text,
      parseMode: null,
    });
  } catch (err) {
    // Buradan sonrasi icin yapilacak bir sey yok; sonsuz dongu olmasin.
    console.error('telegram_failure_report_failed', err);
  }
}

function isEventAllowed(
  events: Partial<Record<TelegramEvent, boolean>> | undefined,
  event: TelegramEvent,
): boolean {
  if (!events) return true;
  const v = events[event];
  if (typeof v === 'boolean') return v;
  return true;
}

/**
 * RAW send for webhook replies / inbound messaging.
 */
export async function telegramSendRaw(input: { chatId: string; text: string }): Promise<void> {
  try {
    const cfg = await getTelegramSettings();
    if (!cfg.webhookEnabled || !cfg.botToken) return;
    const safeText = escapeTelegramMarkdown(String(input.text ?? ''));
    await sendTelegramMessage({ botToken: cfg.botToken, chatId: input.chatId, text: safeText });
  } catch (err) {
    console.error('telegram_send_raw_failed', err);
  }
}

/**
 * Main notification function — event-based or generic.
 */
export async function telegramNotify(input: TelegramNotifyInput): Promise<void> {
  try {
    const cfg = await getTelegramSettings();
    if (!cfg.enabled || !cfg.botToken) return;

    // Event template path
    if ('event' in input) {
      const event: TelegramEvent = input.event;
      if (!isEventAllowed(cfg.events, event)) return;

      const chatId = input.chatId ?? cfg.defaultChatId ?? cfg.legacyChatId;
      if (!chatId) return;

      // 4 site tek bota/chat'e bağlı olabiliyor (ör. ensotek_de + kuhlturm aynı DB'yi paylaşıyor) —
      // hangi siteden geldiği belli olsun diye site_name'i otomatik ekle (caller'ın data'sı öncelikli).
      const dataWithSite = { site_name: env.SITE_NAME, ...input.data };

      const tpl = (cfg.templates?.[event] ?? '').trim();
      const text = tpl
        ? renderTemplate(tpl, dataWithSite)
        : renderTemplate(`🌐 {{site_name}}\n*${event}*\n\n{{message}}`, {
            ...dataWithSite,
            message: (input.data as Record<string, unknown>)?.message ?? '',
          });

      try {
        await sendTelegramMessage({ botToken: cfg.botToken, chatId, text });
      } catch (err) {
        await reportDeliveryFailure({
          botToken: cfg.botToken,
          errorChatId: cfg.errorChatId,
          failedChatId: chatId,
          label: event,
          originalText: text,
          error: err,
        });
        throw err;
      }
      return;
    }

    // Generic path
    const chatId = input.chatId ?? cfg.defaultChatId ?? cfg.legacyChatId;
    if (!chatId) return;
    const text = defaultFallbackMessage({ title: input.title, message: input.message });
    try {
      await sendTelegramMessage({ botToken: cfg.botToken, chatId, text });
    } catch (err) {
      await reportDeliveryFailure({
        botToken: cfg.botToken,
        errorChatId: cfg.errorChatId,
        failedChatId: chatId,
        label: input.title,
        originalText: text,
        error: err,
      });
      throw err;
    }
  } catch (err) {
    console.error('telegram_notify_failed', err);
  }
}
