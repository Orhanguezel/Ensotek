import type { SupportedLocale } from "@/types/common";

/** Çok dilli alanlar için ortak tip (partial — içerik strict okunur) */
export type TranslatedField = Partial<Record<SupportedLocale, string>>;

/** Sosyal bağlantılar */
export interface ISocialLink {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

/** Görsel nesne */
export interface ICompanyImage {
  url: string;
  thumbnail: string;
  webp?: string;
  publicId?: string;
  _id?: string;
}

/** Address referansı (ID veya populate edilmiş obje) */
export type AddressRef =
  | string
  | {
      _id?: string;
      title?: string;
      name?: string;
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      phone?: string;
      [k: string]: unknown;
    };

/** Ana Company modeli */
export interface ICompany {
  _id?: string;
  companyName: TranslatedField;
  companyDesc?: TranslatedField;

  tenant: string;
  language: SupportedLocale;
  taxNumber: string;
  handelsregisterNumber?: string;
  registerCourt?: string;

  website?: string;
  email: string;
  phone: string;

  addresses?: AddressRef[];
  bankDetails: {
    bankName: string;
    iban: string;
    swiftCode: string;
  };

  managers?: string[];
  images?: ICompanyImage[];
  socialLinks?: ISocialLink;

  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/** BE genel response kalıbı */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
};

/* ---------- Admin payload tipleri (RTK mutations için) ---------- */
export type CreateCompanyPayload = Record<string, any>;

export type UpdateCompanyPayload = {
  _id: string;
  /** Yeni yüklenecek dosyalar (File[]) veya string referanslar gelebilir; File olanlar gönderilir */
  images?: Array<File | string>;
  /** Silinecek görsel publicId/_id listesi */
  removedImages?: string[];
} & Record<string, any>;
