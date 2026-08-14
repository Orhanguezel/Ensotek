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

### 2. PDF şablonu — KARAR GEREKİYOR

`ensotek_com_tr/.../pdfTemplate.ts` shared sürümden **200 satır** farklı (849 vs 819).
Bu gerçek bir özelleştirme (marka, düzen, Türkçe metin). Mekanik birleştirme bunu
siler ve teklif PDF'leri bozulur.

Seçenekler:

- **(a) Site bazlı şablon kaydı:** shared modül, varsa site-özel şablonu kullanır.
  Küçük bir arayüz (`getOfferPdfTemplate()`) ve site tarafında tek dosya.
- **(b) Şablonu veritabanına taşı:** admin panelden düzenlenebilir olur, deploy
  gerekmez. Daha büyük iş ama uzun vadede doğrusu.
- **(c) Farkı shared'a koşullu olarak taşı** — şablon içinde `if (site === ...)`.
  Tavsiye edilmez, shared'ı kirletir.

### 3. Mail stratejisi — KARAR GEREKİYOR

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

Seçenekler:

- **(a) shared şablon tabanlıya geçsin** (ensotek_de'nin deseni kazansın).
  Karşılığı: kuhlturm, kompozit ve ensotek.com.tr veritabanlarına şablon seed'i
  gerekir. Doğru yol ama migration işi.
- **(b) shared iki modu da desteklesin:** şablon varsa onu kullan, yoksa koddaki
  HTML'e düş. Geriye dönük uyumlu, migration gerektirmez. **Önerilen.**

## Önerilen sıra

1. ✅ **Tablo öneki env'e alındı** (yapıldı, davranış değişmedi).
2. **Mail stratejisinde (b) seçeneğini uygula:** shared'a "şablon varsa kullan,
   yoksa koddaki HTML" mantığı. `missing_variables` sessiz dönüşü de burada düzelt.
3. **PDF'te (a) seçeneğini uygula:** site-özel şablon kaydı.
4. `ensotek_com_tr`'yi shared'a geçir: import değiştir, `.env`'e önek ekle,
   yerel klasörü sil. **Test:** teklif oluştur → PDF üret → admin maili → Telegram.
5. `ensotek_de`'yi shared'a geçir. **Test:** aynı zincir, de/en locale ile.
6. Yerel `offer` klasörlerini sil, `.gitignore` sapmasını gözden geçir.

## Neden aceleye gelmez

Dört site de **canlı müşteri sitesi** ve teklif akışı ticari olarak en değerli yol.
Adım 4 ve 5 sırasında bir hata teklif PDF'ini veya admin bildirimini bozar; bunlar
sessiz bozulmalar — hemen fark edilmez.

Her adım ayrı ayrı, test edilerek ve tercihen mesai dışında yapılmalı.

## Ek: `.gitignore` sorunu

`ensotek_com_tr` ve `ensotek_de` klasörleri bu reponun `.gitignore`'unda; yani o
kopyalara yapılan düzeltmeler **sürüm kontrolü dışında.** Birleştirme bunu da
çözüyor — kod tek yerde ve izlenen bir yerde toplanıyor.
