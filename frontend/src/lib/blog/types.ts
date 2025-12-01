import type { SupportedLocale } from "@/types/common";

/** Çok dilli alanlar için ortak tip */
export type TranslatedField = Partial<Record<SupportedLocale, string>>;

export interface IBlogImage {
  url: string;
  thumbnail: string;
  webp?: string;
  publicId?: string;
  _id?: string;
}

/** Ana "Blog" içeriği */
export interface IBlog {
  _id: string;
  title: TranslatedField;
  slug: string;                // public unique
  summary: TranslatedField;
  content: TranslatedField;

  tenant: string;
  tags: string[];
  images: IBlogImage[];

  category:
  | string
  | {
    _id: string;
    name: TranslatedField;
  };

  author: string;
  isPublished: boolean;
  isActive: boolean;
  publishedAt?: string;

  comments: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Kategori modeli */
export interface BlogCategory {
  _id: string;
  name: TranslatedField;
  slug: string;
  description?: TranslatedField;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** BE genel response kalıbı */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
};

/** Listeleme parametreleri (public) */
export type BlogListParams = {
  page?: number;
  limit?: number;
  categorySlug?: string;
  q?: string;
  sort?: string;           // opsiyonel: "-publishedAt" vb.
  locale?: SupportedLocale;
};

/** Slug ile tek kayıt */
export type BlogBySlugParams = {
  slug: string;
  locale?: SupportedLocale;
};
