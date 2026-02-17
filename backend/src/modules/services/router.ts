// src/modules/services/router.ts
// =============================================================

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { serviceListQuerySchema } from "./validation";
import {
  listServicesPublic,
  getServicePublic,
  getServiceBySlugPublic,
  listServiceImagesPublic,
} from "./controller";

const BASE = "/services";

export async function registerServices(app: FastifyInstance) {
  const api = app.withTypeProvider<ZodTypeProvider>();

  api.get(
    `${BASE}`,
    {
      config: { public: true },
      schema: {
        querystring: serviceListQuerySchema,
        tags: ["Services"],
        description: "Public service list",
      },
    },
    listServicesPublic as any,
  );
  api.get(`${BASE}/:id`, { config: { public: true } }, getServicePublic as any);
  api.get(
    `${BASE}/by-slug/:slug`,
    { config: { public: true } },
    getServiceBySlugPublic as any,
  );

  // gallery (public)
  app.get(
    `${BASE}/:id/images`,
    { config: { public: true } },
    listServiceImagesPublic,
  );
}
