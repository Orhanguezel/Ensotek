'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/audit/AuditAnalyticsTab.tsx
// Audit Analytics Dashboard Tab
// - Summary cards, pie charts, tables, response time stats, monthly trend
// =============================================================

import * as React from 'react';
import { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  Users,
  Loader2,
  TrendingUp,
  Zap,
  BarChart3,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  Line,
  ComposedChart,
} from 'recharts';

import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';
import {
  useGetAuditSummaryAdminQuery,
  useGetTopEndpointsAdminQuery,
  useGetSlowestEndpointsAdminQuery,
  useGetTopUsersAdminQuery,
  useGetTopIpsAdminQuery,
  useGetStatusDistributionAdminQuery,
  useGetMethodDistributionAdminQuery,
  useGetResponseTimeStatsAdminQuery,
  useGetMonthlyAggregationAdminQuery,
} from '@/integrations/hooks';

import type {
  AuditSummaryDto,
  TopEndpointDto,
  SlowestEndpointDto,
  TopUserDto,
  TopIpDto,
  StatusDistributionDto,
  MethodDistributionDto,
  ResponseTimeStatsDto,
  MonthlyAggregationDto,
} from '@/integrations/shared';

/* ----------------------------- constants ----------------------------- */

const STATUS_COLORS: Record<string, string> = {
  '2xx': '#22c55e',
  '3xx': '#3b82f6',
  '4xx': '#eab308',
  '5xx': '#ef4444',
  other: '#6b7280',
};

const METHOD_COLORS: Record<string, string> = {
  GET: '#3b82f6',
  POST: '#22c55e',
  PUT: '#eab308',
  PATCH: '#f97316',
  DELETE: '#ef4444',
  OPTIONS: '#8b5cf6',
  HEAD: '#6b7280',
};

/* ----------------------------- helpers ----------------------------- */

function fmtMs(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '\u2014';
  return `${value.toFixed(1)} ms`;
}

function fmtPct(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '\u2014';
  return `${value.toFixed(2)}%`;
}

function fmtNum(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '\u2014';
  return value.toLocaleString();
}

function fmtWhen(iso?: string | null): string {
  if (!iso) return '\u2014';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString();
}

