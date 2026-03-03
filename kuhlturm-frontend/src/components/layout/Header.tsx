'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Menu, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { MobileNav } from './MobileNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SiteLogo } from './SiteLogo';
import { CatalogModal } from './CatalogModal';
import type { MenuItem } from '@ensotek/core/types';

/* ── Types ─────────────────────────────────────────────────────────── */

export interface NavItem {
  id: string;
  href: string;
  label: string;
  children: NavItem[];
}

interface HeaderProps {
  menuItems?: MenuItem[];
  logoSrc?: string | null;
}

/* ── Tree builder ───────────────────────────────────────────────────── */

function buildNavTree(items: MenuItem[], locale: string): NavItem[] {
  const active = items
    .filter((m) => m.is_active)
    .sort((a, b) => a.order_num - b.order_num);

  // Prefix a backend URL with the current locale
  const toHref = (url: string | null | undefined) => {
    if (!url || url === '/') return `/${locale}`;
    return `/${locale}${url.startsWith('/') ? url : `/${url}`}`;
  };

  // Build children map keyed by parent_id
  const childMap = new Map<string, NavItem[]>();
  active
    .filter((m) => m.parent_id)
    .forEach((m) => {
      const list = childMap.get(m.parent_id!) ?? [];
      list.push({ id: m.id, href: toHref(m.url), label: m.title, children: [] });
      childMap.set(m.parent_id!, list);
    });

  // Deduplicate root items: if two items share the same URL or the same title,
  // keep only the one that has children (dropdown); tie-break by order_num (first wins).
  const seenUrl = new Map<string, string>();   // url   → preferred item id
  const seenTitle = new Map<string, string>(); // title → preferred item id

  active.filter((m) => !m.parent_id).forEach((m) => {
    const hasKids = childMap.has(m.id);
    const urlKey   = m.url || m.id;
    const titleKey = m.title.toLowerCase().trim();

    const prevUrl = seenUrl.get(urlKey);
    if (!prevUrl || (!childMap.has(prevUrl) && hasKids)) seenUrl.set(urlKey, m.id);

    const prevTitle = seenTitle.get(titleKey);
    if (!prevTitle || (!childMap.has(prevTitle) && hasKids)) seenTitle.set(titleKey, m.id);
  });

  // Only show an item if it wins both the URL slot and the title slot
  const urlWinners   = new Set(seenUrl.values());
  const titleWinners = new Set(seenTitle.values());

  return active
    .filter((m) => !m.parent_id && urlWinners.has(m.id) && titleWinners.has(m.id))
    .map((r) => ({
      id: r.id,
      href: toHref(r.url),
      label: r.title,
      children: childMap.get(r.id) ?? [],
    }));
}

/* ── Dropdown item ──────────────────────────────────────────────────── */

function DropdownItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (item.children.length === 0) {
    return (
      <Link
        href={item.href}
        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown
          size={13}
          className={`mt-px transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-2 z-50 min-w-48">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 overflow-hidden">
            {item.children.map((child) => (
              <Link
                key={child.id}
                href={child.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────────────────── */

export function Header({ menuItems = [], logoSrc }: HeaderProps) {
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const navItems = buildNavTree(menuItems, locale);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link href={`/${locale}`} className="shrink-0">
              <SiteLogo src={logoSrc} height={38} />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-5">
              {navItems.map((item) => (
                <DropdownItem key={item.id} item={item} />
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher iconOnly />
              <button
                type="button"
                onClick={() => setCatalogOpen(true)}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Katalog anfordern
              </button>
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Menü öffnen"
            >
              <Menu size={20} />
            </button>

          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onCatalogOpen={() => setCatalogOpen(true)}
        items={navItems}
        locale={locale}
        logoSrc={logoSrc}
      />

      <CatalogModal
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        locale={locale}
      />
    </>
  );
}
