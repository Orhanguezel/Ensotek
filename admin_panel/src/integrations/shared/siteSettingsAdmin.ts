// =============================================================
// FILE: src/integrations/shared/siteSettingsAdmin.ts
// Admin-only site-settings helpers, types, constants
// =============================================================

import type { SettingValue, SiteSetting, SiteSettingLike, SiteSettingRow } from "./siteSettings";

// ── re-usable error helper ──

function _errMsg(err: unknown, fallback: string): string {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    if (typeof e.message === "string" && e.message) return e.message;
    if (typeof (e as any).data?.message === "string") return (e as any).data.message;
  }
  if (typeof err === "string" && err) return err;
  return fallback;
}

export const getSiteSettingsActionErrorMessage = _errMsg;
export const getSiteSettingsApiErrorMessage = _errMsg;
export const getSiteSettingsBrandingErrorMessage = _errMsg;
export const getSiteSettingsBrandMediaErrorMessage = _errMsg;
export const getSiteSettingsCloudinaryErrorMessage = _errMsg;
export const getSiteSettingsSmtpErrorMessage = _errMsg;

// ── TABS ──

export type SiteSettingsTabId =
  | "list"
  | "global_list"
  | "general"
  | "seo"
  | "smtp"
  | "cloudinary"
  | "brand_media"
  | "api"
  | "locales"
  | "branding";

export const SITE_SETTINGS_TABS: readonly { id: SiteSettingsTabId }[] = [
  { id: "list" },
  { id: "global_list" },
  { id: "general" },
  { id: "seo" },
  { id: "branding" },
  { id: "brand_media" },
  { id: "locales" },
  { id: "smtp" },
  { id: "cloudinary" },
  { id: "api" },
] as const;

// ── value helpers ──

export function coerceSiteSettingsValue(value: unknown): SettingValue | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;
    try {
      return JSON.parse(s) as SettingValue;
    } catch {
      return s;
    }
  }
  return value as SettingValue;
}

export function parseSiteSettingsRawValue(text: string): SettingValue {
  const s = text.trim();
  if (!s) return "";
  try {
    return JSON.parse(s) as SettingValue;
  } catch {
    return s;
  }
}

export function prettyStringifySiteSettingValue(value: SettingValue | null | undefined): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

export function coerceSiteSettingsPreviewValue(value: SettingValue): SettingValue | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;
    try {
      return JSON.parse(s) as SettingValue;
    } catch {
      return s;
    }
  }
  return value;
}

export function summariseSiteSettingsValue(value: SettingValue, countLabel: string): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.length > 60 ? `${value.slice(0, 60)}…` : value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `${value.length} ${countLabel}`;
  if (typeof value === "object") {
    const keys = Object.keys(value);
    return `{…} ${keys.length} ${countLabel}`;
  }
  return null;
}

export function isSiteSettingsSeoKey(key: string): boolean {
  return key === "seo" || key === "site_seo" || key === "seo_pages";
}

