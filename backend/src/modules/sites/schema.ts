// =============================================================
// FILE: src/modules/sites/schema.ts
// sites + site_locales Drizzle schema
// =============================================================

import {
  mysqlTable,
  char,
  varchar,
  tinyint,
  datetime,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// =============================================================
// PARENT TABLO: sites
// =============================================================
export const sites = mysqlTable(
  'sites',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),

    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    domain: varchar('domain', { length: 255 }).notNull(),

    is_active: tinyint('is_active', { unsigned: true }).notNull().default(1),

    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex('uniq_sites_slug').on(t.slug),
    uniqueIndex('uniq_sites_domain').on(t.domain),
    index('sites_active_idx').on(t.is_active),
  ],
);

// =============================================================
// TABLO: site_locales
// =============================================================
export const siteLocales = mysqlTable(
  'site_locales',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),

    site_id: char('site_id', { length: 36 })
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

    locale_code: varchar('locale_code', { length: 8 }).notNull(),

    is_default: tinyint('is_default', { unsigned: true }).notNull().default(0),
    is_active: tinyint('is_active', { unsigned: true }).notNull().default(1),

    created_at: datetime('created_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex('uniq_site_locales_site_locale').on(t.site_id, t.locale_code),
    index('site_locales_site_idx').on(t.site_id),
    index('site_locales_locale_idx').on(t.locale_code),
    index('site_locales_active_idx').on(t.is_active),
  ],
);

export type SiteRow = typeof sites.$inferSelect;
export type NewSiteRow = typeof sites.$inferInsert;

export type SiteLocaleRow = typeof siteLocales.$inferSelect;
export type NewSiteLocaleRow = typeof siteLocales.$inferInsert;
