# Offer modülünü tek modüle indirme — plan

14 Ağustos 2026

## Durum

Offer modülü **üç kopya** halinde yaşıyor:

| Konum | Kullanan | Durum |
|---|---|---|
| `packages/shared-backend/modules/offer/` | kuhlturm, kompozit | Kanonik |
| `ensotek_com_tr/backend/src/modules/offer/` | ensotek.com.tr | Yerel kopya |
| `ensotek_de/backend/src/modules/offer/` | ensotek.de | Yerel kopya, **ayrı desen** |

Modül seçimi tek satırlık bir import meselesi:

```ts
// kuhlturm / kompozit
import { registerOffer } from '@ensotek/shared-backend/modules/offer/router';
// ensotek_com_tr
import { registerOffer } from '../modules/offer/router';
// ensotek_de
import { registerOffer } from '@/modules/offer/router';
```

Yani birleştirme teknik olarak import değiştirip yerel klasörü silmek. **Ama üç
gerçek sapma var**, mekanik taşıma bunları kırar.

## Üç sapma

### 1. Tablo öneki — ÇÖZÜLDÜ

`ensotek_com_tr` tarihsel olarak `ensotek_com_tr__offers` ve
`ensotek_com_tr__offer_number_counters` adlarını kullanıyor. Veritabanındaki
47 tablodan **yalnızca bu ikisi** önekli — sistematik bir kural değil, tekil bir sapma.

**Çözüm uygulandı:** `shared-backend/modules/offer/schema.ts` artık öneki
`OFFER_TABLE_PREFIX` ortam değişkeninden okuyor, varsayılanı boş. Mevcut sitelerin
davranışı değişmedi. `ensotek_com_tr` için `.env` içine şunu koymak yeterli:

```
OFFER_TABLE_PREFIX=ensotek_com_tr__
```

### 2. PDF şablonu — ÇÖZÜLDÜ (kayıt mekanizması)

`ensotek_com_tr/.../pdfTemplate.ts` shared sürümden **200 satır** farklı (849 vs 819).
Bu gerçek bir özelleştirme (marka, düzen, Türkçe metin). Mekanik birleştirme bunu
siler ve teklif PDF'leri bozulur.

İncelemede görüldü ki bu **iki ayrı marka tasarımı**: farklı CSS sınıfları
(`top-accent` vs `top-rule`), farklı başlık düzeni (shared'da "Composite Solutions"
alt başlığı), farklı metinler ve com_tr'de ek bir belge/onay bloğu
(`documentLabel`, `issuerApproval`, `customerApproval`, `nameSignature`).

Biri diğerinin üst kümesi **değil**. Tek dosyada birleştirmek, bir markanın
müşteriye giden resmi teklif belgesinin görünümünü değiştirir — kabul edilemez.

**Çözüm uygulandı:** mantık tek modülde kalır, **marka şablonu dışarıdan enjekte
edilir**. `service.ts` artık `setOfferPdfRenderer()` sunuyor:

```ts
import { setOfferPdfRenderer } from '@ensotek/shared-backend/modules/offer/service';
import { renderOfferPdfHtml } from './offer-pdf-template';
setOfferPdfRenderer(renderOfferPdfHtml);
```

Kaydetmeyen site shared'daki varsayılan şablonu kullanır. Böylece her sitede
`offer/` klasörü yerine **tek bir şablon dosyası** kalır.

### 3. Mail stratejisi — ÇÖZÜLDÜ (iki mod)

`ensotek_de/.../service.ts` shared sürümden **445 satır** farklı. Sebep mimari:

- **shared:** mail gövdesi kodda sabit HTML (`sendKompozitOfferRequestAdminMail`)
- **ensotek_de:** `renderEmailTemplateByKey('offer_request_received_admin', ...)`
  ile **veritabanındaki şablondan** üretiliyor

ensotek_de'nin yaklaşımı aslında **daha iyi**: şablon locale'e göre değişiyor ve
admin panelden deploy'suz düzenlenebiliyor.

⚠️ Ama bir tuzağı var:

```ts
if (!rendered || rendered.missing_variables.length > 0) return;
```

Şablonda tek bir değişken eksikse **hiç mail gitmiyor ve hata da loglanmıyor.**
Sessiz kayıp. Hangi yaklaşım seçilirse seçilsin bu satır düzeltilmeli — eksik
değişken hâlinde ya boş basılmalı ya da hata loglanıp alarm üretilmeli.

**(b) seçeneği uygulandı.** `sendKompozitOfferRequestAdminMail` artık önce
`offer_request_received_admin` şablonunu dener, bulamazsa koddaki HTML'e düşer.
Migration gerekmiyor; şablonu olan site şablonunu kullanmaya devam eder.

`missing_variables` sessiz dönüşü de düzeltildi: eksik değişken artık `console.warn`
ile loglanır ve kod şablonuna düşülür — mail **hiç gitmemek** yerine gider.

## Önerilen sıra

