'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';

export interface HeroSlide {
  id: string;
  imageUrl: string | null;
  title: string | null;
  description: string | null;
  alt: string | null;
  buttonText: string | null;
  buttonLink: string | null;
}

interface HeroSliderClientProps {
  slides: HeroSlide[];
}

export function HeroSliderClient({ slides }: HeroSliderClientProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const startAutoPlay = useCallback(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
  }, [slides.length]);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      stopAutoPlay();
      startAutoPlay();
    },
    [isTransitioning, stopAutoPlay, startAutoPlay],
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
    stopAutoPlay();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0]?.clientX ?? touchEndX.current;
  };

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) next();
    else if (diff < -50) prev();
    startAutoPlay();
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  // 2s transition lock
  useEffect(() => {
    const timeout = setTimeout(() => setIsTransitioning(false), 2000);
    return () => clearTimeout(timeout);
  }, [current]);

  if (!slides.length) return null;

  return (
    <section className="relative bg-slate-900" aria-label="Hero slider">
      {/* Slider track */}
      <div className="overflow-hidden">
        <div
          className="flex"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: 'transform 2000ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="relative w-full shrink-0"
              style={{ height: 'clamp(520px, 65vw, 760px)' }}
            >
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
              />

              {/* Content */}
              <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 md:py-10 lg:grid-cols-2 lg:gap-12 lg:px-8">
                {/* Mobile: image first, text below. Desktop: text left, image right */}
                <div className="order-2 text-white lg:order-1">
                  <div className="max-w-2xl">
                    {slide.title && (
                      <h2 className="font-display mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <div
                        className="slider-description mb-8 max-w-lg text-base leading-relaxed text-slate-300 md:text-lg"
                        dangerouslySetInnerHTML={{ __html: slide.description }}
                      />
                    )}
                    {slide.buttonText && slide.buttonLink && (
                      <Link
                        href={slide.buttonLink}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                      >
                        {slide.buttonText}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  {slide.imageUrl ? (
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl h-60 sm:h-75 md:h-90 lg:h-115">
                      <Image
                        src={resolveMediaUrl(slide.imageUrl)}
                        alt={slide.alt ?? slide.title ?? ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={i === 0}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-slate-900/10" />
                    </div>
                  ) : (
                    <div className="h-[240px] w-full rounded-2xl border border-white/10 bg-slate-800/40 sm:h-[300px] md:h-[360px] lg:h-[460px]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows — only when multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Vorherige Folie"
            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Nächste Folie"
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Folie ${i + 1}`}
                className="relative mx-0.5 flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 bg-white' : 'w-[9px] bg-white/40 group-hover:bg-white/70'
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
