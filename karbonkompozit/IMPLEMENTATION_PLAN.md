# Karbonkompozit Technical SEO Implementation Plan

> Project: `karbonkompozit`
> Domain target: `https://www.karbonkompozit.com.tr`
> Audit date: 2026-03-12
> Reference scope: `/home/orhan/Documents/Projeler/Ensotek/technical-seo-skill`
> Audit basis: source review + local rendered output validation + production build check

## Scope Note

`technical-seo-skill` normalde tam crawl + `.xlsx` rapor üretimi için tasarlanmış. Bu çalışma bir crawl workbook'u degil; `karbonkompozit` reposunun kod, metadata, sitemap, robots, i18n ve render davranisi uzerinden teknik SEO uygulama planidir.

## Executive Summary

Repo genel olarak iyi bir temel atmis:

- Next.js App Router kullaniliyor.
- `robots.txt` ve `sitemap.xml` mevcut.
- Sayfa bazli `generateMetadata` kullanimi var.
- Product ve article seviyesinde JSON-LD baslangici var.
- Image optimizasyonu ve production build calisiyor.

Ancak arama motoru performansini en cok etkileyen 4 temel problem var:

1. Varsayilan locale URL stratejisi tutarsiz. `localePrefix: 'as-needed'` kullanilirken uygulama ve sitemap `tr` icin `/tr` URL'lerini zorunlu kilmis. Bu duplicate/alternate canonical riskidir.
2. Cok dilli altyapi tamamlanmamis. `en.json` dosyasi var ama runtime mesaj kaydinda sadece `tr` import ediliyor. `/en` sayfasi aciliyor fakat icerik Turkce kaliyor.
3. Sitemap kapsami eksik. Blog detail, legal pages ve diger potansiyel indekslenebilir URL'ler sitemap'e girmiyor. `lastModified` tum URL'lerde `new Date()` oldugu icin gercek degisiklik sinyali uretilmiyor.
4. Metadata ve schema katmani temel seviyede. Canonical/hreflang, OG image, breadcrumb, organization/local business ve listeleme sayfasi yapisal verileri eksik.

## Evidence Summary

### High Priority Findings

- `src/i18n/locales/index.ts:1` sadece `tr.json` import ediyor, `AVAILABLE_LOCALES` fiilen sadece `tr` uzerinden olusuyor.
- `src/i18n/routing.ts:4` `localePrefix: 'as-needed'` tanimli.
- `next.config.ts:27` `/` -> `/tr` rewrite var.
- `src/app/[locale]/layout.tsx:55` canonical dili daima `/${locale}` formatinda yaziyor.
- `src/components/layout/LanguageSwitcher.tsx:18` locale switch her durumda prefix ekliyor; default locale icin kok URL davranisi yok.
- `src/app/sitemap.ts:22` sadece products ve galleries slug topluyor.
- `src/app/sitemap.ts:43` ve `src/app/sitemap.ts:52` tum `lastModified` degerlerini `new Date()` ile set ediyor.
- `src/seo/jsonld.ts:7` Organization, WebSite, Product, Article ve Breadcrumb builder'lari var; ama breadcrumb kullanimda degil, LocalBusiness yok.

### Local Render Checks

- `/` 200 donuyor ve canonical `https://www.karbonkompozit.com.tr/tr` olarak render ediliyor.
- `/en` 200 donuyor ama body icerigi Turkce gorunuyor; hreflang ve locale sinyali ile icerik eslesmiyor.
- `robots.txt` mevcut ve temel olarak dogru.
- `sitemap.xml` uretiliyor ama kapsam ve `lastmod` kalitesi yetersiz.

### Build Validation

- `npm run build` basarili.
- Route ciktisinda cogu sayfa `dynamic` gorunuyor; indekslenebilirlik icin engel degil ama TTFB ve cache verimliligi acisindan optimize edilmeli.

## Priority Matrix

### P0: Immediate SEO Risk

- Locale/canonical/hreflang mimarisini duzelt
- EN locale'i gercekten calisir hale getir
- Sitemap kapsamini tamamla

### P1: Strong SEO Uplift

- Sayfa bazli metadata standardini tamamlama
- JSON-LD kapsamini genisletme
- Internal linking ve bilgi mimarisini guclendirme

### P2: Quality / CTR / Crawl Efficiency

- OG/Twitter image stratejisi
- `llms.txt`, favicon, manifest, static social image
- Last modified ve content freshness sinyalleri

## Implementation Plan

## Phase 1: URL, Canonical, Hreflang Architecture

### Goal

Tek bir dogru URL yapisi tanimlamak ve varsayilan locale icin duplicate URL riskini kaldirmak.

### Current Problems

- Routing `as-needed`, ama uygulama `/tr` URL'lerini esas aliyor.
- Canonical `tr` icin `/tr` gosteriyor.
- Language switcher kok URL yerine her locale icin prefix yaziyor.
- Rewrites SEO mantigi ile i18n mantigi birbirine ters calisiyor.

### Tasks

- [ ] Default locale stratejisini netlestir: ya `tr` kok URL olsun (`/`) ya da tum locale'ler prefiksli olsun.
- [ ] `src/i18n/routing.ts` ile `next.config.ts` rewrite mantigini ayni URL stratejisine getir.
- [ ] `src/app/[locale]/layout.tsx` canonical ve `alternates.languages` uretimini merkezi helper uzerinden standardize et.
- [ ] `src/components/layout/LanguageSwitcher.tsx` icinde default locale icin kok URL davranisi tanimla.
- [ ] Tum `href={`/${locale}...`}` kullanimlarini locale helper ile uretilecek sekilde refactor et.
- [ ] `x-default` alternate link ekle.

