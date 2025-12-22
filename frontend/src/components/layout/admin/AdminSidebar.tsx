// src/components/layout/admin/AdminSidebar.tsx
// Ensotek Admin Sidebar – sade, Bootstrap uyumlu (responsive via AdminLayout CSS)

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  BarChart3,
  Package,
  Settings,
  LogOut,
  Home,
  FileText,
  FolderTree,
  HelpCircle,
  Users,
  Mail,
  ImageIcon,
  BookOpen,
  Wrench,
} from 'lucide-react';
import type { ActiveTab } from './AdminLayout';
import { useLogoutMutation } from '@/integrations/rtk/hooks';
import { tokenStore } from '@/integrations/core/token';

type AdminSidebarProps = {
  activeTab: ActiveTab;
  onTabChange: (v: ActiveTab) => void;
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
};

type MenuItem = {
  title: string;
  value: ActiveTab;
  icon: React.ComponentType<any>;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    label: 'Genel',
    items: [
      { title: 'Dashboard', value: 'dashboard', icon: BarChart3 },
      { title: 'Site Ayarları', value: 'site_settings', icon: Settings },
      { title: 'Sayfalar (Custom Pages)', value: 'custom_pages', icon: FileText },
      { title: 'Hizmetler', value: 'services', icon: FolderTree },
      { title: 'Teklif Formu', value: 'offers', icon: FileText },
    ],
  },
  {
    label: 'İçerik Yönetimi',
    items: [
      { title: 'Kuleler', value: 'products', icon: Package },
      { title: 'Yedek Parçalar', value: 'sparepart', icon: Wrench },
      { title: 'Kategoriler', value: 'categories', icon: FolderTree },
      { title: 'Alt Kategoriler', value: 'subcategories', icon: FolderTree },
      { title: 'Slider', value: 'slider', icon: ImageIcon },
      { title: 'Referanslar', value: 'references', icon: FileText },
      { title: 'SSS (FAQ)', value: 'faqs', icon: HelpCircle },
      { title: 'İletişim Mesajları', value: 'contacts', icon: Mail },
      { title: 'Bülten Aboneleri', value: 'newsletter', icon: Mail },
      { title: 'Katalog Talepleri', value: 'catalog_requests', icon: FileText },
      { title: 'E-posta Şablonları', value: 'email_templates', icon: Mail },
      { title: 'Kütüphane / Library', value: 'library', icon: BookOpen },
      { title: 'Yorumlar', value: 'reviews', icon: FileText },
      { title: 'Destek', value: 'support', icon: HelpCircle },
      { title: 'Menü Öğeleri', value: 'menuitem', icon: FolderTree },
      { title: 'Depolama', value: 'storage', icon: ImageIcon },
    ],
  },
  {
    label: 'Ayarlar',
    items: [
      { title: 'Kullanıcılar', value: 'users', icon: Users },
      { title: 'Veritabanı Araçları', value: 'db', icon: Settings },
    ],
  },
];

const NavButton = ({
  active,
  icon: Icon,
  title,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<any>;
  title: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title} // desktop fallback
      aria-label={title}
      className={
        'ensotek-nav-btn ensotek-tooltip w-100 d-flex align-items-center gap-2 px-3 py-2 rounded-2 border-0 text-start small ' +
        (active ? 'bg-white text-dark fw-semibold' : 'bg-transparent text-white')
      }
      style={{
        cursor: 'pointer',
        opacity: active ? 1 : 0.92,
      }}
      onMouseEnter={(e) => {
        if (active) return;
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.10)';
        (e.currentTarget as HTMLButtonElement).style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        if (active) return;
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.opacity = '0.92';
      }}
    >
      <Icon size={16} />

      {/* Normal (desktop) text */}
      <span className="ensotek-sidebar-text flex-grow-1">{title}</span>

      {/* Mobile icon-only tooltip bubble (CSS ile sadece xs/sm’de gösterilecek) */}
      <span className="ensotek-nav-tooltip" role="tooltip">
        {title}
      </span>
    </button>
  );
};

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onNavigateHome,
}: AdminSidebarProps) {
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      toast.error('Çıkış yapılırken bir hata oluştu (sunucu).');
    } finally {
      try {
        tokenStore.set(null);
        localStorage.removeItem('mh_refresh_token');
      } catch {
        // ignore
      }
      onNavigateHome?.();
    }
  };

  return (
    <aside
      className="ensotek-admin-sidebar bg-dark text-light d-flex flex-column flex-shrink-0"
      style={{ minHeight: '100vh' }}
    >
      {/* Logo / brand */}
      <div className="ensotek-sidebar-brand border-bottom border-secondary px-3 py-3 d-flex align-items-center gap-2">
        <div
          className="bg-primary text-white rounded-2 d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32 }}
          title="Ensotek Admin"
        >
          <span className="fw-bold small">EN</span>
        </div>

        <div className="ensotek-sidebar-text flex-grow-1">
          <div className="fw-semibold text-white small">Ensotek Admin</div>
          <div className="text-white small" style={{ opacity: 0.7 }}>
            Yönetim Paneli
          </div>
        </div>
      </div>

      {/* Menü grupları */}
      <div className="flex-grow-1 overflow-auto py-3">
        {menuGroups.map((group) => (
          <div key={group.label} className="ensotek-sidebar-group mb-3 px-3">
            <div
              className="ensotek-sidebar-group-label text-uppercase small mb-1"
              style={{ color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5 }}
            >
              {group.label}
            </div>

            <div className="d-flex flex-column gap-1">
              {group.items.map((item) => (
                <NavButton
                  key={item.value}
                  active={activeTab === item.value}
                  icon={item.icon}
                  title={item.title}
                  onClick={() => onTabChange(item.value)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Alt kısım: Ana sayfa + Çıkış */}
      <div className="ensotek-sidebar-bottom border-top border-secondary px-3 py-3">
        <div className="d-flex flex-column gap-2">
          <button
            type="button"
            className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 ensotek-tooltip"
            onClick={() => onNavigateHome?.()}
            title="Ana sayfaya dön"
            aria-label="Ana sayfaya dön"
          >
            <Home size={16} />
            <span className="ensotek-sidebar-text">Ana sayfaya dön</span>
            <span className="ensotek-nav-tooltip" role="tooltip">
              Ana sayfaya dön
            </span>
          </button>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 ensotek-tooltip"
            onClick={handleLogout}
            title="Çıkış yap"
            aria-label="Çıkış yap"
          >
            <LogOut size={16} />
            <span className="ensotek-sidebar-text">Çıkış yap</span>
            <span className="ensotek-nav-tooltip" role="tooltip">
              Çıkış yap
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
