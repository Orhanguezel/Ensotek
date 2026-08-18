# Ensotek ERP — Modül Planı (SON SÜRÜM)

> **Belge türü:** Karar belgesi. Hangi modüller olacak, her biri ne kadar hazır,
> hangi kaynaktan alınacak, hangileri hiçbir yerde yok.
>
> **Durum:** Plan aşaması · Geliştirme başlamadı · **Fiyat en son aşama**
> **Tarih:** 2026-08-18 · **Sürüm:** 1.1

---

## 1. Devralma kuralı

| | Karar |
|---|---|
| ✅ **Backend modülleri** | Taşınır — `controller / repository / router / schema / service / validation` düzeni korunur |
| ✅ **Admin panel modülleri** | Taşınır — ekran klasörü + `_components` yapısı olduğu gibi gelir |
| ✅ **Testler** | Taşınır — kaynak projelerdeki test dosyaları bırakılmaz |
| ❌ **Seed / migrasyon dosyaları** | **Kopyalanmaz.** Kaynak şemalar *model olarak* okunur, Ensotek ERP için **tek ve temiz `CREATE TABLE` tanımı** yazılır |

**Neden seed dosyaları kopyalanmıyor:** Paspas'ın 129, TeklifRota'nın 73 seed-SQL'i büyük
ölçüde birikmiş `ALTER TABLE` zinciridir (`121_v1_urunler_alter`, `205_uretim_parti`,
`212_tahsis_miktar` …). Bunları taşımak, üç projenin tarihçesini de Ensotek'e taşımak olur.
Workspace kuralı zaten `ALTER TABLE` kullanımını yasaklıyor: şema tek dosyada, sıfırdan,
Ensotek'in ihtiyacına göre yazılacak.

> Yani: **kod devralınır, şema yeniden yazılır.** Devralınan kodun sorguları yeni şemaya
> göre uyarlanacak — bu, taşımanın asıl işçiliğidir.

---

## 2. Hazırlık ölçeği

| İşaret | Anlamı |
|---|---|
| 🟩 **Hazır** | Kod + ekran çalışır durumda, uyarlama küçük |
| 🟢 **Büyük ölçüde hazır** | Omurga var, Ensotek'e özgü kısım eklenecek |
| 🟡 **Yarısı hazır** | Kullanılabilir parçalar var, önemli bölüm yazılacak |
| 🟠 **İskelet var** | Yalnız veri modeli/desen alınabilir |
| 🔴 **Yok** | **Hiçbir kaynakta yok — sıfırdan yazılacak** |

---

## 3. Modül tablosu — özet

| Kod | Modül | Hazırlık | Ana kaynak | Faz |
|---|---|:---:|---|:---:|
| MOD-00 | Altyapı (auth, rol, audit, storage, mail, bildirim, ayarlar) | 🟩 | Ensotek shared-backend + transpalet | 0 |
| MOD-01 | Talep ve CRM | 🟢 | transpalet `talepler`,`crm`,`musteriler` | 1 |
| MOD-02 | Teklif | 🟢 | **TeklifRota** `commercial` + paspas PDF | 1 |
| MOD-03 | **Maliyet** | 🟠 | *(model var, hesap yok)* | 1 |
| MOD-04 | **Ürün Ağacı (BOM)** | 🟡 | paspas/transpalet `receteler` | 1 |
| MOD-05 | Ürün Kataloğu ve Stok | 🟩 | paspas `urunler`,`stoklar`,`hareketler` | 2 |
| MOD-06 | Satın Alma | 🟩 | transpalet/paspas `satin_alma`,`tedarikci` | 2 |
| MOD-07 | Sipariş / Üretime Teslim | 🟢 | TeklifRota `order-service` + paspas | 2 |
| MOD-08 | Mühendislik | 🟡 | storage + `gorevler` | 2 |
| MOD-09 | Üretim ve İş Emirleri | 🟩 | **paspas** `uretim_emirleri`,`operator` | 3 |
| MOD-10 | **Kalite** | 🔴 | **YOK** | 3 |
| MOD-11 | Sevkiyat | 🟩 | TeklifRota `packing-list` + transpalet `sevkiyat` | 3 |
| MOD-12 | Süpervizörlük ve Servis | 🟡 | transpalet `servis` + osgb `atama` | 4 |
| MOD-14 | Firma Bulma | 🟢 | **ihracatradari** `enrichment`,`scoring` | 5 |
| MOD-15 | Navlun ve Lojistik | 🟩 | **`@teklifrota/freight-engine`** | 3 → *1'e çekilebilir* |
| MOD-16 | Personel Yönetimi | 🟢 | **osgb-yazilim** `personel`,`calisan` | 4 |
| MOD-17 | Bakım Yönetimi (fabrika ekipmanı) | 🟡 | transpalet `makine_*` | 4 |
| MOD-18 | Fabrika Yönetimi | 🟩 | **paspas** `is_yukler`,`gantt`,`vardiya_analizi` | 4 |
| MOD-19 | Satış Yönetimi | 🟢 | transpalet `crm` pipeline + paspas CRM | 5 |
| MOD-20 | Muhasebe / Maliyet Muhasebesi | 🟡 | e-fatura-service + `logo_entegrasyon` | 5 |
| MOD-21 | Yönetim ve Raporlama | 🟩 | paspas/transpalet `dashboard`,`kpi` | 5 |
| **MOD-22** | **Fuar Yönetimi** | 🟡 | paspas `admin/fuar` + `fuar_teklif` servisi | 4 |
| **MOD-23** | **İhracat ve Gümrük** | 🟡 | ihracatradari `customs`,`export-profile` + TeklifRota | 3 |
| **MOD-24** | **MRP — Malzeme İhtiyaç Planlama** | 🟠 | paspas `hammadde_service` *(tek emir bazlı)* | 2 |