### Acceptance Criteria

- `tr` icin sadece bir indexlenebilir URL kalir.
- `/`, `/tr`, `/en` davraniisi bilincli ve tutarli olur.
- Canonical ile hreflang birbirini dogrular.
- Search Console'da duplicate without user-selected canonical riski minimuma iner.

## Phase 2: Real Multilingual Indexability

### Goal

`en` sayfalarinin sadece URL olarak degil, icerik ve metadata olarak da gercek ikinci dil olmasi.

### Current Problems

- `public/locales/en.json` mevcut ama runtime message registry'de aktif degil.
- `/en` altinda Turkce text render oluyor.
- Hreflang `en` isaret ederken kullanici ve bot ayni dil icerigini gormuyor.

### Tasks

- [ ] `src/i18n/locales/index.ts` icinde `en.json` import ve kaydini tamamla.
- [ ] Backend `activeLocales/defaultLocale` cevabi ile frontend static locale registry arasindaki bagimliligi netlestir.
- [ ] `generateStaticParams()` ve request locale secimini sadece gercekten desteklenen locale'ler ile hizala.
- [ ] Dil bazli menu, footer, SEO settings ve custom page iceriklerinin eksiksiz geldigi dogrulanmali.
- [ ] `en` sayfalar icin title, description, nav ve CTA icerikleri gercek Ingilizce olmalı.
- [ ] Empty translation fallback davranisi tanimlanmali; sessizce Turkceye dusmemeli.

### Acceptance Criteria

- `/en` sayfalarinda HTML `lang="en"` ile uyumlu Ingilizce gorunur.
- Hreflang hedefleri gercek dil varyantlarina isaret eder.
- EN title/description/body metinleri kaynak bazli ayri olur.

## Phase 3: Sitemap, Robots, Crawl Coverage

### Goal

Arama motoruna eksiksiz, temiz ve guvenilir URL envanteri vermek.

### Current Problems

- Sitemap sadece static routes + product + gallery iceriyor.
- Blog detail sayfalari eksik.
- Legal pages eksik.
- `lastModified` gercek veri yerine render zamani.
- Locale listesi hardcoded.

### Tasks

- [ ] `src/app/sitemap.ts` icinde blog slug'larini dahil et.
- [ ] Legal/custom pages icin indekslenebilir slug'lari dahil et.
- [ ] Gerekirse sitemap'i bol: `sitemap-index`, `products`, `blog`, `gallery`, `pages`.
- [ ] Locale listesini hardcoded yerine aktif locale kaynagindan cek.
- [ ] `lastModified` alanlarini API `updated_at` verisinden uret.
- [ ] Kategori sayfalari indekslenecekse query string yerine temiz route tasarla (`/products/category/[slug]` gibi).
- [ ] `robots.ts` icinde gerekirse query pattern ve non-SEO path'ler icin daha net disallow kurallari tanimla.
- [ ] `llms.txt` ekleme kararini ver ve marka politikasina gore uygula.

### Acceptance Criteria

- Tum indekslenebilir route'lar sitemap'te yer alir.
- Her URL icin makul `lastmod` degeri vardir.
- Robots ve sitemap birbirini destekler.
- Orphan URL riski azaltilir.

## Phase 4: Metadata Standardization

### Goal

Her indekslenebilir sayfanin benzersiz, CTR odakli ve teknik olarak eksiksiz metadata setine sahip olmasi.

### Current Problems

- Bircok listeleme sayfasinda sadece genel title/description var.
- OG image ve Twitter image stratejisi yok.
- Query-param varyantlar icin canonical politikasi net degil.
- Home page metadata layout seviyesinde cikariliyor; sayfa bazli zenginlestirme sinirli.

### Tasks

- [x] Tum page `generateMetadata` fonksiyonlarini ortak helper uzerine tasi.
- [x] Title template, title length, meta description length ve fallback kurallarini standardize et.
- [x] Product, blog, gallery, legal ve listing sayfalari icin canonical hesaplamasini tek helper'a bagla.
- [x] `openGraph.images` ve `twitter.images` alanlarini ekle.
- [x] Dynamic social preview image stratejisi belirle:
  - sabit brand OG image
  - ya da route bazli generated image
- [x] Product category filtreleri indekslenmeyecekse canonical ana `/products` sayfasina donmeli.
- [x] Page-level robots karar matrisi yaz:
  - noindex: bos filtre varyantlari, test/draft sayfalar
  - index/follow: esas landing ve detay sayfalari

### Acceptance Criteria

- Her indekslenebilir sayfada unique title, description, canonical, OG ve Twitter metadata bulunur.
- Parametreli URL'ler canonical kaosu yaratmaz.
- Sosyal paylasimlarda marka uyumlu preview gorunur.

## Phase 5: Structured Data Expansion

### Goal

Schema katmanini sadece minimum isaretleme olmaktan cikarip arama motoru icin daha acik hale getirmek.

### Current Problems

- Home page sadece Organization + WebSite veriyor.
- Product ve Article schema var ama breadcrumb yok.
- Contact/About sayfalarinda LocalBusiness veya Organization detayi yok.
- Gallery ve listing sayfalarinda yapisal veri yok.

### Tasks

