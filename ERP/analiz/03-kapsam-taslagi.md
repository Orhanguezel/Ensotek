# ANALİZ-03 · Kapsam (SCOPE v0.3)

> **Durum:** Plan aşaması. Geliştirme başlamadı. **Fiyat en son aşama — şimdi konuşulmuyor.**
>
> **v0.1 → v0.2 (2026-08-18):** Kapsam **genişletildi**, opsiyon listesi kaldırıldı —
> *"tamamını hatta fazlasıyla yapacağız"*.
>
> **v0.3 eki (2026-08-18):** Ensotek'in dört reposu incelendi. **Çok kiracılılık gerçek
> bir gereksinim çıktı** — karbonkompozit ayrı bir ürün ailesi. `tenant_key` sabitlenmez,
> canlı kiracı ekseni olur. Ortak/özel ayrımı [ANALİZ-06 §3.5](06-mimari-iskelet.md)'te.
>
> **v0.2 → v0.3 (2026-08-18):** **TeklifRota (`fuar-teklif`)** ve **Paspas ERP** ayrıntılı
> incelendi.
> - TeklifRota → ticari omurga (teklif yaşam döngüsü, revizyon+snapshot, proforma,
>   packing list, müşteri teklif portalı) ve **çok modlu navlun motoru** hazır.
>   OUT-05 kaldırıldı; MOD-15 Faz 3'ten Faz 1'e taşınabilir.
> - Paspas → **üretim kırılımının tamamı** hazır (operasyon rotası, iş emri kırılımı,
>   planlanan↔gerçekleşen, fire, hammadde rezervasyonu, vardiya, duruş, iş yükü kuyruğu).
>   MOD-09 ve MOD-18 🟢'ye oturdu. **Ama Paspas'ta maliyet modülü yok** — maliyet hesap
>   katmanı sıfırdan yazılacak (IHT-321).

**Girdiler:** [Mevcut Durum](01-mevcut-durum-as-is.md) · [İhtiyaç Listesi](02-ihtiyac-listesi.md)
· [Yeniden Kullanım](05-modul-envanteri-yeniden-kullanim.md) · [Mimari İskelet](06-mimari-iskelet.md)
· [Veri Göçü](07-excel-veri-gocu.md) · [Açık Sorular](04-acik-sorular.md)

---

## 1. Ürün tanımı

**Ensotek ERP** — su soğutma kulesi üretimi yapan bir fabrikanın **tamamını** yöneten
kurumsal sistem: potansiyel müşteri bulmaktan teklife, maliyetten üretime, navlundan
sevkiyata, personelden bakıma, muhasebeden servise.

**Merkezdeki nesne "Proje"dir.** Talep geldiğinde proje açılır; teklif, revizyonlar,
maliyet, iş numarası, malzeme listesi, iş emirleri, kalite kayıtları, sevkiyat, tahsilat,
kurulum ve servis aynı proje altında yaşar.

**Hedef:** Ensotek'in **tüm Excel ve Word dosyalarının yerini almak.** Yanında çalışmak
değil, yerine geçmek.

**Sistem çok kiracılıdır.** Ensotek iki ürün ailesi yönetiyor: soğutma kulesi
(ensotek.de · ensotek.com.tr · kuhlturm.com) ve **karbonkompozit** — lunapark ve tema
parkı kompozit ürünleri. Ürünler, ürün ağaçları, müşteriler, teklifler ve iş numaraları
kiracıya özeldir; **personel, atölyeler, makineler, bakım ve tedarikçiler ortaktır** —
çünkü fabrika tektir. Ayrıntı: [ANALİZ-06 §3.5](06-mimari-iskelet.md).

---

## 2. Dört yapıcı karar

