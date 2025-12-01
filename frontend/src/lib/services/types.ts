import type { SupportedLocale } from "@/types/common";

/** Çok dilli alan */
export type TranslatedField = Partial<Record<SupportedLocale, string>>;

/** Görsel nesne */
export interface IServicesImage {
  url: string;
  thumbnail: string;
  webp?: string;
  publicId?: string;
  _id?: string;
}

/** Kategori */
export interface ServicesCategory {
  _id: string;
  name: TranslatedField;
  slug: string;
  description?: TranslatedField;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Services (makale/haber) modeli */
export interface IServices {
  _id: string;
  title: TranslatedField;
  slug: string;
  summary: TranslatedField;
  content: TranslatedField;
  tenant: string;
  tags: string[];
  images: IServicesImage[];
  category: string | { _id: string; name: TranslatedField };
  author: string;
  isPublished: boolean;
  isActive: boolean;
  publishedAt?: string;
  comments: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Listeleme parametreleri */
export interface ServicesListParams {
  locale?: SupportedLocale;
  limit?: number;
  offset?: number;
  sort?: string;              // örn: "-publishedAt"
  isPublished?: boolean;      // default: true
  q?: string;                 // arama
}

/** API zarf tipleri */
export type ApiEnvelope<T> = { data: T; message?: string; success?: boolean };
export type ApiMessage<T>  = { data: T; message?: string };