- [x] `src/seo/jsonld.ts` icine `LocalBusiness`, `ImageGallery` veya uygun `CollectionPage`/`ItemList` builder'lari ekle.
- [x] Product detail sayfalarina `BreadcrumbList` ekle.
- [x] Blog detail sayfalarina `BreadcrumbList` ve publisher bilgisi ekle.
- [x] Home ve about sayfalarinda organization schema'yi guclendir.
- [x] Contact sayfasinda organization/local business email, phone ve address alanlarini schema'ya bagla.
- [x] Product ve blog list sayfalarinda `ItemList` schema kullan.
- [x] Gallery listing sayfasinda `CollectionPage` + `ItemList` katmanini ekle.
- [x] Gallery detail sayfasinda image alt/caption alanlarini `ImageObject` / `ImageGallery` schema ile hizala.

### Acceptance Criteria

- Home, contact, about, product detail, blog detail ve ana listeleme sayfalari anlamli schema tasir.
- Rich Results Test tarafinda kritik hata kalmaz.

## Phase 6: Internal Linking and Information Architecture

### Goal

Tarama derinligini azaltmak ve konu otoritesini daha net dagitmak.

### Current Problems

- Local render kontrolunde ust menunun bos geldigi goruldu; bu durum production data baglantisinda da varsa internal link graph zayif kalir.
- Blog, product ve gallery arasinda konu bazli capraz link yapisi sinirli.
- Category sayfalari route seviyesinde degil, filtre seviyesinde.

### Tasks

- [x] Menu/footer veri akisini production benzeri veriyle dogrula.
- [x] Product detail sayfalarinda ilgili kategori, ilgili galeriler ve ilgili blog yazilari bolumleri ekle.
- [x] Blog yazilarindan ilgili urun ve teklif sayfalarina baglanti ver.
- [x] Footer icinde oncelikli SEO landing sayfalarina text linkler ekle.
- [x] Breadcrumb UI ve HTML link yapisini hayata gecir.
- [ ] Category landing stratejisi belirle:
  - filtre URL
  - ya da temiz, indekslenebilir category route

### Acceptance Criteria

- Ana landing'ler 3 tik veya daha az derinlikte olur.
- Product/blog/gallery cluster yapisi kurulur.
- Orphan page olasiligi duser.

## Phase 7: Image SEO and Media Signals

### Goal

Gorsellerin hem performans hem arama gorunurlugu acisindan dogru sinyaller vermesi.

### Current Problems

- Alt text bazen title fallback ile doluyor; sistematik kalite kontrolu yok.
- Social share image envanteri yok.
- Gallery ve product medya varliklari icin image sitemap veya image metadata genisletmesi yok.

### Tasks

- [x] Product ve gallery API cevabinda `alt`, `caption`, `width`, `height`, `updated_at` kalitesini kontrol et.
- [x] Generic alt yerine benzersiz ve anlamsal alt metin standardi yaz.
- [x] Kritik gorseller icin dosya adlandirma standardi belirle.
- [x] Logo, favicon, OG image, apple-touch-icon ve manifest asset setini tamamla.
- [x] Image sitemap genisletmesini uygula ve fallback gorsel stratejisini tamamla.

### Acceptance Criteria

- Hero, product ve gallery gorsellerinde anlamsiz alt metin kalmaz.
- Marka asset seti eksiksiz olur.

## Phase 8: Technical Hygiene and Monitoring

### Goal

SEO degisikliklerini yayin sonrasi olculebilir ve korunabilir hale getirmek.

### Tasks

- [x] Lighthouse CI kapsaminda SEO assertion'lari ekle veya sertlestir.
- [x] Search Console submit checklist yaz.
- [x] Deploy sonrasi manuel kontrol listesi olustur:
  - canonical
  - hreflang
  - robots
  - sitemap
  - structured data
  - 404 davranisi
- [x] Broken internal link ve orphan URL analizi icin tam crawl raporu uret.
- [x] Log/analytics tarafinda 404 ve soft-404 izlemesini aktif et.
- [x] Crawl raporunu local/prod origin farkini normalize edecek sekilde sertlestir.
- [x] Footer legal linkleri icin fallback legal sayfa icerigi ekle ve crawl 404'lerini temizle.
- [x] Lighthouse CI audit ortamini standalone production server uzerine tasi ve devtools/dev-chunk kaynakli yaniltici performans raporunu temizle.
- [x] Standalone build icin `.next/static` ve `public` asset hazirlama adimini ekle; audit/release ortaminda MIME ve 404 kaynakli console error'lari temizle.
- [x] Header, language switcher, theme toggle ve footer linklerini touch-target standardina gore buyut.
- [x] `WebVitals` beacon endpoint'ini ekle ve Lighthouse console-error audit'ini temizle.
- [x] Brand contrast token'larini koyulastir ve critical CTA/link renklerini accessibility contrast standardina tası.

### Acceptance Criteria

- Release sonrasi regresyonlar hizli tespit edilir.
- Teknik SEO sadece bir kez yapilan is olmaktan cikar.

### Progress Update

- [x] `304_kompozit_blog.seed.sql` ve `305_kompozit_pages.seed.sql` veritabanina uygulandi.
- [x] `305_kompozit_pages.seed.sql` icinde `content` JSON formatina gecildi ve `kvkk` slug cakismasi ayristirildi.
- [x] Yerel DB'de `products.item_type` enum'u ve gallery tablolari seed'lerin gececegi sekilde hizalandi.
- [x] Bu manual DB degisiklikleri repo icinde resmi SQL patch olarak kayda alindi (`299_kompozit_schema_patch.sql`).
- [x] SQL patch sirasi full seed zincirinde kirilma yaratmayacak sekilde `299_*` prefix'ine alindi.
- [x] Admin sidebar'a `kompozit_blog`, `kompozit_about` ve `kompozit_legal` module filtreli hizli linkleri eklendi.
- [x] `306_kompozit_products.seed.sql` ile ornek kompozit urun seti eklendi.
- [x] `307_kompozit_gallery.seed.sql` ile ornek kompozit galeri ve galeri gorsel seti eklendi.
- [x] Admin panel production build'i gecti; custom page liste/yeni rota query-prefill akisi server render seviyesinde dogrulandi.
- [x] Backend'e kompozit rollout icin `db:seed:kompozit` ve `db:seed:kompozit:fresh` komutlari eklendi.
- [x] Gercek admin login ile custom page, kompozit urun, galeri ve galeri gorseli icin create/update/delete smoke turu basarili tamamlandi.
- [x] Smoke turunda ortaya cikan iki backend issue kapatildi:
  - custom page create sirasinda `images` / `storage_image_ids` default eksigi
  - custom page delete sirasinda basarili silmeye ragmen 404 donen response semantigi
