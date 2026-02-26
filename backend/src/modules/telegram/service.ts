// ===================================================================
// FILE: src/modules/telegram/service.ts
// Telegram module services (admin tools + inbound webhook)
// ===================================================================

import { randomUUID } from 'crypto';
import { safeTrim } from '@/modules/_shared';
import { telegramNotify, telegramSendRaw } from './telegram.notifier';
import { toTelegramBoolInt, toTelegramChatId } from './helpers';
import { TelegramAdminRepo } from './repository';
import type {
  TelegramSendBody,
  TelegramEventBody,
  TelegramWebhookBody,
} from './validation';

/**
 * Generic message send (no template selection).
 */
export async function sendTelegramGeneric(input: TelegramSendBody) {
  await telegramNotify({
    title: input.title,
    message: input.message,
    type: input.type,
    chatId: input.chat_id,
    createdAt: new Date(),
  });

  return { ok: true };
}

/**
 * Template-based event send (site_settings templates + flags).
 */
export async function sendTelegramEvent(input: TelegramEventBody) {
  await telegramNotify({
    event: input.event as any,
    chatId: input.chat_id,
    data: input.data ?? {},
  });

  return { ok: true };
}

/**
 * Simple test message to confirm bot token + chat_id works.
 */
export async function sendTelegramTest(chatId?: string) {
  await telegramNotify({
    title: 'Telegram Test',
    message: 'Telegram bildirim testi başarılı.',
    chatId,
    createdAt: new Date(),
  });

  return { ok: true };
}

/**
 * Stores inbound updates and optionally sends a simple auto-reply.
 */
export async function processTelegramWebhook(update: TelegramWebhookBody) {
  const msg = update.message;
  const chatId = toTelegramChatId(msg?.chat?.id);

  // Persist only message updates with chat_id.
  if (msg && chatId) {
    await TelegramAdminRepo.insertInbound({
      id: randomUUID(),
      update_id: Number(update.update_id),
      message_id: typeof msg.message_id === 'number' ? msg.message_id : null,
      chat_id: chatId,
      chat_type: safeTrim(msg.chat?.type) || null,
      chat_title: safeTrim(msg.chat?.title) || null,
      chat_username: safeTrim(msg.chat?.username) || null,
      from_id: toTelegramChatId(msg.from?.id) || null,
      from_username: safeTrim(msg.from?.username) || null,
      from_first_name: safeTrim(msg.from?.first_name) || null,
      from_last_name: safeTrim(msg.from?.last_name) || null,
      from_is_bot: toTelegramBoolInt(msg.from?.is_bot),
      text: typeof msg.text === 'string' ? msg.text : null,
      raw: JSON.stringify(update),
      telegram_date: typeof msg.date === 'number' ? msg.date : null,
      created_at: new Date(),
    } as any);

    const autoReply = await TelegramAdminRepo.getAutoReply();
    const isUserText = !msg.from?.is_bot && typeof msg.text === 'string' && msg.text.trim().length > 0;

    if (autoReply.enabled && isUserText) {
      await telegramSendRaw({
        chatId,
        text: autoReply.template,
      });
    }
  }

  return { ok: true };
}
