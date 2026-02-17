# ⚡ Ensotek Frontend - Performance-First Optimization Plan
## Lighthouse 100/100 Hedefi - PERFORMANS ODAKLI

> **Proje:** Next.js 16 App Router + TypeScript
> **Mevcut Durum:** Backend entegre, altyapı hazır, SEO dışında ufak eksiklikler var
> **Hedef:** Lighthouse Performance 100/100 (SEO kolay, asıl zorluk performans)

---

## 🎯 Performans Hedefleri (Kritik!)

| Metrik | Hedef | Ağırlık | Zorluk |
|--------|-------|---------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | %25 | 🔴 Zor |
| **TBT** (Total Blocking Time) | < 200ms | %30 | 🔴 Zor |
| **CLS** (Cumulative Layout Shift) | < 0.1 | %25 | 🟡 Orta |
| **FCP** (First Contentful Paint) | < 1.8s | %10 | 🟢 Kolay |
| **Speed Index** | < 3.4s | %10 | 🟡 Orta |

**Lighthouse Performance formülü:**
```
Performance Score =
  (FCP × 0.10) +
  (Speed Index × 0.10) +
  (LCP × 0.25) +
  (TBT × 0.30) +
  (CLS × 0.25)
```

**En kritik:** TBT (Total Blocking Time) → JavaScript execution optimize edilmeli!

---

## 🚀 FAZ 1: JavaScript Bundle Optimization (Öncelik: 🔴 Kritik)

### Hedef: TBT < 200ms, Initial Bundle < 150KB (gzipped)

### 1.1 Current Bundle Analysis (1 saat)

```bash
# Bundle analyzer kur
npm install --save-dev @next/bundle-analyzer

# next.config.js güncelle
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));

# Analiz çalıştır
ANALYZE=true npm run build
```

#### 📋 Görevler:

- [ ] **Bundle analyzer çalıştır, büyük paketleri tespit et**
- [ ] **Duplicate dependencies kontrol et** (iki kere yüklenmiş paketler)
- [ ] **Unused dependencies kaldır:**
  ```bash
  npx depcheck
  ```
- [ ] **Server-only code'u client bundle'dan çıkar:**
  ```typescript
  // ❌ YANLIŞ: Server-only kod client'a gidiyor
  import { db } from '@/lib/db';

  // ✅ DOĞRU: Server-only import
  import 'server-only';
  import { db } from '@/lib/db';
  ```

---

### 1.2 Heavy Dependencies Lazy Load (2-3 saat)

#### Problem: AOS, Swiper, Framer Motion gibi paketler ilk yüklemede bundle'ı şişiriyor

```typescript
// ❌ YANLIŞ: Her sayfa yüklendiğinde tüm kod geliyor
import AOS from 'aos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import { Editor } from '@toast-ui/editor';

// ✅ DOĞRU: Sadece gerektiğinde yükle

// 1. AOS - Sadece client-side, lazy load
'use client';

import { useEffect } from 'react';

export function AosProvider({ children }) {
  useEffect(() => {
    // Dynamic import - AOS sadece client'ta yüklenecek
    import('aos').then((AOS) => {
      AOS.init({
        once: true, // Animasyon sadece 1 kez oynar
        duration: 600, // Hızlı animasyon (800ms → 600ms)
        easing: 'ease-out-cubic',
        disable: 'mobile', // Mobilde disable et (performance)
      });
    });
  }, []);

  return <>{children}</>;
}

// 2. Swiper - Dynamic import + loading state
import dynamic from 'next/dynamic';

const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), {
  loading: () => <SliderSkeleton />,
  ssr: false, // Slider SSR'a gerek yok
});

const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), {
  ssr: false,
});

// 3. Framer Motion - Sadece interactive componentlerde kullan
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), {
  ssr: false,
});

// 4. Toast UI Editor - Sadece admin panelde lazım
const Editor = dynamic(() => import('@toast-ui/editor').then(mod => mod.Editor), {
  loading: () => <EditorSkeleton />,
  ssr: false,
});

// 5. React Icons - Tree-shaking optimize
// ❌ YANLIŞ: Tüm icon library yükleniyor
import { FaFacebook, FaTwitter } from 'react-icons/fa';

// ✅ DOĞRU: Sadece kullanılan icon set
import { FaFacebook } from 'react-icons/fa/FaFacebook';
import { FaTwitter } from 'react-icons/fa/FaTwitter';

// VEYA: Lucide-react kullan (daha hafif)
import { Facebook, Twitter } from 'lucide-react';
```

#### 📋 Görevler:

- [ ] **AOS lazy load** (yukarıdaki kod)
- [ ] **Swiper dynamic import** (ssr: false)
- [ ] **Framer Motion conditional load:**
  - Static sayfalar → animasyon yok
  - Interactive sayfalar → lazy load
- [ ] **@toast-ui/editor** sadece gerektiğinde (admin panel)
- [ ] **react-icons → lucide-react** migration (daha hafif)
  ```bash
  # react-icons: 1.2MB
  # lucide-react: 200KB
  ```
