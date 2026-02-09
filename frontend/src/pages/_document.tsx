// =============================================================
// FILE: pages/_document.tsx
// Next.js Custom Document for advanced SSR optimizations
// Critical resources, preconnects, font preloads, etc.
// =============================================================

import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

// Server-side hreflang generation for Pages Router
interface HreflangLink {
  hreflang: string;
  href: string;
}

function generateHreflangUrls(currentPath: string, host: string): HreflangLink[] {
  // Active locales - sync with database app_locales
  const activeLocales = ['de', 'tr', 'en'];
  const defaultLocale = 'de';
  const defaultPrefixless = true;

  // Base URL
  const protocol = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
  const baseUrl = `${protocol}${host}`;

  // Strip locale from path
  const stripLocaleFromPath = (path: string): string => {
    const pathLower = path.toLowerCase();
    for (const loc of activeLocales) {
      if (pathLower === `/${loc}` || pathLower.startsWith(`/${loc}/`)) {
        return path.substring(loc.length + 1) || '/';
      }
    }
    return path;
  };

  // Generate localized path
  const generateLocalizedPath = (locale: string, basePath: string): string => {
    if (defaultPrefixless && locale === defaultLocale) {
      return basePath;
    }
    return basePath === '/' ? `/${locale}` : `/${locale}${basePath}`;
  };

  const cleanPath = stripLocaleFromPath(currentPath);
  const links: HreflangLink[] = [];

  // Generate URLs for all active locales
  for (const locale of activeLocales) {
    const localizedPath = generateLocalizedPath(locale, cleanPath);
    links.push({
      hreflang: locale,
      href: `${baseUrl}${localizedPath}`
    });
  }

  // x-default points to default locale
  const defaultPath = generateLocalizedPath(defaultLocale, cleanPath);
  links.push({
    hreflang: 'x-default',
    href: `${baseUrl}${defaultPath}`
  });

  return links;
}

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    
    // Generate hreflang URLs
    const currentPath = ctx.pathname || '/';
    const host = ctx.req?.headers?.host || 'www.ensotek.de';
    const hreflangLinks = generateHreflangUrls(currentPath, host);

    return { 
      ...initialProps, 
      hreflangLinks 
    };
  }

  render() {
    // Type assertion for hreflangLinks
    const { hreflangLinks } = this.props as any;
    
    return (
      <Html>
        <Head>
          {/* Viewport optimization for better mobile performance */}
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5" />

          {/* Generate canonical URL */}
          {hreflangLinks && hreflangLinks.length > 0 && (
            <link 
              rel="canonical" 
              href={hreflangLinks.find((link: HreflangLink) => link.hreflang === 'x-default')?.href || hreflangLinks[0]?.href} 
            />
          )}

          {/* ✅ Hreflang links - Server-side generated */}
          {hreflangLinks?.map((link: HreflangLink) => (
            <link 
              key={link.hreflang}
              rel="alternate" 
              hrefLang={link.hreflang} 
              href={link.href} 
            />
          ))}

          {/* DNS prefetch for external resources */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />
          <link rel="dns-prefetch" href="//res.cloudinary.com" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
          <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
          <link rel="dns-prefetch" href="//unpkg.com" />

          {/* Preconnect to critical third-parties (higher priority than dns-prefetch) */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://cdn.jsdelivr.net" />
          <link rel="preconnect" href="https://cdnjs.cloudflare.com" />

          {/* Critical font preload - adjust based on your actual fonts */}
          <link
            rel="preload"
            href="/fonts/fa-brands-400.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/fa-solid-900.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />

          {/* Async CSS loading for non-critical stylesheets using media print trick */}
          {/* Note: Bootstrap is loaded synchronously in _app.tsx as it's critical for layout */}

          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            media="print"
            // @ts-expect-error - media trick for async CSS loading
            onLoad="this.media='all';this.onload=null"
          />

          <link
            rel="stylesheet"
            href="https://unpkg.com/aos@2.3.1/dist/aos.css"
            media="print"
            // @ts-expect-error - media trick for async CSS loading
            onLoad="this.media='all';this.onload=null"
          />

          {/* Fallback for browsers without JS */}
          <noscript>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            />
            <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
          </noscript>

          {/* Critical CSS for above-the-fold content */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                /* Critical CSS for Core Web Vitals */
                * {
                  box-sizing: border-box;
                }
                
                body {
                  margin: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }
                
                img {
                  max-width: 100%;
                  height: auto;
                }
                
                /* Prevent layout shift for images */
                img[width][height] {
                  height: auto;
                }
                
                /* Loading state for better perceived performance */
                .ens-skel {
                  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                  background-size: 200% 100%;
                  animation: ens-skeleton 1.5s infinite;
                }
                
                @keyframes ens-skeleton {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `
            }}
          />

          {/* Meta tags for better mobile experience */}
          <meta name="format-detection" content="telephone=no,date=no,email=no,address=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />

          {/* Theme color for better mobile integration */}
          <meta name="theme-color" content="#1976d2" />
          <meta name="msapplication-TileColor" content="#1976d2" />

          {/* Structured Data is now handled dynamically by SiteJsonLd component */}
        </Head>
        <body>
          <Main />
          <NextScript />
          
          {/* NoScript for accessibility */}
          <noscript>
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px',
              textAlign: 'center',
              zIndex: 9999
            }}>
              This website requires JavaScript to function properly. Please enable JavaScript in your browser.
            </div>
          </noscript>
        </body>
      </Html>
    );
  }
}

export default MyDocument;