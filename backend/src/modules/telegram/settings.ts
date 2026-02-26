import { getGlobalSiteSettingsMap, safeTrim, toBoolDefault } from '@/modules/_shared';

/**
 * Ensotek Telegram Event Types
 */
export type TelegramEvent =
  | 'new_catalog_request'
  | 'new_offer_request'
  | 'new_contact'
  | 'new_ticket'
  | 'ticket_replied'
  | 'new_newsletter_subscription';

type TelegramSettings = {
  enabled: boolean;
  webhookEnabled: boolean;
  botToken: string;
  defaultChatId: string | null;
  legacyChatId: string | null;
  events: Partial<Record<TelegramEvent, boolean>>;
  templates: Partial<Record<TelegramEvent, string>>;
};
export const getSiteSettingsMap = getGlobalSiteSettingsMap;

export async function getTelegramSettings(): Promise<TelegramSettings> {
  const events: TelegramEvent[] = [
    'new_catalog_request',
    'new_offer_request',
    'new_contact',
    'new_ticket',
    'ticket_replied',
    'new_newsletter_subscription',
  ];

  const eventEnableKeys = events.flatMap((e) => [
    `telegram_event_${e}_enabled`,
    `telegram_${e}_enabled`,
  ]);
  const templateKeys = events.flatMap((e) => [`telegram_template_${e}`, `telegram_${e}_template`]);

  const baseKeys = [
    'telegram_notifications_enabled',
    'telegram_enabled',
    'telegram_webhook_enabled',
    'telegram_bot_token',
    'telegram_default_chat_id',
    'telegram_chat_id',
  ];

  const allKeys = [...baseKeys, ...eventEnableKeys, ...templateKeys];
  const map = await getSiteSettingsMap(allKeys);

  const enabled =
    toBoolDefault(map.get('telegram_notifications_enabled'), false) ||
    toBoolDefault(map.get('telegram_enabled'), false);

  const webhookEnabled = toBoolDefault(map.get('telegram_webhook_enabled'), true);
  const botToken = safeTrim(map.get('telegram_bot_token'));
  const defaultChatId = safeTrim(map.get('telegram_default_chat_id')) || null;
  const legacyChatId = safeTrim(map.get('telegram_chat_id')) || null;

  const eventMap: Partial<Record<TelegramEvent, boolean>> = {};
  const templates: Partial<Record<TelegramEvent, string>> = {};

  for (const event of events) {
    const enabledRaw =
      map.get(`telegram_event_${event}_enabled`) ?? map.get(`telegram_${event}_enabled`) ?? null;
    if (enabledRaw != null) eventMap[event] = toBoolDefault(enabledRaw, true);

    const templateRaw =
      map.get(`telegram_template_${event}`) ?? map.get(`telegram_${event}_template`) ?? null;
    const tpl = safeTrim(templateRaw);
    if (tpl) templates[event] = tpl;
  }

  return {
    enabled,
    webhookEnabled,
    botToken,
    defaultChatId,
    legacyChatId,
    events: eventMap,
    templates,
  };
}
