// src/lib/i18n/uiDb.ts
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";
import type { SupportedLocale } from "@/types/common";
import { useUIStrings, UI_KEYS } from "@/lib/i18n/ui";

// DB tarafında kullanacağın section key'leri
type UiSectionKey =
  | "ui_header"
  | "ui_home"
  | "ui_footer"
  | "ui_services"
  | "ui_banner"
  | "ui_hero"
  | "ui_contact"
  | "ui_about"
  | "ui_pricing"
  | "ui_testimonials"
  | "ui_faq"
  | "ui_features"
  | "ui_cta"
  | "ui_blog"
  | "ui_dashboard"
  | "ui_auth"
  | "ui_newsletter"
  | "ui_library"
  | "ui_feedback"
  | "ui_references"
  | "ui_news";

export const useUiSection = (
  section: UiSectionKey,
  locale: SupportedLocale,
  uiNamespace: (typeof UI_KEYS)[keyof typeof UI_KEYS], // örn: UI_KEYS.hero
) => {
  // 1) DB'den section JSON'unu çek
  const { data: uiSetting } = useGetSiteSettingByKeyQuery({
    key: section,
    locale,
  });

  // 2) Eski i18n fallback'ini kullan (UI_FALLBACK_EN zinciri)
  //    Burada generic t'yi "string" alan bir fonksiyona wrap ediyoruz,
  //    böylece TS2345 hatası ortadan kalkıyor.
  const { t: tInner } = useUIStrings(uiNamespace as any, locale);
  const t = (key: string): string => tInner(key as any);

  // 3) DB JSON'unu normalize et
  const json: Record<string, unknown> =
    uiSetting?.value &&
    typeof uiSetting.value === "object" &&
    !Array.isArray(uiSetting.value)
      ? (uiSetting.value as Record<string, unknown>)
      : {};

  // 4) Kullanılacak helper:
  //    Önce DB JSON (uiSetting.value),
  //    sonra i18n (useUIStrings → UI_FALLBACK_EN),
  //    en sonda hardFallback
  const ui = (key: string, hardFallback = "") => {
    const raw = json[key];

    // 4.1 DB JSON override
    if (typeof raw === "string" && raw.trim()) {
      return raw;
    }

    // 4.2 i18n (settings label → EN fallback → UI_FALLBACK_EN)
    const fromI18n = t(key) || "";
    if (fromI18n.trim()) {
      return fromI18n;
    }

    // 4.3 En son hard-coded fallback
    return hardFallback;
  };

  return { ui, raw: json };
};
