import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { getReferences } from '@ensotek/core/services';
import type { Reference } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Referenzen',
    description: 'Unsere Projekte und Referenzen — Kühltürme und Kühlanlagen weltweit.',
  };
}

export default async function ReferencesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('references');

  const references: Reference[] = await getReferences(API_BASE_URL, {
    language: locale,
    is_published: true,
    limit: 60,
  }).catch(() => []);

  const featured = references.filter((r) => r.is_featured);
  const rest = references.filter((r) => !r.is_featured);

  return (
    <main>
      <PageBanner
        locale={locale}
        breadcrumbs={[{ label: t('title') }]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {references.length === 0 ? (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-400 text-lg">{t('noResults')}</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured references — large hero cards */}
          {featured.length > 0 && (
            <section className="py-(--section-py) bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {rest.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
                    {t('featured')}
                  </h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {featured.map((ref) => (
                    <ReferenceCard key={ref.id} reference={ref} locale={locale} large />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All other references */}
          {rest.length > 0 && (
            <section className={`py-(--section-py) ${featured.length > 0 ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {featured.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
                    {t('allReferences')}
                  </h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {rest.map((ref) => (
                    <ReferenceCard key={ref.id} reference={ref} locale={locale} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA */}
      <section className="py-(--section-py) bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-slate-300 text-lg mb-8">{t('ctaSubtitle')}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ── Reference card component ─────────────────────────────────────── */

function ReferenceCard({
  reference,
  locale,
  large = false,
}: {
  reference: Reference;
  locale: string;
  large?: boolean;
}) {
  return (
    <Link
      href={`/${locale}/references/${reference.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-100 aspect-4/3">
        {reference.featured_image ? (
          <Image
            src={resolveMediaUrl(reference.featured_image)}
            alt={reference.featured_image_alt ?? reference.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-200 text-6xl font-display font-bold">K</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h2 className="font-display font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {reference.title}
        </h2>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-600 group-hover:underline">
            Mehr →
          </span>
          {reference.website_url && (
            <span className="text-slate-300">
              <ExternalLink size={12} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
