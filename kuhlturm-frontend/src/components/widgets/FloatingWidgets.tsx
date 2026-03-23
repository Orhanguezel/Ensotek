'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { 
  Search, Globe, User, Share2, ClipboardList, X, 
  Instagram, Facebook, Linkedin, Youtube, Twitter, Phone, Mail, MapPin 
} from 'lucide-react';

interface FloatingWidgetsProps {
  activeLocales?: { code: string; label: string }[];
  socials?: Record<string, string>;
  contactInfo?: {
    company_name?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
}

export function FloatingWidgets({ activeLocales = [], socials = {}, contactInfo = {} }: FloatingWidgetsProps) {
  const [activeTab, setActiveTab] = useState<'none' | 'search' | 'lang' | 'info' | 'social'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when escaping
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTab('none');
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Focus search input when tab opens
  useEffect(() => {
    if (activeTab === 'search') {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [activeTab]);

  const toggleTab = (tab: typeof activeTab) => {
    setActiveTab(prev => prev === tab ? 'none' : tab);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/arama?q=${encodeURIComponent(searchQuery.trim())}`;
      setActiveTab('none');
    }
  };

  const socialIcons = [
    { key: 'instagram', icon: Instagram, url: socials?.instagram },
    { key: 'facebook', icon: Facebook, url: socials?.facebook },
    { key: 'linkedin', icon: Linkedin, url: socials?.linkedin },
    { key: 'youtube', icon: Youtube, url: socials?.youtube },
    { key: 'twitter', icon: Twitter, url: socials?.twitter },
  ].filter(s => s.url);

  return (
    <>
      {/* ── SEARCH OVERLAY ── */}
      {activeTab === 'search' && (
        <div className="fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-3xl z-[9999] flex items-center justify-center pointer-events-auto overflow-hidden animate-in fade-in duration-500">
          <button 
            onClick={() => setActiveTab('none')}
            className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors"
          >
            <X size={48} strokeWidth={1} />
          </button>
          
          <div className="w-full max-w-4xl px-10">
            <form onSubmit={handleSearch} className="relative group">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder') || 'Ürün, hizmet veya sayfa ara...'}
                className="w-full bg-transparent border-b-2 border-white/20 pb-4 pr-16 text-3xl lg:text-5xl text-white outline-none focus:border-white/60 transition-colors font-medium tracking-tight"
              />
              <button type="submit" className="absolute right-0 bottom-6 text-white/40 hover:text-white transition-colors">
                <Search size={32} />
              </button>
            </form>
            <div className="mt-12 flex flex-wrap gap-8 text-white/40 text-sm font-bold uppercase tracking-widest">
              <span className="text-[#319760]">{t('trendingSearches')}</span>
              <button type="button" onClick={() => setSearchQuery(t('trendCooling'))} className="hover:text-white transition-colors">{t('trendCooling')}</button>
              <button type="button" onClick={() => setSearchQuery(t('trendService'))} className="hover:text-white transition-colors">{t('trendService')}</button>
              <button type="button" onClick={() => setSearchQuery(t('trendParts'))} className="hover:text-white transition-colors">{t('trendParts')}</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9000] flex flex-col pointer-events-none">
        
        {/* ── FLOATING BAR ── */}
        <div className="flex flex-col pointer-events-auto bg-[#2b2b2b] shadow-2xl mr-0 w-[60px] relative">
          
          {/* Search Button */}
          <div className="relative">
            <button
              onClick={() => toggleTab('search')}
              aria-label="Ara"
              className={`w-[60px] h-[60px] flex items-center justify-center transition-colors ${activeTab === 'search' ? 'bg-[var(--color-brand)] text-white' : 'text-white/70 hover:bg-white/5'}`}
            >
              <Search size={22} />
            </button>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            {activeTab === 'lang' && (
              <div className="absolute right-full top-0 flex bg-[#2a2a2a] h-[60px] animate-in slide-in-from-right-10 duration-300 shadow-xl border-l border-white/5">
                {activeLocales.map(loc => (
                  <Link 
                    key={loc.code} 
                    href={pathname.replace(`/${locale}`, `/${loc.code}`)}
                    onClick={() => setActiveTab('none')}
                    className={`flex items-center justify-center min-w-[60px] px-4 text-xs font-bold uppercase hover:bg-white/10 transition-colors border-r border-white/5 ${locale === loc.code ? 'text-[var(--color-brand)]' : 'text-white/60'}`}
                  >
                    {loc.code}
                  </Link>
                ))}
              </div>
            )}
            <button 
              onClick={() => toggleTab('lang')}
              className={`w-[60px] h-[60px] flex items-center justify-center transition-colors border-t border-white/5 uppercase text-xs font-bold ${activeTab === 'lang' ? 'bg-[var(--color-brand)] text-white' : 'text-white/70 hover:bg-white/5'}`}
            >
              {locale}
            </button>
          </div>

          {/* Info Button */}
          <div className="relative">
            {activeTab === 'info' && (
              <div className="absolute right-full top-0 w-[300px] bg-white p-8 shadow-2xl animate-in slide-in-from-right-10 duration-300 rounded-l-xl">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[#1a1a1a] font-bold text-lg mb-2">{contactInfo.company_name || 'Kühlturm'}</h4>
                    <div className="flex gap-3 text-gray-500 text-sm leading-relaxed">
                      <MapPin size={18} className="shrink-0 text-[var(--color-brand)]" />
                      <span>{contactInfo.address}<br />{contactInfo.city}</span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {contactInfo.phone && (
                      <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-[var(--color-brand)] transition-colors font-medium">
                        <Phone size={18} />
                        <span>{contactInfo.phone}</span>
                      </a>
                    )}
                    {contactInfo.email && (
                      <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-gray-600 hover:text-[var(--color-brand)] transition-colors font-medium">
                        <Mail size={18} />
                        <span>{contactInfo.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => toggleTab('info')}
              aria-label="İletişim bilgileri"
              className={`w-[60px] h-[60px] flex items-center justify-center transition-colors border-t border-white/5 ${activeTab === 'info' ? 'bg-[var(--color-brand)] text-white' : 'text-white/70 hover:bg-white/5'}`}
            >
              <User size={22} />
            </button>
          </div>

          {/* Social Share */}
          <div className="relative">
            {activeTab === 'social' && (
              <div className="absolute right-full top-0 flex bg-[#2a2a2a] h-[60px] animate-in slide-in-from-right-10 duration-300 shadow-xl border-l border-white/5">
                {socialIcons.map((s) => (
                  <a 
                    key={s.key} 
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-[60px] text-white/50 hover:text-white hover:bg-white/10 transition-colors border-r border-white/5"
                  >
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
            )}
            <button
              onClick={() => toggleTab('social')}
              aria-label="Sosyal medya"
              className={`w-[60px] h-[60px] flex items-center justify-center transition-colors border-t border-white/5 ${activeTab === 'social' ? 'bg-[var(--color-brand)] text-white' : 'text-white/70 hover:bg-white/5'}`}
            >
              <Share2 size={22} />
            </button>
          </div>

          {/* Teklif Al Widget */}
          <Link 
            href={`/${locale}/offer`}
            className="w-[60px] h-[85px] bg-[var(--color-brand)] text-white flex flex-col items-center justify-center hover:opacity-90 transition-all border-t border-white/10 group overflow-hidden"
          >
            <ClipboardList size={22} className="group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-center leading-none opacity-90">{t('offerWidgetLine1') || 'OFFER'}<br/>{t('offerWidgetLine2') || 'REQUEST'}</span>
          </Link>

        </div>
      </div>

      {activeTab !== 'none' && activeTab !== 'search' && (
        <div className="fixed inset-0 z-[8999]" onClick={() => setActiveTab('none')} />
      )}
    </>
  );
}
