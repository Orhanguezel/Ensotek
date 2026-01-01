// src/components/containers/library/LibraryPdfPreview.tsx

'use client';

import React, { useMemo } from 'react';

type Props = {
  pdfUrl: string | null;
  title?: string;
  height?: number;
};

function getFileBase(): string {
  const envBase = (process.env.NEXT_PUBLIC_FILE_BASE_URL ||
    (process.env as any).NEXT_PUBLIC_PUBLIC_BASE_URL ||
    '') as string;

  const cleanedEnv = String(envBase).trim().replace(/\/+$/, '');
  if (cleanedEnv) return cleanedEnv;

  if (typeof window !== 'undefined' && window.location) {
    const { hostname, origin } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'https://www.ensotek.de';
    }

    return String(origin || '')
      .trim()
      .replace(/\/+$/, '');
  }

  return 'https://www.ensotek.de';
}

function normalizePdfPath(pdfUrl: string): string {
  const s = String(pdfUrl || '').trim();
  if (!s) return '/uploads';

  if (/^https?:\/\//i.test(s)) return s;

  const [pathOnly, suffix = ''] = s.split(/(?=[?#])/);

  const cleaned = String(pathOnly).replace(/^https?:\/\/[^/]+/i, '');
  let p = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;

  while (p.startsWith('/api/api/')) p = p.replace('/api/api/', '/api/');

  if (p === '/api/uploads') return `/uploads${suffix}`;
  if (p.startsWith('/api/uploads/')) return `${p.replace(/^\/api/, '')}${suffix}`;

  if (p === '/uploads' || p.startsWith('/uploads/')) return `${p}${suffix}`;

  const idx = p.indexOf('/uploads/');
  if (idx >= 0) return `${p.substring(idx)}${suffix}`;

  return `/uploads${p}${suffix}`.replace(/^\/uploads\/uploads(\/|$)/, '/uploads$1');
}

function buildIframeSrc(pdfUrl: string | null): string | null {
  const raw = String(pdfUrl || '').trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;

  const fileBase = getFileBase();
  const normalized = normalizePdfPath(raw); // "/uploads/..."
  const base = String(fileBase).replace(/\/+$/, '');

  return `${base}${normalized.startsWith('/') ? '' : '/'}${normalized}`;
}

const LibraryPdfPreview: React.FC<Props> = ({ pdfUrl, title = 'PDF Preview', height = 600 }) => {
  const iframeSrc = useMemo(() => buildIframeSrc(pdfUrl), [pdfUrl]);

  if (!iframeSrc) {
    return null;
  }

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
