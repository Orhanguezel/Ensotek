import { getRequestConfig } from "next-intl/server";
import { getRuntimeLocaleSettings } from "./locale-settings";
import { getLocaleMessages, hasLocale } from "./locales";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = (await requestLocale)?.toLowerCase() ?? "";
  const { activeLocales, defaultLocale } = await getRuntimeLocaleSettings();

  const locale =
    requestedLocale && hasLocale(requestedLocale) && activeLocales.includes(requestedLocale)
      ? requestedLocale
      : defaultLocale;

  return {
    locale,
    messages: getLocaleMessages(locale),
  };
});
