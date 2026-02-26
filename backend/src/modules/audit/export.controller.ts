// =============================================================
// FILE: src/modules/audit/export.controller.ts
// Ensotek – Audit Export Controller (CSV / JSON)
//   - exportRequestLogsAdmin
//   - exportAuthEventsAdmin
// =============================================================

import type { RouteHandler } from 'fastify';
import { db } from '@/db/client';
import { auditRequestLogs, auditAuthEvents } from './schema';
import { users } from '@/modules/auth/schema';
import { and, desc, eq, like, or, gte, lte, sql, type SQL } from 'drizzle-orm';

import { auditExportQuery, isTruthyBoolLike } from './validation';
import { excludeLocalhostCond } from './repository';

const MAX_EXPORT_ROWS = 50_000;

/* ---- CSV helpers ---- */
function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function csvRow(values: unknown[]): string {
  return values.map(csvEscape).join(',') + '\r\n';
}

function parseDateTime3(s: string) {
  return sql`CAST(${s} AS DATETIME(3))`;
}

/* ---- Export Request Logs ---- */
export const exportRequestLogsAdmin: RouteHandler = async (req, reply) => {
  const parsed = auditExportQuery.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: 'invalid_query', issues: parsed.error.flatten() } });
  }

  const q = parsed.data;
  const format = q.format;

  // Build WHERE conditions
  const conds: (SQL | undefined)[] = [];

  if (q.q?.trim()) {
    const s = `%${q.q.trim()}%`;
    conds.push(or(like(auditRequestLogs.path, s), like(auditRequestLogs.url, s)));
  }
  if (q.method?.trim()) conds.push(eq(auditRequestLogs.method, q.method.trim().toUpperCase()));
  if (typeof q.status_code === 'number') conds.push(eq(auditRequestLogs.status_code, q.status_code));
  if (q.user_id) conds.push(eq(auditRequestLogs.user_id, q.user_id));
  if (q.ip) conds.push(eq(auditRequestLogs.ip, q.ip));
  if (typeof q.only_admin !== 'undefined' && isTruthyBoolLike(q.only_admin)) {
    conds.push(eq(auditRequestLogs.is_admin, 1));
  }
  if (typeof q.exclude_localhost !== 'undefined' && isTruthyBoolLike(q.exclude_localhost)) {
    conds.push(excludeLocalhostCond(auditRequestLogs));
  }
  if (q.created_from?.trim()) conds.push(gte(auditRequestLogs.created_at, parseDateTime3(q.created_from.trim())));
  if (q.created_to?.trim()) conds.push(lte(auditRequestLogs.created_at, parseDateTime3(q.created_to.trim())));

  const whereCond = conds.length > 0 ? and(...(conds.filter(Boolean) as SQL[])) : undefined;

  const baseQuery = db
    .select({
      id: auditRequestLogs.id,
      req_id: auditRequestLogs.req_id,
      method: auditRequestLogs.method,
      url: auditRequestLogs.url,
      path: auditRequestLogs.path,
      status_code: auditRequestLogs.status_code,
      response_time_ms: auditRequestLogs.response_time_ms,
      ip: auditRequestLogs.ip,
      user_agent: auditRequestLogs.user_agent,
      referer: auditRequestLogs.referer,
      user_id: auditRequestLogs.user_id,
      is_admin: auditRequestLogs.is_admin,
      country: auditRequestLogs.country,
      city: auditRequestLogs.city,
      error_message: auditRequestLogs.error_message,
      error_code: auditRequestLogs.error_code,
      created_at: auditRequestLogs.created_at,
      user_email: users.email,
      user_full_name: users.full_name,
    })
    .from(auditRequestLogs)
    .leftJoin(users, eq(auditRequestLogs.user_id, users.id));

  const rowsQuery = whereCond ? baseQuery.where(whereCond as SQL) : baseQuery;
  const items = await rowsQuery.orderBy(desc(auditRequestLogs.created_at)).limit(MAX_EXPORT_ROWS);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `audit-request-logs-${timestamp}.${format}`;

  if (format === 'json') {
    reply.header('Content-Type', 'application/json; charset=utf-8');
    reply.header('Content-Disposition', `attachment; filename="${filename}"`);
    return reply.send(JSON.stringify(items, null, 2));
  }

  // CSV
  reply.header('Content-Type', 'text/csv; charset=utf-8');
  reply.header('Content-Disposition', `attachment; filename="${filename}"`);

  const columns = [
    'id', 'req_id', 'method', 'url', 'path', 'status_code', 'response_time_ms',
    'ip', 'user_agent', 'referer', 'user_id', 'user_email', 'user_full_name',
    'is_admin', 'country', 'city', 'error_message', 'error_code', 'created_at',
  ];

  reply.raw.write(csvRow(columns));
  for (const item of items) {
    reply.raw.write(csvRow(columns.map((col) => (item as any)[col])));
  }
  reply.raw.end();
  return reply;
};

