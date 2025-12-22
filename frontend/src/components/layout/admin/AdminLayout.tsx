'use client';

import type { ReactNode } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminSidebar from './AdminSidebar';

export type ActiveTab =
  | 'dashboard'
  | 'site_settings'
  | 'custom_pages'
  | 'services'
  | 'products'
  | 'sparepart'
  | 'categories'
  | 'subcategories'
  | 'slider'
  | 'references'
  | 'faqs'
  | 'contacts'
  | 'newsletter'
  | 'email_templates'
  | 'library'
  | 'users'
  | 'db'
  | 'reviews'
  | 'support'
  | 'menuitem'
  | 'storage'
  | 'offers'
  | 'catalog_requests';

type AdminLayoutProps = {
  activeTab: ActiveTab;
  onTabChange: (v: ActiveTab) => void;
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

const MOBILE_MQ = '(max-width: 767.98px)';

export default function AdminLayout({
  activeTab,
  onTabChange,
  onNavigateHome,
  onNavigateLogin,
  header,
  footer,
  children,
}: AdminLayoutProps) {
  // SSR-safe initial values
  const initialIsMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_MQ).matches;
  }, []);

  const [isMobile, setIsMobile] = useState<boolean>(initialIsMobile);

  // ✅ Mobilde otomatik collapsed, desktopta expanded
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(initialIsMobile);

  // ✅ resize/orientation change: otomatik olarak doğru moda dön
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(MOBILE_MQ);

    const apply = (matches: boolean) => {
      setIsMobile(matches);
      // breakpoint değiştiğinde default’a dön:
      // mobile -> collapsed, desktop -> expanded
      setSidebarCollapsed(matches);
    };

    // ilk uygula
    apply(mq.matches);

    const handler = (e: MediaQueryListEvent) => apply(e.matches);

    // modern + fallback
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', handler);
    else mq.addListener(handler);

    return () => {
      if (typeof mq.removeEventListener === 'function') mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((p) => !p);
  }, []);

  return (
    <div
      className={
        'ensotek-admin-shell d-flex min-vh-100 bg-light ' +
        (sidebarCollapsed ? 'ensotek-admin--collapsed' : 'ensotek-admin--expanded')
      }
      data-mobile={isMobile ? '1' : '0'}
    >
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
      />

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {React.isValidElement(header)
          ? React.cloneElement(header as any, {
              onToggleSidebar: toggleSidebar,
              sidebarCollapsed,
              isMobile,
            })
          : header}

        <main role="main" className="flex-grow-1 overflow-auto p-3 p-md-4" style={{ minHeight: 0 }}>
          {children}
        </main>

        {footer}
      </div>
    </div>
  );
}
