// =============================================================
// FILE: src/modules/audit/service.ts
// Ensotek – Audit Service
//   - shouldSkipAuditLog()
//   - writeRequestAuditLog()
//   - sanitizeRequestBody()
//   - startRetentionJob()
// =============================================================

import type { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '@/db/client';
import { auditRequestLogs, auditAuthEvents } from './schema';
import { auditEvents } from './audit_events.schema';
import { emitAppEvent } from '@/common/events/bus';
import { sql } from 'drizzle-orm';
import geoip from 'geoip-lite';

/* -------------------- helper: headers -------------------- */
function firstHeader(req: FastifyRequest, name: string): string {
  const v = (req.headers as any)?.[name.toLowerCase()];
  if (Array.isArray(v)) return String(v[0] ?? '').trim();
  return String(v ?? '').trim();
}

function parseFirstIpFromXff(xff: string): string {
  return (
    xff
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)[0] || ''
  );
}

/* -------------------- shouldSkip -------------------- */
export function shouldSkipAuditLog(req: FastifyRequest): boolean {
  const method = String(req.method || '').toUpperCase();
  if (method === 'OPTIONS') return true;

  const rawUrl = String((req.raw as any)?.url ?? (req as any).url ?? '');
  const path = (rawUrl.split('?')[0] || '/').trim();

  // gürültü azaltma
  if (path === '/api/health' || path === '/health') return true;
  if (path.startsWith('/uploads/')) return true;

  // istersen audit stream'i loglama (loop önler)
  if (path.startsWith('/api/admin/audit/stream')) return true;

  return false;
}

/* -------------------- normalize -------------------- */
function normalizeClientIp(req: FastifyRequest): string {
  const cf = firstHeader(req, 'cf-connecting-ip');
  if (cf) return cf;

  const xReal = firstHeader(req, 'x-real-ip');
  if (xReal) return xReal;

  const xff = firstHeader(req, 'x-forwarded-for');
  if (xff) {
    const ip = parseFirstIpFromXff(xff);
    if (ip) return ip;
  }

  return String((req.ip as any) || (req.socket as any)?.remoteAddress || '').trim();
}

function normalizeUrlAndPath(req: FastifyRequest): { url: string; path: string } {
  const rawUrl = String((req.raw as any)?.url ?? (req as any).url ?? '').trim() || '/';
  const path = rawUrl.split('?')[0] || '/';
  return { url: rawUrl, path };
}

function normalizeUserContext(req: FastifyRequest): { userId: string | null; isAdmin: number } {
  const u: any =
    (req as any).user ??
    (req as any).auth?.user ??
    (req as any).requestContext?.get?.('user') ??
    null;

  const userId = u?.id ? String(u.id) : null;

  let isAdmin = 0;
  if (u) {
    if (u.is_admin === true || u.is_admin === 1 || u.is_admin === '1') isAdmin = 1;
    const role = String(u.role ?? '');
    if (role === 'admin') isAdmin = 1;
    const roles = Array.isArray(u.roles) ? u.roles.map(String) : [];
    if (roles.includes('admin')) isAdmin = 1;
  }

  return { userId, isAdmin };
}

function normalizeUserAgent(req: FastifyRequest): string | null {
  const ua = firstHeader(req, 'user-agent');
  return ua ? ua : null;
}

function normalizeReferer(req: FastifyRequest): string | null {
  const ref = firstHeader(req, 'referer');
  return ref ? ref : null;
}

function normalizeGeo(req: FastifyRequest, ip: string): { country: string | null; city: string | null } {
  // 1. CDN header'larından oku (Cloudflare vb.)
  const cfCountry = firstHeader(req, 'cf-ipcountry') || null;
  const cfCity = firstHeader(req, 'x-geo-city') || null;
  if (cfCountry) return { country: cfCountry, city: cfCity };

  // 2. Header yoksa geoip-lite ile IP lookup yap
  const isLocal =
    !ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');

  if (!isLocal) {
    const geo = geoip.lookup(ip);
    if (geo) {
      return { country: geo.country || null, city: geo.city || null };
    }
  }

  // 3. Yerel/özel IP ise "LOCAL" işaretle
  if (isLocal) return { country: 'LOCAL', city: null };

  return { country: null, city: null };
}

/* -------------------- request body sanitization -------------------- */
const SENSITIVE_FIELDS = new Set([
  'password',
  'password_hash',
  'token',
  'secret',
  'api_key',
  'apikey',
  'access_token',
  'refresh_token',
  'authorization',
  'credit_card',
  'cvv',
  'ssn',
  'pin',
  'current_password',
  'new_password',
  'confirm_password',
]);

const MAX_BODY_SIZE = 4096; // 4KB

function stripSensitive(obj: Record<string, any>): void {
  for (const key of Object.keys(obj)) {
    if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
      obj[key] = '[REDACTED]';
    } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      stripSensitive(obj[key]);
    }
  }
}

function sanitizeRequestBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;

  try {
    const cloned = JSON.parse(JSON.stringify(body));
    if (typeof cloned === 'object' && cloned !== null) {
      stripSensitive(cloned);
    }
    const json = JSON.stringify(cloned);
    if (json.length > MAX_BODY_SIZE) {
      return json.slice(0, MAX_BODY_SIZE) + '...[TRUNCATED]';
    }
    return json;
  } catch {
    return null;
  }
}

/* -------------------- writer -------------------- */
export async function writeRequestAuditLog(args: {
  req: FastifyRequest;
  reply: FastifyReply;
  reqId: string;
  responseTimeMs: number;
}) {
  const { req, reply } = args;

  const { url, path } = normalizeUrlAndPath(req);
  const ip = normalizeClientIp(req);
  const { userId, isAdmin } = normalizeUserContext(req);

  const statusCode =
    typeof (reply as any).statusCode === 'number'
      ? (reply as any).statusCode
      : Number((reply as any).raw?.statusCode ?? 0);

  const ua = normalizeUserAgent(req);
  const referer = normalizeReferer(req);
  const geo = normalizeGeo(req, ip);
  const method = String(req.method || '').toUpperCase();

  // Error detail capture (set by error.ts handler)
  const auditError = (req as any).auditError as
    | { message?: string; code?: string; stack?: string }
    | undefined;

  let errorMessage: string | null = null;
  let errorCode: string | null = null;

  if (statusCode >= 400 && auditError) {
    errorMessage = auditError.message ? String(auditError.message).slice(0, 512) : null;
    errorCode = auditError.code ? String(auditError.code).slice(0, 64) : null;
  }

  // Request body logging (opt-in via env)
  let requestBody: string | null = null;
  const logBody = process.env.LOG_REQUEST_BODY === 'true';

  if (logBody && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    requestBody = sanitizeRequestBody(req.body);
  }

  await db.insert(auditRequestLogs).values({
    req_id: String(args.reqId || ''),
    method,
    url,
    path,
    status_code: Number(statusCode || 0),
    response_time_ms: Math.max(0, Math.round(Number(args.responseTimeMs || 0))),
    ip,
    user_agent: ua,
    referer,
    user_id: userId,
    is_admin: isAdmin,
    country: geo.country,
    city: geo.city,
    error_message: errorMessage,
    error_code: errorCode,
    request_body: requestBody,
    created_at: new Date() as any,
  } as any);

  // ✅ realtime (SSE) için event yayınla
  emitAppEvent({
    level: Number(statusCode) >= 500 ? 'error' : Number(statusCode) >= 400 ? 'warn' : 'info',
    topic: 'audit.request.logged',
    message: 'request_logged',
    meta: {
      method,
      path,
      status_code: Number(statusCode || 0),
      ip,
      response_time_ms: Math.max(0, Math.round(Number(args.responseTimeMs || 0))),
      user_id: userId,
      is_admin: isAdmin,
      error_message: errorMessage,
      error_code: errorCode,
    },
    entity: null,
  });
}

/* -------------------- retention job -------------------- */
export function startRetentionJob() {
  const RETENTION_REQUEST_DAYS = Number(process.env.AUDIT_RETENTION_REQUEST_LOGS_DAYS || 90);
  const RETENTION_AUTH_DAYS = Number(process.env.AUDIT_RETENTION_AUTH_EVENTS_DAYS || 180);
  const RETENTION_EVENTS_DAYS = Number(process.env.AUDIT_RETENTION_AUDIT_EVENTS_DAYS || 30);

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  async function runCleanup() {
    try {
      const r1 = await db.execute(
        sql`DELETE FROM audit_request_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ${RETENTION_REQUEST_DAYS} DAY)`,
      );
      const r2 = await db.execute(
        sql`DELETE FROM audit_auth_events WHERE created_at < DATE_SUB(NOW(), INTERVAL ${RETENTION_AUTH_DAYS} DAY)`,
      );
      const r3 = await db.execute(
        sql`DELETE FROM audit_events WHERE ts < DATE_SUB(NOW(), INTERVAL ${RETENTION_EVENTS_DAYS} DAY)`,
      );

      console.log(
        `[audit] Retention cleanup done — request_logs: ${RETENTION_REQUEST_DAYS}d, auth_events: ${RETENTION_AUTH_DAYS}d, audit_events: ${RETENTION_EVENTS_DAYS}d`,
      );
    } catch (err) {
      console.error('[audit] Retention cleanup failed:', err);
    }
  }

  // İlk çalıştırma: startup'tan 30sn sonra (DB'nin hazır olmasını bekle)
  setTimeout(runCleanup, 30_000);
  // Sonra her 24 saatte bir
  setInterval(runCleanup, ONE_DAY_MS);
}
