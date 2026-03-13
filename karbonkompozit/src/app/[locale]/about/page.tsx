import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import { JsonLd, buildPageMetadata, jsonld, organizationJsonLd } from '@/seo';

async function fetchAboutPage(locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages/by-slug/about?locale=${locale}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return buildPageMetadata({
    locale,
    pathname: '/about',
    title: locale.startsWith('en')
      ? `${t('title')} - Composite Engineering, Sampling and Production`
      : `${t('title')} - Kompozit Muhendislik, Numune ve Uretim Yaklasimi`,
    description: t('description'),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const page = await fetchAboutPage(locale);
  const pageContent = normalizeRichContent(page?.content);
  const expertiseItems = Object.values(t.raw('about.sections.expertiseItems') as Record<string, string>);
  const processItems = Object.values(t.raw('about.sections.processItems') as Record<string, string>);
  const sectorItems = Object.values(t.raw('about.sections.sectorsItems') as Record<string, string>);

  return (
    <div className="section-py">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <JsonLd
          data={jsonld.graph([
            jsonld.org(
              organizationJsonLd(locale, {
                description: t('about.description'),
              }),
            ),
          ])}
        />
        <ContentPageHeader
          title={page?.title || t('about.title')}
          description={t('about.description')}
          intro={t('about.intro')}
        />
        {pageContent && (
          <div
            className="prose prose-theme mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        )}
        {!pageContent && (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <InfoListPanel
              title={t('about.sections.expertiseTitle')}
              items={expertiseItems}
            />
            <InfoListPanel
              title={t('about.sections.processTitle')}
              items={processItems}
            />
            <InfoListPanel
              title={t('about.sections.sectorsTitle')}
              items={sectorItems}
            />
          </div>
        )}
      </div>
    </div>
  );
}
