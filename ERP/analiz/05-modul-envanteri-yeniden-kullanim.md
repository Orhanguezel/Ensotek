# ANALİZ-05 · Modül Envanteri ve Yeniden Kullanım Haritası

> **Karar (2026-08-18):** *"Mümkün olduğunca kodu sıfırdan yazmayacağız. Zaten var
> olanları kullanacağız. Farklı projelerden bu modülleri birleştirerek yazılımımızı
> hazırlayacağız."*
>
> Bu belge, workspace'teki **mevcut çalışan kodun** Ensotek ERP modüllerine
> eşlenmesidir. Her satır gerçek bir dizinden doğrulanmıştır.

---

## 1. Kaynak havuzu

| Proje | Ne var | Durum | Not |
|---|---|---|---|
| **transpalet-crm** | Fastify backend, **48 modül** + admin_panel + shared-backend | Aktif | **En yakın eşleşme.** Üretim emri, reçete, stok, sevkiyat, satın alma, teklif, servis, personel, Logo entegrasyonu |
| **paspas** (Paspas ERP) | Fastify backend, **41 modül**, teslim edildi | Bakım modu | Üretim emirleri, reçeteler, mal kabul, satış siparişleri, gantt, vardiya analizi |
| **ihracatradari.com.tr** | `commercial` modülü: teklif+revizyon+proforma+**packing list**+**navlun/incoterm**+onay motoru; ayrıca `enrichment`, `decision-makers`, `scans`, `scoring`, `crm`, `customs` | Aktif | **Navlun ve firma bulma** için ana kaynak |
| **osgb-yazilim** | `personel`, `calisan`, `evrak`, `atama`, `gorev`, `kpi`, `saglik`, `firma`, `taseron`, `teklif` | Aktif | **Personel yönetimi** için ana kaynak |
| **e-fatura-service** | Ayrı servis: fatura şemaları, kuyruk, worker, admin | Aktif | **Muhasebe/e-fatura** entegrasyonu |
| **Ensotek/packages/shared-backend** | 44 modül: auth, storage, mail, notifications, userRoles, offer, products, categories, db_admin, audit, theme, siteSettings… | Aktif | Ensotek'in kendi ortak paketi — **altyapı tabanı** |
| **Google-Maps-Scrapper** | Python scraper, işletme verisi çıkarma | Araç | Firma bulma veri kaynağı |
| **gzl-gelir-crm** | CRM/gelir yönetimi, proje tarama scriptleri | Aktif | Pipeline/fırsat mantığı |
| **sablon_proje** | Kanonik başlangıç şablonu (frontend/backend/admin_panel) | Şablon | İskelet kurulumu |

---

## 2. Eşleme tablosu — ERP modülü → mevcut kod

**Uyum:** 🟢 doğrudan alınır (küçük uyarlama) · 🟡 alınır ama ciddi genişletme gerekir · 🔴 mevcut kod fikir verir, iş büyük ölçüde yeni

