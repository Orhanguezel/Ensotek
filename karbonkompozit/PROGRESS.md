# MOE Kompozit — İlerleme Takibi

---

## FAZA 1 — BACKEND

### 1.1 Schema Güncellemeleri
- [x] `products/schema.ts` — item_type enum'a 'kompozit' eklendi
- [x] `products/validation.ts` — Zod enum güncellendi
- [x] `products/controller.ts` — normalizeItemType güncellendi
- [x] `products/admin.controller.ts` — normalizeItemType güncellendi
- [x] Yerel DB'de `products.item_type` enum'u `kompozit` degerini alacak sekilde hizalandi
- [x] Resmi SQL patch eklendi (`299_kompozit_schema_patch.sql`)
- [ ] DB Migration: item_type enum push

### 1.2 Gallery Modülü
- [x] `gallery/schema.ts` — 4 tablo (galleries, galleryI18n, galleryImages, galleryImageI18n)
- [x] `gallery/validation.ts` — Zod schemas (create, update, image, bulk)
- [x] `gallery/repository.ts` — list, getBySlug, getById, getImages
- [x] `gallery/controller.ts` — Public endpoints
- [x] `gallery/admin.controller.ts` — Admin CRUD + images + bulk + reorder
- [x] `gallery/router.ts` — Public routes
- [x] `gallery/admin.routes.ts` — Admin routes (12 endpoint)
- [x] Yerel DB'de `galleries`, `gallery_i18n`, `gallery_images`, `gallery_image_i18n` tablolari olusturuldu
- [x] Resmi SQL patch eklendi (`299_kompozit_schema_patch.sql`)
- [ ] DB Migration: gallery tabloları push

### 1.3 Offer Genişletme
- [x] `offer/schema.ts` — source alanı + index
- [x] `offer/validation.ts` — source eklendi (public + admin + list)
- [x] `offer/repository.ts` — source filtre + create
- [x] `offer/controller.ts` — source passthrough
- [x] `offer/admin.controller.ts` — list/create/update source desteği
- [ ] DB Migration: source alanı push

### 1.4 Blog Entegrasyonu
- [ ] module_key: 'kompozit' kategorileri
- [x] `kompozit_blog` seed dosyasi eklendi (`304_kompozit_blog.seed.sql`)
- [x] Kurumsal ve yasal custom page seed dosyasi eklendi (`305_kompozit_pages.seed.sql`)
- [x] `305_kompozit_pages.seed.sql` JSON-content formatina ve slug cakisma duzeltmesine gore veritabanina uygulandi
- [x] Ornek kompozit urun seed dosyasi eklendi ve veritabanina uygulandi (`306_kompozit_products.seed.sql`)
- [x] Ornek kompozit galeri seed dosyasi eklendi ve veritabanina uygulandi (`307_kompozit_gallery.seed.sql`)
- [x] Kompozit schema patch sirasi seed zincirine uygun olacak sekilde `299_kompozit_schema_patch.sql` olarak one alindi
- [x] Backend'e `db:seed:kompozit` ve `db:seed:kompozit:fresh` scriptleri eklendi
- [x] Smoke test sirasinda eksik kompozit kategori verisi goruldu; `300_kompozit_categories.seed.sql` uygulandiktan sonra kompozit product create akisi dogrulandi
- [x] Blog filtreleme desteği için admin custom page module akışı güçlendirildi

### 1.5 Route Kaydı
- [x] `app.ts` — registerGallery (public)
- [x] `app.ts` — registerGalleryAdmin (admin)

### 1.6 Kod Temizliği
- [x] `_shared/_shared.ts` — toNum() eklendi
- [x] `products/helpers.shared.ts` — normalizeProduct, normalizeItemType extracted
- [x] `products/controller.ts` — shared import'lar
- [x] `products/admin.controller.ts` — shared import'lar
- [x] `gallery/validation.ts` — emptyToNull, boolLike shared'dan
- [x] `gallery/admin.controller.ts` — toBool shared'dan
- [x] `offer/validation.ts` — boolLike shared'dan
- [x] `customPages/admin.controller.ts` create akisi, live DB default eksiginde de `images` / `storage_image_ids` alanlarini guvenli sekilde dolduracak hale getirildi
- [x] `customPages/admin.controller.ts` ve `repository.ts` delete semantigi duzeltildi; silme basarili iken 404 donen edge-case kapatildi
- [x] Tek komutla tekrar kosulabilir admin smoke script'i eklendi (`backend/scripts/smoke-kompozit-admin.mjs`)

