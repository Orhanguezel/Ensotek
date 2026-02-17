# Ensotek B2B Portal — Frontend Yol Haritası v3
## Sadece Public Site | Swagger API Eşlemeli

---

## 1. Public API Endpoint Haritası (Swagger'dan)

### AUTH

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/auth/signup` | Kayıt | ❌ |
| POST | `/api/auth/token` | Giriş (login) | ❌ |
| POST | `/api/auth/token/refresh` | Token yenileme | 🔒 |
| POST | `/api/auth/password-reset/request` | Şifre sıfırlama isteği | ❌ |
| POST | `/api/auth/password-reset/confirm` | Şifre sıfırlama onayı | ❌ |
| POST | `/api/auth/google/start` | Google OAuth başlat | ❌ |
| POST | `/api/auth/google` | Google OAuth token | ❌ |
| GET | `/api/auth/google/callback` | Google OAuth callback | ❌ |
| GET | `/api/auth/user` | Mevcut kullanıcı | 🔒 |
| PUT | `/api/auth/user` | Kullanıcı güncelle | 🔒 |
| GET | `/api/auth/status` | Auth durumu | 🔒 |
| POST | `/api/auth/logout` | Çıkış | 🔒 |

### PROFİL

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/profiles/me` | Profil getir | 🔒 |
| PUT | `/api/profiles/me` | Profil güncelle | 🔒 |

### SİTE AYARLARI

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/site_settings` | Tüm ayarlar | ❌ |
| GET | `/api/site_settings/app-locales` | Desteklenen diller | ❌ |
| GET | `/api/site_settings/default-locale` | Varsayılan dil | ❌ |
| GET | `/api/site_settings/{key}` | Tek ayar getir | ❌ |

### MENÜ

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/menu_items` | Menü ağacı | ❌ |
| GET | `/api/menu_items/{id}` | Tek menü item | ❌ |

### SLIDER

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/sliders` | Tüm slider'lar | ❌ |
| GET | `/api/sliders/{idOrSlug}` | Tek slider | ❌ |

### KATEGORİLER

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/categories` | Kategori listesi | ❌ |
| GET | `/api/categories/{id}` | Kategori (ID) | ❌ |
| GET | `/api/categories/by-slug/{slug}` | Kategori (slug) | ❌ |

### ALT KATEGORİLER

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/sub-categories` | Alt kategori listesi | ❌ |
| GET | `/api/sub-categories/{id}` | Alt kategori (ID) | ❌ |
| GET | `/api/sub-categories/by-slug/{slug}` | Alt kategori (slug) | ❌ |

### ÜRÜNLER

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/products` | Ürün listesi (filtre, pagination) | ❌ |
| GET | `/api/products/{idOrSlug}` | Ürün detay (ID veya slug) | ❌ |
| GET | `/api/products/by-slug/{slug}` | Ürün detay (slug) | ❌ |
| GET | `/api/products/id/{id}` | Ürün detay (ID) | ❌ |
| GET | `/api/product_faqs` | Ürün SSS'leri | ❌ |
| GET | `/api/product_specs` | Ürün teknik özellikler | ❌ |
| GET | `/api/product_reviews` | Ürün yorumları | ❌ |

### YORUMLAR

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/reviews` | Yorum listesi | ❌ |
| POST | `/api/reviews` | Yorum ekle | 🔒 |
| GET | `/api/reviews/{id}` | Yorum detay | ❌ |
| POST | `/api/reviews/{id}/reactions` | Beğen/beğenme | 🔒 |

### DİNAMİK SAYFALAR

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/custom_pages` | Sayfa listesi | ❌ |
| GET | `/api/custom_pages/{id}` | Sayfa (ID) | ❌ |
| GET | `/api/custom_pages/by-slug/{slug}` | Sayfa (slug) | ❌ |

### SSS

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/faqs` | SSS listesi | ❌ |
| GET | `/api/faqs/{id}` | SSS (ID) | ❌ |
| GET | `/api/faqs/by-slug/{slug}` | SSS (slug) | ❌ |

### HİZMETLER

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/services` | Hizmet listesi | ❌ |
| GET | `/api/services/{id}` | Hizmet (ID) | ❌ |
| GET | `/api/services/by-slug/{slug}` | Hizmet (slug) | ❌ |
| GET | `/api/services/{id}/images` | Hizmet görselleri | ❌ |

