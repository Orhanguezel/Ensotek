// =============================================================
// FILE: src/modules/ip-blocklist/admin.routes.ts
// Final URLs (mounted under /api/admin):
//   GET    /api/admin/ip-blocklist
//   POST   /api/admin/ip-blocklist
//   DELETE /api/admin/ip-blocklist/:id
// =============================================================

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { requireAuth as requireAuthMw } from '@/common/middleware/auth';
import { requireAdmin as requireAdminMw } from '@/common/middleware/roles';
import { listBlockedIpsAdmin, addBlockedIpAdmin, deleteBlockedIpAdmin } from './admin.controller';

const BASE = '/ip-blocklist';

export async function registerIpBlocklistAdmin(app: FastifyInstance) {
  const requireAuth = (app as any).requireAuth as
    | ((req: FastifyRequest, reply: FastifyReply) => Promise<void>)
    | undefined;

  const requireAdmin = (app as any).requireAdmin as
    | ((req: FastifyRequest, reply: FastifyReply) => Promise<void>)
    | undefined;

  const adminGuard = async (req: FastifyRequest, reply: FastifyReply) => {
    if (typeof requireAuth === 'function') {
      await requireAuth(req, reply);
      if (reply.sent) return;
    } else {
      await requireAuthMw(req, reply);
      if (reply.sent) return;
    }

    if (typeof requireAdmin === 'function') {
      await requireAdmin(req, reply);
    } else {
      await requireAdminMw(req, reply);
    }
  };

  const ph = { preHandler: adminGuard, config: { auth: true, admin: true } };

  app.get(BASE, ph, listBlockedIpsAdmin);
  app.post(BASE, ph, addBlockedIpAdmin);
  app.delete(`${BASE}/:id`, ph, deleteBlockedIpAdmin);
}