export function coerceSiteSettingsStructuredValue(value: SettingValue): Record<string, unknown> | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;
    try {
      const p = JSON.parse(s);
      return p && typeof p === "object" && !Array.isArray(p) ? (p as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  if (typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return null;
}

// ── General settings ──

export const SITE_SETTINGS_GENERAL_KEYS: readonly string[] = [
  "site_name",
  "site_tagline",
  "site_logo",
  "site_logo_dark",
  "site_favicon",
  "contact_info",
  "socials",
  "company_profile",
  "businessHours",
  "hero",
  "home_backgrounds",
  "ui_header",
] as const;

export const SITE_SETTINGS_DEFAULTS_BY_KEY: Record<string, SettingValue> = {
  site_name: "Ensotek",
  site_tagline: "",
  site_logo: "",
  site_logo_dark: "",
  site_favicon: "",
  contact_info: {},
  socials: {},
  company_profile: {},
  businessHours: [],
  hero: {},
  home_backgrounds: [],
  ui_header: {},
};

export type GeneralSettingsRow = {
  key: string;
  value: SettingValue;
  hasValue: boolean;
  editLocale: string;
};

export function buildSiteSettingsGeneralRows(settings: SiteSetting[], locale: string): GeneralSettingsRow[] {
  const map = new Map<string, SiteSetting>();
  for (const s of settings) if (s.key) map.set(s.key, s);

  return SITE_SETTINGS_GENERAL_KEYS.map((key) => {
    const s = map.get(key);
    return {
      key,
      value: (s?.value ?? null) as SettingValue,
      hasValue: s != null && s.value !== null && s.value !== undefined,
      editLocale: locale,
    };
  });
}

export function buildSiteSettingsEditHref(key: string, locale: string): string {
  return `/admin/site-settings/${encodeURIComponent(key)}?locale=${encodeURIComponent(locale)}`;
}

// ── API settings ──

export type SiteSettingsApiForm = Record<string, string>;

export const SITE_SETTINGS_API_KEYS: readonly string[] = [
  "ai_provider",
  "ai_provider_order",
  "openai_api_key",
  "openai_model",
  "groq_api_key",
  "groq_model",
  "anthropic_api_key",
  "anthropic_model",
  "google_analytics_id",
  "google_tag_manager_id",
  "recaptcha_site_key",
  "recaptcha_secret_key",
] as const;

export const SITE_SETTINGS_API_SECTIONS: readonly {
  titleKey: string;
  testEndpoint?: string;
  fields: readonly {
    key: string;
    labelKey: string;
    type?: string;
    placeholderKey?: string;
  }[];
}[] = [
  {
    titleKey: "ai",
    fields: [
      { key: "ai_provider", labelKey: "aiProvider" },
      { key: "ai_provider_order", labelKey: "aiProviderOrder", placeholderKey: "aiProviderOrderPlaceholder" },
    ],
  },
  {
    titleKey: "openai",
    testEndpoint: "/api/ai/test/openai",
    fields: [
      { key: "openai_api_key", labelKey: "openaiApiKey", type: "password" },
      { key: "openai_model", labelKey: "openaiModel", placeholderKey: "openaiModelPlaceholder" },
    ],
  },
  {
    titleKey: "groq",
    testEndpoint: "/api/ai/test/groq",
    fields: [
      { key: "groq_api_key", labelKey: "groqApiKey", type: "password" },
      { key: "groq_model", labelKey: "groqModel", placeholderKey: "groqModelPlaceholder" },
    ],
  },
  {
    titleKey: "anthropic",
    testEndpoint: "/api/ai/test/anthropic",
    fields: [
      { key: "anthropic_api_key", labelKey: "anthropicApiKey", type: "password" },
      { key: "anthropic_model", labelKey: "anthropicModel", placeholderKey: "anthropicModelPlaceholder" },
    ],
  },
  {
    titleKey: "analytics",
    fields: [
      { key: "google_analytics_id", labelKey: "gaId", placeholderKey: "gaIdPlaceholder" },
      { key: "google_tag_manager_id", labelKey: "gtmId", placeholderKey: "gtmIdPlaceholder" },
    ],
  },
  {
    titleKey: "recaptcha",
    fields: [
      { key: "recaptcha_site_key", labelKey: "recaptchaSiteKey", type: "password" },
      { key: "recaptcha_secret_key", labelKey: "recaptchaSecretKey", type: "password" },
    ],
  },
] as const;

export type SiteSettingsApiTestResult = { ok: boolean; message: string };

export function createSiteSettingsApiForm(): SiteSettingsApiForm {
  const form: SiteSettingsApiForm = {};
  for (const k of SITE_SETTINGS_API_KEYS) form[k] = "";
  return form;
}

export function mapSiteSettingsToApiForm(settings: (SiteSetting | SiteSettingRow)[] | undefined): SiteSettingsApiForm {
  const form = createSiteSettingsApiForm();
  if (!settings) return form;
  for (const s of settings) {
    if (s.key && s.key in form) form[s.key] = String(s.value ?? "");
  }
  return form;
}

export function buildSiteSettingsApiUpdates(form: SiteSettingsApiForm): { key: string; value: SettingValue }[] {
  return Object.entries(form).map(([key, value]) => ({ key, value }));
}

// ── SMTP settings ──

export type SiteSettingsSmtpKey =
  | "smtp_host"
  | "smtp_port"
  | "smtp_ssl"
  | "smtp_username"
  | "smtp_password"
  | "smtp_from_email"
  | "smtp_from_name";

export type SiteSettingsSmtpForm = {
  smtp_host: string;
  smtp_port: string;
  smtp_ssl: boolean;
  smtp_username: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
};

export type SiteSettingsSmtpTestResult = { ok: boolean; message: string };

export const SITE_SETTINGS_SMTP_KEYS: readonly string[] = [
  "smtp_host",
  "smtp_port",
  "smtp_ssl",
  "smtp_username",
  "smtp_password",
  "smtp_from_email",
  "smtp_from_name",
] as const;

export function createSiteSettingsSmtpForm(): SiteSettingsSmtpForm {
  return {
    smtp_host: "",
    smtp_port: "587",
    smtp_ssl: true,
    smtp_username: "",
    smtp_password: "",
    smtp_from_email: "",
    smtp_from_name: "",
  };
}

export function mapSiteSettingsToSmtpForm(
  settings: (SiteSetting | SiteSettingRow)[] | undefined,
): SiteSettingsSmtpForm {
  const form = createSiteSettingsSmtpForm();
  if (!settings) return form;
  for (const s of settings) {
    if (s.key === "smtp_ssl") {
      form.smtp_ssl = s.value === true || s.value === "true" || s.value === 1;
    } else if (s.key in form) {
      (form as any)[s.key] = String(s.value ?? "");
    }
  }
  return form;
}

export function buildSiteSettingsSmtpUpdates(form: SiteSettingsSmtpForm): { key: string; value: SettingValue }[] {
  return (Object.keys(form) as SiteSettingsSmtpKey[]).map((key) => ({
    key,
    value: key === "smtp_ssl" ? form[key] : String(form[key]),
  }));
}

// ── Cloudinary settings ──

export type SiteSettingsCloudinaryKey =
  | "storage_driver"
  | "storage_local_root"
  | "storage_local_base_url"
  | "storage_cdn_public_base"
  | "storage_public_api_base"
  | "cloudinary_cloud_name"
  | "cloudinary_api_key"
  | "cloudinary_api_secret"
  | "cloudinary_folder"
  | "cloudinary_unsigned_preset";

export type SiteSettingsCloudinaryForm = { [K in SiteSettingsCloudinaryKey]: string };

export const SITE_SETTINGS_CLOUDINARY_KEYS: readonly string[] = [
  "storage_driver",
  "storage_local_root",
  "storage_local_base_url",
  "storage_cdn_public_base",
  "storage_public_api_base",
  "cloudinary_cloud_name",
  "cloudinary_api_key",
  "cloudinary_api_secret",
  "cloudinary_folder",
  "cloudinary_unsigned_preset",
] as const;

export function createSiteSettingsCloudinaryForm(): SiteSettingsCloudinaryForm {
  const form = {} as SiteSettingsCloudinaryForm;
  for (const k of SITE_SETTINGS_CLOUDINARY_KEYS) (form as any)[k] = "";
  return form;
}

export function mapSiteSettingsToCloudinaryForm(
  settings: (SiteSetting | SiteSettingRow)[] | undefined,
): SiteSettingsCloudinaryForm {
  const form = createSiteSettingsCloudinaryForm();
  if (!settings) return form;
  for (const s of settings) {
    if (s.key && s.key in form) (form as any)[s.key] = String(s.value ?? "");
  }
  return form;
}

export function buildSiteSettingsCloudinaryUpdates(
  form: SiteSettingsCloudinaryForm,
): { key: string; value: SettingValue }[] {
  return Object.entries(form).map(([key, value]) => ({ key, value }));
}

// ── Branding settings ──

export type SiteSettingsBrandingForm = {
  app_name: string;
  app_copyright: string;
  html_lang: string;
  theme_color: string;
  og_image: string;
  favicon_16: string;
  favicon_32: string;
  apple_touch_icon: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_url: string;
  twitter_card: string;
};

export const EMPTY_SITE_SETTINGS_BRANDING_FORM: SiteSettingsBrandingForm = {
  app_name: "",
  app_copyright: "",
  html_lang: "",
  theme_color: "",
  og_image: "",
  favicon_16: "",
  favicon_32: "",
  apple_touch_icon: "",
  meta_title: "",
  meta_description: "",
  og_title: "",
  og_description: "",
  og_url: "",
  twitter_card: "",
};

export const SITE_SETTINGS_BRANDING_PLACEHOLDER_KEYS: Record<keyof SiteSettingsBrandingForm, string> = {
  app_name: "appNamePlaceholder",
  app_copyright: "appCopyrightPlaceholder",
  html_lang: "htmlLangPlaceholder",
  theme_color: "themeColorPlaceholder",
  og_image: "ogImagePlaceholder",
  favicon_16: "favicon16Placeholder",
  favicon_32: "favicon32Placeholder",
  apple_touch_icon: "appleTouchIconPlaceholder",
  meta_title: "metaTitlePlaceholder",
  meta_description: "metaDescriptionPlaceholder",
  og_title: "ogTitlePlaceholder",
  og_description: "ogDescriptionPlaceholder",
  og_url: "ogUrlPlaceholder",
  twitter_card: "twitterCardPlaceholder",
};

export function normalizeSiteSettingsBrandingConfig(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      const p = JSON.parse(value);
      return typeof p === "object" && p ? p : {};
    } catch {
      return {};
    }
  }
  if (typeof value === "object") return value as Record<string, unknown>;
  return {};
}