### REFERANSLAR

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/references` | Referans listesi | ❌ |
| GET | `/api/references/{id}` | Referans (ID) | ❌ |
| GET | `/api/references/by-slug/{slug}` | Referans (slug) | ❌ |

### FOOTER

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/footer_sections` | Footer bölümleri | ❌ |
| GET | `/api/footer_sections/{id}` | Footer bölüm (ID) | ❌ |
| GET | `/api/footer_sections/by-slug/{slug}` | Footer bölüm (slug) | ❌ |

### KÜTÜPHANE / DÖKÜMANLAR

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/library` | Kütüphane listesi | ❌ |
| GET | `/api/library/{id}` | Item detay | ❌ |
| GET | `/api/library/by-slug/{slug}` | Item (slug) | ❌ |
| GET | `/api/library/{id}/images` | Item görselleri | ❌ |
| GET | `/api/library/{id}/files` | İndirilebilir dosyalar | ❌ |

### İLETİŞİM

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/contacts` | İletişim formu gönder | ❌ |

### NEWSLETTER

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/newsletter/subscribe` | Abone ol | ❌ |
| POST | `/api/newsletter/unsubscribe` | Abonelikten çık | ❌ |

### BİLDİRİMLER

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/notifications` | Bildirim listesi | 🔒 |
| POST | `/api/notifications` | Bildirim oluştur | 🔒 |
| GET | `/api/notifications/unread-count` | Okunmamış sayısı | 🔒 |
| PATCH | `/api/notifications/{id}` | Okundu işaretle | 🔒 |
| DELETE | `/api/notifications/{id}` | Bildirim sil | 🔒 |
| POST | `/api/notifications/mark-all-read` | Tümünü okundu | 🔒 |

### DESTEK

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/support_tickets` | Destek talepleri | 🔒 |
| POST | `/api/support_tickets` | Yeni talep | 🔒 |
| GET | `/api/support_tickets/{id}` | Talep detay | 🔒 |
| PATCH | `/api/support_tickets/{id}` | Talep güncelle | 🔒 |
| GET | `/api/ticket_replies/by-ticket/{ticketId}` | Yanıtlar | 🔒 |
| POST | `/api/ticket_replies` | Yanıt ekle | 🔒 |

### TEKLİF

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/offers` | Teklif isteği gönder | ❌/🔒 |

### KATALOG

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/catalog-requests` | Katalog isteği | ❌ |

### DOSYA

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/storage/{bucket}/{*}` | Dosya getir (resim vb.) | ❌ |
| POST | `/api/storage/{bucket}/upload` | Dosya yükle | 🔒 |

---

## 2. Frontend Modül Yapısı

