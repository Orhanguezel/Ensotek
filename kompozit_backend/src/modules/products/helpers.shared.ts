// =============================================================
// FILE: src/modules/products/helpers.shared.ts
// Shared helpers for products controller + admin.controller
// =============================================================
import { toNum } from '@/modules/_shared';
import type { ProductItemType } from './schema';

export type ItemType = ProductItemType;

export const normalizeItemType = (raw?: unknown, fallback: ItemType = 'product'): ItemType => {
  if (raw === 'sparepart') return 'sparepart';
  if (raw === 'kompozit') return 'kompozit';
  if (raw === 'product') return 'product';
  return fallback;
};

export function normalizeProduct(row: any) {
  if (!row) return row;
  const p: any = { ...row };

  p.price = toNum(p.price);
  p.rating = toNum(p.rating);
  p.review_count = toNum(p.review_count) ?? 0;
  p.stock_quantity = toNum(p.stock_quantity) ?? 0;

  if (typeof p.images === 'string') {
    try { p.images = JSON.parse(p.images); } catch {}
  }
  if (!Array.isArray(p.images)) p.images = [];

  if (typeof p.tags === 'string') {
    try { p.tags = JSON.parse(p.tags); } catch {}
  }
  if (!Array.isArray(p.tags)) p.tags = [];

  if (typeof p.specifications === 'string') {
    try { p.specifications = JSON.parse(p.specifications); } catch {}
  }

  if (typeof p.storage_image_ids === 'string') {
    try { p.storage_image_ids = JSON.parse(p.storage_image_ids); } catch {}
  }
  if (!Array.isArray(p.storage_image_ids)) p.storage_image_ids = [];

  return p;
}
