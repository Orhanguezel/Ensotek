# Ensotek ailesi ↔ Tanitio içerik API sözleşmesi

Sürüm: `ensotek-family-content@1.0` — 9 Eylül 2026.

## Sağlayıcılar

| Site | API tabanı | Varsayılan dil |
|---|---|---|
| Ensotek DE | https://ensotek.de/api/integrations/tanitio | de |
| Ensotek Türkiye | https://www.ensotek.com.tr/api/integrations/tanitio | tr |
| Kühlturm | https://kuhlturm.com/api/integrations/tanitio | de |
| MOE Kompozit | https://www.karbonkompozit.com.tr/api/integrations/tanitio | tr |

DE/Kühlturm: de, en, tr. Türkiye/MOE: tr, en. Dil çevirisi yoksa başka dil sessizce döndürülmez; liste boş veya detay 404 olur.

## Kimlik doğrulama ve kapsam

Her istek `Authorization: Bearer <siteye-özel-anahtar>` taşır. Anahtar sağlayıcının backend `.env` dosyasında `TANITIO_CONTENT_API_KEY`, tüketicinin `content_source/api_key` şifreli tenant ayarında tutulur. Anahtarlar rapora, Git'e veya frontend'e konmaz. Anahtar yok/yanlışsa 401, sağlayıcı kurulmamışsa 503. Her site için farklı anahtar kullanılır. Yanıtlar `Cache-Control: private, no-store` taşır.

Yalnız okuma: GET. Aktif ürünler ve yayımlanmış sayfalar; taslaklar, iletişim/teklif talepleri, kullanıcılar ve yönetim ayarları kapsam dışıdır. İstek DB/alan adı seçemez. Ensotek.de ile Kühlturm mevcut ortak DB'deki içerikleri kendi alan adlarıyla sunar; bu sözleşme DB'leri fiziksel olarak ayırmaz.

## Uçlar

| Uç | Sonuç |
|---|---|
| `GET {base}` | Sürüm, site kimliği, diller, kaynaklar ve senkronizasyon yetenekleri |
| `GET {base}/articles` | Blog ve haberler |
| `GET {base}/products` | Ürünler / yedek parçalar |
| `GET {base}/pages` | Kurumsal, çözüm, ekip ve yasal içerikler; sitenin desteklediği modüller |
| `GET {base}/{resource}/{id}` | Aynı görünürlük ve dil filtresiyle tam detay; id liste yanıtındaki UUID |
| `GET {base}/articles?type=page` | Tanitio'nun mevcut makale adaptörü üzerinden kurumsal sayfalara erişim |

Liste parametreleri: `locale`, `limit` (1–60, varsayılan 24), `offset` (0–100000), `q` (başlık/slug araması, en çok 256 karakter), `updated_since` (saat dilimli ISO 8601), `sort` (`recent` veya `popular`). `popular` ürünlerde öne çıkan ürünleri önce getirir; gerçek görüntülenme metriği iddiası değildir. Varsayılan sıra güncelleme tarihi azalan + UUID artan. Cursor desteklenmez; gönderilirse 400.

`is_published=0` gönderilse dahi yayımlanmamış içerik açılamaz. Desteklenmeyen dil, geçersiz sayfalama/tarih/sıra 400; görünür olmayan detay 404.

## Liste ve içerik biçimi

```json
{
  "contract": "ensotek-family-content@1.0",
  "items": [{
    "id": "UUID",
    "kind": "article",
    "contentType": "blog",
    "locale": "tr",
    "title": "İçerik başlığı",
    "url": "https://www.karbonkompozit.com.tr/tr/blog/ornek",
    "imageUrl": "https://www.karbonkompozit.com.tr/uploads/ornek.webp",
    "image_url": "https://www.karbonkompozit.com.tr/uploads/ornek.webp",
    "imageUrls": [],
    "excerpt": "Kısa özet",
    "contentHtml": "<p>Tam içerik...</p>",
    "updatedAt": "2026-09-09T10:00:00.000Z",
    "publishedAt": "2026-09-09T09:00:00.000Z",
    "price": null,
    "popularity": null
  }],
  "total": 1,
  "limit": 24,
  "offset": 0,
  "hasMore": false
}
```

