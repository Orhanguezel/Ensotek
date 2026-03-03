// Re-export from shared core — single source of truth
export type { SubCategory } from '@ensotek/core/types';

// Client-side query params (not in core)
export interface SubCategoryListParams {
  page?: number;
  limit?: number;
  category_id?: string;
  is_active?: boolean;
  language?: string;
}
