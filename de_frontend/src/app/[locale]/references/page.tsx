import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getReferences } from '@ensotek/core/services';
import type { Reference } from '@ensotek/core/types';
import { API_BASE_URL } from '@/i18n/locale-settings';
import Layout from '@/components/layout/Layout';
import Banner from '@/components/layout/banner/Banner';
import Image from 'next/image';
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
    limit: 100,
  }).catch(() => []);

  // Filter out featured if needed, but here we just list them
  const featured = references.filter((r) => r.is_featured);
  const rest = references.filter((r) => !r.is_featured);

  return (
    <Layout header={1} footer={1}>
      <Banner title={t('title')} />
      
      <section className="project__area pt-120 pb-120">
        <div className="container">
          {references.length === 0 ? (
             <div className="row justify-content-center">
                <div className="col-lg-6 text-center">
                   <p className="text-muted">{t('noResults')}</p>
                </div>
             </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div className="row mb-60">
                  <div className="col-xl-12">
                    <div className="section__title-wrapper mb-40 text-center">
                       <h2 className="section__title">{t('featured')}</h2>
                    </div>
                    <div className="row">
                       {featured.map((ref) => (
                         <div key={ref.id} className="col-lg-4 col-md-6 mb-30">
                            <ReferenceCard reference={ref} />
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {rest.length > 0 && (
                <div className="row">
                   <div className="col-xl-12">
                     {featured.length > 0 && (
                        <div className="section__title-wrapper mb-40 text-center">
                           <h2 className="section__title text-secondary">{t('allReferences')}</h2>
                        </div>
                     )}
                     <div className="row">
                        {rest.map((ref) => (
                          <div key={ref.id} className="col-lg-4 col-md-6 mb-30">
                             <ReferenceCard reference={ref} />
                          </div>
                        ))}
                     </div>
                   </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta__area pt-100 pb-100 bg-theme-blue-dark">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-8 text-center text-white">
                  <h2 className="text-white mb-20">{t('ctaTitle')}</h2>
                  <p className="mb-40">{t('ctaSubtitle')}</p>
                  <Link href="/contact" className="btn btn-primary btn-lg">
                     {t('ctaButton')}
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </Layout>
  );
}

function ReferenceCard({ reference }: { reference: Reference }) {
  return (
    <div className="project__item transition-3 mb-30">
      <div className="project__thumb w-img overflow-hidden" style={{ borderRadius: '20px 20px 0 0', height: '240px', position: 'relative' }}>
        <Link href={`/references/${reference.slug}`}>
          {reference.featured_image ? (
            <Image
               src={resolveMediaUrl(reference.featured_image)}
               alt={reference.title}
               fill
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
               className="object-cover"
               style={{ transition: '0.5s' }}
            />
          ) : (
            <div className="bg-light w-100 h-100 d-flex align-items-center justify-center">
               <span className="text-muted h1">E</span>
            </div>
          )}
        </Link>
      </div>
      <div className="project__content p-4">
        <h3 className="mb-15" style={{ fontSize: '20px' }}>
          <Link href={`/references/${reference.slug}`}>{reference.title}</Link>
        </h3>
        <Link href={`/references/${reference.slug}`} className="text-primary font-weight-bold">
           Mehr erfahren <i className="fa-light fa-arrow-right-long ml-10"></i>
        </Link>
      </div>
    </div>
  );
}
