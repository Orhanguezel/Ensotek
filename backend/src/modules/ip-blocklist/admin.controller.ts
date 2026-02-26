// =============================================================
// FILE: src/modules/ip-blocklist/admin.controller.ts
// =============================================================

import type { RouteHandler } from 'fastify';
import { z } from 'zod';
import { repoListBlockedIps, repoAddIp, repoDeleteIp } from './repository';
import { invalidateBlocklistCache } from './service';

const addIpSchema = z.object({
  ip: z
    .string()
    .min(1)
    .max(64)
    .regex(
      /^(\d{1,3}\.){3}\d{1,3}$|^([0-9a-fA-F:]+)$/,
      'Invalid IP address format',
    ),
  note: z.string().max(255).optional().nullable(),
});

function getRequesterIp(req: Parameters<RouteHandler>[0]): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.socket?.remoteAddress ?? '';
}

export const listBlockedIpsAdmin: RouteHandler = async (_req, reply) => {
  const items = await repoListBlockedIps();
  return reply.send({ items, total: items.length });
};

export const addBlockedIpAdmin: RouteHandler = async (req, reply) => {
  const parsed = addIpSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: 'invalid_body', issues: parsed.error.flatten() } });
  }

  const { ip, note } = parsed.data;

  // Prevent admin from blocking their own IP
  const requesterIp = getRequesterIp(req);
  if (requesterIp && requesterIp === ip) {
    return reply.code(400).send({ error: { message: 'cannot_block_own_ip' } });
  }

  const adminUser = (req as any).user;
  const blocked_by = adminUser?.sub ?? adminUser?.id ?? null;

  const row = await repoAddIp({ ip, note: note ?? null, blocked_by });
  invalidateBlocklistCache();

  return reply.code(201).send(row);
};

export const deleteBlockedIpAdmin: RouteHandler = async (req, reply) => {
  const id = Number((req.params as any)?.id);
  if (!id || isNaN(id)) {
    return reply.code(400).send({ error: { message: 'invalid_id' } });
  }

  const deleted = await repoDeleteIp(id);
  if (!deleted) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  invalidateBlocklistCache();
  return reply.code(200).send({ ok: true });
};
