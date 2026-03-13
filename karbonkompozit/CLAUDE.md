# CLAUDE.md — karbonkompozit

## Proje Ozeti

`karbonkompozit`, MOE Kompozit icin gelistirilen Next.js tabanli kurumsal tanitim + teklif toplama frontend'idir.
Ana hedefler:

- teknik SEO uyumlu sayfa yapisi
- cok dilli icerik
- token tabanli tema yonetimi
- tekrar eden sayfa pattern'lerinde tutarlilik

## Zorunlu Calisma Kurallari

- Her yeni sayfa veya section once mevcut SEO pattern'i ile hizalanir.
- Metadata, canonical, hreflang, robots ve JSON-LD mantigi helper seviyesinde tekrar kullanilir; sayfa icinde yeniden icat edilmez.
- Query parametreli indeks riski olan URL'lerde canonical temiz path'e doner; gerekiyorsa `noindex,follow` kullanilir.
- Icerik geldikce her locale ayni component pattern'i kullanir; locale bazli fark sadece veri ve mesaj katmaninda olur.

## SEO Pattern Contract

Her indekslenebilir sayfa icin asagidakiler kontrol edilmeden is tamamlanmis sayilmaz:

- `generateMetadata`
- canonical
- hreflang + `x-default`
- uygun `robots`
- uygun Open Graph / Twitter alanlari
- gerekiyorsa JSON-LD
- bos veri durumunda kontrollu UI

Varsayilan pattern:

- static/listing page: `buildPageMetadata({ locale, pathname, title, description })`
- detail page: `buildPageMetadata({ locale, pathname, title, description, ogImage })`
- query-driven SEO riskli page: `buildPageMetadata({ ..., noIndex: true })`

## Media SEO Contract

Product, gallery ve blog gorselleri icin asagidaki kurallar gecerlidir:

- `alt` metni title-only fallback olarak birakilmaz; `src/lib/media-seo.ts` icindeki helper ile anlamsal fallback uretilir.
- `caption` varsa title tekrar etmez; yoksa uygun durumlarda description'dan kontrollu fallback uretilir.
- Gorsel `width` ve `height` alanlari API'den geliyorsa kullanilir; gelmiyorsa tek bir merkezi fallback uygulanir.
- `updated_at` alanlari sitemap, schema ve medya auditlerinde kalite sinyali olarak izlenir.
- Listeleme ve detail sayfalari ayni media helper pattern'ini kullanir.
- Product, gallery ve blog detail URL'leri image sitemap kapsaminda ilgili gorsel URL'lerini tasir.
- Gallery cover veya image verisi bos geldiginde kontrollu placeholder gorsel kullanilir.

### Alt Text Standardi

- Once veri tabanindan gelen ozel `alt` kullanilir.
- `alt` zayifsa, baslik + anlamsal baglam ile yeni bir alt uretilir.
- `image`, `photo`, `gorsel`, sadece title veya benzeri jenerik metinler kabul edilmez.
- Nihai alt metin kisa, ayirt edici ve icerik baglamini anlatan formda kalir.

### File Naming Standardi

- Yeni product/gallery gorselleri kebab-case dosya adi ile yuklenir.
- Dosya adi icerisinde ana konu ve varyant bulunur:
  - `karbon-plaka-panel-01.jpg`
  - `ctp-boru-uretimi-02.webp`
- `img123`, `photo-final`, `ekran-goruntusu` gibi anlamsiz adlar kullanilmaz.

## Test Beklentisi

SEO ile ilgili her anlamli degisiklikte en az su kontroller yapilir:

1. `npm run build`
2. route bazli HTML smoke check
3. canonical / hreflang / robots kontrolu
4. locale output kontrolu
5. sitemap veya metadata etkileniyorsa endpoint kontrolu

Tercih edilen test katmanlari:

- smoke: `curl` ile rendered HTML kontrolu
- build validation: `npm run build`
- daha sonra eklenecek otomasyon: `test:seo`, `test:theme`, `test:smoke`
- media contract: `npm run test:media`
- veri kalitesi auditi: `npm run audit:media`
- full crawl raporu: `npm run audit:crawl`
- Lighthouse SEO assertion: `npm run audit:lighthouse`

## Monitoring Contract

