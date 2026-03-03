// =============================================================
// lib/api.ts — Re-exports shared base types from @ensotek/core
// Single source of truth: packages/core/src/types/common.type.ts
// =============================================================

export type {
  PaginatedResponse,
  PaginationParams,
  BaseEntity,
  ApiError,
} from '@ensotek/core/types';

// Client-only extras (not in core)
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ReorderRequest {
  items: { id: string; order: number }[];
}

export type Locale = 'de' | 'en' | 'tr';
