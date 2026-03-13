# Karbonkompozit

**MOE Kompozit — Kurumsal Web Sitesi**

Next.js tabanli kurumsal tanitim ve teklif toplama platformu. MOE Kompozit, Ensotek firmasinin bagimsiz bir markasi olarak konumlanmaktadir; frontend altyapisi bu repoda, backend Ensotek workspace'indeki shared backend uzerinden `@ensotek/core` paketleri ile sagllanir.

Domain hedefi: `https://www.karbonkompozit.com.tr`

---

## Workspace Yapisi

Bu repo Ensotek monorepo'su (`/home/orhan/Documents/Projeler/Ensotek`) icinde bagimsiz bir Next.js uygulamasidir.

```
Ensotek/
  karbonkompozit/       <- bu repo
    src/
      app/[locale]/     <- App Router, tum rotalar locale altinda
        products/       <- urun katalogu (liste + detay)
        gallery/        <- galeri (liste + detay)
        blog/           <- blog (liste + detay)
        about/          <- hakkimizda
        contact/        <- iletisim ve teklif formu
        legal/[slug]/   <- yasal sayfalar
      features/         <- domain feature modulleri (products, gallery, blog, offer, ...)
      components/       <- UI, layout, seo, widgets
      seo/              <- JSON-LD builder'lari, metadata helper'lari
      theme/            <- token-first tema sistemi
      styles/           <- globals.css, semantic token tanimlari
      lib/              <- shared yardimci fonksiyonlar
      app/api/          <- monitoring endpoint (seo-issues)
    docs/               <- SEO checklist'leri, release dokumanlar
    scripts/            <- SEO ve tema smoke test script'leri
```

---

## Teknoloji Yigini

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 |
| Cok dil | next-intl (TR / EN) |
| Veri | React Query (@tanstack/react-query) |
| Form | React Hook Form + Zod |
| State | Zustand |
| UI | Radix UI, Lucide React, Embla Carousel, Sonner |
| Backend | Ensotek shared backend (@ensotek/core workspace paketi) |

---

## Sayfalar

| Rota | Aciklama |
|---|---|
| `/` | Anasayfa — slider, urun ozet, galeri ozet, CTA |
| `/products` | Urun katalogu listeleme |
| `/products/[slug]` | Urun detay |
| `/gallery` | Galeri listeleme |
| `/gallery/[slug]` | Galeri detay |
| `/blog` | Blog listeleme |
| `/blog/[slug]` | Blog detay |
| `/about` | Hakkimizda |
| `/contact` | Iletisim ve teklif formu |
| `/legal/[slug]` | Yasal sayfalar |

Tum rotalar `[locale]` segment altindadir. Desteklenen lokaller: `tr`, `en`.

---

## Calistirma

```bash
# Ensotek monorepo kokunden
bun install

# Sadece karbonkompozit
cd karbonkompozit
npm run dev        # port 3020
npm run build
npm run start      # port 3020
```

---

## Test ve Audit Komutlari

```bash
npm run type-check          # TypeScript kontrolu
npm run lint                # ESLint
npm run test:theme          # Semantic token smoke test
npm run test:seo            # SEO smoke test (canonical, hreflang, robots)
npm run test:media          # Medya SEO contract kontrolu
npm run audit:media         # Medya veri kalitesi audit
npm run audit:crawl         # Tam crawl raporu
npm run audit:lighthouse    # Lighthouse CI SEO assertion
```

Her anlamli degisiklikten once en az `build + test:seo + test:theme` calistirilmalidir.

---

## Tema Sistemi

Token-first tema yapisi kullanilir.

- Template: `moe-carbon-industrial`
- Intent: `prime-b2b-neutral-primary-accent`
- Kaynak: `src/styles/globals.css`, `src/theme/templates.ts`
- Layout `data-theme-template` ve `data-theme-intent` attribute'larini set eder.
- Component icinde raw hex veya sabit renk kullanilmaz; semantic token zorunludur.

Semantic token gruplari: `neutral`, `primary`, `accent`, `surface`, `status`

---

## SEO Yapisi

Her indekslenebilir sayfa icin zorunlu set:

- `generateMetadata` (title, description, canonical, hreflang, OG, Twitter)
- `x-default` alternate link
- Uygun `robots` direktifi
- Gerekiyorsa JSON-LD (Organization, Product, Article, Breadcrumb, LocalBusiness)

Helper: `buildPageMetadata({ locale, pathname, title, description, ogImage?, noIndex? })`

SEO monitoring: 404 ve soft-404 sinyalleri `SeoIssueBeacon` ile `/api/monitoring/seo-issues` endpoint'ine gonderilir.

---

## Aktif Gelistirme Durumu

Bakilacak yer: `PROGRESS.md` ve `IMPLEMENTATION_PLAN.md`

Kritik bekleyen isler:
- EN locale aktivasyonu (runtime message registry)
- Default locale URL stratejisi temizligi (canonical/hreflang)
- Sitemap kapsam genisletmesi (blog, legal)
- DB migration: gallery, item_type, offer.source

---

## Ilgili Dosyalar

| Dosya | Icerik |
|---|---|
| `CLAUDE.md` | Calisma kurallari, SEO pattern contract, tema token contract |
| `IMPLEMENTATION_PLAN.md` | Teknik SEO uygulama plani (9 phase) |
| `PROGRESS.md` | Backend/admin panel gelistirme ilerleme takibi |
| `docs/SEO_RELEASE_CHECKLIST.md` | Yayın oncesi SEO kontrol listesi |
| `docs/SEARCH_CONSOLE_SUBMIT_CHECKLIST.md` | Search Console submit adımlari |
| `nginx-karbonkompozit.conf` | Nginx deployment konfigurasyonu |
| `ecosystem.config.cjs` | PM2 process konfigurasyonu |

---

*Dokumantasyon guncelleme: Bu dosya proje yapisi, rota veya teknoloji degisikliginde guncellenir. Metadata icin tek dogru kaynak `project.portfolio.json`'dir.*
