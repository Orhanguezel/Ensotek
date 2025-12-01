// src/lib/i18n/locale.ts
import { useRouter } from "next/router";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/common";
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

const isSupportedLocale = (val: string): val is SupportedLocale =>
  (SUPPORTED_LOCALES as readonly string[]).includes(val);

export const useResolvedLocale = (): SupportedLocale => {
  const { locale: routerLocaleRaw = "en" } = useRouter();
  const { data: appLocalesSetting } = useGetSiteSettingByKeyQuery({
    key: "app_locales",
  });

  const availableLocales: SupportedLocale[] = (() => {
    const raw = appLocalesSetting?.value;
    if (Array.isArray(raw)) {
      const arr = raw
        .map((v) => String(v).toLowerCase())
        .filter(isSupportedLocale);
      if (arr.length) return arr;
    }
    return [...SUPPORTED_LOCALES];
  })();

  const fromRouter = String(routerLocaleRaw || "").toLowerCase();
  const match = availableLocales.find((loc) => loc === fromRouter);

  return match || availableLocales[0] || "en";
};
