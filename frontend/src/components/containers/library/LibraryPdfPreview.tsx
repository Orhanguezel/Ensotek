// =============================================================
// FILE: src/components/containers/library/LibraryPdfPreview.tsx
// Ensotek – PDF Preview (FINAL / LOCAL+PROD SAFE)
// FIX:
// - Local dev’de /uploads/... Next(3000) tarafından servis edilmez.
//   Dosyalar backend’de (ör: 8086) durur.
// - Env önceliği korunur. Env yoksa localhost’ta backend origin’e düşer.
// - Cloudinary PDF URL: /image/upload/...pdf => /raw/upload/...pdf (safe)
// - Keeps existing /api/uploads -> /uploads normalization logic
// =============================================================

'use client';

import React, { useMemo } from 'react';

type Props = {
  pdfUrl: string | null;
  title?: string;
  height?: number;
};

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

/**
 * ✅ File base resolution order:
 *  1) NEXT_PUBLIC_FILE_BASE_URL (explicit, recommended)
 *  2) NEXT_PUBLIC_BACKEND_URL / NEXT_PUBLIC_API_BASE_URL (derive origin)
 *  3) window.origin (prod’da doğru)
 *  4) localhost fallback => http://localhost:8086
 *  5) final fallback => https://www.ensotek.de
 */
function getFileBase(): string {
  // 1) explicit
  const envBase = stripTrailingSlash(
    safeStr(
      process.env.NEXT_PUBLIC_FILE_BASE_URL ||
        (process.env as any).NEXT_PUBLIC_PUBLIC_BASE_URL ||
        '',
    ),
  );
  if (envBase) return envBase;

  // 2) derive from backend/api env if present
  const backendLike = stripTrailingSlash(
    safeStr(
      (process.env as any).NEXT_PUBLIC_BACKEND_URL ||
        (process.env as any).NEXT_PUBLIC_API_BASE_URL ||
        (process.env as any).NEXT_PUBLIC_API_URL ||
        '',
    ),
  );
  if (backendLike) {
    // if it's full URL, take origin; if it's origin already keep it
    const o = originFromUrl(backendLike);
    return o ? stripTrailingSlash(o) : backendLike;
  }

  // 3) window origin
  if (typeof window !== 'undefined' && window.location) {
    const host = safeStr(window.location.hostname);
    const origin = stripTrailingSlash(safeStr(window.location.origin));

    // 4) localhost fallback (local dev standard: backend 8086)
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8086';
    }

    if (origin) return origin;
  }

  // 5) final fallback
  return 'https://www.ensotek.de';
}

/**
 * Cloudinary PDF fix:
 * - If URL is Cloudinary and ends with .pdf, and path contains /image/upload/,
 *   rewrite to /raw/upload/
 */
function normalizeCloudinaryPdfUrl(input: string): string {
  const url = safeStr(input);
  if (!url) return '';

  const lower = url.toLowerCase();
  if (!lower.includes('res.cloudinary.com')) return url;

  const base = lower.split('?')[0].split('#')[0];
  if (!base.endsWith('.pdf')) return url;

  if (lower.includes('/raw/upload/')) return url;

  if (lower.includes('/image/upload/')) {
    return url.replace('/image/upload/', '/raw/upload/');
  }

  return url;
}

function normalizePdfPath(pdfUrl: string): string {
  const s = safeStr(pdfUrl);
  if (!s) return '/uploads';

  // absolute URLs handled elsewhere
  if (isHttpUrl(s)) return s;

  const [pathOnly, suffix = ''] = s.split(/(?=[?#])/);

  const cleaned = String(pathOnly).replace(/^https?:\/\/[^/]+/i, '');
  let p = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;

  // collapse accidental /api/api
  while (p.startsWith('/api/api/')) p = p.replace('/api/api/', '/api/');

  // normalize legacy api uploads
  if (p === '/api/uploads') return `/uploads${suffix}`;
  if (p.startsWith('/api/uploads/')) return `${p.replace(/^\/api/, '')}${suffix}`;

  // already uploads
  if (p === '/uploads' || p.startsWith('/uploads/')) return `${p}${suffix}`;

  // if it contains uploads segment anywhere
  const idx = p.indexOf('/uploads/');
  if (idx >= 0) return `${p.substring(idx)}${suffix}`;

  // final fallback: if caller gave "catalog/x.pdf" etc.
  return `/uploads/${p.replace(/^\/+/, '')}${suffix}`.replace(
    /^\/uploads\/uploads(\/|$)/,
    '/uploads$1',
  );
}

function buildIframeSrc(pdfUrl: string | null): string | null {
  const raw = safeStr(pdfUrl);
  if (!raw) return null;

  // Absolute URL
  if (isHttpUrl(raw)) {
    return normalizeCloudinaryPdfUrl(raw);
  }

  // Relative path => attach to our file base
  const fileBase = getFileBase(); // local’de 8086’e düşer
  const normalized = normalizePdfPath(raw); // "/uploads/..."
  const base = stripTrailingSlash(fileBase);

  return `${base}${normalized.startsWith('/') ? '' : '/'}${normalized}`;
}

const LibraryPdfPreview: React.FC<Props> = ({ pdfUrl, title = 'PDF Preview', height = 600 }) => {
  const iframeSrc = useMemo(() => buildIframeSrc(pdfUrl), [pdfUrl]);

  if (!iframeSrc) return null;

  return (
    <div className="ens-pdfPreview">
      <div className="ens-pdfPreview__frame">
        <iframe
          title={title}
          src={iframeSrc}
          width="100%"
          height={height}
          loading="lazy"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
};

export default LibraryPdfPreview;
