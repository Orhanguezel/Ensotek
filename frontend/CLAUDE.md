# CLAUDE.md

This file provides guidance to Claude Code when working with the Ensotek B2B Portal frontend project.

---

## 📋 Project Overview

**Ensotek B2B Portal Frontend** - Next.js 16 App Router application for a B2B industrial products platform.

- **Working Directory:** `/home/orhan/Documents/Ensotek-xxx/digitek`
- **Backend API:** `/home/orhan/Documents/Ensotek-xxx/backend` (Fastify, port 8086)
- **Type:** Full-stack B2B e-commerce/catalog platform
- **Languages:** Turkish , English, German (primary)
- **Status:** Backend integrated, feature modules ready, UI components from Digitek theme

---

## 🎯 Critical Rules

### 1. **NEVER Work in Wrong Directory**
- ✅ **CORRECT:** `/home/orhan/Documents/Ensotek-xxx/digitek`
- ❌ **WRONG:** `/home/orhan/Documents/Ensotek-xxx/frontend`

Always verify you're in the digitek project before making changes.

### 2. **Performance First**
- This project has **Lighthouse 100/100 goals**
- Prioritize: TBT < 200ms, LCP < 2.5s, CLS < 0.1
- See: `PERFORMANCE_FIRST_PLAN.md`, `LIGHTHOUSE_OPTIMIZATION_PLAN.md`

### 3. **No Inline Styles**
- Use SCSS files in `src/styles/`
- Use `!important` flags when needed for specificity
- External styles are required for optimal performance

### 4. **TypeScript Strict Mode**
- All code must be type-safe
- Use Zod schemas for validation
- Feature modules have `.type.ts` files for types

---

## 🏗️ Tech Stack

### Core
- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **React:** 19.2.4
- **TypeScript:** 5.8.3 (strict mode)
- **Node:** 18+ (Bun recommended)

### Styling
- **SCSS/Sass:** Custom styles + Bootstrap 5.2.3
- **Tailwind CSS:** Utility classes (minimal usage)
- **Theme:** Digitek premium template (retained UI components)

### State & Data
- **Data Fetching:** TanStack Query v5.90.20
- **State Management:** Zustand 5.0.11 (auth state)
- **Form Handling:** React Hook Form 7.66.0 + Zod 4.3.6
- **HTTP Client:** Axios 1.13.5 (with interceptors)

### UI Components
- **Component Library:** Radix UI (dialogs, accordions, selects, etc.)
- **Icons:** lucide-react 0.563.0, react-icons 4.8.0
- **Carousel:** Swiper 9.1.1, Embla Carousel 8.6.0
- **Animations:** Framer Motion 12.34.0, AOS 2.3.4
- **Toast:** Sonner 2.0.7

### i18n
- **Library:** next-intl 4.8.2
- **Locales:** tr, en, de, fr, ru, ar

### Developer Tools
- **Linting:** ESLint 10.0.0
- **Formatting:** Prettier 3.8.1
- **Bundle Analysis:** @next/bundle-analyzer 16.1.6

---

## 📂 Project Structure

