# CLAUDE.md

This file provides guidance to Claude Code when working with the Ensotek project.

## Project Overview

**Ensotek** is a **multi-language, SEO-first, fully dynamic industrial website** for cooling towers and process cooling solutions. Everything is manageable through the admin panel - content, settings, media, menus, and localization.

### Tech Stack
- **Frontend**: Next.js 14 (Pages Router), React 18, TypeScript
- **State Management**: Redux Toolkit (RTK Query)
- **Styling**: Bootstrap 5, SASS, Tailwind CSS (hybrid)
- **UI Components**: Radix UI, Framer Motion, Swiper
- **SEO**: JSON-LD, Sitemaps, OpenGraph, Twitter Cards
- **Images**: Next.js Image Optimization, Cloudinary integration
- **Backend API**: RESTful API (separate backend, consumed via `/api` reverse proxy)

## Architecture

### 1. **Pages Router (NOT App Router)**
This project uses Next.js Pages Router (`src/pages/`), not the newer App Router.

```
src/
├── pages/              # Pages Router (SSR/SSG)
│   ├── _app.tsx       # Global app wrapper
│   ├── _document.tsx  # Custom HTML document
│   ├── index.tsx      # Homepage
│   ├── product/       # Dynamic product pages
│   ├── service/       # Dynamic service pages
│   ├── admin/         # Admin panel pages
│   └── api/           # API routes (sitemaps, etc.)
├── components/        # React components
├── layout/           # Layout components (Header, Footer, etc.)
├── features/         # Feature modules (SEO, analytics, etc.)
├── integrations/     # Backend integration (RTK Query endpoints)
├── i18n/            # Internationalization
├── seo/             # SEO utilities and schemas
└── styles/          # SCSS stylesheets
```

### 2. **Multi-Language System**

#### Supported Languages
```json
["ar", "de", "en", "es", "fr", "hi", "it", "pl", "pt", "ru", "zh"]
```

#### Key Features
- **Default locale**: `de` (German) - configurable via `NEXT_PUBLIC_DEFAULT_LOCALE`
- **Prefixless default**: `/` → German, `/en/` → English, `/tr/` → Turkish
- **No middleware**: Language routing handled via:
  - `next.config.js` rewrites (`:lc([a-z]{2,3}...)` pattern)
  - Client-side locale detection hooks
  - URL-based locale resolution
- **Dynamic locale list**: Fetched from backend (`/site_settings/app-locales`)
- **RTL support**: Built-in for Arabic, Hebrew, Urdu, etc. (`i18n/config.ts`)

#### How It Works
1. **URL pattern**: `/[locale]/path` (e.g., `/en/product/cooling-tower`)
2. **Rewrite**: `/:lc/:path*` → `/:path*?__lc=:lc` (query parameter)
3. **Hooks**: `useResolvedLocale()` reads from URL/cookie/headers
4. **RTK queries**: All API calls pass `locale` parameter
5. **Content**: Backend returns localized data based on `Accept-Language` header

### 3. **SEO Architecture**

This project has **production-grade SEO** with multiple layers:

#### SEO Data Sources (Priority Order)
1. **Page-level overrides** (`LayoutSeoBridge` component)
2. **Database settings** (`site_settings` table):
   - `site_seo` - SEO defaults per locale
   - `site_meta_default` - Fallback title/description
   - `site_og_default_image` - Default OG image
3. **Hard-coded fallbacks** (only when DB is empty)

#### SEO Components
```typescript
// src/seo/
├── LayoutSeoBridge.tsx      // Page-level SEO override bridge
├── JsonLd.tsx              // JSON-LD structured data
├── SiteJsonLd.tsx          // Organization & WebSite schema
├── ProductJsonLd.tsx       // Product schema
├── ServiceJsonLd.tsx       // Service schema
├── WebPageJsonLd.tsx       // WebPage schema
├── BreadcrumbJsonLd.tsx    // Breadcrumb schema
└── meta.ts                 // Meta tag builder
```

#### JSON-LD Features
- **Organization schema** - Company info, logo, social links
- **WebSite schema** - Site-level search action
- **Product schema** - Dynamic product metadata
- **Service schema** - Dynamic service metadata
- **Breadcrumb schema** - Navigation hierarchy

