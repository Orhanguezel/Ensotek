// src/common/middleware/roles.ts

import type { FastifyReply, FastifyRequest } from "fastify";
import { db } from "@/db/client";
import { users } from "@/modules/auth/schema";
import { eq } from "drizzle-orm";

function hasAdminInPayload(u: any): boolean {
  if (!u) return false;
  if (u.is_admin === true) return true;
  if (String(u.role ?? "").toLowerCase() === "admin") return true;
  if (Array.isArray(u.roles) && u.roles.some((r) => String(r).toLowerCase() === "admin")) return true;
  return false;
}

/** Admin guard:
 * - payload.role / payload.roles / payload.is_admin kontrolü
 * - yoksa DB users.role alanindan fallback doğrulama
 */
export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const u = (req as any)?.user;
  if (hasAdminInPayload(u)) return;

  const userId = String(u?.id ?? u?.sub ?? "").trim();
  if (!userId) {
    reply.code(403).send({ error: { message: "forbidden" } });
    return;
  }

  const rows = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (rows[0] && String(rows[0].role ?? "").toLowerCase() === "admin") return;

  reply.code(403).send({ error: { message: "forbidden" } });
  return;
}
