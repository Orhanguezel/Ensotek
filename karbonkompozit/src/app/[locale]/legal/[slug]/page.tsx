import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { buildPageMetadata } from '@/seo';

type LegalFallback = {
  title: string;
  description: string;
  content: string;
};

async function fetchLegalPage(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages/by-slug/${encodeURIComponent(slug)}?locale=${locale}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getLegalFallback(locale: string, slug: string): LegalFallback | null {
  const isEn = locale.startsWith('en');

  if (slug === 'privacy') {
    return {
      title: isEn ? 'Privacy Policy' : 'Gizlilik Politikasi',
      description: isEn
        ? 'Overview of how MOE Kompozit handles contact, quotation and technical project data.'
        : 'MOE Kompozit ile paylasilan iletisim, teklif ve teknik proje verilerinin nasil ele alindigina dair ozet bilgi.',
      content: isEn
        ? '<p>MOE Kompozit uses submitted contact and quotation data only to evaluate requests, prepare offers and maintain project communication.</p><p>We do not request unnecessary personal data and we limit access to project files, drawings and technical documents to relevant operational teams.</p><p>For data updates or removal requests, you can contact us via the communication details provided on the contact page.</p>'
        : '<p>MOE Kompozit, iletisim ve teklif formlari uzerinden iletilen verileri yalnizca talepleri degerlendirmek, teklif hazirlamak ve proje iletisimini surdurmek amaciyla kullanir.</p><p>Gereksiz kisisel veri talep etmeyiz; proje dosyalari, cizimler ve teknik dokumanlara erisimi ilgili operasyon ekipleriyle sinirli tutariz.</p><p>Veri guncelleme veya silme talepleri icin iletisim sayfasindaki kanallar uzerinden bize ulasabilirsiniz.</p>',
    };
  }

  if (slug === 'terms') {
    return {
      title: isEn ? 'Terms of Use' : 'Kullanim Kosullari',
      description: isEn
        ? 'General terms for using the MOE Kompozit website, technical content and quotation communication channels.'
        : 'MOE Kompozit web sitesi, teknik icerikler ve teklif iletisim kanallarinin kullanimina dair genel kosullar.',
      content: isEn
        ? '<p>Information published on this website is provided for general technical and commercial guidance. Final product scope, material selection and production conditions are clarified during project review.</p><p>Visuals, technical notes and descriptions on the site do not constitute a final binding offer on their own.</p><p>All quotation and delivery commitments become valid only after mutual confirmation within the commercial process.</p>'
        : '<p>Bu sitede yer alan bilgiler genel teknik ve ticari yonlendirme amaciyla sunulur. Nihai urun kapsami, malzeme secimi ve uretim kosullari proje degerlendirme surecinde netlestirilir.</p><p>Sitedeki gorseller, teknik notlar ve aciklamalar tek basina baglayici nihai teklif niteliginde degildir.</p><p>Teklif, termin ve teslim kapsamindaki taahhutler ancak ticari surecte karsilikli teyit sonrasinda gecerli olur.</p>',
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await fetchLegalPage(slug, locale);
  const fallback = page ? null : getLegalFallback(locale, slug);
  const resolved = page || fallback;
  if (!resolved) return {};
  return buildPageMetadata({
    locale,
    pathname: `/legal/${slug}`,
    title: 'meta_title' in resolved ? resolved.meta_title || resolved.title : resolved.title,
    description:
      'meta_description' in resolved
        ? resolved.meta_description || resolved.description || resolved.title
        : resolved.description,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await fetchLegalPage(slug, locale);
  const fallback = page ? null : getLegalFallback(locale, slug);
  const resolved = page || fallback;
  if (!resolved) notFound();
  const content = 'content' in resolved ? normalizeRichContent(resolved.content) : '';

  return (
    <div className="section-py">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <ContentPageHeader
          title={resolved.title}
          description={resolved.description}
        />
        {content && (
          <div
            className="prose prose-theme mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
}
