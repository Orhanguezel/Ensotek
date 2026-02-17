# 🎯 Ensotek Frontend - Lighthouse 100/100 Optimizasyon Planı

## 📊 Hedef Metrikler

| Kategori | Hedef | Mevcut Durum | Öncelik |
|----------|-------|--------------|---------|
| **Performance** | 100/100 | Test edilecek | 🔴 Kritik |
| **SEO** | 100/100 | Test edilecek | 🔴 Kritik |
| **Accessibility** | 100/100 | Test edilecek | 🟡 Yüksek |
| **Best Practices** | 100/100 | Test edilecek | 🟡 Yüksek |

### Core Web Vitals Hedefleri

- **LCP (Largest Contentful Paint)**: < 2.5s ✅
- **FID/INP (First Input Delay / Interaction to Next Paint)**: < 100ms ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅
- **FCP (First Contentful Paint)**: < 1.8s ✅
- **TTFB (Time to First Byte)**: < 600ms ✅

---

## 🚀 FAZ 1: Performance Optimizasyonu (Öncelik: 🔴 Kritik)

### 1.1 Image Optimization (3-4 saat)

**Hedef:** Görseller performansın %60'ını etkiler. Tüm görseller optimize edilmeli.

#### ✅ Yapılacaklar:

```typescript
// 1. OptimizedImage component oluştur
// src/components/ui/OptimizedImage.tsx

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fill = false,
  sizes,
  quality = 85,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      priority={priority}
      sizes={sizes || '100vw'}
      quality={quality}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..." // Low quality placeholder
      onError={() => setImgSrc('/img/fallback.jpg')}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}
```

#### 📋 Görevler:

- [ ] **OptimizedImage component'i oluştur** (yukarıdaki kod)
- [ ] **Tüm Image kullanımlarını OptimizedImage ile değiştir**
  - Hero slider görselleri → `priority={true}`
  - Above-the-fold görseller → `priority={true}`
  - Below-the-fold görseller → `loading="lazy"`
- [ ] **Sizes prop'u ekle** (responsive image serving)
  ```typescript
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  ```
- [ ] **WebP/AVIF formatlarını etkinleştir** (next.config.js)
  ```javascript
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
  ```
- [ ] **Cloudinary entegrasyonu optimize et**
  - Automatic format selection (f_auto)
  - Quality optimization (q_auto)
  - Responsive images (w_auto)

---

### 1.2 Code Splitting & Dynamic Imports (2-3 saat)

**Hedef:** İlk yükleme bundle size'ı < 200KB (gzipped)

#### ✅ Yapılacaklar:

```typescript
// Heavy componentler için dynamic import kullan

// ❌ YANLIŞ
import HeroSlider from '@/components/containers/hero/HeroSlider';

// ✅ DOĞRU
import dynamic from 'next/dynamic';

const HeroSlider = dynamic(() => import('@/components/containers/hero/HeroSlider'), {
  loading: () => <HeroSliderSkeleton />,
  ssr: true, // SEO için önemli
});

const ContactForm = dynamic(() => import('@/components/forms/ContactForm'), {
  loading: () => <FormSkeleton />,
  ssr: false, // Form'lar CSR olabilir
});

const BlogComments = dynamic(() => import('@/components/blog/Comments'), {
  loading: () => <CommentsSkeleton />,
  ssr: false,
});
```

#### 📋 Görevler:

- [ ] **Heavy component'leri belirle ve dynamic import'a çevir:**
  - Swiper/Carousel componentleri
  - Video players
  - Rich text editor (@toast-ui/editor)
  - Chart/Graph componentleri
  - Modal/Dialog içerikleri
- [ ] **Route-based code splitting kontrol et** (Next.js otomatik yapar)
- [ ] **Bundle analyzer kur ve çalıştır:**
  ```bash
  npm install --save-dev @next/bundle-analyzer
  ```
  ```javascript
  // next.config.js
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });

  module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
  ```
  ```bash
  ANALYZE=true npm run build
  ```
- [ ] **Vendor chunks optimize et:**
  ```javascript
  // next.config.js
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-icons'],
  }
  ```

---

### 1.3 Font Optimization (1-2 saat)

**Hedef:** Font yükleme süresi < 100ms, FOUT/FOIT önleme

