// src/pages/_app.tsx

import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Toaster } from 'sonner';
import GAScripts from '@/features/analytics/GAScripts';

// Global CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/index-four.scss';
import '@/styles/main.scss';
import 'aos/dist/aos.css';
import 'nprogress/nprogress.css';

import '@/integrations/rtk/endpoints/_register';

import { StoreProvider } from '@/store';
import LangBoot from '@/i18n/LangBoot';
import Layout from '@/components/layout/Layout';

// Admin shell
import AdminLayoutShell, { type ActiveTab } from '@/components/layout/admin/AdminLayout';
import AdminHeader from '@/components/layout/admin/AdminHeader';
import AdminFooter from '@/components/layout/admin/AdminFooter';

// Admin nav helpers
import { isAdminPath, pathToTab, tabToPath } from '@/components/layout/admin/adminNav';

/* ------------------------------- App ------------------------------- */
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // asPath -> gerçek URL; query / hash atıyoruz
  const rawPath = (router.asPath || router.pathname || '/').split(/[?#]/)[0];
  const isAdminRoute = isAdminPath(rawPath);

  // NProgress + AOS
  useEffect(() => {
    let mounted = true;

    let NProgressMod: any = null;
    let AOSMod: any = null;

    const start = () => {
      try {
        NProgressMod?.start?.();
      } catch {
        // ignore
      }
    };

    const done = () => {
      try {
        NProgressMod?.done?.();
      } catch {
        // ignore
      }
    };

    const onComplete = () => {
      done();
      setTimeout(() => {
        try {
          AOSMod?.refreshHard?.();
        } catch {
          // ignore
        }
      }, 0);
    };

    (async () => {
      const [{ default: NP }, { default: AO }] = await Promise.all([
        import('nprogress'),
        import('aos'),
      ]);

      if (!mounted) return;

      NProgressMod = NP;
      AOSMod = AO;

      try {
        AOSMod.init?.({ once: true, duration: 500, easing: 'ease-out' });
      } catch {
        // ignore
      }

      try {
        NProgressMod.configure?.({ showSpinner: false, trickleSpeed: 120 });
      } catch {
        // ignore
      }

      router.events.on('routeChangeStart', start);
      router.events.on('routeChangeComplete', onComplete);
      router.events.on('routeChangeError', done);
    })();

    return () => {
      mounted = false;
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', onComplete);
      router.events.off('routeChangeError', done);
    };
  }, [router.events]);

  // ---------------- Layout seçimi ----------------
  let content = <Component {...pageProps} />;

  if (isAdminRoute) {
    const activeTab: ActiveTab = pathToTab(rawPath as string);

    const handleTabChange = (next: ActiveTab) => {
      const target = tabToPath(next);
      const current = rawPath;
      if (target && target !== current) {
        void router.push(target);
      }
    };

    content = (
      <AdminLayoutShell
        key={rawPath}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNavigateHome={() => router.push('/')}
        onNavigateLogin={() => router.push('/login')}
        header={<AdminHeader onBackHome={() => router.push('/')} />}
        footer={<AdminFooter />}
      >
        {content}
      </AdminLayoutShell>
    );
  } else {
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