/* ---- Export Auth Events ---- */
export const exportAuthEventsAdmin: RouteHandler = async (req, reply) => {
  const parsed = auditExportQuery.safeParse(req.query ?? {});
  if (!parsed.success) {
    return reply.code(400).send({ error: { message: 'invalid_query', issues: parsed.error.flatten() } });
  }

  const q = parsed.data;
  const format = q.format;

  // Build WHERE conditions
  const conds: (SQL | undefined)[] = [];

  if (q.event) conds.push(eq(auditAuthEvents.event, q.event));
  if (q.user_id) conds.push(eq(auditAuthEvents.user_id, q.user_id));
  if (q.email) conds.push(eq(auditAuthEvents.email, q.email));
  if (q.ip) conds.push(eq(auditAuthEvents.ip, q.ip));
  if (typeof q.exclude_localhost !== 'undefined' && isTruthyBoolLike(q.exclude_localhost)) {
    conds.push(excludeLocalhostCond(auditAuthEvents));
  }
  if (q.created_from?.trim()) conds.push(gte(auditAuthEvents.created_at, parseDateTime3(q.created_from.trim())));
  if (q.created_to?.trim()) conds.push(lte(auditAuthEvents.created_at, parseDateTime3(q.created_to.trim())));

  const whereCond = conds.length > 0 ? and(...(conds.filter(Boolean) as SQL[])) : undefined;

  const baseQuery = db
    .select({
      id: auditAuthEvents.id,
      event: auditAuthEvents.event,
      user_id: auditAuthEvents.user_id,
      email: auditAuthEvents.email,
      ip: auditAuthEvents.ip,
      user_agent: auditAuthEvents.user_agent,
      country: auditAuthEvents.country,
      city: auditAuthEvents.city,
      created_at: auditAuthEvents.created_at,
      user_full_name: users.full_name,
    })
    .from(auditAuthEvents)
    .leftJoin(users, eq(auditAuthEvents.user_id, users.id));

  const rowsQuery = whereCond ? baseQuery.where(whereCond as SQL) : baseQuery;
  const items = await rowsQuery.orderBy(desc(auditAuthEvents.created_at)).limit(MAX_EXPORT_ROWS);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `audit-auth-events-${timestamp}.${format}`;

  if (format === 'json') {
    reply.header('Content-Type', 'application/json; charset=utf-8');
    reply.header('Content-Disposition', `attachment; filename="${filename}"`);
    return reply.send(JSON.stringify(items, null, 2));
  }

  // CSV
  reply.header('Content-Type', 'text/csv; charset=utf-8');
  reply.header('Content-Disposition', `attachment; filename="${filename}"`);

  const columns = [
    'id', 'event', 'user_id', 'email', 'user_full_name',
    'ip', 'user_agent', 'country', 'city', 'created_at',
  ];

  reply.raw.write(csvRow(columns));
  for (const item of items) {
    reply.raw.write(csvRow(columns.map((col) => (item as any)[col])));
  }
  reply.raw.end();
  return reply;
};
