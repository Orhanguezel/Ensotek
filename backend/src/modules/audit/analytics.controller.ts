// =============================================================
// FILE: src/modules/audit/analytics.controller.ts
// Ensotek – Audit Analytics Controller
//   - 10 route handlers for analytics endpoints
// =============================================================

import type { RouteHandler } from 'fastify';

import {
  analyticsDateRangeQuery,
  analyticsHourlyQuery,
  analyticsResponseTimeQuery,
  analyticsMonthlyQuery,
} from './validation';

import {
  getTopEndpoints,
  getSlowestEndpoints,
  getTopUsers,
  getTopIps,
  getStatusDistribution,
  getMethodDistribution,
  getHourlyBreakdown,
  getResponseTimeStats,
  getAuditSummary,
  getMonthlyAggregation,
} from './analytics.repository';

/* ---- helper ---- */
function badQuery(reply: any, issues: any) {
  return reply.code(400).send({ error: { message: 'invalid_query', issues } });
}

/* ---- Top Endpoints ---- */
export const getTopEndpointsAdmin: RouteHandler = async (req, reply) => {
  const parsed = analyticsDateRangeQuery.safeParse(req.query ?? {});
  if (!parsed.success) return badQuery(reply, parsed.error.flatten());
  const items = await getTopEndpoints(parsed.data);
  return reply.send({ items });
};

/* ---- Slowest Endpoints ---- */
export const getSlowestEndpointsAdmin: RouteHandler = async (req, reply) => {
  const parsed = analyticsDateRangeQuery.safeParse(req.query ?? {});
  if (!parsed.success) return badQuery(reply, parsed.error.flatten());
  const items = await getSlowestEndpoints(parsed.data);
  return reply.send({ items });
};

/* ---- Top Users ---- */
export const getTopUsersAdmin: RouteHandler = async (req, reply) => {
  const parsed = analyticsDateRangeQuery.safeParse(req.query ?? {});
  if (!parsed.success) return badQuery(reply, parsed.error.flatten());
  const items = await getTopUsers(parsed.data);
  return reply.send({ items });
};

/* ---- Top IPs ---- */
export const getTopIpsAdmin: RouteHandler = async (req, reply) => {
  const parsed = analyticsDateRangeQuery.safeParse(req.query ?? {});
  if (!parsed.success) return badQuery(reply, parsed.error.flatten());
  const items = await getTopIps(parsed.data);
  return reply.send({ items });
};

/* ---- Status Distribution ---- */
export const getStatusDistributionAdmin: RouteHandler = async (req, reply) => {
  const parsed = analyticsDateRangeQuery.safeParse(req.query ?? {});
  if (!parsed.success) return badQuery(reply, parsed.error.flatten());
  const items = await getStatusDistribution(parsed.data);
  return reply.send({ items });
};

/* ---- Method Distribution ---- */
export const getMethodDistributionAdmin: RouteHandler = async (req, reply) => {
  const parsed = analyticsDateRangeQuery.safeParse(req.query ?? {});
  if (!parsed.success) return badQuery(reply, parsed.error.flatten());
  const items = await getMethodDistribution(parsed.data);
  return reply.send({ items });
};

/* ---- Hourly Breakdown ---- */
export const getHourlyBreakdownAdmin: RouteHandler = async (req, reply) => {
  const parsed = analyticsHourlyQuery.safeParse(req.query ?? {});
  if (!parsed.success) return badQuery(reply, parsed.error.flatten());
  const items = await getHourlyBreakdown(parsed.data);
  return reply.send({ items });
};

/* ---- Response Time Stats ---- */
export const getResponseTimeStatsAdmin: RouteHandler = async (req, reply) => {
  const parsed = analyticsResponseTimeQuery.safeParse(req.query ?? {});
  if (!parsed.success) return badQuery(reply, parsed.error.flatten());
  const stats = await getResponseTimeStats(parsed.data);
  return reply.send(stats);
};

/* ---- Summary (today's overview) ---- */
export const getAuditSummaryAdmin: RouteHandler = async (req, reply) => {
  const q = (req.query ?? {}) as Record<string, any>;
  const summary = await getAuditSummary({ exclude_localhost: q.exclude_localhost });
  return reply.send(summary);
};

/* ---- Monthly Aggregation ---- */
export const getMonthlyAggregationAdmin: RouteHandler = async (req, reply) => {
  const parsed = analyticsMonthlyQuery.safeParse(req.query ?? {});
  if (!parsed.success) return badQuery(reply, parsed.error.flatten());
  const items = await getMonthlyAggregation(parsed.data);
  return reply.send({ items });
};