- [x] Bu dogrulama tekrar kullanilabilir smoke script'e tasindi (`test:smoke:kompozit-admin`).

## Phase 9: Theme Token and Template Management

### Goal

SEO ile birlikte buyuyecek sayfa ve section setinde gorsel tutarliligi token-first bir sistemle korumak.

### Why This Matters for SEO

- Tutarli template yapisi yeni landing page uretimini hizlandirir.
- Her yeni sayfada ayni CTA, contrast, spacing ve hierarchy kalitesi korunur.
- Tasarim sapmalari yuzunden olusan readability ve UX problemleri azalir.

### Current Problems

- Tema token mantigi baslangic seviyesinde ve semantic contract yeni olusuyor.
- Bazi componentlerde legacy token veya sabit renk kullanimi var.
- Sayfa pattern'i ile tema pattern'i ayni dokumanda yonetilmiyor.

### Tasks

- [x] Semantic token katmani olustur (`neutral`, `primary`, `accent`, `surface`, `status`)
- [x] Template kimligi tanimla (`moe-carbon-industrial`)
- [x] Intent kimligi tanimla (`prime-b2b-neutral-primary-accent`)
- [x] Layout seviyesinde `data-theme-template` ve `data-theme-intent` ekle
- [x] Layout seviyesinde `data-theme-mode` ve kalici dark/light mode altyapisini ekle
- [x] Sabit renk kullanan componentleri token'a baglamaya basla
- [x] Repo seviyesinde tema + SEO contract'ini `CLAUDE.md` icine yaz
- [x] Legacy token kullanimlarini asamali olarak semantic token'a tasi
- [x] `test:theme` veya benzeri token smoke test script'i ekle
- [x] Dark surface utility contract'i tanimla ve hero/CTA/footer alanlarinda uygula
- [x] Hardcoded light surface kullanimlarini temizle ve `surface-card` tabanli ortak card contract'i olustur
- [x] Theme script/toggle tarafinda `color-scheme` senkronizasyonu ekle
- [x] Admin panel referansli theme core kur (`theme.ts`, `theme-utils.ts`, `theme-boot.tsx`)
- [x] Root layout'i `data-theme-mode` + `data-theme-preset` contract'ina bagla
- [x] Media overlay pattern'ini utility katmanina tasi (`media-overlay`, `media-overlay-title`, `media-overlay-text`)
- [x] Brand CTA pattern'ini utility katmanina tasi (`surface-brand-cta`, `surface-brand-cta-subtle`)
- [x] Home hero ve dark CTA alanlarini `surface-dark-shell` + shared utility contract'i ile normalize et
- [x] Listing/detail pattern'lerini reusable component kataloguna tasi (`ListingCard`, `BrandCtaPanel`, `LinkListPanel`)
- [x] Active filter/state UI'larini token utility ile normalize et (`chip-brand`, `btn-contrast`)
- [x] Kurumsal content page pattern'lerini reusable component kataloguna tasi (`ContentPageHeader`, `InfoListPanel`)
- [x] Theme/template degisikliginde HTML smoke kontrolunu release checklist'e ekle (`test:release`)
- [x] Yeni landing page'ler icin reusable section/theme pattern katalogu olustur (`SectionHeader`, `FeatureCard`, `MediaOverlayCard`, `DarkCtaPanel`, `ListingCard`, `BrandCtaPanel`, `LinkListPanel`, `ContentPageHeader`, `InfoListPanel`)

### Acceptance Criteria

- Yeni UI gelistirmeleri raw color yerine semantic token kullanir.
- Tema template kimligi layout seviyesinde tek yerden yonetilir.
- `prime-frontend-nextjs` tasarim prensibi ile uyumlu neutral/primary/accent yapisi korunur.
- SEO pattern ve theme pattern ayni repo kurali altinda dokumante edilir.

## Phase 10: On-Page Trust, Readability and Link Annotation

### Goal

Sayfa ici guven sinyallerini, okunabilirligi ve link acikligini teknik SEO denetimlerinde eksiksiz hale getirmek.

### Current Problems

