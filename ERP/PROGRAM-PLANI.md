# Ensotek ERP — Program Planı (İÇ BELGE)

> ⚠️ **İç belge.** Efor tahminleri, riskler ve kaynak proje isimleri müşteriye gitmez.
>
> **Tarih:** 2026-08-18 · **Sürüm:** 2.1 · **Durum:** Plan — geliştirme başlamadı
>
> **v2.1:** Kiracı yapısı tespit edildi (§0) — çok kiracılılık gerçek gereksinim.
>
> **v1.0 → v2.0:** v1.0 yalnız MVP'yi anlatıyordu ve **Fuar, İhracat/Gümrük ve MRP**
> modül olarak yoktu. Bu sürüm **tüm programı** gösterir: 24 modül, hepsinin hazırlık
> durumu, eforu ve sırası. İlk sürüm artık kapsamın tamamı değil, **sıralamanın ilk adımı**.

---

## 0. Kiracı yapısı — 2026-08-18 tespiti

Ensotek'in dört reposu incelendi. **Çok kiracılılık gerçek bir gereksinim:**

| Kiracı | Siteler | Ürünler |
|---|---|---|
| **ensotek** | ensotek.de · ensotek.com.tr · kuhlturm.com | Soğutma kulesi: CC-CTP, CTP, DCTP, TCTP + 9 yedek parça |
| **kompozit** | karbonkompozit.com.tr | Lunapark / tema parkı kompozit ürünleri — kızak araç setleri, ride kabini, park dekoru |

**Ortak (fabrika tek):** personel · atölyeler · makineler · bakım · vardiya · tedarikçiler ·
kullanıcı ve roller · birim/kur tanımları
**Kiracıya özel:** ürünler · ürün ağaçları · maliyet · müşteriler · teklifler · iş
numaraları · iş emirleri · sevkiyat · satış · cari

**Efor etkisi küçük ve mekanik.** TeklifRota zaten çok kiracılı ve izolasyon testli —
kısıtlamaya gerek kalmadı, kazanç. paspas/transpalet/osgb modüllerine `tenant_key` ve
sorgu kapsamı eklenecek: **+8 – 14 adam-gün**, ağırlıklı olarak Faz 0 ve S1'de.

> **Kritik tasarım kararı:** iş emri kiracıya özeldir ama **atölye kuyruğu ve kapasite
> kiracılar arası birleşiktir**. Polyester atölyesi aynı hafta hem CTP gövde hem lunapark
> kabini üretiyorsa, plan ikisini birden görmek zorunda. → [ANALİZ-06 §3.5](analiz/06-mimari-iskelet.md)

---

## 1. Kapsam — tamamı

**Ensotek ERP, bir soğutma kulesi fabrikasının tüm süreçlerini yönetir:**

```
Firma bulma · Fuar ────► Talep ────► Teklif ────► Maliyet ────► Sipariş
                                        │                          │
                                        └── Ürün ağacı (BOM)       ├── Avans
                                                  │                │
                                                  ▼                ▼
                                                 MRP ────► Satın alma
                                                  │            │
                                                  ▼            ▼
                                          Mühendislik ──► Üretim ──► Kalite
                                                                       │
                                          Personel · Fabrika · Bakım   ▼
                                                              Sevkiyat · Navlun · İhracat
                                                                       │
                                                                       ▼
                                                    Muhasebe ──► Servis ──► Garanti
```

Hiçbir halka kapsam dışı değil. Aşağıdaki tablo **hepsini** gösterir.

---

## 2. 24 modül — hazırlık, kaynak, efor

**Hazırlık:** 🟩 hazır · 🟢 büyük ölçüde hazır · 🟡 yarısı hazır · 🟠 iskelet/desen · 🔴 hiçbir yerde yok

