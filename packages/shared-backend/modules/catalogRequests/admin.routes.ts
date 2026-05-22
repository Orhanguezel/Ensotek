import type { FastifyInstance } from 'fastify';
import {
  deleteCatalogRequestAdmin,
  getCatalogRequestAdmin,
  listCatalogRequestsAdmin,
  patchCatalogRequestAdmin,
  resendCatalogRequestAdmin,
} from './admin.controller';

export async function registerCatalogRequestsAdmin(app: FastifyInstance) {
  const base = '/catalog-requests';
  app.get(base, listCatalogRequestsAdmin);
  app.get(`${base}/:id`, getCatalogRequestAdmin);
  app.patch(`${base}/:id`, patchCatalogRequestAdmin);
  app.delete(`${base}/:id`, deleteCatalogRequestAdmin);
  app.post(`${base}/:id/resend`, resendCatalogRequestAdmin);
}