#### Sitemap System
Generated dynamically via API routes (`src/pages/api/`):
- `/sitemap.xml` → Sitemap index
- `/sitemap-pages.xml` → Static pages
- `/sitemap-products.xml` → Dynamic products
- `/sitemap-services.xml` → Dynamic services
- `/sitemap-blog.xml` → Blog posts
- `/sitemap-news.xml` → News articles

#### Robots.txt
Dynamic robots.txt via `/pages/robots.txt.ts`

### 4. **Backend Integration (RTK Query)**

#### API Configuration
```typescript
// src/integrations/rtk/constants.ts
BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
```

#### Endpoint Structure
```
src/integrations/rtk/
├── baseApi.ts              # RTK Query base config
├── hooks.ts               # Auto-generated hooks
├── public/                # Public endpoints
│   ├── products.endpoints.ts
│   ├── services.endpoints.ts
│   ├── site_settings.endpoints.ts
│   └── ...
└── admin/                 # Admin-only endpoints
    ├── products_admin.endpoints.ts
    ├── site_settings_admin.endpoints.ts
    └── ...
```

#### Key Endpoints
- **`site_settings`**: Site configuration (logo, meta, locales)
- **`products`**: Product catalog with localization
- **`services`**: Service catalog with localization
- **`categories`**: Product/service categories
- **`menu_items`**: Dynamic navigation menus
- **`sliders`**: Homepage hero sliders
- **`reviews`**: Customer testimonials
- **`library`**: Document/media library
- **`custom_pages`**: Dynamic CMS pages

#### Performance Optimizations
```typescript
// All site_settings queries have:
refetchOnFocus: false
refetchOnReconnect: false
refetchOnMountOrArgChange: false
keepUnusedDataFor: 300 // 5 minutes
```

### 5. **Dynamic Content Management**

Everything is editable via admin panel at `/admin`:

#### Admin Modules
- **Products** - Catalog management with specs, images, FAQs
- **Services** - Service portfolio
- **Site Settings** - Global config (logo, meta, contact info)
- **Menu Items** - Header/footer navigation
- **Sliders** - Homepage hero carousels
- **Categories & Subcategories** - Taxonomy
- **Library** - Document/media management
- **Custom Pages** - CMS for static pages
- **Email Templates** - Transactional emails
- **Newsletter** - Subscriber management
- **FAQs** - Help center
- **Reviews** - Testimonial moderation
- **References** - Client logos
- **Offers** - Special promotions
- **Users** - User management

#### Content Structure
All content follows this pattern:
```typescript
{
  id: number,
  locale: string,        // e.g., "de", "en", "tr"
  slug: string,         // URL-friendly identifier
  title: string,        // Localized title
  description: string,  // Localized description
  content: string,      // Rich text content (HTML/Markdown)
  images: Array<{       // Media gallery
    url: string,
    webp?: string,
    thumbnail?: string,
    alt?: string
  }>,
  is_active: boolean,
  created_at: string,
  updated_at: string
}
```

### 6. **Image Handling**

#### Next.js Image Component
- **Automatic optimization** (AVIF, WebP)
- **Lazy loading** by default
- **Priority loading** for above-the-fold images
- **Placeholder blur** (low-quality image placeholders)

#### Remote Patterns (next.config.js)
```javascript
remotePatterns: [
  { protocol: 'https', hostname: 'res.cloudinary.com' },
  { protocol: 'https', hostname: 'images.unsplash.com' },
  { protocol: 'https', hostname: 'ensotek.de' },
  { protocol: 'https', hostname: 'www.ensotek.de' },
  { protocol: 'https', hostname: 'cdn.ensotek.de' }
]
```

#### OptimizedImage Component
Located at `src/components/common/OptimizedImage.tsx`:
- Auto-detects above-the-fold images (first 3 = priority)
- Fallback image on error
- Graceful degradation

#### Media CDN Integration
- **Cloudinary** support built-in
- Helper: `toCdnSrc(url, width, height, mode)` in `src/shared/media.ts`

## Common Issues & Solutions

### 1. **Logo Not Showing**

**Problem**: Logo component returns `null` when database has no logo URL.

**File**: `src/layout/SiteLogo.tsx:124`

**Solution**: Add logo via admin panel or database:
```sql
-- Option 1: Simple URL
INSERT INTO site_settings (key, value, locale)
VALUES ('site_logo', 'https://cdn.ensotek.de/logo.png', '*');

-- Option 2: JSON with dimensions
INSERT INTO site_settings (key, value, locale)
VALUES ('site_logo', '{"url":"https://cdn.ensotek.de/logo.png","width":160,"height":60}', '*');
```