#### ✅ Yapılacaklar:

```typescript
// app/[locale]/layout.tsx

import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
});

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-poppins',
  fallback: ['system-ui', 'arial'],
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

#### 📋 Görevler:

- [ ] **next/font kullan** (self-hosting için)
- [ ] **Font-display: swap** ekle
- [ ] **Preload kritik fontları** (layout.tsx'te otomatik)
- [ ] **Fallback font sistemi oluştur**
  ```css
  /* styles/typography.scss */
  body {
    font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
  }
  ```
- [ ] **Font subsetting** (sadece kullanılan karakterler)
- [ ] **SCSS'teki @import font yüklemelerini kaldır** (@fortawesome gibi)

---

### 1.4 Critical CSS & CSS Optimization (2-3 saat)

**Hedef:** Above-the-fold CSS inline, gerisi defer

#### ✅ Yapılacaklar:

```typescript
// app/[locale]/layout.tsx

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * { box-sizing: border-box; margin: 0; padding: 0; }
            html { -webkit-font-smoothing: antialiased; }
            img { max-width: 100%; height: auto; }
            .header { /* critical header styles */ }
            .hero { /* critical hero styles */ }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### 📋 Görevler:

- [ ] **Critical CSS extract et** (above-the-fold stilleri)
- [ ] **Bootstrap 5'i tree-shake et** (sadece kullanılan componentler)
  ```scss
  // Tüm Bootstrap yerine sadece gerekenleri import et
  @import "bootstrap/scss/functions";
  @import "bootstrap/scss/variables";
  @import "bootstrap/scss/mixins";
  @import "bootstrap/scss/grid";
  @import "bootstrap/scss/containers";
  // Diğer gereksiz modülleri kaldır
  ```
- [ ] **Unused CSS temizle** (PurgeCSS/UnCSS)
- [ ] **SCSS compile optimize et** (minimize, autoprefixer)
- [ ] **Tailwind CSS'i optimize et** (zaten next.config.js'te var mı kontrol et)

---

### 1.5 JavaScript Optimization (2-3 saat)

**Hedef:** Minimize blocking scripts, defer non-critical JS

#### 📋 Görevler:

- [ ] **AOS (Animate On Scroll) lazy load et**
  ```typescript
  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.init({ once: true, duration: 800 });
    });
  }, []);
  ```
- [ ] **Third-party scripts optimize et:**
  ```typescript
  // app/[locale]/layout.tsx
  import Script from 'next/script';

  <Script
    src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
    strategy="afterInteractive" // veya "lazyOnload"
  />
  ```
- [ ] **Unused dependencies kaldır** (package.json analizi)
- [ ] **Tree-shaking kontrol et** (webpack bundle analyzer)
- [ ] **React DevTools production'da disable et**

---

### 1.6 Server-Side Rendering & Caching (3-4 saat)

**Hedef:** Maksimum ISR/SSG kullanımı, TTFB < 600ms

#### ✅ Yapılacaklar:

```typescript
// Ana Sayfa - ISR 60s
export const revalidate = 60;

export default async function HomePage({ params }) {
  const { locale } = await params;

  // Backend'den paralel veri çek
  const [sliders, products, categories] = await Promise.all([
    getSliders(locale),
    getFeaturedProducts(locale),
    getCategories(locale),
  ]);

  return <HomePageContent data={{ sliders, products, categories }} />;
}

// Ürün Detay - ISR 300s + generateStaticParams
export const revalidate = 300;

export async function generateStaticParams() {
  // En popüler 50 ürünü build time'da oluştur
  const products = await getTopProducts();
  return products.map((p) => ({ slug: p.slug }));
}
```

#### 📋 Görevler:

- [ ] **ISR stratejisi belirle:**
  - Ana sayfa: 60s
  - Ürün listesi: SSR (dinamik filtreler)
  - Ürün detay: 300s ISR + generateStaticParams
  - Hizmetler: 3600s ISR
  - Statik sayfalar: SSG
  - FAQ: 3600s ISR
  - Library: 3600s ISR
- [ ] **generateStaticParams ekle** (popüler sayfalar için)
- [ ] **Streaming SSR kullan** (React 18 Suspense)
  ```typescript
  import { Suspense } from 'react';

  export default function Page() {
    return (
      <>
        <HeroSection />
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsSection />
        </Suspense>
      </>
    );
  }
  ```