export function brandingToSiteSettingsForm(config: unknown): SiteSettingsBrandingForm {
  const c = normalizeSiteSettingsBrandingConfig(config);
  const pick = (k: string) => (typeof c[k] === "string" ? (c[k] as string) : "");
  return {
    app_name: pick("app_name"),
    app_copyright: pick("app_copyright"),
    html_lang: pick("html_lang"),
    theme_color: pick("theme_color"),
    og_image: pick("og_image"),
    favicon_16: pick("favicon_16"),
    favicon_32: pick("favicon_32"),
    apple_touch_icon: pick("apple_touch_icon"),
    meta_title: pick("meta_title"),
    meta_description: pick("meta_description"),
    og_title: pick("og_title"),
    og_description: pick("og_description"),
    og_url: pick("og_url"),
    twitter_card: pick("twitter_card"),
  };
}

export function siteSettingsFormToBranding(form: SiteSettingsBrandingForm): Record<string, unknown> {
  return { ...form };
}

export function mergeSiteSettingsBrandingConfig(fullConfig: unknown, branding: unknown): SettingValue {
  const full = normalizeSiteSettingsBrandingConfig(fullConfig);
  const b = normalizeSiteSettingsBrandingConfig(branding);
  return { ...full, ...b } as SettingValue;
}

