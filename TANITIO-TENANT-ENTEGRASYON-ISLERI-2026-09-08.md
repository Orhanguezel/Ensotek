# Tanitio tenant entegrasyonu — Ensotek tarafında yapılacaklar (2026-09-08)

Tanitio (sosyal medya paneli) tarafında Ensotek ailesinin **dört sitesi için de
tenant açıldı**. Profiller bu repodaki portföy dosyalarından ve canlı sitelerin
kendi HTML'inden dolduruldu. Bu belge, o çalışma sırasında **bu repoda
düzeltilmesi/eklenmesi gereken** işleri listeler.

| Tanitio tenant | Site | Bu repodaki proje |
|---|---|---|
| `ensotek` | ensotek.de | `ensotek_de` |
| `ensotek-comtr` | www.ensotek.com.tr | `ensotek_com_tr` |
| `karbonkompozit` | www.karbonkompozit.com.tr | `kompozit` |
| `kuhlturm` | kuhlturm.com | `kuhlturm` |

> Tanitio tarafındaki karşılık: `ekosistem-sosyal-medya` reposunda seed
> `350_ensotek_family_tenants.sql` + `351_ensotek_family_profiles.sql` ve
> durum raporu `ENSOTEK-AILESI-TENANT-DURUM-2026-09-08.md`.

---

## A. Düzeltilecek hatalar

### A1. kuhlturm.com'da sahte müşteri yorumları CANLIDA

**Yer:** `kuhlturm/backend/src/db/seed/sql/061_reviews_custom_pages.seed.sql:61`

Geliştirme verisi üretime çıkmış. Canlı sayfa kaynağında `is_approved: true`
işaretli yorumlar var:

```
Ahmet Yılmaz  / ahmet@example.com
Elif Şahin    / elif.sahin@example.com
Kemal Öz      / kemal.oz@example.com
```

Almanca pazara bakan bir sitede Türkçe isimli, `example.com` adresli **onaylı**
müşteri yorumları görünüyor. Bu yalnız kozmetik değil: sahte referans, gerçek
bir güven sorunu ve ziyaretçi fark ederse sitenin tamamının inandırıcılığını
düşürür.

