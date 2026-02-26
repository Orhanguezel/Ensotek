'use client';

// =============================================================
// FILE: src/app/(main)/admin/reports/_components/admin-reports-client.tsx
// Admin Reports – audit analytics verisiyle 4 tab:
//   overview | performance | traffic | users
// =============================================================

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  Users,
  RefreshCcw,
  Calendar,
  Loader2,
  BarChart3,
  Download,
  TrendingUp,
  Zap,
  Globe,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

import { AuditDailyChart } from '@/components/admin/audit/AuditDailyChart';
import { AuditGeoMap } from '../../audit/AuditGeoMap';
import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';

import type {
  AuditSummaryDto,
  AuditMetricsDailyResponseDto,
  AuditGeoStatsResponseDto,
  TopEndpointDto,
  SlowestEndpointDto,
  TopUserDto,
  TopIpDto,
  StatusDistributionDto,
  MethodDistributionDto,
  ResponseTimeStatsDto,
  MonthlyAggregationDto,
} from '@/integrations/shared';

import {
  useGetAuditSummaryAdminQuery,
  useGetAuditMetricsDailyAdminQuery,
  useGetMonthlyAggregationAdminQuery,
  useGetResponseTimeStatsAdminQuery,
  useGetTopEndpointsAdminQuery,
  useGetSlowestEndpointsAdminQuery,
  useGetStatusDistributionAdminQuery,
  useGetMethodDistributionAdminQuery,
  useGetAuditGeoStatsAdminQuery,
  useGetTopUsersAdminQuery,
  useGetTopIpsAdminQuery,
} from '@/integrations/hooks';

/* ----------------------------- constants ----------------------------- */

const STATUS_COLORS: Record<string, string> = {
  '2xx': '#22c55e', '3xx': '#3b82f6', '4xx': '#eab308', '5xx': '#ef4444', other: '#6b7280',
};

const METHOD_COLORS: Record<string, string> = {
  GET: '#3b82f6', POST: '#22c55e', PUT: '#eab308', PATCH: '#f97316',
  DELETE: '#ef4444', OPTIONS: '#8b5cf6', HEAD: '#6b7280',
};

const EXPORT_BASE = '/api/admin/audit/export';

/* ----------------------------- helpers ----------------------------- */

type TabKey = 'overview' | 'performance' | 'traffic' | 'users';

function normalizeTab(v: string | null): TabKey {
  const s = String(v ?? '').toLowerCase();
  if (s === 'performance') return 'performance';
  if (s === 'traffic') return 'traffic';
  if (s === 'users') return 'users';
  return 'overview';
}

function normalizeBoolLike(v: string | null): boolean {
  return v === '1' || v === 'true';
}

function safeInt(v: string | null, fb: number): number {
  const n = Number(v ?? '');
  return Number.isFinite(n) && n >= 0 ? n : fb;
}

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
  const parts = monthStr.split('-');
  if (parts.length < 2) return monthStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  if (Number.isNaN(d.getTime())) return monthStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

function toQS(next: Record<string, any>) {
  const sp = new URLSearchParams();
  Object.entries(next).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

function yyyyMmDd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  return { from: yyyyMmDd(from), to: yyyyMmDd(to) };
}

/* ----------------------------- component ----------------------------- */