- [ ] **Backend cache optimize et** (Redis/memcached)
- [ ] **CDN kullan** (Cloudflare/Vercel Edge Network)

---

### 1.7 Prefetch & Preload Strategy (2 saat)

**Hedef:** Kullanıcı etkileşimini tahmin et, sayfaları önceden yükle

#### ✅ Yapılacaklar:

```typescript
// Automatic prefetch (Next.js Link)
import Link from 'next/link';

<Link href="/products" prefetch={true}>
  Ürünler
</Link>

// Manual prefetch (hover'da)
import { useRouter } from 'next/navigation';

function ProductCard({ slug }) {
  const router = useRouter();

  return (
    <div onMouseEnter={() => router.prefetch(`/product/${slug}`)}>
      {/* Card content */}
    </div>
  );
}

// Preload critical resources
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
<link rel="preconnect" href="https://res.cloudinary.com" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
```

#### 📋 Görevler:

- [ ] **Link prefetch stratejisi:**
  - Menü linkleri: `prefetch={true}`
  - Footer linkleri: `prefetch={false}`
  - Ürün kartları: hover prefetch
- [ ] **Preconnect kritik origin'lere:**
  - Cloudinary CDN
  - Google Fonts (eğer kullanılıyorsa)
  - Analytics scripts
- [ ] **Resource hints ekle:**
  ```html
  <link rel="preload" as="image" href="/hero.jpg" />
  <link rel="preload" as="script" href="/critical.js" />
  ```

---

## 🔍 FAZ 2: SEO Optimizasyonu (Öncelik: 🔴 Kritik)

### 2.1 Metadata & Open Graph (3-4 saat)

**Hedef:** Her sayfa unique metadata, social sharing optimize

#### ✅ Yapılacaklar:

```typescript
// app/[locale]/layout.tsx - Site-level metadata

import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const siteSettings = await getSiteSettings(locale);

  return {
    metadataBase: new URL('https://www.ensotek.de'),
    title: {
      default: siteSettings.site_title,
      template: `%s | ${siteSettings.site_name}`,
    },
    description: siteSettings.site_description,
    keywords: siteSettings.keywords,
    authors: [{ name: 'Ensotek' }],
    creator: 'Ensotek',
    publisher: 'Ensotek',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: 'https://www.ensotek.de',
      title: siteSettings.site_title,
      description: siteSettings.site_description,
      siteName: siteSettings.site_name,
      images: [{
        url: siteSettings.og_image,
        width: 1200,
        height: 630,
        alt: siteSettings.site_name,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteSettings.site_title,
      description: siteSettings.site_description,
      images: [siteSettings.og_image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: 'https://www.ensotek.de',
      languages: {
        'tr': 'https://www.ensotek.de/tr',
        'en': 'https://www.ensotek.de/en',
        'de': 'https://www.ensotek.de/de',
        'fr': 'https://www.ensotek.de/fr',
        'ru': 'https://www.ensotek.de/ru',
        'ar': 'https://www.ensotek.de/ar',
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  };
}

// app/[locale]/product/[slug]/page.tsx - Page-level metadata

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  return {
    title: product.seo_title || product.name,
    description: product.seo_description || product.short_description,
    keywords: product.keywords,
    openGraph: {
      type: 'product',
      title: product.name,
      description: product.short_description,
      images: product.images.map(img => ({
        url: img.url,
        width: 800,
        height: 600,
        alt: product.name,
      })),
      locale: locale,
      url: `https://www.ensotek.de/${locale}/product/${slug}`,
    },
    alternates: {
      canonical: `https://www.ensotek.de/${locale}/product/${slug}`,
    },
  };
}
```

#### 📋 Görevler:

- [ ] **Her sayfa için generateMetadata ekle:**
  - Ana sayfa ✅
  - Ürün listesi ✅
  - Ürün detay ✅
  - Hizmetler ✅
  - Hizmet detay ✅
  - Blog ✅
  - Blog detay ✅
  - İletişim ✅
  - Hakkımızda ✅
  - SSS ✅
  - Library ✅
  - Dinamik sayfalar ([slug]) ✅
- [ ] **OpenGraph images optimize et** (1200x630px, < 300KB)
- [ ] **Twitter Card metadata ekle**
- [ ] **Canonical URLs ekle** (her sayfa)
- [ ] **Hreflang tags ekle** (çoklu dil)

---

### 2.2 JSON-LD Structured Data (3-4 saat)

**Hedef:** Rich snippets için Google'ın anlayabileceği structured data

#### ✅ Yapılacaklar:

```typescript
// components/seo/JsonLd.tsx (mevcut, güncellenecek)

