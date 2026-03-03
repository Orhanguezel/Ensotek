// =============================================================
// FILE: src/modules/sites/router.ts
// =============================================================

import type { FastifyInstance } from 'fastify';
import { listSites, getSiteBySlug, getSiteLocales } from './controller';

const BASE = '/sites';

export async function registerSites(app: FastifyInstance) {
  app.get(BASE, { config: { public: true } }, listSites);
  app.get(`${BASE}/:idOrSlug`, { config: { public: true } }, getSiteBySlug);
  app.get(`${BASE}/:id/locales`, { config: { public: true } }, getSiteLocales);
}
