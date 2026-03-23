// =============================================================
// FILE: src/integrations/shared/auditAdmin.ts
// Admin audit UI helpers
// =============================================================

export const ADMIN_AUDIT_ALL_VALUE = '__all__';

export type AdminAuditSortKey = 'created_at' | 'response_time_ms' | 'status_code';

const VALID_AUDIT_TABS = new Set(['requests', 'auth', 'metrics', 'map']);
export type AdminAuditTab = 'requests' | 'auth' | 'metrics' | 'map';

export function normalizeAdminAuditTab(value: string | null | undefined): AdminAuditTab {
  const v = String(value ?? '').trim().toLowerCase();
  return VALID_AUDIT_TABS.has(v) ? (v as AdminAuditTab) : 'requests';
}

export function normalizeAdminAuditBoolLike(value: string | null | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

export function toNonNegativeInt(value: string | number | null | undefined, fallback = 0): number {
  if (value === null || value === undefined || value === '') return fallback;
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export function truncateNullable(value: string | null | undefined, maxLen: number): string {
  if (!value) return '';
  if (value.length <= maxLen) return value;
  return `${value.slice(0, maxLen - 1)}…`;
}

export function buildAdminAuditQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
}

export function formatAdminAuditWhen(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
  } catch {
    return isoString;
  }
}

export function getAdminAuditAuthEventVariant(
  event: string | null | undefined,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (event) {
    case 'login_success': return 'default';
    case 'login_failed': return 'destructive';
    case 'logout': return 'secondary';
    default: return 'outline';
  }
}

export function getAdminAuditGeoLabel(
  country: string | null | undefined,
  city: string | null | undefined,
): string {
  const c = (country ?? '').trim();
  const ci = (city ?? '').trim();
  if (c && ci) return `${c}, ${ci}`;
  return c || ci || '';
}

export function getAdminAuditStatusVariant(
  statusCode: number,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (statusCode >= 200 && statusCode < 300) return 'default';
  if (statusCode >= 300 && statusCode < 400) return 'secondary';
  if (statusCode >= 400) return 'destructive';
  return 'outline';
}

export function parseAdminAuditStatusCode(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
