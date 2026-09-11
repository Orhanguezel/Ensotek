# CODEX BRIEF — Ensotek (ensotek.de) Analytics Tag Kurulumu

> Hedef: GA4'teki **"Web sitenizde veri toplama etkin değil"** uyarısını gidermek.
> Kapsam: **yalnızca** `ensotek_de/frontend`. ensotek_com / ensotek_com_tr AYRI (kendi ID'leri, bu brief'in dışında).
> Analiz (2026-06-26, Claude tarafından kodla doğrulandı): ensotek_de frontend'inde **hiç GA4/GTM tag'i render edilmiyor** → site hiç veri yollamıyor.

---

## ✅ Doğrulanmış zemin (DOKUNMA — zaten hazır)

Bu maddeler kod/DB ile teyit edildi; **iş yok**:

- **site_settings değerleri DB'de ve canlı serve ediliyor** (seed `backend/src/db/seed/sql/040_site_settings.sql:352-353`, `locale='*'` global):
  - `gtm_container_id = GTM-WV5FRN93`
  - `ga4_measurement_id = G-7S6TW9CNRJ`
  - Canlı doğrulama: `GET https://ensotek.de/api/site_settings/gtm_container_id?locale=de` → değer dönüyor.
  - ⚠️ Eski brief'teki "Adım 1: site_settings yaz" **GEREKSİZ** — değerler zaten var, yazma/seed dokunma.
- Backend servis hazır: `getGtmContainerId()` / `getGa4MeasurementId()` (`backend/src/modules/siteSettings/service.ts` + `packages/shared-backend/modules/siteSettings/service.ts`). Frontend SSR'de `fetchSetting('<key>', locale)` ile okunur; dönen `row.value` düz string'tir.
- Frontend `fetchSetting` helper'ı: `frontend/src/i18n/server.ts` → `fetchSetting(key, locale, { revalidate }) => { value } | null`.

---

## 🎯 TEK İŞ — Frontend: GTM/GA4 render et

**Dosya:** `ensotek_de/frontend/src/app/[locale]/layout.tsx` (RootLayout — `fetchSetting` + `<head>` + `<body>` pattern'i hâlihazırda var; bkz. satır ~147-204).

**Yöntem:** `@next/third-parties` (resmi Next paketi, Next 16 uyumlu). Şu an **kurulu değil** → kur:
```bash
cd ensotek_de/frontend && bun add @next/third-parties
```

### Adımlar

1. **SSR'de ID'leri çek.** RootLayout içindeki mevcut `Promise.all([...])` bloğuna (satır ~147) iki `fetchSetting` ekle:
   ```ts
   const [seoRow, socialsRow, logoRow, contactRow, gtmRow, ga4Row] = await Promise.all([
     fetchSetting('seo', locale, { revalidate: 300 }),
     fetchSetting('socials', locale, { revalidate: 3600 }),
     fetchSetting('site_logo', locale, { revalidate: 3600 }),
     fetchSetting('contact_info', locale, { revalidate: 3600 }),
     fetchSetting('gtm_container_id', locale, { revalidate: 3600 }),
     fetchSetting('ga4_measurement_id', locale, { revalidate: 3600 }),
   ]);
   const gtmId = typeof gtmRow?.value === 'string' ? gtmRow.value.trim() : '';
   const ga4Id = typeof ga4Row?.value === 'string' ? ga4Row.value.trim() : '';
   ```

2. **Koşullu render (çift sayım YASAK).** `@next/third-parties/google`'dan import et ve `<body>` içinde, **`{children}` öncesinde** render et:
   ```tsx
   import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
   // ...
   <body suppressHydrationWarning={true}>
     {gtmId
       ? <GoogleTagManager gtmId={gtmId} />
       : ga4Id
         ? <GoogleAnalytics gaId={ga4Id} />
         : null}
     {/* mevcut NextIntlClientProvider ... */}
   ```
   - **GTM varsa SADECE GoogleTagManager** (GTM zaten GA4'ü içeriyor). gtag/GoogleAnalytics EKLEME.
   - GTM yok ama GA4 varsa fallback olarak GoogleAnalytics.
   - `GoogleTagManager` head script + body `<noscript>` iframe'ini otomatik üretir; **elle GTM snippet yazma**.

3. **ID'ler sabit (hardcoded) OLMASIN** — yukarıdaki gibi `site_settings`'ten gelmeli (ensotek_com/com_tr aynı kodu farklı ID ile kullanacak).

---

## 🛑 Kod DIŞI — Claude/operatör halleder (Codex dokunmaz)

- **GTM içi çift GA4 tag:** GTM-WV5FRN93 container'ında 2 googtag var (`Google Tag – ensotek.de (GA4)` + `Google etiketi`). İkisi de aynı ID'yi (G-7S6TW9CNRJ) yolluyorsa biri fazlalık → çift sayım. **GTM konsolundan** kontrol/dedupe edilir (kod değil).

---

## ✅ Codex teslim kriteri (PR/commit öncesi)

1. `cd ensotek_de/frontend && bun run build` temiz (hata yok).
2. `bun run type-check` temiz.
3. Yeni bağımlılık `@next/third-parties` `package.json`'a eklendi.
4. ID'ler kodda sabit değil; `fetchSetting`'ten geliyor.
5. GTM + ayrı gtag **aynı anda render edilmiyor** (kod incelemesiyle görülebilir).

> ⚠️ Deploy + canlı doğrulama (DebugView/Realtime, GA4 uyarısının kalkması) **Claude** tarafından yapılır — Codex sadece kodu yazıp build+type-check yeşil bırakır. Branch'e push et, deploy etme.

---

## Claude'un doğrulama planı (Codex sonrası)

1. Diff review: layout değişikliği + yeni paket, hardcoded ID yok, çift tag yok.
2. VPS deploy: `git pull --ff-only` → `bun run build` (standalone) → `pm2 restart ensotek-frontend`.
3. Canlı kaynak: `GTM-WV5FRN93` snippet head'de + `<noscript>` body'de.
4. GA4 DebugView/Realtime: `page_view` **tek hit** (çift değil).
5. 24-48s sonra GA4 uyarısı kalkar; ekosistem panelinde (ensotek tenant) veri akar.
