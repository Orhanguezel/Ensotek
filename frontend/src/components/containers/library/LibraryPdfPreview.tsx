// src/components/containers/library/LibraryPdfPreview.tsx
'use client';

import React, { useMemo } from 'react';

type Props = {
  pdfUrl: string | null;
  title?: string;
  height?: number;
};

function safeStr(v: unknown): string {
  return String(v ?? '').trim();
}

function getFileBase(): string {
  const envBase = safeStr(
    process.env.NEXT_PUBLIC_FILE_BASE_URL || (process.env as any).NEXT_PUBLIC_PUBLIC_BASE_URL || '',
  ).replace(/\/+$/, '');

  if (envBase) return envBase;

  if (typeof window !== 'undefined' && window.location?.origin) {
    return safeStr(window.location.origin).replace(/\/+$/, '');
  }

  return 'https://www.ensotek.de';
}

/**
 * Key fix:
 * - Absolute URL includes /api/uploads => normalize to /uploads
 * - Relative /api/uploads => /uploads
 */
function normalizeApiUploadsEverywhere(raw: string): string {
  const s = safeStr(raw);
  if (!s) return '';

  // Absolute URL case
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      // /api/uploads/... => /uploads/...
      if (u.pathname === '/api/uploads') u.pathname = '/uploads';
      if (u.pathname.startsWith('/api/uploads/'))
        u.pathname = u.pathname.replace(/^\/api\/uploads\//, '/uploads/');
      return u.toString();
    } catch {
      // fallthrough
    }
  }

  // Relative case
  if (s === '/api/uploads') return '/uploads';
  if (s.startsWith('/api/uploads/')) return s.replace(/^\/api/, '');

  return s;
}

function normalizePdfPath(pdfUrl: string): string {
  const s0 = normalizeApiUploadsEverywhere(pdfUrl);
  const s = safeStr(s0);
  if (!s) return '';

  // If absolute after normalization, return as is
  if (/^https?:\/\//i.test(s)) return s;

  const [pathOnly, suffix = ''] = s.split(/(?=[?#])/);

  // strip any accidental host
  const cleaned = String(pathOnly).replace(/^https?:\/\/[^/]+/i, '');
  const p = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;

  // already fine
  if (p === '/uploads' || p.startsWith('/uploads/')) return `${p}${suffix}`;

  // if contains /uploads/ somewhere
  const idx = p.indexOf('/uploads/');
  if (idx >= 0) return `${p.substring(idx)}${suffix}`;

  // last resort: treat as relative under uploads
  return `/uploads/${p.replace(/^\/+/, '')}${suffix}`.replace(
    /^\/uploads\/uploads(\/|$)/,
    '/uploads$1',
  );
}

function buildIframeSrc(pdfUrl: string | null): string | null {
  const raw = safeStr(pdfUrl);
  if (!raw) return null;

  const normalized = normalizePdfPath(raw);

  // If normalized is absolute url, use it directly
  if (/^https?:\/\//i.test(normalized)) return normalized;

  const base = getFileBase();
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
          allow="fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

export default LibraryPdfPreview;