- Meta author bilgisi tanimli degil.
- Meta publisher bilgisi tanimli degil.
- Favicon sinyali audit araclarinda pasif veya tutarsiz gorunuyor.
- Font-size hiyerarsisi okunabilirlik acisindan yeterli sinyal vermiyor.
- Navigation, CTA, listing ve footer linklerinde `title` veya esdeger aciklayici annotation eksigi var.
- `robots.txt` icindeki kural ve sitemap sinyalleri audit araclarinda yetersiz gorunuyor.
- `www` yonlendirmesi pasif; URL kanoniklestirme zinciri eksik gorunuyor.
- Title pixel width bazi landing'lerde onerilen siniri asiyor.
- Meta baslik bazi denetimlerde istenmeyen karakter politikalarina takiliyor.
- H1 basligindaki ana kelimeler body text icinde yeterince tekrar edilmiyor.
- Apple Touch icon sinyali eksik veya audit araclari tarafinda algilanmiyor.
- Social sharing secenekleri sayfa tiplerine gore yetersiz gorunuyor.
- Bazi anchor text'ler fazla tekrarli veya fazla uzun.
- External link sinyali hic yok veya cok zayif.
- Web server version bilgisi HTTP header'da acik ediliyor.
- Ozel 404 sayfasi audit araclarina gore dogru status/code sinyali vermiyor.
- Google Search Console baglantisi kayit altinda degil.
- Google Analytics entegrasyonu yok.
- Facebook Pixel sinyali yok.
- Kurumsal sosyal profil linkleri eksik veya tanimli degil.

### Tasks

- [ ] `author` ve `publisher` metadata stratejisini ortak helper katmanina ekle.
- [ ] Publisher sinyalini Organization/Article schema ile hizala.
- [ ] Favicon, icon, apple-touch ve related icon output'unu route bazli tekrar dogrula.
- [ ] `robots.txt` icine acik sitemap adresi ve gerekli crawl kurallarini tekrar degerlendir.
- [ ] `https` + non-`www`/`www` redirect politikasini netlestir ve production redirect matrix'ini uygula.
- [ ] `www` varyanti indexlenmeyecekse tek adimda kanonik host'a yonlendir.
- [ ] Title helper'inda pixel-width odakli kisaltma ve CTR dengesi icin ek kontrol uygula.
- [ ] Meta title sanitization kurali ekle; problemli karakterleri ve separator politikasini standardize et.
- [ ] H1 ile body copy arasindaki ana kavram eslesmesini landing bazinda guclendir.
- [ ] Apple Touch icon output'unun her route'ta dogru servis edildigini tekrar dogrula.
- [ ] Blog/detail ve gerekirse landing sayfalarinda social sharing coverage standardi tanimla.
- [ ] Tekrarlanan anchor text'leri ve asiri uzun link metinlerini yeniden duzenle.
- [ ] Uygun yerlerde sinyal bozmayacak sekilde sinirli ve baglamsal external link stratejisi degerlendir.
- [ ] Nginx/server katmaninda `Server` veya version disclosure header'ini minimize et.
- [ ] Gercek status code donduren, branded ve crawl-friendly bir ozel 404 sayfasi davranisini production'da tekrar dogrula.
- [ ] Search Console teslim/checklist adimini proje rollout checklist'ine dahil et.
- [ ] Google Analytics veya alternatif analytics baglantisi kararini netlestir; en azindan plan karari dokumante et.
- [ ] Facebook Pixel kullanilacaksa event/consent stratejisiyle birlikte planla; kullanilmayacaksa bunu bilincli karar olarak not et.
- [ ] Facebook, Twitter/X, Instagram, YouTube ve LinkedIn kurumsal profil URL'lerini site settings / footer / schema katmanina bagla.
- [ ] Body, excerpt, utility text ve footer copy alanlari icin minimum okunabilir font-size standardi tanimla.
- [ ] Global nav, footer, CTA, product/gallery/blog card ve featured content linklerine `title` veya uygun aciklayici annotation strategy ekle.
- [ ] `Devamini Oku`, `Tumunu Gor`, `Teklif Al`, `Urunleri Kesfet` gibi generic anchor text kullanimlarini context-aware hale getir veya annotation ile destekle.
- [ ] Home page ve global layout icin link annotation smoke checklist'i ekle.

### Audit Inputs To Address

- [ ] Meta Author Kullanimi: pasif, author kullanilmiyor.
- [ ] Meta Publisher Etiketi: pasif, publisher kullanilmiyor.
- [ ] Font Boyutlari: dokumanda okunabilir yazı tipi boyutlari sinyali yetersiz.
- [ ] Favicon Kullanimi: pasif veya tutarsiz sinyal.
- [ ] Robots Txt Dosyasi:
  - Dizine Eklenebilirlik: etkin
  - Dosya Durumu: etkin
  - Kural Kullanimi: pasif
  - Sitemap Adresi: pasif
- [ ] Yönlendirme Doğrulaması:
  - Https Kullanımı: aktif
  - Https Yönlendirme: aktif
  - www Yönlendirme: pasif
- [ ] Title:
  - `Karbon Fiber, CTP ve Cam Elyaf Kompozit Uretimi | MOE Kompo...`
  - Pixel width onerilen siniri asiyor (`599px`)
  - Istenmeyen karakter politikasi uyarisi var
- [ ] İçerik:
  - H1 kelimeleri body text icinde yeterince kullanilmiyor
  - Apple Touch icon belirtilmemis
  - Social-sharing imkanlari az
  - Bazi anker text'ler birden fazla kez kullaniliyor
  - Bazi ic link metinleri fazla uzun
  - External link yok
  - Incelenen sayfa kendisi baska URL'ye yonlenmiyor
  - `www` ve non-`www` URL'leri tutarli yonlenmiyor
  - Webserver version bilgisi HTTP header'da gonderiliyor
- [ ] Özel 404 sayfası:
  - Ozel 404 sayfasi bulunamadi
  - Sunucu yaniti `200`
- [ ] Arama konsolu:
  - Google Search Console bagli degil
- [ ] Google analizi:
  - Google Analytics bagli degil
- [ ] Facebook pikseli:
  - Facebook Pixel bulunamadi
