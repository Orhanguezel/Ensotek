// =============================================================
// FILE: src/modules/categories/helpers.ts
// Category modülüne özel helper'lar (schema'ya bağımlı)
// =============================================================
import { db } from '@/db/client';
import { categories, categoryI18n } from './schema';
import { and, asc, desc, eq, type SQL } from 'drizzle-orm';

/**
 * Category view fields (public + admin)
 */
export const CATEGORY_VIEW_FIELDS = {
  id: categories.id,
  module_key: categories.module_key,
  locale: categoryI18n.locale,
  name: categoryI18n.name,
  slug: categoryI18n.slug,
  description: categoryI18n.description,
  image_url: categories.image_url,
  storage_asset_id: categories.storage_asset_id,
  alt: categoryI18n.alt,
  icon: categories.icon,
  is_active: categories.is_active,
  is_featured: categories.is_featured,
  display_order: categories.display_order,
  i18n_data: categoryI18n.i18n_data,
  created_at: categories.created_at,
  updated_at: categories.updated_at,
} as const;

/**
 * Order whitelist
 */
export const ORDER_WHITELIST = {
  display_order: categories.display_order,
  name: categoryI18n.name,
  created_at: categories.created_at,
  updated_at: categories.updated_at,
} as const;

export type OrderColumn = keyof typeof ORDER_WHITELIST;

/**
 * Parse order/sort from query string
 */
export function parseOrder(q: Record<string, unknown>): {
  primary: SQL;
  primaryCol: OrderColumn;
} {
  const sort = typeof q.sort === 'string' ? q.sort : undefined;
  const dir1 = typeof q.order === 'string' ? q.order : undefined;
  const combined = typeof q.order === 'string' && q.order.includes('.') ? q.order : undefined;

  let col: OrderColumn = 'created_at';
  let dir: 'asc' | 'desc' = 'desc';

  if (combined) {
    const [c, d] = combined.split('.');
    if (c && c in ORDER_WHITELIST) col = c as OrderColumn;
    if (d === 'asc' || d === 'desc') dir = d;
  } else {
    if (sort && sort in ORDER_WHITELIST) col = sort as OrderColumn;
    if (dir1 === 'asc' || dir1 === 'desc') dir = dir1;
  }

  const colExpr = ORDER_WHITELIST[col];
  const primary = dir === 'asc' ? asc(colExpr) : desc(colExpr);
  return { primary, primaryCol: col };
}

/**
 * Fetch category view by ID and locale
 * i18n_data JSON string parse edilir
 */
export async function fetchCategoryViewByIdAndLocale(id: string, locale: string) {
  const rows = await db
    .select(CATEGORY_VIEW_FIELDS)
    .from(categories)
    .innerJoin(categoryI18n, eq(categoryI18n.category_id, categories.id))
    .where(and(eq(categories.id, id), eq(categoryI18n.locale, locale)))
    .limit(1);

  const row = rows[0] ?? null;
  if (!row) return null;

  // Parse i18n_data JSON string to object
  if (row.i18n_data && typeof row.i18n_data === 'string') {
    try {
      (row as any).i18n_data = JSON.parse(row.i18n_data);
    } catch {
      (row as any).i18n_data = {};
    }
  }

  return row;
}
