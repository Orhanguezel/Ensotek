# CODEX BRIEF — Ensotek (ensotek.de) SEO / İndexleme Düzeltmeleri

> Kaynak analiz: Search Console canlı (2026-06-26). `sc-domain:ensotek.de` (orhanguzell siteOwner).
> Kapsam: **yalnızca** `ensotek_de/frontend`. ensotek_com / ensotek_com_tr AYRI.
> Bu brief site-tarafı (frontend) düzeltmelerdir. Analytics tag kurulumu AYRI brief: `CODEX-BRIEF-analytics-kurulum.md`.

## GSC bulguları (80/135 URL tarandı → 64 indexli, 16 sorunlu)
- 🟠 **URL unknown to Google (13):** hem `/en/*` hem `/tr/*` — gerçek ürün/içerik sayfaları Google'a keşfettirilmemiş:
  `/en/industrial-cooling-solutions`, `/en/loesungen`, `/en/product/offene-kuehltuerme-einzelzelle-ctp-serie`, `/en/team`,
  `/tr/ensotek-wasserkuehltuerme`, `/tr/hvac-cooling-solutions`, `/tr/kuehlturm-layout-industrieanlagen`, `/tr/dsgvo-kvkk` …
- 🔴 **Soft 404 (1):** `/en/nutzungsbedingungen` (İngilizce locale'de boş/içeriksiz render).
- 🟠 **noindex (2):** `/en/legal` + `/tr/legal` (kasıtlı — DOKUNMA).
- **Arama görünürlüğü çok düşük:** 28g 1 tık · 104 gösterim · **pozisyon 28.8** (3. sayfa).
- **Önemli:** `sitemap.ts` zaten tüm static + dynamic (service/product/library/custom_pages) sayfaları, tüm locale için üretiyor → URL'ler sitemap'TE VAR. Yani "unknown" sebebi sitemap değil, **iç link/discovery + zayıf otorite**.

---

## FIX 1 — "URL unknown to Google" → iç link / discovery (YÜKSEK)
13+ sayfa sitemap'te ama Google keşfetmemiş. Sitemap tek başına yeterli sinyal değil; Google iç linkleri takip eder. Bu sayfalar muhtemelen menü/footer/ilgili-içerikten linklenmiyor.

İş (`ensotek_de/frontend`):
- [ ] **Ana menü / footer**'da ürün, çözümler (solutions), team, kurumsal (mission-vision/quality) ve öne çıkan custom_pages'e link olduğundan emin ol. Eksikleri ekle.
- [ ] **İlgili içerik / breadcrumb / iç linkleme:** ürün detay → ilgili ürünler, solutions → ilgili product/service, blog/news → ürün; en az 2-3 dahili linkten erişilebilirlik.
- [ ] Sitemap'in tüm content endpoint'lerini gerçekten çektiğini doğrula (`fetchSlugs('/services'|'/products'|'/library'|'/custom_pages')` boş dönmesin — API canlı mı?).
- [ ] (Deploy sonrası, Claude) öncelikli sayfalara GSC "Request indexing".

**Kabul:** "unknown to Google" sayfaları en az 2 dahili linkten erişilebilir; birkaç hafta içinde GSC'de "indexed"e geçer.

## FIX 2 — `/en/nutzungsbedingungen` Soft 404 (YÜKSEK)
İngilizce locale'de bu sayfa boş/içeriksiz render → Google "Soft 404". vistaseeds `/de/urunler` ile aynı kalıp: locale'e içerik gelmiyor.

İş:
- [ ] İlgili sayfa (custom_pages/[slug] ya da legal alt sayfası) için EN içerik yoksa **locale fallback** (primary locale içeriğine düş) veya gerçek 404/301. Boş 200 render ETME.
- [ ] Aynı kalıbı diğer locale'lerde içerik gelmeyen custom/legal sayfaları için de uygula.

**Kabul:** `/en/nutzungsbedingungen` 200 + içerik dolu (veya temiz 301/404); GSC'de "Soft 404" gider.

## FIX 3 — locale ↔ slug stratejisi (ORTA · SAHİP KARARI)
URL'ler `/tr/` ve `/en/` prefix taşıyor ama slug'lar Almanca/tek-dilli (kuehlturm, wasserkuehltuerme, nutzungsbedingungen `/en/` altında). İçerik locale başına çevrili değilse bu ince/duplike içerik riski.
- **/en ve /tr SEO hedefi VARSA:** içerikleri locale'e çevir + hreflang + (gerekirse) slug lokalize ya da kanonik tek-slug + hreflang (migration'sız önerilir).
- **Hedef YOKSA:** primary (Almanca) locale kanonik; diğer locale'leri noindex + sitemap'ten çıkar.
> ⚠️ Codex karara bağlamasın; sahip "ensotek.de'de /en + /tr ranking istiyor muyuz?" cevabına kadar FIX 1 + FIX 2 yeterli (ikisi de karardan bağımsız, kesin doğru).

---

## Kapsam dışı / dokunma
- `/en/legal`, `/tr/legal` noindex doğru — dokunma.
- Analytics tag kurulumu → ayrı brief (`CODEX-BRIEF-analytics-kurulum.md`).
- Düşük pozisyon (otorite/içerik derinliği) → uzun-vade SEO; FIX 1-2 + GA4 tag sonrası ele alınır.

## Doğrulama (teslim öncesi)
1. `cd ensotek_de/frontend && bun run build` + `bun run type-check` temiz.
2. "unknown" sayfaları menü/footer/ilgili-içerikten linkli (kod incelemesi).
3. `/en/nutzungsbedingungen` 200 + içerik (veya temiz 404/301).
4. (Deploy sonrası, Claude) GSC sitemap + URL Inspection → discovery/index doğrulanır.