// Site-level: Organization + WebSite
export function OrganizationJsonLd({ data }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ensotek',
    url: 'https://www.ensotek.de',
    logo: data.logo_url,
    description: data.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      addressLocality: data.city,
      postalCode: data.postal_code,
      addressCountry: 'DE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: data.phone,
      contactType: 'customer service',
      email: data.email,
      availableLanguage: ['tr', 'en', 'de', 'fr', 'ru', 'ar'],
    },
    sameAs: [
      data.facebook_url,
      data.linkedin_url,
      data.twitter_url,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product schema
export function ProductJsonLd({ product, locale }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => img.url),
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Ensotek',
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count,
    } : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://www.ensotek.de/${locale}/product/${product.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ schema
export function FaqJsonLd({ faqs }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb schema
export function BreadcrumbJsonLd({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article schema (Blog)
export function ArticleJsonLd({ article, locale }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    image: article.featured_image,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: article.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ensotek',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ensotek.de/logo.png',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

#### 📋 Görevler:

- [ ] **JSON-LD component'lerini güncelle/oluştur:**
  - [x] OrganizationJsonLd (site-level)
  - [x] WebSiteJsonLd (site-level)
  - [ ] ProductJsonLd ✅
  - [ ] ServiceJsonLd ✅
  - [ ] FaqJsonLd ✅
  - [ ] ArticleJsonLd (blog) ✅
  - [ ] BreadcrumbJsonLd ✅
- [ ] **Her sayfaya uygun schema ekle**
- [ ] **Google Rich Results Test ile test et**
- [ ] **Schema.org validator ile doğrula**

---

### 2.3 Sitemap & Robots.txt (2 saat)

**Hedef:** Dinamik sitemap, tüm dilleri kapsama

#### ✅ Yapılacaklar:

```typescript
// app/sitemap.ts

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['tr', 'en', 'de', 'fr', 'ru', 'ar'];
  const baseUrl = 'https://www.ensotek.de';

  // Static routes
  const staticRoutes = ['', '/contact', '/about', '/faqs'].flatMap(route =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}${route}`])
        ),
      },
    }))
  );

  // Dynamic products
  const products = await getAllProducts();
  const productRoutes = products.flatMap(product =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/product/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/product/${product.slug}`])
        ),
      },
    }))
  );

  // Dynamic services
  const services = await getAllServices();
  const serviceRoutes = services.flatMap(service =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/service/${service.slug}`,
      lastModified: new Date(service.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/service/${service.slug}`])
        ),
      },
    }))
  );

  // Blog posts
  const posts = await getAllBlogPosts();
  const blogRoutes = posts.flatMap(post =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}/blog/${post.slug}`])
        ),
      },
    }))
  );

  return [...staticRoutes, ...productRoutes, ...serviceRoutes, ...blogRoutes];
}

// app/robots.ts

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/profile/', '/login/', '/register/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
    ],
    sitemap: 'https://www.ensotek.de/sitemap.xml',
    host: 'https://www.ensotek.de',
  };
}
```

#### 📋 Görevler:

- [ ] **app/sitemap.ts oluştur** (yukarıdaki kod)
- [ ] **app/robots.ts oluştur** (yukarıdaki kod)
- [ ] **Dinamik route'ları sitemap'e ekle:**
  - Ürünler ✅
  - Hizmetler ✅
  - Blog yazıları ✅
  - Library items ✅
  - Dinamik sayfalar ✅
- [ ] **Hreflang alternates ekle** (çoklu dil)
- [ ] **Google Search Console'a sitemap submit et**
- [ ] **Bing Webmaster Tools'a submit et**

---

### 2.4 Semantic HTML & Heading Structure (1-2 saat)

**Hedef:** Proper HTML5 semantic tags, heading hierarchy

#### ✅ Yapılacaklar:

```typescript
// ❌ YANLIŞ
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="article">
    <span class="title">Title</span>
  </div>
