// =============================================================
// FILE: src/components/containers/library/LibraryPdfPreview.tsx
// Ensotek – PDF Preview (FINAL / CLOUDINARY-SAFE)
// FIX:
// - Cloudinary PDF URL may come as /image/upload/.../*.pdf (wrong delivery type)
//   => rewrite to /raw/upload/.../*.pdf
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

function getFileBase(): string {
  const envBase = safeStr(
    process.env.NEXT_PUBLIC_FILE_BASE_URL || (process.env as any).NEXT_PUBLIC_PUBLIC_BASE_URL || '',
  ).replace(/\/+$/, '');

  if (envBase) return envBase;

  if (typeof window !== 'undefined' && window.location) {
    const origin = safeStr(window.location.origin).replace(/\/+$/, '');
    if (origin) return origin;
  }

  // fallback
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

  // Must look like a PDF
  const base = lower.split('?')[0].split('#')[0];
  if (!base.endsWith('.pdf')) return url;

  // If already raw/upload, keep it
  if (lower.includes('/raw/upload/')) return url;

  // Rewrite image/upload -> raw/upload
  if (lower.includes('/image/upload/')) {
    return url.replace('/image/upload/', '/raw/upload/');
  }

  // If for some reason it's /upload/ without resource type, do nothing
  return url;
}

function normalizePdfPath(pdfUrl: string): string {
  const s = safeStr(pdfUrl);
  if (!s) return '/uploads';

  // absolute URLs handled elsewhere
  if (/^https?:\/\//i.test(s)) return s;

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

  // final fallback
  return `/uploads${p}${suffix}`.replace(/^\/uploads\/uploads(\/|$)/, '/uploads$1');
}

function buildIframeSrc(pdfUrl: string | null): string | null {
  const raw = safeStr(pdfUrl);
  if (!raw) return null;

  // Absolute URL
  if (/^https?:\/\//i.test(raw)) {
    // ✅ Cloudinary PDF correction
    const fixedCloudinary = normalizeCloudinaryPdfUrl(raw);
    return fixedCloudinary;
  }

  // Relative path => attach to our site base
  const fileBase = getFileBase();
  const normalized = normalizePdfPath(raw); // "/uploads/..."
  const base = String(fileBase).replace(/\/+$/, '');

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
