# THEMA.md

## Amac

Bu dokuman, `/home/orhan/Documents/Projeler/Ensotek/admin_panel` icindeki tema sistemini referans alarak
`karbonkompozit` projesinde kurulacak tema mimarisinin temel contract'ini tanimlar.

Hedef:

- light / dark mode'u ilk boyamada dogru uygulamak
- semantic token katmanini sabitlestirmek
- preset/template mantigini rastgele renk degisimi degil, kontrollu override olarak kurmak
- component seviyesinde hardcoded surface/text kullanimini engellemek

## Admin Panel Referansi

Admin paneldeki tema sistemi su parcalardan olusuyor:

- Global token kaynagi:
  - [globals.css](/home/orhan/Documents/Projeler/Ensotek/admin_panel/src/app/globals.css)
- Theme mode ve preset sabitleri:
  - [theme.ts](/home/orhan/Documents/Projeler/Ensotek/admin_panel/src/lib/preferences/theme.ts)
- Theme apply utility'leri:
  - [theme-utils.ts](/home/orhan/Documents/Projeler/Ensotek/admin_panel/src/lib/preferences/theme-utils.ts)
- Pre-hydration boot:
  - [theme-boot.tsx](/home/orhan/Documents/Projeler/Ensotek/admin_panel/src/scripts/theme-boot.tsx)

## Admin Panelden Alinacak Dogru Prensipler

### 1. Theme mode bir state degil, root contract olmali

Admin panel `light` / `dark` modunu `html` class seviyesinde uygular.
Bu dogru yaklasimdir, cunku:

- hydration sonrasi degil once devreye girer
- flicker azalir
- form kontrolleri ve native UI `color-scheme` ile hizalanir

`karbonkompozit` icin kural:

- root seviyede tek kaynak: `html[data-theme-mode="light|dark"]`
- `document.documentElement.style.colorScheme` ayni anda set edilir

### 2. Semantic token katmani zorunlu

Admin panelde `--background`, `--foreground`, `--card`, `--primary`, `--border` gibi semantic tokenlar var.
Bu, component'in mode veya preset detayini bilmeden calismasini saglar.

`karbonkompozit` icin zorunlu semantic katman:

