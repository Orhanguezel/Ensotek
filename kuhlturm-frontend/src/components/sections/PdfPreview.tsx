'use client';

import { useMemo } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  pdfUrl: string | null;
  title?: string;
  height?: number;
}

function normalizeCloudinaryPdfUrl(input: string): string {
  if (!input) return '';
  const lower = input.toLowerCase();
  if (!lower.includes('res.cloudinary.com')) return input;
  const base = (lower.split('?')[0] ?? '').split('#')[0] ?? '';
  if (!base.endsWith('.pdf')) return input;
  if (lower.includes('/raw/upload/')) return input;
  if (lower.includes('/image/upload/')) {
    return input.replace('/image/upload/', '/raw/upload/');
  }
  return input;
}

function buildSrc(pdfUrl: string | null): string | null {
  const resolved = resolveMediaUrl(pdfUrl);
  if (!resolved) return null;
  return normalizeCloudinaryPdfUrl(resolved);
}

export function PdfPreview({ pdfUrl, title = 'PDF', height = 700 }: Props) {
  const src = useMemo(() => buildSrc(pdfUrl), [pdfUrl]);
  if (!src) return null;

  return (
    <div className="mb-10">
      <div
        className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"
        style={{ height }}
      >
        <iframe
          title={title}
          src={`${src}#toolbar=1&navpanes=0`}
          width="100%"
          height="100%"
          loading="lazy"
          className="block border-0"
        >
          <p>
            PDF kann nicht angezeigt werden.{' '}
            <a href={src} target="_blank" rel="noopener noreferrer">
              PDF herunterladen
            </a>
          </p>
        </iframe>
      </div>
      <div className="mt-4 flex justify-center">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <ExternalLink size={16} />
          PDF öffnen / herunterladen
        </a>
      </div>
    </div>
  );
}
