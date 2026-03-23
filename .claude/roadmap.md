# Ensotek Yol Haritasi

> Tarih: 2026-03-23 (guncellendi)
> Oncelik: P0 (kritik) -> P1 (yuksek) -> P2 (orta) -> P3 (dusuk)

---

## FAZA 1 — Temel Duzeltmeler & Tutarlilik ✅

### 1.1 Port & Env Tutarliligi [P0] ✅
- [x] admin_panel `apiBase.ts` hardcoded port `8084` -> `8086`
- [x] admin_panel `next.config.mjs` image remote `localhost:8093` -> `localhost:8086`
- [x] Backend `env.ts` PORT default `8083` -> `8086`, FRONTEND_URL `5173` -> `3000`
- [x] Tum frontend `.env.example` dosyalari guncellendi
- [x] Backend `CORS_ORIGIN` env'inde tum frontend origin'leri dogrulandi

### 1.2 Legacy Temizlik [P1] ✅
- [x] `@tanstack/react-query` gereksiz dependency kaldirildi
- [x] `AuditDailyChart` proxy import -> direct import duzeltildi
- [x] `_site-settings/` legacy dizini zaten mevcut degil (temiz)
- [x] `offers-xxx/` legacy dizini zaten mevcut degil (temiz)

### 1.3 SEO Default Degerler [P0] ✅
- [x] `seo/seoSchema.ts` -> "KONIG ENERGETIK" referanslari "Ensotek" ile degistirildi
- [x] `DEFAULT_SEO_GLOBAL` degerleri Ensotek icin guncellendi
- [x] `DEFAULT_SITE_META_DEFAULT_BY_LOCALE` -> de/en/tr icin Ensotek metinleri
- [x] `seoSchema.ts` Unicode curly quote hatasi duzeltildi (23 karakter)

---

## FAZA 2 — Performans Optimizasyonu ✅

### 2.1 Gorsel Optimizasyon [P0] ✅
- [x] `body-bg.png` -> WebP referansi guncellendi (SCSS)
- [x] `project/03.jpg` -> WebP referansi guncellendi (6 component dosyasi)

### 2.2 CSS & Font Optimizasyonu [P1] — kismen
- [x] FontAwesome fa-thin (1.5MB) kullanilmayan set kaldirildi
- [x] 8 legacy CSS dosyasi (public/app/css/) temizlendi

### 2.3 Code Splitting [P1] — kismen
- [x] StackableWidgets -> `next/dynamic` ile lazy load (layout.tsx)

### 2.4 React Query Cache [P2] ✅
- [x] Default staleTime: 1dk -> 2dk, gcTime: 5dk -> 10dk
- [x] Site settings staleTime: 5dk -> 30dk
- [x] Menu items staleTime: 5dk -> 15dk
- [x] Slider staleTime: 5dk -> 15dk

---

## FAZA 3 — SEO Iyilestirmeleri ✅

### 3.1 Structured Data Aktivasyonu [P1] ✅
- [x] JSON-LD Organization + WebSite schema -> root layout'a eklendi (DB'den socials, logo)