export default function AdminReportsClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const t = useAdminT('admin.reports');

  const tab = normalizeTab(sp.get('tab'));
  const excludeLocalhost = normalizeBoolLike(sp.get('exclude_localhost'));
  const days = safeInt(sp.get('days'), 14) || 14;

  const { from: dfb, to: dtb } = React.useMemo(() => defaultRange(), []);
  const from = sp.get('from') ?? dfb;
  const to = sp.get('to') ?? dtb;

  const [fromText, setFromText] = useState(from);
  const [toText, setToText] = useState(to);
  const [excludeLocalhostFlag, setExcludeLocalhostFlag] = useState(excludeLocalhost);

  React.useEffect(() => setFromText(from), [from]);
  React.useEffect(() => setToText(to), [to]);
  React.useEffect(() => setExcludeLocalhostFlag(excludeLocalhost), [excludeLocalhost]);

  function apply(next: Partial<Record<string, any>>) {
    const merged: Record<string, any> = { tab, from, to, exclude_localhost: excludeLocalhost ? '1' : '', days, ...next };
    if (next.offset == null) merged.offset = 0;
    const qs = toQS({
      tab: merged.tab,
      from: merged.from || undefined,
      to: merged.to || undefined,
      exclude_localhost: merged.exclude_localhost || undefined,
      days: merged.days || undefined,
    });
    router.push(`/admin/reports${qs}`);
  }

  function onSubmitFilters(e: React.FormEvent) {
    e.preventDefault();
    apply({ from: fromText.trim(), to: toText.trim() });
  }

  function onReset() {
    const d = defaultRange();
    setFromText(d.from);
    setToText(d.to);
    apply({ from: d.from, to: d.to });
  }

  /* ---- query params ---- */

  const analyticsParams = useMemo(() => {
    const p: Record<string, string | number> = {};
    if (from) p.created_from = from;
    if (to) p.created_to = to;
    if (excludeLocalhost) p.exclude_localhost = 1;
    return p;
  }, [from, to, excludeLocalhost]);

  const summaryParams = useMemo(
    () => (excludeLocalhost ? { exclude_localhost: 1 as const } : undefined),
    [excludeLocalhost],
  );

  const dailyParams = useMemo(() => ({
    days,
    exclude_localhost: excludeLocalhost ? 1 : undefined,
  }), [days, excludeLocalhost]);

  const monthlyParams = useMemo(() => ({
    months: 12,
    ...(excludeLocalhost ? { exclude_localhost: 1 as const } : {}),
  }), [excludeLocalhost]);

  const geoParams = useMemo(() => ({
    days: 30,
    exclude_localhost: excludeLocalhost ? 1 : undefined,
    source: 'requests' as const,
  }), [excludeLocalhost]);

  /* ---- queries ---- */

  const summaryQ = useGetAuditSummaryAdminQuery(summaryParams, { skip: tab !== 'overview' });
  const dailyQ = useGetAuditMetricsDailyAdminQuery(
    tab === 'overview' ? (dailyParams as any) : (undefined as any),
    { skip: tab !== 'overview' } as any,
  ) as any;
  const monthlyQ = useGetMonthlyAggregationAdminQuery(monthlyParams, { skip: tab !== 'overview' });
  const responseTimeQ = useGetResponseTimeStatsAdminQuery(analyticsParams as any, { skip: tab !== 'performance' });
  const topEndpointsQ = useGetTopEndpointsAdminQuery(analyticsParams as any, { skip: tab !== 'performance' });
  const slowestEndpointsQ = useGetSlowestEndpointsAdminQuery(analyticsParams as any, { skip: tab !== 'performance' });
  const statusDistQ = useGetStatusDistributionAdminQuery(analyticsParams as any, { skip: tab !== 'traffic' });
  const methodDistQ = useGetMethodDistributionAdminQuery(analyticsParams as any, { skip: tab !== 'traffic' });
  const geoQ = useGetAuditGeoStatsAdminQuery(
    tab === 'traffic' ? (geoParams as any) : (undefined as any),
    { skip: tab !== 'traffic' } as any,
  ) as any;
  const topUsersQ = useGetTopUsersAdminQuery(analyticsParams as any, { skip: tab !== 'users' });
  const topIpsQ = useGetTopIpsAdminQuery(analyticsParams as any, { skip: tab !== 'users' });

  /* ---- data ---- */

  const summary: AuditSummaryDto | undefined = summaryQ.data;
  const dailyData = (dailyQ.data as AuditMetricsDailyResponseDto | undefined) ?? { days: [] };
  const monthlyData: MonthlyAggregationDto[] = monthlyQ.data ?? [];
  const responseTimeStats: ResponseTimeStatsDto | undefined = responseTimeQ.data;
  const topEndpoints: TopEndpointDto[] = topEndpointsQ.data ?? [];
  const slowestEndpoints: SlowestEndpointDto[] = slowestEndpointsQ.data ?? [];
  const statusDist: StatusDistributionDto[] = statusDistQ.data ?? [];
  const methodDist: MethodDistributionDto[] = methodDistQ.data ?? [];
  const geoData = (geoQ.data as AuditGeoStatsResponseDto | undefined) ?? { items: [] };
  const topUsers: TopUserDto[] = topUsersQ.data ?? [];
  const topIps: TopIpDto[] = topIpsQ.data ?? [];

  const anyLoading = summaryQ.isLoading || dailyQ.isLoading || monthlyQ.isLoading ||
    responseTimeQ.isLoading || topEndpointsQ.isLoading || slowestEndpointsQ.isLoading ||
    statusDistQ.isLoading || methodDistQ.isLoading || geoQ.isLoading ||
    topUsersQ.isLoading || topIpsQ.isLoading;

  /* ---- pie chart data ---- */

  const statusPieData = useMemo(
    () => statusDist.map((s) => ({
      name: s.status_group, value: s.count,
      color: STATUS_COLORS[s.status_group] ?? STATUS_COLORS.other,
    })),
    [statusDist],
  );

  const methodPieData = useMemo(
    () => methodDist.map((m) => ({
      name: m.method, value: m.count,
      color: METHOD_COLORS[m.method] ?? '#6b7280',
    })),
    [methodDist],
  );

  /* ---- monthly chart ---- */

  const monthlyChartData = useMemo(
    () => monthlyData.map((m) => ({
      month: fmtMonth(m.month),
      requests: m.requests,
      errors: m.errors,
      avg_response_time: Number(m.avg_response_time?.toFixed(1) ?? 0),
    })),
    [monthlyData],
  );

  /* ---- loading helper ---- */

  const LoadingBadge = () => (
    <Badge variant="outline" className="flex items-center gap-1.5">
      <Loader2 className="h-3 w-3 animate-spin" /> {t('loading')}
    </Badge>
  );

  const NoRecords = () => (
    <div className="text-center text-sm text-muted-foreground py-8">{t('noRecords')}</div>
  );

  async function onRefresh() {
    if (tab === 'overview') {
      summaryQ.refetch();
      dailyQ.refetch();
      monthlyQ.refetch();
    }
    if (tab === 'performance') {
      responseTimeQ.refetch();
      topEndpointsQ.refetch();
      slowestEndpointsQ.refetch();
    }
    if (tab === 'traffic') {
      statusDistQ.refetch();
      methodDistQ.refetch();
      geoQ.refetch();
    }
    if (tab === 'users') {
      topUsersQ.refetch();
      topIpsQ.refetch();
    }
  }

  /* ================================================================ */
  /*                            RENDER                                 */
  /* ================================================================ */

  return (
    <div className="space-y-6">
      {/* ---- HEADER ---- */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Localhost toggle */}
          <div className="flex items-center gap-2 rounded-md border px-3 py-1.5">
            <Switch
              checked={excludeLocalhostFlag}
              onCheckedChange={(v) => {
                setExcludeLocalhostFlag(v);
                apply({ exclude_localhost: v ? '1' : '' });
              }}
              id="reports-exclude-localhost"
            />
            <Label htmlFor="reports-exclude-localhost" className="text-xs whitespace-nowrap cursor-pointer">
              {t('excludeLocalhost')}
            </Label>
          </div>

          {/* Export dropdown */}
          <Select onValueChange={(v) => {
            const base = `${EXPORT_BASE}/${v.startsWith('auth') ? 'auth-events' : 'request-logs'}`;
            const format = v.endsWith('-json') ? 'json' : 'csv';
            const params = new URLSearchParams({ format });
            if (excludeLocalhost) params.set('exclude_localhost', '1');
            if (from) params.set('created_from', from);
            if (to) params.set('created_to', to);
            window.open(`${base}?${params}`, '_blank');
          }}>
            <SelectTrigger className="w-auto gap-1">
              <Download className="h-4 w-4" />
              <SelectValue placeholder={t('export')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="requests-csv">{t('exportCsv')} (Requests)</SelectItem>
              <SelectItem value="requests-json">{t('exportJson')} (Requests)</SelectItem>
              <SelectItem value="auth-csv">{t('exportCsv')} (Auth)</SelectItem>
              <SelectItem value="auth-json">{t('exportJson')} (Auth)</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onRefresh} disabled={anyLoading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t('refresh')}
          </Button>
        </div>
      </div>

      {/* ---- FILTERS ---- */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <form onSubmit={onSubmitFilters} className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label htmlFor="reports-from" className="text-xs">{t('filter.from')}</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reports-from"
                  value={fromText}
                  onChange={(e) => setFromText(e.target.value)}
                  className="w-40 pl-8"
                  placeholder="YYYY-MM-DD"
                  disabled={anyLoading}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="reports-to" className="text-xs">{t('filter.to')}</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reports-to"
                  value={toText}
                  onChange={(e) => setToText(e.target.value)}
                  className="w-40 pl-8"
                  placeholder="YYYY-MM-DD"
                  disabled={anyLoading}
                />
              </div>
            </div>
            <Button type="submit" disabled={anyLoading} size="sm">{t('filter.apply')}</Button>
            <Button type="button" variant="outline" size="sm" onClick={onReset} disabled={anyLoading}>
              {t('filter.reset')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ---- TABS ---- */}
      <Tabs value={tab} onValueChange={(v) => apply({ tab: v })}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" /> {t('tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="mr-2 h-4 w-4" /> {t('tabs.performance')}
          </TabsTrigger>
          <TabsTrigger value="traffic">
            <Globe className="mr-2 h-4 w-4" /> {t('tabs.traffic')}
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" /> {t('tabs.users')}
          </TabsTrigger>
        </TabsList>

        {/* ==================== OVERVIEW ==================== */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('overview.todayRequests')}</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {summaryQ.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <div className="text-2xl font-bold">{fmtNum(summary?.today_requests)}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('overview.todayErrors')}</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {summaryQ.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    <div className="text-2xl font-bold">{fmtNum(summary?.today_errors)}</div>
                    <p className="text-xs text-muted-foreground">
                      {t('overview.errorRate')}: {fmtPct(summary?.today_error_rate)}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('overview.avgResponseTime')}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {summaryQ.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <div className="text-2xl font-bold">{fmtMs(summary?.today_avg_response_time)}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('overview.uniqueVisitors')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {summaryQ.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    <div className="text-2xl font-bold">{fmtNum(summary?.today_unique_ips)}</div>
                    <p className="text-xs text-muted-foreground">
                      {t('overview.uniqueUsers')}: {fmtNum(summary?.today_unique_users)}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Daily chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('overview.dailyChart')}</CardTitle>
              <CardDescription>{t('overview.dailyChartDesc', { days: String(days) })}</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditDailyChart rows={dailyData.days ?? []} loading={dailyQ.isLoading || dailyQ.isFetching} height={240} />
            </CardContent>
          </Card>

          {/* Monthly trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" /> {t('overview.monthlyTrend')}
              </CardTitle>
              <CardDescription>{t('overview.monthlyTrendDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyChartData.length === 0 && !monthlyQ.isLoading ? <NoRecords /> : (
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={monthlyChartData}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={60} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={60}
                      label={{ value: 'ms', position: 'insideTopRight', offset: -5, style: { fontSize: 11, fill: '#6b7280' } }} />
                    <Tooltip formatter={(value: number, name: string) => {
                      if (name === 'avg_response_time') return [`${value.toFixed(1)} ms`, t('overview.avgTime')];
                      return [fmtNum(value), name === 'requests' ? t('overview.requests') : t('overview.errors')];
                    }} />
                    <Legend formatter={(value: string) => {
                      if (value === 'requests') return t('overview.requests');
                      if (value === 'errors') return t('overview.errors');
                      if (value === 'avg_response_time') return t('overview.avgTime');
                      return value;
                    }} />
                    <Bar yAxisId="left" dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} name="requests" />
                    <Bar yAxisId="left" dataKey="errors" fill="#ef4444" radius={[4, 4, 0, 0]} name="errors" />
                    <Line yAxisId="right" type="monotone" dataKey="avg_response_time" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="avg_response_time" />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== PERFORMANCE ==================== */}
        <TabsContent value="performance" className="space-y-6 mt-4">
          {/* Response time stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4" /> {t('performance.responseTimeStats')}
                  </CardTitle>
                  <CardDescription>{t('performance.responseTimeStatsDesc')}</CardDescription>
                </div>
                {responseTimeQ.isLoading && <LoadingBadge />}
              </div>
            </CardHeader>
            <CardContent>
              {!responseTimeStats && !responseTimeQ.isLoading ? <NoRecords /> : responseTimeStats ? (
                <div className="flex flex-wrap gap-3">
                  <StatPill label="P50" value={fmtMs(responseTimeStats.p50)} />
                  <StatPill label="P95" value={fmtMs(responseTimeStats.p95)} />
                  <StatPill label="P99" value={fmtMs(responseTimeStats.p99)} />
                  <Separator orientation="vertical" className="h-8" />
                  <StatPill label={t('performance.avg')} value={fmtMs(responseTimeStats.avg)} />
                  <StatPill label={t('performance.min')} value={fmtMs(responseTimeStats.min)} />
                  <StatPill label={t('performance.max')} value={fmtMs(responseTimeStats.max)} />
                  <Separator orientation="vertical" className="h-8" />
                  <StatPill label={t('performance.totalRequests')} value={fmtNum(responseTimeStats.total_requests)} />
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Top + Slowest Endpoints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Endpoints */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUp className="h-4 w-4" /> {t('performance.topEndpoints')}
                    </CardTitle>
                    <CardDescription>{t('performance.topEndpointsDesc')}</CardDescription>
                  </div>
                  {topEndpointsQ.isLoading && <LoadingBadge />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('performance.path')}</TableHead>
                        <TableHead className="text-right">{t('performance.requestCount')}</TableHead>
                        <TableHead className="text-right">{t('performance.avgTime')}</TableHead>
                        <TableHead className="text-right">{t('performance.errorRate')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topEndpoints.length === 0 && !topEndpointsQ.isLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">{t('noRecords')}</TableCell></TableRow>
                      ) : topEndpoints.map((ep, idx) => (
                        <TableRow key={`top-ep-${idx}`}>
                          <TableCell className="max-w-[200px] truncate font-mono text-xs" title={ep.path}>{ep.path}</TableCell>
                          <TableCell className="text-right tabular-nums">{fmtNum(ep.request_count)}</TableCell>
                          <TableCell className="text-right tabular-nums">{fmtMs(ep.avg_response_time)}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            <Badge variant={ep.error_rate > 10 ? 'destructive' : ep.error_rate > 5 ? 'secondary' : 'outline'}>
                              {fmtPct(ep.error_rate)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
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
                      <Zap className="h-4 w-4" /> {t('performance.slowestEndpoints')}
                    </CardTitle>
                    <CardDescription>{t('performance.slowestEndpointsDesc')}</CardDescription>
                  </div>
                  {slowestEndpointsQ.isLoading && <LoadingBadge />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('performance.path')}</TableHead>
                        <TableHead className="text-right">{t('performance.avgTime')}</TableHead>
                        <TableHead className="text-right">{t('performance.maxTime')}</TableHead>
                        <TableHead className="text-right">{t('performance.requestCount')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slowestEndpoints.length === 0 && !slowestEndpointsQ.isLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">{t('noRecords')}</TableCell></TableRow>
                      ) : slowestEndpoints.map((ep, idx) => (
                        <TableRow key={`slow-ep-${idx}`}>
                          <TableCell className="max-w-[200px] truncate font-mono text-xs" title={ep.path}>{ep.path}</TableCell>
                          <TableCell className="text-right tabular-nums">{fmtMs(ep.avg_response_time)}</TableCell>
                          <TableCell className="text-right tabular-nums">{fmtMs(ep.max_response_time)}</TableCell>
                          <TableCell className="text-right tabular-nums">{fmtNum(ep.request_count)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== TRAFFIC ==================== */}
        <TabsContent value="traffic" className="space-y-6 mt-4">
          {/* Pie Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{t('traffic.statusDistribution')}</CardTitle>
                    <CardDescription>{t('traffic.statusDistributionDesc')}</CardDescription>
                  </div>
                  {statusDistQ.isLoading && <LoadingBadge />}
                </div>
              </CardHeader>
              <CardContent>
                {statusPieData.length === 0 && !statusDistQ.isLoading ? <NoRecords /> : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                        dataKey="value" nameKey="name" paddingAngle={2}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                        {statusPieData.map((entry, idx) => (
                          <Cell key={`status-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [fmtNum(value), t('traffic.requests')]} />
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
                    <CardTitle className="text-base">{t('traffic.methodDistribution')}</CardTitle>
                    <CardDescription>{t('traffic.methodDistributionDesc')}</CardDescription>
                  </div>
                  {methodDistQ.isLoading && <LoadingBadge />}
                </div>
              </CardHeader>
              <CardContent>
                {methodPieData.length === 0 && !methodDistQ.isLoading ? <NoRecords /> : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={methodPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                        dataKey="value" nameKey="name" paddingAngle={2}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                        {methodPieData.map((entry, idx) => (
                          <Cell key={`method-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [fmtNum(value), t('traffic.requests')]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Geo Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" /> {t('traffic.geoTitle')}
              </CardTitle>
              <CardDescription>{t('traffic.geoDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditGeoMap items={geoData.items ?? []} loading={geoQ.isLoading || geoQ.isFetching} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== USERS ==================== */}
        <TabsContent value="users" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Users */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-4 w-4" /> {t('users.topUsers')}
                    </CardTitle>
                    <CardDescription>{t('users.topUsersDesc')}</CardDescription>
                  </div>
                  {topUsersQ.isLoading && <LoadingBadge />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('users.user')}</TableHead>
                        <TableHead className="text-right">{t('users.requestCount')}</TableHead>
                        <TableHead className="text-right">{t('users.lastSeen')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topUsers.length === 0 && !topUsersQ.isLoading ? (
                        <TableRow><TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-6">{t('noRecords')}</TableCell></TableRow>
                      ) : topUsers.map((u, idx) => (
                        <TableRow key={`user-${idx}`}>
                          <TableCell className="text-sm">
                            <div className="font-medium">{u.full_name || u.email || `uid:${u.user_id}`}</div>
                            {u.email && u.full_name && <div className="text-xs text-muted-foreground">{u.email}</div>}
                            {!u.full_name && !u.email && <div className="text-xs text-muted-foreground">ID: {u.user_id}</div>}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">{fmtNum(u.request_count)}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">{fmtWhen(u.last_seen)}</TableCell>
                        </TableRow>
                      ))}
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
                      <Activity className="h-4 w-4" /> {t('users.topIps')}
                    </CardTitle>
                    <CardDescription>{t('users.topIpsDesc')}</CardDescription>
                  </div>
                  {topIpsQ.isLoading && <LoadingBadge />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('users.ip')}</TableHead>
                        <TableHead>{t('users.country')}</TableHead>
                        <TableHead className="text-right">{t('users.requestCount')}</TableHead>
                        <TableHead className="text-right">{t('users.lastSeen')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topIps.length === 0 && !topIpsQ.isLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">{t('noRecords')}</TableCell></TableRow>
                      ) : topIps.map((ipRow, idx) => (
                        <TableRow key={`ip-${idx}`}>
                          <TableCell className="font-mono text-xs">{ipRow.ip}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{ipRow.country || '\u2014'}</TableCell>
                          <TableCell className="text-right tabular-nums">{fmtNum(ipRow.request_count)}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">{fmtWhen(ipRow.last_seen)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
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
