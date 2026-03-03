import Link from 'next/link';
import type { FooterSection, MenuItem } from '@ensotek/core/types';
import { SiteLogo } from './SiteLogo';

interface FooterProps {
  footerSections?: FooterSection[];
  footerLinks?: MenuItem[];
  logoSrc?: string | null;
}

export function Footer({ footerSections = [], footerLinks = [], logoSrc }: FooterProps) {
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
                            <Link href={link.url} className="hover:text-white transition-colors">
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
                    {[
                      { href: '/products', label: 'Produkte' },
                      { href: '/services', label: 'Dienstleistungen' },
                      { href: '/references', label: 'Referenzen' },
                      { href: '/contact', label: 'Kontakt' },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="hover:text-white transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
                    Rechtliches
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/imprint" className="hover:text-white transition-colors">
                        Impressum
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy-policy" className="hover:text-white transition-colors">
                        Datenschutz
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
                href={link.url}
                className="text-sm hover:text-white transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-sm text-center">
          © {year} Kühlturm. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
