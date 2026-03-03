'use client';

import Link from 'next/link';
import { X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SiteLogo } from './SiteLogo';
import type { NavItem } from './Header';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onCatalogOpen: () => void;
  items: NavItem[];
  locale: string;
  logoSrc?: string | null;
}

export function MobileNav({ open, onClose, onCatalogOpen, items, locale, logoSrc }: MobileNavProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl flex flex-col">

        {/* Drawer header */}
        <div className="flex items-center justify-between bg-slate-900 px-4 py-3">
          <Link href={`/${locale}`} onClick={onClose}>
            <SiteLogo src={logoSrc} dark height={30} />
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 hover:bg-white/15 hover:text-white transition-colors"
            aria-label="Menü schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                {item.children.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      aria-expanded={expanded.has(item.id)}
                    >
                      {item.label}
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-slate-400 transition-transform duration-150 ${
                          expanded.has(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expanded.has(item.id) && (
                      <ul className="ml-3 mt-0.5 border-l-2 border-slate-100 pl-3 space-y-0.5">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { onClose(); onCatalogOpen(); }}
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Katalog anfordern
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
