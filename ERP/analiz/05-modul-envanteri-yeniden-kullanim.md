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
| **paspas** (Paspas ERP) | 41.930 satır backend, **41 modül**, **129 seed-SQL**, 74 test, 70 admin ekranı; teslim edildi | Bakım modu | **Üretim kırılımının tamamı**: operasyon rotası, iş emri operasyonları, planlanan↔gerçekleşen, fire, hammadde rezervasyonu, vardiya/duruş, iş yükü kuyruğu, parti. **Maliyet modülü YOK** — ama maliyetin hesaplandığı ham veri burada |
| **fuar-teklif / TeklifRota** | 21.274 satır backend, **73 seed-SQL şeması**, 57 admin ekranı, ayrı **`@teklifrota/freight-engine`** paketi (5.515 satır) | Aktif | **En büyük tek kazanç.** *"Tekliften teslimata tek rota"* — teklif yaşam döngüsü, revizyon+snapshot, proforma, packing list, sipariş, sevkiyat, **çok modlu navlun motoru**, nakliyeci RFQ, müşteri teklif portalı |
| **ihracatradari.com.tr** | `enrichment`, `decision-makers`, `scans`, `scoring`, `customs`, `export-profile`; `commercial` (TeklifRota'nın erken sürümü) | Aktif | **Firma bulma** için ana kaynak |
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
| **MOD-02** Teklif | **TeklifRota** `commercial` | `state-machine` (11 durumlu teklif akışı), `quote-revision-policy`, `commercial_quote_sequences` (teklif no), `commercial_quote_revisions` (**snapshot JSON + totals_snapshot**), `commercial_quote_events` (zaman çizelgesi), `approval-engine`, `document-service`, `public-link-service` (**müşteri teklif portalı /teklif/[token]**), `email-delivery`, `proforma-document` | 🟢→🟡 | **Teknik/ticari/iç-maliyet 3 ayrı PDF**; standart dışı kalemlerin kırmızı işaretlenmesi; kule şablonu. Yaşam döngüsü, numaralandırma ve revizyon **hazır** |
| **MOD-03** Maliyet | TeklifRota `calculation-engine` + `fixed-decimal` + revizyon snapshot deseni | Ondalık güvenli hesap, çarpan, para birimi, `totals_snapshot JSON` | 🟡 | Snapshot **mekanizması** hazır, **içeriği yok**: TeklifRota ticari bir teklif aracı, üretim maliyeti hesaplamıyor. Çarpan+pazarlık payı+EUR kuru zinciri, 3 katmanlı maliyet, işçilik satırları eklenecek |
| **MOD-04** Ürün Ağacı (BOM) | transpalet/paspas `receteler` | `receteler` + `recete_kalemleri` | 🔴 | Mevcut şema **tek seviyeli** ve maliyetsiz. Gerekli: **çok seviyeli patlatma + maliyet roll-up**, kg-bazlı kalem (CTP), işçilik satırı, parametrik model türetme, revizyon |
| **MOD-05** Ürün Kataloğu ve Stok | transpalet | `urunler`, `stoklar`, `hareketler`, `categories`, `subCategories`, `mal_kabul`, `tanimlar` | 🟢 | **Stok kodu şeması sıfırdan kurulacak** (Ensotek'te yok); ürün tipi (mamul/yarı mamul/hammadde/ticari mal/hizmet) |
| **MOD-06** Satın Alma | transpalet | `satin_alma`, `tedarikci` | 🟢 | Fiyat geçmişi → maliyeti besleme bağı |
| **MOD-07** Sipariş / Üretime Teslim | TeklifRota + transpalet + paspas | TeklifRota `order-service` + `311_orders_shipments.sql` + `315_inventory_fulfillment.sql`; transpalet `satis_siparisleri`, `ihtiyac_formlari` | 🟢→🟡 | **ENK/ENB numaralandırma**, **avans kontrolü bloğu**, Teklif İnceleme Formu'nun dijitali |
| **MOD-08** Mühendislik | Ensotek shared `storage` + transpalet | Dosya yönetimi, `gorevler` | 🟡 | AutoCAD/DWG bağlama, müşteri teknik soru-cevap kaydı, **malzeme listesi üretimi**, seçim yazılımı entegrasyonu |
| **MOD-09** Üretim ve İş Emirleri | **paspas** (birincil) + transpalet | `uretim_emirleri` (2.675 st), `operator` (3.853 st), `is_yukler`, `gantt`, `vardiya_analizi` (1.617 st), `makine_havuzu`; tablolar: `urun_operasyonlari`, `uretim_emri_operasyonlari`, `hammadde_rezervasyonlari`, `operator_gunluk_kayitlari`, `vardiyalar`, `durus_nedenleri`, `uretim_parti` | 🟢 | Makine/kalıp/çevrim ekseni **atölye/adam-gün eksenine** çevrilecek (kaynak/polyester/montaj) |
| **MOD-10** Kalite | — | Yok | 🔴 | Basınç testi → galvaniz → tekrar test akışı; test formu, fotoğraf, rapor |
| **MOD-11** Sevkiyat | **TeklifRota** + transpalet | `packing-list`, `packing-document` (+snapshot), `packaging-preset-repository`, `281_packing_lists.sql`, `311_orders_shipments.sql`, `/ticari/sevkiyatlar` ekranı; transpalet `sevkiyat` | 🟢 | Palet/koli/konteyner hesabı hazır; TIR/konteyner/kamyon ayrımı ve **demonte kule paketleme** eklenir |
| **MOD-12** Süpervizörlük ve Servis | transpalet + osgb | `servis`, `atama`, `gorev`, `personel` | 🟡 | Süpervizör seyahat/otel/harcırah, saha raporu, müşteri imzası, garanti |
| **MOD-14** Firma Bulma | **ihracatradari** + Google-Maps-Scrapper | `enrichment`, `decision-makers`, `scans`, `scoring`, `crm`, `customs` | 🟡 | Ensotek sektörüne (soğutma kulesi kullanan tesisler) uyarlama |
| **MOD-15** Navlun ve Lojistik | **TeklifRota `@teklifrota/freight-engine`** (ayrı paket) + `commercial` navlun katmanı | Motor: `engine.ts` (kara/deniz/hava, deterministik, gerçek boğaz-kanal geçişleri), `road-distances.ts` (2.161 satır), `toll-shares.ts`, `parameters.ts` (dizel, EUA karbon, otoyol tarifeleri, IATA 166,67, emisyon), `record.ts` (girdi-kanıt + drift tespiti), `place-resolver`. Katman: `freight-repository`, `freight-marketplace`, `freight-exchange-*` (bağlantı/OAuth/webhook/pazarlık), `freight-rate-benchmarks`, `multimodal_plans`, `route-provider`; ekranlar `/navlun-hesaplama`, `/navlun-parametreleri`, `/nakliyeci/rfq`, `/lojistik` | 🟢 | **Neredeyse hazır.** Kule ölçülerini besleyip TIR/konteyner sığdırma ve demonte sevk senaryosunu eklemek yeterli |
| **MOD-16** Personel Yönetimi | **osgb-yazilim** + transpalet | `personel`, `calisan`, `evrak`, `atama`, `kpi`, `saglik`; transpalet `personel`, `vardiya_analizi` | 🟢 | Atölye/vardiya bağlama, adam-gün maliyetine bağlanma |
| **MOD-17** Bakım Yönetimi (fabrika ekipmanı) | transpalet + paspas | `makine_havuzu`, `makine_verileri`, `makine_kapali_araliklar` | 🟡 | Periyodik bakım planı, arıza kaydı |
| **MOD-18** Fabrika Yönetimi | **paspas** (birincil) + transpalet | `is_yukler` (makine kuyruğu, boş makine, planlanan süre), `gantt` (743 st), `vardiya_analizi`, `tatil_makineler`, `makine_kapali_araliklar`, `durus_nedenleri` | 🟢→🟡 | Makine kuyruğu → **atölye kuyruğu**; kapasite adam-gün cinsinden |
| **MOD-19** Satış Yönetimi | transpalet `crm` + gzl-gelir-crm | Pipeline, fırsat, aktivite, rapor | 🟢 | Kazanma oranı, satış hedefi (prim **hariç** — OUT-01) |
| **MOD-20** Muhasebe / Maliyet Muhasebesi | **e-fatura-service** + transpalet `logo_entegrasyon` | Fatura şemaları, kuyruk/worker; Logo entegrasyon köprüsü | 🟡 | Cari, tahsilat, ödeme planı, fatura/irsaliye; e-fatura ayrı servis olarak bağlanır |
| **MOD-21** Yönetim ve Raporlama | transpalet + paspas | `dashboard`, `kpi`, `llm`, `page_feedback`, `test_center` | 🟢 | Ensotek KPI'ları |

---

## 3. Doğrulanmış tespitler

### 3.1 En geniş modül seti — transpalet-crm
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

### 3.4 En büyük kazanç — TeklifRota 🟢

**TeklifRota (`fuar-teklif`) Ensotek ERP'nin ticari omurgasını neredeyse hazır veriyor.**
Sloganı bile örtüşüyor: *"Tekliften teslimata tek rota."*

#### a) Teklif yaşam döngüsü — hazır
`state-machine.ts` 11 durumlu, geçiş kuralları tanımlı bir akış içeriyor:
```
draft → approval_pending → approved → sent → viewed
      → accepted | rejected | revision_requested → revised → …
      → expired | cancelled
```
Ensotek'in bugün Excel'de not düşerek yaptığı teklif takibi ([AS-IS §1.11](01-mevcut-durum-as-is.md))
bunun tam karşılığı. `commercial_quote_events` tablosu zaman çizelgesini zaten tutuyor.

#### b) Revizyon + snapshot — mekanizma hazır, içerik eklenecek
```sql
commercial_quote_revisions (
  quote_id, revision_no,
  snapshot JSON,          -- teklifin o anki tam hali
  totals_snapshot JSON,   -- toplamların o anki hali
  created_by_user_id, created_at )
```
Hamdi Bey'in en çok üstünde durduğu istek (**IHT-307 teklif anı maliyetinin dondurulması**,
H-05) tam olarak bu desen. **Ama:** TeklifRota ticari bir teklif aracıdır, **üretim maliyeti
hesaplamaz**. `totals_snapshot` fiyat toplamlarını dondurur, **maliyet kırılımını değil**.
Ensotek için snapshot'a BOM maliyet kırılımı eklenecek — mekanizma değil, içerik işi.

#### c) Müşteri teklif portalı — hazır, beklenmedik kazanç
`public-link-service.ts` + `/teklif/[token]` + `quote_portal_actions` +
`quote_delivery_public_links`: müşteri kendisine gönderilen bağlantıdan teklifi görüyor,
**görüntüledi / kabul etti / revizyon istedi** aksiyonları sisteme düşüyor.

Ensotek bugün teklifi e-postayla gönderip *"ara ara"* telefonla takip ediyor. Bu modül
tek başına takip darboğazını (D-3) çözer. **Hamdi Bey bunu istemedi — biz ekliyoruz.**

#### d) Numaralandırma — hazır
`commercial_quote_sequences` tablosu teklif numarası sayacını yönetiyor.
ENK/ENB sayaçları ([I-03](06-mimari-iskelet.md)) bu desenin üzerine kurulur.

#### e) Belge üretimi — hazır
`document-service`, `proforma-document`, `packing-document`, `workbook-export`,
`streaming-export` + `quote_documents` / `packing_document_snapshot` tabloları.
Ensotek'in 3 PDF'i (teknik / ticari / iç maliyet) bu tabanın üzerine şablon eklemekle olur.

---

### 3.5 Navlun motoru — beklenenin çok ötesinde 🟢

`packages/freight-engine/` **ayrı, bağımsız bir paket** — 5.515 satır, testli, belgeli.

| Dosya | Satır | İçerik |
|---|---:|---|
| `road-distances.ts` | 2.161 | Gerçek karayolu mesafe tablosu |
| `engine.ts` | 685 | **Çok modlu tahmin motoru**: kara / deniz / hava |
| `toll-shares.ts` | 682 | Ülke bazlı otoyol/geçiş payları |
| `parameters.ts` | 428 | Dizel fiyatı, EUA karbon fiyatı, otoyol tarifeleri, gemi/uçak hızı, **IATA hacimsel katsayısı 166,67**, emisyon katsayıları |
| `record.ts` | 244 | **Girdi-kanıt kaydı + sapma (drift) tespiti** |
| `locations.ts`, `place-resolver.ts`, `feeds.ts` | 514 | Yer çözümleme, besleme adaptörleri |

Motorun kendi belgelediği iki ilke doğrudan Ensotek'in maliyet felsefesine uyuyor:

> **"Hesap deterministiktir."** Aynı girdi her zaman aynı sonucu verir; `Math.random`
> veya zaman bağımlılığı yoktur.

> **"Kayıtta sonuç değil, girdi kanıttır."** Eski bir kayda tıklandığında motor girdilerle
> **yeniden çalıştırılır**; kayıtlı tutarla karşılaştırılır ve sonuç
> `reproduced | drifted | manual | unknown` olarak işaretlenir.

Bu tam olarak Ensotek'in maliyet snapshot'ından beklediği davranışın navlun tarafındaki
karşılığı: *"teklifi verdiğim andaki maliyeti de görmem lazım"* (H-05).

Ayrıca navlun **borsa/pazar yeri** katmanı mevcut: `freight-marketplace`,
`freight-exchange-connections` (626 satır), `freight-exchange-connectors`, OAuth, webhook,
pazarlık akışı, `freight-rate-benchmarks`, `/nakliyeci/rfq` ekranı — nakliyeciden fiyat
isteme (RFQ) ve gelen teklifleri karşılaştırma.

> ⚠️ **Kapsam düzeltmesi:** v0.2'de *"canlı taşıyıcı navlun fiyat borsası değil"*
> (OUT-05) yazılmıştı. Bu kod zaten var olduğu için **OUT-05 kaldırıldı** —
> bkz. [ANALİZ-03 §3](03-kapsam-taslagi.md).

### 3.6 Modül kayıt deseni zaten var
`transpalet-crm/admin_panel/src/navigation/permissions.ts` — `AdminNavKey` union +
`NAV_ROLES` (modül → rol) + `ROLE_HOME`. **"Hazır olmayan modül açılmaz"** kuralı
bu desenin üzerine bir `status` alanı eklenerek kurulur — bkz.
[Mimari İskelet](06-mimari-iskelet.md).

---

### 3.7 Paspas ERP — üretim kırılımının tamamı 🟢

**Önce dürüst tespit: Paspas'ta maliyet modülü yok.**
`grep -ri "maliyet\|cost" backend/src/modules/` → **sıfır sonuç**. Şemalardaki `birim_fiyat`
alanları ürün kartındaki satış/alış fiyatıdır; maliyet kırılımı, roll-up, işçilik veya
genel gider hesabı **yoktur**.

**Ama Paspas, maliyetin hesaplandığı ham veriyi eksiksiz tutuyor** — ki Ensotek için
bu daha değerli, çünkü Ensotek'in maliyet formülü kendine özgü (kg-bazlı CTP, adam-gün,
çarpan, pazarlık payı, EUR kuru) ve zaten sıfırdan yazılacak.

