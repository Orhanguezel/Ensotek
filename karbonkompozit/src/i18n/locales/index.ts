import type { AbstractIntlMessages } from 'next-intl';
import en from '../../../public/locales/en.json';
import tr from '../../../public/locales/tr.json';

export const LOCALE_MESSAGES: Record<string, AbstractIntlMessages> = {
  tr,
  en,
};

export const AVAILABLE_LOCALES = Object.keys(LOCALE_MESSAGES);
export const FALLBACK_LOCALE = 'tr';

export function hasLocale(locale: string): boolean {
  return locale in LOCALE_MESSAGES;
}

export function getLocaleMessages(locale: string): AbstractIntlMessages {
  return LOCALE_MESSAGES[locale] ?? (LOCALE_MESSAGES[FALLBACK_LOCALE] as AbstractIntlMessages);
}
