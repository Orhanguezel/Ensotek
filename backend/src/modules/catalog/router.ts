// =============================================================
// FILE: src/modules/catalog/router.ts
// Ensotek – Catalog Request Public Routes
// =============================================================

import type { FastifyInstance } from "fastify";
import { createCatalogRequestPublic } from "./controller";

export async function registerCatalog(app: FastifyInstance) {
  app.post(
    "/catalog-requests",
    { config: { public: true } },
    createCatalogRequestPublic,
  );
}