| Kod | Modül | Hazırlık | Kaynak | Efor (a-g) | Sürüm |
|---|---|:---:|---|---:|:---:|
| MOD-00 | Altyapı, yetki, audit, dosya, mail, numaralandırma | 🟩 | Ensotek shared-backend + transpalet | 35 – 55 | **S1** |
| MOD-01 | Talep ve CRM | 🟢 | transpalet `talepler`,`crm` | 5 – 8 | **S1** |
| MOD-02 | Teklif | 🟢 | TeklifRota `commercial` + paspas PDF | 30 – 48 | **S1** |
| MOD-03 | **Maliyet** | 🟠 | *(model var, hesap yok)* | **35 – 56** | **S1** |
| MOD-04 | **Ürün Ağacı (BOM)** | 🟡 | paspas/transpalet `receteler` | **35 – 60** | **S1** |
| MOD-05 | Ürün Kataloğu ve Stok | 🟩 | paspas `urunler`,`stoklar`,`hareketler` | 12 – 20 | S2 |
| MOD-24 | **MRP — Malzeme İhtiyaç Planlama** | 🟠 | paspas `hammadde_service` *(tek emir)* | **15 – 25** | S2 |
| MOD-06 | Satın Alma | 🟩 | transpalet/paspas `satin_alma`,`tedarikci` | 10 – 16 | S2 |
| MOD-07 | Sipariş / Üretime Teslim | 🟢 | TeklifRota `order-service` + paspas | 12 – 20 | S2 |
| MOD-08 | Mühendislik | 🟡 | storage + `gorevler` | 12 – 20 | S2 |
| MOD-09 | Üretim ve İş Emirleri | 🟩 | **paspas** `uretim_emirleri`,`operator` | 18 – 30 | S3 |
| MOD-10 | **Kalite** | 🔴 | **hiçbir yerde yok** | 10 – 16 | S3 |
| MOD-11 | Sevkiyat | 🟩 | TeklifRota `packing-list` + transpalet | 10 – 16 | S3 |
| MOD-15 | Navlun ve Lojistik | 🟩 | **`@teklifrota/freight-engine`** | 8 – 14 | S3 |
| MOD-23 | **İhracat ve Gümrük** | 🟡 | ihracatradari `customs`,`export-profile` | **14 – 24** | S3 |
| MOD-16 | Personel Yönetimi | 🟢 | **osgb-yazilim** `personel`,`calisan` | 12 – 20 | S4 |
| MOD-18 | Fabrika Yönetimi | 🟩 | **paspas** `is_yukler`,`gantt`,`vardiya_analizi` | 10 – 18 | S4 |
| MOD-17 | Bakım Yönetimi (fabrika ekipmanı) | 🟡 | transpalet `makine_*` | 8 – 14 | S4 |
| MOD-12 | Süpervizörlük ve Servis | 🟡 | transpalet `servis` + osgb `atama` | 14 – 22 | S4 |
| MOD-22 | **Fuar Yönetimi** | 🟡 | paspas `admin/fuar` + `fuar_teklif` | **10 – 18** | S4 |
| MOD-20 | Muhasebe / Maliyet Muhasebesi | 🟡 | e-fatura-service + `logo_entegrasyon` | 20 – 34 | S5 |
| MOD-14 | Firma Bulma | 🟢 | **ihracatradari** `enrichment`,`scoring` | 12 – 20 | S5 |
| MOD-19 | Satış Yönetimi | 🟢 | transpalet `crm` + paspas CRM şemaları | 10 – 16 | S5 |
| MOD-21 | Yönetim ve Raporlama | 🟩 | paspas/transpalet `dashboard`,`kpi` | 10 – 18 | S5 |

**Ek — modüle bağlı olmayan iş kalemleri**

| İş | Hazırlık | Efor (a-g) | Sürüm |
|---|:---:|---:|:---:|
| **Veri göçü** — araçlar + normalizasyon + 130 model + doğrulama | 🔴 | **31 – 75** | S1 |
| **Çok kiracılılık** — devralınan tek kiracılı modüllere kiracı ekseni eklenmesi | 🟡 | **8 – 14** | S1 |
| Test, kabul, eğitim, devreye alma *(sürüm başına)* | — | 14 – 24 ×5 | Hepsi |

