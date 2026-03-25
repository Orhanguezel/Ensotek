import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Filter } from 'lucide-react';
import { getProjects } from '@ensotek/core/services';
import type { Project } from '@ensotek/core/types';
import { API_BASE_URL } from '@/i18n/locale-settings';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projekte',
    description: 'Erfolgreiche Installationen und Lösungen für unsere Kunden.',
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projects');

  const projects: Project[] = await getProjects(API_BASE_URL, {
    language: locale,
    is_published: true,
    limit: 100,
  }).catch(() => []);

  const featured = projects.filter((p) => p.is_featured);
  const rest = projects.filter((p) => !p.is_featured);

  return (
    <main>
      {/* Page banner */}
      <div className="bg-slate-900 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">{t('title')}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold">{t('title')}</h1>
              <p className="mt-3 text-slate-300 text-lg max-w-2xl">{t('subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="text-slate-400 text-lg">{t('noResults')}</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured projects */}
          {featured.length > 0 && (
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {rest.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
                    {t('featured')}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featured.map((project) => (
                    <ProjectCard key={project.id} project={project} locale={locale} featured />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All other projects */}
          {rest.length > 0 && (
            <section className={`py-20 ${featured.length > 0 ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {featured.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
                    {t('allProjects')}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((project) => (
                    <ProjectCard key={project.id} project={project} locale={locale} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ── Project card component ───────────────────────────────────────── */

function ProjectCard({
  project,
  locale,
  featured = false,
}: {
  project: Project;
  locale: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className={`group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 ${
        featured ? 'md:flex md:h-[400px]' : ''
      }`}
    >
      {/* Image container */}
      <div className={`relative overflow-hidden bg-slate-100 ${featured ? 'md:w-1/2 h-64 md:h-auto' : 'aspect-video'}`}>
        {project.featured_image ? (
          <Image
            src={resolveMediaUrl(project.featured_image)}
            alt={project.featured_image_alt ?? project.title ?? ''}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-200 text-6xl font-display font-bold">K</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-6 flex flex-col justify-between ${featured ? 'md:w-1/2' : ''}`}>
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">
            {project.title}
          </h2>
          {project.summary && (
            <p className="text-slate-500 line-clamp-3 text-sm leading-relaxed mb-4">
              {project.summary}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Details ansehen →
          </span>
          {project.client_name && (
            <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded">
              {project.client_name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