- `--color-bg`
- `--color-bg-secondary`
- `--color-bg-muted`
- `--color-bg-dark`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-muted`
- `--color-text-on-dark`
- `--color-border`
- `--color-border-strong`
- `--color-brand`
- `--color-brand-light`
- `--color-brand-dark`
- `--color-accent`
- `--color-success`

### 3. Preset/template override root attribute ile yapilmali

Admin panelde preset secimi `data-theme-preset` ile yapiliyor.
Bu sayede:

- token isimleri degismiyor
- sadece token degerleri override oluyor
- component kodu degismeden farkli gorunus elde ediliyor

`karbonkompozit` icin kural:

- `data-theme-template` mevcut kalir
- ileride `data-theme-preset` eklenebilir
- component tarafinda preset kontrolu yapilmaz

### 4. Pre-hydration boot script zorunlu

Admin panelin en saglam parcasi budur:

- mode
- preset
- font
- layout tercihi

hydrate olmadan once root'a uygulanir.

`karbonkompozit` icin minimum boot contract:

- `theme-mode`
- ileride gerekirse `theme-preset`
- `color-scheme`

### 5. Apply utility gerekli

Admin panelde mode degistirme logic'i tek utility ile yapiliyor:

- `applyThemeMode`
- `applyThemePreset`

`karbonkompozit` icin de ayni prensip gereklidir:

- DOM manipülasyonu component icine dagitilmaz
- tek utility veya tek provider uzerinden uygulanir

## Admin Panelden Aynen Alinmayacak Seyler

Admin panelde dogru mimari ile birlikte karisik bir gecis alani da var.
Ozellikle bazi eski ekranlarda:

- `bg-light`
- `text-dark`
- `table-light`
- `badge bg-light`

gibi bootstrap-tabanli veya hardcoded class'lar mevcut.

Bu kisim referans alinmayacak.

`karbonkompozit` icin kati kural:

- `bg-white` benzeri sabit light surface yok
- `bg-light`, `text-dark`, `table-light` gibi legacy pattern yok
- `bg-black` / `text-white` sadece dark glass veya medya overlay gibi bilincli istisnalarda kullanilir

## Karbonkompozit Icin Hedef Mimari

### Katman 1: Primitive tokenlar

Bu katman marka veya neutral paleti temsil eder:

- neutral
- primary
- accent
- status

Bu tokenlar component tarafinda dogrudan kullanilmaz.

### Katman 2: Semantic tokenlar

Uygulama sadece semantic token kullanir:

- page surface
- card surface
- muted surface
- dark surface
- primary text
- secondary text
- border
- brand

### Katman 3: Surface utility contract

Tekrar eden UI yuzeyleri icin ortak utility siniflari zorunludur:

- `surface-card`
- `surface-card-muted`
- `surface-glass-dark`
- `surface-dark-shell`
- `surface-brand-cta`
- `surface-dark-heading`
- `surface-dark-text`
- `surface-dark-panel`
- `media-overlay`
- `media-overlay-title`
- `media-overlay-text`

Yeni card ve section'lar once bu utility'lerden biriyle baslar.

### Katman 4: Theme mode

Mode override sadece root seviyede olur:

- `html[data-theme-mode="light"]`
- `html[data-theme-mode="dark"]`

Component asla `if (dark)` gibi logic yazmaz.

### Katman 5: Template / preset

Ileride tasarim varyanti gerekirse:

- `data-theme-template="moe-carbon-industrial"`
- opsiyonel `data-theme-preset="default|dense|editorial|industrial"`

Preset, semantic tokenlari override eder.

## Uygulama Kurallari

### 1. Component dark/light bilmez

Yanlis:

- `dark:bg-slate-900`
- `bg-white dark:bg-slate-900`

Dogru:

- `bg-[var(--color-bg-secondary)]`
- `text-[var(--color-text-primary)]`

### 2. Surface secimi ortak utility ile yapilir

Yanlis:

- her kartta farkli border/bg kombinasyonu

Dogru:

- `surface-card`
- `surface-card-muted`

### 3. Dark hero / footer gibi alanlar ayri contract ister

Koyu zeminli section'larda:

- baslik `surface-dark-heading`
- paragraf `surface-dark-text`
- panel `surface-dark-panel`

Bu alanlarda global heading kurali veya generic text rengi yeterli sayilmaz.

### 4. Theme toggle sadece root state degistirir

Toggle'in isi:

- `data-theme-mode` degistirmek
- `color-scheme` degistirmek
- tercihi persist etmek

Toggle'in isi olmayan sey:

- component class manipülasyonu
- sayfa bazli tekil renk degistirme

### 6. Pattern katalogu component olarak yasar

Theme contract sadece CSS utility ile sinirli kalmaz; tekrar eden section kaliplari component'e tasinmalidir.

Ilk katalog:

- `SectionHeader`
- `FeatureCard`
- `MediaOverlayCard`
- `DarkCtaPanel`
- `ListingCard`
- `BrandCtaPanel`
- `LinkListPanel`
- `ContentPageHeader`
- `InfoListPanel`

Bu component'ler:

- semantic token disina cikmaz
- raw color kullanmaz

## Theme Audit Checklist

Bu checklist her page/layout/component turunda uygulanir:

- Root contract:
  - `html[data-theme-mode]` calisiyor mu
  - `color-scheme` mode ile senkron mu
  - light selector dark mode'u specificity ile eziyor mu
- Layout:
  - header, footer, mobile menu, language switcher ve floating actions semantic token kullaniyor mu
  - dark section hover/link renkleri token utility ile geliyor mu
- Page surfaces:
  - page background, section background, card surface, muted surface semantic token ile tanimli mi
  - hero / CTA / footer gibi koyu alanlar `surface-dark-*` utility uzerinden mi ilerliyor
- Component contract:
  - `bg-white`, `text-white`, `dark:*`, legacy `slate/brand/carbon` alias kullanimlari yok mu
  - raw border/bg/text kombinasyonu yerine ortak utility kullaniliyor mu
- Locale parity:
  - ayni page TR/EN locale'de ayni theme contract ile render oluyor mu
- Release:
  - `npm run test:theme`
  - `npm run build`

## Son Theme Core Duzeltmesi

Tema core'da dark mode'u bozan kritik bir selector problemi kapatildi:

- eski problem:
  - `:root[data-theme-preset='default']` selector'u dark mode selector'unden daha yuksek specificity tasiyordu
  - bu nedenle dark token override'lari beklenen sekilde devreye girmiyordu
- uygulanan duzeltme:
  - light mode root selector'u `html[data-theme-mode='light'], :root:not([data-theme-mode])` seklinde sadelelestirildi
  - dark mode tekrar tek kaynak olarak `html[data-theme-mode='dark']` uzerinden calisiyor

## Audit Sirasi

Tema audit'i su sirayla ilerlemeli:

1. root / layout
2. homepage
3. listing pages
4. detail pages
5. forms
6. utility/floating widgets
7. metadata image routes disindaki tum UI bileşenleri
- yeni landing page ve listing'lerde ilk tercih olur

Ornek uygulama alanlari:

- ana sayfa section basliklari
- why-us kartlari
- gallery/media kartlari
- koyu teklif CTA alanlari
- product/blog listing kartlari
- detail sayfa teklif panelleri
- related content link bloklari
- kurumsal icerik sayfa basliklari
- about/contact/offer bilgi listeleri

### 5. Theme testi zorunlu

Theme smoke test su hatalari yakalamali:

- raw hex
- legacy alias (`--slate-*`, `--brand-*`, `--carbon-*`)
- hardcoded `bg-white`
- mode'a ozel sabit surface kullanimi

Release smoke test su kontrolleri de kapsamalidir:

- build sonrasi kritik route'larda `data-theme-template` ve `data-theme-mode` contract'i
- ana route'larda 200 response
- `robots.txt` ve `sitemap.xml` response/icerik kontrolu
- canonical gibi temel metadata sinyallerinin HTML icinde varligi

## Karbonkompozit Icin Adaptasyon Plani

### Phase A

- admin paneldeki boot mantigina benzer tek bir theme boot utility'si kur
- `data-theme-mode` + `color-scheme` contract'ini sabitle

### Phase B

- tum reusable surface'leri utility katmanina tasi
- hero, CTA, footer, kartlar ve formlar ayni surface contract'ini kullansin

### Phase C

- `data-theme-template` ve gerekiyorsa `data-theme-preset` ayrimini netlestir
- preset gelirse yalnizca semantic token override etsin

### Phase D

- theme smoke test'i sertlestir
- plain `bg-white` ve benzeri light-biased surface'leri fail ettir

## Bu Dokumana Gore Bir Sonraki Is

`karbonkompozit` projesinde admin panel referansli asagidaki refactor yapilacak:

1. Theme boot ve toggle contract'ini admin panel seviyesinde tutarli hale getirmek
2. Semantic token ve surface utility sistemini tamamlamak
3. Hero dahil tum temel section'lari bu contract'a gore yeniden hizalamak
