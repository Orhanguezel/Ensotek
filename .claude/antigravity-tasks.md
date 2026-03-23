# Antigravity AI — Ensotek Gorsel & UI Kontrol Gorevleri

> Tarih: 2026-03-22
> Oncelik: Paralel calisma — Claude Code yapisal duzeltmeler yaparken Antigravity gorsel kontrol yapar

---

## GOREV 1: de_frontend — Lighthouse & Core Web Vitals Audit

**URL**: https://ensotek.de
**Diller**: /de, /en, /tr

### Kontrol Listesi
- [ ] Her 3 dil icin anasayfa Lighthouse skoru al (Performance, SEO, Accessibility, Best Practices)
- [ ] LCP (Largest Contentful Paint) — hedef <2.5s
- [ ] CLS (Cumulative Layout Shift) — hedef <0.1
- [ ] FID/INP — hedef <200ms
- [ ] Mobile vs Desktop skor farki raporu
- [ ] Gorsel: body-bg.png (9.7MB) yukleme etkisini olc
- [ ] FontAwesome CSS (456KB) render-blocking etkisi
- [ ] Bootstrap CSS (192KB) render-blocking etkisi

### Cikti
Lighthouse JSON raporu + screenshot'lar (before state)

---

## GOREV 2: de_frontend — Sayfa Bazli Gorsel Kontrol

**Kontrol Edilecek Sayfalar** (her biri /de, /en, /tr):

| Sayfa | URL | Kontrol |
|-------|-----|---------|
| Anasayfa | / | Hero slider, urun carousel, CTA butonlari |
| Hakkimizda | /about | Takim fotolari, layout |
| Urunler | /product | Kart grid, filtreleme, pagination |
| Urun Detay | /product/[slug] | Gorsel galeri, tab'lar, specs tablo |
| Hizmetler | /service | Servis kartlari, ikon'lar |
| Iletisim | /contact | Form layout, harita, validasyon |
| Blog | /blog | Liste grid, tarih formati, gorsel |
| SSS | /faqs | Accordion acilma/kapanma |
| Referanslar | /references | Logo grid, musteri kartlari |
| Kutupahne | /library | Dokuman kartlari, indirme butonlari |

### Kontrol Kriterleri
- [ ] Responsive: 375px (mobile), 768px (tablet), 1440px (desktop)
- [ ] Dil degistirme: icerik degisiyor mu, layout bozuluyor mu?
- [ ] Bos state: veri yoksa ne gorunuyor?
- [ ] Broken image: kirmizi X veya bos alan var mi?
- [ ] Overflow/scroll: yatay scroll olusuyor mu?
- [ ] Dark mode (varsa): renkler okunabiliyor mu?
- [ ] Font yuklenmeden once FOUT/FOIT gorunuyor mu?

### Cikti
Sayfa basi 3 screenshot (mobile/tablet/desktop) + sorun listesi

---

## GOREV 3: kuhlturm-frontend — UI Tutarlilik Kontrolu

**URL**: localhost:3010 (veya deploy edilmisse kuhlturm.com)

### Kontrol Listesi
- [ ] Anasayfa hero bolgesi: gorsel, baslik, CTA
- [ ] Header/Footer: responsive, menu acilma/kapanma
- [ ] Urun listesi: kart tasarimi, hover efektleri
- [ ] Detay sayfasi: gorsel galeri, breadcrumb
- [ ] Iletisim formu: validasyon mesajlari gorsel uyumu
- [ ] Catalog/Offer modal: form alanlari, gonder butonu
- [ ] 404 sayfasi: tasarim var mi?

### de_frontend ile Karsilastirma
- [ ] Marka tutarliligi: logo, renkler, tipografi
- [ ] Navigation yapisi benzer mi?
- [ ] Footer yapisi benzer mi?
- [ ] CTA buton stilleri tutarli mi?

### Cikti
Karsilastirma tablosu + uyumsuzluk screenshot'lari

---

