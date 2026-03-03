// =============================================================
// FILE: src/modules/sites/admin.routes.ts
// =============================================================

import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import {
  adminListSites,
  adminGetSiteById,
  adminCreateSite,
  adminUpdateSite,
  adminDeleteSite,
  adminListSiteLocales,
  adminCreateSiteLocale,
  adminUpdateSiteLocale,
  adminDeleteSiteLocale,
} from './admin.controller';

const BASE = '/sites';

export async function registerSitesAdmin(app: FastifyInstance) {
  // Sites CRUD
  app.get(BASE, { preHandler: [requireAuth] }, adminListSites);
  app.get(`${BASE}/:id`, { preHandler: [requireAuth] }, adminGetSiteById);
  app.post(BASE, { preHandler: [requireAuth] }, adminCreateSite);
  app.patch(`${BASE}/:id`, { preHandler: [requireAuth] }, adminUpdateSite);
  app.delete(`${BASE}/:id`, { preHandler: [requireAuth] }, adminDeleteSite);

  // Site Locales
  app.get(`${BASE}/:id/locales`, { preHandler: [requireAuth] }, adminListSiteLocales);
  app.post(`${BASE}/:id/locales`, { preHandler: [requireAuth] }, adminCreateSiteLocale);
  app.patch(
    `${BASE}/:siteId/locales/:localeId`,
    { preHandler: [requireAuth] },
    adminUpdateSiteLocale,
  );
  app.delete(
    `${BASE}/:siteId/locales/:localeId`,
    { preHandler: [requireAuth] },
    adminDeleteSiteLocale,
  );
}
