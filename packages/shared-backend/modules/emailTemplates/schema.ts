import {
  mysqlTable,
  char,
  varchar,
  longtext,
  tinyint,
  datetime,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const emailTemplates = mysqlTable(
  'email_templates',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    template_key: varchar('template_key', { length: 100 }).notNull(),
    template_name: varchar('template_name', { length: 255 }),
    subject: varchar('subject', { length: 500 }),
    content_html: longtext('content_html'),
    variables: longtext('variables'),
    is_active: tinyint('is_active').notNull().default(1).$type<boolean>(),
    created_at: datetime('created_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex('email_templates_key_uq').on(t.template_key),
    index('email_templates_active_idx').on(t.is_active),
  ],
);

export const emailTemplatesI18n = mysqlTable(
  'email_templates_i18n',
  {
    id: char('id', { length: 36 }).primaryKey().notNull(),
    template_id: char('template_id', { length: 36 }).notNull(),
    locale: varchar('locale', { length: 10 }).notNull(),
    template_name: varchar('template_name', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 500 }).notNull(),
    content: longtext('content').notNull(),
    created_at: datetime('created_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: datetime('updated_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`).$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex('email_templates_i18n_template_locale_uq').on(t.template_id, t.locale),
    index('email_templates_i18n_locale_idx').on(t.locale),
  ],
);

export type EmailTemplateRow = typeof emailTemplates.$inferSelect;
export type EmailTemplateI18nRow = typeof emailTemplatesI18n.$inferSelect;