```
digitek/
├── src/
│   ├── app/
│   │   └── [locale]/                    # i18n routing
│   │       ├── layout.tsx               # Root layout (providers, fonts)
│   │       ├── page.tsx                 # Homepage (ISR 60s)
│   │       ├── products/                # Product catalog
│   │       ├── services/                # Services pages
│   │       ├── contact/                 # Contact form
│   │       ├── (auth)/                  # Auth pages (login, register)
│   │       └── (account)/               # Protected user area
│   │
│   ├── features/                        # Feature-based modules (20+)
│   │   ├── auth/                        # Authentication & authorization
│   │   │   ├── auth.service.ts         # API calls
│   │   │   ├── auth.hooks.ts           # React Query hooks
│   │   │   ├── auth.types.ts           # TypeScript types
│   │   │   ├── auth.schema.ts          # Zod validation schemas
│   │   │   └── index.ts                # Public exports
│   │   ├── products/                    # Product management
│   │   ├── categories/                  # Category management
│   │   ├── slider/                      # Homepage sliders
│   │   ├── site-settings/               # Site configuration
│   │   ├── menu-items/                  # Navigation menu
│   │   ├── footer-sections/             # Footer content
│   │   ├── contact/                     # Contact form
│   │   ├── newsletter/                  # Newsletter subscription
│   │   ├── offer/                       # Quote requests
│   │   ├── catalog/                     # Catalog requests
│   │   ├── reviews/                     # Product reviews
│   │   ├── support/                     # Support tickets
│   │   ├── notifications/               # User notifications
│   │   ├── profiles/                    # User profiles
│   │   ├── library/                     # Document library
│   │   ├── faqs/                        # FAQs
│   │   ├── references/                  # Customer references
│   │   ├── services/                    # Services content
│   │   ├── custom-pages/                # Dynamic pages
│   │   ├── subcategories/               # Subcategories
│   │   └── storage/                     # File upload/download
│   │
│   ├── components/                      # UI components
│   │   ├── layout/                      # Header, Footer, Navigation
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── banner/                  # Hero sections
│   │   │   │   └── HomeBannerOne.tsx   # Main hero with slider
│   │   │   └── navigation/              # Nav components
│   │   ├── containers/                  # Page-level containers
│   │   │   ├── product/
│   │   │   ├── service/
│   │   │   └── about/
│   │   └── ui/                          # Reusable UI components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── accordion.tsx
│   │       └── ...                      # Shadcn/Radix components
│   │
│   ├── lib/                             # Core utilities
│   │   ├── api.ts                       # Axios instance + interceptors
│   │   ├── query-client.ts              # TanStack Query config
│   │   ├── utils.ts                     # Helper functions
│   │   ├── constants.ts                 # App constants
│   │   └── language.ts                  # i18n helpers
│   │
│   ├── providers/                       # React context providers
│   │   └── index.ts                     # All providers wrapper
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── useMediaQuery.ts
│   │   └── useScrollDirection.ts
│   │
│   ├── styles/                          # SCSS stylesheets
│   │   ├── main.scss                    # Main import file
│   │   ├── admin/                       # Admin panel styles
│   │   ├── components/                  # Component styles
│   │   │   ├── _buttons.scss
│   │   │   ├── _carousel.scss
│   │   │   └── ...
│   │   ├── layout/                      # Layout styles
│   │   │   ├── _header.scss
│   │   │   ├── _hero.scss
│   │   │   ├── _footer.scss
│   │   │   └── ...
│   │   └── utils/                       # Utilities
│   │       ├── _my-custom.scss
│   │       └── _visually-hidden.scss
│   │
│   ├── endpoints/                       # API endpoint constants
│   │   └── api-endpoints.ts
│   │
│   ├── utils/                           # Utility functions
│   │   └── utils.ts
│   │
│   ├── middleware.ts                    # Next.js middleware (i18n routing)
│   └── i18n.ts                          # next-intl configuration
│
├── public/                              # Static assets
│   ├── img/                             # Images (theme assets)
│   ├── locales/                         # i18n JSON files
│   │   ├── tr.json
│   │   ├── en.json
│   │   ├── de.json
│   │   ├── fr.json
│   │   ├── ru.json
│   │   └── ar.json
│   └── favicon.ico
│
├── .env.local                           # Environment variables
├── next.config.js                       # Next.js configuration
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript config
├── tailwind.config.js                   # Tailwind config
├── CLAUDE.md                            # This file
├── IMPLEMENTATION_PLAN.md               # Backend integration plan
├── PERFORMANCE_FIRST_PLAN.md            # Performance optimization plan
├── LIGHTHOUSE_OPTIMIZATION_PLAN.md      # Lighthouse 100/100 roadmap
└── ensotek-roadmap-v3.md                # 6.5-week sprint roadmap
```

---

## 🔌 Backend API

### Connection
- **Base URL:** `http://127.0.0.1:8086/api` (local development)
- **Production:** `https://api.ensotek.de/api`
- **Environment Variable:** `NEXT_PUBLIC_API_URL`

### Authentication
- **Method:** JWT Bearer token
- **Refresh Token:** Automatic via Axios interceptor
- **Storage:** localStorage (token, refreshToken)
- **Header:** `Authorization: Bearer {token}`
- **Language Header:** `x-lang: {locale}`

### API Endpoints (~70 endpoints)
See `ensotek-roadmap-v3.md` section 1 for complete mapping.

