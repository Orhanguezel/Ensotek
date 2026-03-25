'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';

interface CertItem {
  src: string;
  alt: string;
  title?: string;
  summary?: string;
}

interface Props {
  items: CertItem[];
}

export function CertificateGallery({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = (i: number) => setActiveIndex(i);
  const close = () => setActiveIndex(null);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, prev, next]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeIndex]);

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => open(i)}
            className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden aspect-3/4 hover:border-amber-300 hover:shadow-md transition-all cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={`Zertifikat vergrößern: ${item.alt}`}
          >
            <Image
              src={resolveMediaUrl(item.src)}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
        >
          {/* Modal content — stop propagation so clicking image doesn't close */}
          <div
            className="relative max-w-3xl w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              aria-label="Schließen"
            >
              <X size={18} />
            </button>

            {/* Image */}
            <div className="relative bg-slate-50 flex items-center justify-center min-h-64 max-h-[75vh]" style={{ minHeight: '256px', maxHeight: '75vh' }}>
              {items[activeIndex] && (
                <Image
                  src={resolveMediaUrl(items[activeIndex].src)}
                  alt={items[activeIndex].alt}
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="max-w-full max-h-[75vh] object-contain p-4"
                  style={{ width: 'auto', height: 'auto' }}
                />
              )}
            </div>

            {/* Caption */}
            {items[activeIndex] && (items[activeIndex].title || items[activeIndex].summary) && (
              <div className="px-6 py-4 border-t border-slate-100">
                {items[activeIndex].title && (
                  <p className="font-semibold text-slate-800 text-sm">
                    {items[activeIndex].title}
                  </p>
                )}
                {items[activeIndex].summary && (
                  <p className="mt-0.5 text-xs text-slate-500">{items[activeIndex].summary}</p>
                )}
              </div>
            )}

            {/* Prev / Next */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                  aria-label="Vorheriges Zertifikat"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                  aria-label="Nächstes Zertifikat"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {items.length > 1 && (
              <div className="flex justify-center gap-1.5 py-3 bg-white">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeIndex ? 'bg-amber-500 w-4' : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Zertifikat ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
