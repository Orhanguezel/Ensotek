# TR10 — ensotek.com.tr galeri EN çevirileri ve dil filtresi ailede doğrulama (11 Eylül 2026)

**Bulgu:** TR09 sonrası yoklamada `/en/gallery` boştu: 4 galerinin yalnız TR `gallery_i18n` satırı vardı (galeri API'si TR'ye düşmez, boş döner).

**Düzeltme:**
- `backend/src/db/seed/sql/018_galleries_en.seed.sql`: 4 galerinin EN başlık/slug/açıklama/meta satırı (idempotent). Canlı DB'ye uygulandı;
  öncesi yedek `/var/backups/ensotek-checklist/ensotek_com_tr_db.galleries.before-gallery-en-20260911.sql` (0600). Görsel alt metni TR'de de yok; eklenmedi.
- `public-seo.ts` → `redirectToLocalizedSlugOrNotFound(section, slug, locale)`: blog ve galeri detayında ortak; başka dilin slug'ı aynı içerik kimliğinin istenen dildeki adresine 308, karşılığı yoksa 404.
- `sitemap.ts` `revalidate = 300`: admin panelden içerik değişince sitemap yeniden build gerektirmez (önceden build anında donuyordu; galeri seed'i sonrası EN girişleri ancak yeni build ile geldi).

**Kabul (`scripts/accept-tr-gallery-locale.py`, canlı — PASS, `live-gallery-acceptance.json`; blog kabulü tekrar PASS, `live-blog-acceptance.json`):**

| Kontrol | Sonuç |
|---|---|
| `/en/gallery` | 200, `lang=en`, 4 EN galeri bağlantısı |
| `/tr/galeri` | 200, `lang=tr`, 4 TR bağlantı |
| `/en/gallery/field-installations` | 200, `lang=en`, H1 İngilizce |
| `/en/gallery/saha-uygulamalari` (TR slug) | 308 → `/en/gallery/field-installations` |
| `/tr/galeri/field-installations` (EN slug) | 308 → `/tr/galeri/saha-uygulamalari` |
| `/en/gallery/nope-xyz` | 404 |
| EN detay hreflang | tr (`/tr/galeri/…`) / en / x-default doğru |
| `sitemap.xml` | 4 TR + 4 EN galeri, EN'de TR slug yok; toplam 78 URL (74 → 78) |

**Aile yoklaması (aktif dillerde sessiz fallback var mı):** ensotek.de `library` tr/en/de üçü de kendi dilinde; Kühlturm blog de/en kendi dilinde (tr istenince de döner, tr aktif değil); MOE blog tr/en kendi dilinde (de istenince tr döner, de aktif değil). Ek düzeltme gerekmedi.

**Not (yerel aday):** `next start --hostname 127.0.0.1` ile `/tr/galeri` kendine 308 döngüsü verdi; middleware rewrite adresi `localhost`
olduğu için Next bunu dış rewrite sayıp `redirects()` kuralını yeniden uyguluyor. `--hostname localhost` ile ve canlıda (nginx, gerçek Host) yok.
Bir sonraki TR adayında `localhost` kullanılmalı.

Build 78 URL; rollback `.next.before-checklist-20260911T163249Z`; kaynak/seed dosyaları canlı checkout ile hash eşit; commit `ensotek_com_tr` `cb8e6e2`.
