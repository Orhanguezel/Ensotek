'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Slider } from '@ensotek/core/types';

interface HeroSliderClientProps {
  slides: Slider[];
  locale: string;
}

export function HeroSliderClient({ slides, locale: _locale }: HeroSliderClientProps) {
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
              key={slide.uuid}
              className="relative flex w-full shrink-0 items-center"
              style={{ minHeight: 'clamp(400px, 55vw, 680px)' }}
            >
              {/* Background image */}
              {slide.image_url ? (
                <img
                  src={slide.image_url}
                  alt={slide.alt ?? slide.name ?? ''}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ) : (
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                  }}
                />
              )}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-slate-900/80 via-slate-900/50 to-transparent" />

              {/* Content */}
              <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
                <div className="max-w-2xl text-white">
                  {slide.name && (
                    <h2 className="font-display mb-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                      {slide.name}
                    </h2>
                  )}
                  {slide.description && (
                    <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-300 md:text-xl">
                      {slide.description}
                    </p>
                  )}
                  {slide.button_text && slide.button_link && (
                    <Link
                      href={slide.button_link}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      {slide.button_text}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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
                className={`mx-0.5 h-[3px] rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-white' : 'w-[9px] bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
