// Backend: categories + category_i18n
export interface Category {
  id: string;
  module_key: string;       // 'product' | 'blog' | 'library' | 'services' | etc.
  image_url: string | null;
  storage_asset_id: string | null;
  alt: string | null;
  icon: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  // i18n (coalesced)
  name: string;
  slug: string;
  description: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
  // Relations (optional, populated by backend)
  sub_categories?: SubCategoryCompact[];
}

export interface SubCategoryCompact {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryListParams {
  page?: number;
  limit?: number;
  module_key?: string;
  is_active?: boolean;
  is_featured?: boolean;
  language?: string;
}