**Key endpoint groups:**
- `/api/auth/*` - Auth (12 endpoints)
- `/api/products/*` - Products (7 endpoints)
- `/api/categories/*` - Categories (3 endpoints)
- `/api/services/*` - Services (4 endpoints)
- `/api/site_settings/*` - Site config (4 endpoints)
- `/api/sliders/*` - Sliders (2 endpoints)
- `/api/menu_items/*` - Menu (2 endpoints)
- `/api/footer_sections/*` - Footer (3 endpoints)
- `/api/contacts` - Contact form (1 endpoint)
- `/api/newsletter/*` - Newsletter (2 endpoints)
- `/api/notifications/*` - Notifications (6 endpoints)
- `/api/support_tickets/*` - Support (6 endpoints)
- `/api/reviews/*` - Reviews (4 endpoints)
- `/api/offers` - Quote requests (1 endpoint)
- `/api/catalog-requests` - Catalog requests (1 endpoint)

---

## 🧩 Feature Modules Pattern

Each feature module follows this structure:

```typescript
features/
  {feature-name}/
    ├── {feature}.service.ts     # API calls (axios)
    ├── {feature}.hooks.ts       # React Query hooks
    ├── {feature}.types.ts       # TypeScript interfaces
    ├── {feature}.schema.ts      # Zod validation schemas (optional)
    ├── {feature}.action.ts      # Additional hooks (optional)
    └── index.ts                 # Public exports
```

### Example: Products Feature

```typescript
// products.types.ts
export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  images: ProductImage[];
  category_id: number;
  sub_category_id?: number;
  // ...
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  sub_category_id?: number;
  sort?: 'name' | 'price' | 'created_at';
  order?: 'asc' | 'desc';
}

// products.hooks.ts
export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsService.getBySlug(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## 🎨 Styling Guidelines

### SCSS Architecture
- **Bootstrap 5:** Grid system + utilities only (no full import)
- **Custom SCSS:** Component-based organization
- **Critical CSS:** Inline above-the-fold styles in layout.tsx
- **Performance:** Minimize CSS bundle size (<50KB)

### Example: Button Styles
```scss
// styles/components/_buttons.scss
.solid__btn {
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--clr-theme-1);
  padding: 0 35px;
  font-size: 16px;
  font-weight: var(--bd-fw-sbold);
  color: var(--clr-common-white);
  background-color: var(--clr-theme-1);
  border-radius: 6px;

  &:hover {
    color: var(--clr-theme-1);
    border: 2px solid var(--clr-theme-1);
    background-color: transparent;
  }
}
```

### Tailwind Usage (Minimal)
- Only for utility classes (spacing, display, etc.)
- Avoid Tailwind for complex components
- Prefer SCSS for theme consistency

---

## ⚡ Performance Best Practices

### 1. Image Optimization
```tsx
import Image from 'next/image';

// Priority for LCP images (hero, above-the-fold)
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  priority
  sizes="100vw"
  quality={85}
/>

// Lazy load for below-the-fold
<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={400}
  loading="lazy"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### 2. Code Splitting
```tsx
import dynamic from 'next/dynamic';

// Heavy components - dynamic import
const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  loading: () => <VideoSkeleton />,
  ssr: false,
});

const ContactForm = dynamic(() => import('./forms/ContactForm'), {
  loading: () => <FormSkeleton />,
  ssr: false,
});
```

### 3. React Query Configuration
```typescript
// Stale time strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes cache
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

// Per-feature overrides:
// - Site settings: 1 hour (rarely changes)
// - Products: 2 minutes (frequently updated)
// - Categories: 10 minutes (medium frequency)
```

### 4. ISR Strategy
```typescript
// Homepage - frequent updates
export const revalidate = 60; // 60 seconds

// Product detail - moderate updates
export const revalidate = 300; // 5 minutes

// Static pages - rare updates
export const revalidate = 3600; // 1 hour

// Pure static (no backend data)
// No revalidate → SSG at build time
```

### 5. Bundle Optimization
- AOS lazy loaded (client-side only)
- Swiper dynamic import
- Framer Motion conditional load
- React Icons → Lucide React (smaller bundle)
- Font Awesome → removed (use Lucide)

---

## 🌐 Internationalization (i18n)

### Supported Locales
- **tr** (Turkish) 
- **en** (English)
- **de** (German) - Primary


### Usage
```tsx
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('products');

  return <h1>{t('title')}</h1>;
}
```

### Translation Files
Located in `public/locales/{locale}.json`

```json
{
  "products": {
    "title": "Ürünler",
    "search": "Ürün Ara",
    "noResults": "Sonuç bulunamadı"
  }
}
```

