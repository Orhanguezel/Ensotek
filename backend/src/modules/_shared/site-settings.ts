import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db/client';
import { siteSettings } from '@/modules/siteSettings/schema';

const GLOBAL_LOCALE = '*';

export async function getGlobalSiteSettingsMap(keys: readonly string[]): Promise<Map<string, string>> {
  if (!keys.length) return new Map();

  const rows = await db
    .select({ key: siteSettings.key, value: siteSettings.value })
    .from(siteSettings)
    .where(and(inArray(siteSettings.key, keys as string[]), eq(siteSettings.locale, GLOBAL_LOCALE)));

  const out = new Map<string, string>();
  for (const row of rows) {
    out.set(String(row.key), String(row.value ?? ''));
  }
  return out;
}