function fmtMonth(monthStr: string): string {
  // "2025-12" -> "Dec 2025"
  const parts = monthStr.split('-');
  if (parts.length < 2) return monthStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  if (Number.isNaN(d.getTime())) return monthStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

/* ----------------------------- types ----------------------------- */

type Props = {
  excludeLocalhost: boolean;
  dateRange: { from: string; to: string };
};

/* ----------------------------- component ----------------------------- */

export default function AuditAnalyticsTab({ excludeLocalhost, dateRange }: Props) {
  const t = useAdminT('admin.audit');

  /* ---- build params ---- */

  const analyticsParams = useMemo(() => {
    const p: Record<string, string | number> = {};
    if (dateRange.from) p.created_from = dateRange.from;
    if (dateRange.to) p.created_to = dateRange.to;
    if (excludeLocalhost) p.exclude_localhost = 1;
    return p;
  }, [dateRange, excludeLocalhost]);

  const summaryParams = useMemo(
    () => (excludeLocalhost ? { exclude_localhost: 1 as const } : undefined),
    [excludeLocalhost],
  );

  const monthlyParams = useMemo(
    () => ({
      months: 12,
      ...(excludeLocalhost ? { exclude_localhost: 1 as const } : {}),
    }),
    [excludeLocalhost],
  );

  /* ---- queries ---- */

  const summaryQ = useGetAuditSummaryAdminQuery(summaryParams, { skip: false });
  const topEndpointsQ = useGetTopEndpointsAdminQuery(analyticsParams as any, { skip: false });
  const slowestEndpointsQ = useGetSlowestEndpointsAdminQuery(analyticsParams as any, { skip: false });
  const topUsersQ = useGetTopUsersAdminQuery(analyticsParams as any, { skip: false });
  const topIpsQ = useGetTopIpsAdminQuery(analyticsParams as any, { skip: false });
  const statusDistQ = useGetStatusDistributionAdminQuery(analyticsParams as any, { skip: false });
  const methodDistQ = useGetMethodDistributionAdminQuery(analyticsParams as any, { skip: false });
  const responseTimeQ = useGetResponseTimeStatsAdminQuery(analyticsParams as any, { skip: false });
  const monthlyQ = useGetMonthlyAggregationAdminQuery(monthlyParams, { skip: false });

  /* ---- data ---- */

  const summary: AuditSummaryDto | undefined = summaryQ.data;
  const topEndpoints: TopEndpointDto[] = topEndpointsQ.data ?? [];
  const slowestEndpoints: SlowestEndpointDto[] = slowestEndpointsQ.data ?? [];
  const topUsers: TopUserDto[] = topUsersQ.data ?? [];
  const topIps: TopIpDto[] = topIpsQ.data ?? [];
  const statusDist: StatusDistributionDto[] = statusDistQ.data ?? [];
  const methodDist: MethodDistributionDto[] = methodDistQ.data ?? [];
  const responseTimeStats: ResponseTimeStatsDto | undefined = responseTimeQ.data;
  const monthlyData: MonthlyAggregationDto[] = monthlyQ.data ?? [];

  /* ---- loading helper ---- */

  const LoadingBadge = () => (
    <Badge variant="outline" className="flex items-center gap-1.5">
      <Loader2 className="h-3 w-3 animate-spin" /> {t('common.loading')}
    </Badge>
  );

  /* ---- pie chart data ---- */

  const statusPieData = useMemo(
    () =>
      statusDist.map((s) => ({
        name: s.status_group,
        value: s.count,
        color: STATUS_COLORS[s.status_group] ?? STATUS_COLORS.other,
      })),
    [statusDist],
  );

  const methodPieData = useMemo(
    () =>
      methodDist.map((m) => ({
        name: m.method,
        value: m.count,
        color: METHOD_COLORS[m.method] ?? '#6b7280',
      })),
    [methodDist],
  );

  /* ---- monthly chart data ---- */

  const monthlyChartData = useMemo(
    () =>
      monthlyData.map((m) => ({
        month: fmtMonth(m.month),
        requests: m.requests,
        errors: m.errors,
        avg_response_time: Number(m.avg_response_time?.toFixed(1) ?? 0),
      })),
    [monthlyData],
  );

  /* ================================================================ */
  /*                            RENDER                                 */
  /* ================================================================ */

  return (
    <div className="space-y-6">
      {/* ==================== 1. SUMMARY CARDS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's Total Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.todayRequests')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryQ.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{fmtNum(summary?.today_requests)}</div>
            )}
          </CardContent>
        </Card>

        {/* Today's Errors + Error Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.todayErrors')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryQ.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{fmtNum(summary?.today_errors)}</div>
                <p className="text-xs text-muted-foreground">
                  {t('analytics.errorRate')}: {fmtPct(summary?.today_error_rate)}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.avgResponseTime')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryQ.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{fmtMs(summary?.today_avg_response_time)}</div>
            )}
          </CardContent>
        </Card>

        {/* Unique IPs / Unique Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.uniqueVisitors')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryQ.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{fmtNum(summary?.today_unique_ips)}</div>
                <p className="text-xs text-muted-foreground">
                  {t('analytics.uniqueUsers')}: {fmtNum(summary?.today_unique_users)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ==================== 2. PIE CHARTS ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{t('analytics.statusDistribution')}</CardTitle>
                <CardDescription>{t('analytics.statusDistributionDesc')}</CardDescription>
              </div>
              {statusDistQ.isLoading && <LoadingBadge />}
            </div>
          </CardHeader>
          <CardContent>
            {statusPieData.length === 0 && !statusDistQ.isLoading ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                {t('common.noRecords')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {statusPieData.map((entry, idx) => (
                      <Cell key={`status-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [fmtNum(value), t('analytics.requests')]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Method Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{t('analytics.methodDistribution')}</CardTitle>
                <CardDescription>{t('analytics.methodDistributionDesc')}</CardDescription>
              </div>
              {methodDistQ.isLoading && <LoadingBadge />}
            </div>
          </CardHeader>
          <CardContent>
            {methodPieData.length === 0 && !methodDistQ.isLoading ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                {t('common.noRecords')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={methodPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {methodPieData.map((entry, idx) => (
                      <Cell key={`method-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [fmtNum(value), t('analytics.requests')]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ==================== 3. TOP & SLOWEST ENDPOINTS ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Endpoints */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" /> {t('analytics.topEndpoints')}
                </CardTitle>
                <CardDescription>{t('analytics.topEndpointsDesc')}</CardDescription>
              </div>
              {topEndpointsQ.isLoading && <LoadingBadge />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('analytics.path')}</TableHead>
                    <TableHead className="text-right">{t('analytics.requestCount')}</TableHead>
                    <TableHead className="text-right">{t('analytics.avgTime')}</TableHead>
                    <TableHead className="text-right">{t('analytics.errorRate')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topEndpoints.length === 0 && !topEndpointsQ.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                        {t('common.noRecords')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    topEndpoints.map((ep, idx) => (
                      <TableRow key={`top-ep-${idx}`}>
                        <TableCell className="max-w-[200px] truncate font-mono text-xs" title={ep.path}>
                          {ep.path}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {fmtNum(ep.request_count)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {fmtMs(ep.avg_response_time)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <Badge
                            variant={ep.error_rate > 10 ? 'destructive' : ep.error_rate > 5 ? 'secondary' : 'outline'}
                          >
                            {fmtPct(ep.error_rate)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Slowest Endpoints */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4" /> {t('analytics.slowestEndpoints')}
                </CardTitle>
                <CardDescription>{t('analytics.slowestEndpointsDesc')}</CardDescription>
              </div>
              {slowestEndpointsQ.isLoading && <LoadingBadge />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('analytics.path')}</TableHead>
                    <TableHead className="text-right">{t('analytics.avgTime')}</TableHead>
                    <TableHead className="text-right">{t('analytics.maxTime')}</TableHead>
                    <TableHead className="text-right">{t('analytics.requestCount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slowestEndpoints.length === 0 && !slowestEndpointsQ.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                        {t('common.noRecords')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    slowestEndpoints.map((ep, idx) => (
                      <TableRow key={`slow-ep-${idx}`}>
                        <TableCell className="max-w-[200px] truncate font-mono text-xs" title={ep.path}>
                          {ep.path}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {fmtMs(ep.avg_response_time)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {fmtMs(ep.max_response_time)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {fmtNum(ep.request_count)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ==================== 4. TOP USERS & TOP IPS ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" /> {t('analytics.topUsers')}
                </CardTitle>
                <CardDescription>{t('analytics.topUsersDesc')}</CardDescription>
              </div>
              {topUsersQ.isLoading && <LoadingBadge />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('analytics.user')}</TableHead>
                    <TableHead className="text-right">{t('analytics.requestCount')}</TableHead>
                    <TableHead className="text-right">{t('analytics.lastSeen')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topUsers.length === 0 && !topUsersQ.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                        {t('common.noRecords')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    topUsers.map((u, idx) => (
                      <TableRow key={`user-${idx}`}>
                        <TableCell className="text-sm">
                          <div className="font-medium">
                            {u.full_name || u.email || `uid:${u.user_id}`}
                          </div>
                          {u.email && u.full_name && (
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          )}
                          {!u.full_name && !u.email && (
                            <div className="text-xs text-muted-foreground">ID: {u.user_id}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {fmtNum(u.request_count)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                          {fmtWhen(u.last_seen)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top IPs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4" /> {t('analytics.topIps')}
                </CardTitle>
                <CardDescription>{t('analytics.topIpsDesc')}</CardDescription>
              </div>
              {topIpsQ.isLoading && <LoadingBadge />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('analytics.ip')}</TableHead>
                    <TableHead>{t('analytics.country')}</TableHead>
                    <TableHead className="text-right">{t('analytics.requestCount')}</TableHead>
                    <TableHead className="text-right">{t('analytics.lastSeen')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topIps.length === 0 && !topIpsQ.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                        {t('common.noRecords')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    topIps.map((ipRow, idx) => (
                      <TableRow key={`ip-${idx}`}>
                        <TableCell className="font-mono text-xs">{ipRow.ip}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {ipRow.country || '\u2014'}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {fmtNum(ipRow.request_count)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                          {fmtWhen(ipRow.last_seen)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ==================== 5. RESPONSE TIME STATS ==================== */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" /> {t('analytics.responseTimeStats')}
              </CardTitle>
              <CardDescription>{t('analytics.responseTimeStatsDesc')}</CardDescription>
            </div>
            {responseTimeQ.isLoading && <LoadingBadge />}
          </div>
        </CardHeader>
        <CardContent>
          {!responseTimeStats && !responseTimeQ.isLoading ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              {t('common.noRecords')}
            </div>
          ) : responseTimeStats ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <StatPill label="P50" value={fmtMs(responseTimeStats.p50)} />
                <StatPill label="P95" value={fmtMs(responseTimeStats.p95)} />
                <StatPill label="P99" value={fmtMs(responseTimeStats.p99)} />
                <Separator orientation="vertical" className="h-8" />
                <StatPill label={t('analytics.avg')} value={fmtMs(responseTimeStats.avg)} />
                <StatPill label={t('analytics.min')} value={fmtMs(responseTimeStats.min)} />
                <StatPill label={t('analytics.max')} value={fmtMs(responseTimeStats.max)} />
                <Separator orientation="vertical" className="h-8" />
                <StatPill
                  label={t('analytics.totalRequests')}
                  value={fmtNum(responseTimeStats.total_requests)}
                />
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* ==================== 6. MONTHLY TREND ==================== */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" /> {t('analytics.monthlyTrend')}
              </CardTitle>
              <CardDescription>{t('analytics.monthlyTrendDesc')}</CardDescription>
            </div>
            {monthlyQ.isLoading && <LoadingBadge />}
          </div>
        </CardHeader>
        <CardContent>
          {monthlyChartData.length === 0 && !monthlyQ.isLoading ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              {t('common.noRecords')}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <ComposedChart data={monthlyChartData}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                  label={{
                    value: 'ms',
                    position: 'insideTopRight',
                    offset: -5,
                    style: { fontSize: 11, fill: '#6b7280' },
                  }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'avg_response_time') return [`${value.toFixed(1)} ms`, t('analytics.avgTime')];
                    return [fmtNum(value), name === 'requests' ? t('analytics.requests') : t('analytics.errors')];
                  }}
                />
                <Legend
                  formatter={(value: string) => {
                    if (value === 'requests') return t('analytics.requests');
                    if (value === 'errors') return t('analytics.errors');
                    if (value === 'avg_response_time') return t('analytics.avgTime');
                    return value;
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="requests"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="requests"
                />
                <Bar
                  yAxisId="left"
                  dataKey="errors"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="errors"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avg_response_time"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="avg_response_time"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ----------------------------- sub-components ----------------------------- */

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
      <span className="text-xs font-medium text-muted-foreground uppercase">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}
