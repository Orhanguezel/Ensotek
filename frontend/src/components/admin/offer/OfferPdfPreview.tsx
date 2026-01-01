// =============================================================
// FILE: src/components/admin/offer/OfferPdfPreview.tsx
//  - Prod + locale bağımsız çalışır
//  - API EKLEMEZ
//  - Relative URL -> FILE_BASE + /uploads/... absolute
//  - ✅ LOCAL: frontend 3000 olsa bile backend file origin default 8086
//  - ✅ Fix: fullscreen permissions warning (allow + allowFullScreen)
//  - ✅ Fix: lazy loading + referrerPolicy
// =============================================================

'use client';

import React, { useMemo } from 'react';

interface OfferPdfPreviewProps {
  pdfUrl: string | null;
}

/**
 * FILE_BASE (backend public origin):
 * 1) NEXT_PUBLIC_FILE_BASE_URL (en doğru kaynak)
 * 2) NEXT_PUBLIC_PUBLIC_BASE_URL (opsiyonel)
 * 3) LOCAL (localhost/127.0.0.1): varsayılan https://www.ensotek.de
 * 4) PROD: window.location.origin
 * 5) fallback: https://www.ensotek.de
 */
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

/**
 * pdf path normalize (defansif):
 * - absolute ise aynen (dokunma)
 * - relative ise:
 *    "/api/uploads/.." -> "/uploads/.."
 *    "api/uploads/.."  -> "/uploads/.."
 *    "/uploads/.."     -> aynen
 * - query/hash korunur
 */
function normalizePdfPath(pdfUrl: string): string {
  const s = String(pdfUrl || '').trim();
  if (!s) return '/uploads';

  // absolute ise aynen
  if (/^https?:\/\//i.test(s)) return s;

  const [pathOnly, suffix = ''] = s.split(/(?=[?#])/);

  // origin kaçarsa temizle
  const cleaned = String(pathOnly).replace(/^https?:\/\/[^/]+/i, '');
  let p = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;

  while (p.startsWith('/api/api/')) p = p.replace('/api/api/', '/api/');

  // "/api/uploads/..." -> "/uploads/..."
  if (p === '/api/uploads') return `/uploads${suffix}`;
  if (p.startsWith('/api/uploads/')) return `${p.replace(/^\/api/, '')}${suffix}`;

  // "/uploads/..." -> aynen
  if (p === '/uploads' || p.startsWith('/uploads/')) return `${p}${suffix}`;

  // path içinde /uploads/ görürsek oradan itibaren al
  const idx = p.indexOf('/uploads/');
  if (idx >= 0) return `${p.substring(idx)}${suffix}`;

  // son çare: /uploads + p (çift uploads üretmeyelim)
  return `/uploads${p}${suffix}`.replace(/^\/uploads\/uploads(\/|$)/, '/uploads$1');
}

function buildIframeSrc(pdfUrl: string | null): string | null {
  const raw = String(pdfUrl || '').trim();
  if (!raw) return null;

  // absolute ise direkt
  if (/^https?:\/\//i.test(raw)) return raw;

  const fileBase = getFileBase();
  const normalized = normalizePdfPath(raw); // bu artık "/uploads/..." döner
  const base = String(fileBase).replace(/\/+$/, '');

  return `${base}${normalized.startsWith('/') ? '' : '/'}${normalized}`;
}

export const OfferPdfPreview: React.FC<OfferPdfPreviewProps> = ({ pdfUrl }) => {
  const iframeSrc = useMemo(() => buildIframeSrc(pdfUrl), [pdfUrl]);

  if (!iframeSrc) {
    return (
      <div className="alert alert-secondary small mb-0">
        Henüz PDF oluşturulmamış veya PDF URL boş.
      </div>
    );
  }

  return (
    <div>
      <div className="border rounded p-2" style={{ height: 600 }}>
        <iframe
          title="Offer PDF Preview"
          src={iframeSrc}
          style={{ width: '100%', height: '100%', border: 'none' }}
          // ✅ Fullscreen policy warning fix:
          allow="fullscreen"
          allowFullScreen
          // ✅ daha iyi UX/perf:
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="small text-muted mt-1">
        PDF tarayıcı içinde açılmıyorsa{' '}
        <a href={iframeSrc} target="_blank" rel="noreferrer">
          yeni sekmede görüntüleyin
        </a>
        .
        <br />
        <code className="text-muted">{iframeSrc}</code>
      </div>
    </div>
  );
};
