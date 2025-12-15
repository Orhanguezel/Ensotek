// src/pages/_app.tsx

"use client";

import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "sonner";
import GAScripts from "@/features/analytics/GAScripts";


// Global CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/index-four.scss";
import "@/styles/main.scss";
import "aos/dist/aos.css";
import "nprogress/nprogress.css";

import { StoreProvider } from "@/store";
import LangBoot from "@/i18n/LangBoot";
import Layout from "@/components/layout/Layout";

// ✅ Admin shell importları
import AdminLayoutShell, {
  type ActiveTab,
} from "@/components/layout/admin/AdminLayout";
import AdminHeader from "@/components/layout/admin/AdminHeader";
import AdminFooter from "@/components/layout/admin/AdminFooter";

/* --------- Admin path ↔ tab mapping (Ensotek modülleri) --------- */

function pathToTab(pathname: string): ActiveTab {
  if (pathname === "/admin" || pathname === "/admin/") return "dashboard";

  if (pathname.startsWith("/admin/site-settings")) return "site_settings";
  if (pathname.startsWith("/admin/custompage")) return "custom_pages";
  if (pathname.startsWith("/admin/services")) return "services";

  if (pathname.startsWith("/admin/products")) return "products";
  if (pathname.startsWith("/admin/sparepart")) return "sparepart";
  if (pathname.startsWith("/admin/categories")) return "categories";
  if (pathname.startsWith("/admin/subcategories")) return "subcategories";

  if (pathname.startsWith("/admin/slider")) return "slider";
  if (pathname.startsWith("/admin/references")) return "references";

  if (pathname.startsWith("/admin/faqs")) return "faqs";
  if (pathname.startsWith("/admin/contacts")) return "contacts";

  if (pathname.startsWith("/admin/newsletter")) return "newsletter";
  if (pathname.startsWith("/admin/email-templates")) return "email_templates";
  if (pathname.startsWith("/admin/library")) return "library";

  if (pathname.startsWith("/admin/users")) return "users";
  if (pathname.startsWith("/admin/db")) return "db";

  if (pathname.startsWith("/admin/reviews")) return "reviews";
  if (pathname.startsWith("/admin/support")) return "support";

  if (pathname.startsWith("/admin/menuitem")) return "menuitem";
  if (pathname.startsWith("/admin/storage")) return "storage";
  if (pathname.startsWith("/admin/offers")) return "offers";
  if (pathname.startsWith("/admin/catalog-requests")) return "catalog_requests";

  return "dashboard";
}

function tabToPath(tab: ActiveTab): string {
  switch (tab) {
    case "dashboard":
      return "/admin";
    case "site_settings":
      return "/admin/site-settings";
    case "custom_pages":
      return "/admin/custompage";
    case "services":
      return "/admin/services";

    case "products":
      return "/admin/products";
    case "sparepart":
      return "/admin/sparepart";
    case "categories":
      return "/admin/categories";
    case "subcategories":
      return "/admin/subcategories";

    case "slider":
      return "/admin/slider";
    case "references":
      return "/admin/references";

    case "faqs":
      return "/admin/faqs";
    case "contacts":
      return "/admin/contacts";

    case "newsletter":
      return "/admin/newsletter";
    case "email_templates":
      return "/admin/email-templates";
    case "library":
      return "/admin/library";

    case "users":
      return "/admin/users";
    case "db":
      return "/admin/db";

    case "reviews":
      return "/admin/reviews";
    case "support":
      return "/admin/support";

    case "menuitem":
      return "/admin/menuitem";
    case "storage":
      return "/admin/storage";
    case "offers":
      return "/admin/offers";
    case "catalog_requests":
      return "/admin/catalog-requests";

    default:
      return "/admin";
  }
}

/* ------------------------------- App ------------------------------- */
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  // NProgress + AOS
  useEffect(() => {
    let removeRouteHooks: (() => void) | undefined;

    (async () => {
      const [{ default: NProgress }, { default: AOS }] = await Promise.all([
        import("nprogress"),
        import("aos"),
      ]);

      AOS.init({ once: true, duration: 500, easing: "ease-out" });

      NProgress.configure({ showSpinner: false, trickleSpeed: 120 });
      const start = () => NProgress.start();
      const done = () => NProgress.done();

      router.events.on("routeChangeStart", start);
      router.events.on("routeChangeComplete", () => {
        done();
        setTimeout(() => {
          try {
            AOS.refreshHard();
          } catch {
            void 0;
          }
        }, 0);
      });
      router.events.on("routeChangeError", done);

      removeRouteHooks = () => {
        router.events.off("routeChangeStart", start);
        router.events.off("routeChangeComplete", done);
        router.events.off("routeChangeError", done);
      };
    })();

    return () => {
      try {
        if (removeRouteHooks) removeRouteHooks();
      } catch {
        void 0;
      }
    };
  }, [router.events]);

  // ---------------- Layout seçimi ----------------
  let content = <Component {...pageProps} />;

  if (isAdminRoute) {
    const pathname = router.pathname;
    const activeTab = pathToTab(pathname);

    const handleTabChange = (next: ActiveTab) => {
      const target = tabToPath(next);
      if (target && target !== pathname) {
        router.push(target);
      }
    };

    content = (
      <AdminLayoutShell
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNavigateHome={() => router.push("/")}
        onNavigateLogin={() => router.push("/login")}
        header={<AdminHeader onBackHome={() => router.push("/")} />}
        footer={<AdminFooter />}
      >
        {content}
      </AdminLayoutShell>
    );
  } else {
    // ✅ Brand ve logo artık tamamen site_settings üzerinden Layout/Header içinde okunuyor
    content = <Layout>{content}</Layout>;
  }

  return (
    <StoreProvider>
      <LangBoot />
      <GAScripts />
      <Toaster position="top-right" richColors closeButton duration={4000} />
      {content}
    </StoreProvider>
  );
}