```
src/modules/
├── auth/
│   ├── auth.service.ts          # 12 endpoint
│   ├── auth.action.ts           # useLogin, useSignup, useUser, useLogout...
│   ├── auth.type.ts             # User, LoginRequest, AuthResponse...
│   ├── auth.schema.ts           # loginSchema, signupSchema, passwordResetSchema
│   └── auth.store.ts            # Zustand: user, isAuthenticated
│
├── profiles/
│   ├── profiles.service.ts      # 2 endpoint: GET/PUT /profiles/me
│   ├── profiles.action.ts       # useProfile, useUpdateProfile
│   ├── profiles.type.ts         # Profile
│   └── profiles.schema.ts       # profileUpdateSchema
│
├── site-settings/
│   ├── siteSettings.service.ts  # 4 endpoint
│   ├── siteSettings.action.ts   # useSiteSettings, useAppLocales
│   └── siteSettings.type.ts     # SiteSettings, AppLocale
│
├── menu-items/
│   ├── menuItems.service.ts     # 2 endpoint
│   ├── menuItems.action.ts      # useMenuItems
│   └── menuItems.type.ts        # MenuItem (nested tree)
│
├── slider/
│   ├── slider.service.ts        # 2 endpoint
│   ├── slider.action.ts         # useSliders
│   └── slider.type.ts           # Slider
│
├── categories/
│   ├── categories.service.ts    # 3 endpoint
│   ├── categories.action.ts     # useCategories, useCategoryBySlug
│   └── categories.type.ts       # Category
│
├── subcategories/
│   ├── subcategories.service.ts # 3 endpoint
│   ├── subcategories.action.ts  # useSubCategories
│   └── subcategories.type.ts    # SubCategory
│
├── products/
│   ├── products.service.ts      # 7 endpoint (list, detail, faqs, specs, reviews)
│   ├── products.action.ts       # useProducts, useProduct, useProductFaqs...
│   └── products.type.ts         # Product, ProductFaq, ProductSpec, ProductReview
│
├── reviews/
│   ├── reviews.service.ts       # 4 endpoint
│   ├── reviews.action.ts        # useReviews, useSubmitReview, useReaction
│   ├── reviews.type.ts          # Review, ReviewReaction
│   └── reviews.schema.ts        # reviewSchema
│
├── custom-pages/
│   ├── customPages.service.ts   # 3 endpoint
│   ├── customPages.action.ts    # useCustomPages, useCustomPageBySlug
│   └── customPages.type.ts      # CustomPage
│
├── faqs/
│   ├── faqs.service.ts          # 3 endpoint
│   ├── faqs.action.ts           # useFaqs
│   └── faqs.type.ts             # Faq
│
├── services/
│   ├── services.service.ts      # 4 endpoint (list, detail, images)
│   ├── services.action.ts       # useServices, useServiceBySlug
│   └── services.type.ts         # Service, ServiceImage
│
├── references/
│   ├── references.service.ts    # 3 endpoint
│   ├── references.action.ts     # useReferences
│   └── references.type.ts       # Reference
│
├── footer-sections/
│   ├── footerSections.service.ts # 3 endpoint
│   ├── footerSections.action.ts  # useFooterSections
│   └── footerSections.type.ts    # FooterSection
│
├── library/
│   ├── library.service.ts       # 5 endpoint (list, detail, images, files)
│   ├── library.action.ts        # useLibrary, useLibraryItem, useLibraryFiles
│   └── library.type.ts          # LibraryItem, LibraryFile
│
├── contact/
│   ├── contact.service.ts       # 1 endpoint: POST /contacts
│   ├── contact.action.ts        # useSubmitContact
│   ├── contact.type.ts          # ContactForm
│   └── contact.schema.ts        # contactFormSchema
│
├── newsletter/
│   ├── newsletter.service.ts    # 2 endpoint: subscribe, unsubscribe
│   ├── newsletter.action.ts     # useSubscribe, useUnsubscribe
│   └── newsletter.schema.ts     # newsletterSchema
│
├── notifications/
│   ├── notifications.service.ts # 6 endpoint
│   ├── notifications.action.ts  # useNotifications, useUnreadCount, useMarkRead
│   └── notifications.type.ts    # Notification
│
├── support/
│   ├── support.service.ts       # 6 endpoint (tickets + replies)
│   ├── support.action.ts        # useTickets, useTicket, useSubmitTicket, useReplies
│   ├── support.type.ts          # Ticket, TicketReply
│   └── support.schema.ts        # ticketSchema, replySchema
│
├── offer/
│   ├── offer.service.ts         # 1 endpoint: POST /offers
│   ├── offer.action.ts          # useSubmitOffer
│   ├── offer.type.ts            # OfferRequest
│   └── offer.schema.ts          # offerSchema
│
├── catalog/
│   ├── catalog.service.ts       # 1 endpoint: POST /catalog-requests
│   ├── catalog.action.ts        # useRequestCatalog
│   ├── catalog.type.ts          # CatalogRequest
│   └── catalog.schema.ts        # catalogRequestSchema
│
└── storage/
    ├── storage.service.ts       # 2 endpoint (get file, upload)
    └── storage.type.ts          # UploadResponse
```

**Toplam: 20 modül, ~70 public endpoint**

---

## 3. Sayfa ↔ Route ↔ Modül ↔ Rendering Eşlemesi

```
SAYFA                          ROUTE                                MODÜLLER                              RENDER    SEO
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Ana Sayfa                      /[locale]                            slider, products, categories,          ISR 60s   ✅
                                                                    references, siteSettings
Ürün Listesi                   /[locale]/products                   products, categories, subcategories    SSR       ✅
Ürün Detay                     /[locale]/products/[slug]            products (detail, faqs, specs,         ISR 300s  ✅
                                                                    reviews), reviews, offer
Kategori Sayfası               /[locale]/categories/[slug]          categories, subcategories, products    ISR 300s  ✅
Hizmetler                      /[locale]/services                   services                               ISR 3600s ✅
Hizmet Detay                   /[locale]/services/[slug]            services (detail, images)              ISR 3600s ✅
Referanslar                    /[locale]/references                 references                             ISR 3600s ✅
SSS                            /[locale]/faqs                       faqs                                   ISR 3600s ✅
Kütüphane                      /[locale]/library                    library                                ISR 3600s ✅
Kütüphane Detay                /[locale]/library/[slug]             library (detail, images, files)        ISR 3600s ✅
İletişim                       /[locale]/contact                    contact, siteSettings                  SSG       ✅
Dinamik Sayfa                  /[locale]/pages/[slug]               customPages                            ISR 3600s ✅
Arama                          /[locale]/search                     products                               SSR       ✅
Giriş                          /[locale]/(auth)/login               auth                                   CSR       ❌
Kayıt                          /[locale]/(auth)/register            auth                                   CSR       ❌
Şifre Sıfırlama                /[locale]/(auth)/forgot-password     auth                                   CSR       ❌
Profil                         /[locale]/(account)/profile          profiles, auth                         CSR 🔒    ❌
Bildirimler                    /[locale]/(account)/notifications    notifications                          CSR 🔒    ❌
Destek Talepleri               /[locale]/(account)/support          support                                CSR 🔒    ❌
Destek Detay                   /[locale]/(account)/support/[id]     support (detail, replies)              CSR 🔒    ❌
Yeni Destek                    /[locale]/(account)/support/new      support                                CSR 🔒    ❌
Teklif İste                    /[locale]/offer                      offer, products                        CSR       ❌
Katalog İste                   /[locale]/catalog-request            catalog                                CSR       ❌
```

