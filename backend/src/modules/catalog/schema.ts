// =============================================================
// FILE: src/modules/catalog/schema.ts
// Ensotek – Catalog Request Module Schema (Drizzle ORM)
// =============================================================

import {
  mysqlTable,
  char,
  varchar,
  tinyint,
  datetime,
  int,
  customType,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

import {
longtext
} from '@/modules/_shared';

export const catalogRequestsTable = mysqlTable(
  "catalog_requests",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),

    status: varchar("status", { length: 32 }).notNull().default("new"),

    locale: varchar("locale", { length: 10 }),
    country_code: varchar("country_code", { length: 2 }),

    customer_name: varchar("customer_name", { length: 255 }).notNull(),
    company_name: varchar("company_name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),

    message: longtext("message"),

    consent_marketing: tinyint("consent_marketing").notNull().default(0),
    consent_terms: tinyint("consent_terms").notNull().default(0),

    admin_notes: longtext("admin_notes"),

    // Müşteriye katalog maili gönderim zamanı
    email_sent_at: datetime("email_sent_at", { fsp: 3 }),

    created_at: datetime("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime("updated_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    {
      idx_status_created: {
        columns: [t.status, t.created_at],
        name: "catalog_requests_status_created_idx",
      },
    } as any,
    {
      idx_email: {
        columns: [t.email],
        name: "catalog_requests_email_idx",
      },
    } as any,
    {
      idx_locale: {
        columns: [t.locale],
        name: "catalog_requests_locale_idx",
      },
    } as any,
    {
      idx_country: {
        columns: [t.country_code],
        name: "catalog_requests_country_idx",
      },
    } as any,
  ],
);

export type CatalogRequestRow = typeof catalogRequestsTable.$inferSelect;
export type NewCatalogRequestRow = typeof catalogRequestsTable.$inferInsert;
