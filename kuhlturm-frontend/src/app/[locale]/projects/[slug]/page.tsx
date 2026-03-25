import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ArrowLeft,
  MapPin,
  Building2,
  Package,
  CalendarCheck,
  Clock,
  Wrench,
  Cog,
  ExternalLink,
  Play,
} from 'lucide-react';
import { getProjectBySlug, getProjects } from '@ensotek/core/services';
import type { Project } from '@ensotek/core/types';
import { API_BASE_URL } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media';
import { ReferenceGallery } from '@/components/sections/ReferenceGallery';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// content field: JSON-encoded or plain HTML fallback
interface ProjectContent {
  html?: string;
  description?: string;
  key_features?: string[];
  technologies_used?: string[];
  design_highlights?: string[];
}

function parseContent(raw: string | null | undefined): ProjectContent {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ProjectContent;
  } catch {
    return { html: raw };
  }
}

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: 'long' }).format(new Date(iso));
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] ?? null;
}

export const dynamic = 'force-dynamic';

/* ── Metadata ──────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = await getProjectBySlug(API_BASE_URL, slug, locale).catch(() => null);
  const project = (raw as { data?: Project } | null)?.data ?? (raw as Project | null);
  if (!project) return { title: 'Projekt' };
  return {
    title: project.meta_title ?? project.title,
    description: project.meta_description ?? project.summary ?? undefined,
  };
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projects');

  const raw = await getProjectBySlug(API_BASE_URL, slug, locale).catch(() => null);
  const project = (raw as { data?: Project } | null)?.data ?? (raw as Project | null);

  if (!project) notFound();

  // Derived data
  const content = parseContent(project.content);
  const services = parseJsonArray(project.services);
  const techs = parseJsonArray(project.techs);
  const youtubeId = project.youtube_url ? getYoutubeId(project.youtube_url) : null;

  const galleryImages = (project.gallery ?? [])
    .filter((img) => img.image_url && img.is_active)
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => ({
      src: img.image_url!,
      alt: img.alt ?? project.title,
      caption: img.caption ?? undefined,
    }));

  // Related projects (max 3, excluding self)
  const allProjects = await getProjects(API_BASE_URL, {
    language: locale,
    is_published: true,
    limit: 10,
  }).catch(() => []);
  const related = allProjects.filter((p) => p.slug !== project.slug).slice(0, 3);

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
            <span className="text-white line-clamp-1">{project.title}</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold">{project.title}</h1>
          {project.summary && (
            <p className="mt-3 text-slate-300 text-lg max-w-2xl">{project.summary}</p>
          )}
        </div>
      </div>

      {/* Main content */}
      <section className="py-(--section-py) bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">

            {/* Left — content area */}
            <div className="lg:col-span-2 space-y-8">

              {/* Featured image */}
              {project.featured_image && (
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
                  <Image
                    src={resolveMediaUrl(project.featured_image)}
                    alt={project.featured_image_alt ?? project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
              )}

              {/* HTML content */}
              {(content.html || content.description) && (
                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.html ?? content.description ?? '' }}
                />
              )}

              {/* Key features */}
              {content.key_features && content.key_features.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                    {t('keyFeatures')}
                  </h2>
                  <ul className="space-y-2.5">
                    {content.key_features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* YouTube embed */}
              {youtubeId && (
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                    {t('watchVideo')}
                  </h2>
                  <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
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
            <div className="space-y-5">

              {/* Project details card */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <h3 className="font-display text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {t('projectDetails')}
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-400">{t('location')}</p>
                        <p className="text-sm font-medium text-slate-800">{project.location}</p>
                      </div>
                    </div>
                  )}
                  {project.client_name && (
                    <div className="flex items-start gap-3">
                      <Building2 size={15} className="mt-0.5 shrink-0 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-400">{t('client')}</p>
                        <p className="text-sm font-medium text-slate-800">{project.client_name}</p>
                      </div>
                    </div>
                  )}
                  {project.category && (
                    <div className="flex items-start gap-3">
                      <Package size={15} className="mt-0.5 shrink-0 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-400">{t('category')}</p>
                        <p className="text-sm font-medium text-slate-800">{project.category}</p>
                      </div>
                    </div>
                  )}
                  {project.product_type && (
                    <div className="flex items-start gap-3">
                      <Cog size={15} className="mt-0.5 shrink-0 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-400">{t('productType')}</p>
                        <p className="text-sm font-medium text-slate-800">{project.product_type}</p>
                      </div>
                    </div>
                  )}
                  {project.unit_count !== null && (
                    <div className="flex items-start gap-3">
                      <Wrench size={15} className="mt-0.5 shrink-0 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-400">{t('unitCount')}</p>
                        <p className="text-sm font-medium text-slate-800">
                          {project.unit_count}
                          {project.fan_count !== null && (
                            <span className="text-slate-400 font-normal">
                              {' '}· {project.fan_count} {t('fanCount')}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {project.complete_date && (
                    <div className="flex items-start gap-3">
                      <CalendarCheck size={15} className="mt-0.5 shrink-0 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-400">{t('completionDate')}</p>
                        <p className="text-sm font-medium text-slate-800">
                          {formatDate(project.complete_date)}
                        </p>
                      </div>
                    </div>
                  )}
                  {project.completion_time_label && (
                    <div className="flex items-start gap-3">
                      <Clock size={15} className="mt-0.5 shrink-0 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-400">{t('completionTime')}</p>
                        <p className="text-sm font-medium text-slate-800">
                          {project.completion_time_label}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Services tags */}
              {services.length > 0 && (
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-display text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    {t('services')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {services.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technology tags */}
              {techs.length > 0 && (
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-display text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    {t('technologies')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Website link */}
              {project.website_url && (
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink size={15} />
                  {t('visitWebsite')}
                </a>
              )}

              {/* YouTube link (when ID couldn't be parsed) */}
              {project.youtube_url && !youtubeId && (
                <a
                  href={project.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  <Play size={15} />
                  {t('watchVideo')}
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
                href={`/${locale}/projects`}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft size={15} />
                {t('backToProjects')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="py-(--section-py) bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
              {t('relatedProjects')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/projects/${p.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    {p.featured_image ? (
                      <Image
                        src={resolveMediaUrl(p.featured_image)}
                        alt={p.featured_image_alt ?? p.title}
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
                    {p.category && (
                      <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                        {p.category}
                      </span>
                    )}
                    <h3 className="font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                    {p.location && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin size={11} />
                        <span>{p.location}</span>
                      </div>
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