---

## 4. Yol Haritası (Sprint Bazlı)

---

### FAZ 0 — Altyapı (1 hafta)

**Hedef:** Boş ama çalışan iskelet. Auth, axios, i18n, providers hazır.

```
Gün 1-2: Proje Kurulumu
├── Next.js 16 (App Router) + TypeScript strict
├── Tailwind CSS 4 + Shadcn UI init
├── ESLint + Prettier + Husky pre-commit
├── Klasör yapısı oluştur (modules/, components/, lib/, providers/)
├── .env.local → NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL
└── Git repo

Gün 3-4: Core Kütüphaneler
├── lib/axios.ts
│   ├── baseURL: process.env.NEXT_PUBLIC_API_URL + '/api'
│   ├── Request interceptor: Authorization Bearer token
│   ├── Request interceptor: x-lang header (locale)
│   ├── Response interceptor: 401 → POST /auth/token/refresh → retry
│   └── Response interceptor: error normalize
│
├── lib/query-client.ts
│   └── TanStack Query v5 config (staleTime, gcTime, retry)
│
├── providers/
│   ├── QueryProvider.tsx (HydrationBoundary + ReactQueryDevtools)
│   ├── IntlProvider.tsx (next-intl)
│   └── AuthProvider.tsx (useUser + Zustand hydration)
│
├── middleware.ts
│   ├── i18n: locale detect → /tr, /en redirect
│   └── Auth guard: /account/* → /login redirect if no token

Gün 5: Temel Modüller
├── 🔌 auth module
│   ├── auth.service.ts    → POST /auth/token, /auth/signup, /auth/token/refresh,
│   │                         /auth/logout, GET /auth/user, PUT /auth/user,
│   │                         GET /auth/status, POST /auth/password-reset/*,
│   │                         POST /auth/google/*
│   ├── auth.action.ts     → useLogin, useSignup, useUser, useLogout,
│   │                         useRequestPasswordReset, useConfirmPasswordReset
│   ├── auth.type.ts       → User, LoginRequest, SignupRequest, AuthResponse
│   ├── auth.schema.ts     → loginSchema, signupSchema, passwordResetSchemas
│   └── auth.store.ts      → Zustand: user, isAuthenticated, setUser, clearUser
│
├── 🔌 site-settings module
│   ├── siteSettings.service.ts → GET /site_settings, /site_settings/{key},
│   │                              /site_settings/app-locales, /site_settings/default-locale
│   ├── siteSettings.action.ts  → useSiteSettings, useSiteSetting(key), useAppLocales
│   └── siteSettings.type.ts    → SiteSettings, AppLocale
│
├── 🔌 storage module (utility)
│   ├── storage.service.ts → GET /storage/{bucket}/{*}, POST /storage/{bucket}/upload
│   └── storage.type.ts    → UploadResponse
│
└── Boş layout: app/[locale]/layout.tsx → providers wrap + empty shell
```

**Çıktı:** `npm run dev` → boş sayfa, ama axios + auth + query + i18n çalışıyor.

---

### FAZ 1 — Vitrin: Layout + Ürün Kataloğu + SEO (2 hafta)

**Hedef:** Ziyaretçi deneyimi tamamlanmış, Google'da indexlenebilir ürün kataloğu.

