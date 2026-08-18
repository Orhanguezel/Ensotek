# Ensotek ERP — Analiz ve Plan

> **Durum: PLAN AŞAMASI. Geliştirme başlamadı. Fiyat en son aşama.**

Su soğutma kulesi üreten bir fabrikanın **tamamını** yöneten kurumsal sistem:
firma bulmaktan teklife, maliyetten üretime, navlundan sevkiyata, personelden bakıma,
muhasebeden servise. Bu klasör projenin **analiz ve planını** tutar — kod değil.

---

## Dört yapıcı karar

| # | Karar |
|---|---|
| **K-1** | **Kapsam tam** — 21 modül. Teklif/maliyet/üretimin ötesinde firma bulma, navlun, personel, bakım, fabrika, satış, muhasebe da dahil |
| **K-2** | **Yeniden kullanım önceliklidir** — kod sıfırdan yazılmaz; workspace'teki mevcut modüller birleştirilir. 21 modülün **19'u** mevcut koddan besleniyor |
| **K-3** | **İskelet baştan, modüller tek tek** — taban ilk gün kurulur. **Hazır olmayan modül "yakında" denip gösterilmez; sistemde yoktur** |
| **K-4** | **Excel tamamen kapanır** — veriler ERP'ye taşınır, paralel çalışma yok |

Teknoloji: **bizim teknoloji** — Fastify + Bun + Drizzle + MySQL + Next.js 16.

---

## ⭐ Ana belge

