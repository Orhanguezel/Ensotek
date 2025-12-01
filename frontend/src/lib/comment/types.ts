import type { SupportedLocale } from "@/types/common";

/* ---------- Ortak API zarfları ---------- */
export interface Pagination {
  page: number;
  pages: number;
  total: number;
}
export interface ApiListResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  pagination: Pagination;
}
export interface ApiItemResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* ---------- Domain Tipleri ---------- */
export type TranslatedLabel = { [key in SupportedLocale]: string };

export type CommentContentType =
  | "news"
  | "blog"
  | "product"
  | "articles"
  | "services"
  | "about"
  | "references"
  | "library"
  | "company"
  | "ensotekprod"
  | "sparepart"
  | "portfolio"
  | "menuitem"
  | "global"; // testimonial için

export type CommentType =
  | "comment"
  | "testimonial"
  | "review"
  | "question"
  | "answer"
  | "rating";

export interface IComment {
  _id?: any;
  userId?: any;
  name?: string;
  profileImage?: string | { thumbnail?: string; url?: string };
  email?: string;

  tenant: string;
  contentType: CommentContentType;
  contentId: any;

  type?: CommentType; // default "comment"
  label?: string;
  text: string;

  reply?: {
    text: TranslatedLabel;
    createdAt?: string;
  };

  isPublished: boolean;
  isActive: boolean;
  rating?: number;

  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Client payload tipleri ---------- */
export type CreateCommentBody = {
  name?: string;
  email?: string;
  text?: string;
  comment?: string;
  label?: string;
  contentType: CommentContentType;
  /** testimonial dışı zorunlu */
  contentId?: string;
  /** "comment" | "testimonial" | ... — testimonial için contentType otomatik "global"e sabitlenir (BE) */
  type?: CommentType;
  rating?: number; // 1..5
};

export type ReplyPayload = {
  id: string; // comment id
  text: Partial<TranslatedLabel>;
};