---

## FAZA 2 — ADMIN PANEL

### 2.1 Sidebar
- [x] Sidebar'a MOE Kompozit grubu ekle
- [x] kompozit_products, kompozit_categories, kompozit_gallery
- [x] kompozit_offers, kompozit_blog, kompozit_settings
- [x] kompozit_blog / kurumsal / yasal sayfalar icin module filtreli hizli linkler

### 2.2 i18n Çevirileri
- [x] tr.json — MOE sidebar çevirileri
- [x] en.json — MOE sidebar çevirileri
- [x] de.json — MOE sidebar çevirileri

### 2.3 Gallery Admin Sayfaları
- [x] Liste sayfası (page.tsx)
- [x] Yeni galeri (new/page.tsx → [id]/page.tsx id=new)
- [x] Düzenleme ([id]/page.tsx)
- [x] admin-gallery-client.tsx (liste + filtre + CRUD)
- [x] admin-gallery-detail-client.tsx (form + JSON tab)
- [x] RTK Query endpoints (gallery_admin.endpoints.ts)
- [x] Types (gallery.types.ts)
- [x] Tags (AdminGalleries, AdminGalleryImages)
- [x] i18n gallery çevirileri (tr, en, de)
- [x] gallery-images-tab.tsx (sürükle-bırak @dnd-kit, edit alt/caption, delete, reorder)