// ── Brand media ──

export type SiteSettingsBrandMediaData = Record<string, string>;

export const SITE_SETTINGS_BRAND_MEDIA_ITEMS: readonly {
  field: string;
  labelKey: string;
  folder: string;
}[] = [
  { field: "site_logo", labelKey: "siteLogo", folder: "uploads/brand" },
  { field: "site_logo_dark", labelKey: "siteLogoDark", folder: "uploads/brand" },
  { field: "site_favicon", labelKey: "siteFavicon", folder: "uploads/brand" },
  { field: "site_apple_touch_icon", labelKey: "siteAppleTouchIcon", folder: "uploads/brand" },
  { field: "og_image_default", labelKey: "ogImageDefault", folder: "uploads/brand" },
] as const;

export function extractSiteSettingsBrandMediaData(data: SiteSettingLike, _logoAlt: string): SiteSettingsBrandMediaData {
  const result: SiteSettingsBrandMediaData = {};
  for (const item of SITE_SETTINGS_BRAND_MEDIA_ITEMS) result[item.field] = "";
  if (!data?.value || typeof data.value !== "object") return result;
  const v = data.value as Record<string, unknown>;
  for (const item of SITE_SETTINGS_BRAND_MEDIA_ITEMS) {
    result[item.field] = typeof v[item.field] === "string" ? (v[item.field] as string) : "";
  }
  return result;
}

export function buildSiteSettingsBrandMediaLegacyValue(data: SiteSettingsBrandMediaData): SettingValue {
  return { ...data } as SettingValue;
}

// ── Locales settings ──

export type SiteSettingsLocaleRow = {
  code: string;
  label: string;
  is_active: boolean;
};

export function normalizeSiteSettingsLocaleRows(value: unknown): SiteSettingsLocaleRow[] {
  let raw: unknown[] = [];
  if (Array.isArray(value)) raw = value;
  else if (typeof value === "string") {
    try {
      const p = JSON.parse(value);
      if (Array.isArray(p)) raw = p;
    } catch {
      /* noop */
    }
  } else if (value && typeof value === "object" && Array.isArray((value as any).locales)) {
    raw = (value as any).locales;
  }
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((x) => ({
      code: String(x.code ?? "").trim(),
      label: String(x.label ?? "").trim(),
      is_active: x.is_active !== false,
    }))
    .filter((x) => !!x.code);
}

export function buildSiteSettingsLocalePayload(rows: SiteSettingsLocaleRow[]): SettingValue {
  return rows.map((r) => ({
    code: r.code,
    label: r.label,
    is_active: r.is_active,
  })) as SettingValue;
}

// ── SEO structured ──

export type SiteSettingsSimpleSeo = {
  site_title: string;
  site_description: string;
  keywords: string;
  og_type: string;
  og_image: string;
};

