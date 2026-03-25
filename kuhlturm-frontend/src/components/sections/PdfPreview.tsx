'use client';

import { ExternalLink } from 'lucide-react';

interface Props {
  src: string;
  title?: string;
  height?: number;
}

export function PdfPreview({ src, title = 'PDF', height = 700 }: Props) {
  if (!src) return null;

  const iframeSrc = `${src}#toolbar=1&navpanes=0`;

  return (
    <div className="mb-10">
      <div
        className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"
        style={{ height }}
      >
        <iframe
          title={title}
          src={iframeSrc}
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
