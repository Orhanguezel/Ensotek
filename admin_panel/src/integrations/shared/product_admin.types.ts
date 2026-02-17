// =============================================================
// FILE: src/integrations/shared/product_admin.types.ts
// Ürün Admin Tipleri — backend products + product_i18n schema ile uyumlu
// =============================================================

export type ProductItemType = 'product' | 'sparepart';

export interface AdminProductDto {
  id: string;
  locale: string;
  item_type: ProductItemType;
  title: string;
  slug: string;
  description?: string | null;
  alt?: string | null;
  tags: string[];
  price: number | string;
  stock_quantity: number;
  product_code?: string | null;
  category_id: string;
  sub_category_id?: string | null;
  image_url?: string | null;
  storage_asset_id?: string | null;
  images: string[];
  storage_image_ids: string[];
  is_active: boolean | 0 | 1;
  is_featured: boolean | 0 | 1;
  order_num: number;
  rating: number | string;
  review_count: number;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminProductListParams {
  q?: string;
  locale?: string;
  item_type?: ProductItemType;
  category_id?: string;
  sub_category_id?: string;
  is_active?: boolean | string;
  is_featured?: boolean | string;
  limit?: number;
  offset?: number;
  sort?: 'price' | 'title' | 'created_at' | 'updated_at' | 'order_num';
  order?: 'asc' | 'desc';
}

export interface AdminProductListResult {
  items: AdminProductDto[];
  total: number;
}

export interface AdminProductCreatePayload {
  locale: string;
  title: string;
  slug: string;
  price: number;
  stock_quantity?: number;
  product_code?: string;
  description?: string;
  alt?: string;
  tags?: string[];
  category_id: string;
  sub_category_id?: string | null;
  image_url?: string | null;
  storage_asset_id?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  item_type?: ProductItemType;
}

export type AdminProductUpdatePayload = Partial<AdminProductCreatePayload>;

export interface ProductCategoryOption {
  id: string;
  name: string;
  slug: string;
  locale: string;
  module_key: string;
}

export interface ProductSubcategoryOption {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  locale: string;
}
