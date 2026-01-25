// =============================================================
// FILE: src/modules/profiles/controller.ts
// FINAL — No instanceof (TS2358 safe) + strict catch handling
// =============================================================

import type { RouteHandler, FastifyRequest } from 'fastify';
import '@fastify/jwt';
import { db } from '@/db/client';
import { eq } from 'drizzle-orm';
import { profiles, type ProfileRow, type ProfileInsert } from './schema';
import { profileUpsertSchema, type ProfileUpsertInput } from './validation';

export type ProfileUpsertRequest = { profile: ProfileUpsertInput };

type JwtUser = { sub?: unknown };

function getUserId(req: FastifyRequest): string {
  // requireAuth sonrası fastify-jwt payload'ını req.user'a yazar.
  const payload = (req as unknown as { user?: JwtUser }).user;
  const subVal = payload?.sub;

  if (typeof subVal !== 'string' || subVal.length === 0) {
    throw new Error('unauthorized');
  }

  return subVal; // UUID
}

// -------------------------------------------
// ZodError guard (NO instanceof) — TS2358 safe
// Zod v3 error shape: { name: 'ZodError', issues: [...] }
// -------------------------------------------
type ZodIssueLike = { path?: unknown; message?: unknown; code?: unknown };
type ZodErrorLike = { name: unknown; issues: unknown };

function isZodErrorLike(e: unknown): e is { issues: ZodIssueLike[] } {
  if (!e || typeof e !== 'object') return false;

  const obj = e as ZodErrorLike;

  // name === 'ZodError'
  if (obj.name !== 'ZodError') return false;

  // issues is array
  if (!('issues' in obj) || !Array.isArray((obj as any).issues)) return false;

  return true;
}

/** GET /profiles/v1/me */
export const getMyProfile: RouteHandler = async (req, reply) => {
  try {
    const userId = getUserId(req);

    const rows = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);

    const row: ProfileRow | undefined = rows[0];
    return reply.send(row ?? null);
  } catch (e: unknown) {
    req.log.error(e);

    const msg = e instanceof Error ? e.message : '';
    if (msg === 'unauthorized') {
      return reply.status(401).send({ error: { message: 'unauthorized' } });
    }

    return reply.status(500).send({ error: { message: 'profile_fetch_failed' } });
  }
};

/** PUT /profiles/v1/me (upsert) */
export const upsertMyProfile: RouteHandler<{ Body: ProfileUpsertRequest }> = async (req, reply) => {
  try {
    const userId = getUserId(req);

    // Validation (throws ZodError on invalid)
    const input = profileUpsertSchema.parse(req.body?.profile ?? {});

    const set: Partial<ProfileInsert> = {
      ...(input.full_name !== undefined ? { full_name: input.full_name } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.avatar_url !== undefined ? { avatar_url: input.avatar_url } : {}),
      ...(input.address_line1 !== undefined ? { address_line1: input.address_line1 } : {}),
      ...(input.address_line2 !== undefined ? { address_line2: input.address_line2 } : {}),
      ...(input.city !== undefined ? { city: input.city } : {}),
      ...(input.country !== undefined ? { country: input.country } : {}),
      ...(input.postal_code !== undefined ? { postal_code: input.postal_code } : {}),
    };

    const existing = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(profiles)
        .set({
          ...set,
          updated_at: new Date(),
        })
        .where(eq(profiles.id, userId));
    } else {
      const insertValues: ProfileInsert = {
        id: userId,
        ...set,

        // Eğer schema'da created_at / updated_at NOT NULL ise burada set edin.
        // created_at: new Date(),
        // updated_at: new Date(),
      } as ProfileInsert;

      await db.insert(profiles).values(insertValues);
    }

    const [row] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);

    return reply.send(row ?? null);
  } catch (e: unknown) {
    req.log.error(e);

    // Zod validation error (shape-based)
    if (isZodErrorLike(e)) {
      return reply.status(400).send({
        error: { message: 'validation_error', details: e.issues },
      });
    }

    const msg = e instanceof Error ? e.message : '';
    if (msg === 'unauthorized') {
      return reply.status(401).send({ error: { message: 'unauthorized' } });
    }

    return reply.status(500).send({ error: { message: 'profile_upsert_failed' } });
  }
};
