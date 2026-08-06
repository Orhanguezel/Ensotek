# CODEX BRIEF — SMTP Kurulumu, Noreply Otomatik Yanıt, Sipariş/Teklif/İletişim Admin Bildirimi

> Kaynak: Claude Code analizi (2026-08-06). Kapsam: `packages/shared-backend` + 4 site backend'i
> (`ensotek_com_tr/backend`, `ensotek_de/backend`, `kompozit/backend`, `kuhlturm/backend`).
> Kullanıcı kararları (sorulup onaylandı):
> - **SMTP yöntemi: Hostinger mailbox (güncellendi — Gmail App Password DEĞİL).** 4 domain de
>   (`dig MX` doğrulandı) Google Workspace değil, kendi hosting sağlayıcısının (Hostinger)
>   mail sunucusunu kullanıyor (`mail.<domain>`). Google Workspace olmadığı için `no-reply@<domain>`
>   bir Gmail App Password alamaz — Hostinger hPanel'den normal mailbox açılıp normal şifresi
>   SMTP credential olarak kullanılıyor. Mevcut nodemailer altyapısı zaten basic-auth (user/pass)
>   destekliyor — kod değişikliği gerekmiyor, sadece config + Hostinger'da mailbox açma adımı.
> - **`client_secret_238474838433-....json` (workspace kökü) KULLANILMAYACAK.** OAuth2/Gmail API
>   rotası seçilmedi. Bu dosya farklı bir OAuth client (`238474838433...`), `ensotek_com_tr/.env`
>   içindeki mevcut Google-login client'ından (`440069309865...`) AYRI ve şu an hiçbir kodda
>   referanslı değil.
> - **Telefon numaralarına bildirim YOK.** Sadece e-posta bildirimi. Telegram/WhatsApp/SMS genişletme
>   kapsam dışı — dokunma.

---

## Mevcut mimari (değiştirme, anla)

SMTP tamamen **DB-driven**: `packages/shared-backend/modules/mail/service.ts:80` her gönderimde
`getSmtpSettings()` ile `site_settings` tablosundan okur (`smtp_host/port/username/password/
from_email/from_name/ssl`, key-value pattern, locale='*'). `.env` içindeki `SMTP_*` değişkenleri
**kod tarafından hiç okunmuyor** (dead config, `core/env.ts:90-95` sadece fallback tanımlıyor,
kullanan yok).

- `contact` modülü (`packages/shared-backend/modules/contact/controller.ts`) zaten hem admin'e
  hem müşteriye mail + Telegram gönderiyor.
- `offer` (teklif) modülü (`packages/shared-backend/modules/offer/service.ts`) zaten hem admin'e
  hem müşteriye mail + Telegram gönderiyor (fonksiyon isimleri "Kompozit" ama modül tüm sitelerce
  paylaşılıyor — isimlendirme tarihi, işlevi genel).
- `orders` modülü: **SADECE Telegram, mail YOK.**
- `catalogRequests` modülü: müşteriye katalog linki maili var, **admin'e "yeni talep" bildirimi YOK.**

---

## BUG'lar (mevcut config bozuk / eksik)