#### a) Operasyon rotası — ürün kartında
```sql
urun_operasyonlari (
  urun_id, sira, operasyon_adi, kalip_id,
  hazirlik_suresi_dk,      -- setup
  cevrim_suresi_sn,        -- birim üretim süresi
  montaj )
```
**Ensotek karşılığı:** kule modelinin atölye rotası — kaynak → polyester → montaj → test
→ paketleme. `cevrim_suresi_sn` yerine **adam-gün**, `kalip_id` yerine **atölye**.
Yapı birebir aynı; birim ve eksen değişiyor.

#### b) İş emri operasyonları — planlanan ↔ gerçekleşen
```sql
uretim_emri_operasyonlari (
  uretim_emri_id, urun_operasyon_id, sira, operasyon_adi,
  kalip_id, makine_id, hazirlik_suresi_dk, cevrim_suresi_sn,
  planlanan_miktar, uretilen_miktar, fire_miktar,
  planlanan_baslangic, planlanan_bitis,
  gercek_baslangic,    gercek_bitis,
  durum )
```
> **Bu tablo Ensotek'in gerçekleşen maliyet analizinin (IHT-312 / IHT-2008) temelidir.**
> Planlanan adam-gün ile gerçekleşen adam-gün farkı buradan çıkar. Hamdi Bey'in
> ürün ağacına girdiği "kaç adam-gün" tahmininin **tutup tutmadığı** ancak bu veriyle
> ölçülebilir. Paspas bunu hesaplamıyor ama **veriyi topluyor** — Ensotek'te üstüne
> maliyet katmanı yazılacak.

