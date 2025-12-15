// =============================================================
// FILE: src/modules/catalog/admin.routes.ts
// Ensotek – Catalog Request Admin Routes
//   - Auth + Admin guard
// =============================================================

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requireAuth } from "@/common/middleware/auth";
import { requireAdmin } from "@/common/middleware/roles";

import {
  listCatalogRequestsAdmin,
  getCatalogRequestAdmin,
  updateCatalogRequestAdmin,
  removeCatalogRequestAdmin,
  resendCatalogMailAdmin,
} from "./admin.controller";

const BASE = "/catalog-requests";

export async function registerCatalogAdmin(app: FastifyInstance) {
  const adminGuard = async (req: FastifyRequest, reply: FastifyReply) => {
    await requireAuth(req, reply);
    if (reply.sent) return;
    await requireAdmin(req, reply);
  };

  app.get(
    `${BASE}`,
    { preHandler: adminGuard, config: { auth: true, admin: true } },
    listCatalogRequestsAdmin,
  );

  app.get(
    `${BASE}/:id`,
    { preHandler: adminGuard, config: { auth: true, admin: true } },
    getCatalogRequestAdmin,
  );

  app.patch(
    `${BASE}/:id`,
    { preHandler: adminGuard, config: { auth: true, admin: true } },
    updateCatalogRequestAdmin,
  );

  app.delete(
    `${BASE}/:id`,
    { preHandler: adminGuard, config: { auth: true, admin: true } },
    removeCatalogRequestAdmin,
  );

  app.post(
    `${BASE}/:id/resend`,
    { preHandler: adminGuard, config: { auth: true, admin: true } },
    resendCatalogMailAdmin,
  );
}
