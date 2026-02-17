import type { AbstractIntlMessages } from "next-intl";

import tr from "public/locales/tr.json";
import en from "public/locales/en.json";
import de from "public/locales/de.json";

export const LOCALE_MESSAGES: Record<string, AbstractIntlMessages> = {
  tr,
  en,
  de,
};

export const AVAILABLE_LOCALES = Object.keys(LOCALE_MESSAGES);
export const FALLBACK_LOCALE = "tr";

export function hasLocale(locale: string): boolean {
  return locale in LOCALE_MESSAGES;
}

export function getLocaleMessages(locale: string): AbstractIntlMessages {
  return LOCALE_MESSAGES[locale] ?? LOCALE_MESSAGES[FALLBACK_LOCALE];
}
