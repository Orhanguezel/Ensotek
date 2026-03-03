// src/modules/_shared/common.ts

import { z } from 'zod';

/* ================= type guards ================= */
export function isRec(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
export function isStr(v: unknown): v is string {
  return typeof v === 'string';
}

/* ================= string array helpers ================= */
export function packStringArray(arr: string[] | undefined | null): string | null {
  if (!arr || arr.length === 0) return null;
  return JSON.stringify(arr);
}

/* ================= order parsing ================= */
export function parseOrder(
  orderParam?: string,
  sort?: string,
  order?: string,
): { col: string; dir: 'asc' | 'desc' } | undefined {
  const param = orderParam ?? (sort && order ? `${sort}.${order}` : undefined);
  if (!param) return undefined;
  const parts = param.split('.');
  const col = parts[0];
  const dir = parts[1] === 'asc' ? 'asc' : 'desc';
  if (!col) return undefined;
  return { col, dir };
}

/* ================= generic list query type ================= */
export type ListQuery = {
  order?: string;
  sort?: string;
  orderBy?: string;
  orderDir?: string;
  limit?: string | number;
  offset?: string | number;
  is_published?: string | boolean | number;
  is_featured?: string | boolean | number;
  q?: string;
  slug?: string;
  category?: string;
  client?: string;
  view?: 'card' | 'detail';
  select?: string;
  [key: string]: unknown;
};

/* ================= project types ================= */
export type ProjectMerged = {
  id: string;
  is_published: number;
  is_featured: number;
  display_order: number;
  featured_image: string | null;
  featured_image_asset_id: string | null;

  // Ensotek industrial fields
  category: string | null;
  product_type: string | null;
  location: string | null;
  client_name: string | null;
  unit_count: number | null;
  fan_count: number | null;
  start_date: string | null;
  complete_date: string | null;
  completion_time_label: string | null;
  services: string | null;   // JSON string[]
  website_url: string | null;
  youtube_url: string | null;
  techs: string | null;      // JSON string[]

  created_at: Date | string;
  updated_at: Date | string;

  // i18n (merged)
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  locale_resolved: string | null;
};

export type ProjectListParams = {
  locale: string;
  defaultLocale: string;
  limit?: number;
  offset?: number;
  orderParam?: string;
  sort?: 'created_at' | 'updated_at' | 'display_order';
  order?: string;
  is_published?: unknown;
  is_featured?: unknown;
  q?: string;
  slug?: string;
  category?: string;
  location?: string;
  client?: string;
};

/* ================= DTO mappers ================= */
/** Kart görünümü: content alanı olmadan hafif liste öğesi */
export function toCard(item: Record<string, unknown>): Record<string, unknown> {
  const { content: _content, ...rest } = item;
  return rest;
}

/** Detay görünümü: tüm alanlar */
export function toDetail(item: Record<string, unknown>): Record<string, unknown> {
  return item;
}

/* ================= validators ================= */
export const REL_OR_URL = z
  .string()
  .min(1)
  .refine(
    (v) =>
      v.startsWith('/') || // relative
      /^https?:\/\/.+/i.test(v), // absolute url
    'URL veya / ile başlayan relative path olmalıdır',
  );
