// =============================================================
// FILE: src/modules/ip-blocklist/service.ts
// In-memory cache with 60s TTL for fast IP blocklist lookups
// =============================================================

import { repoListBlockedIps } from './repository';

let cache: Set<string> | null = null;
let cacheExpiresAt = 0;

export async function isIpBlocked(ip: string): Promise<boolean> {
  const now = Date.now();
  if (!cache || now >= cacheExpiresAt) {
    const rows = await repoListBlockedIps();
    cache = new Set(rows.map((r) => r.ip));
    cacheExpiresAt = now + 60_000; // 60 seconds TTL
  }
  return cache.has(ip);
}

export function invalidateBlocklistCache(): void {
  cache = null;
}