export type SiteSettingsAdvancedSeo = {
  site_name: string;
  title_default: string;
  title_template: string;
  og_type: string;
  description: string;
  og_image: string;
  twitter_card: string;
  noindex: boolean;
};

export const SITE_SETTINGS_SEO_OG_TYPE_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "website", labelKey: "website" },
  { value: "article", labelKey: "article" },
  { value: "product", labelKey: "product" },
  { value: "profile", labelKey: "profile" },
  { value: "business.business", labelKey: "business" },
];

export const SITE_SETTINGS_SEO_TWITTER_CARD_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "summary", labelKey: "summary" },
  { value: "summary_large_image", labelKey: "summaryLargeImage" },
  { value: "app", labelKey: "app" },
  { value: "player", labelKey: "player" },
];

export function isSiteSettingsSimpleSeoValue(raw: Record<string, unknown>): boolean {
  return "site_title" in raw || "site_description" in raw;
}

export function normalizeSiteSettingsSimpleSeo(raw: Record<string, unknown>): SiteSettingsSimpleSeo {
  const s = (k: string) => (typeof raw[k] === "string" ? (raw[k] as string) : "");
  return {
    site_title: s("site_title"),
    site_description: s("site_description"),
    keywords: s("keywords"),
    og_type: s("og_type") || "website",
    og_image: s("og_image"),
  };
}

export function normalizeSiteSettingsAdvancedSeo(raw: Record<string, unknown>): SiteSettingsAdvancedSeo {
  const s = (k: string) => (typeof raw[k] === "string" ? (raw[k] as string) : "");
  return {
    site_name: s("site_name"),
    title_default: s("title_default"),
    title_template: s("title_template"),
    og_type: s("og_type") || "website",
    description: s("description"),
    og_image: s("og_image"),
    twitter_card: s("twitter_card") || "summary_large_image",
    noindex: raw.noindex === true,
  };
}

export function toSiteSettingsAdvancedSeoObject(seo: SiteSettingsAdvancedSeo): Record<string, unknown> {
  return { ...seo };
}

// ── SEO pages structured ──

export const SITE_SETTINGS_SEO_PAGE_CONFIG: { key: string; labelKey: string; path: string }[] = [
  { key: "home", labelKey: "home", path: "/" },
  { key: "product", labelKey: "product", path: "/product" },
  { key: "sparepart", labelKey: "sparepart", path: "/sparepart" },
  { key: "service", labelKey: "service", path: "/service" },
  { key: "solutions", labelKey: "solutions", path: "/solutions" },
  { key: "about", labelKey: "about", path: "/about" },
  { key: "team", labelKey: "team", path: "/team" },
  { key: "mission_vision", labelKey: "missionVision", path: "/mission-vision" },
  { key: "quality", labelKey: "quality", path: "/quality" },
  { key: "news", labelKey: "news", path: "/news" },
  { key: "blog", labelKey: "blog", path: "/blog" },
  { key: "library", labelKey: "library", path: "/library" },
  { key: "faqs", labelKey: "faqs", path: "/faqs" },
  { key: "contact", labelKey: "contact", path: "/contact" },
  { key: "offer", labelKey: "offer", path: "/offer" },
  { key: "legal", labelKey: "legal", path: "/legal" },
];

// ── toStructuredObjectSeed (universal) ──

export function toStructuredObjectSeed<T extends Record<string, unknown>>(value: unknown, seed: T): T {
  let parsed: unknown = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return { ...seed };
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { ...seed };
  return { ...seed, ...(parsed as Record<string, unknown>) } as T;
}

// ── App locales structured ──

export const SITE_SETTINGS_AVAILABLE_LANGUAGES: { code: string; label: string }[] = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "tr", label: "Türkçe" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
];

// ── Hero structured ──

export const SITE_SETTINGS_HERO_EMPTY = {
  video_desktop: "",
  video_mobile: "",
  video_poster: "",
  headline_tr: "",
  headline_en: "",
  headline_de: "",
  subheadline_tr: "",
  subheadline_en: "",
  subheadline_de: "",
  cta_text_tr: "",
  cta_text_en: "",
  cta_text_de: "",
  cta_url: "",
};

export const SITE_SETTINGS_HERO_MEDIA_FIELDS: {
  labelKey: string;
  helperKey: string;
  folder: string;
}[] = [
  { labelKey: "videoDesktop", helperKey: "videoDesktopHelper", folder: "uploads/hero" },
  { labelKey: "videoMobile", helperKey: "videoMobileHelper", folder: "uploads/hero" },
  { labelKey: "videoPoster", helperKey: "videoPosterHelper", folder: "uploads/hero" },
];

