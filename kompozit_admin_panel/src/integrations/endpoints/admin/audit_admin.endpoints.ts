// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/audit_admin.endpoints.ts
// Ensotek – Admin Audit (RTK Query)
//   - List: request-logs, auth-events
//   - Metrics: daily, geo-stats
//   - Analytics: summary, top-endpoints, slowest-endpoints,
//     top-users, top-ips, status-distribution, method-distribution,
//     hourly, response-time-stats, monthly
//   - Export: request-logs, auth-events
//   - Clear
// =============================================================

import { baseApi } from '@/integrations/baseApi';
import {
  coerceAuditList,
  coerceAuditMetricsDaily,
  coerceAuditGeoStats,
  coerceAnalyticsItems,
} from '@/integrations/shared';
import type {
  AuditAuthEventDto,
  AuditAuthEventsListQueryParams,
  AuditListResponse,
  AuditMetricsDailyQueryParams,
  AuditMetricsDailyResponseDto,
  AuditRequestLogDto,
  AuditRequestLogsListQueryParams,
  AuditGeoStatsQueryParams,
  AuditGeoStatsResponseDto,
  AnalyticsDateRangeParams,
  AnalyticsHourlyParams,
  AnalyticsResponseTimeParams,
  AnalyticsMonthlyParams,
  AuditSummaryDto,
  TopEndpointDto,
  SlowestEndpointDto,
  TopUserDto,
  TopIpDto,
  StatusDistributionDto,
  MethodDistributionDto,
  HourlyBreakdownDto,
  ResponseTimeStatsDto,
  MonthlyAggregationDto,
} from '@/integrations/shared';

const BASE = 'admin/audit';

type ClearAuditTarget = 'requests' | 'auth' | 'all';
type ClearAuditResponse = { ok: boolean; deletedRequests: number; deletedAuth: number };

export const auditAdminApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    /* ==================== Existing ==================== */

    listAuditRequestLogsAdmin: build.query<
      AuditListResponse<AuditRequestLogDto>,
      AuditRequestLogsListQueryParams | void
    >({
      query: (params) => ({
        url: `${BASE}/request-logs`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAuditList<AuditRequestLogDto>(raw),
      providesTags: [{ type: 'AuditRequestLog' as const, id: 'LIST' }],
    }),

    listAuditAuthEventsAdmin: build.query<
      AuditListResponse<AuditAuthEventDto>,
      AuditAuthEventsListQueryParams | void
    >({
      query: (params) => ({
        url: `${BASE}/auth-events`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAuditList<AuditAuthEventDto>(raw),
      providesTags: [{ type: 'AuditAuthEvent' as const, id: 'LIST' }],
    }),

    getAuditMetricsDailyAdmin: build.query<
      AuditMetricsDailyResponseDto,
      AuditMetricsDailyQueryParams | void
    >({
      query: (params) => ({
        url: `${BASE}/metrics/daily`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAuditMetricsDaily(raw),
      providesTags: [{ type: 'AuditMetric' as const, id: 'DAILY' }],
    }),

    getAuditGeoStatsAdmin: build.query<
      AuditGeoStatsResponseDto,
      AuditGeoStatsQueryParams | void
    >({
      query: (params) => ({
        url: `${BASE}/geo-stats`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAuditGeoStats(raw),
      providesTags: [{ type: 'AuditMetric' as const, id: 'GEO' }],
    }),

    clearAuditLogsAdmin: build.mutation<ClearAuditResponse, { target?: ClearAuditTarget }>({
      query: ({ target = 'all' }) => ({
        url: `${BASE}/clear?target=${encodeURIComponent(target)}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'AuditRequestLog' as const, id: 'LIST' },
        { type: 'AuditAuthEvent' as const, id: 'LIST' },
        { type: 'AuditMetric' as const, id: 'DAILY' },
        { type: 'AuditMetric' as const, id: 'GEO' },
      ],
    }),

    /* ==================== Analytics ==================== */

    getAuditSummaryAdmin: build.query<AuditSummaryDto, { exclude_localhost?: number } | void>({
      query: (params) => ({
        url: `${BASE}/analytics/summary`,
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: [{ type: 'AuditMetric' as const, id: 'SUMMARY' }],
    }),

    getTopEndpointsAdmin: build.query<TopEndpointDto[], AnalyticsDateRangeParams | void>({
      query: (params) => ({
        url: `${BASE}/analytics/top-endpoints`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAnalyticsItems<TopEndpointDto>(raw),
    }),

    getSlowestEndpointsAdmin: build.query<SlowestEndpointDto[], AnalyticsDateRangeParams | void>({
      query: (params) => ({
        url: `${BASE}/analytics/slowest-endpoints`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAnalyticsItems<SlowestEndpointDto>(raw),
    }),

    getTopUsersAdmin: build.query<TopUserDto[], AnalyticsDateRangeParams | void>({
      query: (params) => ({
        url: `${BASE}/analytics/top-users`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAnalyticsItems<TopUserDto>(raw),
    }),

    getTopIpsAdmin: build.query<TopIpDto[], AnalyticsDateRangeParams | void>({
      query: (params) => ({
        url: `${BASE}/analytics/top-ips`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAnalyticsItems<TopIpDto>(raw),
    }),

    getStatusDistributionAdmin: build.query<StatusDistributionDto[], AnalyticsDateRangeParams | void>({
      query: (params) => ({
        url: `${BASE}/analytics/status-distribution`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAnalyticsItems<StatusDistributionDto>(raw),
    }),

    getMethodDistributionAdmin: build.query<MethodDistributionDto[], AnalyticsDateRangeParams | void>({
      query: (params) => ({
        url: `${BASE}/analytics/method-distribution`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAnalyticsItems<MethodDistributionDto>(raw),
    }),

    getHourlyBreakdownAdmin: build.query<HourlyBreakdownDto[], AnalyticsHourlyParams | void>({
      query: (params) => ({
        url: `${BASE}/analytics/hourly`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAnalyticsItems<HourlyBreakdownDto>(raw),
    }),

    getResponseTimeStatsAdmin: build.query<ResponseTimeStatsDto, AnalyticsResponseTimeParams | void>({
      query: (params) => ({
        url: `${BASE}/analytics/response-time-stats`,
        method: 'GET',
        params: params ?? undefined,
      }),
    }),

    getMonthlyAggregationAdmin: build.query<MonthlyAggregationDto[], AnalyticsMonthlyParams | void>({
      query: (params) => ({
        url: `${BASE}/analytics/monthly`,
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => coerceAnalyticsItems<MonthlyAggregationDto>(raw),
    }),
  }),
});

export const {
  useListAuditRequestLogsAdminQuery,
  useListAuditAuthEventsAdminQuery,
  useGetAuditMetricsDailyAdminQuery,
  useGetAuditGeoStatsAdminQuery,
  useClearAuditLogsAdminMutation,
  useGetAuditSummaryAdminQuery,
  useGetTopEndpointsAdminQuery,
  useGetSlowestEndpointsAdminQuery,
  useGetTopUsersAdminQuery,
  useGetTopIpsAdminQuery,
  useGetStatusDistributionAdminQuery,
  useGetMethodDistributionAdminQuery,
  useGetHourlyBreakdownAdminQuery,
  useGetResponseTimeStatsAdminQuery,
  useGetMonthlyAggregationAdminQuery,
} = auditAdminApi;
