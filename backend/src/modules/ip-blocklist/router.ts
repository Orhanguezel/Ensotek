// =============================================================
// FILE: src/modules/ip-blocklist/router.ts
// =============================================================

import type { FastifyInstance } from 'fastify';
import { registerIpBlocklistAdmin } from './admin.routes';

export async function registerIpBlocklist(api: FastifyInstance) {
  await api.register(registerIpBlocklistAdmin, {});
}
