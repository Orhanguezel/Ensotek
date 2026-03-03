import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/utils';
import { HeroSliderClient, type HeroSlide } from './HeroSliderClient';

interface HeroSliderProps {
  locale: string;
  /** Static fallback hero props when there are no slides in the DB */
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaSecondaryLabel?: string;
}

type SliderApiItem = {
  id?: string | number;
  uuid?: string;
  is_active?: boolean;
  isActive?: boolean;
  display_order?: number;
  order?: number;
  image_url?: string | null;
  image?: string | null;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  alt?: string | null;
  button_text?: string | null;
  buttonText?: string | null;
  button_link?: string | null;
  buttonLink?: string | null;
};

function asText(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length ? t : null;
}

function asNum(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

function normalizeSlides(rows: unknown[]): HeroSlide[] {
  return rows
    .filter((row): row is SliderApiItem => typeof row === 'object' && row !== null)
    .filter((row) => row.is_active !== false && row.isActive !== false)
    .map((row, index) => ({
      id: String(row.uuid ?? row.id ?? `slide-${index}`),
      imageUrl: asText(row.image_url ?? row.image),
      title: asText(row.name ?? row.title),
      description: asText(row.description),
      alt: asText(row.alt),
      buttonText: asText(row.button_text ?? row.buttonText),
      buttonLink: asText(row.button_link ?? row.buttonLink),
      order: asNum(row.display_order ?? row.order),
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...slide }) => slide);
}

export async function HeroSlider({
  locale,
  title = 'Professionelle Kühllösungen',
  subtitle = 'Leistungsstarke Kühltürme für Industrie und Gewerbe — zuverlässig, energieeffizient, maßgefertigt.',
  ctaLabel = 'Produkte entdecken',
  ctaSecondaryLabel = 'Kontakt aufnehmen',
}: HeroSliderProps) {
  let slides: HeroSlide[] = [];
  try {
    const url = `${API_BASE_URL}/sliders?locale=${encodeURIComponent(locale)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const rawRows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      slides = normalizeSlides(rawRows);
    }
  } catch {
    // API not available — fall through to static hero
  }

  // If slides exist → dynamic carousel
  if (slides.length > 0) {
    return <HeroSliderClient slides={slides} />;
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