- [ ] **Heavy Radix UI components lazy load:**
  ```typescript
  const Dialog = dynamic(() => import('@radix-ui/react-dialog').then(m => m.Dialog));
  const Accordion = dynamic(() => import('@radix-ui/react-accordion').then(m => m.Accordion));
  ```

---

### 1.3 Code Splitting Strategy (2 saat)

#### Route-based splitting (Next.js otomatik yapar, kontrol et)

```typescript
// app/[locale]/page.tsx - Ana sayfa
// app/[locale]/product/[slug]/page.tsx - Ürün detay
// Her route ayrı chunk olmalı

// Route groups ile organize et
app/
  [locale]/
    (public)/         # Public routes
      page.tsx
      product/
      service/
    (auth)/           # Auth routes (lazy load)
      login/
      register/
    (dashboard)/      # Dashboard routes (lazy load)
      profile/
      notifications/
```

#### Component-level splitting

```typescript
// components/lazy.ts - Lazy loaded components
export const HeroSlider = dynamic(() => import('./containers/hero/HeroSlider'), {
  loading: () => <HeroSliderSkeleton />,
  ssr: true, // SEO için gerekli
});

export const ContactForm = dynamic(() => import('./forms/ContactForm'), {
  loading: () => <FormSkeleton />,
  ssr: false, // Form CSR olabilir
});

export const BlogComments = dynamic(() => import('./blog/Comments'), {
  loading: () => <CommentsSkeleton />,
  ssr: false,
});

export const ProductGallery = dynamic(() => import('./product/Gallery'), {
  loading: () => <GallerySkeleton />,
  ssr: false, // Gallery CSR
});

export const VideoPlayer = dynamic(() => import('./media/VideoPlayer'), {
  loading: () => <VideoSkeleton />,
  ssr: false,
});

// Kullanım
import { HeroSlider, ContactForm } from '@/components/lazy';
```

#### 📋 Görevler:

- [ ] **Heavy component'leri belirle ve dynamic import ekle:**
  - Carousel/Slider (Swiper, Embla)
  - Video players (react-youtube)
  - Rich text editor
  - Maps (eğer varsa)
  - Chart/Graph libraries
- [ ] **Route groups oluştur** ((public), (auth), (dashboard))
- [ ] **Lazy loading skeletons hazırla** (her component için)
- [ ] **Bundle analyzer tekrar çalıştır** (improvement kontrol)

---

### 1.4 Tree Shaking & Dead Code Elimination (1-2 saat)

```javascript
// next.config.js

module.exports = {
  // Optimize package imports (tree-shaking)
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-accordion',
      '@radix-ui/react-select',
    ],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production client-side optimizations
      config.optimization = {
        ...config.optimization,
        usedExports: true, // Tree-shaking
        sideEffects: false,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk (node_modules)
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common chunk (shared components)
            common: {
              name: 'common',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
            // Radix UI separate chunk
            radix: {
              name: 'radix',
              test: /[\\/]node_modules[\\/]@radix-ui/,
              priority: 30,
            },
          },
        },
      };

      // Remove console.log in production
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions.compress.drop_console = true;
        }
      });
    }

    return config;
  },
};
```

#### 📋 Görevler:

- [ ] **optimizePackageImports ekle** (next.config.js)
- [ ] **Webpack config optimize et** (yukarıdaki kod)
- [ ] **console.log production'da kaldır**
- [ ] **Unused exports temizle:**
  ```bash
  npx ts-prune | grep -v "used in module"
  ```
- [ ] **ES modules kullan** (CommonJS yerine)

---

### 1.5 Third-Party Scripts Optimization (1-2 saat)

```typescript
// app/[locale]/layout.tsx

import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Google Analytics - afterInteractive (Non-blocking) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive" // Sayfa interactive olduktan SONRA yükle
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Google Tag Manager - lazyOnload (Daha da geç yükle) */}
        <Script
          id="gtm"
          strategy="lazyOnload" // Idle durumda yükle
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
      <body>{children}</body>
    </html>
  );
}
```

#### Script Loading Strategies:

| Strategy | Timing | Use Case |
|----------|--------|----------|
| `beforeInteractive` | HTML'e inject, blocking | Critical scripts (polyfills) |
| `afterInteractive` | Hydration sonrası | Analytics, tag managers |
| `lazyOnload` | Idle durumda | Chat widgets, social embeds |
| `worker` | Web Worker'da çalışır | Heavy computations |

#### 📋 Görevler:

- [ ] **Tüm third-party script'leri next/script'e taşı**
- [ ] **Google Analytics → afterInteractive**
- [ ] **Google Tag Manager → lazyOnload**
- [ ] **Social media embeds → lazyOnload**
- [ ] **Chat widgets → lazyOnload**
- [ ] **Font Awesome → kaldır** (lucide-react kullan)

---

## ⚡ FAZ 2: Image Optimization (Öncelik: 🔴 Kritik)