```
Sprint 1.1: Layout Shell (Gün 1-4)
│
├── 🔌 menu-items module
│   ├── menuItems.service.ts → GET /menu_items, GET /menu_items/{id}
│   ├── menuItems.action.ts  → useMenuItems()
│   └── menuItems.type.ts    → MenuItem { id, title, url, parent_id, children, sort_order }
│
├── 🔌 footer-sections module
│   ├── footerSections.service.ts → GET /footer_sections, /footer_sections/{id},
│   │                                /footer_sections/by-slug/{slug}
│   ├── footerSections.action.ts  → useFooterSections()
│   └── footerSections.type.ts    → FooterSection
│
├── 🔌 slider module
│   ├── slider.service.ts → GET /sliders, GET /sliders/{idOrSlug}
│   ├── slider.action.ts  → useSliders()
│   └── slider.type.ts    → Slider { id, title, image_url, link_url, sort_order }
│
├── components/layout/
│   ├── Header.tsx
│   │   ├── Logo → siteSettings
│   │   ├── Navigation → menuItems (nested dropdown/mega menu)
│   │   ├── SearchBar → /search?q= link
│   │   ├── LocaleSwitcher → TR/EN toggle
│   │   └── UserMenu → login/register veya profil dropdown
│   ├── Footer.tsx → footerSections dinamik
│   ├── MobileNav.tsx → Sheet/Drawer
│   └── Breadcrumb.tsx
│
├── Ana Sayfa: /[locale]/page.tsx (ISR 60s)
│   ├── HeroSlider → slider module (Embla Carousel)
│   ├── FeaturedCategories → categories module
│   ├── FeaturedProducts → products module (is_featured=true)
│   ├── ReferencesStrip → references module (logo carousel)
│   └── NewsletterSignup → newsletter module
│
├── SEO Temeli
│   ├── app/sitemap.ts → products + categories + services + customPages slugs
│   ├── app/robots.ts
│   └── lib/seo.ts → generateMetadata helpers, JSON-LD builders
│
└── Loading & Error
    ├── loading.tsx → skeleton loaders
    ├── error.tsx → error boundary
    └── not-found.tsx → 404

Sprint 1.2: Kategori + Ürün Listesi (Gün 5-8)
│
├── 🔌 categories module
│   ├── categories.service.ts → GET /categories, /categories/{id}, /categories/by-slug/{slug}
│   ├── categories.action.ts  → useCategories(), useCategoryBySlug(slug)
│   └── categories.type.ts    → Category { id, name, slug, image_url, is_featured, sort_order }
│
├── 🔌 subcategories module
│   ├── subcategories.service.ts → GET /sub-categories, /sub-categories/{id},
│   │                               /sub-categories/by-slug/{slug}
│   ├── subcategories.action.ts  → useSubCategories(categoryId?), useSubCategoryBySlug(slug)
│   └── subcategories.type.ts    → SubCategory { id, name, slug, category_id, image_url }
│
├── 🔌 products module
│   ├── products.service.ts
│   │   ├── getAll(params)      → GET /products
│   │   ├── getBySlug(slug)     → GET /products/by-slug/{slug}
│   │   ├── getByIdOrSlug(v)    → GET /products/{idOrSlug}
│   │   ├── getById(id)         → GET /products/id/{id}
│   │   ├── getFaqs(params)     → GET /product_faqs
│   │   ├── getSpecs(params)    → GET /product_specs
│   │   └── getReviews(params)  → GET /product_reviews
│   ├── products.action.ts
│   │   ├── useProducts(params)       → paginated list
│   │   ├── useProduct(slug)          → Suspense detail
│   │   ├── useProductFaqs(productId) → ürün SSS
│   │   ├── useProductSpecs(productId)→ teknik özellikler
│   │   └── useProductReviews(productId) → yorumlar
│   └── products.type.ts
│       ├── Product { id, slug, name, description, images[], category, sub_category, ... }
│       ├── ProductImage { id, url, alt, sort_order }
│       ├── ProductFaq { id, question, answer }
│       ├── ProductSpec { id, key, value }
│       ├── ProductReview { id, author_name, rating, comment, created_at }
│       ├── ProductListParams { page, limit, sort, category_id, sub_category_id, search, ... }
│       └── ProductListResponse { data[], total, page, limit, total_pages }
│
├── Sayfalar
│   ├── /[locale]/products/page.tsx (SSR)
│   │   ├── ProductGrid → responsive card grid
│   │   ├── ProductCard → image, title, price (gated), category badge
│   │   ├── ProductFilters → sidebar: kategori, alt kategori, fiyat
│   │   ├── ProductSort → dropdown (fiyat, yeni, isim)
│   │   └── Pagination → URL-based (?page=2&category_id=xxx)
│   │
│   └── /[locale]/categories/[slug]/page.tsx (ISR 300s)
│       ├── generateMetadata → kategori SEO
│       ├── Kategori banner + açıklama
│       ├── Alt kategoriler (chip/tab)
│       └── Filtrelenmiş ürün grid

Sprint 1.3: Ürün Detay (Gün 9-11)
│
├── /[locale]/products/[slug]/page.tsx (ISR 300s)
│   ├── generateMetadata → ürün title, description, og:image
│   ├── JSON-LD → Product schema (name, sku, image, offers)
│   ├── ProductGallery → zoom, thumbnail navigation
│   ├── ProductInfo → title, sku, description, category breadcrumb
│   ├── ProductPrice
│   │   ├── Giriş yapmamış → "Fiyat için giriş yapın" CTA
│   │   └── Giriş yapmış → fiyat gösterimi
│   ├── ProductSpecs → GET /product_specs → key-value tablo
│   ├── ProductFaqs → GET /product_faqs → accordion
│   ├── ProductReviews → GET /product_reviews → yorum listesi
│   ├── OfferRequestButton → /offer?product={slug} link
│   └── RelatedProducts → aynı kategoriden ürünler
│
└── Arama Sayfası: /[locale]/search/page.tsx (SSR)
    ├── SearchInput → debounced, URL-based (?q=)
    ├── SearchResults → products.getAll({ search: q })
    └── EmptyState → sonuç bulunamadı
```

