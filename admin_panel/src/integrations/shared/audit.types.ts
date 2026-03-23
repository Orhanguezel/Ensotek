// =============================================================
// FILE: src/integrations/types/audit.types.ts
// Ensotek – Audit Types (Frontend DTO + Query Params)
// =============================================================

import type { BoolLike } from "@/integrations/shared/common";

export type AuditRequestLogDto = {
  id: number;

  req_id: string;
  method: string;
  url: string;
  path: string;

  status_code: number;
  response_time_ms: number;

  ip: string;
  user_agent: string | null;
  referer: string | null;

  user_id: string | null;
  is_admin: number;

  country: string | null;
  city: string | null;

  created_at: string; // ISO
};

export const AUDIT_AUTH_EVENTS = ["login_success", "login_failed", "logout"] as const;
export type AuditAuthEvent = (typeof AUDIT_AUTH_EVENTS)[number];

export type AuditAuthEventDto = {
  id: number;

  event: AuditAuthEvent;
  user_id: string | null;
  email: string | null;

  ip: string;
  user_agent: string | null;

  country: string | null;
  city: string | null;

  created_at: string; // ISO
};

export type AuditRequestLogsListQueryParams = {
  q?: string;
  method?: string;
  status_code?: number;

  user_id?: string;
  ip?: string;

  only_admin?: BoolLike;
  exclude_localhost?: BoolLike;

  created_from?: string; // "2025-12-24 10:00:00.000" gibi
  created_to?: string;

  sort?: "created_at" | "response_time_ms" | "status_code";
  orderDir?: "asc" | "desc";

  limit?: number;
  offset?: number;
};

export type AuditAuthEventsListQueryParams = {
  event?: AuditAuthEvent;
  user_id?: string;
  email?: string;
  ip?: string;
  exclude_localhost?: BoolLike;

  created_from?: string;
  created_to?: string;

  sort?: "created_at";
  orderDir?: "asc" | "desc";

  limit?: number;
  offset?: number;
};

/**
 * ✅ Backend ile uyumlu:
 * GET /admin/audit/metrics/daily?days=14&only_admin=true&path_prefix=/api
 *
 * NOT: Backend'de created_from/created_to YOK (şu an).
 */
export type AuditMetricsDailyQueryParams = {
  days?: number; // default 14
  only_admin?: BoolLike;
  exclude_localhost?: BoolLike;
  path_prefix?: string;
};

export type AuditMetricsDailyRowDto = {
  date: string; // "YYYY-MM-DD"
  requests: number;
  unique_ips: number;
  errors: number;
};

export type AuditMetricsDailyResponseDto = {
  days: AuditMetricsDailyRowDto[];
  from?: string;
  to?: string;
  only_admin?: boolean;
  path_prefix?: string;
};

export type AuditMetricsDailyDto = AuditMetricsDailyResponseDto;

export type AuditListResponse<T> = { items: T[]; total: number };

export function coerceAuditList<T>(raw: unknown): AuditListResponse<T> {
  const r = raw as any;
  if (!r) return { items: [], total: 0 };
  if (Array.isArray(r)) return { items: r as T[], total: r.length };
  if (Array.isArray(r.items)) {
    const total = Number.isFinite(Number(r.total)) ? Number(r.total) : r.items.length;
    return { items: r.items as T[], total };
  }
  if (Array.isArray(r.data)) {
    const total = Number.isFinite(Number(r.total)) ? Number(r.total) : r.data.length;
    return { items: r.data as T[], total };
  }
  return { items: [], total: 0 };
}

/* ---- Geo Stats ---- */

export type AuditGeoStatsQueryParams = {
  days?: number;
  only_admin?: BoolLike;
  exclude_localhost?: BoolLike;
  source?: "requests" | "auth";
};

export type AuditGeoStatsRowDto = {
  country: string;
  count: number;
  unique_ips: number;
};

export type AuditGeoCityDto = {
  country: string;
  city: string;
  lat: number;
  lng: number;
  count: number;
  unique_ips: number;
};

