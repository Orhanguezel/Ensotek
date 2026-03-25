import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Target, Award, Users } from 'lucide-react';
import { fetchCustomPagesByModuleKey } from '@/i18n/server';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Über uns',
    description:
      'Erfahren Sie mehr über Kühlturm — unsere Mission, Vision und unser Qualitätsversprechen.',
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');
  const tCommon = await getTranslations('common');
  const tTeam = await getTranslations('team');

  const [aboutPages, missionPages, qualityPages, teamMembers] = await Promise.all([
    fetchCustomPagesByModuleKey('about', locale),
    fetchCustomPagesByModuleKey('mission', locale),
    fetchCustomPagesByModuleKey('quality', locale),
    fetchCustomPagesByModuleKey('team', locale, 6),
  ]);

  const aboutPage = aboutPages[0] ?? null;
  const missionPage = missionPages[0] ?? null;
  const qualityPage = qualityPages[0] ?? null;

  const sections = [
    {
      key: 'about',
      icon: <ChevronRight size={24} className="text-blue-600" />,
      iconBg: 'bg-blue-100',
      title: aboutPage?.title ?? 'Über Ensotek',
      summary: aboutPage?.summary ?? 'Wer wir sind und was uns antreibt.',
      href: `/${locale}/about/${aboutPage?.slug ?? 'ensotek-wasserkuehltuerme'}`,
      image: aboutPage?.featured_image ?? aboutPage?.image_url ?? null,
    },
    {
      key: 'mission',
      icon: <Target size={24} className="text-indigo-600" />,
      iconBg: 'bg-indigo-100',
      title: missionPage?.title ?? 'Mission & Vision',
      summary: missionPage?.summary ?? 'Unsere Ziele und unsere Ausrichtung für die Zukunft.',
      href: `/${locale}/about/${missionPage?.slug ?? 'unsere-mission'}`,
      image: missionPage?.featured_image ?? missionPage?.image_url ?? null,
    },
    {
      key: 'quality',
      icon: <Award size={24} className="text-amber-600" />,
      iconBg: 'bg-amber-100',
      title: qualityPage?.title ?? 'Qualität & Zertifikate',
      summary: qualityPage?.summary ?? 'Unsere Qualitätsstandards und Zertifizierungen.',
      href: `/${locale}/about/${qualityPage?.slug ?? 'qualitaetszertifikate-qualitaetsstandards'}`,
      image: qualityPage?.featured_image ?? qualityPage?.image_url ?? null,
    },
    {
      key: 'team',
      icon: <Users size={24} className="text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      title: tTeam('title'),
      summary: tTeam('heroSubtitle'),
      href: `/${locale}/team`,
      image: teamMembers[0]?.featured_image ?? teamMembers[0]?.image_url ?? null,
    },
  ];

  return (
    <main>
      {/* Hero banner */}
      <div className="bg-slate-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">{t('title')}</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-4 text-slate-300 text-lg md:text-xl max-w-2xl">
            {t('heroSubtitle')}
          </p>
        </div>
      </div>

      {/* Overview cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {sections.map((sec) => (
              <Link
                key={sec.key}
                href={sec.href}
                className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden bg-slate-100 relative">
                  {sec.image ? (
                    <Image
                      src={resolveMediaUrl(sec.image)}
                      alt={sec.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={`w-16 h-16 rounded-2xl ${sec.iconBg} flex items-center justify-center`}>
                        {sec.icon}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${sec.iconBg} flex items-center justify-center shrink-0`}>
                      {sec.icon}
                    </div>
                    <h2 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {sec.title}
                    </h2>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {sec.summary}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600 group-hover:underline">
                    {tCommon('readMore')} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Team preview strip */}
      {teamMembers.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                {tTeam('title')}
              </h2>
              <Link
                href={`/${locale}/team`}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                {tCommon('viewAll')} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {teamMembers.map((member) => {
                const photo = member.featured_image ?? member.image_url;
                return (
                  <Link
                    key={member.id}
                    href={`/${locale}/team/${member.slug}`}
                    className="group block text-center"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-200 mb-3 relative">
                      {photo ? (
                        <Image
                          src={resolveMediaUrl(photo)}
                          alt={member.featured_image_alt ?? member.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-slate-400 text-2xl font-display font-bold">
                            {member.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {member.title}
                    </h3>
                    {member.summary && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{member.summary}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
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
