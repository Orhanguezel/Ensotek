import type { SupportedLocale } from "@/types/common";

/** Çok dilli metin alanı */
export type TranslatedField = {
  [lang in SupportedLocale]?: string;
};

export interface IFaq {
  _id?: string;
  question: TranslatedField;
  answer: TranslatedField;
  tenant?: string;
  category?: string;
  isPublished: boolean;
  publishedAt?: string | Date;
  embedding?: number[];
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/* —— Generic API zarfları (diğer modüllerle uyumlu) ——————————————— */
export type ApiEnvelope<T> = { data: T; message?: string };
export type ApiMessage<T = any> = { data: T; message?: string };

/* —— Listeleme parametreleri ——————————————————————————————— */
export type FaqListParams = {
  locale?: SupportedLocale;
  limit?: number;
  page?: number;
  sort?: string;    // örn: "-publishedAt"
  q?: string;       // arama
  category?: string;
  isPublished?: boolean;
};

/* —— Admin işlemleri için input tipleri ————————————————————— */
export type CreateFaqInput = {
  locale?: SupportedLocale;
  payload: Omit<IFaq, "_id" | "createdAt" | "updatedAt">;
};

export type UpdateFaqInput = {
  id: string;
  locale?: SupportedLocale;
  payload: Partial<IFaq>;
};

export type DeleteFaqInput = {
  id: string;
  locale?: SupportedLocale;
};

export type TogglePublishInput = {
  id: string;
  isPublished: boolean;
  locale?: SupportedLocale;
};

/* —— Ask (AI / KB) ———————————————————————————————————————— */
export type AskFaqInput = {
  question: string;
  locale?: SupportedLocale;
};

export type AskFaqOutput = {
  answer: string;
};
