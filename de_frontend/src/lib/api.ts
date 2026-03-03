// =============================================================
// lib/api.ts — Shared API types
// =============================================================

/** Standard paginated response from backend */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Standard list query params */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  language?: string;
}

/** Standard API error shape */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

/** Standard API success response (non-paginated) */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Locale param — sent as query or header */
export type Locale = 'tr' | 'en' | 'de';

/** Common i18n fields pattern */
export interface I18nBase {
  locale: string;
  created_at: string;
  updated_at: string;
}

/** Common base entity fields */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/** Reorder request body */
export interface ReorderRequest {
  items: { id: string; order: number }[];
}