### Hedef: LCP < 2.5s, Bandwidth 50% azaltma

### 2.1 Next.js Image Component (2-3 saat)

```typescript
// components/ui/OptimizedImage.tsx

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
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
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
  quality = 85, // 85 optimal quality/size balance
  objectFit = 'cover',
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
      style={{ objectFit }}
      placeholder="blur"
      blurDataURL={generateBlurDataURL()} // Low-quality placeholder
      onError={() => setImgSrc('/img/fallback.jpg')}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}

// Blur placeholder generator
function generateBlurDataURL() {
  return `data:image/svg+xml;base64,${toBase64(
    `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
    </svg>`
  )}`;
}

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
```

#### Sizes Prop Strategy (Responsive Images)

```typescript
// Hero image (full-width)
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  fill
  priority
  sizes="100vw" // Tüm ekran genişliği
/>

// Product grid (3 columns desktop, 2 tablet, 1 mobile)
<OptimizedImage
  src={product.image}
  alt={product.name}
  width={400}
  height={400}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// Sidebar image (fixed width)
<OptimizedImage
  src="/sidebar.jpg"
  alt="Sidebar"
  width={300}
  height={200}
  sizes="300px"
/>
```

#### 📋 Görevler:

- [ ] **OptimizedImage component oluştur** (yukarıdaki kod)
- [ ] **Tüm `<img>` taglerini `<OptimizedImage>` ile değiştir**
- [ ] **Priority images belirle** (LCP için kritik):
  - Hero slider first image → `priority={true}`
  - Above-the-fold ürün görselleri → `priority={true}`
  - Logo → `priority={true}`
- [ ] **Sizes prop ekle** (her görsel için doğru breakpoint)
- [ ] **Blur placeholder ekle** (CLS önleme)

---

### 2.2 Image Format Optimization (1 saat)

```javascript
// next.config.js

module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF öncelik, fallback WebP
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Small images için
    minimumCacheTTL: 2592000, // 30 gün cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'cdn.ensotek.de' },
      // Localhost patterns kaldır (production'da gereksiz)
    ],
  },
};
```

#### Format Comparison:

| Format | Size (Example) | Quality | Browser Support |
|--------|----------------|---------|-----------------|
| JPG | 100KB | Good | 100% |
| WebP | 60KB (-40%) | Excellent | 97% |
| AVIF | 40KB (-60%) | Excellent | 85% |

**Next.js otomatik format selection yapar!** (AVIF destekleniyorsa AVIF, yoksa WebP, yoksa JPG)

#### 📋 Görevler:

- [ ] **next.config.js image config güncelle** (yukarıdaki kod)
- [ ] **AVIF + WebP formats ekle**
- [ ] **Device sizes optimize et** (gerçek breakpoint'ler)
- [ ] **Cloudinary entegrasyonu kontrol et:**
  - Auto format: `f_auto`
  - Auto quality: `q_auto`
  - Auto width: `w_auto`

---

### 2.3 Cloudinary Optimization (1-2 saat)

```typescript
// lib/cloudinary.ts

export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'avif' | 'webp';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  } = {}
) {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options;

  // Cloudinary URL'mi kontrol et
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Transformations
  const transforms = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);
  if (crop) transforms.push(`c_${crop}`);

  // Lazy loading için placeholder
  transforms.push('e_blur:400'); // Blur effect for loading state

  const transformString = transforms.join(',');

  // URL'e transformations ekle
  return url.replace('/upload/', `/upload/${transformString}/`);
}

// Kullanım
const imageUrl = getOptimizedImageUrl(product.image, {
  width: 800,
  height: 600,
  quality: 'auto',
  format: 'auto',
  crop: 'fill',
});
```

#### 📋 Görevler:

- [ ] **Cloudinary helper fonksiyonu oluştur** (yukarıdaki kod)
- [ ] **Tüm Cloudinary URL'leri optimize et:**
  - `f_auto` → Automatic format (AVIF/WebP)
  - `q_auto` → Automatic quality (bandwidth'e göre)
  - `w_auto` → Automatic width (device'a göre)
  - `c_fill` → Crop mode (aspect ratio korunur)
- [ ] **Responsive images:**
  - `dpr_auto` → Device pixel ratio (Retina displays)
- [ ] **Lazy loading blur effect:**
  - `e_blur:400,q_10` → Low quality blurred placeholder

---

### 2.4 Image Preloading & Priority (1 saat)

```typescript
// app/[locale]/page.tsx - Ana sayfa

export default function HomePage() {
  return (
    <>
      {/* Critical images preload */}
      <link
        rel="preload"
        as="image"
        href="/hero-image.jpg"
        imageSrcSet="/hero-image-640.jpg 640w, /hero-image-1024.jpg 1024w, /hero-image-1920.jpg 1920w"
        imageSizes="100vw"
        fetchpriority="high"
      />

      <HeroSection>
        <OptimizedImage
          src="/hero-image.jpg"
          alt="Hero"
          fill
          priority // Next.js otomatik preload yapar
          sizes="100vw"
        />
      </HeroSection>

      {/* Below-the-fold images - lazy load */}
      <ProductSection>
        <OptimizedImage
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          loading="lazy" // Explicit lazy load
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </ProductSection>
    </>
  );
}
```

#### Priority Strategy:

| Element | Priority | Reason |
|---------|----------|--------|
| Hero image (first slide) | `priority={true}` | LCP element |
| Logo | `priority={true}` | Above-the-fold |
| First 3 products | `priority={true}` | Above-the-fold |
| Other images | `loading="lazy"` | Below-the-fold |
| Thumbnails | `loading="lazy"` | Not critical |

#### 📋 Görevler:

- [ ] **LCP elementini belirle** (Chrome DevTools → Performance)
- [ ] **LCP image'a priority ekle**
- [ ] **Above-the-fold images → priority={true}**
- [ ] **Below-the-fold images → loading="lazy"**
- [ ] **Preload kritik görselleri** (hero, logo)

---

## 🎨 FAZ 3: CSS Optimization (Öncelik: 🟡 Yüksek)

### Hedef: FCP < 1.8s, CSS Bundle < 50KB

### 3.1 Critical CSS Extraction (2-3 saat)

```typescript
// app/[locale]/layout.tsx

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Critical CSS inline (above-the-fold) */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Reset & Base */
            * { box-sizing: border-box; margin: 0; padding: 0; }
            html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
            body { font-family: var(--font-inter), sans-serif; line-height: 1.5; }

            /* Critical Layout (Header, Hero) */
            .header { position: sticky; top: 0; z-index: 100; background: #fff; }
            .hero { min-height: 600px; display: flex; align-items: center; }

            /* Image aspect ratio (CLS prevention) */
            img { max-width: 100%; height: auto; }
            .aspect-ratio-16-9 { aspect-ratio: 16 / 9; }
            .aspect-ratio-1-1 { aspect-ratio: 1 / 1; }

            /* Loading skeleton */
            .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s ease-in-out infinite; }
            @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          `
        }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

#### 📋 Görevler:

- [ ] **Critical CSS extract et** (above-the-fold stilleri)
- [ ] **Inline critical CSS** (layout.tsx'te)
- [ ] **Non-critical CSS defer et** (lazy load)
- [ ] **Unused CSS kaldır** (PurgeCSS)

---

### 3.2 Bootstrap Optimization (2 saat)

```scss
// styles/bootstrap-custom.scss

// ❌ YANLIŞ: Tüm Bootstrap (200KB+)
@import 'bootstrap/scss/bootstrap';

// ✅ DOĞRU: Sadece kullanılan modüller (50KB)
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins';
@import 'bootstrap/scss/root';
@import 'bootstrap/scss/reboot';
@import 'bootstrap/scss/type';
@import 'bootstrap/scss/containers';
@import 'bootstrap/scss/grid';
@import 'bootstrap/scss/utilities';
// @import 'bootstrap/scss/tables';      // KULLANILMIYOR
// @import 'bootstrap/scss/forms';       // KULLANILMIYOR
// @import 'bootstrap/scss/buttons';     // KULLANILMIYOR
// @import 'bootstrap/scss/transitions'; // KULLANILMIYOR
// @import 'bootstrap/scss/dropdown';    // KULLANILMIYOR
// @import 'bootstrap/scss/modal';       // KULLANILMIYOR
```

#### 📋 Görevler:

- [ ] **Bootstrap modüler import** (sadece grid + utilities)
- [ ] **Kullanılmayan componentleri kaldır** (buttons, forms, modal vs.)
- [ ] **Custom utilities oluştur** (Bootstrap yerine)
- [ ] **Tailwind + Bootstrap conflict çöz** (ikisini birlikte kullanma!)

---

### 3.3 Font Optimization (1-2 saat)

```typescript
// app/[locale]/layout.tsx

import { Inter, Poppins } from 'next/font/google';

// Inter font (primary)
const inter = Inter({
  subsets: ['latin', 'latin-ext'], // Sadece gerekli subsetler
  display: 'swap', // FOUT önleme
  preload: true, // Preload font
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'sans-serif'], // Fallback stack
  adjustFontFallback: true, // CLS önleme
});

// Poppins font (headings)
const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'], // Sadece kullanılan weights
  display: 'swap',
  preload: true,
  variable: '--font-poppins',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true,
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

#### 📋 Görevler:

- [ ] **next/font kullan** (Google Fonts self-hosting)
- [ ] **Font subsetting** (sadece kullanılan karakterler)
- [ ] **Preload fonts** (otomatik next/font ile)
- [ ] **Fallback fonts** (system fonts)
- [ ] **Font-display: swap** (FOUT önleme)
- [ ] **@fortawesome kaldır** (5MB+!) → lucide-react kullan

---

## 🏃 FAZ 4: Runtime Performance (Öncelik: 🔴 Kritik)

### Hedef: TBT < 200ms, Smooth 60fps animations

### 4.1 React Optimization (2-3 saat)

```typescript
// 1. Memoization - Expensive computations
import { useMemo, useCallback, memo } from 'react';

// ❌ YANLIŞ: Her render'da yeniden hesaplama
function ProductList({ products }) {
  const sortedProducts = products.sort((a, b) => b.price - a.price);
  return <>{sortedProducts.map(...)}</>;
}

// ✅ DOĞRU: Memoize
function ProductList({ products }) {
  const sortedProducts = useMemo(
    () => products.sort((a, b) => b.price - a.price),
    [products] // Dependency
  );
  return <>{sortedProducts.map(...)}</>;
}

// 2. Callback memoization
// ❌ YANLIŞ: Her render'da yeni function
<button onClick={() => handleClick(id)}>Click</button>

// ✅ DOĞRU: Memoize callback
const handleClickMemo = useCallback(() => handleClick(id), [id]);
<button onClick={handleClickMemo}>Click</button>

// 3. Component memoization
// ❌ YANLIŞ: Parent değiştiğinde child re-render
function ProductCard({ product }) {
  return <div>{product.name}</div>;
}

// ✅ DOĞRU: Shallow compare, gereksiz re-render önleme
const ProductCard = memo(function ProductCard({ product }) {
  return <div>{product.name}</div>;
});

// 4. Key prop optimization
// ❌ YANLIŞ: Index as key (performance issue)
{products.map((product, index) => <ProductCard key={index} product={product} />)}

// ✅ DOĞRU: Unique ID as key
{products.map((product) => <ProductCard key={product.id} product={product} />)}

// 5. Virtual scrolling (uzun listeler için)
import { useVirtualizer } from '@tanstack/react-virtual';

function ProductList({ products }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Ortalama item height
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProductCard product={products[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 📋 Görevler:

- [ ] **Expensive computations → useMemo**
- [ ] **Event handlers → useCallback**
- [ ] **Heavy components → React.memo**
- [ ] **List keys → unique ID (index değil!)**
- [ ] **Long lists → Virtual scrolling** (@tanstack/react-virtual)
- [ ] **React DevTools Profiler ile test et** (unnecessary renders)

---

### 4.2 TanStack Query Optimization (1-2 saat)

```typescript
// lib/query-client.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time (veri ne kadar fresh kalır)
      staleTime: 5 * 60 * 1000, // 5 dakika (default: 0)

      // Cache time (kullanılmayan veri ne kadar cache'te kalır)
      gcTime: 10 * 60 * 1000, // 10 dakika (eski adı: cacheTime)

      // Refetch stratejileri
      refetchOnWindowFocus: false, // Pencere focus olduğunda refetch YAPMA
      refetchOnReconnect: false, // İnternet dönünce refetch YAPMA
      refetchOnMount: false, // Component mount olduğunda refetch YAPMA

      // Retry stratejisi
      retry: 1, // Sadece 1 kere retry (default: 3)
      retryDelay: 1000, // 1 saniye bekle

      // Network mode
      networkMode: 'online', // Sadece online iken fetch et
    },
  },
});

// Feature-specific overrides
// features/products/products.action.ts

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getAll(params),

    // Products sık değişir → short stale time
    staleTime: 2 * 60 * 1000, // 2 dakika

    // Prefetch stratejisi
    placeholderData: keepPreviousData, // Önceki data göster (loading state yok)

    // Select (data transformation)
    select: (data) => data.products, // Sadece products array'i döndür
  });
}

// Site settings nadiren değişir → long stale time
export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteSettingsService.getAll(),

    // Site settings neredeyse hiç değişmez → 1 saat
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000, // 2 saat cache

    // İlk yüklemede hemen fetch et, sonra refetch YAPMA
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
```

#### 📋 Görevler:

- [ ] **queryClient config optimize et** (yukarıdaki kod)
- [ ] **Stale time stratejisi belirle:**
  - Site settings: 1 saat
  - Products: 2 dakika
  - Categories: 10 dakika
  - Static content: 1 saat
- [ ] **Unnecessary refetch'leri kapat** (onWindowFocus, onReconnect)
- [ ] **Prefetching ekle** (hover'da next page prefetch)
  ```typescript
  const router = useRouter();
  const queryClient = useQueryClient();

  function handleMouseEnter(slug: string) {
    router.prefetch(`/product/${slug}`); // Route prefetch
    queryClient.prefetchQuery({ // Data prefetch
      queryKey: ['product', slug],
      queryFn: () => productsService.getBySlug(slug),
    });
  }
  ```

---

### 4.3 Animation Performance (1-2 saat)

```typescript
// 1. CSS animations > JavaScript animations
// ❌ YANLIŞ: JavaScript animation (60fps zor)
<motion.div animate={{ x: 100 }} transition={{ duration: 1 }}>

// ✅ DOĞRU: CSS animation (GPU accelerated)
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

// 2. Transform/Opacity > Position/Width/Height
// ❌ YANLIŞ: Layout thrashing
.box {
  transition: left 0.3s, width 0.3s; /* Reflow trigger */
}

// ✅ DOĞRU: GPU accelerated
.box {
  transition: transform 0.3s, opacity 0.3s; /* Composite only */
}

// 3. will-change hint
.animated-element {
  will-change: transform, opacity; /* Browser'a hint ver */
}

// 4. Reduce motion (accessibility + performance)
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// 5. AOS optimization
AOS.init({
  once: true, // Animasyon sadece 1 kere (scroll up'ta tekrar YAPMA)
  duration: 600, // Kısa animasyon (800ms → 600ms)
  easing: 'ease-out-cubic',
  disable: 'mobile', // Mobile'de disable et (performance)
  offset: 100, // Viewport'a 100px kala trigger et
});
```

#### 📋 Görevler:

- [ ] **CSS animations kullan** (Framer Motion yerine)
- [ ] **transform/opacity kullan** (left/top/width yerine)
- [ ] **will-change ekle** (animated elementlere)
- [ ] **Prefers-reduced-motion** media query ekle
- [ ] **AOS optimize et:** (once: true, disable: mobile)
- [ ] **Framer Motion lazy load** (sadece interactive sayfalarda)

---

## 🗄️ FAZ 5: Server-Side Optimization (Öncelik: 🟡 Yüksek)

### Hedef: TTFB < 600ms, ISR optimal kullanım

### 5.1 ISR Strategy (2 saat)

```typescript
// 1. Static pages - SSG (Build time generate)
// app/[locale]/about/page.tsx

export default async function AboutPage() {
  // Build time'da 1 kere fetch, sonra static
  const content = await getAboutContent();
  return <AboutPageContent data={content} />;
}

// 2. Semi-dynamic pages - ISR (Revalidate periodically)
// app/[locale]/page.tsx - Ana sayfa

export const revalidate = 60; // 60 saniyede bir revalidate

export default async function HomePage({ params }) {
  const { locale } = await params;

  // Paralel veri çekme (Promise.all)
  const [sliders, products, categories] = await Promise.all([
    getSliders(locale),
    getFeaturedProducts(locale),
    getCategories(locale),
  ]);

  return <HomePageContent data={{ sliders, products, categories }} />;
}

// 3. Dynamic pages with ISR - ISR + generateStaticParams
// app/[locale]/product/[slug]/page.tsx

export const revalidate = 300; // 5 dakikada bir revalidate

// En popüler 100 ürünü build time'da oluştur
export async function generateStaticParams() {
  const products = await getTopProducts(100);

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound(); // 404 page
  }

  return <ProductPageContent product={product} />;
}

// 4. User-specific pages - CSR (Client-side only)
// app/[locale]/(dashboard)/profile/page.tsx

'use client'; // CSR

import { useUser } from '@/features/auth/auth.action';

export default function ProfilePage() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <ProfileSkeleton />;

  return <ProfileContent user={user} />;
}
```

#### ISR Revalidation Strategy:

| Page Type | Strategy | Revalidate | Reason |
|-----------|----------|------------|--------|
| Homepage | ISR | 60s | Slider/content sık değişebilir |
| Product List | SSR | - | Filtreler dinamik |
| Product Detail | ISR + generateStaticParams | 300s | SEO + cache balance |
| Service Detail | ISR | 3600s | Nadiren değişir |
| Blog Post | ISR | 3600s | Nadiren değişir |
| Static Pages | SSG | - | Hiç değişmez |
| FAQ | ISR | 3600s | Nadiren değişir |
| User Profile | CSR | - | User-specific |

#### 📋 Görevler:

- [ ] **Her sayfa için rendering stratejisi belirle**
- [ ] **generateStaticParams ekle** (popüler sayfalar için)
- [ ] **Parallel data fetching** (Promise.all kullan)
- [ ] **Loading states ekle** (Suspense boundaries)
- [ ] **Error boundaries ekle** (error.tsx)

---

### 5.2 Streaming SSR (1-2 saat)

```typescript
// app/[locale]/page.tsx - Ana sayfa with Streaming

import { Suspense } from 'react';

export default async function HomePage() {
  // Shell immediate render, data stream edilecek
  return (
    <>
      {/* Shell (layout) - immediate */}
      <Header />

      {/* Above-the-fold - SSR */}
      <HeroSection />

      {/* Below-the-fold - Streaming SSR */}
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsSection />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsSection />
      </Suspense>

      {/* Footer - immediate */}
      <Footer />
    </>
  );
}

// Async Server Components
async function ProductsSection() {
  const products = await getProducts(); // Await inside Suspense
  return <ProductGrid products={products} />;
}

async function ReviewsSection() {
  const reviews = await getReviews();
  return <ReviewList reviews={reviews} />;
}
```

#### 📋 Görevler:

- [ ] **Suspense boundaries ekle** (below-the-fold content)
- [ ] **Async Server Components kullan**
- [ ] **Skeleton loaders hazırla** (her section için)
- [ ] **Waterfall requests önle** (parallel fetch)

---

### 5.3 Backend API Optimization (Backend tarafında, 1-2 saat)

#### 📋 Görevler (Backend team ile koordinasyon):

- [ ] **Response compression** (gzip/brotli)
- [ ] **Database query optimization:**
  - N+1 query problems
  - Index optimization
  - Pagination (limit/offset)
- [ ] **Redis caching:**
  - Site settings → Redis (TTL: 1 saat)
  - Product list → Redis (TTL: 5 dakika)
  - Categories → Redis (TTL: 30 dakika)
- [ ] **CDN integration** (Cloudflare/Vercel Edge)
- [ ] **Rate limiting** (DDoS protection)

---

## 📊 FAZ 6: Monitoring & Testing (Öncelik: 🟢 Orta)

### 6.1 Lighthouse CI (1-2 saat)

```javascript
// lighthouserc.js

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/tr',
        'http://localhost:3000/tr/product/cooling-tower',
        'http://localhost:3000/tr/service/maintenance',
        'http://localhost:3000/tr/contact',
      ],
      numberOfRuns: 3, // 3 kere test et, ortalamasını al
      settings: {
        preset: 'desktop', // Desktop + Mobile test et
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }], // 95+
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
      },
    },
    upload: {
      target: 'temporary-public-storage', // Lighthouse report URL
    },
  },
};
```

```bash
# Lighthouse CI install
npm install --save-dev @lhci/cli

# package.json scripts
{
  "scripts": {
    "lhci": "lhci autorun",
    "lhci:desktop": "lhci autorun --preset=desktop",
    "lhci:mobile": "lhci autorun --preset=mobile"
  }
}

# Run Lighthouse CI
npm run build
npm run start
npm run lhci
```

#### 📋 Görevler:

- [ ] **Lighthouse CI setup** (yukarıdaki config)
- [ ] **CI/CD entegrasyonu** (GitHub Actions)
- [ ] **Performance budget tanımla:**
  - Performance: 95+
  - SEO: 95+
  - Accessibility: 90+
  - Best Practices: 90+
- [ ] **Her PR'da otomatik test**

---

### 6.2 Real User Monitoring (RUM) (1-2 saat)

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

  // Custom endpoint (optional)
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    body: JSON.stringify({
      metric: metric.name,
      value: metric.value,
      id: metric.id,
      page: window.location.pathname,
      locale: document.documentElement.lang,
      timestamp: Date.now(),
    }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);   // Cumulative Layout Shift
  onFID(sendToAnalytics);   // First Input Delay (deprecated)
  onINP(sendToAnalytics);   // Interaction to Next Paint (yeni)
  onFCP(sendToAnalytics);   // First Contentful Paint
  onLCP(sendToAnalytics);   // Largest Contentful Paint
  onTTFB(sendToAnalytics);  // Time to First Byte
}

// app/[locale]/layout.tsx

'use client';

import { reportWebVitals } from '@/lib/web-vitals';
import { useEffect } from 'react';

export function WebVitalsReporter() {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return null;
}
```

#### 📋 Görevler:

- [ ] **Web Vitals tracking ekle** (yukarıdaki kod)
- [ ] **Google Analytics 4 entegrasyonu**
- [ ] **Google Search Console → Core Web Vitals report kontrol**
- [ ] **Sentry Performance Monitoring** (optional)

---

### 6.3 Bundle Size Budget (1 saat)

```javascript
// next.config.js

module.exports = {
  // Performance budgets
  experimental: {
    bundlePagesRouterDependencies: true,
  },

  // Webpack bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Bundle size limits
      config.performance = {
        maxEntrypointSize: 200 * 1024, // 200KB
        maxAssetSize: 500 * 1024, // 500KB
        hints: 'error', // Error if exceeded
      };
    }
    return config;
  },
};
```

#### Performance Budget:

| Asset Type | Budget | Current | Status |
|------------|--------|---------|--------|
| Initial JS | < 200KB | ? | ⏳ Test gerekli |
| Initial CSS | < 50KB | ? | ⏳ Test gerekli |
| Images (avg) | < 100KB | ? | ⏳ Test gerekli |
| Total Page | < 1MB | ? | ⏳ Test gerekli |

#### 📋 Görevler:

- [ ] **Performance budget tanımla** (next.config.js)
- [ ] **Bundle analyzer çalıştır** (`ANALYZE=true npm run build`)
- [ ] **Exceed edilen paketleri optimize et**
- [ ] **CI/CD'de budget check** (build fail if exceeded)

---

## 🎯 Hızlı Kazanımlar (Quick Wins)

### Bugün Yapılabilecek (2-3 saat):

1. ✅ **next/image kullan** (tüm img taglerini değiştir)
   - LCP'yi %40 iyileştirebilir

2. ✅ **Dynamic imports ekle** (heavy componentler)
   - TBT'yi %30 azaltabilir

3. ✅ **next/font ekle** (font optimization)
   - FCP'yi %20 iyileştirebilir

4. ✅ **AOS lazy load** (non-blocking)
   - TBT'yi %15 azaltabilir

5. ✅ **Third-party scripts optimize et** (next/script)
   - TBT'yi %20 azaltabilir

### Bu Hafta İçinde (1 hafta):

6. ✅ **Code splitting** (lazy load all heavy libs)
7. ✅ **Image formats** (AVIF + WebP)
8. ✅ **Bootstrap tree-shake** (sadece grid + utilities)
9. ✅ **React optimization** (memo, useMemo, useCallback)
10. ✅ **TanStack Query config** (staleTime, refetch stratejisi)

---

## 📅 4 Haftalık Sprint Planı

### Sprint 1: JavaScript Optimization (Hafta 1)
**Hedef: TBT < 300ms**

- **Gün 1-2:** Bundle analysis + Dynamic imports (1.1, 1.2)
- **Gün 3:** Tree shaking + Dead code elimination (1.4)
- **Gün 4:** Third-party scripts + Heavy libs lazy load (1.3, 1.5)
- **Gün 5:** Test + optimize (bundle analyzer)

**Beklenen İyileşme:** TBT: 800ms → 300ms (-63%)

---

### Sprint 2: Image Optimization (Hafta 2)
**Hedef: LCP < 2.5s**

- **Gün 1-2:** next/image migration + Sizes prop (2.1)
- **Gün 3:** Image formats + Cloudinary optimization (2.2, 2.3)
- **Gün 4:** Priority strategy + Preloading (2.4)
- **Gün 5:** Test + optimize (PageSpeed Insights)

**Beklenen İyileşme:** LCP: 4.5s → 2.3s (-49%)

---

### Sprint 3: CSS + Font + React Optimization (Hafta 3)
**Hedef: FCP < 1.8s, CLS < 0.1**

- **Gün 1:** Critical CSS + Bootstrap tree-shake (3.1, 3.2)
- **Gün 2:** Font optimization (3.3)
- **Gün 3:** React optimization (memo, useMemo, useCallback) (4.1)
- **Gün 4:** TanStack Query optimization (4.2)
- **Gün 5:** Animation optimization (4.3)

**Beklenen İyileşme:** FCP: 2.8s → 1.6s (-43%), CLS: 0.15 → 0.08 (-47%)

---

### Sprint 4: SSR + Monitoring + Final Optimization (Hafta 4)
**Hedef: Lighthouse 100/100**

- **Gün 1:** ISR strategy + Streaming SSR (5.1, 5.2)
- **Gün 2:** Backend API optimization (5.3)
- **Gün 3:** Lighthouse CI + RUM setup (6.1, 6.2)
- **Gün 4:** Final optimizations (bundle budget, test)
- **Gün 5:** Production deploy + QA

**Beklenen İyileşme:** Performance: 85 → 100 (+18%)

---

## 🏆 Başarı Kriterleri

### Lighthouse Hedefi: 100/100/100/100

#### Performance: 100/100

- ✅ FCP < 1.8s
- ✅ LCP < 2.5s
- ✅ TBT < 200ms
- ✅ CLS < 0.1
- ✅ Speed Index < 3.4s

#### SEO: 100/100 (Kolay)

- ✅ Valid metadata
- ✅ Semantic HTML
- ✅ Sitemap
- ✅ Robots.txt

#### Accessibility: 100/100

- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast
- ✅ Alt texts

#### Best Practices: 100/100

- ✅ HTTPS
- ✅ No console errors
- ✅ Security headers

---

## 🔥 Kritik Öncelikler

1. 🔴 **TBT Optimization** (En zor, en önemli)
   - Dynamic imports
   - Code splitting
   - Third-party scripts defer

2. 🔴 **LCP Optimization** (Görsel yoğun site)
   - next/image
   - Image formats (AVIF/WebP)
   - Priority images

3. 🟡 **FCP Optimization**
   - Critical CSS
   - Font optimization
   - Above-the-fold content

4. 🟡 **CLS Prevention**
   - Fixed dimensions
   - Skeleton loaders
   - No layout shifts

---

## 📊 Beklenen Sonuçlar

### Mevcut Durum (Tahmini):
- Performance: ~85/100
- LCP: ~4.5s
- TBT: ~800ms
- CLS: ~0.15
- FCP: ~2.8s

### Hedef (4 hafta sonra):
- ✅ Performance: 100/100
- ✅ LCP: < 2.5s
- ✅ TBT: < 200ms
- ✅ CLS: < 0.1
- ✅ FCP: < 1.8s

### ROI:
- Page load time: %55 iyileşme (6s → 2.7s)
- Bounce rate: %30 azalma
- Conversion rate: %20 artış
- SEO ranking: Top 3 (Core Web Vitals green)

---

**İlk Adım:** Sprint 1 - JavaScript Optimization (Bu hafta başlayabilirsiniz!)