| Dosya | İçerik |
|---|---|
| **[ENSOTEK-ERP-MODUL-PLANI.md](ENSOTEK-ERP-MODUL-PLANI.md)** | **24 modülün tamamı** — her birinin hazırlık durumu, kaynağı, taşınacak backend/admin modülü, ne eksik. Hiçbir yerde olmayanların listesi + maliyet muhasebesi analizi |
| **[PROGRAM-PLANI.md](PROGRAM-PLANI.md)** 🔒 | **İÇ BELGE** — 24 modülün **efor tahmini**, hazır/yeni oranı, sürüm sıralaması S1–S5, kritik yol, yol haritası M0–M10, riskler. *Müşteriye gitmez.* |
| **[rapor/01-sistem-plani.md](rapor/01-sistem-plani.md)** 📤 | **MÜŞTERİ BELGESİ** — 24 bölümün kapsamı iş dilinde, aşama planı, Ensotek'ten beklenenler. Teknik ayrıntı, efor, risk ve kaynak proje adı yok |
| **[rapor/02-mvp-teklif.md](rapor/02-mvp-teklif.md)** 📤 | **TEKLİF** — Birinci faz: 3 aşama · 3 ay · 120.000 ₺ + KDV (3 × 40.000). Görsel sürüm: [teklif.html](rapor/teklif.html) → [yayında](https://claude.ai/code/artifact/1e3d06b0-a54a-44a5-8711-b0d4aecfcf29) |

---

## Dosyalar

### 📥 Kaynak — ham, değiştirilmez

| Dosya | İçerik |
|---|---|
| [kaynak/01-hamdi-gorusme-tam-dokum.md](kaynak/01-hamdi-gorusme-tam-dokum.md) | Hamdi Bey ↔ ChatGPT görüşmesinin tam dökümü (14 soru / 14 cevap) |
| [kaynak/02-hamdi-anlatimi-ham-kayit.md](kaynak/02-hamdi-anlatimi-ham-kayit.md) | **Yalnız Hamdi Bey'in yazdıkları**, birebir. Gereksinimlerin tek doğruluk kaynağı |

### 📊 Analiz ve plan

| Dosya | İçerik |
|---|---|
| [analiz/01-mevcut-durum-as-is.md](analiz/01-mevcut-durum-as-is.md) | Ensotek bugün nasıl çalışıyor: teklif, üretim, ürün ağacı, stok, darboğazlar |
| [analiz/02-ihtiyac-listesi.md](analiz/02-ihtiyac-listesi.md) | **213 gereksinim**, kaynağına bağlı *(Fuar/İhracat/MRP gereksinimleri eklenecek)* |
| [analiz/03-kapsam-taslagi.md](analiz/03-kapsam-taslagi.md) | **SCOPE v0.3** — 21 modül, 6 faz (0–5), bağımlılık zinciri, sistem ne DEĞİL |
| [analiz/04-acik-sorular.md](analiz/04-acik-sorular.md) | Planı netleştirmek için cevaplanacaklar |
| [analiz/05-modul-envanteri-yeniden-kullanim.md](analiz/05-modul-envanteri-yeniden-kullanim.md) | **Hangi modül hangi projeden geliyor** — doğrulanmış eşleme |
| [analiz/06-mimari-iskelet.md](analiz/06-mimari-iskelet.md) | İskelet, modül kayıt defteri, **"yakında" yasağı**, teknoloji |
| [analiz/07-excel-veri-gocu.md](analiz/07-excel-veri-gocu.md) | 13 göç işi, sıra, doğrulama kuralı, Excel'in kapanması |

---

## Modül haritası

| Sürüm | Modüller | Odak |
|---|---|---|
| **S1** ⭐ | Altyapı · Talep/CRM · **Teklif** · **Maliyet** · **Ürün Ağacı** | D-1/D-2/D-3 — en çok vakit kaybedilen yer |
| **S2** | Stok · **MRP** · Satın Alma · Sipariş/Üretime Teslim · Mühendislik | D-4 — malzeme listesi darboğazı |
| **S3** | Üretim · Kalite · Sevkiyat · Navlun · **İhracat/Gümrük** | D-5 — iş emri ve evrak darboğazı |
| **S4** | Personel · Fabrika · Bakım · Servis · **Fuar** | Fabrika ve insan tarafı |
| **S5** | Muhasebe · Firma Bulma · Satış · Raporlama | Ticari kapanış |

**Sürüm sırası kapsam kısıtlaması değil, bağımlılık ve darboğaz sırasıdır.**
24 modülün tamamı programın parçası.

---

## Yeniden kullanım — nereden ne geliyor

| Kaynak proje | Ne veriyor |
|---|---|
| **fuar-teklif / TeklifRota** ⭐ | **Ticari omurga.** Teklif yaşam döngüsü (11 durumlu state machine), revizyon + snapshot, teklif no sayacı, olay zaman çizelgesi, onay motoru, proforma, packing list, sipariş, sevkiyat, **müşteri teklif portalı** (`/teklif/[token]`), belge üretimi, Excel içe/dışa aktarma. Ayrıca **`@teklifrota/freight-engine`** — 5.515 satırlık çok modlu (kara/deniz/hava) navlun motoru, nakliyeci RFQ, navlun borsası |
| **transpalet-crm** (48 modül) | **Üretim omurgası.** Üretim emri, reçete, stok, satın alma, tedarikçi, sevkiyat, mal kabul, müşteri, servis, personel, görev, gantt, Logo entegrasyonu |
| **paspas** (Paspas ERP) ⭐ | **Üretim kırılımının tamamı.** 41.930 satır, 41 modül, 129 seed-SQL, 74 test. Operasyon rotası, iş emri operasyon kırılımı (**planlanan↔gerçekleşen**, fire), hammadde rezervasyonu, operatör günlük kaydı, vardiya analizi, duruş nedenleri, iş yükü kuyruğu, üretim partisi, birim dönüşümü, Türkçe teklif PDF şablonu |
| **ihracatradari.com.tr** | **Firma bulma** — enrichment, decision-makers, scans, scoring |
| **osgb-yazilim** | **Personel**, çalışan, evrak, atama, KPI |
| **e-fatura-service** | e-Fatura entegrasyonu |
| **Ensotek/packages/shared-backend** | auth, storage, mail, notifications, userRoles, audit, db_admin, tema, ayarlar |

**Yeniden kullanım oranı:** 10 modül doğrudan · 9 modül genişleterek · **2 modül büyük ölçüde yeni**
(MOD-04 Ürün Ağacı, MOD-10 Kalite) — **artı hiçbir kaynakta bulunmayan maliyet hesap katmanı.**

**İş bölümü:** ticari zincir → TeklifRota · üretim zinciri → Paspas · genel ERP dokusu →
transpalet-crm. Üçü de aynı stack ve aynı modül dosya düzeninde, bu yüzden birleştirme
mimari değil **veri modeli** işi.

**Tek gerçek uyarlama maliyeti:** TeklifRota çok kiracılı SaaS (73 şemanın 45'inde
`tenant_key`). Sökülmeyecek — sabit tek değere bağlanacak. Abonelik/faturalandırma
modülleri (`billing`, `payments`, `entitlements`, `tenants`) alınmayacak.

---

## En kritik iki nokta

### 🔴 MOD-04 Ürün Ağacı — projenin kalbi ve tek büyük riski
Mevcut `receteler` şeması **tek seviyeli ve maliyetsiz**. Ensotek'in ihtiyacı: çok
seviyeli patlatma + maliyet roll-up, kg-bazlı kalem (CTP gövde 270 kg × €/kg), işçilik
satırı (adam-gün/harcırah/SGK/yemek), ~130 model için parametrik türetme, revizyon ve
snapshot. **Şema sıfırdan tasarlanacak.**

### 🔴 Maliyet hesap katmanı — hiçbir kaynakta yok
Üç ERP kaynağının **hiçbirinde maliyet modülü yok.** Paspas üretim verisini eksiksiz
*topluyor* (planlanan/gerçekleşen süre, fire, duruş) ama *maliyetlendirmiyor*.
TeklifRota fiyat toplamını dondurdu ama maliyet kırılımını değil. Ensotek'in maliyet
formülü zaten kendine özgü (kg-bazlı CTP, adam-gün, çarpan, pazarlık payı, EUR kuru) —
**bu katman sıfırdan yazılacak** (IHT-317…321).

### 🔴 Veri göçü doğrulaması — pazarlıksız
Her model için **ERP'nin hesapladığı maliyet, Excel'in hesapladığına birebir eşit**
olana kadar göç tamamlanmış sayılmaz. Rakamlar tutmazsa satış ekibi Excel'e geri döner
ve proje fiilen ölür.

---

## Devralma kuralı

| | |
|---|---|
| ✅ Backend modülleri | Taşınır |
| ✅ Admin panel modülleri | Taşınır (ekran + `_components`) |
| ✅ Testler | Taşınır |
| ❌ **Seed / migrasyon dosyaları** | **Kopyalanmaz** — şemalar model olarak okunur, Ensotek için tek temiz `CREATE TABLE` seti yazılır |

Paspas'ın 129, TeklifRota'nın 73 seed-SQL'i büyük ölçüde birikmiş `ALTER TABLE` zinciri.
Üç projenin tarihçesi Ensotek'e taşınmayacak.

---

## Sonraki adımlar

- [ ] **Ensotek'ten Excel dosyalarını al** — 3 örnek ürün ağacı (küçük/orta/büyük), birim fiyat, CTP maliyet, serpantin, pano, Word teklif şablonu, Teklif İnceleme Formu
- [ ] Dosyalara bakarak **S-02** (parametrik BOM mümkün mü) ve **S-03** (stok kodu şeması) cevaplanır
- [ ] **S-01** — mevcut seçim yazılımına erişim durumu
- [ ] MOD-04 veri modeli tasarımı — projenin kalbi
- [ ] Modül bazlı efor tahmini
- [ ] *(en son)* Fiyat

---

*Kaynak alındı: 2026-08-18 · https://chatgpt.com/share/6a74d01b-9d04-83ed-a7d2-1fb546d194fa*
