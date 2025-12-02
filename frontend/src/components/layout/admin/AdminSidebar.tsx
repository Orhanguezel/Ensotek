// src/components/layout/admin/AdminSidebar.tsx
// Ensotek Admin Sidebar – sade, Bootstrap uyumlu

"use client";

import * as React from "react";
import { toast } from "sonner";
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
} from "lucide-react";
import type { ActiveTab } from "./AdminLayout";
import { useLogoutMutation } from "@/integrations/rtk/endpoints/auth.endpoints";
import { tokenStore } from "@/integrations/core/token";

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
    label: "Genel",
    items: [
      { title: "Dashboard", value: "dashboard", icon: BarChart3 },
      { title: "Site Ayarları", value: "site_settings", icon: Settings },
      {
        title: "Sayfalar (Custom Pages)",
        value: "custom_pages",
        icon: FileText,
      },
      { title: "Hizmetler", value: "services", icon: FolderTree },
    ],
  },
  {
    label: "İçerik Yönetimi",
    items: [
      { title: "Ürünler", value: "products", icon: Package },
      { title: "Kategoriler", value: "categories", icon: FolderTree },
      { title: "Alt Kategoriler", value: "subcategories", icon: FolderTree },
      { title: "Slider", value: "slider", icon: ImageIcon },
      { title: "Referanslar", value: "references", icon: FileText },
      { title: "SSS (FAQ)", value: "faqs", icon: HelpCircle },
      { title: "İletişim Mesajları", value: "contacts", icon: Mail },
      { title: "Bülten Aboneleri", value: "newsletter", icon: Mail },
      { title: "E-posta Şablonları", value: "email_templates", icon: Mail },
      { title: "Kütüphane / Library", value: "library", icon: BookOpen },
      { title: "Yorumlar", value: "reviews", icon: FileText },
      { title: "Destek", value: "support", icon: HelpCircle },
      { title: "Menü Öğeleri", value: "menuitem", icon: FolderTree },
      { title: "Depolama", value: "storage", icon: ImageIcon },
    ],
  },
  {
    label: "Ayarlar",
    items: [
      { title: "Kullanıcılar", value: "users", icon: Users },
      { title: "Veritabanı Araçları", value: "db", icon: Settings },
    ],
  },
];

const NavButton = ({
  active,
  icon: Icon,
  children,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "w-100 d-flex align-items-center gap-2 px-3 py-2 rounded-2 border-0 text-start small " +
        (active
          ? "bg-light text-dark fw-semibold"
          : "bg-transparent text-light-50 text-white-50")
      }
      style={{ cursor: "pointer" }}
    >
      <Icon size={16} />
      <span className="flex-grow-1">{children}</span>
    </button>
  );
};

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onNavigateHome,
}: AdminSidebarProps) {
  const [logout] = useLogoutMutation();

  const handleClick = (value: ActiveTab) => {
    onTabChange(value);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      toast.error("Çıkış yapılırken bir hata oluştu (sunucu).");
    } finally {
      try {
        tokenStore.set(null);
        localStorage.removeItem("mh_refresh_token");
      } catch {
        // ignore
      }
      onNavigateHome?.();
    }
  };

  return (
    <aside
      className="ensotek-admin-sidebar bg-dark text-light d-flex flex-column"
      style={{ width: 250, minHeight: "100vh" }}
    >
      {/* Logo / brand */}
      <div className="border-bottom border-secondary px-3 py-3 d-flex align-items-center gap-2">
        <div className="bg-primary text-white rounded-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
          <span className="fw-bold small">EN</span>
        </div>
        <div className="flex-grow-1">
          <div className="fw-semibold small">Ensotek Admin</div>
          <div className="text-muted small">Yönetim Paneli</div>
        </div>
      </div>

      {/* Menü grupları */}
      <div className="flex-grow-1 overflow-auto py-3">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-3 px-3">
            <div className="text-uppercase text-muted small mb-1">
              {group.label}
            </div>
            <div className="d-flex flex-column gap-1">
              {group.items.map((item) => (
                <NavButton
                  key={item.value}
                  active={activeTab === item.value}
                  icon={item.icon}
                  onClick={() => handleClick(item.value)}
                >
                  {item.title}
                </NavButton>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Alt kısım: Ana sayfa + Çıkış */}
      <div className="border-top border-secondary px-3 py-3">
        <div className="d-flex flex-column gap-2">
          <button
            type="button"
            className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
            onClick={() => onNavigateHome?.()}
          >
            <Home size={16} />
            <span>Ana sayfaya dön</span>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Çıkış yap</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