**Çıktı:** Tam SEO-ready ürün kataloğu. Ziyaretçi gezebilir, Google indexleyebilir.

---

### FAZ 2 — İçerik Sayfaları + İletişim (1 hafta)

**Hedef:** Site "dolu" görünsün — hizmetler, referanslar, SSS, iletişim, dinamik sayfalar.

```
Sprint 2.1: İçerik Modülleri (Gün 1-3)
│
├── 🔌 services module
│   ├── services.service.ts → GET /services, /services/{id}, /services/by-slug/{slug},
│   │                          /services/{id}/images
│   ├── services.action.ts  → useServices(), useServiceBySlug(slug), useServiceImages(id)
│   └── services.type.ts    → Service { id, name, slug, description, images[] }
│
├── 🔌 references module
│   ├── references.service.ts → GET /references, /references/{id}, /references/by-slug/{slug}
│   ├── references.action.ts  → useReferences()
│   └── references.type.ts    → Reference { id, name, slug, logo_url, website_url }
│
├── 🔌 faqs module
│   ├── faqs.service.ts → GET /faqs, /faqs/{id}, /faqs/by-slug/{slug}
│   ├── faqs.action.ts  → useFaqs()
│   └── faqs.type.ts    → Faq { id, question, answer, slug, category, sort_order }
│
├── 🔌 custom-pages module
│   ├── customPages.service.ts → GET /custom_pages, /custom_pages/{id},
│   │                             /custom_pages/by-slug/{slug}
│   ├── customPages.action.ts  → useCustomPages(), useCustomPageBySlug(slug)
│   └── customPages.type.ts    → CustomPage { id, title, slug, content, meta_title, meta_description }
│
├── 🔌 library module
│   ├── library.service.ts → GET /library, /library/{id}, /library/by-slug/{slug},
│   │                          /library/{id}/images, /library/{id}/files
│   ├── library.action.ts  → useLibrary(), useLibraryItem(slug), useLibraryFiles(id)
│   └── library.type.ts    → LibraryItem, LibraryFile { id, title, file_url, file_type, size }
│
├── Sayfalar
│   ├── /[locale]/services/page.tsx (ISR 3600s) → hizmet kartları grid
│   ├── /[locale]/services/[slug]/page.tsx (ISR 3600s) → hizmet detay + gallery
│   ├── /[locale]/references/page.tsx (ISR 3600s) → referans logo grid
│   ├── /[locale]/faqs/page.tsx (ISR 3600s)
│   │   ├── Accordion SSS listesi
│   │   └── JSON-LD: FAQPage schema
│   ├── /[locale]/library/page.tsx (ISR 3600s) → döküman/katalog grid
│   ├── /[locale]/library/[slug]/page.tsx (ISR 3600s) → detay + dosya indirme
│   └── /[locale]/pages/[slug]/page.tsx (ISR 3600s)
│       ├── generateMetadata → customPage SEO
│       └── Rich HTML content renderer

Sprint 2.2: İletişim + Newsletter (Gün 4-5)
│
├── 🔌 contact module
│   ├── contact.service.ts  → POST /contacts
│   ├── contact.action.ts   → useSubmitContact()
│   ├── contact.type.ts     → ContactFormData { name, email, phone, subject, message }
│   └── contact.schema.ts   → contactFormSchema (Zod)
│
├── 🔌 newsletter module
│   ├── newsletter.service.ts → POST /newsletter/subscribe, /newsletter/unsubscribe
│   ├── newsletter.action.ts  → useSubscribe(), useUnsubscribe()
│   └── newsletter.schema.ts  → newsletterSchema: z.object({ email: z.string().email() })
│
├── Sayfalar + Componentler
│   ├── /[locale]/contact/page.tsx (SSG)
│   │   ├── ContactForm (react-hook-form + contactFormSchema)
│   │   ├── CompanyInfo → siteSettings'ten adres, tel, email
│   │   └── JSON-LD: LocalBusiness schema
│   └── components/common/NewsletterForm.tsx → footer'da + ana sayfada kullanılır
```