### 2.4 Mevcut Sayfa Filtreleme
- [x] Products → ?type=kompozit (ProductItemType'a 'kompozit' eklendi)
- [x] Categories → ?module=kompozit (page.tsx → searchParams → initialModuleKey prop)
- [x] Offer → ?source=kompozit (OfferListQuery'e source, page.tsx → initialSource prop)
- [x] Custom Pages → ?module=kompozit_blog / kompozit_about / kompozit_legal prefill ve filtre desteği
- [x] Admin panel prod build'i gecti; `/admin/custompage?module=kompozit_blog` ve `/admin/custompage/new?module=kompozit_about` route'lari server render seviyesinde `initialModuleKey` ile dogrulandi
- [x] Gercek admin token ile custom page, kompozit product, gallery ve gallery image create/update/delete smoke turu 8087 uzerindeki izole backend instance'da basarili tamamlandi
- [x] Ayni CRUD dogrulamasi scriptlestirildi ve 8086 uzerindeki calisan backend'e karsi `test:smoke:kompozit-admin` ile tekrar basarili kosuldu
- [x] `karbonkompozit/scripts/check-admin-content-flow.mjs` eklendi ve `test:smoke:admin-content` script'i tanimlandi
- [x] Frontend admin-content smoke ile gecici admin blog/product/gallery kayitlarinin `/tr/blog/[slug]`, `/tr/products/[slug]` ve `/tr/gallery/[slug]` route'larinda render edildigi dogrulandi
- [x] Seeded admin iceriginin `/tr/about` ve `/tr/legal/privacy` route'larina aktigi dogrulandi
- [x] Smoke sirasinda ortaya cikan frontend/API kontrat bug'lari kapatildi:
  - custom page/blog endpoint'leri `/custom-pages` yerine backend route'u olan `/custom_pages` ile hizalandi
  - kompozit product detail fetch'lerine `item_type=kompozit` eklendi
  - gallery detail fetch'i `/galleries/by-slug/:slug` yerine `/galleries/:slug` ile hizalandi ve embedded `images` payload'i normalize edildi
  - sitemap generator once locale-korsan calisiyor ve EN locale icin TR slug uretiyordu; locale-bazli fetch ile duzeltildi
- [x] `test:smoke:admin-content` TR + EN route kapsamiyla genisletildi
- [x] `npm run build` + `SMOKE_API_BASE_URL=http://127.0.0.1:8086/api npm run test:smoke:admin-content` basarili calisti (tr + en)
- [x] Theme core'da dark mode'u bastiran selector specificity hatasi kapatildi (`:root[data-theme-preset='default']` kaldirildi)
- [x] Theme utility katmani genisletildi: `surface-dark-link`, `surface-dark-border`, `surface-glass-hover`, `surface-hero-glow-*`, `fab-*`
- [x] Homepage hero, footer ve floating action button'lar semantic token utility'lerine tasindi
- [x] `test:theme` icine theme core regression guard eklendi:
  - high-specificity light preset selector yasaklandi
  - dark root selector ve dark-link utility zorunlu hale getirildi
- [x] `npm run test:theme` ve `npm run build` basarili calisti
- [x] Browser seviyesinde tema toggle dogrulandi: `3020` uzerindeki dev server'da `data-theme-mode`, `localStorage(theme_mode)` ve computed body renkleri light -> dark gecisinde degisiyor
- [x] Standalone modda gordugumuz "tema calismiyor" semptomunun asil nedeni belirlendi:
  - standalone server asset hazirlama olmadan acildiginda `_next/static` dosyalari `text/plain/404` donuyor
  - client hydration calismadigi icin toggle click'i etkisiz gorunuyor
- [x] Bu akisi guvenli calistirmak icin `start:standalone` script'i eklendi

### 2.5 Site Settings Brand
- [x] Admin ?brand=kompozit filtreleme (page.tsx → brand prop → brandPrefix → ListPanel prefix)
- [ ] kompozit__seo kayıtları (→ Faza 5 seed data)
- [ ] kompozit__logo kayıtları (→ Faza 5 seed data)
- [ ] kompozit__contact_info kayıtları (→ Faza 5 seed data)
- [ ] kompozit__branding kayıtları (→ Faza 5 seed data)

---

## FAZA 3 — SHARED PACKAGE

### 3.1 Tipler
- [x] gallery.type.ts — Gallery, GalleryImage, GalleryListParams
- [x] types/index.ts — gallery export
- [x] product.type.ts — item_type'a 'kompozit' eklendi

### 3.2 Service Fonksiyonları
- [x] gallery.service.ts — getGalleries, getGalleryBySlug
- [x] services/index.ts — gallery export

### 3.3 API Endpoints
- [x] api-endpoints.ts — GALLERIES eklendi

---

## FAZA 4 — FRONTEND

### 4.1 Proje Scaffold
- [x] package.json (Next.js 16, React 19, @ensotek/core workspace)
- [x] next.config.ts (standalone, next-intl, image optimization)
- [x] tsconfig.json (strict, ES2022, @/* path alias)
- [x] postcss.config.mjs (Tailwind v4)
- [x] .env.local / .env.example

### 4.2 i18n Dosyaları
- [x] public/locales/tr.json (nav, footer, common, home, products, gallery, blog, contact, offer, about, legal, seo)
- [x] public/locales/en.json (tam çeviri)

### 4.3 Sayfa Yapısı
- [x] layout.tsx (root — minimal, globals.css import)
- [x] [locale]/layout.tsx (NextIntlClientProvider, Header, Footer, metadata, fonts)
- [x] [locale]/page.tsx — Ana Sayfa (hero, whyUs, products, gallery, CTA, newsletter)
- [x] [locale]/page.tsx — hero copy refinement + blog preview + fallback content support
- [x] [locale]/about/page.tsx (custom page fetch)
- [x] [locale]/products/page.tsx (kategori filtre, grid)
- [x] [locale]/products/[slug]/page.tsx (detay, JSON-LD, teklif al CTA)
- [x] [locale]/blog/page.tsx (custom-pages module_key=kompozit_blog)
- [x] [locale]/blog/[slug]/page.tsx (article JSON-LD, prose)
- [x] [locale]/gallery/page.tsx (galeri grid)
- [x] [locale]/gallery/[slug]/page.tsx (masonry layout, görseller)
- [x] [locale]/contact/page.tsx (form + bilgi)
- [x] [locale]/offer/page.tsx (form, preselectedProduct query param)
- [x] [locale]/legal/[slug]/page.tsx (custom page)
- [x] robots.ts
- [x] sitemap.ts (products, galleries, static routes × locales)

### 4.4 Feature Modülleri
- [x] features/products/ (service + types)
- [x] features/categories/ (service + types)
- [x] features/gallery/ (service + types, getImages)
- [x] features/blog/ (custom-pages service)
- [x] features/offer/ (create, source=kompozit)
- [x] features/contact/ (send, source=kompozit)
- [x] features/site-settings/ (getByKey, prefix=kompozit__)
- [x] features/menu-items/ (re-export from i18n/server)
- [x] features/footer-sections/ (re-export from i18n/server)
- [x] features/newsletter/ (subscribe, source=kompozit)
- [x] features/slider/ (re-export from i18n/server)
- [x] features/storage/ (upload)

### 4.5 Components
- [x] layout/Header.tsx (sticky, desktop nav + mobile drawer, logo, CTA)
- [x] layout/Footer.tsx (dynamic sections, brand column, legal links)
- [x] layout/LanguageSwitcher.tsx (dropdown, locale swap)
- [x] layout/ScrollToTop.tsx (scroll-triggered, smooth)
- [x] sections/ContactForm.tsx (client, toast, source=kompozit)
- [x] sections/OfferForm.tsx (client, preselectedProduct, toast)
- [ ] Ek UI componentleri (gerektiğinde eklenecek)

### 4.6 Stil Sistemi
- [x] globals.css (design tokens: carbon palette, brand accent, font vars, section-py, focus-visible, reduced-motion)
- [x] next/font config (Inter + Syne, latin-ext)
- [x] Tailwind v4 CSS-first config
- [x] semantic token contract (neutral, primary, accent, surface, status)
- [x] dark/light mode altyapisi (`data-theme-mode`, theme toggle, persisted mode)
- [x] dark surface utility contract (`surface-dark-heading`, `surface-dark-text`, `surface-dark-panel`)
- [x] shared surface utility contract (`surface-card`, `surface-card-muted`, `surface-glass-dark`)
- [x] dark shell / overlay / brand CTA utility contract (`surface-dark-shell`, `media-overlay`, `surface-brand-cta`)
- [x] state utility contract (`chip-brand`, `btn-contrast`)
- [x] hardcoded `bg-white` surface temizligi + theme smoke kuralı
- [x] admin-panel inspired theme core (`src/lib/preferences/theme.ts`, `theme-utils.ts`, `src/scripts/theme-boot.tsx`)
- [x] root `data-theme-preset="default"` contract + boot/apply utility senkronizasyonu
- [x] home hero, gallery overlays ve blog CTA bu ortak utility contract'ina tasindi
- [x] reusable pattern katalogu kuruldu (`SectionHeader`, `FeatureCard`, `MediaOverlayCard`, `DarkCtaPanel`, `ListingCard`, `BrandCtaPanel`, `LinkListPanel`)
- [x] products/blog listing ve detail CTA alanlari bu ortak pattern kataloguna tasindi
- [x] about/contact/offer/legal/not-found tarafindaki tekil bloklar da ortak pattern kataloguna tasindi
- [x] build sonrasi kritik route'lari kontrol eden `test:release` HTML smoke scripti eklendi

### 4.7 SEO
- [x] seo/helpers.ts (siteUrlBase, absoluteUrl, localizedPath, normLocaleShort)
- [x] seo/jsonld.ts (graph, org, website, product, article, breadcrumb)
- [x] seo/JsonLd.tsx (script component)
- [x] seo/index.ts (barrel exports)
- [x] generateMetadata in layout + every page
- [x] image sitemap coverage (product, gallery, blog detail image URLs)
- [x] 404 / soft-404 monitoring endpoint and beacon flow
- [x] `jsonld.ts` genisletildi (`LocalBusiness`, `ItemList`)
- [x] products/blog listing sayfalarinda `ItemList`, contact sayfasinda `LocalBusiness` schema kullanildi
- [x] metadata helper CTR odakli title/description fallback standardina kavustu
- [x] home/about/contact icin organization schema, blog detail icin publisher baglantisi guclendirildi
- [x] gallery listing/detail tarafinda metadata copy daha spesifik hale getirildi, detail sayfada `ImageGallery` / `ImageObject` schema eklendi
- [x] gallery listing tarafinda `CollectionPage` schema ve detail metadata intent copy’si eklendi
- [x] crawl script local/prod origin farkini normalize edecek sekilde guncellendi; latest crawl raporu `Broken: 0`, `Orphans: 0`
- [x] legal privacy/terms icin fallback sayfa icerigi eklendi, footer kaynakli 404 zinciri kapatildi
- [x] Lighthouse CI standalone server uzerine tasindi; devtools chunk’larinin audit sonucunu bozmasi engellendi
- [x] `scripts/prepare-standalone.mjs` eklendi; standalone build artik `.next/static` ve `public` asset'leriyle hazirlaniyor
- [x] Header/footer/language/theme controls touch-target standardina gore buyutuldu; accessibility `target-size` audit'i icin UI normalize edildi
- [x] `/api/vitals` endpoint'i eklendi; production Web Vitals beacon'i 404 vermiyor ve Lighthouse console-error audit'i kapanmaya hazir
- [x] Brand token kontrasti koyulastirildi; CTA ve accent linkler Lighthouse `color-contrast` audit'inde tam puana cikti

### 4.8 i18n Config
- [x] i18n/routing.ts (next-intl defineRouting, localePrefix: as-needed)
- [x] i18n/request.ts (getRequestConfig)
- [x] i18n/locales/index.ts (LOCALE_MESSAGES, FALLBACK_LOCALE=tr)
- [x] i18n/locale-settings.ts (getRuntimeLocaleSettings)
- [x] i18n/server.ts (fetchSetting, fetchSliders, fetchMenuItems, fetchFooterSections)

### 4.9 Lib / Utility
- [x] lib/utils.ts (cn, API_BASE_URL, SITE_URL)
- [x] lib/axios.ts (interceptors, locale header, error normalize)
- [x] lib/query-client.ts (TanStack Query v5, queryKeys factory)
- [x] lib/api.ts (type exports)

### 4.10 Rendering Stratejisi
- [x] output: standalone (Docker-ready)
- [x] ISR via revalidate: 300 (products, galleries), 3600 (settings, legal)
- [x] Image optimization (avif/webp, deviceSizes, priority hero)
- [ ] Suspense streaming (gerektiğinde eklenecek)
- [ ] lighthouserc.js (Faza 6)

---

## FAZA 5 — DEVOPS

### 5.1 Monorepo
- [x] Root workspaces güncelle (karbonkompozit eklendi)
- [x] dev:kompozit, build:kompozit scripts

### 5.2 Deployment
- [x] Nginx SSL + domain
- [x] "Yapım aşamasında" sayfası
- [ ] next build → standalone
- [ ] PM2 process (port 3020)
- [ ] Nginx proxy güncelle

### 5.3 Seed Data
- [x] 7 ürün kategorisi (300_kompozit_categories.seed.sql — TR/EN i18n, module_key=kompozit)
- [x] Site settings (301_kompozit_site_settings.seed.sql — seo, logo, contact_info, branding)
- [x] Menu items (302_kompozit_menu_items.seed.sql — header 7 root + 5 submenu, footer 12 items, site_id=kompozit)
- [x] Footer sections (303_kompozit_footer_sections.seed.sql — 3 section: hızlı erişim, yasal, sosyal)
- [x] Blog içerikleri (304_kompozit_blog.seed.sql — TR/EN kompozit blog yazıları)
- [x] Kurumsal + yasal sayfalar (305_kompozit_pages.seed.sql — about, privacy, terms, kvkk, cookies)

### 5.4 Backend API — site_id Filtering
- [x] menuItems/validation.ts — site_id query param eklendi
- [x] menuItems/controller.ts — site_id filtre eklendi
- [x] footerSections/validation.ts — site_id query param eklendi
- [x] footerSections/repository.ts — site_id filtre eklendi
- [x] Frontend server.ts — site_id=kompozit param eklendi (menu-items + footer-sections)

---

## FAZA 6 — PERFORMANCE

### 6.1 Bundle
- [x] Dynamic imports (ScrollToTop, WebVitals — ssr: false, lazy loaded)
- [x] optimizePackageImports (lucide-react, sonner, @tanstack/react-query)
- [x] server-only ayrımı (i18n/server.ts)

### 6.2 Image
- [x] OptimizedImage component (blur placeholder, error fallback, fade-in transition)
- [x] Priority stratejisi (hero logo priority, product detail priority, rest lazy)
- [x] Blur placeholder (inline SVG data URL — zero network cost)
- [x] Tüm sayfalarda Image → OptimizedImage migration (home, products, gallery, detail pages)
- [ ] Cloudinary transforms (admin panel'den görsel yüklendikçe)

### 6.3 CSS & Font
- [x] Tailwind v4 only (no Bootstrap, no extra CSS framework)
- [x] next/font self-host (Inter + Syne, display: swap, latin-ext)
- [x] reduced-motion (globals.css prefers-reduced-motion)

### 6.4 React Runtime
- [x] Newsletter form client component (was static, now functional with API call)
- [ ] Virtual scroll (gerektiğinde — ürün sayısı arttığında)

### 6.5 Third-Party
- [ ] GA afterInteractive (henüz GA kurulmadı)
- [ ] GTM lazyOnload (henüz GTM kurulmadı)
- [ ] Maps dynamic import (contact sayfasına maps eklendiğinde)

### 6.6 Monitoring
- [x] lighthouserc.js (3 URL, desktop preset, CWV assertions)
- [x] WebVitals component (sendBeacon, dev console logging)
- [x] Next dev hydration mismatch tanisi tamamlandi; sorun source degil stale `.next/dev` bundle farkiydi. Dev cache temizlenip fresh `next dev` ile header/theme hydration tekrar dogrulandi
- [x] Theme token contract'i yeniden ayrildi; light/dark semantic degiskenleri base palette'ten ayrilarak scroll-only dark bug'i kapatildi
- [x] Theme audit turu baslatildi; rich-content `prose` katmani token-aware hale getirildi, dark panel shadow'lari utility'ye tasindi ve header CTA raw `text-white` kullanimindan cikarildi
- [x] Theme audit Phase 2 tamamlandi; contact info/map/form alanlari ortak `surface-card` contract'ina tasindi ve listing/form/layout tarafinda bariz raw color sapmasi kalmadi
- [x] Icerik kalite turu baslatildi; TR/EN locale copy setleri homepage, hakkimizda, iletisim ve teklif sayfalari icin daha tutarli B2B/teknik tonla rafine edildi
- [x] Fallback icerik turu tamamlandi; urun ve blog ornek setleri guclendirildi, galeri icin yeni fallback seti eklendi ve homepage/gallery listing bu fallback'leri kullanacak sekilde guncellendi
- [x] Metadata final turu tamamlandi; landing ve detail sayfalarin title/description copy'leri yeni B2B/teknik tonla hizalandi
- [x] SEO final smoke tamamlandi; `test:seo` ve `test:release` gecti, Lighthouse representative run'larda `/tr`, `/en`, `/tr/products`, `/tr/blog`, `/tr/gallery`, `/tr/contact` icin SEO/Accessibility/Best Practices skorlari `1.00`
- [x] `audit:crawl` standalone production server uzerine alindi; timeout sorunu kapandi ve son rapor `Broken: 0`, `Orphans: 0` verdi
- [x] Kompozit blog detail sayfalarina kapak gorseli, kalici begeni sayaci ve yorum formu/listeleme akisi eklendi
- [x] Blog yorumlari mevcut `reviews` modulu uzerinden `target_type=custom_page` ile baglandi; begeni icin `content_reaction_totals` tablosu ve public endpoint'ler eklendi
- [x] `304_kompozit_blog.seed.sql` placeholder blog gorselleri ve Turkce karakterli iceriklerle guncellendi; `308_kompozit_content_reactions.sql` yerel DB'ye uygulandi
- [x] Blog yorum gonderiminde Google reCAPTCHA dogrulamasi aktif edildi; frontend explicit widget ile `captcha_token` gonderiyor, backend public `reviews` create akisinda verify ediyor
- [x] Blog detail icine sosyal medya paylasim componenti eklendi; Facebook, X/Twitter, LinkedIn, WhatsApp ve link kopyalama aksiyonlari blog icerigiyle birlikte render ediliyor
- [x] Admin panelde kompozit blog yorum moderasyonu icin sidebar kisayolu ve `target_type=custom_page` filtre/prefill akisi baglandi
- [x] Kompozit `site_settings` namespacing duzeltildi; public `GET /site_settings/:key` artik `prefix=kompozit__` ile `kompozit__seo`, `kompozit__site_logo` vb. key'leri dogru cozuluyor
- [x] Kompozit locale akisi global `default_locale` bagimliligindan cikarildi; frontend fallback locale artik kendi proje katmaninda belirleniyor
- [x] Admin `Site Settings > Locales` tab'i `brand=kompozit` modunda `kompozit__app_locales` key'ini yonetiyor; `default_locale` secimi panelden kaldirildi
- [x] Admin `Site Settings ?brand=kompozit` sayfasinda ortak altyapi sekmeleri (`smtp`, `cloudinary`, `api`, `branding`) gizlendi; kompozit modunda sadece namespaced site tablari acik
- [x] Admin `general`, `seo` ve `brand_media` tablari `brand=kompozit` modunda `kompozit__*` key'lerine yazacak sekilde namespaced hale getirildi
- [x] `site-settings/[id]` detail edit ekrani `brand=kompozit` context'ini koruyacak sekilde prefix-aware hale getirildi; load/save/delete ve locale secenekleri artik kompozit namespace'i ile calisiyor
- [x] Admin `Site Settings` liste ve detail ekranlarina gorunur `KOMPOZIT Scope` / `Scope: kompozit__` badge'leri eklendi; kullanici hangi namespace'i duzenledigini UI seviyesinde de net goruyor
- [x] Shared tenant mantigi yerine monorepo icinde ayri `kompozit_admin_panel` ve `kompozit_backend` uygulamalari olusturuldu
- [x] `kompozit_admin_panel` kompozit branding, sade sidebar ve route gate ile shared panelden operasyonel olarak ayrildi
- [x] `kompozit_admin_panel` icinde kompozit disi ilk route batch'i fiziksel olarak kaldirildi; `user-roles` liste route'u da silindi
- [x] `kompozit_backend` icinde kompozit disi ilk backend modulleri fiziksel olarak prune edildi (`chat`, `catalog`, `faqs`, `footerSections`, `newsletter`, `sites`, `projects`, `slider`, `support`)
- [x] `kompozit_backend` icinde `services` ve `ip-blocklist` modulleri tamamen kaldirildi
- [x] `offer` semasi ve servis katmani `services` foreign key / lookup bagimliligindan ayrildi
- [x] `kompozit_backend` prune sonrasi `npm run build` ile tekrar dogrulandi
- [x] `kompozit_backend` icinde `mail` ve `email-templates` modulleri de tamamen kaldirildi
- [x] `auth`, `contact` ve `offer` akislari icin dar kapsamli `src/core/kompozit-mail.ts` helper'i eklendi
- [x] `kompozit_admin_panel` icinde `email-templates`, `mail` ve `footer-sections` icin route-disinda kalan olu wrapper/component dosyalari kaldirildi
- [x] `kompozit_admin_panel` SMTP tab'indaki test mail aksiyonu kaldirildi; panel bu alanda yalnizca ayar yoneten dar bir yuzeye cekildi
- [x] `kompozit_admin_panel` icinde kompozit disi route klasorlerinin altinda kalan son TS/TSX dosyalari da fiziksel olarak silindi; olu shared ekran kalintilari dosya seviyesinde temizlendi
- [x] `kompozit_admin_panel` icin `tsc` hata seti daraltildi; kalan hatalar artik yasayan kompozit modullerindeki implicit-any, auth zod uyumsuzlugu ve eksik `@radix-ui/react-select` bagimliligina indi
- [x] `kompozit_backend` tarafinda prune edilen shared modul klasorlerinin son dosya kalintilari da temizlendi; `chat`, `catalog`, `db_admin`, `email-templates`, `faqs`, `footerSections`, `ip-blocklist`, `mail`, `newsletter`, `projects`, `services`, `sites`, `slider`, `support` fiziksel olarak bos hale getirildi
- [x] `kompozit_admin_panel` icinde `@radix-ui/react-select` bagimliligi eklendi; auth formlarindaki Zod resolver uyumsuzlugu giderildi ve `bun x tsc --noEmit` tekrar yesile cekildi
- [x] `kompozit_backend` auth sadeleştirme turu baslatildi; `users.role` alanı schema'ya eklendi ve `309_kompozit_auth_role_patch.sql` yazildi
- [x] `309_kompozit_auth_role_patch.sql` yerel DB'ye uygulandi; `users.role` alani olustu ve mevcut kullanicilar `user_roles` verisinden backfill edildi
- [x] `kompozit_backend` icinde auth/admin/google/roles middleware rol kaynagi olarak dogrudan `users.role` alanina tasindi
- [x] Bu auth-role sadeleştirmesi sonrasi `kompozit_backend` icin `npm run build` tekrar basarili calisti
- [x] Artik kullanilmayan `kompozit_backend/src/modules/userRoles/*` dosyalari fiziksel olarak kaldirildi; rol mantigi kod seviyesinde de shared modülden ayrildi
- [x] `kompozit_backend` icinde `profiles` bagimliligi de kaldirildi; auth yardimcisi ayrik `profiles` tablosu yerine dogrudan `users.full_name` ve `users.phone` alanlarini senkronize eder hale getirildi
- [x] Artik kullanilmayan `kompozit_backend/src/modules/profiles/*` dosyalari fiziksel olarak kaldirildi
- [x] `profiles` modulunun cikarilmasi sonrasi `kompozit_backend` icin `npm run build` tekrar basarili calisti
- [x] `kompozit_backend` seed runner'a `--profile=kompozit` profili eklendi; `db:seed` ve `db:seed:nodrop` scriptleri varsayilan olarak kompozit zinciri calistiracak sekilde ayrildi
- [x] Shared tum-sql zinciri icin ayri `db:seed:full` ve `db:seed:full:nodrop` scriptleri korundu
- [x] `kompozit_backend` icin `.env.example` eklendi; `.env.production`, `Dockerfile`, `docker-compose.yml` ve `ecosystem.config.cjs` kompozit domain/port/process kimligine gore duzeltildi
- [x] `kompozit_backend` Dockerfile'indaki lockfile varsayimi kaldirildi ve `docker-compose.yml` icindeki YAML indent kirigi duzeltildi
- [x] `kompozit_admin_panel` icin `.env.example`, `.env.production`, `Dockerfile`, `docker-compose.yml`, `.dockerignore` ve kompozit PM2 runtime config'i tamamlandi
- [x] `kompozit_admin_panel` runtime ayarlari `8186` backend / `panel.moekompozit.com` hedefine hizalandi (`fetch-branding`, `metadataBase`, `next.config.mjs`)
- [x] `kompozit_admin_panel` icin `bun run build` tekrar basarili calisti; route agaci kompozit odakli temiz panel yuzeyini dogruladi

### 6.7 Security & Headers
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Static assets: Cache-Control immutable (31536000s)
- [x] compress: true, poweredByHeader: false
