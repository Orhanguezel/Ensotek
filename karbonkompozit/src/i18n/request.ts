import { getRequestConfig } from 'next-intl/server';
import { getLocaleSettings } from './locale-settings';
import { getLocaleMessages, hasLocale } from './locales';

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = (await requestLocale)?.toLowerCase() ?? '';
  const { activeLocales, defaultLocale } = await getLocaleSettings();
  const supportedLocales = activeLocales.filter(hasLocale);
  const fallbackLocale = hasLocale(defaultLocale) ? defaultLocale : supportedLocales[0] || 'tr';

  const locale =
    requestedLocale &&
    hasLocale(requestedLocale) &&
    supportedLocales.includes(requestedLocale)
      ? requestedLocale
      : fallbackLocale;

  return {
    locale,
    messages: getLocaleMessages(locale),
  };
});
