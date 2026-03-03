import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSliders } from '@ensotek/core/services';
import { API_BASE_URL } from '@/lib/utils';
import { HeroSliderClient } from './HeroSliderClient';
import type { Slider } from '@ensotek/core/types';

interface HeroSliderProps {
  locale: string;
  /** Static fallback hero props when there are no slides in the DB */
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaSecondaryLabel?: string;
}

export async function HeroSlider({
  locale,
  title = 'Professionelle Kühllösungen',
  subtitle = 'Leistungsstarke Kühltürme für Industrie und Gewerbe — zuverlässig, energieeffizient, maßgefertigt.',
  ctaLabel = 'Produkte entdecken',
  ctaSecondaryLabel = 'Kontakt aufnehmen',
}: HeroSliderProps) {
  let slides: Slider[] = [];
  try {
    slides = await getSliders(API_BASE_URL, locale);
  } catch {
    // API not available — fall through to static hero
  }

  // If slides exist → dynamic carousel
  if (slides.length > 0) {
    return <HeroSliderClient slides={slides} locale={locale} />;
  }

  // Static hero fallback
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-44">
        <div className="max-w-2xl">
          <span className="inline-block text-blue-400 text-sm font-semibold uppercase tracking-widest mb-6">
            Kühlturm GmbH
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            {title}
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/product`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              {ctaLabel}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
            >
              {ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