**Çıktı:** Tüm public içerik sayfaları hazır. Site tam dolu.

---

### FAZ 3 — Auth Sayfaları + Kullanıcı Alanı (1.5 hafta)

**Hedef:** Giriş/kayıt, profil, teklif/katalog isteme, yorum yazma, destek.

```
Sprint 3.1: Auth + Profil (Gün 1-4)
│
├── Auth Sayfaları (auth module Faz 0'da hazır)
│   ├── /[locale]/(auth)/login/page.tsx
│   │   └── LoginForm → POST /auth/token
│   │       ├── Email + Password
│   │       ├── "Google ile Giriş" → POST /auth/google/start
│   │       └── "Şifremi Unuttum" → /forgot-password link
│   ├── /[locale]/(auth)/register/page.tsx
│   │   └── SignupForm → POST /auth/signup
│   │       ├── Ad, Soyad, Email, Şifre
│   │       ├── Telefon, Firma Adı (B2B)
│   │       └── Google ile Kayıt
│   └── /[locale]/(auth)/forgot-password/page.tsx
│       ├── Step 1: Email gir → POST /auth/password-reset/request
│       └── Step 2: Token + Yeni şifre → POST /auth/password-reset/confirm
│
├── 🔌 profiles module
│   ├── profiles.service.ts  → GET /profiles/me, PUT /profiles/me
│   ├── profiles.action.ts   → useProfile(), useUpdateProfile()
│   ├── profiles.type.ts     → Profile { company_name, tax_number, phone, address, ... }
│   └── profiles.schema.ts   → profileSchema (Zod)
│
├── Hesap Sayfaları (AuthGuard: 🔒)
│   ├── /[locale]/(account)/layout.tsx → sidebar nav (Profil, Bildirimler, Destek)
│   └── /[locale]/(account)/profile/page.tsx
│       ├── Profil bilgileri → GET /profiles/me
│       ├── Profil düzenleme → PUT /profiles/me
│       ├── Kullanıcı bilgileri → PUT /auth/user
│       └── Şifre değiştirme

Sprint 3.2: Teklif + Katalog + Yorum + Destek + Bildirimler (Gün 5-8)
│
├── 🔌 offer module
│   ├── offer.service.ts  → POST /offers
│   ├── offer.action.ts   → useSubmitOffer()
│   ├── offer.type.ts     → OfferRequest { name, email, phone, product_id?, message, quantity? }
│   └── offer.schema.ts   → offerSchema (Zod)
│
├── 🔌 catalog module
│   ├── catalog.service.ts  → POST /catalog-requests
│   ├── catalog.action.ts   → useRequestCatalog()
│   ├── catalog.type.ts     → CatalogRequest { name, email, phone, company?, message? }
│   └── catalog.schema.ts   → catalogRequestSchema (Zod)
│
├── 🔌 reviews module
│   ├── reviews.service.ts  → GET /reviews, POST /reviews, GET /reviews/{id},
│   │                          POST /reviews/{id}/reactions
│   ├── reviews.action.ts   → useReviews(), useSubmitReview(), useReaction(id)
│   ├── reviews.type.ts     → Review { id, product_id, rating, comment, author_name, reactions }
│   └── reviews.schema.ts   → reviewSchema: z.object({ rating: z.number().min(1).max(5), comment })
│
├── 🔌 support module
│   ├── support.service.ts
│   │   ├── getTickets()           → GET /support_tickets
│   │   ├── getTicket(id)          → GET /support_tickets/{id}
│   │   ├── createTicket(data)     → POST /support_tickets
│   │   ├── updateTicket(id, data) → PATCH /support_tickets/{id}
│   │   ├── getReplies(ticketId)   → GET /ticket_replies/by-ticket/{ticketId}
│   │   └── addReply(data)         → POST /ticket_replies
│   ├── support.action.ts → useTickets, useTicket, useCreateTicket, useReplies, useAddReply
│   ├── support.type.ts   → Ticket { id, subject, message, status, created_at },
│   │                        TicketReply { id, ticket_id, message, is_admin, created_at }
│   └── support.schema.ts → ticketSchema, replySchema
│
├── 🔌 notifications module
│   ├── notifications.service.ts
│   │   ├── getAll()          → GET /notifications
│   │   ├── getUnreadCount()  → GET /notifications/unread-count
│   │   ├── markRead(id)      → PATCH /notifications/{id}
│   │   ├── markAllRead()     → POST /notifications/mark-all-read
│   │   └── delete(id)        → DELETE /notifications/{id}
│   ├── notifications.action.ts → useNotifications, useUnreadCount, useMarkRead, useMarkAllRead
│   └── notifications.type.ts  → Notification { id, title, body, is_read, created_at }
│
├── Sayfalar
│   ├── /[locale]/offer/page.tsx → teklif formu (product query param opsiyonel)
│   ├── /[locale]/catalog-request/page.tsx → katalog isteği formu
│   ├── /[locale]/(account)/notifications/page.tsx → bildirim listesi 🔒
│   ├── /[locale]/(account)/support/page.tsx → destek talepleri listesi 🔒
│   ├── /[locale]/(account)/support/new/page.tsx → yeni destek talebi 🔒
│   └── /[locale]/(account)/support/[id]/page.tsx → talep detay + mesajlaşma 🔒
│
└── Componentler
    ├── components/layout/NotificationBell.tsx → Header'a: unread-count badge
    └── components/product/ReviewForm.tsx → ürün detayda yorum yazma (🔒)
```

