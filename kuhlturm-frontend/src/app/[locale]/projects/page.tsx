import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { getProjects } from '@ensotek/core/services';
import type { Project } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projekte',
    description: 'Realisierte Kühlturmprojekte weltweit — von der Planung bis zur Inbetriebnahme.',
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projects');

  const projects: Project[] = await getProjects(API_BASE_URL, {
    language: locale,
    is_published: true,
    limit: 60,
  }).catch(() => []);

  const featured = projects.filter((p) => p.is_featured);
  const rest = projects.filter((p) => !p.is_featured);

  return (
    <main>
      <PageBanner
        locale={locale}
        breadcrumbs={[{ label: t('title') }]}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {projects.length === 0 ? (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-400 text-lg">{t('noResults')}</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured projects — larger cards */}
          {featured.length > 0 && (
            <section className="py-(--section-py) bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {rest.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
                    {t('featured')}
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((p) => (
                    <ProjectCard key={p.id} project={p} locale={locale} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All other projects */}
          {rest.length > 0 && (
            <section className={`py-(--section-py) ${featured.length > 0 ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {featured.length > 0 && (
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
                    {t('allProjects')}
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {rest.map((p) => (
                    <ProjectCard key={p.id} project={p} locale={locale} />
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

/* ── Project card component ────────────────────────────────────────── */

function ProjectCard({ project, locale }: { project: Project; locale: string }) {
  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-100 aspect-4/3">
        {project.featured_image ? (
          <Image
            src={resolveMediaUrl(project.featured_image)}
            alt={project.featured_image_alt ?? project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-200 text-6xl font-display font-bold">K</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {project.category && (
          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
            {project.category}
          </span>
        )}
        <h2 className="font-display font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {project.title}
        </h2>
        {project.location && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin size={11} />
            <span>{project.location}</span>
          </div>
        )}
        <span className="mt-3 block text-xs font-semibold text-blue-600 group-hover:underline">
          Mehr erfahren →
        </span>
      </div>
    </Link>
  );
}
