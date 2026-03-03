'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Reference } from '@ensotek/core/types';

interface Props {
  references: Reference[];
  locale: string;
  title: string;
  subtitle: string;
  viewAllLabel: string;
}

export function ReferencesCarousel({ references, locale, title, subtitle, viewAllLabel }: Props) {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [autoplay.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit();
    onSelect();
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  if (references.length === 0) return null;

  return (
    <section className="py-(--section-py) bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-slate-500">{subtitle}</p>
          </div>
          <Link
            href={`/${locale}/references`}
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0"
          >
            {viewAllLabel} <ArrowRight size={14} />
          </Link>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex">
            {references.map((ref, i) => (
              <div
                key={ref.id}
                className="min-w-0 flex-[0_0_80%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_25%]"
              >
                <Link
                  href={`/${locale}/references/${ref.slug}`}
                  className="group block h-full"
                >
                  <div className="aspect-3/2 rounded-xl overflow-hidden bg-slate-200 mb-3">
                    {ref.featured_image ? (
                      <img
                        src={ref.featured_image}
                        alt={ref.featured_image_alt ?? ref.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading={i < 4 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-400 text-4xl font-display font-bold">E</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {ref.title}
                  </h3>
                  {ref.summary && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{ref.summary}</p>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Link
            href={`/${locale}/references`}
            className="md:hidden inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
          >
            {viewAllLabel} <ArrowRight size={14} />
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={scrollPrev}
              aria-label="Zurück"
              className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === selectedIndex ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={scrollNext}
              aria-label="Weiter"
              className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