---

## 3. Toplam

| Sürüm | Kapsam | Geliştirme | +Göç/Kapanış | Toplam |
|---|---|---:|---:|---:|
| **S1** | Altyapı · Talep · Teklif · Maliyet · **BOM** · kiracı ekseni | 148 – 241 | 45 – 99 | **193 – 340** |
| **S2** | Stok · **MRP** · Satın alma · Sipariş · Mühendislik | 61 – 101 | 10 – 16 | **71 – 117** |
| **S3** | Üretim · Kalite · Sevkiyat · Navlun · **İhracat** | 60 – 100 | 10 – 16 | **70 – 116** |
| **S4** | Personel · Fabrika · Bakım · Servis · **Fuar** | 54 – 92 | 10 – 16 | **64 – 108** |
| **S5** | Muhasebe · Firma bulma · Satış · Raporlama | 52 – 88 | 10 – 16 | **62 – 104** |
| | | | **PROGRAM** | **460 – 785** |

**Takvim:**

| Ekip | S1 | Tüm program |
|---|---|---|
| 1 kişi | 9 – 16 ay | 23 – 39 ay |
| 2 kişi | 5 – 8 ay | 12 – 20 ay |
| 3 kişi | 3,5 – 6 ay | 8 – 13 ay |

> Tahmin **S-01, S-02, S-03 cevaplanmadan ±%40** oynar. En büyük belirsizlik
> parametrik BOM (S-02) ve 130 model göçü.

---

## 4. Ne kadar hazır — programın tamamı

| Grup | Modül | Devralma | Program payı |
|---|---|:---:|:---:|
| 🟩 **Neredeyse hazır** — devral, uyarla | MOD-00, 05, 06, 09, 11, 15, 18, 21 | ~85% | 8 / 24 |
| 🟢 **Büyük ölçüde hazır** | MOD-01, 02, 07, 14, 16, 19 | ~70% | 6 / 24 |
| 🟡 **Yarısı hazır** | MOD-04, 08, 12, 17, 20, **22**, **23** | ~45% | 7 / 24 |
| 🟠 **Desen var, iş yeni** | **MOD-03**, **MOD-24** | ~10% | 2 / 24 |
| 🔴 **Hiçbir yerde yok** | MOD-10 | 0% | 1 / 24 |

**Ama efor payı bambaşka:**

| | Modül sayısı | Efor payı |
|---|:---:|:---:|
| 🟩 + 🟢 hazır olanlar | **14 / 24 (%58)** | **~%30** |
| 🟡 + 🟠 + 🔴 iş çıkacaklar | **10 / 24 (%42)** | **~%70** |

> Modüllerin çoğu hazır ama **eforun çoğu hazır olmayanlarda.** En pahalı beş kalem:
> maliyet motoru · BOM + parametrik türetme · veri göçü · MRP · muhasebe.

---

## 5. Sıfırdan yazılacaklar — 18 madde