**Dağılım:** 🟩 8 · 🟢 6 · 🟡 7 · 🟠 2 · 🔴 1 — **24 modül**

> **v1.1 düzeltmesi (2026-08-18):** v1.0'da **Fuar**, **İhracat/Gümrük** ve **MRP**
> ayrı modül olarak listelenmemişti. Fuar hiç yoktu; ihracat ve MRP diğer modüllerin
> içine eritilmişti. Üçü de kendi başına iş yükü ve kendi ekranları olan alanlar —
> ayrıldı.

---

## 4. Modül kartları

### MOD-00 · Altyapı 🟩
**Kaynak:** `Ensotek/packages/shared-backend` (auth, storage, mail, notifications, userRoles, audit, siteSettings, theme, db_admin) + transpalet `admin_audit`, `tanimlar` (1.380 st), `mailAccounts`
**Admin:** `giris-ayarlari`, `sistem`, `audit-logs`, `tanimlar`, `_components/sidebar`, `admin-auth-gate`
**Eksik:** ENK/ENB dahil **numaralandırma üreteci** (yeni), **modül kayıt defteri** (`hidden/internal/ready`) — [ANALİZ-06](analiz/06-mimari-iskelet.md)

---

### MOD-01 · Talep ve CRM 🟢
**Kaynak:** transpalet `talepler`, `crm`, `musteriler`, `musteri_yetkilileri`, `iletisim`
**Admin:** `musteriler`, `crm/*`
**Eksik:** Talep kanalı (e-posta / telefon / WhatsApp) ve talep tipi (kule / yedek parça) alanları

---

### MOD-02 · Teklif 🟢
**Kaynak:** **TeklifRota** `commercial` — `state-machine` (11 durum), `quote-revision-policy`, `approval-engine`, `document-service`, `public-link-service`, `email-delivery`, `proforma-document`; **paspas** `teklifler` (2.029 st) — `pdf.service`, `pdfTemplate`, `teklif-pdf`, `scheduler`
**Model olarak alınacak tablolar:** `commercial_quotes`, `commercial_quote_revisions` (snapshot JSON), `commercial_quote_sequences`, `commercial_quote_events`, `quote_delivery_public_links`, `quote_portal_actions`, `teklif_sablonlari`, `teklif_karar_gecmisi`
**Admin:** TeklifRota `/ticari/teklifler`, `/ticari/teklif`, `/ticari/proforma`, `/teklif/[token]`; paspas `teklifler`, `teklif-talepleri`
**Eksik:**
- **Teknik / ticari / iç-maliyet 3 ayrı PDF** (kaynaklarda tek belge mantığı var)
- Standart dışı özelliklerin **kırmızı işaretlenmesi**
- Kule teklif şablonu (kapasite, debi, sıcaklıklar, kapsam kalemleri)

---

### MOD-03 · Maliyet 🟠 — **en kritik boşluk**
**Kaynak:** *Hiçbir kaynakta maliyet hesap modülü yok.* Alınabilecekler: TeklifRota `fixed-decimal` (ondalık güvenli aritmetik), `calculation-engine` (birim dönüşümü), revizyon snapshot deseni
**Eksik — sıfırdan yazılacak:** §6'da ayrıntılı

---

### MOD-04 · Ürün Ağacı (BOM) 🟡
**Kaynak:** paspas / transpalet `receteler` (587 st) + `recete_kalemleri`; paspas `urunler` (2.254 st)
**Admin:** paspas `uretim-emirleri/_components/recete-detay-modal.tsx`, `malzeme-yeterlilik-modal.tsx`, `urunler`
**Var olan model:**
```
urunler(kod, ad, kategori: urun|yarimamul|hammadde, tedarik_tipi, birim, birim_fiyat, stok)
receteler(kod, ad, urun_id → hangi ürünün reçetesi, hedef_miktar)
recete_kalemleri(recete_id, urun_id → kalem hangi ürün, miktar, fire_orani, aciklama, sira)
```
**Eksik:** özyinelemeli patlatma, döngü koruması, parametrik model türetme (~130 model), revizyon — §6'da ayrıntılı

