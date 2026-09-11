# K23 — MOE hero: gerçek ürün mozaiği (11 Eylül 2026)

**İstek (kullanıcı):** Hero'da stok karbon kumaş görseli yerine MOE'nin kendi ürünlerini gösteren bir tasarım.

**Tasarım:** Sol metin/CTA korunur. Sağda `HeroProductShowcase` (sunucu bileşeni, JS yok): farklı kategorilerden öne çıkan
3 ürün (1 büyük + 2 kare kart: görsel, kategori etiketi, ad, sıra numarası, ok), üstte "Ürün Gruplarımız" ve
"N ürünün tümünü gör" bağlantısı, altta kategori çipleri (`/products?category=slug`). Veri `GET /products?item_type=kompozit`
(limit 24) — ürün/marka adı kodda yok; API boşsa locale fallback ürünleri, 2'den az ürün varsa eski statik görsel.
Görseller `next/image` optimizer ile AVIF (lunapark 575 KB JPG → 640 px AVIF); ilk kart `priority`/`fetchpriority=high`.

**Dosyalar:** `kompozit/frontend/src/components/sections/HeroProductShowcase.tsx`, `home-hero.module.css` (mozaik stilleri),
`src/app/[locale]/page.tsx`, `public/locales/{tr,en}.json` (`home.hero.showcase*`). Commit `c43e9d0` (`[skip ci]`).

**Kabul (`scripts/accept-moe-hero-showcase.py`):**

| Ortam | Sonuç |
|---|---|
| Yerel aday :3320 (görseller canlıya proxy) | PASS — `candidate-realimg-*.png`, `candidate-acceptance.json` |
| Canlı masaüstü 1440 koyu/açık | PASS — 3 kart, ilk görsel fetchpriority=high, 8 bağlantı 200, yatay taşma yok, JS hatası yok — `live-desktop-{dark,light}.png` |
| Canlı mobil 390 | PASS — büyük kart 342×214, kare kartlar 166×166 — `live-mobile-dark.png`, `live-acceptance.json` |

Kapılar: `build-checklist-production.sh kompozit` (72 URL, yerel endpoint yok — `build.log`), tsc (yalnız önceden var olan `bun:test` tip hatası),
lint 0 hata / 2 eski uyarı, `test:theme`, `test:release` geçti.

Canlı: `deploy-checklist-frontend.sh kompozit`; rollback `.next/standalone.before-checklist-20260911T140020Z`. Beş kaynak dosya canlı
checkout ile hash eşit; öncekiler `/var/backups/ensotek-checklist/kompozit-hero-20260911/`. Canlı checkout `git pull` yapılmadı (145 yerel değişiklik).

Not: Yerel adayda `/uploads` bulunmadığı için görseller kırık çıkar; kabul betiği üçüncü argümanla optimizer isteklerini canlıya yönlendirir.
Ürün sırası API `order_num` sıralamasına bağlıdır; admin panelden öne çıkan/sıra değiştirilirse hero da değişir.

**Mobil Lighthouse 12.8.2 (canlı, iki ardışık koşu, `lighthouse-mobile-{1,2}.json`):** performans **92 / 91**, LCP **2,6 / 2,7 sn**,
TBT 260 / 270 ms, CLS 0, FCP 1,4 sn; A11y/BP/SEO 100. LCP elementi ilk ürün kartı görseli (`fetchpriority=high`). Önceki hero
ile son ölçüm 90 puan / LCP 3,173 sn idi; laboratuvar örneğidir, gerçek kullanıcı CWV kabulü değildir. PSI API günlük kotası dolu olduğundan alan verisi alınmadı.