1. **`ensotek_com_tr` ve `kompozit` seed'lerinde `smtp_*` satırı hiç yok** (`grep -rn smtp
   */backend/src/db/seed/sql` boş döndü). Bu iki site için mail gönderimi şu an DB'de config
   olmadığı için `smtp_host_not_configured` hatasıyla patlıyor.
2. **`ensotek_de` ve `kuhlturm` seed'lerinde `smtp_username`/`smtp_from_email` ikisi de
   `no-reply@ensotek.com.tr`** (`ensotek_de/backend/src/db/seed/sql/040_site_settings.sql:327,329`
   ve `kuhlturm/backend/src/db/seed/sql/040_site_settings.sql:326,328` — aynı satırlar). kuhlturm
   kendi domainini değil ensotek.com.tr'yi taşıyor — copy-paste hatası.
3. **`contact/controller.ts:23` admin bildirim hedefi yanlış kaynaktan okunuyor**:
   `smtp?.fromEmail || smtp?.username` — yani admin bildirimi gönderim kutusunun (noreply@) kendisine
   gidiyor, gerçek okunan bir admin gelen kutusuna değil. `offer` modülü bunu doğru yapıyor
   (`offer/service.ts:135-138`, `getSiteSettingValue('offers_admin_email', locale)` → site_settings'ten
   ayrı bir admin-alıcı listesi okuyor). `contact` bu pattern'e uymalı.
4. **Dead + kafa karıştırıcı `.env` satırları**: `ensotek_com_tr`, `ensotek_de`, `kompozit`
   `.env`/`.env.production` dosyalarında `SMTP_USER=info@koenigsmassage.com` /
   `MAIL_FROM=info@koenigsmassage.com` — **başka bir müşteri sitesinden (Konig Massage) kalma
   copy-paste**. Kod bunu okumadığı için canlıda zarar vermiyor ama yanıltıcı, temizlenmeli.
5. **`kompozit/backend/.env.production` ve `kuhlturm/backend/.env`'de `AUTH_ADMIN_EMAILS=
   admin@example.com`** (placeholder, gerçek adres değil) — bu adres admin bildirim zincirinin
   parçası olacaksa gerçek bir adrese çekilmeli.

---

## İşler

### A) `.gitignore` (workspace kökü)
`client_secret*.json` satırı ekle — dosya şu an untracked ama ignore edilmiyor, yanlışlıkla
`git add .` ile commit edilebilir.

### B) Eksik SMTP seed satırlarını ekle
`ensotek_com_tr/backend/src/db/seed/sql/` içine yeni bir `0XX_site_settings_smtp.sql` (sıradaki
numara — son dosya `013_offers.sql`, `014_...` kullan), `kompozit/backend/.../sql/` içine de aynı
şekilde (son dosya `324_...`, `325_...` kullan). `ensotek_de/.../040_site_settings.sql` GLOBAL SMTP
bloğunu (satır 321-331) referans al, şu satırları ekle:

```sql
-- GLOBAL: SMTP (locale='*')
(UUID(), 'smtp_host',       '*', 'smtp.hostinger.com',          NOW(3), NOW(3)),
(UUID(), 'smtp_port',       '*', '465',                          NOW(3), NOW(3)),
(UUID(), 'smtp_username',   '*', 'no-reply@ensotek.com.tr',      NOW(3), NOW(3)),  -- kompozit: no-reply@karbonkompozit.com.tr
(UUID(), 'smtp_password',   '*', 'change-me-in-admin',           NOW(3), NOW(3)),
(UUID(), 'smtp_from_email', '*', 'no-reply@ensotek.com.tr',      NOW(3), NOW(3)),  -- kompozit: no-reply@karbonkompozit.com.tr
(UUID(), 'smtp_from_name',  '*', 'Ensotek',                      NOW(3), NOW(3)),  -- kompozit: MOE Kompozit / karbonkompozit'in gerçek marka adı — koddaki getOfferMailSiteName default'una bak
(UUID(), 'smtp_ssl',        '*', 'true',                         NOW(3), NOW(3))
```

`smtp_password` her zaman `'change-me-in-admin'` placeholder kalsın — **gerçek mailbox şifresi seed'e
YAZILMAZ**, prod DB'ye Admin Panel → Site Ayarları üzerinden elle girilecek (aşağıdaki "Manuel
adımlar" bölümüne bak).

### C) `ensotek_de` ve `kuhlturm` seed'lerindeki domain hatasını düzelt
- `ensotek_de/backend/src/db/seed/sql/040_site_settings.sql:327,329` → `no-reply@ensotek.de`
- `kuhlturm/backend/src/db/seed/sql/040_site_settings.sql:326,328` → `no-reply@kuhlturm.com`

Sonrasında ilgili sitede `bun run build && bun run db:seed:*:fresh` (CLAUDE.md DB şema kuralı —
`ALTER TABLE` yasak, seed'ten fresh kurulum).

### D) `contact` admin bildirim hedefini düzelt (site_settings pattern'e taşı)
`packages/shared-backend/modules/contact/controller.ts:20-23` — `offer/service.ts:135-138`'deki
`getOffersAdminEmails` pattern'ini örnek al. Yeni bir site_settings key ekle:
`admin_notification_email` (comma-separated, `parseToStringArray` ile parse — `offer/service.ts`
içindeki aynı helper'ı reuse et). Çözüm sırası: `admin_notification_email` → yoksa
`offers_admin_email` (zaten var, fallback olarak kullanılabilir) → yoksa mevcut
`smtp.fromEmail` (son çare, mevcut davranış). Her site seed'ine
`(UUID(), 'admin_notification_email', '*', 'orhanguzell@gmail.com', NOW(3), NOW(3))` satırı ekle
(mevcut `.env AUTH_ADMIN_EMAILS`/`ADMIN_EMAIL` değerleriyle tutarlı — kompozit/.env.production ve
kuhlturm/.env'de hâlâ `admin@example.com` placeholder var, gerçek adrese çekilmeli, yoksa bu site'lar
için bildirim hiçbir yere gitmez).

### E) `orders` modülüne admin bildirim maili ekle
`packages/shared-backend/modules/orders/controller.ts` — mevcut `telegramNotify({event:'new_order'})`
bloğunun yanına (~satır 144), `contact/controller.ts`'deki `sendMailRaw` + admin-email-çözümleme
pattern'ini (D maddesindeki ortak resolver'ı) kullanarak "Yeni Sipariş" bildirim maili ekle. Müşteriye
ayrıca mail YOK (sipariş akışı dealer/B2B, portal üzerinden takip ediliyor) — sadece admin'e bildirim,
konuyu genişletme.

### F) `catalogRequests` modülüne admin bildirim maili ekle (düşük öncelik ama tutarlılık için önerilir)
`packages/shared-backend/modules/catalogRequests/controller.ts:53-61` — `sendCatalogRequestMail(row)`
çağrısının yanına, aynı admin-email-resolver ile "Yeni katalog talebi" bildirimi ekle.

### G) `.env` / `.env.production` temizliği (4 site)
`SMTP_USER`/`MAIL_FROM=info@koenigsmassage.com` satırlarını sil veya doğru placeholder'a
(`no-reply@<domain>`) çevir. **Sadece local/repo dosyaları** — VPS'teki canlı `.env` ayrı, prod'a
dokunmadan önce Claude/kullanıcıya haber ver (deploy sürecinin parçası, bu brief'in kapsamı değil).

---

## Kapsam dışı / dokunma
- Gmail OAuth2 / `client_secret_....json` — kullanıcı kararıyla iptal, kod eklenmeyecek.
- WhatsApp/SMS/Telegram genişletme — kullanıcı kararıyla iptal.
- `emailTemplates` sistemine contact/offer/order mail'lerini taşıma (template-driven hale getirme) —
  şu an hard-coded HTML string'ler çalışıyor, bu brief sadece SMTP config + eksik admin bildirimi
  kapsıyor, template migrasyonu ayrı iş.

## Manuel adımlar (KULLANICI yapacak — Codex/Claude bu adımları otomatikleştiremez)
1. `dig MX <domain>` ile doğrulandı: 4 domain de Google Workspace değil, Hostinger'ın kendi mail
   sunucusunu kullanıyor (`mail.<domain>`). Hostinger hPanel → Emails → Create Email Account'tan
   her domain için `no-reply@<domain>` mailbox'ı aç, güçlü bir şifre üret ve not et:
   `no-reply@ensotek.de`, `no-reply@ensotek.com.tr`, `no-reply@karbonkompozit.com.tr`,
   `no-reply@kuhlturm.com`. Gmail'deki gibi ayrı bir "app password" adımı YOK — mailbox şifresi
   direkt SMTP şifresi.
2. Prod DB'de Admin Panel → Site Ayarları → SMTP bölümünden (her site ayrı ayrı): `smtp_password`
   alanına gerçek mailbox şifresini gir; `smtp_host=smtp.hostinger.com`, `port=465`, `ssl=true`,
   `username=no-reply@<domain>`. Seed dosyasına gerçek şifre YAZILMAZ, sadece prod DB'ye admin
   panelden.
3. `kompozit` ve `kuhlturm` için `admin_notification_email` / `AUTH_ADMIN_EMAILS` gerçek bir adrese
   çekilsin (şu an placeholder `admin@example.com`) — hangi adrese bildirim gitsin, karar senin.

## Doğrulama (teslim öncesi)
1. Her site `bun run build && bun run type-check` temiz.
2. Her site için `bun run db:seed:*:fresh` sonrası `site_settings`'te `smtp_*` + `admin_notification_email`
   satırları doğru domain ile mevcut.
3. Admin Panel → mevcut `/mail/test` endpoint'i (`packages/shared-backend/modules/mail-api/
   controller.ts`) ile her 4 site için gerçek app password girildikten sonra test maili gönder.
4. Contact formu üzerinden test mesajı gönder → hem admin bildirim maili (yeni resolver'dan doğru
   adrese) hem müşteri auto-reply (from: no-reply@<domain>) geldiğini doğrula.
5. Sipariş / katalog talebi test akışı → admin bildirim maili geldiğini doğrula.
