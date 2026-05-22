import { mysqlTable, char, varchar, int, boolean, datetime, longtext } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const footerSections = mysqlTable("footer_sections", {
  id:            char("id", { length: 36 }).primaryKey().notNull(),
  site_id:       char("site_id", { length: 36 }),
  is_active:     boolean("is_active").notNull().default(true),
  display_order: int("display_order").notNull().default(0),
  created_at:    datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at:    datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
});

export const footerSectionsI18n = mysqlTable("footer_sections_i18n", {
  id:          char("id", { length: 36 }).primaryKey().notNull(),
  section_id:  char("section_id", { length: 36 }).notNull(),
  locale:      varchar("locale", { length: 10 }).notNull(),
  title:       varchar("title", { length: 150 }).notNull(),
  slug:        varchar("slug", { length: 255 }).notNull(),
  description: longtext("description"),
  created_at:  datetime("created_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  updated_at:  datetime("updated_at", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
});

export type FooterSectionRow = typeof footerSections.$inferSelect;
export type NewFooterSectionRow = typeof footerSections.$inferInsert;

export type FooterSectionI18nRow = typeof footerSectionsI18n.$inferSelect;
export type NewFooterSectionI18nRow = typeof footerSectionsI18n.$inferInsert;
