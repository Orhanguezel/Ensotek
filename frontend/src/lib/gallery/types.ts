import type { SupportedLocale } from "@/types/common";

/* ================== Shared models ================== */

// Çok dilli alanlar
export type TranslatedField = {
  [lang in SupportedLocale]?: string;
};

// Görsel tipi
export interface IGalleryImage {
  url: string;
  thumbnail: string;
  webp?: string;
  publicId?: string;
  _id?: string;
}

// Ana model
export interface IGallery {
  _id: string;
  type: "image" | "video";
  title: TranslatedField;
  slug: string;
  summary: TranslatedField;
  content: TranslatedField;
  tenant: string;
  tags: string[];
  images: IGalleryImage[];
  category:
    | string
    | {
        _id: string;
        name: TranslatedField;
        slug?: string;
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

// Kategori modeli
export interface GalleryCategory {
  _id: string;
  name: TranslatedField;
  slug: string;
  description?: TranslatedField;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ================== API envelopes & params ================== */

// Standart API zarfı (about vb. modüllerle aynı)
export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

// /gallery/published için sorgu parametreleri
export interface GalleryListParams {
  locale?: SupportedLocale;
  page?: number;
  limit?: number;
  sort?: string;
  q?: string;

  // genişletilmiş filtreler
  type?: "image" | "video";
  /** id veya slug — backend tek param "category" ile her ikisini de kabul ediyor */
  category?: string;
  /** convenience: slug olarak gönderip client’ta category’e map’liyoruz */
  categorySlug?: string;
  tags?: string | string[];
  select?: string;    // "title,summary,slug,images,category,tags"
  populate?: string;  // "category"
}

// /gallery/slug/:slug için parametreler
export interface GalleryBySlugParams {
  slug: string;
  locale?: SupportedLocale;
}