- [ ] Sosyal profil sinyalleri:
  - Facebook sayfasi bulunamadi
  - Twitter sayfasi bulunamadi
  - Instagram sayfasi bulunamadi
  - YouTube sayfasi bulunamadi
  - LinkedIn sayfasi bulunamadi
- [ ] Title Etiketi Olmayan Linkler: asagidaki bulgular kapsama alinacak.

### Link Annotation Findings Queue

- [ ] `tr` Yazı: `MOE Kompozit`
- [ ] `tr` Yazı: `Ana Sayfa`
- [ ] `products` Yazı: `Ürünler`
- [ ] `gallery` Yazı: `Galeri`
- [ ] `blog` Yazı: `Blog`
- [ ] `about` Yazı: `Hakkımızda`
- [ ] `contact` Yazı: `İletişim`
- [ ] `offer` Yazı: `Teklif Al`
- [ ] `products` Yazı: `Ürünleri Keşfet`
- [ ] `offer` Yazı: `Teklif Al`
- [ ] `products` Yazı: `Tümünü Gör`
- [ ] `karbon-fiber-panel-prototipi` Yazı: `Karbon Fiber Panel PrototipiKarbon fiber takviyeli panel prototipi; hafiflik, rijitlik ve seri uretim oncesi dogrulama ihtiyaclari icin ornek bir kompozit urun kaydidir.`
- [ ] `ctp-koruyucu-govde-paneli` Yazı: `CTP Koruyucu Govde PaneliCam takviyeli polyester tabanli koruyucu govde paneli; saha dayanimı, kimyasal direnç ve proses tekrarlanabilirligi odakli ornek urun kaydidir.`
- [ ] `cam-elyaf-servis-kapagi` Yazı: `Cam Elyaf Servis KapagiCam elyaf esasli servis kapagi; dis ortam dayanimı ve kolay montaj gerektiren saha ekipmanlari icin ornek bir galeri ve urun destek kaydidir.`
- [ ] `gallery` Yazı: `Tümünü Gör`
- [ ] `karbon-fiber-panel-uygulama-galerisi` Yazı: `Karbon Fiber Panel Uygulama GalerisiKarbon fiber panel prototipinden nihai yuzey kontrolune uzanan ornek uygulama galerisi.`
- [ ] `ctp-govde-paneli-uretim-galerisi` Yazı: `CTP Govde Paneli Uretim GalerisiCTP govde panelinde kalip, laminasyon ve son trim surecini gosteren ornek galeri.`
- [ ] `karbon-fiber-nedir` Yazı: `Devamını Oku`
- [ ] `blog` Yazı: `Tümünü Gör`
- [ ] `ctp-fiberglass-farklari` Yazı: `Devamını Oku`
- [ ] `kompozit-kalite-kontrol` Yazı: `Devamını Oku`
- [ ] `offer` Yazı: `Teklif Al`
- [ ] `products` Yazı: `Ürünler`
- [ ] `gallery` Yazı: `Galeri`
- [ ] `blog` Yazı: `Blog`
- [ ] `offer` Yazı: `Teklif Al`
- [ ] `about` Yazı: `Hakkımızda`
- [ ] `contact` Yazı: `İletişim`
- [ ] `privacy` Yazı: `Gizlilik Politikası`
- [ ] `terms` Yazı: `Kullanım Koşulları`
- [ ] `privacy` Yazı: `Gizlilik Politikası`
- [ ] `terms` Yazı: `Kullanım Koşulları`

### Acceptance Criteria

- Author ve publisher sinyalleri metadata ve schema katmaninda tanimli olur.
- Favicon sinyali kritik route'larda tutarli servis edilir.
- `robots.txt` kurallari ve sitemap bildirimi audit araclarinda gecerli sinyal verir.
- `www` ve non-`www` varyantlari tek bir kanonik host uzerine yonlenir.
- Title uzunluklari sadece karakterle degil pixel-width seviyesinde de guvenli aralikta olur.
- Meta title karakter politikasi ortak helper ile temiz ve tutarli hale gelir.
- H1 ana kavramlari body copy ile anlamsal olarak desteklenir.
- Apple Touch icon ve social sharing sinyalleri kritik sayfalarda eksiksiz olur.
- Tekrarlanan veya asiri uzun anchor text sorunlari anlamli seviyeye iner.
- Uygun oldugu yerlerde baglamsal external link sinyali degerlendirilmis olur.
- Server version disclosure sinyali minimize edilir.
- Ozel 404 sayfasi dogru status code ve branded UX ile servis edilir.
- Search Console / analytics / pixel / sosyal profil sinyalleri bilincli karar veya uygulama olarak kayda baglanir.
- Okunabilir tipografi standardi body ve supporting copy alanlarinda saglanir.
- Generic veya aciklayici title/annotation eksigi olan link problemi global layout ve ana landing'lerde kapanir.

## Recommended Execution Order

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5
6. Phase 6
7. Phase 7
8. Phase 8
9. Phase 9
10. Phase 10

## Suggested Delivery Breakdown

### Sprint 1

- URL strategy
- canonical/hreflang cleanup
- EN locale activation
- sitemap coverage fix

### Sprint 2

- metadata helpers
- OG/Twitter assets
- breadcrumb + LocalBusiness/Product/Article schema expansion

### Sprint 3

- internal linking improvements
- category landing strategy
- image SEO standards
- monitoring and crawl verification

## Done / Verified During This Review

