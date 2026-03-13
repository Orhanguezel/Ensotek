import type { FastifyRequest } from 'fastify';
import { repoAddContentReaction, repoGetContentReactionSummary } from './repository';
import { ContentReactionCreateSchema, ContentReactionTargetSchema } from './validation';

export async function getContentReactionSummary(req: FastifyRequest) {
  const query = ContentReactionTargetSchema.parse(req.query);
  return repoGetContentReactionSummary(req.server, query);
}

export async function addContentReaction(req: FastifyRequest) {
  const body = ContentReactionCreateSchema.parse((req as any).body);
  return repoAddContentReaction(req.server, body);
}
