// src/components/layout/admin/AdminLayout.tsx
// Ensotek Admin Shell – Sidebar + Header + Footer

"use client";

import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

// Ensotek admin modülleri için sekmeler
export type ActiveTab =
  | "dashboard"
  | "site_settings"
  | "custom_pages"
  | "services"
  | "products"
  | "categories"
  | "subcategories"
  | "slider"
  | "references"
  | "faqs"
  | "contacts"
  | "newsletter"
  | "email_templates"
  | "library"
  | "users"
  | "db"
  | "reviews"
  | "support"
  | "menuitem"
  | "storage"
  ;


type AdminLayoutProps = {
  activeTab: ActiveTab;
  onTabChange: (v: ActiveTab) => void;
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export default function AdminLayout({
  activeTab,
  onTabChange,
  onNavigateHome,
  onNavigateLogin, // şimdilik kullanılmıyor ama prop olarak dursun
  header,
  footer,
  children,
}: AdminLayoutProps) {
  return (
    <div className="ensotek-admin-shell d-flex min-vh-100 bg-light">
      {/* Sol: Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
      />

      {/* Sağ: Header + Content + Footer */}
      <div className="flex-grow-1 d-flex flex-column">
        {header}
        <main className="flex-grow-1 overflow-auto p-3 p-md-4">
          {children}
        </main>
        {footer}
      </div>
    </div>
  );
}
