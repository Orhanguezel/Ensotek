// =============================================================
// FILE: src/modules/ip-blocklist/repository.ts
// =============================================================

import { db } from '@/db/client';
import { asc, eq, sql } from 'drizzle-orm';
import { ipBlocklist, type IpBlocklistRow } from './schema';

export async function repoListBlockedIps(): Promise<IpBlocklistRow[]> {
  return db.select().from(ipBlocklist).orderBy(asc(ipBlocklist.created_at));
}

export async function repoIsIpBlocked(ip: string): Promise<boolean> {
  const rows = await db
    .select({ id: ipBlocklist.id })
    .from(ipBlocklist)
    .where(eq(ipBlocklist.ip, ip))
    .limit(1);
  return rows.length > 0;
}

export async function repoAddIp(params: {
  ip: string;
  note?: string | null;
  blocked_by?: string | null;
}): Promise<IpBlocklistRow> {
  await db
    .insert(ipBlocklist)
    .values({ ip: params.ip, note: params.note ?? null, blocked_by: params.blocked_by ?? null })
    .onDuplicateKeyUpdate({ set: { note: sql`VALUES(note)` } });

  const [row] = await db
    .select()
    .from(ipBlocklist)
    .where(eq(ipBlocklist.ip, params.ip))
    .limit(1);

  return row as IpBlocklistRow;
}

export async function repoDeleteIp(id: number): Promise<boolean> {
  const res = await db.delete(ipBlocklist).where(eq(ipBlocklist.id, id)).execute();
  const affected = (res as any)?.affectedRows != null ? Number((res as any).affectedRows) : 0;
  return affected > 0;
}
