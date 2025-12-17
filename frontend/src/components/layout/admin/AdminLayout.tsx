// src/components/layout/admin/AdminLayout.tsx
"use client";

import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

export type ActiveTab =
  | "dashboard"
  | "site_settings"
  | "custom_pages"
  | "services"
  | "products"
  | "sparepart"
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
  | "offers"
  | "catalog_requests";

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
  onNavigateLogin,
  header,
  footer,
  children,
}: AdminLayoutProps) {
  return (
    <div className="ensotek-admin-shell d-flex min-vh-100 bg-light">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
      />

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {header}

        <main
          role="main"
          className="flex-grow-1 overflow-auto p-3 p-md-4"
          style={{ minHeight: 0 }}
        >
          {children}
        </main>

        {footer}
      </div>
    </div>
  );
}
