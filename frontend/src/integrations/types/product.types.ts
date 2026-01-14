// =============================================================
// FILE: src/integrations/types/product.types.ts
// Public Products + FAQ + Specs + Reviews
// - ✅ ProductListQueryParams includes orderDir (fix)
// =============================================================

/** Backend'deki boolLike ile uyumlu tip */
import type { BoolLike } from '@/integrations/types';

export type ProductItemType = 'product' | 'sparepart';

export type ProductSpecifications = {
  dimensions?: string;
  weight?: string;
  thickness?: string;
  surfaceFinish?: string;
  warranty?: string;
  installationTime?: string;
};

export type ProductCategoryRef = {
  id: string;
  name: string | null;
  slug: string | null;
};

export type ProductSubCategoryRef = {
  id: string;
  name: string | null;
  slug: string | null;
  category_id: string | null;
};

export type ProductDto = {
  id: string;
  locale: string;
  item_type?: ProductItemType;

  title: string;
  slug: string;
  price: number;
  description?: string | null;

  category_id: string;
  sub_category_id?: string | null;

  image_url?: string | null;
  storage_asset_id?: string | null;
  alt?: string | null;
  images: string[];
  storage_image_ids: string[];

  is_active: boolean;
  is_featured: boolean;

  tags: string[];
  specifications?: ProductSpecifications | null;

  // 🔢 Drag & drop sıralama için
  order_num: number;

  product_code?: string | null;
  stock_quantity: number;
  rating: number;
  review_count: number;

  meta_title?: string | null;
  meta_description?: string | null;

  created_at: string;
  updated_at: string;

  // public controller ekstra döndürüyor
  category?: ProductCategoryRef | null;
  sub_category?: ProductSubCategoryRef | null;
};

export type SortDir = 'asc' | 'desc';

export type ProductListQueryParams = {
  // paging
  limit?: number;
  offset?: number;

  // sorting
  sort?: string;
  order?: string;
  orderDir?: SortDir;

  // filters
  q?: string;
  slug?: string;

  category_id?: string;
  sub_category_id?: string;

  only_active?: BoolLike;

  item_type?: ProductItemType;
  locale?: string;

  // future-proof
  [key: string]: any;
};

export type ProductListResponse = {
  items: ProductDto[];
  total: number;
};

export type GetProductByIdOrSlugParams = {
  idOrSlug: string;
  locale?: string;
  item_type?: ProductItemType;
};

export type GetProductBySlugParams = {
  slug: string;
  locale?: string;
  item_type?: ProductItemType;
};

export type GetProductByIdParams = {
  id: string;
  locale?: string;
  item_type?: ProductItemType;
};

/* ---------- Public FAQ / Spec / Review tipleri ---------- */

export type ProductFaqDto = {
  id: string;
  product_id: string;
  locale: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductFaqListQueryParams = {
  product_id?: string;
  only_active?: BoolLike;
  locale?: string;
  item_type?: ProductItemType;
};

export type ProductSpecCategory = 'physical' | 'material' | 'service' | 'custom';

export type ProductSpecDto = {
  id: string;
  product_id: string;
  locale: string;
  name: string;
  value: string;
  category: ProductSpecCategory;
  order_num: number;
  created_at: string;
  updated_at: string;
};

export type ProductSpecListQueryParams = {
  product_id?: string;
  locale?: string;
  item_type?: ProductItemType;
};

export type ProductReviewDto = {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  is_active: boolean;
  customer_name: string | null;
  review_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductReviewListQueryParams = {
  product_id: string;
  only_active?: BoolLike;
  limit?: number;
  offset?: number;
  locale?: string;
  item_type?: ProductItemType;
};