- [x] `npm run build` basarili calisti
- [x] `npm run test:theme` basarili calisti
- [x] `npm run test:seo` basarili calisti
- [x] `test:smoke:admin-content` ile admin CRUD uzerinden acilan gecici blog/product/gallery verisinin frontend detail route'larina aktigi dogrulandi
- [x] Ayni smoke TR + EN locale kapsamiyla genisletildi; EN seeded content route'lari ve locale-specific sitemap slug coverage'i dogrulandi
- [x] Frontend public API kontratlari backend ile hizalandi:
  - custom pages: `/custom_pages`
  - product detail: `item_type=kompozit`
  - gallery detail: `/galleries/:slug` + embedded `images`
- [x] `sitemap.xml` product/blog/gallery detail coverage'i locale bazli fetch ile dogrulandi; EN locale icin TR slug tekrar problemi kapatildi
- [x] Theme core selector specificity hatasi kapatildi; dark mode tekrar root token override ile aktif hale getirildi
- [x] Theme audit checklist `THEMA.md` icine yazildi ve layout/home/footer/floating actions katmani token utility'lerine gore normalize edildi
- [x] Theme regression check sertlestirildi (`check-theme-tokens.mjs`)
- [x] Browser-level theme verification yapildi; dev server'da theme toggle'in gercekten `light -> dark` body renklerini degistirdigi olculdu
- [x] Dev hydration mismatch icin runtime audit yapildi; stale `.next/dev` cache temizlenip fresh `next dev` ile header/theme bundle uyumu yeniden kuruldu
- [x] Theme semantic token'lari base palette katmanindan ayrildi; dark mode'da sadece scrollbar degisme problemi kapatildi
- [x] Theme audit Phase 1 tamamlandi: `prose` alanlari token-aware `prose-theme` utility'sine tasindi, dark panel shadow utility'leri eklendi, raw CTA color kullanimlari temizlendi
- [x] Theme audit Phase 2 tamamlandi: contact/offer/form/listing/layout alanlari ortak surface utility'lerine gore normalize edildi
- [x] Icerik kalite Phase 1 tamamlandi: homepage/about/contact/offer TR/EN copy setleri ticari ve teknik ton bakimindan rafine edildi
- [x] Icerik kalite Phase 2 tamamlandi: product/blog fallback setleri guclendirildi, gallery icin fallback icerik ve preview coverage eklendi
- [x] SEO copy Phase tamamlandi: title/description metadata'lari landing ve detail sayfa niyetlerine gore son kez standardize edildi
- [x] SEO final smoke tamamlandi: `test:seo`, `test:release` ve Lighthouse representative run'lari temiz
- [x] `audit:crawl` standalone production server uzerinden stabilize edildi; locale-detail alternates duzeltildi ve rapor temizlendi
- [x] Standalone calisma akisi icin asset-prepare adimi zorunlu hale getirildi (`start:standalone`)
- [x] `robots.txt` endpoint render dogrulandi
- [x] `sitemap.xml` endpoint render dogrulandi
- [x] `/` canonical ve hreflang davranisi kontrol edildi
- [x] `/en` locale output kontrol edildi
- [x] Header/menu ve footer icin SEO-safe fallback internal link yapisi eklendi
- [x] File-based `opengraph-image`, `twitter-image`, `icon`, `apple-icon` ve `manifest` route'lari eklendi
- [x] Blog detail etkileşim katmanı eklendi:
  - kapak gorseli fallback'i
  - yorum listesi + yorum gonderim formu
  - kalici begeni sayaci
- [x] Backend tarafinda generic `content_reaction_totals` tablosu ve `/content_reactions` public endpoint'i eklendi
- [x] Blog seed verileri placeholder gorseller ve Turkce karakterli icerikle guncellendi
- [x] Blog yorum gonderiminde reCAPTCHA zorunlu hale getirildi; frontend explicit widget token'i backend public review endpoint'inde verify ediliyor
- [x] Blog detail sayfasina sosyal medya paylasim componenti import edilip kullanildi
- [x] Admin panelde `Kompozit Blog Yorumlari` kisayolu ve `custom_page` hedef filtresi ile moderation akisi baglandi
- [x] Kompozit site settings izole edildi:
  - backend public `site_settings` endpoint'lerinde `prefix=kompozit__` key resolution aktif
  - kompozit frontend `seo`, `site_logo`, `contact_info` gibi ayarlari namespaced key'lerden okuyor
  - kompozit locale listesi `kompozit__app_locales` ile ayrildi
  - default locale artik admin panelde ortak ayar degil, proje frontend fallback'i
  - admin `brand=kompozit` modunda `general`, `seo`, `brand_media`, `locales` tablari namespaced key'lere yazar
  - ortak altyapi sekmeleri kompozit modunda gizlenir, boylece Ensotek global ayarlari etkilenmez
  - detail edit sayfasi da `brand=kompozit` query'sini korur ve prefix-aware load/save/delete yapar
  - liste ve detail header'larinda `KOMPOZIT Scope` / `Scope: kompozit__` badge'leri ile tenant context'i gorunur hale getirildi
- [x] Shared tenant yaklasimi yerine monorepo split baslatildi:
  - `kompozit_admin_panel` olusturuldu
  - `kompozit_backend` olusturuldu
  - root workspace scriptleri yeni uygulamalari kapsayacak sekilde guncellendi
- [x] `kompozit_admin_panel` ilk temizlik batch'i tamamlandi:
  - kompozit branding ve login copy ayrildi
  - kompozit odakli sidebar + dashboard filtreleri eklendi
  - route gate ile yalnizca kompozit ekranlari render edilir hale getirildi
  - kompozit disi ilk route batch'i ve `user-roles` liste route'u fiziksel olarak kaldirildi
