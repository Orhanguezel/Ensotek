/**
 * Media URL resolution for kuhlturm-frontend.
 *
 * Backend stores images as relative paths (e.g. `/uploads/news/5.jpg`).
 * This utility converts them to absolute URLs so next/image can load them.
 */

const safeStr = (v: unknown) => String(v ?? '').trim();

function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s);
}

function stripTrailingSlash(s: string): string {
  return String(s || '').replace(/\/+$/, '');
}

function originFromUrl(u: string): string | null {
  try {
    const x = new URL(u);
    return `${x.protocol}//${x.host}`;
  } catch {
    return null;
  }
}

function getFileBase(): string {
  // 1. Explicit file base URL
  const envFileBase = stripTrailingSlash(safeStr(process.env.NEXT_PUBLIC_FILE_BASE_URL || ''));
  if (envFileBase) return envFileBase;

  // 2. Derive from API URL
  const envApiUrl = safeStr(process.env.NEXT_PUBLIC_API_URL || '');
  if (envApiUrl) {
    const origin = originFromUrl(envApiUrl);
    if (origin) return stripTrailingSlash(origin);
  }

  // 3. Client-side fallback
  if (typeof window !== 'undefined') {
    const host = safeStr(window.location.hostname);
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://${host}:8086`;
    }
    const origin = stripTrailingSlash(safeStr(window.location.origin));
    if (origin) return origin;
  }

  // 4. Production fallback
  return 'https://kuhlturm.com';
}

function normalizeMediaPath(url: string): string {
  const s = safeStr(url);
  if (!s) return '';

  // Rewrite own-domain absolute URLs to relative paths for local dev
  if (isHttpUrl(s) && (s.includes('kuhlturm.com') || s.includes('ensotek.de'))) {
    const [pathOnly, suffix = ''] = s.split(/(?=[?#])/);
    const cleaned = String(pathOnly).replace(/^https?:\/\/[^/]+/i, '');
    return normalizeMediaPath(cleaned + suffix);
  }

  if (isHttpUrl(s)) return s;

  const [pathOnly = '', suffix = ''] = s.split(/(?=[?#])/);
  let p = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;

  while (p.startsWith('/api/api/')) p = p.replace('/api/api/', '/api/');

  if (p === '/api/uploads') return `/uploads${suffix}`;
  if (p.startsWith('/api/uploads/')) return `${p.replace(/^\/api/, '')}${suffix}`;
  if (p === '/uploads' || p.startsWith('/uploads/')) return `${p}${suffix}`;

  const idx = p.indexOf('/uploads/');
  if (idx >= 0) return `${p.substring(idx)}${suffix}`;

  return `/uploads/${p.replace(/^\/+/, '')}${suffix}`.replace(
    /^\/uploads\/uploads(\/|$)/,
    '/uploads$1',
  );
}

export function resolveMediaUrl(url: string | null | undefined): string {
  const raw = safeStr(url);
  if (!raw) return '';

  if (isHttpUrl(raw)) {
    if (!raw.includes('kuhlturm.com') && !raw.includes('ensotek.de')) {
      return raw;
    }
  }

  const fileBase = getFileBase();
  const normalized = normalizeMediaPath(raw);

  if (isHttpUrl(normalized)) return normalized;

  const base = stripTrailingSlash(fileBase);
  return `${base}${normalized.startsWith('/') ? '' : '/'}${normalized}`;
}
