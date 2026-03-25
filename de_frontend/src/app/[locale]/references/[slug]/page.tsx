import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { getReferenceBySlug, getReferences } from '@ensotek/core/services';
import type { Reference } from '@ensotek/core/types';
import { API_BASE_URL } from '@/i18n/locale-settings';
import Layout from '@/components/layout/Layout';
import Banner from '@/components/layout/banner/Banner';
import { ReferenceGallery } from '@/components/sections/ReferenceGallery';
import { resolveMediaUrl } from '@/lib/media';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const refs = await getReferences(API_BASE_URL, { is_published: true, limit: 200 }).catch(() => []);
  return refs.map((r) => ({ slug: r.slug }));
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
      <Layout header={1} footer={1}>
        <div className="container pt-120 pb-120 text-center">
            <h2 className="mb-30">{t('noResults')}</h2>
            <Link href="/references" className="btn btn-primary">
               {t('backToReferences')}
            </Link>
        </div>
      </Layout>
    );
  }

  const galleryImages = (ref.gallery ?? [])
    .filter((img) => img.image_url && img.is_published)
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => ({
      src: resolveMediaUrl(img.image_url),
      alt: img.alt ?? ref.title ?? '',
      caption: img.title ?? undefined,
    }));

  const allRefs = await getReferences(API_BASE_URL, {
    language: locale,
    is_published: true,
    limit: 10,
  }).catch(() => []);
  const related = allRefs.filter((r) => r.slug !== ref.slug).slice(0, 3);

  return (
    <Layout header={1} footer={1}>
      <Banner title={ref.title} />

      <section className="technical__area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8">
              <div className="technical__main-wrapper">
                {/* Back Link */}
                <div className="mb-35">
                    <Link href="/references" className="text-primary font-weight-bold">
                        <i className="fa-light fa-arrow-left-long mr-10"></i>
                        {t('backToReferences')}
                    </Link>
                </div>

                {ref.featured_image && (
                  <div className="blog__thumb w-img mb-45">
                    <Image
                      src={resolveMediaUrl(ref.featured_image)}
                      alt={ref.title}
                      width={900}
                      height={500}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 900px"
                      className="img-fluid"
                      style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '100%', height: 'auto' }}
                      priority
                    />
                  </div>
                )}

                <div className="technical__content">
                   <h2 className="mb-30" style={{ fontWeight: '700' }}>{ref.title}</h2>
                   {ref.summary && (
                      <h4 className="text-primary mb-30" style={{ fontWeight: '500' }}>
                         {ref.summary}
                      </h4>
                   )}

                   {ref.content && (
                     <div 
                        className="postbox__text mb-50" 
                        style={{ fontSize: '18px', lineHeight: '1.8' }}
                        dangerouslySetInnerHTML={{ __html: ref.content }} 
                     />
                   )}

                   {galleryImages.length > 0 && (
                     <div className="mt-60">
                        <h3 className="mb-30">{t('gallery')}</h3>
                        <ReferenceGallery images={galleryImages} />
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4">
               <div className="sideber__widget">
                  {ref.website_url && (
                    <div className="sideber__widget-item mb-40">
                       <a
                          href={ref.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary w-100"
                       >
                          {t('visitWebsite')} <i className="fa-light fa-external-link ml-10"></i>
                       </a>
                    </div>
                  )}

                  <div className="sideber__widget-item mb-40">
                    <div className="sidebar__contact" style={{ background: '#0056b3', borderRadius: '20px', padding: '40px' }}>
                       <h3 className="text-white mb-20">{t('ctaTitle')}</h3>
                       <p className="text-white mb-30" style={{ opacity: 0.8 }}>{t('ctaSubtitle')}</p>
                       <Link href="/contact" className="btn btn-light w-100">
                          {t('ctaButton')}
                       </Link>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
         <section className="related__area pb-120">
            <div className="container">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="section__title-wrapper mb-40">
                        <h2 className="section__title">{t('relatedReferences')}</h2>
                     </div>
                  </div>
               </div>
               <div className="row">
                  {related.map((r) => (
                    <div key={r.id} className="col-lg-4 col-md-6 mb-30">
                       <div className="project__item transition-3" style={{ background: '#f8f9fa' }}>
                          <div className="project__thumb w-img overflow-hidden" style={{ borderRadius: '20px 20px 0 0', height: '200px', position: 'relative' }}>
                             <Link href={`/references/${r.slug}`}>
                                <Image
                                  src={resolveMediaUrl(r.featured_image || '')}
                                  alt={r.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                                  className="object-cover"
                                />
                             </Link>
                          </div>
                          <div className="p-4">
                             <h4 style={{ fontSize: '18px' }} className="mb-10">
                                <Link href={`/references/${r.slug}`}>{r.title}</Link>
                             </h4>
                             <Link href={`/references/${r.slug}`} className="text-primary text-xs font-weight-bold">
                                Details <i className="fa-light fa-arrow-right-long ml-5"></i>
                             </Link>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </section>
      )}
    </Layout>
  );
}
