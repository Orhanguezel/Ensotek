import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRight, ExternalLink, ArrowLeft, Calendar, Building, MapPin, CheckCircle2 } from 'lucide-react';
import { getProjectBySlug, getProjects } from '@ensotek/core/services';
import type { Project } from '@ensotek/core/types';
import { API_BASE_URL } from '@/i18n/locale-settings';
import { ReferenceGallery } from '@/components/sections/ReferenceGallery';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const projs = await getProjects(API_BASE_URL, { is_published: true, limit: 100 }).catch(() => []);
  return projs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = await getProjectBySlug(API_BASE_URL, slug, locale).catch(() => null);
  const proj = (raw as { data?: Project } | null)?.data ?? (raw as Project | null);
  if (!proj) return { title: 'Projekt' };
  return {
    title: proj.meta_title ?? proj.title,
    description: proj.meta_description ?? proj.summary ?? undefined,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projects');

  const raw = await getProjectBySlug(API_BASE_URL, slug, locale).catch(() => null);
  const proj = (raw as { data?: Project } | null)?.data ?? (raw as Project | null);

  if (!proj) {
    return (
      <main>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-lg mb-6">{t('noResults')}</p>
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              <ArrowLeft size={16} />
              {t('backToProjects')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* Gallery from `gallery` field */
  const galleryImages = (proj.gallery ?? [])
    .filter((img) => img.image_url && img.is_active !== false)
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => ({
      src: img.image_url!,
      alt: img.alt ?? proj.title ?? '',
      caption: img.caption ?? undefined,
    }));

  return (
    <main>
      {/* Page banner */}
      <div className="bg-slate-900 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} />
            <Link href={`/${locale}/projects`} className="hover:text-white transition-colors">
              {t('title')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white line-clamp-1">{proj.title}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">{proj.title}</h1>
              {proj.summary && (
                <p className="mt-4 text-slate-300 text-xl font-medium leading-relaxed">{proj.summary}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-20">

            {/* Left – main area */}
            <div className="lg:col-span-2 space-y-10">
              {/* Featured image */}
              {proj.featured_image && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-xl overflow-hidden group">
                  <img
                    src={proj.featured_image}
                    alt={proj.featured_image_alt ?? proj.title ?? ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}

              {/* Main text content */}
              {proj.content && (
                <div
                  className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: proj.content }}
                />
              )}

              {/* Highlights cards */}
              {(() => {
                let servicesList: string[] = [];
                try { servicesList = proj.services ? JSON.parse(proj.services) : []; } catch { /* ignore */ }
                if (!Array.isArray(servicesList) || servicesList.length === 0) return null;
                return (
                  <div>
                    <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">{t('keyFeatures')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {servicesList.map((feature, idx) => (
                        <div key={idx} className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                          <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={18} />
                          <span className="text-slate-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div className="pt-6">
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">{t('gallery')}</h2>
                  <ReferenceGallery images={galleryImages} />
                </div>
              )}
            </div>

            {/* Right – project stats sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="sticky top-24 space-y-8">
                {/* Project snapshot container */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                  <div className="p-6">
                    <h3 className="font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                      {t('projectDetails')}
                    </h3>

                    <div className="space-y-6">
                      {proj.client_name && (
                        <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Building size={20} />
                          </div>
                          <div>
                            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Kunde</span>
                            <span className="font-bold text-slate-900">{proj.client_name}</span>
                          </div>
                        </div>
                      )}

                      {proj.location && (
                        <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Standort</span>
                            <span className="font-bold text-slate-900">{proj.location}</span>
                          </div>
                        </div>
                      )}

                      {proj.complete_date && (
                        <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{t('completionDate')}</span>
                            <span className="font-bold text-slate-900">{proj.complete_date}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar links */}
                  <div className="p-6 bg-slate-50/50 space-y-3">
                    {proj.website_url && (
                      <a
                        href={proj.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
                      >
                       {t('visitWebsite')}
                       <ExternalLink size={16} />
                      </a>
                    )}

                    <Link
                      href={`/${locale}/contact`}
                      className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {t('ctaButton')}
                    </Link>
                  </div>
                </div>

                {/* Navigation back */}
                <Link
                  href={`/${locale}/projects`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group px-2"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  {t('backToProjects')}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
