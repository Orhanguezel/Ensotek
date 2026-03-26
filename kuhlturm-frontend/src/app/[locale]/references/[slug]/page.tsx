import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { getReferenceBySlug, getReferences } from '@ensotek/core/services';
import type { Reference } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media';
import { ReferenceGallery } from '@/components/sections/ReferenceGallery';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = await getReferenceBySlug(API_BASE_URL, slug, locale).catch(() => null);
  const ref = (raw as { data?: Reference } | null)?.data ?? (raw as Reference | null);
  if (!ref) return { title: 'Referenz' };
  return {
    title: ref.meta_title ?? ref.title,
    description: ref.meta_description ?? ref.summary ?? undefined,
  };
}

export default async function ReferenceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('references');

  const raw = await getReferenceBySlug(API_BASE_URL, slug, locale).catch(() => null);
  const ref = (raw as { data?: Reference } | null)?.data ?? (raw as Reference | null);

  if (!ref) {
    return (
      <main>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-lg mb-6">{t('noResults')}</p>
            <Link
              href={`/${locale}/references`}
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              <ArrowLeft size={16} />
              {t('backToReferences')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* Gallery images from ReferenceImage[] (returned as `gallery` by API) */
  const galleryImages = (ref.gallery ?? [])
    .filter((img) => img.image_url && img.is_published)
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => ({
      src: img.image_url!,
      alt: img.alt ?? ref.title,
      caption: img.title ?? undefined,
    }));

  /* Related references (max 3, excluding self) */
  const allRefs = await getReferences(API_BASE_URL, {
    language: locale,
    is_published: true,
    limit: 10,
  }).catch(() => []);
  const related = allRefs.filter((r) => r.slug !== ref.slug).slice(0, 3);

  return (
    <main>
      <PageBanner
        locale={locale}
        breadcrumbs={[
          { label: t('title'), href: `/${locale}/references` },
          { label: ref.title },
        ]}
        title={ref.title}
        subtitle={ref.summary ?? undefined}
      />

      {/* Content */}
      <section className="py-(--section-py) bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">

            {/* Left — featured image + gallery */}
            <div className="lg:col-span-2 space-y-6">
              {ref.featured_image && (
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
                  <Image
                    src={resolveMediaUrl(ref.featured_image)}
                    alt={ref.featured_image_alt ?? ref.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
              )}

              {/* HTML content */}
              {ref.content && (
                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: ref.content }}
                />
              )}

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                    {t('gallery')}
                  </h2>
                  <ReferenceGallery images={galleryImages} />
                </div>
              )}
            </div>

            {/* Right — sidebar */}
            <div className="space-y-6">
              {/* Website link */}
              {ref.website_url && (
                <a
                  href={ref.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink size={15} />
                  {t('visitWebsite')}
                </a>
              )}

              {/* CTA card */}
              <div className="rounded-2xl bg-blue-600 text-white p-6">
                <h3 className="font-display text-lg font-bold mb-2">{t('ctaTitle')}</h3>
                <p className="text-blue-100 text-sm mb-5">{t('ctaSubtitle')}</p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  {t('ctaButton')}
                </Link>
              </div>

              {/* Back link */}
              <Link
                href={`/${locale}/references`}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft size={15} />
                {t('backToReferences')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related references */}
      {related.length > 0 && (
        <section className="py-(--section-py) bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
              {t('relatedReferences')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/${locale}/references/${r.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    {r.featured_image ? (
                      <Image
                        src={resolveMediaUrl(r.featured_image)}
                        alt={r.featured_image_alt ?? r.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-200 text-5xl font-display font-bold">K</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {r.title}
                    </h3>
                    {r.summary && (
                      <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{r.summary}</p>
                    )}
                    <span className="mt-3 block text-xs font-semibold text-blue-600">
                      Mehr erfahren →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
