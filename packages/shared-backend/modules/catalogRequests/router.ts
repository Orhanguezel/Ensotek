import type { FastifyInstance } from 'fastify';
import { createCatalogRequestPublic } from './controller';

export async function registerCatalogRequests(app: FastifyInstance) {
  app.post('/catalog-requests', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, createCatalogRequestPublic);
}
