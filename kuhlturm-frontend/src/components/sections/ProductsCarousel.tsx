'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Product } from '@ensotek/core/types';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  products: Product[];
  locale: string;
  title: string;
  subtitle: string;
  viewAllLabel: string;
}

export function ProductsCarousel({ products, locale, title, subtitle, viewAllLabel }: Props) {
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: true }));
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

  if (products.length === 0) return null;

  return (
    <section className="py-(--section-py) bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-slate-500">{subtitle}</p>
          </div>
          <Link
            href={`/${locale}/product`}
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0"
          >
            {viewAllLabel} <ArrowRight size={14} />
          </Link>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-5 flex">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="min-w-0 flex-[0_0_85%] pl-5 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <Link
                  href={`/${locale}/product/${product.slug}`}
                  className="group block border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-200 h-full"
                >
                  <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                    {product.image_url ? (
                      <Image
                        src={resolveMediaUrl(product.image_url)}
                        alt={product.alt ?? product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        priority={i < 3}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-300 text-5xl font-display font-bold">K</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Link
            href={`/${locale}/product`}
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