- 404 ve soft-404 sinyalleri `SeoIssueBeacon` ile `/api/monitoring/seo-issues` endpoint'ine gonderilir.
- `SEO_MONITORING_WEBHOOK_URL` tanimliysa issue payload'i harici monitoring aracina da forward edilir.
- Release once [docs/SEO_RELEASE_CHECKLIST.md](/home/orhan/Documents/Projeler/Ensotek/karbonkompozit/docs/SEO_RELEASE_CHECKLIST.md) uygulanir.
- Search Console teslimi icin [docs/SEARCH_CONSOLE_SUBMIT_CHECKLIST.md](/home/orhan/Documents/Projeler/Ensotek/karbonkompozit/docs/SEARCH_CONSOLE_SUBMIT_CHECKLIST.md) kullanilir.

## Theme Token Contract

Bu repo artik token-first tema yapisi kullanir.
Referans intent: `prime-b2b-neutral-primary-accent`
Aktif template: `moe-carbon-industrial`

### Tema Kural Seti

- Raw hex renkler component icinde kullanilmaz.
- Tum yeni UI renkleri semantic token ile verilir.
- Mevcut legacy token'lar sadece gecis katmani olarak tutulur.
- Light/dark mode ayni semantic token isimlerini kullanir; component mode'a gore renk secmez, token secer.
- Yeni componentlerde once semantic token tercih edilir:
  - `--color-bg`
  - `--color-bg-secondary`
  - `--color-bg-muted`
  - `--color-text-primary`
  - `--color-text-secondary`
  - `--color-border`
  - `--color-brand`
  - `--color-brand-dark`
  - `--color-accent`
  - `--color-success`

### Token Gruplari

- neutral: layout, text hierarchy, border
- primary: ana CTA ve aktif durumlar
- accent: destekleyici vurgu ve dark surface
- surface: page / card / dark section
- status: success / warning / danger

### Uygulama Kurali

- Tema kaynak noktasi: [src/styles/globals.css](/home/orhan/Documents/Projeler/Ensotek/karbonkompozit/src/styles/globals.css)
- Template kimligi: [src/theme/templates.ts](/home/orhan/Documents/Projeler/Ensotek/karbonkompozit/src/theme/templates.ts)
- Layout, `data-theme-template` ve `data-theme-intent` attribute'larini set eder.
- Theme mode, `data-theme-mode="light|dark"` ile root seviyesinde yonetilir.
- Theme core dosyalari:
  - [src/lib/preferences/theme.ts](/home/orhan/Documents/Projeler/Ensotek/karbonkompozit/src/lib/preferences/theme.ts)
  - [src/lib/preferences/theme-utils.ts](/home/orhan/Documents/Projeler/Ensotek/karbonkompozit/src/lib/preferences/theme-utils.ts)
  - [src/scripts/theme-boot.tsx](/home/orhan/Documents/Projeler/Ensotek/karbonkompozit/src/scripts/theme-boot.tsx)
- Gelecekte ikinci bir template eklenirse yeni token seti ayni semantic isimleri korumak zorundadir.

### Dark Surface Contract

- Koyu zeminli section'larda `surface-dark-heading`, `surface-dark-text` ve `surface-dark-panel` utility'leri kullanilir.
- Dark section icinde baslik/paragraf rengi local class veya global heading rule'a birakilmaz.
- Hero, footer ve dark CTA alanlari bu contract'in referans uygulamasidir.

## Prime Frontend Alignment

`prime-frontend-nextjs` icindeki ana prensip bu repo icin de gecerlidir:

- neutral / primary / accent ayrimi
- 80 / 10 / 10 renk dengesi
- theme token'lar component seviyesinde sabit renklerin onune gecer
- tasarim kararlari generic degil, bilincli olur

Bu nedenle:

- yeni renk eklemek yerine mevcut semantic token ailesi genisletilir
- component icinde `bg-white`, sabit hex veya rastgele renk ailesi kullanimi sinirli tutulur
- gerekirse once token eklenir, sonra component kullanir

## Delivery Rule

Asagidaki dosyalar birbirinden kopuk guncellenmez:

- `CLAUDE.md`
- `IMPLEMENTATION_PLAN.md`
- `src/styles/globals.css`
- `src/theme/templates.ts`

Tema sistemi, SEO pattern'i veya sayfa standardi degisirse bu dosyalar birlikte guncellenir.
