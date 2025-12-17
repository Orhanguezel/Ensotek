// src/components/layout/admin/adminNav.ts
import type { ActiveTab } from "@/components/layout/admin/AdminLayout";

export const ADMIN_TAB_ROUTES: Record<ActiveTab, string> = {
    dashboard: "/admin",

    site_settings: "/admin/site-settings",
    custom_pages: "/admin/custompage",
    services: "/admin/services",

    products: "/admin/products",
    sparepart: "/admin/sparepart",
    categories: "/admin/categories",
    subcategories: "/admin/subcategories",

    slider: "/admin/slider",
    references: "/admin/references",

    faqs: "/admin/faqs",
    contacts: "/admin/contacts",

    newsletter: "/admin/newsletter",
    email_templates: "/admin/email-templates",
    library: "/admin/library",

    users: "/admin/users",
    db: "/admin/db",

    reviews: "/admin/reviews",
    support: "/admin/support",

    menuitem: "/admin/menuitem",
    storage: "/admin/storage",
    offers: "/admin/offers",
    catalog_requests: "/admin/catalog-requests",
};

export function isAdminPath(path: string): boolean {
    const p = String(path || "/");
    return p === "/admin" || p.startsWith("/admin/");
}

/**
 * "/admin/products/123" gibi alt rotalarda tab bulur.
 * En uzun prefix’i seçerek yanlış eşleşmeleri azaltır.
 */
export function pathToTab(pathname: string): ActiveTab {
    const p = String(pathname || "/");

    // exact dashboard
    if (p === "/admin" || p === "/admin/") return "dashboard";

    let best: { tab: ActiveTab; len: number } | null = null;

    for (const [tab, base] of Object.entries(ADMIN_TAB_ROUTES) as Array<
        [ActiveTab, string]
    >) {
        if (tab === "dashboard") continue;

        if (p === base || p.startsWith(base + "/")) {
            const len = base.length;
            if (!best || len > best.len) best = { tab, len };
        }
    }

    return best?.tab ?? "dashboard";
}

export function tabToPath(tab: ActiveTab): string {
    return ADMIN_TAB_ROUTES[tab] ?? "/admin";
}
