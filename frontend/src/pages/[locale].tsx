// =============================================================
// FILE: pages/[locale].tsx  
// Locale-prefixed homepage routes (/tr, /en, etc.)
// Redirects to proper localized URLs based on configuration
// =============================================================

import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LocaleRedirectPage = () => {
  const router = useRouter();
  const { locale } = router.query;

  useEffect(() => {
    if (typeof locale === 'string') {
      // Handle rewrite to home page with locale query parameter
      const queryParams = new URLSearchParams();
      queryParams.set('__lc', locale);
      
      // Redirect to homepage with locale query
      router.replace(`/?${queryParams.toString()}`);
    }
  }, [locale, router]);

  // Show loading during redirect
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}>
      <div>Yönlendiriliyor...</div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Active locales - should sync with database app_locales
  const activeLocales = ['tr', 'en']; // 'de' is default and prefixless
  
  const paths = activeLocales.map((locale) => ({
    params: { locale }
  }));

  return {
    paths,
    fallback: false // 404 for unknown locales
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.locale as string;
  
  // Validate locale
  const validLocales = ['tr', 'en'];
  if (!validLocales.includes(locale)) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      locale
    },
    revalidate: 1800,
  };
};

export default LocaleRedirectPage;