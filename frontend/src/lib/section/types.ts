import type { SupportedLocale } from "@/types/common";

/** Çok dilli metin alanı */
export type TranslatedLabel = Partial<Record<SupportedLocale, string>>;

/** Tek model: tenant + sectionKey benzersiz */
export interface ISection {
  tenant: string;
  /** Bölge/kapsam: "home", "layout", "blog" ... */
  zone?: string;
  /** Bileşen grubu: "hero", "about", "header", "footer", "sidebar" ... */
  component?: string;

  sectionKey: string;             // örn: "hero", "about"
  icon?: string;                  // örn: "MdViewModule"
  label?: TranslatedLabel;
  description?: TranslatedLabel;
  variant?: string;               // "slider", "classic", ...
  enabled: boolean;
  order: number;
  roles?: string[];
  params?: Record<string, any>;
  required?: boolean;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/** API zarfı (backend çoğunlukla { success, message, data } döndürüyor) */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
};

/** Public liste sorgusu */
export type SectionListQuery = {
  locale?: SupportedLocale;       // Accept-Language
  /** virgülle veya dizi halinde anahtarlar; örn: "hero,about" ya da ["hero","about"] */
  keys?: string | string[];
  /** tek veya çoklu component filtresi; örn: "header" ya da ["header","footer"] */
  components?: string | string[];
  /** zone filtresi; örn: "home", "layout" */
  zone?: string;
  revalidate?: number;            // Next.js server cache (saniye)
};

/** Admin liste (yetki gerektirir) */
export type SectionAdminListQuery = {
  locale?: SupportedLocale;
  revalidate?: number;
  headers?: Record<string, string>;
  // opsiyonel filtre/paging
  zone?: string;
  components?: string | string[];
  keys?: string | string[];
  page?: number;
  limit?: number;
  /** örn: "order:asc,createdAt:asc" */
  sort?: string;
};

/** Create / Update payload tipleri */
export type SectionCreatePayload =
  Pick<ISection, "sectionKey"> &
  Partial<Omit<ISection, "tenant" | "sectionKey">>;

export type SectionUpdatePayload =
  Partial<Omit<ISection, "tenant" | "sectionKey">>;
