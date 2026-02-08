// src/pages/_app.tsx
import React, { useEffect, useMemo } from 'react';
import type { AppContext, AppProps } from 'next/app';
import NextApp from 'next/app';
import { useRouter } from 'next/router';
import { Toaster } from 'sonner';

import AnalyticsScripts from '@/features/analytics/AnalyticsScripts';
import GAViewPages from '@/features/analytics/GAViewPages';
import CookieConsentBanner from '@/layout/banner/CookieConsentBanner';

// Critical CSS - Bootstrap is required for layout, must be loaded first
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/index-four.scss';
import '@/styles/main.scss';
import 'nprogress/nprogress.css';
// Note: FontAwesome and AOS CSS will be loaded async via _document.tsx

import '@/integrations/rtk/public/_register';

import { StoreProvider } from '@/store';
import LangBoot from '@/i18n/LangBoot';
import Layout from '@/layout/Layout';

// ✅ IMPORTANT: route change'de SEO override reset (rewrite/unmount edge-case fix)
import { resetLayoutSeo } from '@/seo/layoutSeoStore';

// Admin shell
import AdminLayoutShell, { type ActiveTab } from '@/layout/admin/AdminLayout';
import AdminHeader from '@/layout/admin/AdminHeader';
import AdminFooter from '@/layout/admin/AdminFooter';

// Admin nav helpers
import { isAdminPath, pathToTab, tabToPath } from '@/layout/admin/adminNav';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const rawPath = useMemo(() => {
    return (router.asPath || router.pathname || '/').split(/[?#]/)[0] || '/';
  }, [router.asPath, router.pathname]);

  const isAdminRoute = useMemo(() => isAdminPath(rawPath), [rawPath]);

  // Web Vitals tracking (load once on mount)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamic import to avoid blocking initial load
    import('@/utils/webVitals')
      .then(({ initWebVitals }) => {
        initWebVitals();
      })
      .catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to load web vitals:', err);
        }
      });
  }, []); // Empty deps - run once on mount

  // NProgress + AOS + ✅ SEO reset on route start
  useEffect(() => {
    let mounted = true;

    let NProgressMod: any = null;
    let AOSMod: any = null;

    const start = () => {
      // ✅ prevent "stuck" overrides on rewrite/mount edge cases
      try {
        resetLayoutSeo();
      } catch {}

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
      <LangBoot />

      {!isAdminRoute && <AnalyticsScripts />}
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

      {!isAdminRoute && <CookieConsentBanner />}
    </StoreProvider>
  );
}

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
