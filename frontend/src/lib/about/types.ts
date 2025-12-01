import type { SupportedLocale } from "@/types/common";

/** Çok dilli alan: dil -> string (opsiyonel) */
export type TranslatedField = Partial<Record<SupportedLocale, string>>;

export interface IAboutImage {
  url: string;
  thumbnail: string;
  webp?: string;
  publicId?: string;
}

/**
 * Backend modeline paralel About tipi (FE tarafında tarih/string)
 * - slug & slugLower çok dilli
 * - category populate edilmiş gelebilir
 */
export interface IAbout {
  _id: string;
  title: TranslatedField;
  tenant: string;

  slug: TranslatedField;
  slugLower?: TranslatedField;

  summary: TranslatedField;
  content: TranslatedField;
  images: IAboutImage[];
  tags: string[];
  author?: string;

  category:
    | string
    | {
        _id: string;
        name: TranslatedField;
        slug: string;
      };

  isPublished: boolean;
  publishedAt?: string; // ISO
  comments: string[];
  isActive: boolean;
  order: number;

  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface AboutCategory {
  _id: string;
  name: TranslatedField;
  slug: string;
  description?: TranslatedField;
  isActive: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/** BE response zarfı (generic) */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
};

/** Public list query params (BE doğrulamasına uygun) */
export type AboutListParams = {
  /** Kategori ObjectId (query: ?category=) */
  category?: string;

  /** Sadece aktif locale’de metni olan kayıtları getir (query: ?onlyLocalized=true) */
  onlyLocalized?: boolean;

  /** Dil override (header: accept-language) — normalde interceptor set eder */
  locale?: SupportedLocale;

  /**
   * Aşağıdakiler BE public endpoint’inde şu an kullanılmıyor.
   * İleride ihtiyaç olursa geriye dönük uyumluluk için burada duruyor.
   */
  page?: number;
  limit?: number;
  sort?: string;
  q?: string;
  categorySlug?: string; // (varsa)
};

/** Slug ile tek kayıt (locale-aware endpoint) */
export type AboutBySlugParams = {
  slug: string;
  locale?: SupportedLocale;
};