---

### MOD-05 · Ürün Kataloğu ve Stok 🟩
**Kaynak:** paspas `urunler`, `stoklar` (486 st), `hareketler` (404 st), `mal_kabul` (617 st), `tanimlar`, `birimler` + `urun_birim_donusumleri`, `kritik_stoklar`; transpalet `categories`, `subCategories`
**Admin:** `urunler`, `stoklar`, `hareketler`, `mal-kabul`, `tanimlar`
**Eksik:** **Stok kodu şeması** (Ensotek'te hiç yok — birlikte kurulacak), ürün tipine `hizmet` eklenmesi

---

### MOD-06 · Satın Alma 🟩
**Kaynak:** paspas `satin_alma` (829 st) + `satin_alma_kalemleri` (termin tarihli), `tedarikci`
**Admin:** `satin-alma`, `tedarikci`
**Eksik:** Alış fiyatının **maliyet kartını beslemesi** (fiyat geçmişi tablosu yeni)

---

### MOD-07 · Sipariş / Üretime Teslim 🟢
**Kaynak:** TeklifRota `order-service` (552 st) + `orders_shipments`, `inventory_fulfillment`; paspas `satis_siparisleri`, `uretim_emri_siparis_kalemleri`, `tahsis_miktar`; transpalet `ihtiyac_formlari`
**Admin:** `/ticari/siparisler`, paspas `satis-siparisleri`
**Eksik:**
- **ENK / ENB iş numarası** (Ensotek'e özgü, Excel sırasından devralınacak)
- **Avans kontrolü bloğu** — avans gelmeden "üretime başlat" açılmaz
- **Teklif İnceleme Formu**'nun dijitali (Word'ün yerine)

---

### MOD-08 · Mühendislik 🟡
**Kaynak:** `storage` (dosya), transpalet `gorevler`, paspas `proje-teklifi` notları
**Eksik:**
- **AutoCAD/DWG dosyasının projeye bağlanması** ve sürümlenmesi
- **Müşteriye sorulan teknik soru–cevap kaydı** (Hamdi Bey'in "su çıkışı pompaya mı" örneği)
- **Malzeme listesi üretimi** — BOM'dan iş emrine (D-4 darboğazı)
- **Mevcut seçim yazılımı entegrasyonu** → [S-01](analiz/04-acik-sorular.md)

---

### MOD-09 · Üretim ve İş Emirleri 🟩
**Kaynak:** **paspas** `uretim_emirleri` (2.675 st), `operator` (3.853 st), `is_yukler`, `vardiya_analizi` (1.617 st), `gantt` (743 st), `hammadde_service`
**Model olarak alınacak tablolar:** `urun_operasyonlari`, `uretim_emri_operasyonlari`, `hammadde_rezervasyonlari`, `operator_gunluk_kayitlari`, `vardiyalar`, `durus_nedenleri`, `uretim_parti`
**Admin:** `uretim-emirleri` (+`_components`: makine-montaj-planlama, malzeme-yeterlilik-modal, makine-ata-sheet), `operator`, `is-yukler`, `gantt`, `vardiya-analizi`
**Eksik:** **Eksen çevirisi** — makine/kalıp/çevrim-saniyesi ekseni, Ensotek'in **atölye/adam-gün** eksenine çevrilecek (kaynak · polyester · montaj · metal · test · paketleme)

---

### MOD-10 · Kalite 🔴 — **hiçbir kaynakta yok**
Hiçbir projede test/kalite modülü bulunmuyor. Sıfırdan yazılacak:
- Serpantin **basınç testi** kaydı (hava basılır, kaçak kontrolü)
- **Galvaniz** sevk / dönüş takibi
- Galvaniz dönüşü **tekrar test**
- Test formu, ölçüm değerleri, fotoğraf, personel, tarih
- Test raporu PDF, CE evrakı

*Küçük bir modül ama tamamen yeni.*

---

### MOD-11 · Sevkiyat 🟩
**Kaynak:** TeklifRota `packing-list`, `packing-document`, `packaging-preset-repository`; transpalet/paspas `sevkiyat` (944 st), `sevk_emirleri`
**Admin:** `/ticari/sevkiyatlar`, paspas `sevkiyat`
**Eksik:** TIR / konteyner / kamyon ayrımı, **demonte kule paketleme** (paletleme, streçleme, çuvallama), sevkiyat öncesi tahsilat kontrolü

---

### MOD-12 · Süpervizörlük ve Servis 🟡
**Kaynak:** transpalet `servis`, osgb `atama`, `gorev`, `personel`
**Eksik:** Süpervizör **seyahat / otel / harcırah** planı, saha raporu + fotoğraf + müşteri imzası, **garanti takibi ve hatırlatma**, ürün bazlı servis geçmişi (uzun vadeli)

---

### MOD-14 · Firma Bulma 🟢
**Kaynak:** **ihracatradari** `enrichment`, `decision-makers`, `scans`, `scoring`, `crm`, `customs`; Google-Maps-Scrapper
**Admin:** ihracatradari tarama/skor ekranları; TeklifRota `/crm/potansiyel`
**Eksik:** Ensotek sektörüne uyarlama (soğutma kulesi kullanan tesisler: enerji, kimya, gıda, çimento, AVM), hedef kitle ve coğrafya tanımı → [S-08](analiz/04-acik-sorular.md)

---

### MOD-15 · Navlun ve Lojistik 🟩 — **beklenenden hazır**
**Kaynak:** **`@teklifrota/freight-engine`** — bağımsız paket, 5.515 satır, testli:
`engine.ts` (kara/deniz/hava, deterministik), `road-distances.ts` (2.161 st),
`toll-shares.ts` (682 st), `parameters.ts` (dizel, EUA karbon, otoyol tarifesi, IATA 166,67,
emisyon), `record.ts` (girdi-kanıt + drift tespiti), `place-resolver`
Artı `commercial` navlun katmanı: `freight-marketplace`, `freight-exchange-*` (OAuth, webhook,
pazarlık), `freight-rate-benchmarks`, `multimodal_plans`
**Admin:** `/navlun-hesaplama`, `/navlun-parametreleri`, `/lojistik`, `/nakliyeci/rfq`, `/settings/navlun-kaynaklari`
**Eksik:** Kule dış ölçülerinin ürün kartına girmesi, **TIR/konteyner sığdırma**, demonte sevk senaryosu, navlunun **teklif kalemi + dolaylı gider** olarak bağlanması

---

### MOD-16 · Personel Yönetimi 🟢
**Kaynak:** **osgb-yazilim** `personel`, `calisan`, `evrak`, `atama`, `kpi`, `saglik`; transpalet `personel`; paspas `vardiyalar`, `users_erp_personel`
**Admin:** transpalet `personel`, osgb personel ekranları
**Eksik:** Atölye/vardiya bağlama, **adam-gün maliyetinin gerçek personel verisine bağlanması**
**Kapsam dışı:** maaş bordrosu hesaplama (OUT-02)

---

### MOD-17 · Bakım Yönetimi (fabrika ekipmanı) 🟡
**Kaynak:** transpalet `makine_havuzu` (1.192 st), `makine_verileri`, `makine_kapali_araliklar`; paspas `tatil_makineler`
**Admin:** `makine-havuzu`, `makineler`
**Eksik:** **Periyodik bakım planı ve hatırlatma**, arıza kaydı → duruş bağı, bakım maliyetinin dolaylı gidere yansıması

---

### MOD-18 · Fabrika Yönetimi 🟩
**Kaynak:** **paspas** `is_yukler` (598 st — makine kuyruğu, boş makine, planlanan süre, termin), `gantt`, `vardiya_analizi`, `durus_nedenleri`, `makine_kapali_araliklar`
**Admin:** `is-yukler`, `gantt`, `vardiya-analizi`, `dashboard`, `vardiya-ozet-widget`
**Eksik:** Makine kuyruğu → **atölye kuyruğu**, kapasite **adam-gün** cinsinden, atölye bazlı planlanan↔gerçekleşen sapma raporu

---

### MOD-19 · Satış Yönetimi 🟢
**Kaynak:** transpalet `crm`; paspas CRM şemaları (`crm_pipeline`, `crm_lead_deal`, `crm_deal_products`, `crm_activities`, `crm_reminders`, `crm_communications`, `crm_loss_reasons`, `crm_automation`, `crm_saved_views`); gzl-gelir-crm
**Admin:** `crm/*` (pipeline, fırsatlar, aktiviteler, raporlar)
**Eksik:** Kule sektörüne uygun aşama tanımları, satış hedefi
**Kapsam dışı:** prim / komisyon (OUT-01 — Hamdi Bey açıkça hariç tuttu)

---

### MOD-20 · Muhasebe / Maliyet Muhasebesi 🟡
**Kaynak:** **e-fatura-service** (ayrı servis: fatura şemaları, kuyruk, worker, admin); transpalet `logo_entegrasyon`; TeklifRota `billing` deseni *(alınmayacak, yalnız desen)*
**Eksik:** **Cari hesap**, **ödeme planı ve vade**, avans kaydı, tahsilat, fatura + irsaliye, kur farkı, **proje bazlı gerçekleşen maliyet** (→ §6)
**Kapsam dışı:** yasal defter, beyanname, mali müşavirlik (OUT-03)

---

### MOD-21 · Yönetim ve Raporlama 🟩
**Kaynak:** paspas `dashboard`, `vardiya-ozet-widget`, `test_center`, `page_feedback`; transpalet `dashboard`, `llm`; osgb `kpi`
**Admin:** `dashboard`, `raporlar`
**Eksik:** Ensotek KPI tanımları, aylık satış/kârlılık grafikleri

---

### MOD-22 · Fuar Yönetimi 🟡
**Kaynak:** paspas `admin_panel/.../admin/fuar/` — 4 ekran (müşteriler, katalog, teklifler, ürünler) + `_components`; `paspas/fuar_teklif/` bağımsız servis (448 st, kendi migrasyonları): takım/koli/palet dönüşümü, MOQ, CBM, net-brüt ağırlık, indirim, EXW/FOB/CIF toplamı; TeklifRota bu servisin büyümüş hali
**Var olan:** Fuarda hızlı teklif hesabı ve fuar kataloğu ekranları
**Eksik — sıfırdan:**
- **Fuar takvimi** — katılınacak fuarlar, tarih, ülke, stand bilgisi, bütçe
- **Fuar bazlı lead toplama** — standda görüşülen firma kaydı (mobil/tablet)
- **Fuar sonrası takip** — leadler CRM'e düşer, kim ne zaman arayacak
- **Fuar maliyeti ve dönüşü** — stand + seyahat gideri ↔ fuardan gelen sipariş
- Fuar ↔ MOD-14 Firma Bulma ve MOD-19 Satış bağı

---

### MOD-23 · İhracat ve Gümrük 🟡
**Kaynak:** ihracatradari `customs` (284 st — **HS/GTİP kodu arama**, ticaret verisi sorgulama), `export-profile` (113 st); TeklifRota `commercial` — incoterm (EXW/FOB/CIF), `proforma-document`, `packing-list`
**Var olan:** GTİP kodu arama, incoterm, proforma, packing list
**Eksik — sıfırdan:**
- **Ürün kartına GTİP/HS kodu** ve menşe bilgisi
- **İhracat evrak seti** — menşe şahadetnamesi, **ATR / EUR.1**, fatura, çeki listesi, konşimento
- **Akreditif / ödeme şekli** takibi (peşin, mal mukabili, vesaik mukabili, akreditif)
- **Gümrük beyanname** referansı ve dosya bağı
- **İhracat dosyası** — proje altında evrak seti ve durum takibi
- Ülke bazlı gereklilik kuralları (CE, sertifika, dil)

> **Neden ayrı modül:** Ensotek yurt dışına satıyor. İhracat evrakı teklif ve sevkiyattan
> ayrı bir zincir — eksik evrak malı gümrükte bekletir. Navlun (MOD-15) taşımayı,
> bu modül **belgeyi** yönetir.

---

### MOD-24 · MRP — Malzeme İhtiyaç Planlama 🟠 — **D-4 darboğazının asıl cevabı**
**Kaynak:** paspas `uretim_emirleri/hammadde_service.ts` + `GET /:id/hammadde-yeterlilik` +
admin `malzeme-yeterlilik-modal.tsx`; `hammadde_rezervasyonlari`
**Var olan:** **Tek iş emri için** stok yeterlilik kontrolü ve rezervasyon
**Eksik — sıfırdan:**
- **Çok iş emri üzerinden net ihtiyaç hesabı** — BOM patlatması × açık iş emirleri − stok − rezerve + emniyet stoğu
- **Zaman fazlı ihtiyaç** — hangi malzeme hangi hafta lazım
- **Tedarik süresi (lead time)** — malzeme kartında; ne zaman sipariş verilmeli
- **Otomatik satın alma önerisi** — MOD-06'ya düşen sipariş taslağı
- **Malzeme listesi çıktısı** — Hamdi Bey'in *"uzun zaman alıyor"* dediği iş
- Kapasite ihtiyacı (atölye adam-gün) — MOD-18 ile ortak

> **Bu modül, imalat tarafındaki en büyük zaman kaybının (D-4) doğrudan karşılığı.**
> Mevcut kod tek emir bakıyor; Ensotek'in ihtiyacı tüm açık işlere birden bakmak.

---

## 5. Hiçbir kaynakta olmayanlar — net liste

Bu maddeler **devralınamaz, sıfırdan yazılacaktır**:

| # | Konu | Modül | Büyüklük |
|---|---|---|---|
| **Y-1** | **Maliyet hesap katmanı** — patlatma, roll-up, katmanlar, snapshot, fiyatlandırma zinciri | MOD-03 | **Büyük** |
| **Y-2** | **Özyinelemeli BOM patlatma + döngü koruması** | MOD-04 | Orta |
| **Y-3** | **Parametrik model türetme** (~130 kule modeli tek tabandan) | MOD-04 | Orta–Büyük *(→ [S-02](analiz/04-acik-sorular.md))* |
| **Y-4** | **Kalite / test modülü** — basınç testi, galvaniz, tekrar test | MOD-10 | Küçük–Orta |
| **Y-5** | **ENK / ENB numaralandırma** ve Excel sayacından devralma | MOD-00/07 | Küçük |
| **Y-6** | **Avans kontrolü bloğu** — avans gelmeden üretime teslim edilemez | MOD-07 | Küçük |
| **Y-7** | **Teklif İnceleme Formu** dijitali | MOD-07 | Küçük |
| **Y-8** | **Teknik / ticari / iç-maliyet 3 ayrı PDF** şablonu | MOD-02 | Orta |
| **Y-9** | **Standart dışı özelliklerin kırmızı işaretlenmesi** | MOD-02 | Küçük |
| **Y-10** | **Müşteri teknik soru–cevap kaydı** | MOD-08 | Küçük |
| **Y-11** | **Seçim yazılımı entegrasyonu** | MOD-08 | *(S-01'e bağlı)* |
| **Y-12** | **Atölye eksenine çeviri** — makine/kalıp/çevrim → atölye/adam-gün | MOD-09/18 | Orta |
| **Y-13** | **Stok kodu şeması** — Ensotek'te hiç yok | MOD-05 | Orta *(veri işi)* |
| **Y-14** | **Modül kayıt defteri** — `hidden/internal/ready` | MOD-00 | Küçük |
| **Y-15** | **Excel veri göçü araçları ve doğrulaması** | Tümü | **Büyük** *(→ [ANALİZ-07](analiz/07-excel-veri-gocu.md))* |
| **Y-16** | **MRP motoru** — çok emirli net ihtiyaç, zaman fazlı, tedarik süresi, sipariş önerisi | MOD-24 | **Orta–Büyük** |
| **Y-17** | **İhracat evrak seti** — menşe, ATR/EUR.1, akreditif, gümrük beyanname bağı | MOD-23 | Orta |
| **Y-18** | **Fuar yönetimi** — takvim, standda lead toplama, fuar sonrası takip, fuar ROI | MOD-22 | Orta |

> Eforun ağırlık merkezi net: **Y-1 (maliyet), Y-3 (parametrik BOM), Y-15 (veri göçü).**
> İkinci halka: **Y-16 (MRP), Y-8 (3 PDF), Y-12 (atölye eksenine çeviri), Y-17 (ihracat evrakı).**

---

## 6. Maliyet muhasebesi — model var, hesap yok

> **Tespit doğru:** alt hammadde kırılımı ve reçete yapısı mevcut. Kalemlere fiyat
> yazıldığında tam maliyet muhasebesi kurulabilir. Aşağıda bunun tam olarak neyi
> gerektirdiği var.

### 6.1 Mevcut model — devralınacak

```
urunler
  kod · ad · kategori(urun | yarimamul | hammadde) · tedarik_tipi(uretim | satinalma)
  birim (varsayılan 'kg') · birim_fiyat · stok · kritik_stok · rezerve_stok

receteler
  kod · ad · urun_id ────────────► bu reçete HANGİ ürünün · hedef_miktar

recete_kalemleri
  recete_id · urun_id ───────────► kalem HANGİ ürün · miktar · fire_orani · aciklama · sira
```

**Kilit nokta:** `recete_kalemleri.urun_id` bir **ürüne** işaret eder ve o ürünün de
kendi reçetesi olabilir (`receteler.urun_id`). Yani **çok seviyeli ağaç yapısal olarak
zaten kurulu** — eksik olan yalnızca onu çözen koddur.

### 6.2 Ensotek'in Excel'i bu modele nasıl oturuyor

| Ensotek'te bugün | ERP karşılığı |
|---|---|
| CTP-5 modeli | `urunler`: kategori=`urun` + kendi `receteler` kaydı |
| **CTP maliyeti — 270 kg** satırı | `recete_kalemleri`: urun_id=**CTP Gövde**, miktar=270 |
| CTP Gövde'nin kg maliyeti (10 €/kg) | `urunler`: CTP Gövde, kategori=`yarimamul`, birim=`kg`, birim_fiyat=10 |
| CTP Gövde'nin reçetesi (reçine, cam elyaf, jelkot, işçilik) | CTP Gövde'nin kendi `receteler` kaydı |
| Serpantin maliyeti (model × kat sayısı) | Her varyant ayrı `urunler` + kendi reçetesi |
| Motor / fan / redüktör | `urunler`: tedarik_tipi=`satinalma` |
| **Adam-gün, harcırah, SGK, yemek** | `urunler`: kategori=**`hizmet`** *(yeni)*, birim=`adam-gün`, birim_fiyat=X → reçetede normal kalem |
| Birim fiyat Excel'i | `urunler.birim_fiyat` (+ fiyat geçmişi tablosu) |
| Fire payı | `recete_kalemleri.fire_orani` — **zaten var** |

> Ensotek'in Excel'i zaten bu yapıda çalışıyor: ürün ağacı satırları + yandaki adet +
> birim fiyat Excel'inden okunan fiyat. Model uyuyor; **eksik olan otomatik toplama.**

### 6.3 Yazılacaklar — maliyet katmanı

**A. Patlatma ve toplama (Y-1, Y-2)**
1. **Özyinelemeli patlatma** — bir BOM kalemi başka bir BOM'a işaret ediyorsa iner
2. **Döngü koruması** — A→B→A zinciri hata verir, sonsuz döngüye girmez
3. **Maliyet roll-up** — alt ağaçların maliyeti üste toplanır
4. **Fire uygulaması** — `fire_orani` miktara uygulanır
5. **Birim dönüşümü** — kg / adet / m² / metre / adam-gün (`urun_birim_donusumleri` var)
6. **Derinlik sınırı ve performans** — 130 model × çok seviyeli ağaç

**B. Fiyat altyapısı**
7. **Para birimi ve kur** — `birim_fiyat` tek para birimi; EUR / TL / USD ve kur gerekiyor
8. **Fiyat geçmişi** — `birim_fiyat` tek değer, tarihli değil; "hangi tarihte kaça"
9. **Fiyat kaynağı seçimi** — son alış / ortalama / manuel (satın almadan beslenir)

**C. Teklif fiyatlandırma zinciri**
10. `Toplam maliyet → çarpan → pazarlık payı (%3–5) → Euro kuru → teklif fiyatı`
11. **Maliyet katmanları** — malzeme / işçilik / dolaylı gider ayrı gösterilir
12. **Fiyat simülasyonu** — farklı kâr oranı senaryoları

**D. Snapshot — Hamdi Bey'in en çok üstünde durduğu istek**
13. **Teklif anı maliyet dondurma** — teklif gönderildiği andaki tüm birim fiyatlar +
    miktarlar + toplamlar donar, sonradan değişmez
14. **Üç sütun karşılaştırma** — teklif anı ↔ güncel ↔ gerçekleşen
15. **İç maliyet PDF'i** — değiştirilemez arşiv belgesi

> TeklifRota'nın `commercial_quote_revisions.totals_snapshot` deseni buraya taban olur,
> ama o **yalnız fiyat toplamlarını** donduruyor. Ensotek'e **maliyet kalem kırılımı**
> lazım — mekanizma devralınır, içerik yazılır.

**E. Gerçekleşen maliyet — Paspas verisinden**
16. `uretim_emri_operasyonlari.gercek_baslangic/bitis` → **gerçekleşen adam-gün**
17. `planlanan ↔ gerçekleşen` sapma → ürün ağacındaki adam-gün tahmini tuttu mu
18. `fire_miktar` → **fire maliyeti**
19. `durus_kayitlari` → duruşun dolaylı gidere yansıması
20. `hammadde_rezervasyonlari` + `hareketler` → **gerçek tüketilen malzeme**
21. **Proje kârlılığı** — teklif fiyatı − gerçekleşen maliyet

**F. Kontrol**
22. **Maliyet onay sistemi** — toplu fiyat değişikliğinde etkilenen ürün sayısı gösterilir,
    yönetici onaylar (CTP kg maliyeti yanlışlıkla 10 € yerine 100 € girilirse tüm
    teklifler bozulmasın)

### 6.4 Sonuç

| | |
|---|---|
| **Veri modeli** | ✅ Devralınıyor — `urunler` + `receteler` + `recete_kalemleri` |
| **Üretim gerçekleşme verisi** | ✅ Devralınıyor — paspas iş emri operasyon kırılımı |
| **Hesap katmanı (22 madde)** | 🔴 **Sıfırdan yazılacak** |

**Tam maliyet muhasebesi kurulabilir** — kalemlere fiyat yazıldığında model işler.
Ama işin adı "fiyat sütunu eklemek" değil, **maliyet motoru yazmak**: patlatma, roll-up,
kur, fiyat geçmişi, snapshot, gerçekleşen maliyet ve onay mekanizması.

Bu, projenin **en büyük tek geliştirme kalemi** ve aynı zamanda Ensotek'in ERP'den
beklediği asıl değerin bulunduğu yer — çünkü darboğazların üçü (D-1 teklif, D-2 maliyet
analizi, D-3 gönderme) burada birleşiyor.

---

## 7. Faz planı

| Faz | Modüller | Ana iş |
|---|---|---|
| **0** | MOD-00 | İskelet, numaralandırma, modül kayıt defteri, deploy hattı |
| **1** ⭐ | MOD-01, 02, 03, 04 | **Maliyet motoru + BOM** — projenin kalbi. Excel göçü paralel yürür |
| **2** | MOD-05, 06, 07, 08, **24** | Stok kodu, **MRP + malzeme listesi**, ENK/ENB, avans kontrolü |
| **3** | MOD-09, 10, 11, 15, **23** | Üretim (paspas hazır), Kalite (yeni), Sevkiyat, Navlun, **İhracat/Gümrük** |
| **4** | MOD-12, 16, 17, 18, **22** | Personel, bakım, fabrika kapasitesi, servis, **Fuar** |
| **5** | MOD-14, 19, 20, 21 | Firma bulma, satış, muhasebe, raporlama |

> **Kural:** Hazır olmayan modül **"yakında" denip gösterilmez** — menüde yok, route 404,
> API rotası kayıt edilmez. [ANALİZ-06 §1](analiz/06-mimari-iskelet.md)
>
> **Kural:** Bir modül açıldığında yerini aldığı **Excel aynı gün kapanır**. Paralel
> çalışma yok. [ANALİZ-07 §6](analiz/07-excel-veri-gocu.md)

---

## 8. Kaynak projelerin iş bölümü

| Kaynak | Ne veriyor | Büyüklük |
|---|---|---|
| **fuar-teklif / TeklifRota** | Ticari zincir: teklif yaşam döngüsü, revizyon+snapshot, portal, proforma, packing list, **navlun motoru** | 21.274 st backend + 5.515 st freight-engine |
| **paspas / Paspas ERP** | Üretim zinciri: operasyon rotası, iş emri kırılımı, planlanan↔gerçekleşen, fire, vardiya, duruş, kuyruk, **reçete modeli** | 41.930 st, 41 modül, 74 test |
| **transpalet-crm** | Genel ERP dokusu: müşteri, stok, satın alma, tedarikçi, servis, personel, görev, CRM | 48 modül |
| **ihracatradari.com.tr** | Firma bulma: enrichment, decision-makers, scans, scoring | — |
| **osgb-yazilim** | Personel, çalışan, evrak, atama, KPI | — |
| **e-fatura-service** | e-Fatura entegrasyonu | Ayrı servis |
| **Ensotek shared-backend** | auth, storage, mail, bildirim, rol, audit, ayarlar | 44 modül |

Hepsi aynı stack: **Fastify + TypeScript + MySQL**, aynı modül dosya düzeni
(`controller / repository / router / schema / service / validation`), Next.js admin panel
aynı ekran+`_components` yapısı. Bu yüzden birleştirme **mimari değil, veri modeli işi**.

---

## 9. Teknoloji

| Katman | Seçim |
|---|---|
| Backend | Fastify + TypeScript + Bun |
| ORM / DB | Drizzle ORM + MySQL — **tek, temiz `CREATE TABLE` seti**, `ALTER TABLE` yok |
| Admin | Next.js 16 + React 19 + TypeScript |
| UI | Tailwind CSS v4 + Shadcn/Radix |
| Auth | JWT — `requireEnv`, **fallback secret yasak** |
| Deploy | Docker + Nginx + PM2, VPS |
| Mobil | PWA (saha: iş emri, kalite, sevkiyat, servis) |

---

## 10. Sonraki adımlar

1. **Ensotek'ten Excel dosyalarını al** — 3 örnek ürün ağacı (küçük/orta/büyük), birim fiyat, CTP maliyet, serpantin, pano, Word teklif şablonu, Teklif İnceleme Formu
2. Dosyalara bakarak **S-02** (parametrik BOM mümkün mü) ve **S-03** (stok kodu şeması) cevaplanır
3. **S-01** — mevcut seçim yazılımına erişim durumu
4. **MOD-04 + MOD-03 veri modeli tasarımı** — tek `CREATE TABLE` seti
5. Modül bazlı efor tahmini
6. *(en son)* Fiyat

---

**İlgili belgeler:**
[Mevcut Durum](analiz/01-mevcut-durum-as-is.md) ·
[İhtiyaç Listesi](analiz/02-ihtiyac-listesi.md) ·
[Kapsam](analiz/03-kapsam-taslagi.md) ·
[Açık Sorular](analiz/04-acik-sorular.md) ·
[Yeniden Kullanım](analiz/05-modul-envanteri-yeniden-kullanim.md) ·
[Mimari İskelet](analiz/06-mimari-iskelet.md) ·
[Veri Göçü](analiz/07-excel-veri-gocu.md) ·
[Kaynak: Hamdi Bey'in anlatımı](kaynak/02-hamdi-anlatimi-ham-kayit.md)
