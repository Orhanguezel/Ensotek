export interface CustomPage {
  id: string;
  module_key: string;
  is_published: boolean;
  featured: boolean;
  display_order: number;
  order_num: number;
  featured_image: string | null;
  featured_image_asset_id: string | null;
  image_url: string | null;
  storage_asset_id: string | null;
  images: string[];
  storage_image_ids: string[];
  category_id: string | null;
  sub_category_id: string | null;
  
  // i18n
  title: string;
  slug: string;
  content: string; // HTML content, usually JSON string in our BE or just HTML
  summary: string | null;
  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string | null;
  locale_resolved: string | null;
  created_at: string;
  updated_at: string;

  // Resolved fields from join
  category_name?: string;
  category_slug?: string;
  sub_category_name?: string;
  sub_category_slug?: string;
}

export interface CustomPageListParams {
  limit?: number;
  page?: number;
  module_key?: string;
  category_id?: string;
  sub_category_id?: string;
  is_published?: boolean | number;
  featured?: boolean | number;
}

export interface CustomPageListResponse {
  data: CustomPage[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