export type AuditGeoStatsResponseDto = {
  items: AuditGeoStatsRowDto[];
  cities?: AuditGeoCityDto[];
};

export function coerceAuditGeoStats(raw: unknown): AuditGeoStatsResponseDto {
  const r = raw as any;
  if (!r) return { items: [] };
  if (Array.isArray(r)) return { items: r };
  if (Array.isArray(r.items)) return { items: r.items, cities: r.cities ?? [] };
  if (Array.isArray(r.data)) return { items: r.data, cities: r.cities ?? [] };
  return { items: [] };
}

export function coerceAuditMetricsDaily(raw: unknown): AuditMetricsDailyResponseDto {
  const r = raw as any;
  if (!r) return { days: [] };
  if (Array.isArray(r)) return { days: r as AuditMetricsDailyRowDto[] };
  if (Array.isArray(r.days)) return r as AuditMetricsDailyResponseDto;
  if (Array.isArray(r.items)) return { ...r, days: r.items };
  if (Array.isArray(r.data)) return { ...r, days: r.data };
  return { days: [] };
}

/* ================================================================
 * ANALYTICS TYPES
 * ================================================================ */

export type AnalyticsDateRangeParams = {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: BoolLike;
  limit?: number;
};

export type AnalyticsHourlyParams = {
  created_from: string;
  created_to: string;
  exclude_localhost?: BoolLike;
};

export type AnalyticsResponseTimeParams = {
  created_from?: string;
  created_to?: string;
  exclude_localhost?: BoolLike;
  path?: string;
};

export type AnalyticsMonthlyParams = {
  months?: number;
  exclude_localhost?: BoolLike;
};

/* ---- Summary ---- */
export type AuditSummaryDto = {
  today_requests: number;
  today_errors: number;
  today_error_rate: number;
  today_avg_response_time: number;
  today_unique_ips: number;
  today_unique_users: number;
  top_error_endpoint: { path: string; count: number } | null;
  slowest_endpoint: { path: string; avg_ms: number } | null;
};

/* ---- Top Endpoints ---- */
export type TopEndpointDto = {
  path: string;
  request_count: number;
  avg_response_time: number;
  error_rate: number;
};

/* ---- Slowest Endpoints ---- */
export type SlowestEndpointDto = {
  path: string;
  avg_response_time: number;
  max_response_time: number;
  request_count: number;
};

/* ---- Top Users ---- */
export type TopUserDto = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  request_count: number;
  last_seen: string;
};

/* ---- Top IPs ---- */
export type TopIpDto = {
  ip: string;
  country: string | null;
  request_count: number;
  last_seen: string;
};

/* ---- Status Distribution ---- */
export type StatusDistributionDto = {
  status_group: string;
  count: number;
};

/* ---- Method Distribution ---- */
export type MethodDistributionDto = {
  method: string;
  count: number;
};

/* ---- Hourly Breakdown ---- */
export type HourlyBreakdownDto = {
  date: string;
  hour: number;
  requests: number;
  errors: number;
  avg_response_time: number;
};

/* ---- Response Time Stats ---- */
export type ResponseTimeStatsDto = {
  p50: number;
  p95: number;
  p99: number;
  avg: number;
  min: number;
  max: number;
  total_requests: number;
};

/* ---- Monthly Aggregation ---- */
export type MonthlyAggregationDto = {
  month: string;
  requests: number;
  unique_ips: number;
  errors: number;
  avg_response_time: number;
};

/* ---- Coerce helpers ---- */
function coerceItems<T>(raw: unknown): { items: T[] } {
  const r = raw as any;
  if (!r) return { items: [] };
  if (Array.isArray(r)) return { items: r };
  if (Array.isArray(r.items)) return { items: r.items };
  if (Array.isArray(r.data)) return { items: r.data };
  return { items: [] };
}

export function coerceAnalyticsItems<T>(raw: unknown): T[] {
  return coerceItems<T>(raw).items;
}
