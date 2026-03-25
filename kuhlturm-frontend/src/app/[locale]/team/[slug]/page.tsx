import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, Tag } from 'lucide-react';
import { fetchCustomPagesByModuleKey, parseCustomPageContent } from '@/i18n/server';
import type { CustomPage } from '@/i18n/server';
import { API_BASE_URL } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function fetchTeamMember(slug: string, locale: string): Promise<CustomPage | null> {
  try {
    const url = `${API_BASE_URL}/custom_pages/by-slug/${encodeURIComponent(slug)}?language=${encodeURIComponent(locale)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    const page = data?.data ?? data;
    return page?.id ? (page as CustomPage) : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const members = await fetchCustomPagesByModuleKey('team', 'de', 100).catch(() => []);
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const member = await fetchTeamMember(slug, locale);
  if (!member) return { title: 'Team' };
  return {
    title: member.meta_title ?? member.title,
    description: member.meta_description ?? member.summary ?? undefined,
    openGraph: member.featured_image
      ? { images: [{ url: resolveMediaUrl(member.featured_image) }] }
      : undefined,
  };
}

export default async function TeamDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tCommon] = await Promise.all([
    getTranslations('team'),
    getTranslations('common'),
  ]);

  const member = await fetchTeamMember(slug, locale);
  if (!member) notFound();

  const photo = member.featured_image ?? member.image_url;
  const htmlContent = parseCustomPageContent(member.content);
  const tags = member.tags
    ? member.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    : [];

  // Other team members
  const allMembers = await fetchCustomPagesByModuleKey('team', locale, 50);
  const others = allMembers.filter((m) => m.id !== member.id).slice(0, 3);

  return (
    <main>
      {/* Header */}
      <div className="bg-slate-900 text-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link href={`/${locale}/team`} className="hover:text-white transition-colors">
              {t('title')}
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-white truncate max-w-xs">{member.title}</span>
          </nav>
        </div>
      </div>

      {/* Profile */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

            {/* Photo + info card */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 mb-6 relative">
                {photo ? (
                  <Image
                    src={resolveMediaUrl(photo)}
                    alt={member.featured_image_alt ?? member.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-300 text-6xl font-display font-bold">
                      {member.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">
                  {member.title}
                </h1>
                {member.summary && (
                  <p className="text-blue-600 font-medium text-sm mb-4">{member.summary}</p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                    <Tag size={13} className="text-slate-400 mt-0.5 shrink-0" />
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Back link */}
              <div className="mt-6">
                <Link
                  href={`/${locale}/team`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft size={16} />
                  {t('backToTeam')}
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2">
              {htmlContent ? (
                <div
                  className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-a:text-blue-600"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <p className="text-slate-400 text-lg">{t('noResults')}</p>
              )}

              {/* Gallery */}
              {Array.isArray(member.images) && member.images.length > 0 && (
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {member.images.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-4/3 bg-slate-100 relative">
                      <Image
                        src={resolveMediaUrl(img)}
                        alt={`${member.title} ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other team members */}
      {others.length > 0 && (
        <section className="py-(--section-py) bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">
              {t('title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((m) => {
                const p = m.featured_image ?? m.image_url;
                return (
                  <Link
                    key={m.id}
                    href={`/${locale}/team/${m.slug}`}
                    className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                      {p ? (
                        <Image
                          src={resolveMediaUrl(p)}
                          alt={m.featured_image_alt ?? m.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-slate-300 text-4xl font-display font-bold">
                            {m.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-snug">
                        {m.title}
                      </h3>
                      {m.summary && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{m.summary}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
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
            {tCommon('contactUs')}
          </Link>
        </div>
      </section>
    </main>
  );
}