</div>

// ✅ DOĞRU
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main>
  <article>
    <h1>Title</h1>
    <section>
      <h2>Subtitle</h2>
    </section>
  </article>
</main>
<footer>...</footer>

// Heading hierarchy
<h1>Ana Başlık</h1>        <!-- Sadece 1 tane -->
  <h2>Bölüm 1</h2>
    <h3>Alt başlık 1.1</h3>
    <h3>Alt başlık 1.2</h3>
  <h2>Bölüm 2</h2>
    <h3>Alt başlık 2.1</h3>
```

#### 📋 Görevler:

- [ ] **Semantic HTML tags kullan:**
  - `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- [ ] **Her sayfada sadece 1 tane `<h1>` olsun**
- [ ] **Heading hierarchy kontrol et** (h1 → h2 → h3, skip yok)
- [ ] **Landmark roles ekle** (nav, main, complementary)
- [ ] **Skip to content link ekle** (accessibility)

---

### 2.5 URL Structure & Canonicalization (1 saat)

**Hedef:** SEO-friendly URLs, duplicate content önleme

#### 📋 Görevler:

- [ ] **URL yapısı kontrol et:**
  ```
  ✅ DOĞRU: /tr/product/cooling-tower-xyz
  ❌ YANLIŞ: /tr/product?id=123
  ```
