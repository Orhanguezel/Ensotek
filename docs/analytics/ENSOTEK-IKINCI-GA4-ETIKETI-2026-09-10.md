# TAN03 — Ensotek ikinci GA4 etiketi

10 Eylül 2026 canlı kontrolü: `G-XECX77LB6M` Google tag betik adresi 404 dönüyor. `G-7S6TW9CNRJ` adresi 200. İkinci kimliğin sahibi hâlâ doğrulanamadı; silinmiş bir mülk olduğu veya çift page_view ürettiği ileri sürülmüyor.

## GTM kaynağı ve geçmiş

Container: `GTM-WV5FRN93`, canlı sürüm **11**; API yolu `accounts/6330619450/containers/238844696`.

| Tag | Ad | Hedef | Durum |
|---|---|---|---|
| 22 | Google etiketi | G-XECX77LB6M | Etkin, betik 404 |
| 23 | Google Tag – ensotek.de (GA4) | G-7S6TW9CNRJ | Etkin, betik 200 |

İkisi de aynı yerleşik tetikleyici ID'sini (`2147479573`) kullanıyor. API'de ayrı tanımlı `Sayfa Görüntüleme` tetikleyicisinin ID'si 21; tag'lerin ona bağlı olduğu varsayılmadı.

Erişilebilir sürümlerde tag 22, v7/v8'de `G-YYDB7LBD6Y` hedefine sahip. v9'da hedef `G-XECX77LB6M` olarak değişiyor. Doğrulanmış tag 23 v10'da ekleniyor; v11'de iki tag korunuyor. Daha önceki silinmiş/erişilemeyen sürümler için çıkarım yapılmadı; düzenleyenin kimliği doğrulanmadı.

## GA4 hesap kontrolü

Doğrulanmış `properties/504406901` mülkünün hesabı `accounts/310357720`. `showDeleted=true` ve sayfalama ile 14 mülk / 14 akış okundu, API hatası yok. Bilinmeyen kimlik veya eski iki kimlik (`G-YYDB7LBD6Y`, `G-JXG2XVVQ8C`) eşleşmedi. Doğru hedef `G-7S6TW9CNRJ`, `https://ensotek.de` akışıyla eşleşti. Başka hesapların varlığı veya mülkiyeti konusunda sonuç çıkarılmadı.

## Tarayıcı kabulü

`https://ensotek.de/en`, temiz oturum:

- Reddedilmiş analitik tercihi: GTM/gtag isteği 0, ölçüm isteği 0.
- Analitiğe izin verilince iki gtag betiği isteniyor.
- Beş saniyelik pencerede yalnız `G-7S6TW9CNRJ` için bir `page_view` isteği gözlendi.
- Tüm collection istekleri tarayıcıda 204 ile yakalandı; Google Analytics'e test verisi gönderilmedi.

Bu sonuç aynı mülke çift sayım kanıtı değildir. Beş saniyelik gözlem tüm olası olayları veya tüm sayfaları kapsamaz.

## Kalan karar ve uygulanacak sınır

TAN03 açık: tag 22'nin hesabı ve işletmedeki amacı doğrulanmalı. Mevcut 404 kanıtıyla incelenecek somut değişiklik, **yalnız tag 22'yi duraklatmak veya sahibi doğrulanmış doğru kimlikle düzeltmek**. Tag 23, doğru GA4 akışı ve sitenin consent davranışı korunmalı. Yeni GTM sürümü yayınlanırsa önce/sonra aynı collection-yakalamalı test çalışmalı; eski canlı v11 rollback referansıdır.

Bu turda GTM/GA4 ayarı, workspace veya yayınlanmış sürüm değiştirilmedi; duraklatma/silme yapılmadı.

Kanıtlar: [container geçmişi](../../output/checklist-2026-09-10-gtm/container-history.jsonl), [akış eşleşmeleri](../../output/checklist-2026-09-10-gtm/legacy-streams.json), [doğrudan betik yanıtları](../../output/checklist-2026-09-10-gtm/public-tag-responses.json), [tarayıcı istekleri](../../output/checklist-2026-09-10-gtm/browser-destinations.json).
