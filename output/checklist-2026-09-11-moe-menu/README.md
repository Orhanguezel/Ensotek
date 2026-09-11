# K22 — MOE mobil menü kaydırılmış sayfada görünmüyor (11 Eylül 2026)

**Belirti (kullanıcı):** karbonkompozit.com.tr ana sayfasında aşağı kaydırıp menüyü açınca menü görünmüyor.

**Kök neden:** Kaydırınca `<header>` `.header-shell-scrolled` sınıfını alır; canlı CSS'te bu kural
`-webkit-backdrop-filter:blur(20px)` içerir. `backdrop-filter` (Safari'de `-webkit-` önekiyle)
`position:fixed` torunlar için containing block oluşturur. Mobil `<nav id="mobile-site-navigation">`
header'ın **içinde** ve `fixed inset-0` olduğundan viewport yerine 69 px'lik header kutusuna hapsolur.
Chromium `-webkit-backdrop-filter`'ı tanımadığı için masaüstü/Chromium'da görülmez; iPhone/Safari'de görülür.

**Düzeltme:** `kompozit/frontend/src/components/layout/Header.tsx` — `<nav>` header dışına, fragment
kardeşi olarak alındı. Odak tuzağı, scroll kilidi, `inert`/`aria-expanded` davranışı aynı ref'lerle korundu.

**Kabul yöntemi:** Chromium'da Safari davranışını taklit etmek için sayfaya
`.header-shell-scrolled{backdrop-filter:blur(20px)}` enjekte edilir (`scripts/accept-moe-mobile-menu-scrolled.py`).

| Ortam | Emülasyon | nav yüksekliği | nav header içinde | Sonuç |
|---|---|---:|---|---|
| Canlı, önce | yok | 857 px | evet | görünür (Chromium yanıltıcı) |
| Canlı, önce | Safari taklidi | **68 px** | evet | **hata yeniden üretildi** — `live-before-forced.png` |
| Yerel aday :3320 | Safari taklidi | 857 px | hayır | geçti — `candidate-forced.png` |
| Canlı, sonra | Safari taklidi | 857 px | hayır | **geçti** — `live-after-forced.png`, `live-after-safari-emulated.json` |

K13 regresyonu canlıda geçti (`live-after-focus.json`, `scripts/accept-moe-mobile-menu-focus.py`): açılışta odak içeride,
Tab sınırı, Escape kapatır, odak açan düğmeye döner, scroll kilidi/geri yükleme, kaydırma konumu korunur, link tıklaması menüyü kapatır.

Kapılar: `build-checklist-production.sh kompozit` (72 sitemap URL, yerel endpoint yok — `build.log`), `bunx tsc` (yalnız
önceden var olan `tests/brand-fallback.test.ts` `bun:test` tip hatası), lint 0 hata / 2 eski uyarı, `test:theme`, `test:release` geçti.

Canlı: `deploy-checklist-frontend.sh kompozit`; rollback `.next/standalone.before-checklist-20260911T112616Z`. Kaynak
`Header.tsx` canlı repo ile hash eşit (`750265819e97c39a`); önceki canlı kopya
`/var/backups/ensotek-checklist/kompozit-Header.tsx.before-menu-fix-20260911`. Paket `.env` içermiyor.

Gerçek iPhone/Safari cihaz kabulü kullanıcı tarafından yapılmalıdır; emülasyon aynı CSS mekanizmasını doğrular, cihazı değil.
Diğer üç sitede aynı kalıp yok: DE header mobilde `backdrop-filter:none`; Kühlturm MobileNav header dışında; TR'de mobil nav header içinde değil.
