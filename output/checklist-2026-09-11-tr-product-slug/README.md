# TR11 ek — Tek hücreli CTP ürününün TR/DE slug ve alt metni; ürün detayında slug yönlendirmesi (11 Eylül 2026)

**Bulgu:** Hero kabulünde bir kartın TR alt metni İngilizceydi. İnceleme: `product_i18n` bbbb0002 (Açık Devre – Tek Hücre CTP) için
TR ve DE satırlarında **slug ve alt İngilizce** kalmış (`open-circuit-cooling-towers-ctp-series`); başlık/açıklama/meta doğru dildeydi.

**Düzeltme (kullanıcı: "veritabanından güncelle"):**
- Canlı DB (yedek `/var/backups/ensotek-checklist/ensotek_com_tr_db.product_i18n.before-p2-slug-alt-20260911.sql`):
  TR slug `acik-devre-sogutma-kuleleri-tek-hucre-ctp-serisi`, alt "Açık devre su soğutma kulesi – Tek hücreli CTP serisi";
  DE slug `offene-kuehltuerme-einzelzelle-ctp-serie`, alt "Offener Kühlturm – Einzelzelle CTP-Serie". Aynı değerler seed `011_products_from_vps.seed.sql` içinde.
- Ürün detayı: backend yabancı slug'ı çözüp istenen dilin kaydını döndürdüğünde adres o dilin gerçek slug'ına **308**; hiç çözülemezse
  blog/galeri ile ortak yardımcı (`redirectToLocalizedSlugOrNotFound`) → 308 veya 404.

**Canlı kabul:**

| Adres | Sonuç |
|---|---|
| `/tr/urunler/open-circuit-cooling-towers-ctp-series` (eski) | 308 → `/tr/urunler/acik-devre-sogutma-kuleleri-tek-hucre-ctp-serisi` |
| `/tr/urunler/acik-devre-sogutma-kuleleri-tek-hucre-ctp-serisi` | 200 |
| `/en/products/open-circuit-cooling-towers-ctp-series` | 200 |
| `/en/products/acik-devre-…-ctp-serisi` (TR slug) | 308 → EN slug |
| `/tr/urunler/olmayan-urun-xyz` | 404 |
| Hero TR kart alt metni | "Açık devre su soğutma kulesi – Tek hücreli CTP serisi" |
| EN detay hreflang tr | yeni TR slug |

Sitemap 300 sn ISR ile yenilenir; dağıtımdan hemen sonra eski TR slug görünebilir. Rollback `.next.before-checklist-20260911T175813Z`;
commit `ensotek_com_tr` `3eb4358` + `c624972`. DE bu sitede aktif dil değil; satır yalnız veri tutarlılığı için düzeltildi.