| # | Karar | Sonucu |
|---|---|---|
| **K-1** | **Kapsam tam** — teklif/maliyet/üretimin ötesinde firma bulma, navlun, personel, bakım, fabrika, satış, muhasebe da dahil | 21 modül. v0.1'deki 18 kalemlik "opsiyon listesi" **kapsama alındı** |
| **K-2** | **Yeniden kullanım önceliklidir** — kod mümkün olduğunca sıfırdan yazılmaz, workspace'teki mevcut modüller birleştirilir | 21 modülün **19'u** mevcut koddan besleniyor. Ticari omurga **TeklifRota**'dan, üretim omurgası **transpalet-crm**'den → [ANALİZ-05](05-modul-envanteri-yeniden-kullanim.md) |
| **K-3** | **İskelet baştan, modüller tek tek** — taban ilk gün kurulur, modüller sırayla açılır. **Hazır olmayan modül "yakında" denip gösterilmez; sistemde yoktur** | Modül kayıt defteri + `hidden/internal/ready` → [ANALİZ-06](06-mimari-iskelet.md) |
| **K-4** | **Excel tamamen kapanır** — veriler ERP'ye taşınır, eski dosyalar bir daha kullanılmaz | Veri göçü zorunlu kapsam, paralel çalışma yok → [ANALİZ-07](07-excel-veri-gocu.md) |

---

## 3. Sistem ne DEĞİL

Kapsam genişledi ama sınırsız değil:

| | |
|---|---|
| ❌ **Resmi mali müşavirlik / defter tutma değil** | Cari, tahsilat, ödeme planı, fatura-irsaliye ERP'de; **yasal defter ve beyanname değil**. e-fatura mevcut `e-fatura-service` ile entegre edilir |
| ❌ **Bordro/SGK hesaplama motoru değil** | Personel yönetimi var (kimlik, atama, vardiya, evrak, adam-gün); **maaş bordrosu hesaplama yok** |
| ❌ **Prim/komisyon sistemi değil** | Hamdi Bey açıkça hariç tuttu (OUT-01) |
| ❌ **Termal seçim motoru değil** | Mevcut seçim yazılımı **entegre edilir**, termal hesap sıfırdan yazılmaz → [S-01](04-acik-sorular.md) |
| ❌ **CAD sistemi değil** | AutoCAD dosyaları projeye **bağlanır**, çizim yapılmaz |
| ❌ **Kule mühendislik/termal hesap doğrulaması değil** | Seçim sonucunu ERP taşır ve saklar; termal hesabın doğruluğu Ensotek mühendisliğinin sorumluluğunda |

> ✏️ **v0.3 düzeltmesi:** v0.2'de *"gerçek zamanlı nakliye fiyat borsası değil"* (OUT-05)
> yazılmıştı. **Kaldırıldı** — TeklifRota'da navlun borsası/pazar yeri katmanı
> (`freight-marketplace`, `freight-exchange-*`, RFQ ekranı, rate benchmark) zaten
> yazılmış durumda. Kapsam dışı bırakmak için sebep kalmadı.

---

## 4. Modül haritası — 21 modül

