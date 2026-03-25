'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-50 cursor-zoom-in"
        onClick={() => openLightbox(activeIndex)}
      >
        <Image
          src={resolveMediaUrl(images[activeIndex])}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-50 transition-all cursor-pointer ${
                i === activeIndex
                  ? 'border-blue-500 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Image
                src={resolveMediaUrl(img)}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-[60]"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
              <Image
                src={resolveMediaUrl(images[lightboxIndex])}
                alt={alt}
                width={1200}
                height={900}
                className="w-full max-h-[80vh] object-contain"
              />
            </div>

            <p className="mt-2 text-center text-xs text-white/40">
              {lightboxIndex + 1} / {images.length}
            </p>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
