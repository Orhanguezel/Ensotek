// src/pages/_app.tsx
import React, { useEffect, useMemo } from 'react';
import type { AppContext, AppProps } from 'next/app';
import NextApp from 'next/app';
import { useRouter } from 'next/router';
import { Toaster } from 'sonner';

import AnalyticsScripts from '@/features/analytics/AnalyticsScripts';
import GAViewPages from '@/features/analytics/GAViewPages';
import CookieConsentBanner from '@/components/layout/banner/CookieConsentBanner';

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

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const rawPath = useMemo(() => {
    return (router.asPath || router.pathname || '/').split(/[?#]/)[0] || '/';
  }, [router.asPath, router.pathname]);

  const isAdminRoute = useMemo(() => isAdminPath(rawPath), [rawPath]);

  // NProgress + AOS
  useEffect(() => {
    let mounted = true;

    let NProgressMod: any = null;
    let AOSMod: any = null;

    const start = () => {
      try {
        NProgressMod?.start?.();
      } catch {}
    };

    const done = () => {
      try {
        NProgressMod?.done?.();
      } catch {}
    };

    const onComplete = () => {
      done();
      setTimeout(() => {
        try {
          AOSMod?.refreshHard?.();
        } catch {}
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
      } catch {}

      try {
        NProgressMod.configure?.({ showSpinner: false, trickleSpeed: 120 });
      } catch {}

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

  return (
    <StoreProvider>
      {/* locale + ui boot */}
      <LangBoot />

      {/* ✅ Analytics scripts (GTM preferred; consent default denied) */}
      {!isAdminRoute && <AnalyticsScripts />}

      {/* ✅ Page view sender (Pages Router) */}
      {!isAdminRoute && <GAViewPages />}

      <Toaster position="top-right" richColors closeButton duration={4000} />

      {isAdminRoute ? (
        <AdminRouteShell rawPath={rawPath}>
          <Component {...pageProps} />
        </AdminRouteShell>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}

      {/* ✅ Cookie banner: admin’da göstermiyoruz */}
      {!isAdminRoute && <CookieConsentBanner />}
    </StoreProvider>
  );
}

/**
 * ✅ SSR'i zorlar: Pages Router'da rewrites + locale query senaryolarında
 * ilk HTML üretiminde path/locale bilgisinin stabil kalması için kritik.
 */
App.getInitialProps = async (appCtx: AppContext) => {
  const appProps = await NextApp.getInitialProps(appCtx);
  return { ...appProps };
};

export default App;

function AdminRouteShell(props: { rawPath: string; children: React.ReactNode }) {
  const router = useRouter();
  const activeTab: ActiveTab = pathToTab(props.rawPath);

  const handleTabChange = (next: ActiveTab) => {
    const target = tabToPath(next);
    const current = props.rawPath;
    if (target && target !== current) void router.push(target);
  };

  return (
    <AdminLayoutShell
      key={props.rawPath}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onNavigateHome={() => router.push('/')}
      onNavigateLogin={() => router.push('/login')}
      header={<AdminHeader onBackHome={() => router.push('/')} />}
      footer={<AdminFooter />}
    >
      {props.children}
    </AdminLayoutShell>
  );
}