**Çıktı:** Tam kullanıcı deneyimi — auth, profil, teklif, yorum, destek, bildirimler.

---

### FAZ 4 — i18n + Optimizasyon + Deploy (1 hafta)

**Hedef:** Çift dil tamamlama, performance tuning, production deploy.

```
Sprint 4.1: i18n Tamamlama (Gün 1-2)
├── Tüm locale key'leri → public/locales/tr.json + en.json
├── Tüm service'lere language param eklenmesi
├── hreflang meta tags tüm sayfalarda
├── LocaleSwitcher component → cookie + redirect
├── Sitemap'te her dil için ayrı URL'ler
└── Default locale redirect (/ → /tr)

Sprint 4.2: Performance (Gün 3-4)
├── Lighthouse audit → LCP < 2.5s, CLS < 0.1, INP < 200ms
├── Bundle analyzer → @next/bundle-analyzer
├── Dynamic imports: ProductGallery, ReviewForm, Maps
├── next/image audit: priority hero, lazy diğerleri, sizes prop
├── next/font: self-hosted font, display swap, size-adjust
├── TanStack Query tuning: staleTime, gcTime per-module
├── Prefetch: Link prefetch, router.prefetch on hover
└── ISR revalidation stratejisi son kontrol

Sprint 4.3: Production Deploy (Gün 5)
├── Sentry error tracking entegrasyonu
├── Google Analytics 4 / Plausible
├── Google Search Console → sitemap submit
├── Cookie consent banner
├── Security headers finalize (CSP, HSTS, X-Frame)
├── CI/CD pipeline (GitHub Actions → Vercel / Docker)
├── Environment configs (staging, production)
└── Final QA: cross-browser + mobile test
```

---

## 5. Özet Timeline

```
FAZ 0: Altyapı              ██░░░░░░░░░░░░  1 hafta
FAZ 1: Vitrin + Ürünler     ░░████░░░░░░░░  2 hafta
FAZ 2: İçerik + İletişim    ░░░░░░██░░░░░░  1 hafta
FAZ 3: Auth + Kullanıcı     ░░░░░░░░███░░░  1.5 hafta
FAZ 4: i18n + Deploy        ░░░░░░░░░░░██░  1 hafta
─────────────────────────────────────────
Toplam:                                      ~6.5 hafta
```

---

## 6. Sonraki Adım

Backend'den bir modülün gerçek response'unu paylaş (örneğin `GET /api/products` veya `GET /api/categories` çağrısının döndüğü JSON) → type dosyalarını kesinleştirelim ve Faz 0'a başlayalım.