| Kod | Modül | Yeniden kullanım | Faz |
|---|---|---|---|
| **MOD-00** | Altyapı (auth, rol, audit, storage, mail, bildirim, ayarlar) | 🟢 | **0** |
| MOD-01 | Talep ve CRM | 🟢 | 1 |
| MOD-02 | Teklif | 🟢→🟡 | 1 |
| MOD-03 | Maliyet | 🟡 | 1 |
| MOD-04 | **Ürün Ağacı (BOM)** — *projenin kalbi* | 🔴 | 1 |
| MOD-05 | Ürün Kataloğu ve Stok | 🟢 | 2 |
| MOD-06 | Satın Alma | 🟢 | 2 |
| MOD-07 | Sipariş / Üretime Teslim | 🟢→🟡 | 2 |
| MOD-08 | Mühendislik | 🟡 | 2 |
| MOD-09 | Üretim ve İş Emirleri | 🟢 **paspas** | 3 |
| MOD-10 | **Kalite** | 🔴 | 3 |
| MOD-11 | Sevkiyat | 🟢 | 3 |
| MOD-12 | Süpervizörlük ve Servis | 🟡 | 4 |
| **MOD-14** | **Firma Bulma** *(yeni)* | 🟡 | 5 |
| **MOD-15** | **Navlun ve Lojistik** *(yeni)* | 🟢 **hazır motor** | 3 · *(1'e çekilebilir)* |
| **MOD-16** | **Personel Yönetimi** *(yeni)* | 🟢 | 4 |
| **MOD-17** | **Bakım Yönetimi — fabrika ekipmanı** *(yeni)* | 🟡 | 4 |
| **MOD-18** | **Fabrika Yönetimi** *(yeni)* | 🟢→🟡 **paspas** | 4 |
| **MOD-19** | **Satış Yönetimi** *(yeni)* | 🟢 | 5 |
| **MOD-20** | **Muhasebe / Maliyet Muhasebesi** *(yeni)* | 🟡 | 5 |
| MOD-21 | Yönetim ve Raporlama | 🟢 | 5 |

🟢 doğrudan alınır · 🟡 alınır + genişletilir · 🔴 büyük ölçüde yeni

> **MOD-13** ([İhtiyaç Listesi](02-ihtiyac-listesi.md)'ndeki "Sistem Geneli") ayrı bir
> modül değildir; **MOD-00 Altyapı** içinde eritilmiştir — web tabanlılık, yetki,
> proje kartı ve Ensotek yazımı iskeletin parçasıdır.

---

## 5. Fazlama

Sıra **Ensotek'in beyan ettiği darboğazlara** göre kuruldu ([AS-IS §6](01-mevcut-durum-as-is.md)),
modül numarasına göre değil.

### FAZ 0 — İskelet
**Modül yok, taban var.** Ayrıntı: [ANALİZ-06 §3](06-mimari-iskelet.md).

MOD-00 · depo yapısı · 14 çekirdek servis · paylaşılan veri çekirdeği ·
numaralandırma (ENK/ENB Excel'den devralınır) · modül kayıt defteri · deploy hattı.

> Faz 0 sonunda menüde **hiçbir modül görünmez**. Bu doğru davranıştır.

---

### FAZ 1 — Teklif + Maliyet + Ürün Ağacı ⭐
> Darboğaz **D-1, D-2, D-3** — Ensotek'in en çok vakit kaybettiği yer, üçü de burada.

MOD-01 Talep/CRM · MOD-02 Teklif · MOD-03 Maliyet · MOD-04 BOM

Paralel yürüyen zorunlu iş: **G-01 → G-03/G-04 → G-02 veri göçü**
([ANALİZ-07 §3](07-excel-veri-gocu.md)). Ürün ağaçları ve birim fiyatlar ERP'de
doğrulanmadan bu faz kapanmaz.

**Çıktı:** *Müşteri → Model → Teknik veriler → Hesapla → 3 PDF hazır → e-posta → arşiv.*
**Kapanan Excel'ler:** ürün ağaçları, birim fiyat, CTP maliyet, serpantin maliyet,
teklif takip, Word teklif şablonları.

---

### FAZ 2 — Sipariş + Mühendislik + Stok + Satın Alma
> Darboğaz **D-4** — malzeme listesi oluşturma ("uzun zaman alıyor").

MOD-05 Stok · MOD-06 Satın Alma · MOD-07 Sipariş/Üretime Teslim · MOD-08 Mühendislik

İçerir: ENK/ENB iş numarası, **avans kontrolü**, Teklif İnceleme Formu'nun dijitali
(Word ve **elden teslim biter**), stok kodu şemasının kurulması, malzeme listesi +
otomatik eksik tespiti, AutoCAD bağlama, müşteri teknik soru-cevap kaydı.

**Kapanan:** iş takip Excel'i, Word inceleme formu, stok Excel'i, elden evrak.

---

### FAZ 3 — Üretim + Kalite + Sevkiyat + Navlun
> Darboğaz **D-5, D-6** — iş emri dağıtımı ve evrak.

MOD-09 Üretim · MOD-10 Kalite · MOD-11 Sevkiyat · MOD-15 Navlun

İçerir: atölye bazlı iş emri (kaynak/polyester/montaj) ve yönlendirme mantığı, atölye
tamamlandı bildirimi, basınç testi → galvaniz → tekrar test, ENB toparlama/paketleme,
**navlun ve yükleme hesabı** (palet/konteyner/TIR, incoterm), sevkiyat öncesi tahsilat
kontrolü. Saha kullanımı için PWA burada devreye girer.

---

### FAZ 4 — Fabrika + Personel + Bakım + Servis
> Darboğaz **D-7** ve fabrika tarafının tamamlanması.

MOD-12 Süpervizörlük/Servis · MOD-16 Personel · MOD-17 Bakım · MOD-18 Fabrika

İçerir: personel kartları, vardiya, atama, evrak; **adam-gün maliyetinin gerçek
personel verisine bağlanması**; makine/ekipman periyodik bakımı ve arıza kaydı; atölye
kapasitesi ve yükleme görünümü; süpervizör seyahat/harcırah/saha raporu; garanti takibi.

---

### FAZ 5 — Ticari kapanış
MOD-14 Firma Bulma · MOD-19 Satış Yönetimi · MOD-20 Muhasebe · MOD-21 Yönetim/Raporlama

İçerir: potansiyel müşteri keşfi ve skorlama, satış pipeline ve kazanma oranı, cari
hesap/tahsilat/ödeme planı, fatura-irsaliye ve **e-fatura entegrasyonu**, gerçekleşen
maliyet ve kârlılık analizi, yönetim panosu.

> **Not:** Kârlılık analizi (teklif ↔ güncel ↔ gerçekleşen maliyet) Faz 5'te tamamlanır
> ama **verisi Faz 1'den itibaren toplanır** — snapshot ilk günden yazılır. Sonradan
> geçmişe dönük üretilemez.

---

## 6. Faz bağımlılıkları

```
FAZ 0  İskelet
  │
  ├─→ FAZ 1  Teklif + Maliyet + BOM        ← G-01,G-02,G-03,G-04 göçü zorunlu
  │      │
  │      ├─→ FAZ 2  Sipariş + Mühendislik + Stok + Satın Alma
  │      │      │
  │      │      └─→ FAZ 3  Üretim + Kalite + Sevkiyat + Navlun
  │      │             │
  │      │             └─→ FAZ 4  Fabrika + Personel + Bakım + Servis
  │      │
  │      └─→ FAZ 5  Firma Bulma + Satış + Muhasebe + Raporlama
  │                  (Faz 1 sonrası herhangi bir noktada başlayabilir)
  │
  └─→ MOD-14 Firma Bulma: teknik olarak bağımsız, Faz 1'e paralel yürütülebilir
```

**Sert bağımlılıklar:**
- MOD-03 (Maliyet) ⟵ MOD-04 (BOM) — BOM olmadan maliyet yok
- MOD-04 ⟵ MOD-05 stok kartları — kalem kartı olmadan BOM satırı yok
- MOD-09 (Üretim) ⟵ MOD-07 (Sipariş) + MOD-08 (Malzeme listesi)
- MOD-20 (Muhasebe) ⟵ MOD-11 (Sevkiyat) — fatura sevkiyata bağlı
- MOD-16 (Personel) ⟶ MOD-03 işçilik maliyetini besler (Faz 4'te gerçek veriye bağlanır)

---

## 7. Bu belgenin durumu

| Adım | Durum |
|---|---|
| Kaynak toplandı | ✅ |
| Mevcut durum (AS-IS) | ✅ |
| İhtiyaç envanteri | ✅ |
| Yeniden kullanım envanteri | ✅ 21 modül eşlendi |
| Mimari iskelet + modül kayıt sistemi | ✅ |
| Veri göçü planı | ✅ 13 göç işi |
| Kapsam | ✅ v0.3 — **21 modül, 6 faz (0–5)** |
| Açık soruların cevaplanması | ⬜ |
| Modül bazlı efor tahmini | ⬜ |
| **Fiyat** | ⬜ **en son aşama** |
| Geliştirme | ⬜ **başlamadı** |