export const SITE_SETTINGS_HERO_TEXT_FIELDS: {
  key: string;
  labelKey: string;
  colSpan2?: boolean;
  textarea?: boolean;
  placeholderKey?: string;
}[] = [
  { key: "headline_de", labelKey: "headlineDe" },
  { key: "headline_en", labelKey: "headlineEn" },
  { key: "headline_tr", labelKey: "headlineTr" },
  { key: "subheadline_de", labelKey: "subheadlineDe", textarea: true },
  { key: "subheadline_en", labelKey: "subheadlineEn", textarea: true },
  { key: "subheadline_tr", labelKey: "subheadlineTr", textarea: true },
  { key: "cta_text_de", labelKey: "ctaTextDe" },
  { key: "cta_text_en", labelKey: "ctaTextEn" },
  { key: "cta_text_tr", labelKey: "ctaTextTr" },
  { key: "cta_url", labelKey: "ctaUrl", colSpan2: true, placeholderKey: "ctaUrlPlaceholder" },
];

// ── Home backgrounds ──

export const SITE_SETTINGS_BACKGROUND_EMPTY_ITEM = {
  url: "",
  alt: "",
};

// ── Business hours ──

export const SITE_SETTINGS_BUSINESS_HOUR_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const SITE_SETTINGS_BUSINESS_HOURS_EMPTY = SITE_SETTINGS_BUSINESS_HOUR_DAYS.map((day) => ({
  day,
  open: "09:00",
  close: "18:00",
  closed: day === "saturday" || day === "sunday",
}));

// ── Company profile ──

export const SITE_SETTINGS_COMPANY_PROFILE_EMPTY = {
  company_name: "",
  slogan: "",
  about: "",
};

export const SITE_SETTINGS_COMPANY_PROFILE_FIELDS: {
  key: string;
  labelKey: string;
  colSpan2?: boolean;
  textarea?: boolean;
}[] = [
  { key: "company_name", labelKey: "companyName" },
  { key: "slogan", labelKey: "slogan" },
  { key: "about", labelKey: "about", colSpan2: true, textarea: true },
];

// ── Contact info ──

export const SITE_SETTINGS_CONTACT_EMPTY = {
  company_name: "",
  phone: "",
  phone_2: "",
  email: "",
  email_2: "",
  address: "",
  city: "",
  country: "",
  working_hours: "",
  maps_embed_url: "",
  maps_lat: "",
  maps_lng: "",
};

export const SITE_SETTINGS_CONTACT_FIELDS: {
  key: string;
  labelKey: string;
  colSpan2?: boolean;
  textarea?: boolean;
}[] = [
  { key: "company_name", labelKey: "companyName" },
  { key: "phone", labelKey: "phone" },
  { key: "phone_2", labelKey: "phone2" },
  { key: "email", labelKey: "email" },
  { key: "email_2", labelKey: "email2" },
  { key: "address", labelKey: "address", colSpan2: true, textarea: true },
  { key: "city", labelKey: "city" },
  { key: "country", labelKey: "country" },
  { key: "working_hours", labelKey: "workingHours" },
  { key: "maps_embed_url", labelKey: "mapsEmbedUrl", colSpan2: true },
  { key: "maps_lat", labelKey: "mapsLat" },
  { key: "maps_lng", labelKey: "mapsLng" },
];

// ── Socials ──

export const SITE_SETTINGS_SOCIAL_KEYS: readonly string[] = [
  "instagram",
  "facebook",
  "linkedin",
  "youtube",
  "x",
  "github",
  "tiktok",
  "pinterest",
] as const;

// ── UI Header ──

export const SITE_SETTINGS_UI_HEADER_EMPTY = {
  nav_home: "",
  nav_products: "",
  nav_services: "",
  nav_news: "",
  nav_about: "",
  nav_contact: "",
  cta_label: "",
};

export const SITE_SETTINGS_UI_HEADER_FIELDS: {
  key: string;
  labelKey: string;
}[] = [
  { key: "nav_home", labelKey: "navHome" },
  { key: "nav_products", labelKey: "navProducts" },
  { key: "nav_services", labelKey: "navServices" },
  { key: "nav_news", labelKey: "navNews" },
  { key: "nav_about", labelKey: "navAbout" },
  { key: "nav_contact", labelKey: "navContact" },
  { key: "cta_label", labelKey: "ctaLabel" },
];
