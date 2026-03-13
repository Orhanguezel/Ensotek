import type { FastifyInstance } from 'fastify';
import { addContentReaction, getContentReactionSummary } from './controller';

const BASE = '/content_reactions';

export async function registerContentReactions(app: FastifyInstance) {
  app.get(`${BASE}/summary`, { config: { public: true } }, getContentReactionSummary);
  app.post(`${BASE}`, { config: { public: true } }, addContentReaction);
}