| # | Konu | Modül | Büyüklük |
|---|---|---|---|
| **Y-1** | **Maliyet hesap katmanı** (22 alt madde) | MOD-03 | **Büyük** |
| **Y-2** | Özyinelemeli BOM patlatma + döngü koruması | MOD-04 | Orta |
| **Y-3** | **Parametrik model türetme** (~130 kule) | MOD-04 | **Orta–Büyük** |
| **Y-15** | **Excel veri göçü + doğrulama** | Tümü | **Büyük** |
| **Y-16** | **MRP motoru** — çok emirli net ihtiyaç, zaman fazlı, tedarik süresi, sipariş önerisi | MOD-24 | **Orta–Büyük** |
| **Y-17** | **İhracat evrak seti** — menşe, ATR/EUR.1, akreditif, gümrük beyanname | MOD-23 | Orta |
| **Y-18** | **Fuar yönetimi** — takvim, standda lead, sonrası takip, fuar ROI | MOD-22 | Orta |
| **Y-8** | 3 ayrı PDF (teknik / ticari / iç maliyet) | MOD-02 | Orta |
| **Y-12** | Atölye eksenine çeviri (makine/kalıp/çevrim → atölye/adam-gün) | MOD-09/18 | Orta |
| **Y-13** | Stok kodu şeması | MOD-05 | Orta |
| **Y-4** | Kalite / test modülü | MOD-10 | Küçük–Orta |
| Y-5 | ENK / ENB numaralandırma | MOD-00/07 | Küçük |
| Y-6 | Avans kontrolü bloğu | MOD-07 | Küçük |
| Y-7 | Teklif İnceleme Formu dijitali | MOD-07 | Küçük |
| Y-9 | Standart dışı kırmızı işaretleme | MOD-02 | Küçük |
| Y-10 | Müşteri teknik soru–cevap kaydı | MOD-08 | Küçük |
| Y-11 | Seçim yazılımı entegrasyonu | MOD-08 | *(S-01'e bağlı)* |
| Y-14 | Modül kayıt defteri | MOD-00 | Küçük |

---

## 6. Sürüm sıralaması — neden bu sıra

Sıra **kapsam kısıtlaması değil, bağımlılık ve darboğaz sırası**.

### S1 — Teklif · Maliyet · Ürün Ağacı
> Hamdi Bey'in saydığı darboğazların üçü burada: **D-1 teklif hazırlama, D-2 maliyet
> analizi, D-3 gönderme**. Ayrıca **maliyet motoru olmadan hiçbir modül anlam ifade
> etmiyor** — MRP de üretim de muhasebe de maliyete bağlı.

**Kapanan Excel'ler:** ürün ağaçları, birim fiyat, CTP maliyet, serpantin maliyet, teklif takip, Word teklif şablonları
**Çıktı:** Müşteri → Model → Teknik veriler → Hesapla → 3 PDF → e-posta → arşiv

### S2 — Stok · MRP · Satın Alma · Sipariş · Mühendislik
> **D-4 darboğazı: malzeme listesi oluşturma ("uzun zaman alıyor").** MRP'nin yeri burası
> ve BOM'a bağlı olduğu için S1'den önce gelemez.

**Kapanan:** iş takip Excel'i, Word Teklif İnceleme Formu, stok Excel'i, elden evrak

### S3 — Üretim · Kalite · Sevkiyat · Navlun · İhracat
> **D-5 darboğazı: iş emri hazırlama/dağıtma.** Üretim kodu paspas'ta, navlun motoru
> TeklifRota'da hazır — bu sürüm görece ucuz. İhracat evrakı sevkiyatla aynı zincirde
> olduğu için burada.

### S4 — Personel · Fabrika · Bakım · Servis · Fuar
> Adam-gün maliyetinin **gerçek personel verisine** bağlanması burada tamamlanıyor.
> Fuar, satış tarafının ön ucu — CRM ve firma bulma ile birlikte anlam kazanıyor.

### S5 — Muhasebe · Firma Bulma · Satış · Raporlama
> Ticari kapanış. Kârlılık analizi burada tamamlanıyor **ama verisi S1'den itibaren
> toplanıyor** — snapshot ilk günden yazılıyor, sonradan geçmişe dönük üretilemez.

---

## 7. İlk sürümde ne var, ne yok

> **S1 sürüm sınırıdır, kapsam sınırı değil.** S2–S5 modülleri planın parçası; yalnız
> henüz açılmamış durumda.

| S1'de açık | S1'de kapalı |
|---|---|
| Altyapı, yetki, dosya, mail, audit | Stok hareketleri, MRP, satın alma |
| Talep + müşteri kartı | Üretim iş emirleri, kalite |
| **Ürün ağacı (çok seviyeli, kg-bazlı, işçilikli)** | Sevkiyat, navlun, ihracat |
| **Maliyet motoru + snapshot** | Personel, bakım, fabrika |
| **Teklif + 3 PDF + arşiv + müşteri portalı** | Fuar, firma bulma, muhasebe, raporlama |

**Kapalı modüller menüde görünmez.** "Yakında" yazmıyoruz: modül `hidden` ise sistemde
yok — menü yok, route 404, API rotası kayıt edilmiyor.

**S1'e alınan iki karar:**

| Kalem | Karar | Gerekçe |
|---|---|---|
| **Müşteri teklif portalı** | 🟢 **S1'e alındı** | TeklifRota'da hazır, ~3 gün. Teklif takibini (D-3) tek başına çözer |
| **Navlun motoru** | 🟡 S3'te | Hazır ama S1'i şişirir. Şema ilk günden yer ayırır |

---

## 8. Kritik yol

```
Şema tasarımı
   └─► BOM veri modeli
          └─► Patlatma motoru ──► Maliyet hesap katmanı ──► Snapshot
                     │                     │
                     └─► Parametrik türetme│
                                │          │
                                └──► 130 model göçü + DOĞRULAMA ◄──┘
                                              │
                                              └─► S1 KAPANIŞ ──► MRP ──► Üretim
```

Kritik yol: **55 – 114 adam-gün, paralelleştirilemez.**
Paralel yürüyebilenler: iskelet · talep/müşteri · teklif devralma · göç araçları · PDF şablonları

> **En riskli bağımlılık:** doğrulama en sonda. Bu yüzden **erken başlar** — ilk 3 model
> doğrulanmadan kalan 127'ye geçilmez.

---

## 9. Yol haritası

| Kilometre taşı | Sürüm | Çıktı |
|---|---|---|
| **M0** Hazırlık | — | Excel dosyaları alınır, S-01/02/03 cevaplanır, efor daralır, **fiyat verilir** |
| **M1** İskelet ayakta | S1 | Giriş + roller + çekirdek tablolar + numaralandırma + deploy. Menüde modül yok |
| **M2** Ürün ağacı çalışıyor | S1 | 3 örnek model, çok seviyeli patlatma, CTP kg-bazlı. **✅ Kapı: maliyet Excel'e birebir eşit** |
| **M3** Maliyet motoru tam | S1 | Çarpan + pazarlık payı + EUR, katmanlar, **snapshot** |
| **M4** Teklif uçtan uca | S1 | 3 PDF, e-posta, arşiv, portal. **✅ Kapı: gerçek teklif ERP'de hazırlandı** |
| **M5** Veri göçü tamam | S1 | 130 model + birim fiyat + müşteriler. **✅ Kapı: her modelde ERP = Excel** |
| **M6** S1 canlı | S1 | Eğitim, sayaç devri, **teklif/maliyet Excel'leri kapandı** |
| **M7** Malzeme zinciri | S2 | Stok kodu, **MRP**, satın alma, ENK/ENB, avans kontrolü. **Kapanan: iş takip Excel'i** |
| **M8** Üretim zinciri | S3 | İş emri, kalite, sevkiyat, navlun, ihracat evrakı |
| **M9** Fabrika ve insan | S4 | Personel, kapasite, bakım, servis, fuar |
| **M10** Ticari kapanış | S5 | Muhasebe, firma bulma, satış, kârlılık panosu |

> **M0 bitmeden kod yazılmaz.** S-02'nin cevabı MOD-04'ün mimarisini belirliyor.

---

## 10. Riskler

| # | Risk | Etki | Ne yaparız |
|---|---|---|---|
| R-1 | **Parametrik BOM kurulamaz** | Göç 15 → 45 gün | M0'da dosyaya bak; kurulamazsa göçü Ensotek'le paylaş |
| R-2 | **Doğrulama tutmaz** | S1 kapanmaz, satış Excel'e döner | M2 kapısı: 3 modelde doğrula, sonra 130'a geç |
| R-3 | Excel'de gizli formül / istisna | Sürprizler | Her sapmayı raporla |
| R-4 | Stok kodu normalizasyonu tıkanır | Göç durur | S-03 M0'da cevaplansın, karar sahibi isimle belirlensin |
| R-5 | Seçim yazılımına erişim yok | Model elle seçilir | Kabul edilebilir; entegrasyon S2'ye |
| R-6 | **Sürüm sırası bozulur** — "şunu da şimdi ekleyelim" | Program uzar | Modül kayıt defteri koruyor: kapalı modül tartışmaya açılmaz |
| R-7 | Devralınan kod yeni şemaya uymaz | Uyarlama şişer | Şema, devralınacak modüllere bakılarak tasarlanıyor |
| R-8 | Ensotek veri hazırlığına vakit ayıramaz | Takvim kayar | Sözleşmede Ensotek sorumlulukları yazılsın |
| **R-9** | **Muhasebe çift kayıt** — ERP ve mevcut program aynı veriyi tutar | Muhasebe güvenilmez olur | S-07 cevaplansın: asıl kayıt hangisi |
| **R-10** | **İhracat evrakı eksik** | Mal gümrükte bekler | MOD-23 S3'te; ülke bazlı gereklilik listesi Ensotek'ten alınır |
| **R-11** | **Ortak/özel ayrımı yanlış konulur** — örn. atölye kuyruğu kiracıya özel yapılırsa | Üretim planlaması baştan yazılır | S-13/S-14 şema tasarımından önce cevaplansın |

---

## 11. Varsayımlar

1. Teknoloji **bizim stack** (Fastify + Bun + Drizzle + MySQL + Next.js 16)
2. Backend + admin panel modülleri devralınıyor, **seed dosyaları kopyalanmıyor**
3. Sistem **çok kiracılı**: `ensotek` ve `kompozit`. Personel/atölye/makine/tedarikçi
   ortak, ürün-teklif-maliyet-cari kiracıya özel
4. S1'de yalnız satış ekibi kullanıcı — mavi yaka ve mobil S3'te
5. Muhasebe entegrasyonu S5'te
6. Termal seçim hesabı yazılmıyor, entegre ediliyor
7. Excel dosyalarının güncel ve eksiksiz kopyası Ensotek'ten geliyor
8. Malzeme normalizasyonu ve doğrulama onayı Ensotek ile birlikte
9. Arayüz S1–S4 Türkçe; çok dillilik S5
10. Barındırma bizim VPS'te

---

## 12. Şimdi ne yapılacak

| Sıra | İş | Kim |
|---|---|---|
| 1 | **Excel dosyalarını iste** — 3 örnek ürün ağacı, birim fiyat, CTP, serpantin, pano, Word şablonlar | Sen → Hamdi Bey |
| 2 | Dosyalara bakarak S-02 / S-03 cevaplansın | Biz |
| 3 | S-01 (seçim yazılımı), S-07 (muhasebe sınırı), ihracat evrak listesi sorulsun | Sen → Hamdi Bey |
| 4 | Efor aralığı daraltılsın | Biz |
| 5 | **Hamdi Bey'e PDF raporu** | Biz |
| 6 | Fiyat | Sen |

> **PDF raporu notu:** Efor tahminleri, risk tablosu ve kaynak proje isimleri rapora
> **girmez**. Rapor; mevcut durum analizi, önerilen sistem, **24 modülün tamamı**,
> sürüm planı ve Ensotek'ten beklenenler üzerine kurulur.

---

**İlgili:** [Modül Planı](ENSOTEK-ERP-MODUL-PLANI.md) ·
[Kapsam](analiz/03-kapsam-taslagi.md) ·
[Açık Sorular](analiz/04-acik-sorular.md) ·
[Yeniden Kullanım](analiz/05-modul-envanteri-yeniden-kullanim.md) ·
[Veri Göçü](analiz/07-excel-veri-gocu.md)
