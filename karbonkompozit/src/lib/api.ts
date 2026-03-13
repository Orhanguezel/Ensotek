export type {
  PaginatedResponse,
  PaginationParams,
  BaseEntity,
  ApiError,
} from '@ensotek/core/types';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type Locale = 'tr' | 'en';
