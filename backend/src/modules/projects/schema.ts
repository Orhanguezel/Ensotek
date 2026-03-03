import {
  mysqlTable,
  char,
  varchar,
  tinyint,
  datetime,
  int,
  index,
  uniqueIndex,
  date,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { longtext } from '@/modules/_shared';



/* =========================================================
 * projects (parent)
 * ======================================================= */
export const projects = mysqlTable(
  'projects',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),

    is_published: tinyint('is_published').notNull().default(0),
    is_featured: tinyint('is_featured').notNull().default(0),
    display_order: int('display_order').notNull().default(0),

    // main visual
    featured_image: varchar('featured_image', { length: 500 }),
    featured_image_asset_id: char('featured_image_asset_id', { length: 36 }),

    // ✅ Ensotek proje alanları
    category: varchar('category', { length: 100 }),         // "Su Soğutma Kulesi", "HVAC", "Proses Soğutma"
    product_type: varchar('product_type', { length: 150 }), // "CTP Kaportalı Açık Tip", "Kapalı Tip"
    location: varchar('location', { length: 255 }),         // "İstanbul", "Kahramanmaraş"
    client_name: varchar('client_name', { length: 255 }),
    unit_count: int('unit_count'),                          // kaç adet kule
    fan_count: int('fan_count'),                            // kaç fanlı
    start_date: date('start_date'),   // YYYY-MM-DD
    complete_date: date('complete_date'), // YYYY-MM-DD
    completion_time_label: varchar('completion_time_label', { length: 100 }),
    services: longtext('services'),   // JSON-string string[] (sunulan hizmetler/özellikler)
    website_url: varchar('website_url', { length: 500 }),   // müşteri web sitesi
    youtube_url: varchar('youtube_url', { length: 500 }),   // YouTube tanıtım/montaj videosu

    // JSON-string: string[] (teknik etiketler: FRP, GRP, CTP, HVAC…)
    techs: longtext('techs'),

    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    index('projects_created_idx').on(t.created_at),
    index('projects_updated_idx').on(t.updated_at),
    index('projects_published_idx').on(t.is_published),
    index('projects_featured_idx').on(t.is_featured),
    index('projects_display_order_idx').on(t.display_order),
    index('projects_featured_asset_idx').on(t.featured_image_asset_id),

    // ✅ helpful indexes for FE filtering
    index('projects_category_idx').on(t.category),
    index('projects_client_idx').on(t.client_name),
    index('projects_location_idx').on(t.location),
    index('projects_product_type_idx').on(t.product_type),
  ],
);

/* =========================================================
 * projects_i18n
 * ======================================================= */
export const projectsI18n = mysqlTable(
  'projects_i18n',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    project_id: char('project_id', { length: 36 }).notNull(),
    locale: varchar('locale', { length: 8 }).notNull(),

    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),

    summary: longtext('summary'),
    // JSON-string: { html, description, key_features[], technologies_used[], design_highlights[] }
    content: longtext('content').notNull(),

    featured_image_alt: varchar('featured_image_alt', { length: 255 }),
    meta_title: varchar('meta_title', { length: 255 }),
    meta_description: varchar('meta_description', { length: 500 }),

    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex('projects_i18n_project_locale_uq').on(t.project_id, t.locale),
    uniqueIndex('projects_i18n_locale_slug_uq').on(t.locale, t.slug),

    index('projects_i18n_project_idx').on(t.project_id),
    index('projects_i18n_locale_idx').on(t.locale),
    index('projects_i18n_slug_idx').on(t.slug),
  ],
);

/* =========================================================
 * project_images (gallery parent)
 * ======================================================= */
export const projectImages = mysqlTable(
  'project_images',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    project_id: char('project_id', { length: 36 }).notNull(),

    asset_id: char('asset_id', { length: 36 }).notNull(),
    image_url: varchar('image_url', { length: 500 }),

    display_order: int('display_order').notNull().default(0),
    is_active: tinyint('is_active').notNull().default(1),

    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    index('project_images_project_idx').on(t.project_id),
    index('project_images_asset_idx').on(t.asset_id),
    index('project_images_active_idx').on(t.is_active),
    index('project_images_order_idx').on(t.display_order),
  ],
);

/* =========================================================
 * project_images_i18n
 * ======================================================= */
export const projectImagesI18n = mysqlTable(
  'project_images_i18n',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    image_id: char('image_id', { length: 36 }).notNull(),
    locale: varchar('locale', { length: 8 }).notNull(),

    alt: varchar('alt', { length: 255 }),
    caption: longtext('caption'),

    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex('project_images_i18n_image_locale_uq').on(t.image_id, t.locale),
    index('project_images_i18n_image_idx').on(t.image_id),
    index('project_images_i18n_locale_idx').on(t.locale),
  ],
);

/* =========================================================
 * TYPES (exports you said missing)
 * ======================================================= */
export type ProjectRow = InferSelectModel<typeof projects>;
export type NewProjectRow = InferInsertModel<typeof projects>;

export type ProjectI18nRow = InferSelectModel<typeof projectsI18n>;
export type NewProjectI18nRow = InferInsertModel<typeof projectsI18n>;

export type ProjectImageRow = InferSelectModel<typeof projectImages>;
export type NewProjectImageRow = InferInsertModel<typeof projectImages>;

export type ProjectImageI18nRow = InferSelectModel<typeof projectImagesI18n>;
export type NewProjectImageI18nRow = InferInsertModel<typeof projectImagesI18n>;