- [x] `kompozit_backend` ilk buyuk prune batch'i tamamlandi:
  - kompozit disi router register'lari bootstrap'ten cikarildi
  - `chat`, `catalog`, `faqs`, `footerSections`, `newsletter`, `sites`, `projects`, `slider`, `support` fiziksel olarak kaldirildi
  - `telegram` router/admin akislari cikarildi, gecici no-op notifier stub'i birakildi
- [x] `kompozit_backend` ikinci prune batch'i tamamlandi:
  - `services` modulu tamamen kaldirildi
  - `ip-blocklist` modulu tamamen kaldirildi
  - `offer` semasi `services` foreign key'inden ayrildi
  - `offer` servis katmani product-only PDF context'e indirildi
  - prune sonrasi `npm run build` tekrar basarili calisti
- [x] `kompozit_backend` ucuncu prune batch'i tamamlandi:
  - `mail` modulu tamamen kaldirildi
  - `email-templates` modulu tamamen kaldirildi
  - `auth`, `contact` ve `offer` icin yeni `src/core/kompozit-mail.ts` helper'i eklendi
  - welcome / password changed / contact / offer mail akisleri shared modul yerine kompozit helper'a tasindi
- [x] `kompozit_admin_panel` temizlik batch'i devam etti:
  - `email-templates`, `mail` ve `footer-sections` icin route-disinda kalan olu wrapper/component dosyalari silindi
  - `hooks.ts` icinden `mail_admin` ve `email_templates_admin` export'lari kaldirildi
  - SMTP settings tab'i test-gonder davranisindan cikarilip yalnizca ayar yoneten dar yuzeye indirildi
- [x] `kompozit_admin_panel` route temizligi derinlestirildi:
  - kompozit disi route klasorlerinin altinda kalan son TS/TSX dosyalari da fiziksel olarak silindi
  - boylece silinen shared ekranlar artik sadece route gate ile degil, dosya seviyesinde de panelden cikmis oldu
  - guncel `tsc` seti artik yalnizca yasayan kompozit modullerinde kalan implicit-any, auth zod uyumsuzlugu ve eksik `@radix-ui/react-select` bagimliligina indi
- [x] `kompozit_admin_panel` teknik borcunun bu batch'i kapatildi:
  - `@radix-ui/react-select` bagimliligi eklendi
  - auth formlarindaki Zod resolver uyumsuzlugu giderildi
  - `bun x tsc --noEmit` tekrar basarili hale getirildi
- [x] `kompozit_backend` fiziksel prune temizligi tamamlandi:
  - prune edilen shared modul klasorlerinin son dosya kalintilari da silindi
  - `chat`, `catalog`, `db_admin`, `email-templates`, `faqs`, `footerSections`, `ip-blocklist`, `mail`, `newsletter`, `projects`, `services`, `sites`, `slider`, `support` klasorleri fiziksel olarak bos hale getirildi
- [x] `kompozit_backend` auth role sadeleştirme batch'i baslatildi:
  - `users.role` alani schema'ya eklendi
  - `309_kompozit_auth_role_patch.sql` yazildi ve yerel DB'ye uygulandi
  - auth signup/login/google ve admin user akislarinda rol kaynagi `userRoles` yerine `users.role` oldu
  - admin guard da `users.role` fallback'i ile calisacak sekilde guncellendi
  - artik kullanilmayan `src/modules/userRoles/*` dosyalari fiziksel olarak da silindi
- [x] `kompozit_backend` profile sadeleştirme batch'i tamamlandi:
  - auth yardimcisi ayrik `profiles` tablosu yerine `users.full_name` ve `users.phone` alanlarini senkronize eder hale getirildi
  - user silme akisindan `profiles` cleanup'i cikarildi
  - artik kullanilmayan `src/modules/profiles/*` dosyalari fiziksel olarak silindi
  - bu sadeleştirme sonrasi backend build tekrar basarili calisti
- [x] `kompozit_backend` operasyonel ayrim batch'i tamamlandi:
  - seed runner'a `--profile=kompozit` eklendi
  - `db:seed` ve `db:seed:nodrop` varsayilan olarak kompozit zincire alindi
  - `db:seed:full` ve `db:seed:full:nodrop` shared tam zincir icin ayri tutuldu
  - `.env.example`, `.env.production`, `Dockerfile`, `docker-compose.yml` ve `ecosystem.config.cjs` kompozit domain/port/process kimligiyle hizalandi
- [x] `kompozit_admin_panel` operasyonel ayrim batch'i tamamlandi:
  - `.env.example` ve `.env.production` eklendi
  - `fetch-branding`, `metadataBase` ve `next.config.mjs` `8186` backend / `panel.moekompozit.com` hedefine gore duzeltildi
  - `ecosystem.config.cjs`, `Dockerfile`, `docker-compose.yml` ve `.dockerignore` eklendi
  - `bun x tsc --noEmit` ve `bun run build` tekrar basarili hale getirildi
- [x] Docker/deploy temizlik turu tamamlandi:
  - `kompozit_backend` Dockerfile'inda lockfile varsayimi kaldirildi
  - `kompozit_backend/docker-compose.yml` YAML indent kirigi duzeltildi
  - `kompozit_admin_panel` ve `kompozit_backend` compose parse kontrolleri temiz gecti

## Final Recommendation

Bu repo SEO acisindan "iyi temel, eksik mimari kararlar" seviyesinde. En buyuk kaldirac P0 alanlarinda:

- default locale URL stratejisini temizlemek,
- EN locale'i gercekten ayaga kaldirmak,
- sitemap kapsam ve metadata standardini tamamlamak.

Bu 3 alan duzelmeden daha ileri schema veya content calismalari sinirli getiri saglar.
