# ANALİZ-01 · Mevcut Durum (AS-IS)

> **Kaynak:** [KAYNAK-02 · Hamdi Bey'in anlatımı](../kaynak/02-hamdi-anlatimi-ham-kayit.md)
> blokları H-09, H-10, H-12, H-13. Bu belgedeki her satır Hamdi Bey'in anlatımına
> dayanır; çıkarım yapılan yerler **[çıkarım]** ile işaretlenmiştir.
>
> **Durum:** Kapsam belirleme. Geliştirme başlamadı.

---

## 0. Genel tespit

Ensotek'te üretim **stoktan üret** değil, **proje bazlı mühendislik üretimi**dir.
Her iş müşteri talebiyle başlar, kendine özgü teknik seçim ve maliyet analizi üretir,
sevkiyatla biter. Bugün bu zincirin tamamı **Excel + Word + elden kâğıt + klasör**
üzerinde yürüyor; adımlar arası bağ **insan hafızası ve dosya kopyalama** ile kuruluyor.

Bilginin taşındığı araçlar:

| Araç | Ne tutuluyor |
|---|---|
| Excel — teklif takip | Teklif takip numarası sırası |
| Excel — iş takip | ENK/ENB iş numarası sırası, firma, ilgili, ürün, fiyat |
| Excel — ürün ağaçları | Her model için ayrı maliyet analizi sayfası |
| Excel — birim fiyat | Malzeme birim fiyatları + işçilik (adam-gün, harcırah, SGK, yemek) |
| Excel — serpantin maliyet | Model × kat sayısı bazlı serpantin analizleri |
| Excel — CTP maliyet | CTP gövde/çatı/havuz reçeteleri → kg başı maliyet |
| Excel — pano | Otomasyoncunun hesapladığı pano fiyatları |
| Excel — stok | Fan, motor, redüktör gibi bazı önemli kalemler (düzensiz) |
| Word / Excel | Teklif şablonları |
| Word | Teklif İnceleme Formu |
| Web (harici) | Kule seçim yazılımı (daha önce yaptırılmış) |
| Kâğıt çıktı | Seçim tabloları (satış masalarında), imalata giden dosya |
| Dosya klasörü | Teklif no bazlı PDF arşivi |

---

## 1. Teklif süreci (AS-IS)

### 1.1 Talep girişi
- Talep üç kanaldan gelir: **e-posta, telefon, WhatsApp**.
- Talep tipi ikiye ayrılır: **soğutma kulesi** veya **yedek malzeme**.
- Satış ekibinden biri işi üstlenir.

### 1.2 Numaralandırma
- Satış personeli **Excel'den bir teklif takip numarası** alır.

### 1.3 Teknik seçim
- Önce müşterinin verdiği kapasite talebine göre kule seçimi yapılır.
- İki araç paralel kullanılır:
  1. **Basılı seçim tabloları** — satış masalarında çıktı olarak durur.
  2. **Web tabanlı seçim yazılımı** — daha önce yaptırılmış, teyit amaçlı kullanılır.
- Yazılıma girilen değerler: **su giriş sıcaklığı, su çıkış sıcaklığı, yaş termometre
  sıcaklığı, su debisi**. Çıktı: **kulenin kaç m² olduğu** ve **hangi modele tekabül ettiği**.

### 1.4 Teklif dokümanının hazırlanması
- Model belli olduktan sonra Word veya Excel şablonu açılır.
- Girilenler: iş numarası, müşteri adı-soyadı, şirket bilgileri, tarih, revizyon numarası,
  teklif numarası, müşteri verileri.
- **Model belli olunca ölçüler değişmez.** Değişen: sıcaklıklar, debiler, kcal değerleri.
- Özel istekler (ısıya dayanıklı kule, motora ek özellik vb.) teklifte **kırmızı renkle**
  gösterilir — standart dışı olduğu bu şekilde işaretlenir.
- Kapsam kalemleri girilir: **nakliye kimde, kurulum kimde, vinç kimde**.

### 1.5 Maliyet analizi
- Maliyetler Excel'de. Ürün ağaçları Excel'de.
- Her ürünün modeline göre bir **standart maliyet analizi** sayfası vardır.
- Aynı Excel içinde bu sayfa **kopyalanır** ve müşteriye özel adlandırılır
  (örn. sayfa adı `CTP5 XYZ` → "XYZ firmasının CTP5 model kulesinin maliyet analizi").
- Kopyada düzeltilmesi gereken kalemler ve maliyeti değiştiren ekstrem talepler düzeltilir.
- Toplam maliyet görülür.

### 1.6 Fiyatlandırma
```
Toplam Maliyet  →  Çarpan (kâr)  →  Pazarlık payı (%3–5)  →  Euro kuru  →  Teklif fiyatı (EUR)
```
- Çarpan ve pazarlık payı Excel'de **formülize** edilmiştir; girilen değeri Excel çarpar.
- Fiyatlar **genelde Euro bazında** verilir.
- **Euro kurunu Excel bir yerden otomatik okur.**

### 1.7 Ek kalemler
- **Pano:** fiyatı ayrı bir Excel'de tutulur, **otomasyoncu ayrıca hesaplar**, teklife
  **ikinci kalem** olarak eklenir.
- **Su şartlandırma sistemi** vb. istenirse eklenir.

### 1.8 Montaj / süpervizörlük kapsamı
| Kule tipi | Sevk şekli | Kurulum |
|---|---|---|
| **Büyük kule** (TIR'a sığmayan) | Demonte | Ensotek **süpervizör** gönderir. Teklifte yazar: 1 süpervizör Ensotek'ten, **4–5 yardımcı personel müşteriden**, süre 5–10 gün, **süpervizörün oteli müşteride**. |
| **Paket tip** (TIR/konteynere sığan) | Kurulu, ya da 1–2 parçası demonte | Kurulumu **müşteri yapar**. Ensotek gitmez; istenirse gidebilir. |

### 1.9 PDF ve gönderim
- Müşteri teklifi başka birine iletecekse → **teknik teklif ve ticari teklif ayrı PDF**.
- İletmeyecekse → **tek PDF**.
- Gönderim **%90 e-posta**; arada isteyene **WhatsApp**.

### 1.10 Arşivleme
Teklif numarası adlı bir klasöre şunların **PDF'leri** konur:
- Teklif PDF'i
- Maliyet PDF'i
- Gönderilen mailin içeriği
- Müşteriden gelen talebin içeriği

### 1.11 Takip
- Sonraki günlerde **ara ara** manuel takip edilir.

---

## 2. Sipariş ve üretim süreci (AS-IS)

### 2.1 İşe dönüşüm
- Pazarlıklar yapılır, **ödeme planına göre anlaşma** sağlanır, teklif işe dönüşür.

### 2.2 Avans kontrolü
- **Avans isteniyorsa:** avans ödemesi gelmeden iş **imalata/üretime teslim edilmez**.
- **İstenmiyorsa:** doğrudan üretime verilebilir.

### 2.3 İş numarası
Satış ekibindeki arkadaş Excel üzerinden iş takip numarası alır:

| Önek | Kapsam |
|---|---|
| **ENK** | Küçük işler **ve** malzeme (yedek parça) işleri |
| **ENB** | Büyük işler |

- Numara Excel'deki sıra numarasıdır: `ENK-5715` → Excel sıra no 5715.
- Aynı satıra girilenler: firma adı, ilgili kişi, ne satıldığı, **fiyat**.
- Bu fiyattan **prim hesabı** yapılabiliyor.
  > ⚠️ Hamdi Bey'in açık talimatı: **"bu primi şimdilik sen sistemde tutma"** →
  > prim modülü **kapsam dışı** (bkz. [Kapsam Taslağı](03-kapsam-taslagi.md) OUT-01).

### 2.4 Teklif İnceleme Formu (Word)
İçeriği: ürünün ne olduğu, iş numarası ve **standart dışı not/özellikler**, örneğin:
- Termistörlü motor
- Süpervizörün oteli Ensotek'ten
- Nakliye Ensotek'ten
- Boru çapı (örn. DN250)
- Motor gücü

### 2.5 İmalata devir — **elden**
- Teklif İnceleme Formu + teklif + maliyet + önemli yazışmaların **çıktıları** alınır,
  **elden imalat ofisine (üretim ofisi) teslim edilir**.
- Oradan biri işi üstlenir; **veya imalat müdürü önce inceleyip birine atar**.

### 2.6 Mühendislik
- Atanan kişi **AutoCAD'de genel görünüş projesini** oluşturur.
- Gerekirse **müşteriye teknik sorular** sorar. Örnek: *"Su çıkışı pompaya mı bağlanacak,
  yoksa havuzdan kendi ağırlığıyla mı dökülecek?"*
- Malzemelerin **stokta olup olmadığını kontrol eder**; eksikse **satın alma siparişini
  verdirir**.
- **Malzeme listesini** oluşturur.

### 2.7 İş emri
- **Üretim iş emri** oluşturulur ve ilgili atölyelere dağıtılır:
  **kaynak atölyesi, polyester atölyesi, montaj atölyesi**.
- Yönlendirme mantığı:
  - Tüm malzemeler ve yarı mamuller (kule yan duvarları vb.) stokta ise → **doğrudan montaj**.
  - Değilse önce **polyester**.
  - Kapalı kule ve serpantin yoksa → önce **kaynak atölyesi**.

### 2.8 Atölye işleri
| Atölye | İş |
|---|---|
| **Montaj** | Motor, fan vb. **stoktan çeker**; paket kulenin montajını yapar |
| **Kaynak** | Stoktaki borularla **serpantin imalatı** |
| **Polyester** | Yan duvarlar, çatı, havuz, **CTP baca** |
| *(metal)* | Bazı kulelerde **metal baca**; motor altındaki taşıyıcı sistem metal — **genelde stokta**, nadiren imal edilir |

### 2.9 Kalite / test (serpantin hattı)
```
Serpantin imalatı → Basınç testi (hava basılır, su/damla kaçırıyor mu) → Galvaniz → Dönüşte tekrar test
```

### 2.10 Sevkiyata hazırlık
- **Paket kule ise:** montaj atölyesinde montajı yapılır.
- **ENB (sahada kurulacak büyük kule) ise:** malzemeler bir noktada **toparlanır** —
  bu işi genelde **montajcılar** yapar: paletleme, streçleme, çuvallama; ayrı bir yerde bekletilir.

### 2.11 Sevkiyat ve tahsilat
- Sevkiyat zamanı **montajcılar yükler**: TIR, konteyner veya kamyon.
- Ödeme takibi:
  - **Bakiye sevkiyat öncesi ise:** önce tahsilat → fatura + irsaliye → sevk.
  - **Vadeli ise:** fatura + irsaliye → sevk → ödeme sonradan takip edilir.

---

## 3. Ürün gamı ve ürün ağacı yapısı (AS-IS)

### 3.1 Ürünler
- **Ana ürünler:** açık tip soğutma kuleleri, kapalı tip soğutma kuleleri.
- Web sitesindeki **evaporatif kondenser**, aslında kapalı tip kulenin farklı mühendislik
  hesabıyla adlandırılmış halidir; **ürün olarak aşağı yukarı aynıdır**.

### 3.2 Model yapısı
- Açık tip: **CTP1 → CTP30**; aralarda boşluklar var (örn. **CTP8 yok**, ileride olabilir).
- Hücre çeşitlemesi: **2, 3, 4 hücreli**. `TCTP30` = 3 hücreli 30 → **~90 m²**
  (tek hücreli 30 m² olsaydı).
- Küçük modellerde 3–4 hücreli **genelde olmaz**.
- Toplam: açık tipte **en az ~100 model**, kapalı tipte **30–40 model**.

### 3.3 Ürün ağaçları
- **Her modelin ayrı ürün ağacı var**, hepsi Excel'de.
- Ürün ağacı satırı = kalem + adet + **birim fiyat** (birim fiyat Excel'inden okunur).
- **İşçilikler de birim fiyat Excel'inde**: kaç adam-gün, kaç adam-gün harcırah,
  kaç adam-gün sigorta, yemek → hepsi ürün ağacında alt alta oluşur.
- Toplam maliyet + kâr oranı → fiyat.

### 3.4 Modeller arası benzerlik — **kritik tasarım girdisi**
> CTP5 ile CTP6'nın **büyük kısmı aynı**. Değişen: **miktarlar, motor gücü, fan çapı,
> adam-gün sayıları**. **"İskelet aynı iskelet."**

### 3.5 Serpantin (kapalı tip)
- Ayrı bir **serpantin maliyet analizi Excel'i** vardır.
- Sayfaları: model × **kat sayısı** (3 katlı, 4 katlı, 5 katlı).
- Kapalı kule ürün ağacına **tek bir malzeme kalemi** olarak okutulur.

### 3.6 CTP gövde — kg bazlı maliyet
- CTP kalemlerinin (kaporta/yan duvar, çatı, havuz) **kendi reçeteleri / ürün ağaçları** var.
- Bunlardan **kilogram başı maliyet** hesaplanır (örn. **10 $/kg**).
- CTP5 ürün ağacında tek satır: **`CTP maliyeti — 270 kg`** → 270 × 10 $/kg.
- Fiyat **CTP maliyet Excel'inden otomatik okunur**; alt reçeteleri tek tek açmaya gerek yok.
- **[çıkarım]** Bu, fiilen **çok seviyeli ürün ağacı (multi-level BOM)** demektir.

### 3.7 Yarı mamul / yedek parça satışı
Sadece komple kule satılmıyor. Tek başına satılabilenler:
**motor, fan, redüktör, havuz, serpantin** ve diğer yedek parçalar.

---

## 4. Stok ve kodlama (AS-IS)

- **Stok kodu yok.** ("Çok kullandığımız bir şey değil, Excel'de tuttuğumuz için.")
  Hamdi Bey: *"Yapılabilir mi? Yapılabilir. Zor bir şey değil."*
- **Stok takibi gözle yapılıyor.** Fan, motor, redüktör gibi bazı önemli kalemler bir
  Excel'de tutulabiliyor ama **profesyonel bir sistem yok**.
- Eksildikçe **birileri haber verir**, satın almacılar siparişi geçer.
- Stok birim fiyatları **ayrı bir Excel**'de; diğer ürün ağaçları fiyatı oradan okur.

---

## 5. Servis (AS-IS)

- Her ürünün arkasından hemen servis gelmez.
- Ürün **uzun yıllar kullanıldığı** için servis talepleri **uzun vadede** gelir.

---

## 6. Beyan edilen darboğazlar

Hamdi Bey'in doğrudan "vaktimizi alan" diye saydıkları:

| # | Darboğaz | Kim |
|---|---|---|
| **D-1** | Teklifin hazırlanması | Satış / teklifçiler |
| **D-2** | Maliyet analizinin hazırlanması | Satış / teklifçiler |
| **D-3** | Teklifin gönderilmesi | Satış / teklifçiler |
| **D-4** | **Malzeme listesi oluşturulması ("uzun zaman alıyor")** | İmalat |
| **D-5** | İş emirlerinin hazırlanıp dağıtılması | İmalat |
| **D-6** | Evrak işleri (sevkiyat sonrası) | Genel |
| **D-7** | Servis takibi | Servis |

Bu tablo, **hangi modülün önce geliştirileceğini** belirleyen asıl girdidir:
D-1/D-2/D-3 tek bir modülde (Teklif + Maliyet) toplanıyor ve en yüksek getiriyi orası veriyor.

---

## 7. Süreç zinciri — özet akış

```
Talep (e-posta / telefon / WhatsApp)
  → Satış üstlenir + Excel'den teklif takip no
  → Teknik seçim (basılı tablo + web seçim yazılımı) → Model
  → Word/Excel teklif şablonu (standart dışılar KIRMIZI)
  → Excel maliyet analizi (model sayfası kopyalanır)
  → Çarpan + pazarlık payı + Euro kuru → Fiyat
  → (+ Pano Excel'i, + su şartlandırma)
  → PDF: teknik + ticari ayrı veya birleşik
  → E-posta (%90) / WhatsApp
  → Teklif no klasörüne PDF arşivi
  → Manuel takip
        ↓ kazanıldı
  Pazarlık + ödeme planı → İŞE DÖNÜŞÜM
  → Excel'den ENK/ENB iş no (+ firma, ilgili, ürün, fiyat)
  → [avans isteniyorsa: AVANS BEKLE]
  → Word Teklif İnceleme Formu (standart dışı notlar)
  → ÇIKTI ALINIR → ELDEN imalat ofisine
  → İmalat müdürü atar / biri üstlenir
  → AutoCAD genel görünüş + müşteriye teknik sorular
  → Stok kontrolü → eksikse satın alma
  → MALZEME LİSTESİ  ← darboğaz
  → İŞ EMİRLERİ → kaynak / polyester / montaj  ← darboğaz
  → Serpantin: basınç testi → galvaniz → tekrar test
  → Paket ise montaj / ENB ise toparlama-paletleme-streç
  → Sevkiyat (montajcılar yükler: TIR / konteyner / kamyon)
  → Tahsilat + fatura + irsaliye (sırası ödeme planına bağlı)
        ↓ uzun vadede
  Servis talebi
```