1. ✅ **Tablo öneki env'e alındı** — `OFFER_TABLE_PREFIX`, varsayılan boş.
2. ✅ **Mail iki modlu** — şablon varsa şablon, yoksa kod HTML'i; sessiz dönüş giderildi.
3. ✅ **PDF şablonu enjekte edilebilir** — `setOfferPdfRenderer()`.
4. ✅ **`ensotek_com_tr` geçirildi** — doğrulandı (ENS-2026-0010, PDF gözle kontrol).
5. ✅ **`ensotek_de` geçirildi** — doğrulandı (ENS-2026-0008, Almanca PDF gözle kontrol).
6. ⬜ `.gitignore` sapması: `ensotek_com_tr/`, `ensotek_de/`, `kuhlturm/` hâlâ
   sürüm kontrolü dışında.

## SONUÇ: offer modülü artık TEK

Dört sitenin dördü de `@ensotek/shared-backend/modules/offer/*` kullanıyor.
Sitelerde kalan tek şey marka teklif belgesi (`src/offer/pdf-template.ts`) ve
onu kaydeden tek satır.

### Geçiş sırasında bulunan üretim hataları

1. **kuhlturm.com teklif formu 500 veriyordu.** Paylaşılan modül `offers.source`
   kolonunu bekliyor, `ensotek` veritabanında bu kolon YOKTU. Yani kuhlturm'da
   gönderilen her teklif talebi kayboluyordu. Kolon eklendi (seed'e de yazıldı),
   form doğrulandı: 201.
2. **ensotek.de PDF üretimi tamamen bozuktu.** `.env` içinde
   `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser` yazıyordu ama o dosya
   sunucuda yok. Kapatıldı; puppeteer gömülü tarayıcıyı kullanıyor (ensotek_com_tr
   zaten böyle çalışıyordu).
3. **PDF logosu kırıktı.** `company_brand` ayarında `logo` alanı yoktu; yedek yol
   `/logo-transparent.png` her iki sitede de 404. Sitenin gerçekten kullandığı
   `/logo/ensotek-logo-main.png` ayara eklendi.

İlk ikisi PDF üretimi hiç çalışmadığı için görünmüyordu — biri diğerini maskeliyordu.

### Açık kalan (karar senin)

`ensotek.de` ve `kuhlturm.com` aynı veritabanını paylaştığı için `de`/`en`
locale'lerinde marka **Kühlturm** olarak çözülüyor: PDF alt bilgisinde
"Kühlturm · kuhlturm.com" yazarken logo Ensotek logosu ve yasal not "Bestätigung
durch Ensotek" diyor. Karışık marka. Aynı belirsizlik e-posta alıcısında da vardı.
Çözümü site bazlı ayrım gerektirir; şu an veri düzeyinde bir tercih meselesi.

## Geçiş kontrol listesi (site başına)

Altyapı hazır; kalan iş her site için mekanik ve **test edilerek** yapılmalı.

1. `pdfTemplate.ts` dosyasını `src/modules/offer/` dışına, örn.
   `src/offer-pdf-template.ts` olarak taşı (marka belgesi sitede kalır).
2. Uygulama açılışında şablonu kaydet:
   `setOfferPdfRenderer(renderOfferPdfHtml)`.
3. `.env`'e site değerlerini ekle:
   - `ensotek_com_tr`: `OFFER_TABLE_PREFIX=ensotek_com_tr__`,
     `OFFER_PDF_BRAND_NAME=Ensotek`, `PUBLIC_BASE_URL=https://www.ensotek.com.tr`
   - `ensotek_de`: önek yok; marka/URL değerleri kendi sitesine göre
4. `routes/shared.ts` (veya `app.ts`) içindeki offer import'larını
   `@ensotek/shared-backend/modules/offer/...` olarak değiştir.
5. `src/modules/offer/` klasörünü sil.
6. `bun run build` → `pm2 restart` → **test zinciri:**
   - teklif oluştur (tüm alanlar dolu, `form_data` dahil)
   - admin maili geldi mi, **tüm alanlar var mı**
   - Telegram bildirimi geldi mi
   - **PDF üret ve GÖZLE KONTROL ET** — marka, logo, düzen bozulmamış olmalı
   - honeypot ve rate limit hâlâ çalışıyor mu
7. Test kayıtlarını sil.

**PDF adımı atlanmamalı.** Teklif PDF'i müşteriye giden resmi ticari belge;
bozulması sessiz olur ve haftalar sonra fark edilir.

## Neden aceleye gelmez

Dört site de **canlı müşteri sitesi** ve teklif akışı ticari olarak en değerli yol.
Adım 4 ve 5 sırasında bir hata teklif PDF'ini veya admin bildirimini bozar; bunlar
sessiz bozulmalar — hemen fark edilmez.

Her adım ayrı ayrı, test edilerek ve tercihen mesai dışında yapılmalı.

## Ek: `.gitignore` sorunu

`ensotek_com_tr` ve `ensotek_de` klasörleri bu reponun `.gitignore`'unda; yani o
kopyalara yapılan düzeltmeler **sürüm kontrolü dışında.** Birleştirme bunu da
çözüyor — kod tek yerde ve izlenen bir yerde toplanıyor.