**Yapılacak:** seed'deki demo yorumlar üretim seed'inden çıkarılmalı ya da
`is_approved = 0` olmalı; canlı veritabanındaki mevcut kayıtlar da temizlenmeli
(seed'i düzeltmek canlıdaki satırları silmez).

*Not: aynı sayfadaki `+49 000 000 0000` form **yer tutucusudur**, sorun değil —
kontrol edildi.*

### A2. ensotek.com.tr'de kırık YouTube bağlantısı

**Yer:** `ensotek_com_tr/frontend/src/components/layout/Footer.tsx:12`

```ts
{ label: 'YouTube', href: 'https://www.youtube.com/@ensotek' },
```

Bu adres **404** dönüyor (2026-09-08 doğrulandı). Aynı kırık bağlantı
ensotek.de'de de kayıtlı — muhtemelen ortak bir bileşenden/listeden geliyor,
tek yerde düzelir.

**Yapılacak:** kanalın gerçek adresi bulunup yazılmalı; kanal yoksa bağlantı
kaldırılmalı. Kırık sosyal bağlantı hem ziyaretçiyi hem Tanitio'nun hesap
envanterini yanıltıyor (bu yüzden tenant'a YAZILMADI).

### A3. kuhlturm.com — canonical ile yönlendirme çelişiyor, dağıtım env'i repodan farklı

Canlı site `kuhlturm.com/de` adresine yönlendiriyor, ama sayfadaki canonical
etiketi `https://www.kuhlturm.com/de` diyor. Arama motoru için belirsizlik:
yönlendirme apex'e, canonical www'ye işaret ediyor.

**Yer:** canonical `kuhlturm/frontend/src/app/[locale]/layout.tsx:73`
(`canonical: ${siteUrl}/${locale}`), `siteUrl` env'den geliyor.

Dikkat çeken nokta: repodaki `kuhlturm/frontend/.env.production` **apex**
diyor —

```
NEXT_PUBLIC_SITE_URL=https://kuhlturm.com
```

— ama canlı çıktı **www** üretiyor. Yani **dağıtımdaki env repodaki değerle
aynı değil.** Önce hangisinin doğru olduğuna karar verilmeli (tek kanonik host),
sonra yönlendirme + env + canonical üçü aynı hosta hizalanmalı.

---

## B. Tanitio'nun çalışması için eklenmesi gerekenler

Tenant'lar açıldı ama şu an **panel açılır, iş yapmaz.** Aşağıdakiler olmadan
içerik çekilemez ve yayın yapılamaz.

### B1. İçerik kaynağı ucu (en yüksek getirili iş)

Tanitio, sitenin makale ve ürünlerini çekip "Sosyal Medyada Paylaş" akışına
sokuyor. Kontrat: `ekosistem-sosyal-medya/CONTENT-SOURCE-API-KONTRATI.md`
(standart `/articles` + `/products`, `X-Api-Key` başlığı).

**İyi haber: sıfırdan iş değil.** Üç sitede de modüller zaten var —
`products` ve `news`/`blog` (`ensotek_com_tr/backend/uploads/{products,news}`,
`kompozit/backend/.../products`, `kuhlturm/frontend/src/app/[locale]/{blog,news}`).
Gereken, mevcut veriyi kontratın beklediği biçimde veren ince bir uç.

Üç site de aynı monorepo'da ve `packages/shared-backend` paylaşıyor —
**uç bir kez paylaşılan pakete yazılırsa üç sitede birden açılır.**

Her site için gereken: uç + tenant'a özel `X-Api-Key`. Anahtar Tanitio
tarafında `content_source/api_key` secret'ına yazılacak.

### B2. Ölçüm etiketleri

| Site | Bugün | Eksik |
|---|---|---|
| ensotek.com.tr | — | GTM **ve** GA4 |
| karbonkompozit | GTM-NCVJZX6H ✔ | GA4 ölçüm kimliği |
| kuhlturm.com | — | GTM **ve** GA4 |

- **ensotek.com.tr ve kuhlturm.com'da hiçbir ölçüm etiketi yok** — sayfa
  kaynağında `googletagmanager.com` ya da `gtag(` geçmiyor. Bu iki site şu an
  hiç ölçülmüyor.
- karbonkompozit'te GTM var; içindeki GA4 etiketinin ölçüm kimliği (G-…)
  Tanitio'ya yazılmalı.

Ayrıca üç site için de **Search Console mülkü** doğrulanmalı. GSC olmadan
Tanitio'nun SEO sayfaları ve Rakip Keşfi çalışmıyor (keşif sorgularını
GSC'den alıyor).

### B3. Sitede yayınlanmayan künye bilgileri

Aşağıdakiler sitelerde **hiç yayınlanmıyor**, bu yüzden tenant'a yazılamadı.
Uydurulmadı:

- **Açık posta adresi** — üç sitenin hiçbirinde yok. Yerel SEO ve künye
  alanları boş kalıyor.
- **kuhlturm.com'da Alman telefonu yok.** Almanca pazara bakan sitede yalnız
  +90 numaralar yayınlanıyor (`+90 212 613 33 01`, `+90 531 880 31 51`).
  Alman pazarında yerel numara olmaması dönüşümü doğrudan etkiler.
- **Yapısal veri (JSON-LD):** ensotek.com.tr ve karbonkompozit'te var,
  **kuhlturm'da hiç yok**. Organization/LocalBusiness şeması eklenirse hem
  arama görünürlüğü hem Tanitio'nun otomatik künye çıkarımı iyileşir.

### B4. Sosyal hesaplar

| Site | Doğrulanan | Eksik |
|---|---|---|
| ensotek.com.tr | Facebook ✔, Instagram ✔, LinkedIn | YouTube (kırık, A2), TikTok ve X hiç linkli değil |
| karbonkompozit | Instagram `@moe_kompozit` ✔ | Facebook, LinkedIn, YouTube linki yok |
| kuhlturm.com | — | **Kendi hesabı yok** |

Hesaplar durum koduyla değil **içerikle** doğrulandı (`og:title`), çünkü
Instagram/Facebook var olmayan adrese de 200 dönebiliyor.

**kuhlturm en kritik olanı:** sitedeki tüm sosyal bağlantılar Ensotek
hesaplarını gösteriyor (`facebook/instagram/linkedin/youtube/tiktok` →
"ensotek"). Bunlar Kühlturm'un kendi hesapları değil. Tanitio'ya yazılmadı,
çünkü başka markanın hesabını ayrı bir tenant'a bağlamak ölçümü ve yayını
yanlış hesaba gönderir.

**Karar gerekiyor:** Kühlturm'un kendi sosyal hesapları açılacak mı, yoksa
Ensotek hesapları bilinçli olarak mı paylaşılıyor? İkincisiyse Kühlturm
tenant'ı yayın için kullanılmamalı, yalnız site/SEO tarafı izlenmeli.

### B5. Marka görselleri

- **Kalıcı yatay logo adresi yok.** Üç sitede de bulunabilen tek şey kare
  ikon (`apple-touch-icon`, `favicon`). Tanitio'ya ikonlar yazıldı ama panel
  başlığında marka logosu görünmüyor.
  ⚠️ Next.js'in içerik-hash'li statik dosyasını (`/_next/static/media/logo.<hash>.png`)
  **vermeyin** — her build'de hash değişir, kayıtlı adres sessizce 404'e döner.
  Gereken: `/brand/logo.png` gibi **sabit** bir adres.
- **MOE Kompozit'in marka rengi ölçülmedi.** Ensotek markası için renkler
  logodan piksel sayılarak ölçülmüştü (turkuaz `#11949F` + lacivert `#00173A`);
  MOE Kompozit ayrı bir marka, rengi uydurulmadı. Marka kılavuzu varsa
  paylaşılması yeter.

---

## C. Bir de adlandırma düzeltmesi (Tanitio tarafında yapıldı, bilgi için)

Tenant ilk açılırken ad alan adından türetilmişti: "Karbonkompozit". Sitenin
kendi metni farklı söylüyor — sayfa başlığı *"… - MOE Kompozit"*, altbilgi
*"© 2026 MOE Kompozit. Tüm hakları saklıdır"*. Tanitio'da marka adı
**MOE Kompozit** olarak düzeltildi.

Aynı şekilde kanonik host: `canonical: https://www.karbonkompozit.com.tr/tr`
→ Tanitio'daki adres `www`'li hâle getirildi.

---

## D. Öncelik sırası

1. **A1 — sahte yorumlar** (canlıda görünen güven sorunu, en acil)
2. **B1 — içerik kaynağı ucu** (paylaşılan pakete bir kez, üç sitede açılır;
   Tanitio'yu asıl çalışır hâle getiren iş)
3. **B2 — ölçüm etiketleri + GSC** (iki site hiç ölçülmüyor)
4. **A2 — kırık YouTube linki** (tek satır)
5. **A3 — kuhlturm kanonik host + env drift'i**
6. **B4 — Kühlturm sosyal hesap kararı**
7. **B3, B5** — künye ve marka görselleri

---

**Bu belge Tanitio tarafındaki inceleme sonucudur; bu repoda hiçbir kod
değiştirilmedi.** Bulguların tamamı 2026-09-08'de canlı sitelerden ve bu
repodaki dosyalardan doğrulandı; doğrulanamayan hiçbir şey yazılmadı.