`kind`: product veya article; kurumsal sayfalarda article + farklı contentType kullanılır. `image_url` mevcut tüketiciler için uyumluluk alanıdır. `contentHtml` kaynak CMS'nin tam HTML metnidir; boş kaynakta boş string. HTML gösterecek tüketici kendi güvenli HTML gösterim politikasını uygulamalıdır. `publishedAt` ayrı yayın tarihi tutulmadığı için kaynak kaydının oluşturulma tarihidir; yayın geçişinin kesin zamanı değildir. `updatedAt` ana kayıt ve çevirinin en yeni değişimidir. B2B fiyat/performans uydurulmaz: price ve popularity null.

## Senkronizasyon

`updated_since` dahil edici (`>=`) filtredir. Sayfalar bitene kadar offset artırılır; tüketici UUID + locale ile tekilleştirir. Tombstone/deletedIds yoktur. Silinen veya yayından kaldırılan kayıtların temizlenmesi için periyodik tam liste mutabakatı gerekir; handshake bunu açıkça bildirir. Okuma sırasında veri değişirse offset sayfalama anlık bir snapshot garantisi vermez; delta penceresini örtüştürüp tekilleştirin.

## Tanitio tarafı

`social_projects.content_source_type=api`, `content_source_url={base}`. `marketing_json.contentConnection` sürüm ve varsayılan dili taşır. Tanitio mevcut `/content-sources/articles` ve `/content-sources/products` route'ları üzerinden `contentHtml`, locale, özet, görsel ve kanonik URL'yi korur. Sayfalar için articles isteğine `type=page` eklenir. Bu route'lar mevcut Tanitio oturumu/tenant yetkilendirmesine tabidir; site anahtarı kullanıcıya dönmez.

Dört tenant'ta `auto_sync=false`: bağlantı içeriği okunabilir yapar; otomatik taslak, takvim veya sosyal yayın oluşturmaz.

## Kabul ve işletim

- Sağlayıcı auth/yanlış-site-anahtarı: 401; geçersiz locale: 400; doğru kimlik: handshake/liste/detay 200.
- Gelecek updated_since tarihi: boş liste; aktif/yayımlanmış ve tam dil eşleşmesi SQL'de zorunlu.
- Tanitio kaynak resolver'ı ile articles/products/pages; tam metin ve varsayılan dil readback.
- Backend anahtar rotasyonu sağlayıcı + Tanitio şifreli ayarında birlikte yapılır. Sağlayıcı env değişiminde ilgili backend restart gerekir.
- Geri dönüş: `/var/www/Ensotek/.releases/tanitio-content-20260909` içinde önceki app.js, package.json ve özel izinli env yedekleri. Tanitio tüketici dosyaları kendi release dizininde yedeklenir.

## Canlı kabul sonucu

9 Eylül 2026, varsayılan dilde: DE 7 makale/haber + 17 ürün + 18 sayfa; Türkiye 9 + 17 + 4; Kühlturm 7 + 17 + 18; MOE 4 + 12 + 9. `evidence/` altındaki JSON dosyaları secret içermez. Tanitio production dist modülü ile tüm tenant kaynakları configured=true, tam içerik ve beklenen dil doğrulandı.

Türkiye ürün URL'lerinin 17/17'si HTTP 200. Veritabanındaki Türkçe harfli slug'lar mevcut web rotasının ASCII biçimine dönüştürülür. MOE yayımlanmamış makale detayına doğru site anahtarıyla erişim 404; anahtarsız ve diğer site anahtarıyla erişim 401.

Kalite verisi notu: DE/Kühlturm ortak DB'deki Almanca kalite sayfasının kaynak HTML gövdesi boş; API boşluğu korur.