**Admin Panel**: `/admin/site-settings` → Search for `site_logo`

### 2. **404 Image Errors**

**Problem**: `upstream image response failed for https://...`

**Causes**:
- Broken URLs in database (old Unsplash links, moved files)
- Images not uploaded to CDN
- Invalid remote domains in `next.config.js`

**Solution**:
1. Check database for broken image URLs
2. Re-upload images to Cloudinary or CDN
3. Update `next.config.js` remote patterns if needed
4. Use `OptimizedImage` component with fallback:
```tsx
<OptimizedImage
  src={imageUrl}
  fallbackSrc="/img/fallback/placeholder.jpg"
  alt="Product"
/>
```

### 3. **Locale Switching Issues**

**Problem**: Language changes but content doesn't update

**Debug**:
```typescript
// Check current locale
import { useResolvedLocale } from '@/i18n/locale';
const locale = useResolvedLocale();
console.log('Current locale:', locale);
```

**Common fixes**:
- Ensure RTK queries pass `locale` parameter
- Check if backend returns localized data
- Verify `Accept-Language` header is set
- Clear RTK cache: `dispatch(baseApi.util.resetApiState())`

### 4. **SEO Meta Tags Not Updating**

**Problem**: Meta tags show default values instead of page-specific

**Solution**: Use `LayoutSeoBridge` in page component:
```tsx
import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';

export default function MyPage() {
  return (
    <>
      <LayoutSeoBridge
        title="Custom Page Title"
        description="Custom description"
        ogImage="/img/og-custom.jpg"
        noindex={false}
      />
      {/* Page content */}
    </>
  );
}
```

### 5. **Admin Panel Access**

**Routes**: All admin pages are under `/admin/*`

**Authentication**: JWT-based (check `src/integrations/rtk/admin/auth.admin.endpoints.ts`)

**Common paths**:
- `/admin` - Dashboard
- `/admin/products` - Product management
- `/admin/site-settings` - Global settings
- `/admin/menu-items` - Navigation editor

## Development Workflow

### Setup
```bash
cd frontend
npm install
# or
bun install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8086/api" > .env.local
```

### Commands
```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run typecheck    # TypeScript check
npm run analyze      # Bundle analyzer

# SEO testing
npm run test:seo     # Playwright SEO tests
npm run lh:autorun   # Lighthouse CI
```

### Environment Variables
```env
# API
NEXT_PUBLIC_API_URL=http://127.0.0.1:8086/api

# Locale
NEXT_PUBLIC_DEFAULT_LOCALE=de
NEXT_PUBLIC_DEFAULT_LOCALE_PREFIXLESS=true

# Site
NEXT_PUBLIC_SITE_NAME=Ensotek
NEXT_PUBLIC_SITE_URL=https://www.ensotek.de

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=
NEXT_PUBLIC_GTM_ID=

# Organization (optional fallbacks)
NEXT_PUBLIC_ORG_DESCRIPTION=
NEXT_PUBLIC_ORG_SAMEAS=
NEXT_PUBLIC_ORG_CONTACT_TELEPHONE=
NEXT_PUBLIC_ORG_CONTACT_TYPE=
```

## Code Conventions

### Naming
- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useProductData.ts`)
- **Utils**: camelCase (`formatPrice.ts`)
- **Constants**: UPPER_SNAKE_CASE (`BASE_URL`, `FALLBACK_LOCALE`)
- **Types**: PascalCase with suffix (`ProductDto`, `ProductListArgs`)

### File Structure
```typescript
// Component pattern
import React from 'react';
import type { ComponentProps } from '@/types';

type Props = {
  // ...
};

