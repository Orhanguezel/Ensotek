# TR09 — ensotek.com.tr Bilgi Bankası dile göre gelmiyordu (11 Eylül 2026)

**Belirti (kullanıcı):** `/en/blog` Türkçe başlıklar ve Türkçe slug'lar gösteriyor; içerik dile göre gelmiyor.

**Kök neden (3 katman):**
1. **Veri:** 9 blog yazısının `custom_pages_i18n` tablosunda yalnız `tr` satırı vardı (diğer özel sayfaların en/de satırları mevcuttu).
2. **Backend:** Ortak `customPages` repository'si istenen dil yoksa sessizce `tr` satırını döndürür (`pickLocalizedRow`), yanıtta `locale: "tr"` bildirir.
3. **Frontend:** Liste, detay ve sitemap/hreflang envanteri (`public-seo.ts`) yanıttaki `locale` alanına bakmadan basıyordu; kök layout `<html lang="tr">` sabitti (dil yalnız istemci betiğiyle düzeltiliyordu).

**Düzeltme:**
- `backend/src/db/seed/sql/017_custom_pages_blog_en.seed.sql`: 9 yazının EN satırı. 6'sı ensotek.de kütüphanesinin mevcut EN metinleri
  (temeller, özellikler, açık/kapalı çevrim, seçim verileri, tasarım değerleri); 3'ü TR kaynaktan çeviri (seçim rehberi, Legionella, GRP/FRP).
  Idempotent (`ON DUPLICATE KEY UPDATE`), sabit id'ler `cccc26XX-3333-…`. Canlı DB'ye uygulandı; öncesi yedek
  `/var/backups/ensotek-checklist/ensotek_com_tr_db.custom_pages.before-blog-en-20260911.sql` (0600). Schema değişmedi, ALTER yok.
- `public-seo.ts`: envanter yalnız `locale` eşleşen kayıtları alır (`locale` alanı olmayan galeri API'si etkilenmez).
- `blog/page.tsx`: liste yalnız istenen dilde yazılmış kayıtları gösterir; TR dışı için TR'ye düşme yok.
- `blog/[slug]/page.tsx`: yanıt dili istenen dille uyuşmazsa veya slug bulunamazsa, aynı içerik kimliğinin istenen dildeki slug'ına **308**; karşılığı yoksa **404**.
- `app/layout.tsx`: `<html lang>` next-intl'in `x-next-intl-locale` başlığından; SSR HTML'de doğru dil.

**Kabul (`scripts/accept-tr-blog-locale.py`) — yerel aday :3321 ve canlı, ikisi de PASS (`candidate-acceptance.json`, `live-acceptance.json`):**

| Kontrol | Sonuç |
|---|---|
| `/en/blog` | 200, `lang=en`, 9 EN başlık, 9 `/en/blog/<en-slug>` bağlantısı, TR başlık yok |
| `/tr/blog` | 200, `lang=tr`, 9 TR bağlantı (değişmedi) |
| `/en/blog/cooling-tower-selection-guide` | 200, `lang=en`, H1 İngilizce |
| `/en/blog/sogutma-kulesi-secim-rehberi` (TR slug) | 308 → `/en/blog/cooling-tower-selection-guide` |
| `/tr/blog/cooling-tower-selection-guide` (EN slug) | 308 → `/tr/blog/sogutma-kulesi-secim-rehberi` |
| `/en/blog/does-not-exist-xyz` | 404 |
| EN detay hreflang | tr / en / x-default doğru çiftler |
| `sitemap.xml` | 9 TR + 9 EN blog; EN girişlerinde TR slug yok; 74 URL |

Kapılar: `build-checklist-production.sh ensotek_com_tr` (74 URL, yerel endpoint yok), tsc temiz. `next lint` betiği Next 16'da geçersiz (önceden var olan durum), çalıştırılamadı.
Canlı: `deploy-checklist-tr-frontend.sh`; rollback `.next.before-checklist-20260911T161958Z`. Beş kaynak/seed dosyası canlı checkout ile hash eşit; öncekiler `/var/backups/ensotek-checklist/tr-blog-i18n-20260911/`.
Commit `ensotek_com_tr` `814ab1f`. Ekran görüntüleri: `live-en-blog.png`, `live-en-detail.png`.

**Kalan / not:** Bu site yalnız tr+en aktif; DE yok (`/de/blog` 307). Ortak backend fallback davranışı (`pickLocalizedRow` → tr) değiştirilmedi; frontend `locale` alanıyla deterministik. Aynı ortak repository DE/Kühlturm/MOE'de de kullanılıyor; oralarda liste/detay filtresi ayrıca doğrulanmalı.