### API Language Header
Automatically added by Axios interceptor:
```typescript
headers: {
  'x-lang': locale, // Current user locale
}
```

---

## 🔐 Authentication Flow

### Login Process
1. User submits credentials → `POST /api/auth/token`
2. Receive `{ access_token, refresh_token, user }`
3. Store tokens in localStorage
4. Axios adds `Authorization: Bearer {token}` header
5. Zustand stores user state

### Token Refresh (Automatic)
1. API returns 401 Unauthorized
2. Axios interceptor catches error
3. Call `POST /api/auth/token/refresh` with refresh_token
4. Receive new access_token
5. Retry original request with new token
6. If refresh fails → redirect to /login

### Protected Routes
```tsx
// middleware.ts handles auth guard
// Routes starting with /(account)/ require authentication

// Example: Profile page
export default function ProfilePage() {
  const { data: user, isLoading } = useUser(); // From auth.hooks.ts

  if (isLoading) return <Skeleton />;
  if (!user) redirect('/login'); // Should not happen (middleware catches)

  return <ProfileContent user={user} />;
}
```

---

## 📝 Development Workflow

### Start Development Server
```bash
cd /home/orhan/Documents/Ensotek-xxx/digitek
bun run dev
# or
npm run dev

# Access: http://localhost:3000
```

### Backend Server
```bash
cd /home/orhan/Documents/Ensotek-xxx/backend
bun run dev
# API: http://127.0.0.1:8086/api
# Swagger: http://127.0.0.1:8086/documentation
```

### Build & Analyze
```bash
# Production build
bun run build

# Analyze bundle size
bun run analyze
# Opens bundle analyzer in browser
```

### Type Check
```bash
# Check TypeScript errors
bun run type-check
```

### Format Code
```bash
# Format with Prettier
bun run format
```

---

## 🚦 Common Tasks

### Add New Feature Module
1. Create directory: `src/features/{feature-name}/`
2. Create files:
   - `{feature}.service.ts` - API calls
   - `{feature}.hooks.ts` - React Query hooks
   - `{feature}.types.ts` - TypeScript types
   - `{feature}.schema.ts` - Zod schemas (if forms)
   - `index.ts` - Public exports
3. Add API endpoints to `src/endpoints/api-endpoints.ts`

### Add New Page
1. Create page file: `src/app/[locale]/{route}/page.tsx`
2. Choose rendering strategy:
   - SSG (static): No data fetching or `generateStaticParams`
   - ISR (incremental): Add `export const revalidate = {seconds}`
   - SSR (dynamic): Use `searchParams` or dynamic data
   - CSR (client): Add `'use client'` directive
3. Add metadata: `export async function generateMetadata()`
4. Add to sitemap: `src/app/sitemap.ts`

### Create UI Component
1. If Radix component → use Shadcn CLI:
   ```bash
   npx shadcn@latest add button
   ```
2. Custom component → `src/components/{category}/{ComponentName}.tsx`
3. Styles → `src/styles/components/_{component-name}.scss`

### Fix Hero/Banner Issues
- Component: `src/components/layout/banner/HomeBannerOne.tsx`
- Styles: `src/styles/layout/_hero.scss`
- Button styles: `src/styles/components/_buttons.scss`
- Navigation arrows: `src/styles/components/_carousel.scss`
- **Remember:** No inline styles, use SCSS with `!important` if needed

---

## 🐛 Common Issues & Solutions

### Issue: Changes Not Visible
1. Clear Next.js cache: `rm -rf .next`
2. Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
3. Check if you're in correct directory: `/digitek` NOT `/frontend`

### Issue: Styles Not Applying
1. Check SCSS file is imported in `src/styles/main.scss`
2. Verify class names match exactly (case-sensitive)
3. Use `!important` if styles are being overridden
4. Check browser DevTools for CSS specificity conflicts

### Issue: TypeScript Errors
1. Run `bun run type-check` to see all errors
2. Check feature module types in `{feature}.types.ts`
3. Ensure API response matches TypeScript interface
4. Use Zod for runtime validation + type inference

### Issue: API Not Working
1. Check backend is running: `http://127.0.0.1:8086/api`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check Axios interceptor in `src/lib/api.ts`
4. Open browser DevTools → Network tab for request/response
5. Check backend logs for errors

