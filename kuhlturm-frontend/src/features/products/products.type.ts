// =============================================================
// modules/products/products.type.ts
// Backend: products + product_i18n + product_specs + product_faqs
//          + product_reviews + product_options + product_stock
//          + product_images
// =============================================================

import type { PaginatedResponse, PaginationParams } from '@/lib/api';

export type ProductItemType = 'product' | 'sparepart';

// ── Main Product ─────────────────────────────────────────────

export interface Product {
  id: string;
  item_type: ProductItemType;
  category_id: string;
  sub_category_id: string | null;

  price: string;           // decimal → string from backend
  image_url: string | null;
  storage_asset_id: string | null;
  images: string[];         // JSON array of image URLs
  storage_image_ids: string[];

  is_active: boolean;
  is_featured: boolean;
  order_num: number;

  product_code: string | null;
  stock_quantity: number;
  rating: string;           // decimal → string
  review_count: number;

  // i18n (coalesced by backend)
  title: string;
  slug: string;
  description: string | null;
  alt: string | null;
  tags: string[];
  specifications: Record<string, string> | null;  // inline JSON specs
  meta_title: string | null;
  meta_description: string | null;
  locale: string;

  created_at: string;
  updated_at: string;

  // Relations (optional, populated by backend)
  category?: { id: string; name: string; slug: string };
  sub_category?: { id: string; name: string; slug: string } | null;
  product_images?: ProductImage[];
}

export type ProductListResponse = PaginatedResponse<Product>;

// ── Product Images ───────────────────────────────────────────

export interface ProductImage {
  id: string;
  product_id: string;
  locale: string;
  image_url: string;
  image_asset_id: string | null;
  title: string | null;
  alt: string | null;
  caption: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Product Specs ────────────────────────────────────────────

export type SpecCategory = 'physical' | 'material' | 'service' | 'custom';

export interface ProductSpec {
  id: string;
  product_id: string;
  locale: string;
  name: string;
  value: string;
  category: SpecCategory;
  order_num: number;
  created_at: string;
  updated_at: string;
}

// ── Product FAQs ─────────────────────────────────────────────

export interface ProductFaq {
  id: string;
  product_id: string;
  locale: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Product Reviews ──────────────────────────────────────────

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  is_active: boolean;
  customer_name: string | null;
  review_date: string;
  created_at: string;
  updated_at: string;
}

// ── Product Options ──────────────────────────────────────────

export interface ProductOption {
  id: string;
  product_id: string;
  option_name: string;
  option_values: unknown[];  // flexible JSON array
  created_at: string;
  updated_at: string;
}

// ── Product Stock ────────────────────────────────────────────

export interface ProductStock {
  id: string;
  product_id: string;
  stock_content: string;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
  order_item_id: string | null;
}

// ── Query Params ─────────────────────────────────────────────

export interface ProductListParams extends PaginationParams {
  category_id?: string;
  sub_category_id?: string;
  item_type?: ProductItemType;
  locale?: string;
  is_active?: boolean;
  is_featured?: boolean;
  search?: string;
  min_price?: number;
  max_price?: number;
}

export interface ProductSubResourceParams {
  product_id?: string;
  locale?: string;
  page?: number;
  limit?: number;
}

export interface ProductDetailParams {
  locale?: string;
  item_type?: ProductItemType;
}
