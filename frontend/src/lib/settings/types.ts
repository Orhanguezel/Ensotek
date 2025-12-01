import type { SupportedLocale, TranslatedLabel } from "@/types/common";

/** Çok dilli basit alan */
export type TranslatedField = Partial<Record<SupportedLocale, string>>;

/** Görsel nesnesi */
export interface ISettingsImage {
  url: string;
  thumbnail: string;
  webp?: string;
  publicId?: string;
  _id?: string;
}

/** Etiketli link */
export interface ILabeledLink {
  label: TranslatedLabel;
  href?: string;
  url?: string;
  icon?: string;
  tenant?: string;
}

/** Navbar marka yazıları için nested yapı */
export interface INavbarLogoTextValue {
  title: { label: TranslatedLabel; url?: string };
  slogan: { label: TranslatedLabel; url?: string };
}

/** Setting value union */
export type ISettingValue =
  | string
  | string[]
  | TranslatedLabel
  | Record<string, ILabeledLink>
  | Record<string, any>
  | INavbarLogoTextValue
  | { href: string; icon: string }
  | { phone: string };

/** Ana model */
export interface ISetting {
  key: string;
  tenant: string;
  value: ISettingValue;
  isActive: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  images?: ISettingsImage[];
}

/** BE genel response kalıpları */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
};
export type ApiMessage<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

/** Sorgu & mutasyon parametreleri */
export type SettingsListParams = { locale?: SupportedLocale };

export type UpsertSettingInput = {
  key: string;
  value: any;
  isActive?: boolean;
  locale?: SupportedLocale; // header için opsiyonel
};

export type UploadSettingsImagesInput = {
  key: string;
  files: File[];
  locale?: SupportedLocale; // header için opsiyonel
};

export type UpdateSettingsImagesInput = {
  key: string;
  files: File[];
  removedImages?: string[];
  locale?: SupportedLocale; // header için opsiyonel
};

export type DeleteSettingInput = {
  key: string;
  locale?: SupportedLocale; // header için opsiyonel
};