### Issue: Image Not Loading
1. Verify image path is correct (relative to `public/` or absolute URL)
2. Check `next.config.js` `remotePatterns` for external images
3. Use Next.js `<Image>` component, not `<img>` tag
4. Check image dimensions (provide width/height or use `fill`)

---

## 📚 Key Documentation Files

### Planning Documents
- **IMPLEMENTATION_PLAN.md** - Backend integration status, next steps
- **PERFORMANCE_FIRST_PLAN.md** - 4-week performance optimization plan (TBT, LCP, CLS focus)
- **LIGHTHOUSE_OPTIMIZATION_PLAN.md** - Comprehensive Lighthouse 100/100 roadmap
- **ensotek-roadmap-v3.md** - 6.5-week sprint plan, API endpoint mapping

### Implementation Priority
1. **Performance** (Critical): See `PERFORMANCE_FIRST_PLAN.md`
   - JavaScript bundle optimization (TBT < 200ms)
   - Image optimization (LCP < 2.5s)
   - CSS optimization (FCP < 1.8s)
   - Runtime performance (smooth 60fps)

2. **SEO** (Critical): See `LIGHTHOUSE_OPTIMIZATION_PLAN.md`
   - Metadata + OpenGraph
   - JSON-LD structured data
   - Sitemap + robots.txt
   - Semantic HTML

3. **Accessibility** (High): See `LIGHTHOUSE_OPTIMIZATION_PLAN.md`
   - ARIA labels
   - Keyboard navigation
   - Color contrast
   - Screen reader support

---

## 🎯 Current Status (as of last update)

### ✅ Completed
- Backend API integration
- i18n middleware (next-intl)
- TanStack Query setup
- Auth provider (Zustand)
- 20+ feature modules created
- Axios interceptors (auth + refresh token)
- SCSS styling architecture
- UI components from Digitek theme
- Homepage hero banner (HomeBannerOne.tsx)
- Image optimization config

### 🚧 In Progress
- Connecting pages to backend APIs
- SEO metadata implementation
- Performance optimization (Lighthouse 100/100)

### ⏳ Pending
- All content pages with dynamic data
- Auth pages (login, register, forgot password)
- User dashboard (/account/* pages)
- Production deployment
- Analytics integration
- Error tracking (Sentry)

---

## 💡 Tips for Claude Code

### When Debugging Hero/Banner Issues
1. Always read `HomeBannerOne.tsx` first
2. Check related SCSS files: `_hero.scss`, `_buttons.scss`, `_carousel.scss`
3. Remember: User reported navigation arrows and button hover issues
4. Solution pattern: Remove inline styles → use SCSS with `!important`
5. Use React Icons (FiChevronLeft, FiChevronRight) not FontAwesome

### When Adding New Features
1. Follow existing feature module pattern (service → hooks → types → schema)
2. Check `ensotek-roadmap-v3.md` for API endpoint details
3. Add to `api-endpoints.ts` constants
4. Use appropriate ISR/SSR/SSG strategy
5. Always add TypeScript types
6. Add loading states and error boundaries

### When Optimizing Performance
1. Refer to `PERFORMANCE_FIRST_PLAN.md` for priorities
2. TBT (Total Blocking Time) is the hardest metric - focus here first
3. Use dynamic imports for heavy components
4. Optimize images (priority, sizes, lazy loading)
5. Check bundle size with `bun run analyze`

### When Working with Styles
1. **NEVER use inline styles** (performance impact)
2. Use SCSS files in `src/styles/`
3. Check existing classes before creating new ones
4. Use `!important` if needed for specificity
5. Bootstrap grid + utilities only (no full Bootstrap)

### When Asked About Planning
1. Reference the roadmap files: `ensotek-roadmap-v3.md`, `IMPLEMENTATION_PLAN.md`
2. Follow sprint-based approach (6.5 weeks total)
3. Performance optimization is ongoing priority
4. Backend integration is Faz 1-3, performance is Faz 4

---

## 🔗 External Resources

- **Next.js 16 Docs:** https://nextjs.org/docs
- **TanStack Query v5:** https://tanstack.com/query/latest
- **next-intl:** https://next-intl-docs.vercel.app
- **Radix UI:** https://www.radix-ui.com/primitives
- **Lighthouse:** https://developer.chrome.com/docs/lighthouse
- **Backend Swagger:** http://127.0.0.1:8086/documentation

---

**Last Updated:** 2026-02-12
**Project Version:** 1.0.0
**Maintainer:** Ensotek Development Team