## GOREV 4: Admin Panel — UI & UX Kontrolu

**URL**: localhost:3000 (dev) veya admin.ensotek.de

### Kontrol Listesi

#### Genel Layout
- [ ] Sidebar: tum gruplar aciliyor mu, icon'lar gorunuyor mu?
- [ ] Sidebar collapse: icon modunda okunabiliyor mu?
- [ ] Header: kullanici menu, bildirimler, dil secici
- [ ] Responsive: tablet ve mobilde sidebar davranisi
- [ ] Theme: light/dark gecisi, renkler okunabiliyor mu?

#### Icerik Sayfalari (ornekler)
- [ ] Products listesi: tablo, siralama, arama, pagination
- [ ] Product edit formu: gorsel yukleme, coklu dil tab'lari, JSON editor
- [ ] Site Settings: tab'lar arasi gecis, form kaydetme geri bildirimi
- [ ] Offers: PDF preview gorunuyor mu?
- [ ] Audit: grafik (Recharts), geo harita render
- [ ] Custom Pages: form layout, image column, sidebar column

#### Form & Interaction
- [ ] Toast notification'lar: basari (yesil), hata (kirmizi) gorsel farki
- [ ] Loading state: skeleton/spinner gorunuyor mu?
- [ ] Empty state: liste bossa ne gosteriyor?
- [ ] Error state: API hata mesaji kullaniciya nasil yansıyor?
- [ ] Drag & drop: siralama calisıyor mu? (slider, menu items)

#### i18n Gorsel Kontrol
- [ ] Dil secici (AdminLocaleSelect): dogru calisiyor mu?
- [ ] TR/EN/DE arasinda geciste form icerik degisiyor mu?
- [ ] Uzun Almanca metinler layout'u bozuyor mu?
- [ ] Sidebar label'lari: tum dillerde okunabiliyor mu?

### Cikti
Modul basi screenshot + bug/uyari listesi (severity: critical/major/minor)

---

## GOREV 5: Cross-Browser & Device Matrix

### Test Matrisi

| Tarayici | de_frontend | kuhlturm | admin_panel |
|----------|-------------|----------|-------------|
| Chrome (desktop) | [ ] | [ ] | [ ] |
| Firefox (desktop) | [ ] | [ ] | [ ] |
| Safari (macOS) | [ ] | [ ] | [ ] |
| Chrome (Android) | [ ] | [ ] | — |
| Safari (iOS) | [ ] | [ ] | — |

### Kontrol Noktalari
- [ ] CSS custom properties (Tailwind v4 tokens) render ediliyor mu?
- [ ] WebP/AVIF gorsel formati destekleniyor mu?
- [ ] Scroll davranisi (smooth scroll, sticky header)
- [ ] Modal/dialog: overlay, ESC ile kapanma
- [ ] Form autofill stilleri bozuk mu?

### Cikti
Browser basi pass/fail tablosu + sorunlu screenshot'lar

---

## RAPORLAMA FORMATI

Her gorev icin asagidaki format kullanilsin:

```
### [Gorev No] — [Sayfa/Modul Adi]
**Durum**: OK / Sorunlu / Kritik
**Screenshot**: [dosya adi veya link]

**Sorunlar**:
1. [Severity: Critical/Major/Minor] — Aciklama
   - Etkilenen: [device/browser/dil]
   - Beklenen: [ne olmali]
   - Gerceklesen: [ne oluyor]

**Oneriler**:
- ...
```

---

## ONCELIK SIRASI

1. **GOREV 1** (Lighthouse) — diger gorevler icin baseline olusturur
2. **GOREV 2** (de_frontend sayfalar) — template'e dokunmadan sorunlari tespit
3. **GOREV 4** (Admin panel) — aktif gelistirme, hizli fix imkani
4. **GOREV 3** (kuhlturm) — deploy sonrasi veya lokal test
5. **GOREV 5** (Cross-browser) — son asama, diger sorunlar cozuldukten sonra
