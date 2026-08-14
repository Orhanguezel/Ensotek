import type { FastifyInstance } from 'fastify';
import { createCatalogRequestPublic, verifyCatalogRequestPublic } from './controller';

export async function registerCatalogRequests(app: FastifyInstance) {
  app.post('/catalog-requests', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, createCatalogRequestPublic);
  app.get('/catalog-requests/verify', { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }, verifyCatalogRequestPublic);
}
