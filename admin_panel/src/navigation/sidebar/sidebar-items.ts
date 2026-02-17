// =============================================================
// FILE: src/navigation/sidebar/sidebar-items.ts
// FINAL — GuezelWebDesign — Sidebar items (labels are dynamic via site_settings.ui_admin)
// - Dashboard base: /admin/dashboard
// - Admin pages: /admin/...  (route group "(admin)" URL'e dahil olmaz)
// =============================================================

import {
  Award,
  BarChart,
  Bell,
  BookOpen,
  Bot,
  ClipboardList,
  Cog,
  DollarSign,
  Contact2,
  Database,
  FileSearch,
  FileText,
  FolderOpen,
  Folders,
  HardDrive,
  HelpCircle,
  Images,
  LayoutDashboard,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Package,
  Send,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { TranslateFn } from '@/i18n';

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export type AdminNavItemKey =
  | 'dashboard'
  | 'site_settings'
  | 'custom_pages'
  | 'categories'
  | 'subcategories'
  | 'library'
  | 'products'
  | 'sparepart'
  | 'services'
  | 'sliders'
  | 'menu_items'
  | 'footer_sections'
  | 'faqs'
  | 'contacts'
  | 'reviews'
  | 'mail'
  | 'users'
  | 'email_templates'
  | 'notifications'
  | 'storage'
  | 'db'
  | 'audit'
  | 'reports'
  | 'offers'
  | 'catalog_requests'
  | 'telegram'
  | 'chat'
  | 'references';

export type AdminNavGroupKey = 'general' | 'content' | 'marketing' | 'communication' | 'system';

export type AdminNavConfigItem = {
  key: AdminNavItemKey;
  url: string;
  icon?: LucideIcon;
};

export type AdminNavConfigGroup = {
  id: number;
  key: AdminNavGroupKey;
  items: AdminNavConfigItem[];
};

export const adminNavConfig: AdminNavConfigGroup[] = [
  {
    id: 1,
    key: 'general',
    items: [{ key: 'dashboard', url: '/admin/dashboard', icon: LayoutDashboard }],
  },
  {
    id: 2,
    key: 'content',
    items: [
      { key: 'site_settings', url: '/admin/site-settings', icon: Settings },
      { key: 'custom_pages', url: '/admin/custompage', icon: FileText },
      { key: 'categories', url: '/admin/categories', icon: Folders },
      { key: 'subcategories', url: '/admin/subcategories', icon: FolderOpen },
      { key: 'library', url: '/admin/library', icon: BookOpen },
      { key: 'products', url: '/admin/products', icon: Package },
      { key: 'sparepart', url: '/admin/products?type=sparepart', icon: Cog },
      { key: 'services', url: '/admin/services', icon: Wrench },
      { key: 'sliders', url: '/admin/slider', icon: Images },
      { key: 'menu_items', url: '/admin/menuitem', icon: Menu },
      { key: 'footer_sections', url: '/admin/footer-sections', icon: FileText },
      { key: 'faqs', url: '/admin/faqs', icon: HelpCircle },
      { key: 'references', url: '/admin/references', icon: Award },
    ],
  },
  {
    id: 4,
    key: 'communication',
    items: [
      { key: 'offers', url: '/admin/offer', icon: DollarSign },
      { key: 'catalog_requests', url: '/admin/catalog', icon: ClipboardList },
      { key: 'contacts', url: '/admin/contacts', icon: Contact2 },
      { key: 'reviews', url: '/admin/reviews', icon: MessageSquare },
      { key: 'mail', url: '/admin/mail', icon: Send },
      { key: 'telegram', url: '/admin/telegram', icon: MessageCircle },
      { key: 'chat', url: '/admin/chat', icon: Bot },
    ],
  },
  {
    id: 5,
    key: 'system',
    items: [
      { key: 'users', url: '/admin/users', icon: Users },
      { key: 'email_templates', url: '/admin/email-templates', icon: Mail },
      { key: 'notifications', url: '/admin/notifications', icon: Bell },
      { key: 'storage', url: '/admin/storage', icon: HardDrive },
      { key: 'db', url: '/admin/db', icon: Database },
      { key: 'audit', url: '/admin/audit', icon: FileSearch },
      { key: 'reports', url: '/admin/reports', icon: BarChart },
    ],
  },
];

export type AdminNavCopy = {
  labels: Record<AdminNavGroupKey, string>;
  items: Record<AdminNavItemKey, string>;
};

// Fallback titles for when translations are missing
const FALLBACK_TITLES: Record<AdminNavItemKey, string> = {
  dashboard: 'Dashboard',
  site_settings: 'Site Settings',
  custom_pages: 'Custom Pages',
  categories: 'Categories',
  subcategories: 'Subcategories',
  library: 'Library',
  products: 'Products',
  sparepart: 'Spare Parts',
  services: 'Services',
  sliders: 'Sliders',
  menu_items: 'Menu Items',
  footer_sections: 'Footer Sections',
  faqs: 'FAQs',
  offers: 'Offers',
  catalog_requests: 'Catalog Requests',
  contacts: 'Contacts',
  reviews: 'Reviews',
  mail: 'Mail',
  users: 'Users',
  email_templates: 'Email Templates',
  notifications: 'Notifications',
  storage: 'Storage',
  db: 'Database',
  audit: 'Audit',
  reports: 'Reports',
  telegram: 'Telegram',
  chat: 'Chat & AI',
  references: 'References',
};

export function buildAdminSidebarItems(
  copy?: Partial<AdminNavCopy> | null,
  t?: TranslateFn,
): NavGroup[] {
  const labels = copy?.labels ?? ({} as AdminNavCopy['labels']);
  const items = copy?.items ?? ({} as AdminNavCopy['items']);

  return adminNavConfig.map((group) => {
    // 1. Try copy.labels[group.key]
    // 2. Try t(`admin.sidebar.groups.${group.key}`)
    // 3. Fallback to empty (or key)
    const label =
      labels[group.key] || (t ? t(`admin.sidebar.groups.${group.key}` as any) : '') || '';

    return {
      id: group.id,
      label,
      items: group.items.map((item) => {
        // 1. Try copy.items[item.key]
        // 2. Try t(`admin.dashboard.items.${item.key}`)
        // 3. Fallback to FALLBACK_TITLES
        // 4. Fallback to key
        const title =
          items[item.key] ||
          (t ? t(`admin.dashboard.items.${item.key}` as any) : '') ||
          FALLBACK_TITLES[item.key] ||
          item.key;

        return {
          title,
          url: item.url,
          icon: item.icon,
        };
      }),
    };
  });
}
