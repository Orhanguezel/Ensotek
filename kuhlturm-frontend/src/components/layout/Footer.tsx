import Link from 'next/link';
import type { FooterSection, MenuItem } from '@ensotek/core/types';
import { SiteLogo } from './SiteLogo';

interface FooterProps {
  locale: string;
  footerSections?: FooterSection[];
  footerLinks?: MenuItem[];
  logoSrc?: string | null;
}

export function Footer({ locale, footerSections = [], footerLinks = [], logoSrc }: FooterProps) {
  const year = new Date().getFullYear();

  // Group footer menu links by section_id
  const linksBySection = footerLinks.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = item.section_id ?? '__none__';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // Footer links not attached to any section
  const floatingLinks = (linksBySection['__none__'] ?? []).sort(
    (a, b) => a.order_num - b.order_num,
  );

  // Helper to ensure links are prefixed with locale
  const toHref = (url: string) => {
    if (url.startsWith('http') || url.startsWith('//')) return url;
    const clean = url.startsWith('/') ? url : `/${url}`;
    if (clean.startsWith(`/${locale}/`) || clean === `/${locale}`) return clean;
    return `/${locale}${clean}`;
  };

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Main grid */}
        <div
          className={`grid grid-cols-1 gap-8 mb-10 ${
            footerSections.length > 0
              ? 'md:grid-cols-2 lg:grid-cols-4'
              : 'md:grid-cols-3'
          }`}
        >
          {/* Brand */}
          <div>
            <SiteLogo src={logoSrc} dark height={36} />
            <p className="mt-3 text-sm leading-relaxed">
              Professionelle Kühltürme und Kühllösungen für Industrie und Gewerbe.
            </p>
            <div className="mt-6 space-y-3 text-xs md:text-sm leading-relaxed text-slate-500">
              <p className="flex items-start gap-2">
                <span className="shrink-0 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Anschrift:</span>
                <span>
                  {locale === 'de' 
                    ? 'Oruçreis Mah., Tekstilkent Sit., A17 Blok No:41, 34235 Esenler / Istanbul, Türkei'
                    : 'Oruçreis Mah., Tekstilkent Sit., A17 Blok No:41, 34235 Esenler / İstanbul, Türkiye'
                  }
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="shrink-0 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Werk:</span>
                <span>
                  {locale === 'de'
                    ? 'Saray Mah., Gimat Cad. No:6A, 06980 Kahramankazan / Ankara, Türkei'
                    : 'Saray Mah., Gimat Cad. No:6A, 06980 Kahramankazan / Ankara, Türkiye'
                  }
                </span>
              </p>
            </div>
          </div>

          {/* Dynamic footer sections from backend */}
          {footerSections.length > 0
            ? footerSections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
                    {section.title}
                  </h3>
                  {(linksBySection[section.id] ?? []).length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {(linksBySection[section.id] ?? [])
                        .sort((a, b) => a.order_num - b.order_num)
                        .map((link) => (
                          <li key={link.id}>
                            <Link href={toHref(link.url)} className="hover:text-white transition-colors">
                              {link.title}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  ) : section.description ? (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {section.description}
                    </p>
                  ) : null}
                </div>
              ))
            : /* Fallback static columns */
              <>
                <div>
                  <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
                    Navigation
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href={`/${locale}/product`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Produkte' : 'Ürünler'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/service/maintenance-repair`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Wartung & Instandsetzung' : 'Bakım & Onarım'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/service/modernization-retrofit`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Modernisierung & Retrofit' : 'Modernizasyon'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/service/spare-parts-components`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Ersatzteile & Komponenten' : 'Yedek Parça'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/service/automation-scada`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Automation / SCADA' : 'Otomasyon'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/service/engineering-support`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Engineering & Support' : 'Mühendislik'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/service/site-survey-engineering`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Planung & Analyse' : 'Keşif & Proje'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Kontakt' : 'İletişim'}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
                    Rechtliches
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href={`/${locale}/legal/impressum-rechtliche-hinweise`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Impressum & Rechtliche Hinweise' : 'Künye & Yasal Uyarılar'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/legal/datenschutzerklaerung`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Datenschutzerklärung' : 'Gizlilik Politikası'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/legal/cookie-richtlinie`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Cookie-Richtlinie' : 'Çerez Politikası'}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/legal/informationspflicht`} className="hover:text-white transition-colors">
                        {locale === 'de' ? 'Informationspflicht' : 'Bilgilendirme Yükümlülüğü'}
                      </Link>
                    </li>
                  </ul>
                </div>
              </>}
        </div>

        {/* Floating links (no section) */}
        {floatingLinks.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
            {floatingLinks.map((link) => (
              <Link
                key={link.id}
                href={toHref(link.url)}
                className="text-sm hover:text-white transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-sm text-center flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {year} Kühlturm. Alle Rechte vorbehalten.</p>
          <p className="text-xs opacity-50 flex items-center gap-1">
            Design & Build by 
            <a 
              href="https://guezelwebdesign.de" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-green-500 font-bold transition-colors"
            >
              GWD
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
