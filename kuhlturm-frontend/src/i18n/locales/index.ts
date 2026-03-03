import type { AbstractIntlMessages } from 'next-intl';
import de from '../../../public/locales/de.json';

// Add new locales here when activated from admin panel
export const LOCALE_MESSAGES: Record<string, AbstractIntlMessages> = {
  de,
};

export const AVAILABLE_LOCALES = Object.keys(LOCALE_MESSAGES);
export const FALLBACK_LOCALE = 'de';

export function hasLocale(locale: string): boolean {
  return locale in LOCALE_MESSAGES;
}

export function getLocaleMessages(locale: string): AbstractIntlMessages {
  return LOCALE_MESSAGES[locale] ?? (LOCALE_MESSAGES[FALLBACK_LOCALE] as AbstractIntlMessages);
}
