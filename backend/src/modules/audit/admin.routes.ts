// =============================================================
// FILE: src/modules/audit/admin.routes.ts
// Ensotek – Audit Admin Routes (Viewer + Analytics + Export)
//   - Mounted under /api/admin
//   - Final URLs:
//       GET /api/admin/audit/request-logs
//       GET /api/admin/audit/auth-events
//       GET /api/admin/audit/metrics/daily
//       GET /api/admin/audit/geo-stats
//       DELETE /api/admin/audit/clear
//       --- Analytics ---
//       GET /api/admin/audit/analytics/summary
//       GET /api/admin/audit/analytics/top-endpoints
//       GET /api/admin/audit/analytics/slowest-endpoints
//       GET /api/admin/audit/analytics/top-users
//       GET /api/admin/audit/analytics/top-ips
//       GET /api/admin/audit/analytics/status-distribution
//       GET /api/admin/audit/analytics/method-distribution
//       GET /api/admin/audit/analytics/hourly
//       GET /api/admin/audit/analytics/response-time-stats
//       GET /api/admin/audit/analytics/monthly
//       --- Export ---
//       GET /api/admin/audit/export/request-logs
//       GET /api/admin/audit/export/auth-events
// =============================================================

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Fallback guards (only used if app.requireAuth/requireAdmin not present)
import { requireAuth as requireAuthMw } from '@/common/middleware/auth';
import { requireAdmin as requireAdminMw } from '@/common/middleware/roles';

import {
  listAuditAuthEventsAdmin,
  listAuditRequestLogsAdmin,
  getAuditMetricsDailyAdmin,
  getAuditGeoStatsAdmin,
  clearAuditLogsAdmin,
} from './admin.controller';

import {
  getTopEndpointsAdmin,
  getSlowestEndpointsAdmin,
  getTopUsersAdmin,
  getTopIpsAdmin,
  getStatusDistributionAdmin,
  getMethodDistributionAdmin,
  getHourlyBreakdownAdmin,
  getResponseTimeStatsAdmin,
  getAuditSummaryAdmin,
  getMonthlyAggregationAdmin,
} from './analytics.controller';

import {
  exportRequestLogsAdmin,
  exportAuthEventsAdmin,
} from './export.controller';

const BASE = '/audit';

export async function registerAuditAdmin(app: FastifyInstance) {
  const requireAuth = (app as any).requireAuth as
    | ((req: FastifyRequest, reply: FastifyReply) => Promise<void>)
    | undefined;

  const requireAdmin = (app as any).requireAdmin as
    | ((req: FastifyRequest, reply: FastifyReply) => Promise<void>)
    | undefined;

  const adminGuard = async (req: FastifyRequest, reply: FastifyReply) => {
    if (typeof requireAuth === 'function') {
      await requireAuth(req, reply);
      if (reply.sent) return;
    } else {
      await requireAuthMw(req, reply);
      if (reply.sent) return;
    }

    if (typeof requireAdmin === 'function') {
      await requireAdmin(req, reply);
    } else {
      await requireAdminMw(req, reply);
    }
  };

  const ph = { preHandler: adminGuard, config: { auth: true, admin: true } };

  // ---- Existing endpoints ----
  app.get(`${BASE}/request-logs`, ph, listAuditRequestLogsAdmin);
  app.get(`${BASE}/auth-events`, ph, listAuditAuthEventsAdmin);
  app.get(`${BASE}/metrics/daily`, ph, getAuditMetricsDailyAdmin);
  app.get(`${BASE}/geo-stats`, ph, getAuditGeoStatsAdmin);
  app.delete(`${BASE}/clear`, ph, clearAuditLogsAdmin);

  // ---- Analytics endpoints ----
  app.get(`${BASE}/analytics/summary`, ph, getAuditSummaryAdmin);
  app.get(`${BASE}/analytics/top-endpoints`, ph, getTopEndpointsAdmin);
  app.get(`${BASE}/analytics/slowest-endpoints`, ph, getSlowestEndpointsAdmin);
  app.get(`${BASE}/analytics/top-users`, ph, getTopUsersAdmin);
  app.get(`${BASE}/analytics/top-ips`, ph, getTopIpsAdmin);
  app.get(`${BASE}/analytics/status-distribution`, ph, getStatusDistributionAdmin);
  app.get(`${BASE}/analytics/method-distribution`, ph, getMethodDistributionAdmin);
  app.get(`${BASE}/analytics/hourly`, ph, getHourlyBreakdownAdmin);
  app.get(`${BASE}/analytics/response-time-stats`, ph, getResponseTimeStatsAdmin);
  app.get(`${BASE}/analytics/monthly`, ph, getMonthlyAggregationAdmin);

  // ---- Export endpoints ----
  app.get(`${BASE}/export/request-logs`, ph, exportRequestLogsAdmin);
  app.get(`${BASE}/export/auth-events`, ph, exportAuthEventsAdmin);
}
