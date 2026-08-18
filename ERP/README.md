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
| [analiz/02-ihtiyac-listesi.md](analiz/02-ihtiyac-listesi.md) | **195 gereksinim**, 21 modül, her biri kaynağına bağlı |
| [analiz/03-kapsam-taslagi.md](analiz/03-kapsam-taslagi.md) | **SCOPE v0.3** — 21 modül, 6 faz (0–5), bağımlılık zinciri, sistem ne DEĞİL |
| [analiz/04-acik-sorular.md](analiz/04-acik-sorular.md) | Planı netleştirmek için cevaplanacaklar |
| [analiz/05-modul-envanteri-yeniden-kullanim.md](analiz/05-modul-envanteri-yeniden-kullanim.md) | **Hangi modül hangi projeden geliyor** — doğrulanmış eşleme |
| [analiz/06-mimari-iskelet.md](analiz/06-mimari-iskelet.md) | İskelet, modül kayıt defteri, **"yakında" yasağı**, teknoloji |
| [analiz/07-excel-veri-gocu.md](analiz/07-excel-veri-gocu.md) | 13 göç işi, sıra, doğrulama kuralı, Excel'in kapanması |

---

## Modül haritası

| Faz | Modüller | Odak |
|---|---|---|
| **0** | MOD-00 Altyapı | İskelet — modül yok, taban var |
| **1** ⭐ | MOD-01 Talep/CRM · MOD-02 Teklif · MOD-03 Maliyet · **MOD-04 Ürün Ağacı** | Ensotek'in en çok vakit kaybettiği yer |
| **2** | MOD-05 Stok · MOD-06 Satın Alma · MOD-07 Sipariş · MOD-08 Mühendislik | Malzeme listesi darboğazı |
| **3** | MOD-09 Üretim · MOD-10 Kalite · MOD-11 Sevkiyat · **MOD-15 Navlun** *(motor hazır — Faz 1'e çekilebilir)* | İş emri ve evrak darboğazı |
| **4** | MOD-12 Servis · **MOD-16 Personel** · **MOD-17 Bakım** · **MOD-18 Fabrika** | Fabrika tarafının tamamlanması |
| **5** | **MOD-14 Firma Bulma** · **MOD-19 Satış** · **MOD-20 Muhasebe** · MOD-21 Yönetim | Ticari kapanış |

---

## Yeniden kullanım — nereden ne geliyor

| Kaynak proje | Ne veriyor |
|---|---|
| **fuar-teklif / TeklifRota** ⭐ | **Ticari omurga.** Teklif yaşam döngüsü (11 durumlu state machine), revizyon + snapshot, teklif no sayacı, olay zaman çizelgesi, onay motoru, proforma, packing list, sipariş, sevkiyat, **müşteri teklif portalı** (`/teklif/[token]`), belge üretimi, Excel içe/dışa aktarma. Ayrıca **`@teklifrota/freight-engine`** — 5.515 satırlık çok modlu (kara/deniz/hava) navlun motoru, nakliyeci RFQ, navlun borsası |
| **transpalet-crm** (48 modül) | **Üretim omurgası.** Üretim emri, reçete, stok, satın alma, tedarikçi, sevkiyat, mal kabul, müşteri, servis, personel, görev, gantt, Logo entegrasyonu |
| **paspas** (Paspas ERP, 41 modül) | Üretim emirleri, satış siparişleri, vardiya analizi, makine havuzu |
| **ihracatradari.com.tr** | **Firma bulma** — enrichment, decision-makers, scans, scoring |
| **osgb-yazilim** | **Personel**, çalışan, evrak, atama, KPI |
| **e-fatura-service** | e-Fatura entegrasyonu |
| **Ensotek/packages/shared-backend** | auth, storage, mail, notifications, userRoles, audit, db_admin, tema, ayarlar |

**Yeniden kullanım oranı:** 10 modül doğrudan · 9 modül genişleterek · **2 modül büyük ölçüde yeni**
(MOD-04 Ürün Ağacı, MOD-10 Kalite).

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

### 🔴 Veri göçü doğrulaması — pazarlıksız
Her model için **ERP'nin hesapladığı maliyet, Excel'in hesapladığına birebir eşit**
olana kadar göç tamamlanmış sayılmaz. Rakamlar tutmazsa satış ekibi Excel'e geri döner
ve proje fiilen ölür.

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
