import {
  mysqlTable,
  char,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';

export const leadCatalogDownloads = mysqlTable(
  'lead_catalog_downloads',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    status: varchar('status', { length: 32 }).notNull().default('new'),
    locale: varchar('locale', { length: 10 }),
    country_code: varchar('country_code', { length: 10 }),
    customer_name: varchar('customer_name', { length: 255 }).notNull(),
    company_name: varchar('company_name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 64 }),
    message: text('message'),
    catalog_url: varchar('catalog_url', { length: 1000 }),
    consent_marketing: boolean('consent_marketing').notNull().default(false),
    consent_terms: boolean('consent_terms').notNull().default(false),
    admin_notes: text('admin_notes'),
    email_sent_at: timestamp('email_sent_at', { fsp: 3 }),
    ip: varchar('ip', { length: 64 }),
    user_agent: varchar('user_agent', { length: 512 }),
    created_at: timestamp('created_at', { fsp: 3 }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { fsp: 3 }).notNull().defaultNow().onUpdateNow(),
  },
  (t) => [
    index('lead_catalog_status_idx').on(t.status),
    index('lead_catalog_locale_idx').on(t.locale),
    index('lead_catalog_email_idx').on(t.email),
    index('lead_catalog_created_idx').on(t.created_at),
  ],
);

export type CatalogRequestRow = typeof leadCatalogDownloads.$inferSelect;
export type CatalogRequestInsert = typeof leadCatalogDownloads.$inferInsert;
