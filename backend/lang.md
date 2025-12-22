Aşağıdaki metin, projeye **“talimat / emir”** olarak koyabileceğin şekilde yazılmıştır (README’ye ya da `/docs/` altına koy).

---

# ENSOTEK – DİL (LOCALE) YÖNETİMİ ZORUNLU TALİMATI

## Amaç

Bu projede dil (locale) desteği **statik değil**, **tamamen dinamik** olacak şekilde tasarlanacaktır. Bugünkü ihtiyaç 3 dil olsa bile (tr/en/de), mimari **ileride 30+ dile** çıkabilecek şekilde kurulacaktır.

## Kesin Kural: Dil Kaynağı

1. **Diller `.env` dosyasından okunmayacak.**
2. **Kod içinde sabit (hardcoded) dil listesi olmayacak.**
3. Uygulamada kullanılacak tüm diller **tek kaynak olarak DB üzerinden** yönetilecek:

   * `site_settings` → `app_locales` anahtarı (veya projedeki karşılığı)

Örnek `app_locales` değeri (DB’de):

```json
[
  { "code": "tr", "label": "Türkçe", "is_default": true,  "is_active": true },
  { "code": "en", "label": "English", "is_default": false, "is_active": true },
  { "code": "de", "label": "Deutsch", "is_default": false, "is_active": true }
]
```

## Backend Zorunluluğu

1. Backend, aktif dilleri dönen bir kaynak sunacak:

   * Tercihen `site_settings` üzerinden `app_locales` okunacak.
2. Dil listesi response’u:

   * **aktif** olanları dönecek (`is_active=true`)
   * tek bir **default** locale garanti edecek (`is_default=true`)
3. Hiç dil yoksa fallback:

   * DB’de veri yoksa backend **minimum güvenli fallback** döndürebilir (örn. `tr`), ancak bu “geçici emniyet supabı”dır; normal çalışma DB’ye bağlıdır.

## Frontend Zorunluluğu

1. Frontend, dil listesini uygulama açılışında / layout seviyesinde **DB’den** çekecek.
2. Dil seçici, route üretimi, menü/seo/i18n kayıtları:

   * **Dil listesi üzerinden** üretilecek.
   * “tr/en/de” gibi case’ler kesinlikle yazılmayacak.
3. Locale doğrulama:

   * Route’tan gelen locale, DB’den gelen dil listesinde yoksa:

     * default locale’a redirect veya fallback uygulanacak.

## Seed / İçerik Politikası

1. Seed dosyaları (ör. `menu_items_i18n`) bugün 3 dil içeriyor olabilir; bu **geçici içerik seviyesidir**.
2. Kod tarafı hiçbir zaman “3 dil var” varsayımı yapmayacak.
3. Yeni dil eklendiğinde (örn. `fr`):

   * DB’ye `app_locales` içine eklenmesi yeterli olmalı.
   * UI/route/selector otomatik görmeli.
   * İçerik çevirileri yoksa sistem:

     * **fallback locale** mantığı ile çalışmalı (örn. default → en → tr gibi proje kuralı neyse).

## Kabul Edilemez Hatalar

* `.env` ile dil yönetimi
* `const locales = ["tr","en"]` benzeri sabitleme
* `if (locale === "tr") else ...` gibi iki/üç dile kilitleyen UI mantıkları
* Dil listesi değiştiğinde deploy gerektiren yaklaşım

## Sonuç

Bu talimat, proje genelinde bağlayıcıdır. Dil yönetimi **DB tabanlı ve dinamik** olmak zorundadır. Bugün 3 dil olsa bile sistem **30+ dil** için tasarlanacaktır.

---

İstersen bir sonraki adımda, Ensotek’te bu kuralı uçtan uca enforce edecek şekilde:

* backend’de `app_locales` okuma + cache (opsiyonel),
* frontend’de `useListSiteSettings... keys:["app_locales"]` ile “tek kaynak” hook’u,
* `localizePath`, menu rendering, SEO, UI fallback
  kodlarını da “hardcode’suz” hale getirecek bir patch planı çıkarayım.