- [ ] **Canonical URL'ler ekle** (generateMetadata içinde)
- [ ] **Trailing slash consistency** (/ ile bitsin veya bitmesin, tutarlı olsun)
- [ ] **Lowercase URLs** (tüm URL'ler küçük harf)
- [ ] **301 redirects** (eski URL'ler varsa)

---

## ♿ FAZ 3: Accessibility Optimizasyonu (Öncelik: 🟡 Yüksek)

### 3.1 ARIA Labels & Roles (2-3 saat)

#### ✅ Yapılacaklar:

```typescript
// Navigation
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a href="/" role="menuitem">Home</a>
    </li>
  </ul>
</nav>

// Buttons
<button aria-label="Close modal" onClick={handleClose}>
  <X /> {/* Icon without text */}
</button>

// Images
<img src="/logo.png" alt="Ensotek - Cooling Tower Solutions" />

// Form inputs
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby="email-error"
/>
{errors.email && (
  <span id="email-error" role="alert">
    {errors.email.message}
  </span>
)}

// Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal content</p>
</div>

// Loading states
<div role="status" aria-live="polite" aria-busy="true">
  Loading...
</div>
```

#### 📋 Görevler:

- [ ] **Tüm interactive elementlere accessible name ekle**
- [ ] **Icon-only buttonlara aria-label ekle**
- [ ] **Form validasyonu için aria-invalid ve aria-describedby kullan**
- [ ] **Loading states için aria-live regions kullan**
- [ ] **Modal/Dialog için aria-modal ve focus trap ekle**

---

### 3.2 Keyboard Navigation (1-2 saat)

#### 📋 Görevler:

- [ ] **Focus indicators visible olsun** (outline/ring)
  ```css
  :focus-visible {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
  ```
- [ ] **Tab order mantıklı olsun** (tabindex kullanımı)
- [ ] **Skip to main content link ekle**
  ```typescript
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to main content
  </a>
  <main id="main-content">...</main>
  ```
- [ ] **Dropdown/Modal ESC ile kapanabilsin**
- [ ] **Carousel keyboard navigasyonu** (arrow keys)

---

### 3.3 Color Contrast (1 saat)

#### 📋 Görevler:

- [ ] **WCAG AA compliance** (minimum 4.5:1 contrast ratio)
- [ ] **Contrast checker ile test et** (Chrome DevTools)
- [ ] **Link'ler sadece renk ile ayırt edilmesin** (underline ekle)
- [ ] **Error/Success mesajları sadece renk ile gösterilmesin** (icon ekle)

---

### 3.4 Screen Reader Support (1-2 saat)

#### 📋 Görevler:

- [ ] **Alt text tüm görsellerde olsun** (dekoratif görseller alt="")
- [ ] **Form labels eksik olmasın** (implicit veya explicit)
- [ ] **Error mesajları screen reader'a anons edilsin** (role="alert")
- [ ] **Loading states anons edilsin** (aria-live="polite")
- [ ] **NVDA/JAWS ile test et**

---

## 🛡️ FAZ 4: Best Practices (Öncelik: 🟡 Yüksek)

### 4.1 Security Headers (1 saat)

#### ✅ Yapılacaklar:

```javascript
// next.config.js

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' https://www.google-analytics.com;
      frame-src 'self' https://www.youtube.com;
    `.replace(/\s+/g, ' ').trim(),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

#### 📋 Görevler:

- [ ] **Security headers ekle** (yukarıdaki kod)
- [ ] **CSP policy ayarla** (Content Security Policy)
- [ ] **HTTPS enforce et** (production)
- [ ] **Subresource Integrity** (third-party scripts için)

---

### 4.2 Error Handling & Logging (1-2 saat)

#### ✅ Yapılacaklar:

```typescript
// app/[locale]/error.tsx

'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service (Sentry, LogRocket, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="error-page">
      <h1>Bir hata oluştu</h1>
      <p>Lütfen daha sonra tekrar deneyin.</p>
      <button onClick={() => reset()}>Tekrar dene</button>
    </div>
  );
}

// app/[locale]/global-error.tsx

'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h1>Kritik bir hata oluştu</h1>
        <button onClick={() => reset()}>Tekrar dene</button>
      </body>
    </html>
  );
}

// app/[locale]/not-found.tsx (zaten var, güncelleme yapılabilir)

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404 - Sayfa Bulunamadı</h1>
      <p>Aradığınız sayfa mevcut değil.</p>
      <Link href="/">Ana sayfaya dön</Link>
    </div>
  );
}
```

#### 📋 Görevler:

- [ ] **Error boundary ekle** (app/error.tsx)
- [ ] **Global error handler** (app/global-error.tsx)
- [ ] **404 sayfası özelleştir** (app/not-found.tsx)
- [ ] **Error tracking ekle** (Sentry/LogRocket)
- [ ] **Console.log'ları production'da kaldır**

---

### 4.3 HTTPS & Mixed Content (30 dakika)

#### 📋 Görevler:

- [ ] **HTTPS enforce et** (production)
- [ ] **Mixed content kontrol et** (HTTP resources yok)
- [ ] **HTTP → HTTPS redirect** (server-level)
- [ ] **SSL certificate geçerli mi kontrol et**

---

### 4.4 Deprecated APIs & Console Warnings (1 saat)

#### 📋 Görevler:

- [ ] **Console warnings temizle** (React warnings, deprecation warnings)
- [ ] **Deprecated API'ları güncelle**
- [ ] **Type errors düzelt** (TypeScript strict mode)
- [ ] **ESLint warnings düzelt**

---

## 🧪 FAZ 5: Testing & Validation (Öncelik: 🟢 Orta)

### 5.1 Lighthouse Audit (Sürekli)

#### 📋 Test Checklist:

```bash
# Chrome DevTools Lighthouse
- Desktop audit
- Mobile audit
- Incognito mode (extension'lar disabled)
- Network throttling: Fast 3G
```

#### Hedef Skorlar:

- [ ] **Performance: 100/100** ✅
  - FCP < 1.8s
  - LCP < 2.5s
  - TBT < 200ms
  - CLS < 0.1
  - Speed Index < 3.4s

- [ ] **SEO: 100/100** ✅
  - Meta description
  - Crawlable links
  - Valid robots.txt
  - Hreflang tags
  - Structured data

- [ ] **Accessibility: 100/100** ✅
  - ARIA labels
  - Color contrast
  - Alt texts
  - Keyboard navigation
  - Screen reader support

- [ ] **Best Practices: 100/100** ✅
  - HTTPS
  - No console errors
  - Security headers
  - No deprecated APIs

---

### 5.2 PageSpeed Insights (Sürekli)

#### 📋 Görevler:

- [ ] **PageSpeed Insights test et:**
  - Ana sayfa
  - Ürün listesi
  - Ürün detay
  - Blog
  - İletişim
- [ ] **Field data kontrol et** (Core Web Vitals)
- [ ] **Lab data optimize et**

---

### 5.3 SEO Tools Validation (1-2 saat)

#### 📋 Görevler:

- [ ] **Google Rich Results Test:**
  - Ürün schema
  - FAQ schema
  - Article schema
  - Organization schema

- [ ] **Google Search Console:**
  - Sitemap submit
  - Coverage kontrol
  - Mobile usability
  - Core Web Vitals

- [ ] **Schema.org Validator:**
  - JSON-LD validation
  - Schema errors yok

- [ ] **W3C HTML Validator:**
  - HTML validation
  - Semantic errors yok

---

### 5.4 Cross-Browser Testing (2-3 saat)

#### 📋 Görevler:

- [ ] **Desktop browsers:**
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)

- [ ] **Mobile browsers:**
  - Chrome Mobile
  - Safari iOS
  - Samsung Internet

- [ ] **Responsive test:**
  - 320px (mobile)
  - 768px (tablet)
  - 1024px (desktop)
  - 1920px (large desktop)

---

### 5.5 Accessibility Testing (1-2 saat)

#### 📋 Görevler:

- [ ] **Automated testing:**
  - axe DevTools
  - WAVE browser extension
  - Lighthouse accessibility audit

- [ ] **Screen reader testing:**
  - NVDA (Windows)
  - JAWS (Windows)
  - VoiceOver (macOS/iOS)

- [ ] **Keyboard navigation test:**
  - Tab order
  - Focus indicators
  - Skip links
  - Modal traps

---

## 📊 FAZ 6: Monitoring & Analytics (Öncelik: 🟢 Orta)

### 6.1 Core Web Vitals Monitoring (1-2 saat)

#### ✅ Yapılacaklar:

```typescript
// lib/web-vitals.ts

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

function sendToAnalytics(metric) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Custom analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' },
  });
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onINP(sendToAnalytics);
}

// app/[locale]/layout.tsx

import { reportWebVitals } from '@/lib/web-vitals';

useEffect(() => {
  reportWebVitals();
}, []);
```

#### 📋 Görevler:

- [ ] **Web Vitals tracking ekle** (yukarıdaki kod)
- [ ] **Google Analytics 4 entegrasyonu**
- [ ] **Real User Monitoring (RUM)** setup
- [ ] **Google Search Console → Core Web Vitals raporu**

---

### 6.2 Error Tracking (1-2 saat)

#### ✅ Yapılacaklar:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

// sentry.server.config.js

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

#### 📋 Görevler:

- [ ] **Sentry entegrasyonu** (veya alternatif: LogRocket, Rollbar)
- [ ] **Source maps upload** (production builds)
- [ ] **User context tracking** (user ID, locale)
- [ ] **Performance monitoring**

---

### 6.3 Analytics & Conversion Tracking (1-2 saat)

#### ✅ Yapılacaklar:

```typescript
// app/[locale]/layout.tsx

import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Google Tag Manager (optional) */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `,
          }}
        />
      </head>
      <body>
        {/* GTM noscript */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
```

#### 📋 Görevler:

- [ ] **Google Analytics 4 setup**
- [ ] **Google Tag Manager** (optional)
- [ ] **Conversion tracking:**
  - Contact form submissions
  - Offer requests
  - Catalog requests
  - Newsletter signups
- [ ] **Event tracking:**
  - Product views
  - Video plays
  - File downloads
  - Link clicks

---

## 🚀 FAZ 7: Production Deploy & Optimization (Öncelik: 🟢 Orta)

### 7.1 Build Optimization (1-2 saat)

#### 📋 Görevler:

```bash
# Build command
npm run build

# Analyze bundle
ANALYZE=true npm run build
```

- [ ] **Build output analizi:**
  - Bundle size < 300KB (gzipped)
  - No duplicate packages
  - Tree-shaking working
  - Code splitting optimal

- [ ] **Environment variables kontrol:**
  ```env
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=https://api.ensotek.de
  NEXT_PUBLIC_SITE_URL=https://www.ensotek.de
  ```

- [ ] **Next.js config optimize:**
  ```javascript
  module.exports = {
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
    reactStrictMode: true,
    swcMinify: true,
  };
  ```

---

### 7.2 CDN & Caching Strategy (1-2 saat)

#### 📋 Görevler:

- [ ] **Static assets CDN:**
  - Images → Cloudinary
  - Fonts → Self-hosted / Google Fonts
  - JS/CSS → Vercel Edge / Cloudflare

- [ ] **Cache headers:**
  ```javascript
  // next.config.js
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.{jpg,jpeg,png,webp,avif,gif,svg,ico}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
  ```

- [ ] **ISR revalidation stratejisi:**
  - Homepage: 60s
  - Products: 300s
  - Services: 3600s
  - Static pages: on-demand

---

### 7.3 Final Lighthouse Audit (1 saat)

#### 📋 Test Checklist:

- [ ] **Production URL test et** (staging.ensotek.de)
- [ ] **Desktop: 100/100/100/100** ✅
- [ ] **Mobile: 100/100/100/100** ✅
- [ ] **PageSpeed Insights:** All green
- [ ] **Core Web Vitals:** All good

---

## 📅 Sprint Takvimi

### Sprint 1: Performance (Hafta 1)
- **Gün 1-2:** Image Optimization (1.1)
- **Gün 3:** Code Splitting (1.2)
- **Gün 4:** Font & CSS Optimization (1.3, 1.4)
- **Gün 5:** JS & SSR Optimization (1.5, 1.6)

### Sprint 2: SEO (Hafta 2)
- **Gün 1-2:** Metadata & OpenGraph (2.1)
- **Gün 3-4:** JSON-LD Schemas (2.2)
- **Gün 5:** Sitemap & Semantic HTML (2.3, 2.4)

### Sprint 3: Accessibility & Best Practices (Hafta 3)
- **Gün 1-2:** ARIA & Keyboard Navigation (3.1, 3.2)
- **Gün 3:** Color Contrast & Screen Readers (3.3, 3.4)
- **Gün 4:** Security Headers & Error Handling (4.1, 4.2)
- **Gün 5:** Testing & Validation (5.1, 5.2)

### Sprint 4: Monitoring & Deploy (Hafta 4)
- **Gün 1:** SEO Tools Validation (5.3)
- **Gün 2:** Cross-Browser & A11y Testing (5.4, 5.5)
- **Gün 3:** Analytics & Monitoring (6.1, 6.2, 6.3)
- **Gün 4:** Production Deploy (7.1, 7.2)
- **Gün 5:** Final Audit & QA (7.3)

---

## 📝 Önemli Notlar

### Quick Wins (İlk gün yapılabilir):

1. ✅ **Next.js Image component'i kullan** (tüm img taglerini değiştir)
2. ✅ **Metadata ekle** (generateMetadata fonksiyonları)
3. ✅ **Robots.txt & Sitemap oluştur**
4. ✅ **Font optimization** (next/font)
5. ✅ **Dynamic imports** (heavy componentler)

### Kritik Öncelikler:

- 🔴 **LCP Optimization:** Hero image, above-the-fold content
- 🔴 **CLS Prevention:** Fixed dimensions, skeleton loaders
- 🔴 **TBT Reduction:** Code splitting, defer JS
- 🔴 **SEO Metadata:** Her sayfa unique title/description

### Tools & Resources:

- **Lighthouse:** Chrome DevTools → Audits
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Schema Validator:** https://validator.schema.org/
- **WebPageTest:** https://www.webpagetest.org/
- **GTmetrix:** https://gtmetrix.com/

---

## ✅ Başarı Kriterleri

### Lighthouse Hedefi: 100/100/100/100

- ✅ **Performance: 100/100**
  - LCP < 2.5s
  - FID/INP < 100ms
  - CLS < 0.1
  - FCP < 1.8s
  - Speed Index < 3.4s

- ✅ **SEO: 100/100**
  - Valid metadata
  - Semantic HTML
  - Structured data
  - Mobile-friendly
  - Sitemap & Robots

- ✅ **Accessibility: 100/100**
  - ARIA labels
  - Keyboard navigation
  - Color contrast
  - Screen reader support

- ✅ **Best Practices: 100/100**
  - HTTPS
  - Security headers
  - No console errors
  - No deprecated APIs

---

**Hedef Tamamlanma Tarihi:** 4 hafta (28 gün)

**İlk Milestone:** Sprint 1 tamamlandığında Performance 90+ hedefleniyor.