### 3.2 Sayfa Bazli Metadata [P1] ✅
- [x] 29/34 sayfa `generateMetadata()` kullaniyor
- [x] 15 liste sayfasi DB-driven `seo_pages` metadata'ya baglandi
- [x] og:image -> sayfa bazli resim (seo_pages'dan, admin panelden duzenlenebilir)
- [x] noindex kontrolu -> sayfa bazli (seo_pages'dan)
- [x] Canonical URL'ler: root layout'ta alternates/hreflang mevcut

### 3.3 Teknik SEO [P2] — kismen
- [x] Sitemap: lastmod -> dynamic entries icin backend `updated_at` kullaniliyor
- [x] Sitemap: `/legal` route eklendi

### 3.4 Admin Panel SEO Modulu [P0] ✅
- [x] `seo-settings-tab.tsx` kirik import'lar duzeltildi
- [x] `seoInlinePages.ts` shared types/constants olusturuldu
- [x] `AdminImageUploadField` import case duzeltmesi (Linux uyumlu)
- [x] i18n keys -> tr/en/de (inline SEO + pageLabels) eklendi
- [x] `siteSettings.ts` -> missing UI helpers eklendi
- [x] Admin SEO tab -> seo_pages key'i ile DB'den okuma/yazma calisiyor

---

## FAZA 4 — i18n Sistemi Iyilestirmeleri ✅

### 4.1 OG Locale Format Duzeltmesi [P1] ✅
- [x] `toOgLocale()` fonksiyonu duzeltildi — `OG_REGION_MAP` eklendi
- [x] `en_EN` -> `en_US`, `de` -> `de_DE`, `tr` -> `tr_TR` (standart)
- [x] Hem de_frontend hem kuhlturm-frontend'te ayni fix uygulandi

### 4.2 Admin Panel i18n Senkronizasyonu [P2] ✅
- [x] tr.json / en.json / de.json → 3196 key, 0 eksik (tam senkron)
- [x] AI aksiyon label'lari eklendi (full, enhance, translate, generateMeta)
- [x] Blog/News sidebar label'lari eklendi
- [x] Google Preview, cover image, gallery i18n key'leri eklendi

### 4.3 Backend i18n Tutarliligi [P1] ✅
- [x] `APP_LOCALES` env default `'tr,en,de'` -> `'de,en,tr'` (DB ile uyumlu)
- [x] `041_admin_settings.sql` default_locale `'tr'` -> `'de'` (DB ile uyumlu)
- [x] Locale fallback chain: ENV -> DB refresh 60s -> request headers calisiyor

### 4.4 de_frontend Dil Temizligi [P1] — bekliyor
- [ ] Stub locale dosyalari (ar.json, fr.json, ru.json) -> ya doldurmak ya kaldirmak karar ver
- [ ] `AVAILABLE_LOCALES`'te olmayan ama dosyasi olan diller icin strateji belirle

### 4.5 kuhlturm-frontend Coklu Dil [P2] — bekliyor
- [ ] Sadece `de` aktif — en/tr aktivasyonu icin plan yap
- [ ] de.json'daki key yapisi de_frontend ile uyumlu mu kontrol et

---

## FAZA 5 — Admin Panel Yapisal Duzeltmeler ✅

### 5.1 TypeScript Hatalari [P0] ✅
- [x] `categories-list-panel.tsx` 3 TS hatasi duzeltildi (error: unknown -> String())
- [x] `de_frontend/seoSchema.ts` Unicode curly quote hatasi duzeltildi
- [x] Tum 4 proje 0 TS hatasi: backend, admin_panel, de_frontend, kuhlturm-frontend
- [x] admin_panel `next build` basarili

### 5.2 AI-Destekli Modul Standardizasyonu ✅
- [x] 4 ortak bilesen olusturuldu: AIActionDropdown, AIResultsPanel, GooglePreview, ImagesGalleryTab
- [x] Products modulu guncellendi (4 AI aksiyonu, Google Preview, galeri)
- [x] Services modulu guncellendi (ayni standart)
- [x] Custom Pages modulu guncellendi (ayni standart)
- [x] Blog/News sidebar kisayollari eklendi
- [x] adminUi.ts blog/news key'leri eklendi

### 5.3 Sidebar Tamamlama [P1] — bekliyor
- [ ] Eksik sayfalari sidebar-items.ts'e ekle (profile, user-roles, theme, popups, vb.)
- [ ] Her yeni item icin 3 dil dosyasina ceviri ekle

### 5.4 State Management Konsolidasyonu [P2] — bekliyor
- [ ] Redux preferencesSlice vs Zustand preferences-store -> tek birine karar ver
- [ ] Kullanilmayan store'u kaldir

---

## FAZA 6 — Backend Yapisal Iyilestirmeler (Hafta 3-4)

### 6.1 Service Layer Tamamlama [P2]
- [ ] Oncelikli moduller: products, services, categories
- [ ] Controller'daki is mantigi -> service.ts'e tasi

### 6.2 Pagination Helper [P2]
- [ ] `_shared/pagination.ts` olustur (limit, offset, total, hasMore)
- [ ] ContentRange header'i standartlastir

### 6.3 Auth & Guvenlik [P1]
- [ ] RLS middleware (`ensureSameUser`) implement et
- [ ] Global rate limiting middleware ekle
- [ ] Auth logout: token blacklist veya short-lived token stratejisi

---

## FAZA 7 — kuhlturm-frontend Gelistirme (Hafta 4+)

### 7.1 SEO [P1]
- [ ] robots.ts ve sitemap.ts icerik dogrula
- [ ] JSON-LD schema'lar ekle (Organization, Product, Breadcrumb)
- [ ] og:image ve twitter:image -> sayfa bazli

### 7.2 Deploy Hazirlik [P1]
- [ ] PM2 ecosystem config'e kuhlturm-frontend ekle
- [ ] Nginx server block olustur
- [ ] SSL sertifika al
- [ ] CI/CD pipeline'a deploy adimi ekle

### 7.3 Icerik & UI [P2]
- [ ] Tum sayfalarin backend verisi ile dolup dolmadigini kontrol et
- [ ] Bos/placeholder icerik olan sayfalari tespit et
- [ ] Mobile responsive kontrol

---

## Oncelik Ozeti

| Durum | Gorev Sayisi | Aciklama |
|-------|-------------|----------|
| Tamamlandi | ~45 | Faz 1-5 cogu tamamlandi |
| Bekliyor (P1) | ~10 | Sidebar, auth, deploy, kuhlturm SEO |
| Bekliyor (P2) | ~10 | Service layer, pagination, state konsolidasyon |
| Toplam kalan | ~20 | Cogu Faz 6-7'de |

---

## Paralel Calisma Plani

| Agent | Sorumluluk | Faz |
|-------|-----------|-----|
| **Claude Code** | Mimari karar, kod yapilandirma, plan | Tum fazlar |
| **Antigravity AI** | Gorsel kontrol, responsive test, UI tutarlilik | Faz 7 |
| **Codex** | Toplu kod yazma (service layer, pagination helper) | Faz 6 |
| **Copilot** | Boilerplate, ceviri dosyasi tamamlama | Kalan i18n |
