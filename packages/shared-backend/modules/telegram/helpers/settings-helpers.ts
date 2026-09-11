// src/modules/telegram/helpers/settings-helpers.ts

import { toBool } from '../../_shared';

export type TelegramEvent =
  | 'new_user'
  | 'new_contact'
  | 'new_offer_request'
  | 'new_ticket'
  | 'ticket_replied'
  | 'new_catalog_request'
  | 'new_newsletter_subscription';

export type TelegramSettings = {
  enabled: boolean;
  webhookEnabled: boolean;
  botToken: string;
  defaultChatId: string | null;
  legacyChatId: string | null;
  /**
   * Bildirim asil hedefe (grup/kanal) gonderilemezse uyarinin dusecegi ozel sohbet.
   * Bos birakilirsa hata yalnizca log'a yazilir — yani sessizce kaybolur.
   * site_settings anahtari: `telegram_error_chat_id`.
   */
  errorChatId: string | null;
  events: Partial<Record<TelegramEvent, boolean>>;
  templates: Partial<Record<TelegramEvent, string>>;
};

export const TELEGRAM_EVENTS: TelegramEvent[] = [
  'new_user',
  'new_contact',
  'new_offer_request',
  'new_ticket',
  'ticket_replied',
  'new_catalog_request',
  'new_newsletter_subscription',
];

export function toTelegramBool(v: string | null | undefined, fallback = false): boolean {
  if (v == null) return fallback;
  const s = toTelegramText(v);
  if (!s) return fallback;
  return toBool(s);
}

export function toTelegramText(v: string | null | undefined): string {
  const text = String(v ?? '').trim();
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed === 'string' || typeof parsed === 'number' || typeof parsed === 'boolean') return String(parsed).trim();
  } catch { /* Plain settings values are also supported. */ }
  return text;
}
