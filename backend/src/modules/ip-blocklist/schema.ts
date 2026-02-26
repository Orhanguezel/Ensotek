// =============================================================
// FILE: src/modules/ip-blocklist/schema.ts
// =============================================================

import { mysqlTable, bigint, varchar, datetime, uniqueIndex, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const ipBlocklist = mysqlTable(
  'ip_blocklist',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    ip: varchar('ip', { length: 64 }).notNull(),
    note: varchar('note', { length: 255 }),
    blocked_by: varchar('blocked_by', { length: 64 }),
    created_at: datetime('created_at', { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
  },
  (t) => [
    uniqueIndex('ip_blocklist_ip_unique').on(t.ip),
    index('ip_blocklist_created_idx').on(t.created_at),
  ],
);

export type IpBlocklistRow = typeof ipBlocklist.$inferSelect;
export type IpBlocklistInsert = typeof ipBlocklist.$inferInsert;