| ERP Modülü | Kaynak | Mevcut modül | Uyum | Gereken iş |
|---|---|---|---|---|
| **MOD-00** Altyapı (auth, rol, yetki, audit, storage, mail, notification, db_admin, tema, ayarlar) | Ensotek shared-backend + transpalet | `auth`, `userRoles`, `profiles`, `audit`/`admin_audit`, `storage`, `mail`, `mailAccounts`, `notifications`, `db_admin`, `siteSettings`, `theme` | 🟢 | Marka/rol uyarlaması |
| **MOD-01** Talep ve CRM | transpalet | `talepler`, `crm`, `musteriler`, `musteri_yetkilileri`, `iletisim` | 🟢 | Talep kanalı (e-posta/telefon/WhatsApp) + talep tipi (kule/yedek parça) alanları |
| **MOD-02** Teklif | ihracatradari `commercial` + transpalet `teklifler` | `quote-revision-policy`, `proforma-document`, `document-service`, `approval-engine`, `public-link-service`, `email-delivery` | 🟡 | **Teknik/ticari/iç-maliyet olmak üzere 3 ayrı PDF**; standart dışı kalemlerin kırmızı işaretlenmesi; kule şablonu |
| **MOD-03** Maliyet | ihracatradari `calculation-engine` + `fixed-decimal` | Ondalık güvenli hesap, çarpan, para birimi | 🟡 | **Teklif anı snapshot**, çarpan+pazarlık payı+EUR kuru zinciri, 3 katmanlı maliyet, işçilik (adam-gün/harcırah/SGK/yemek) |
| **MOD-04** Ürün Ağacı (BOM) | transpalet/paspas `receteler` | `receteler` + `recete_kalemleri` | 🔴 | Mevcut şema **tek seviyeli** ve maliyetsiz. Gerekli: **çok seviyeli patlatma + maliyet roll-up**, kg-bazlı kalem (CTP), işçilik satırı, parametrik model türetme, revizyon |
| **MOD-05** Ürün Kataloğu ve Stok | transpalet | `urunler`, `stoklar`, `hareketler`, `categories`, `subCategories`, `mal_kabul`, `tanimlar` | 🟢 | **Stok kodu şeması sıfırdan kurulacak** (Ensotek'te yok); ürün tipi (mamul/yarı mamul/hammadde/ticari mal/hizmet) |
| **MOD-06** Satın Alma | transpalet | `satin_alma`, `tedarikci` | 🟢 | Fiyat geçmişi → maliyeti besleme bağı |
| **MOD-07** Sipariş / Üretime Teslim | transpalet + paspas | `satis_siparisleri`, `ihtiyac_formlari`, `gorevler` | 🟡 | **ENK/ENB numaralandırma**, **avans kontrolü bloğu**, Teklif İnceleme Formu'nun dijitali |
| **MOD-08** Mühendislik | Ensotek shared `storage` + transpalet | Dosya yönetimi, `gorevler` | 🟡 | AutoCAD/DWG bağlama, müşteri teknik soru-cevap kaydı, **malzeme listesi üretimi**, seçim yazılımı entegrasyonu |
| **MOD-09** Üretim ve İş Emirleri | transpalet + paspas | `uretim_emirleri`, `operator`, `is_yukler`, `gantt`, `vardiya_analizi`, `makine_havuzu` | 🟢 | Atölye yönlendirme mantığı (kaynak/polyester/montaj), atölye bazlı iş emri |
| **MOD-10** Kalite | — | Yok | 🔴 | Basınç testi → galvaniz → tekrar test akışı; test formu, fotoğraf, rapor |
| **MOD-11** Sevkiyat | transpalet + ihracatradari | `sevkiyat` + `packing-list`, `packaging-preset-repository`, `packing-document` | 🟢 | Palet/koli/konteyner hesabı hazır; TIR/konteyner/kamyon ayrımı eklenir |
| **MOD-12** Süpervizörlük ve Servis | transpalet + osgb | `servis`, `atama`, `gorev`, `personel` | 🟡 | Süpervizör seyahat/otel/harcırah, saha raporu, müşteri imzası, garanti |
| **MOD-14** Firma Bulma | **ihracatradari** + Google-Maps-Scrapper | `enrichment`, `decision-makers`, `scans`, `scoring`, `crm`, `customs` | 🟡 | Ensotek sektörüne (soğutma kulesi kullanan tesisler) uyarlama |
| **MOD-15** Navlun ve Lojistik | **ihracatradari `commercial`** | `calculation-engine` (karton/palet ölçü-ağırlık dönüşümü), `freight`, `defaultIncoterm` (EXW/FOB/CIF), `packing-list` | 🟢 | Kule boyutlarına uyarlama; TIR/konteyner sığdırma; demonte-paket ayrımı |
| **MOD-16** Personel Yönetimi | **osgb-yazilim** + transpalet | `personel`, `calisan`, `evrak`, `atama`, `kpi`, `saglik`; transpalet `personel`, `vardiya_analizi` | 🟢 | Atölye/vardiya bağlama, adam-gün maliyetine bağlanma |
| **MOD-17** Bakım Yönetimi (fabrika ekipmanı) | transpalet + paspas | `makine_havuzu`, `makine_verileri`, `makine_kapali_araliklar` | 🟡 | Periyodik bakım planı, arıza kaydı |
| **MOD-18** Fabrika Yönetimi | transpalet + paspas | `is_yukler`, `gantt`, `vardiya_analizi`, `operator`, `dashboard` | 🟡 | Atölye kapasitesi, yükleme, darboğaz görünümü |
| **MOD-19** Satış Yönetimi | transpalet `crm` + gzl-gelir-crm | Pipeline, fırsat, aktivite, rapor | 🟢 | Kazanma oranı, satış hedefi (prim **hariç** — OUT-01) |
| **MOD-20** Muhasebe / Maliyet Muhasebesi | **e-fatura-service** + transpalet `logo_entegrasyon` | Fatura şemaları, kuyruk/worker; Logo entegrasyon köprüsü | 🟡 | Cari, tahsilat, ödeme planı, fatura/irsaliye; e-fatura ayrı servis olarak bağlanır |
| **MOD-21** Yönetim ve Raporlama | transpalet + paspas | `dashboard`, `kpi`, `llm`, `page_feedback`, `test_center` | 🟢 | Ensotek KPI'ları |

---

## 3. Doğrulanmış tespitler

### 3.1 En büyük kazanç — transpalet-crm
48 modülün **çoğu** doğrudan karşılık buluyor: `uretim_emirleri`, `receteler`, `stoklar`,
`satin_alma`, `tedarikci`, `sevkiyat`, `mal_kabul`, `teklifler`, `musteriler`, `servis`,
`personel`, `gorevler`, `gantt`, `hareketler`, `tanimlar`, `operator`, `vardiya_analizi`.
Aynı stack (Fastify + MySQL + seed-SQL), aynı modül dosya düzeni
(`controller / repository / router / schema / service / validation`).

### 3.2 En büyük boşluk — Ürün Ağacı 🔴
`receteler` şeması tek seviyeli ve **maliyet taşımıyor**:
```
receteler (kod, ad, urun_id, tip, hedef_miktar)
  └── recete_kalemleri (urun_id, miktar, fire_orani, sira)
```
Ensotek'in ihtiyacı (bkz. [AS-IS §3](01-mevcut-durum-as-is.md)):
- **Çok seviyeli patlatma** — `CTP-5 → CTP Gövde (270 kg) → kendi reçetesi`
- **Kg-bazlı kalem** — miktar birimi kg, fiyat €/kg
- **İşçilik satırı** — adam-gün, harcırah, SGK, yemek
- **Maliyet roll-up** — alt ağaçlar otomatik okunur
- **Parametrik türetme** — "iskelet aynı, miktarlar değişir" (~130 model)
- **Revizyon + snapshot**

> Bu modül **projenin teknik kalbi ve en yüksek riskli parçası**. Şema sıfırdan
> tasarlanacak, mevcut `receteler` yalnızca dosya düzeni örneği olarak kullanılacak.

### 3.3 İkinci boşluk — Kalite 🔴
Hiçbir projede test/kalite modülü yok. Serpantin basınç testi → galvaniz → tekrar test
akışı sıfırdan yazılacak. Küçük ama tamamen yeni.

### 3.4 Sürpriz kazanç — Navlun 🟢
`ihracatradari/commercial/calculation-engine.ts` içinde karton/palet dönüşümü,
en-boy-yükseklik, net/brüt ağırlık, palet darası hazır; `schemas.ts` içinde
`freight`, `freightEvidence`, `defaultIncoterm: EXW|FOB|CIF` mevcut.
Ensotek'in TIR/konteyner sığdırma ve demonte sevk hesabı bunun üzerine kurulur.

### 3.5 Modül kayıt deseni zaten var
`transpalet-crm/admin_panel/src/navigation/permissions.ts` — `AdminNavKey` union +
`NAV_ROLES` (modül → rol) + `ROLE_HOME`. **"Hazır olmayan modül açılmaz"** kuralı
bu desenin üzerine bir `status` alanı eklenerek kurulur — bkz.
[Mimari İskelet](06-mimari-iskelet.md).

---

## 4. Kaba yeniden kullanım oranı

| Kategori | Modül | Pay |
|---|---|---|
| 🟢 Doğrudan alınır | MOD-00, 01, 05, 06, 09, 11, 15, 16, 19, 21 | **10 / 21** |
| 🟡 Alınır + genişletilir | MOD-02, 03, 07, 08, 12, 14, 17, 18, 20 | **9 / 21** |
| 🔴 Büyük ölçüde yeni | MOD-04 (BOM), MOD-10 (Kalite) | **2 / 21** |

> Eforun büyük kısmı **MOD-04 (Ürün Ağacı + Maliyet motoru)** ve **entegrasyon/uyumlama**
> tarafında. "Modülü kopyaladık, bitti" değil: her modül tek bir veri modeline ve tek bir
> yetki sistemine oturtulacak.

---

## 5. Yeniden kullanım kuralları

1. **Kopyala-yapıştır değil, taşı-ve-birleştir.** Alınan modül Ensotek ERP'nin
   `packages/` altındaki ortak yapısına oturur; iki farklı `musteriler` tablosu olmaz.
2. **Tek veri modeli.** Farklı projelerden gelen modüllerin tablo adları ve id tipleri
   (char(36) UUID) tek standarda çekilir.
3. **Tek yetki sistemi.** Her modül aynı `userRoles` + nav-key kaydına bağlanır.
4. **Seed-SQL disiplini.** Şema değişikliği `ALTER TABLE` ile değil,
   `src/db/seed/sql/0XX_*_schema.sql` güncellenip `db:seed:*:fresh` ile yapılır
   (workspace kuralı).
5. **Alınan kodun testleri de alınır.** ihracatradari `commercial` ve osgb `saglik/fiyat`
   modüllerinde mevcut test dosyaları var; bunlar bırakılmaz.