#### c) Hammadde rezervasyonu — BOM'dan iş emrine köprü
```sql
hammadde_rezervasyonlari ( uretim_emri_id, urun_id, miktar, durum )
```
İş emri açılınca BOM kalemleri stoktan **rezerve** ediliyor. Ensotek'in
*"montaj atölyesi motoru fanı stoktan çeker"* (H-10) akışının tam karşılığı.

#### d) Saha kaydı ve duruş
```sql
operator_gunluk_kayitlari ( uretim_emri_id, operator_user_id, gunluk_durum,
                            ek_uretim_miktari, makine_arizasi, durus_nedeni, notlar )
vardiyalar · durus_nedenleri · tatil_makineler · makine_kapali_araliklar
```
`vardiya_analizi/core.ts` (1.617 satır) bunları vardiya bazında analiz ediyor:
net / fire / ek üretim, makine, kalıp, çevrim, operatör, gündüz-gece vardiyası,
**TR sabit UTC+3** (ortam TZ'sine güvenmiyor).

#### e) İş yükü kuyruğu
`is_yukler` — makine bazlı kuyruk: `planlananSureDk`, `hazirlikSuresiDk`,
`planlananMiktar`, `uretilenMiktar`, `fireMiktar`, `terminTarihi`, `bosMakine`.
Ensotek'te **atölye bazlı kuyruk** olur; MOD-18'in çekirdeği.

#### f) Diğer devralınacaklar
`uretim_parti` (parti no ile toplu üretime aktarma) · `birimler` +
`urun_birim_donusumleri` (birim dönüşümü — Ensotek'in **kg / adet / m² / adam-gün**
karışık birim ihtiyacı için gerekli) · `kaliplar` + `kalip_uyumlu_makineler` ·
`kritik_stoklar` · `tanimlar` (1.380 satır ortak tanım altyapısı).

#### g) Teklif PDF — Türkçe şablon hazır
`modules/teklifler/` içinde `pdf.service.ts`, `pdfTemplate.ts`, `teklif-pdf.ts`,
`scheduler.ts` (2.029 satır toplam) + `teklif_sablonlari`, `teklif_public_token_lifecycle`,
`teklif_karar_gecmisi`, `teklif_iskonto_revizyon` tabloları.
TeklifRota'nın belge altyapısı daha güçlü ama **Türkçe PDF şablonu Paspas'ta hazır** —
ikisi birleştirilir.

#### ⚠️ Devralırken dikkat: ALTER zinciri
Paspas'ın 129 seed-SQL dosyasının önemli kısmı **korumalı `ALTER TABLE`** migrasyonu
(`121_v1_urunler_alter`, `205_uretim_parti`, `212_tahsis_miktar` …). Workspace kuralı
`ALTER TABLE` kullanımını yasaklıyor: şemalar Ensotek ERP'ye taşınırken
**tek bir `CREATE TABLE` tanımında birleştirilecek**, 129 migrasyon zinciri
taşınmayacak. Bu, göç sırasında yapılacak mekanik ama gerekli bir temizlik.

---

### 3.8 Üç kaynağın iş bölümü

| Alan | Kaynak | Neden |
|---|---|---|
| **Ticari zincir** — teklif, revizyon, snapshot, portal, proforma, navlun | **TeklifRota** | En olgun, testli, belgeli |
| **Üretim zinciri** — operasyon rotası, iş emri kırılımı, planlanan↔gerçekleşen, vardiya, duruş, kuyruk | **Paspas** | Gerçek fabrikada çalışmış, teslim edilmiş |
| **Genel ERP dokusu** — müşteri, stok, satın alma, tedarikçi, servis, personel, görev | **transpalet-crm** | En geniş modül seti, aynı dosya düzeni |

Üçü de aynı stack (Fastify + MySQL + seed-SQL + `controller/repository/router/schema/service/validation`),
bu yüzden birleştirme mimari değil **veri modeli** işi.

---

### 3.9 Tek gerçek uyarlama maliyeti — çok kiracılılık 🟡

TeklifRota **çok kiracılı (multi-tenant) SaaS**. 73 seed-SQL dosyasının **45'inde**
`tenant_key` var; ayrıca `tenants`, `tenant-settings`, `tenant-audit`, `entitlements`,
`billing`, `payments`, `partner-api`, `tenant-isolation.test.ts` gibi tamamı SaaS'a ait
modüller mevcut.

**Ensotek ERP tek kiracılıdır.** İki yol var:

| Yol | Ne demek | Değerlendirme |
|---|---|---|
| **(a) `tenant_key` korunur, tek sabit değere bağlanır** | Şema ve sorgular olduğu gibi alınır, `tenant_key='ensotek'` sabitlenir | ✅ **Önerilen.** Sıfır dönüştürme riski; testler çalışır durumda kalır; ileride Ensotek'in dört sitesi/şirketi ayrışırsa altyapı hazır |
| (b) `tenant_key` sökülür | Her tablodan ve her sorgudan temizlenir | ❌ Yüzlerce dokunuş, testler kırılır, kazanç yok |

**Alınmayacak SaaS modülleri:** `billing`, `payments`, `entitlements`, `tenants`,
`tenant-settings`, `auth-onboarding`, `partner-api`, `cloud-costs` — bunlar
abonelik/faturalandırma işidir, Ensotek'in iç ERP'sinde karşılığı yok.
`tenant-audit` ve `privacy` **alınır** (denetim izi + KVKK).

---

## 4. Kaba yeniden kullanım oranı

| Kategori | Modül | Pay |
|---|---|---|
| 🟢 Doğrudan alınır | MOD-00, 01, 05, 06, 09, **11**, **15**, 16, 19, 21 | **10 / 21** |
| 🟡 Alınır + genişletilir | MOD-02, 03, 07, 08, 12, 14, 17, 18, 20 | **9 / 21** |
| 🔴 Büyük ölçüde yeni | MOD-04 (BOM), MOD-10 (Kalite) | **2 / 21** |

TeklifRota eklendikten sonra **MOD-02 ve MOD-07** 🟡'nin üst ucuna çıktı, **MOD-15 Navlun**
fiilen 🟢'nin üst ucunda. Paspas incelendikten sonra **MOD-09 Üretim** ve **MOD-18 Fabrika**
da 🟢'ye oturdu: operasyon rotası, iş emri kırılımı, planlanan↔gerçekleşen, fire, vardiya,
duruş ve kuyruk yapıları hazır — makine/kalıp/çevrim ekseni atölye/adam-gün eksenine
çevrilecek.

> Eforun büyük kısmı hâlâ **MOD-04 (Ürün Ağacı + Maliyet motoru)** ve
> **entegrasyon/uyumlama** tarafında. "Modülü kopyaladık, bitti" değil: farklı
> projelerden gelen modüller tek veri modeline, tek yetki sistemine ve tek
> numaralandırmaya oturtulacak.

### Kaynak dağılımı

| Kaynak | Beslediği modüller |
|---|---|
| **TeklifRota** | MOD-02 Teklif · MOD-03 Maliyet (mekanizma) · MOD-07 Sipariş · MOD-11 Sevkiyat · **MOD-15 Navlun** |
| **paspas ERP** | **MOD-09 Üretim** · **MOD-18 Fabrika** (ikisinde de birincil) · MOD-02 Türkçe PDF şablonu · MOD-05 birim dönüşümü |
| **transpalet-crm** | MOD-01 · MOD-05 · MOD-06 · MOD-12 · MOD-17 · MOD-19 · MOD-21 |
| **ihracatradari** | **MOD-14 Firma Bulma** |
| **osgb-yazilim** | **MOD-16 Personel** |
| **e-fatura-service** | MOD-20 Muhasebe |
| **Ensotek shared-backend** | MOD-00 Altyapı |
| *(yeni yazılacak)* | **MOD-04 Ürün Ağacı** · **MOD-10 Kalite** |

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