export function ComponentName({ prop1, prop2 }: Props) {
  // Component logic
  return (
    // JSX
  );
}
```

### RTK Query Pattern
```typescript
// Endpoint file
export const productsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listProducts: b.query<ProductDto[], ListProductsArgs>({
      query: (args) => ({
        url: '/products',
        params: { locale: args.locale, limit: args.limit },
      }),
      providesTags: (result) =>
        result?.map(p => ({ type: 'Products', id: p.id })) || [],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useListProductsQuery } = productsApi;
```

### SEO Pattern
```typescript
// Page with SEO
import { LayoutSeoBridge } from '@/seo/LayoutSeoBridge';
import { ProductJsonLd } from '@/features/seo/ProductJsonLd';

export default function ProductPage({ product }) {
  return (
    <>
      <LayoutSeoBridge
        title={product.seo_title || product.title}
        description={product.seo_description}
        ogImage={product.images?.[0]?.url}
      />
      <ProductJsonLd product={product} locale={locale} />
      {/* Page content */}
    </>
  );
}
```

## Performance Optimizations

### Next.js Config
- **Tree shaking**: Enabled
- **Code splitting**: Vendor chunks < 244KB
- **Image formats**: AVIF + WebP
- **Cache TTL**: 30 days for images
- **Preconnect**: Cloudinary, Google Fonts

### Runtime
- **AOS animations**: `once: true` (no re-trigger on scroll)
- **NProgress**: Disabled spinner for cleaner UX
- **Redux DevTools**: Disabled in production
- **Console logs**: Stripped in production build

### Critical CSS
Inlined in `_document.tsx` for Core Web Vitals:
- Box-sizing reset
- Font loading
- Image aspect ratio preservation
- Skeleton animation

## Testing

### SEO Tests
Located in `tests/seo/` (Playwright):
- Meta tags validation
- OpenGraph tags
- Twitter Cards
- JSON-LD schema
- Sitemap generation
- Robots.txt

### Lighthouse CI
Config: `lighthouserc.cjs`
- Performance > 90
- SEO > 95
- Accessibility > 90
- Best Practices > 90

## Deployment

### Build
```bash
npm run build
npm run start
```

### Static Export (if needed)
```bash
# Add to next.config.js
output: 'export'
```

### Reverse Proxy (Recommended)
Production setup with backend API:
```nginx
# Nginx config
location /api/ {
  proxy_pass http://backend:8086/api/;
}

location / {
  proxy_pass http://frontend:3000/;
}
```

## Key Files Reference

### Configuration
- `next.config.js` - Next.js config (rewrites, images, i18n)
- `package.json` - Dependencies & scripts
- `tsconfig.json` - TypeScript config

### Entry Points
- `src/pages/_app.tsx` - App wrapper (Redux, AOS, NProgress)
- `src/pages/_document.tsx` - HTML document (preconnects, critical CSS)
- `src/pages/index.tsx` - Homepage

### Core Modules
- `src/integrations/rtk/` - API integration layer
- `src/i18n/` - Internationalization
- `src/seo/` - SEO utilities
- `src/layout/` - Layout components
- `src/components/` - Reusable components

### Critical Components
- `src/layout/Layout.tsx` - Main layout wrapper (SEO, brand, logo)
- `src/layout/SiteLogo.tsx` - Dynamic logo component
- `src/layout/header/HeaderClient.tsx` - Main header with menu
- `src/seo/LayoutSeoBridge.tsx` - Page SEO override bridge
- `src/features/seo/SiteJsonLd.tsx` - Organization JSON-LD

## Notes for Claude

### When Editing Code
1. **Always check locale handling** - Most data is locale-specific
2. **Preserve SEO features** - This is an SEO-first project
3. **Test image URLs** - Use `OptimizedImage` with fallbacks
4. **Keep admin panel compatibility** - Don't break dynamic content management
5. **Maintain TypeScript types** - All API responses have strict types
6. **Follow RTK Query patterns** - Use `providesTags`, `keepUnusedDataFor`, etc.
7. **Check mobile responsiveness** - Bootstrap grid + custom breakpoints

### When Debugging
1. Check RTK Query DevTools in Redux DevTools
2. Verify `locale` parameter in API calls
3. Check browser console for image 404s
4. Inspect `<head>` tags for SEO metadata
5. Test with `npm run test:seo`

### When Adding Features
1. Add new endpoints in `src/integrations/rtk/public/` or `admin/`
2. Create corresponding TypeScript types in `src/integrations/types/`
3. Update `src/integrations/rtk/hooks.ts` if needed
4. Add SEO metadata using `LayoutSeoBridge`
5. Consider JSON-LD schema if applicable

### Common Gotchas
- **Locale fallback**: Always check `locale` → `'*'` fallback pattern
- **Site settings cache**: RTK Query caches for 5 minutes
- **Image optimization**: Remote patterns must be in `next.config.js`
- **Admin routes**: Separate layout logic in `_app.tsx`
- **SEO overrides**: Store-based (`LayoutSeoBridge`) > props > DB > hardcoded

---

**Last Updated**: 2026-02-08
**Project Version**: Next.js 14.2.35, React 18.2.0
**Author**: Ensotek Development Team
