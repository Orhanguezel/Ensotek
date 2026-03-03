// Backend: sub_categories + sub_category_i18n
export interface SubCategory {
  id: string;
  category_id: string;
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
}

export interface SubCategoryListParams {
  page?: number;
  limit?: number;
  category_id?: string;
  is_active?: boolean;
  language?: string;
}
