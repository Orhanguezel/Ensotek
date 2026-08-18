# ANALİZ-07 · Excel Veri Göçü

> **Karar (2026-08-18):** *"Excel verilerini buraya atacağız. **Mevcut Excel
> sistemlerini bir daha kullanmayacaklar.**"*
>
> Bu bir "isteğe bağlı içe aktarma" değil, **kapsamın zorunlu parçası**. ERP, Excel'in
> yanında değil, **yerine** geçecek.

---

## 1. Göç edecek Excel varlıkları

[AS-IS §0](01-mevcut-durum-as-is.md) tablosundan türetildi. Her satır bir göç işidir.

| # | Excel | İçerik | Hedef modül | Zorluk | Faz |
|---|---|---|---|---|---|
| **G-01** | Birim fiyat listesi | Malzeme birim fiyatları **+ işçilik** (adam-gün, harcırah, SGK, yemek) | MOD-05 stok kartı + MOD-03 maliyet | 🟡 | **1** |
| **G-02** | Ürün ağaçları | Model bazlı maliyet analizi sayfaları — açık tip ~100, kapalı tip 30–40 | MOD-04 BOM | 🔴 | **1** |
| **G-03** | CTP maliyet | CTP gövde/çatı/havuz reçeteleri → **kg başı maliyet** | MOD-04 alt ağaç | 🟡 | **1** |
| **G-04** | Serpantin maliyet | Model × kat sayısı (3/4/5 katlı) analizleri | MOD-04 alt ağaç | 🟡 | **1** |
| **G-05** | Pano fiyatları | Otomasyoncunun hesapladığı pano fiyatları | MOD-02 opsiyon kalemi | 🟢 | **1** |
| **G-06** | Teklif takip | Teklif numarası sırası + açık teklifler | MOD-02 + sayaç | 🟢 | **1** |
| **G-07** | İş takip | **ENK/ENB sırası**, firma, ilgili, ürün, fiyat | MOD-07 + sayaç | 🟢 | **1–2** |
| **G-08** | Müşteri bilgileri | Firma, ilgili kişi, iletişim | MOD-01 | 🟢 | **1** |
| **G-09** | Stok Excel'i | Fan, motor, redüktör gibi bazı kalemler (düzensiz) | MOD-05 | 🟡 | **2** |
| **G-10** | Word teklif şablonları | Antet, madde düzeni, standart notlar | PDF şablonu | 🟡 | **1** |
| **G-11** | Word Teklif İnceleme Formu | Alan yapısı, standart dışı not listesi | MOD-07 | 🟢 | **2** |
| **G-12** | Basılı seçim tabloları | Model ↔ kapasite eşleşmeleri | MOD-08 / seçim entegrasyonu | 🔴 | **1** |
| **G-13** | Teklif arşiv klasörleri | Teklif no bazlı PDF'ler | MOD-02 arşiv | 🟡 | **2** |

---

## 2. En zor iş — G-02 Ürün ağaçları 🔴

~130 Excel sayfası. **Kör kopyalama yapılamaz**, çünkü:

- Sayfalar arası **formül bağı** var (birim fiyat Excel'i, CTP Excel'i, serpantin Excel'i)
- Kalem adları serbest metin — **stok kodu yok**, aynı malzeme farklı yazılmış olabilir
  ("Motor 15 kW" / "15kw motor" / "MOTOR 15KW")
- Bazı satırlar malzeme değil **işçilik** (adam-gün, harcırah, SGK, yemek)
- Bazı satırlar **alt ürün ağacı çağrısı** (CTP maliyeti 270 kg, serpantin maliyeti)

### Yaklaşım
```
1. Ham okuma      → 130 sayfa okunur, satırlar tek havuza toplanır
2. Kalem normalizasyonu → benzer isimler eşleştirilir, tekil malzeme listesi çıkar
3. Stok kodu ataması    → normalize listeye kod verilir (MTR-001, FAN-004…)
4. Satır sınıflandırma  → malzeme | işçilik | alt-ağaç çağrısı | dolaylı gider
5. Parametre keşfi      → CTP5 ↔ CTP6 farkları çıkarılır ("iskelet aynı, miktar değişir")
6. BOM üretimi          → parametrik taban + model bazlı sapmalar
7. Doğrulama            → her model için ERP maliyeti ≡ Excel maliyeti (tolerans 0)
```

> **Adım 5 belirleyici.** Parametrik taban kurulabilirse 130 ayrı kayıt yerine
> ~3–5 taban + model parametre tablosu olur; bakım maliyeti 10 kat düşer.
> Kurulamazsa 130 ayrı BOM girilir. Bu, Faz 1 süresini doğrudan belirler.

### Doğrulama kuralı — pazarlıksız
> Göç, **her model için ERP'nin hesapladığı toplam maliyet Excel'in hesapladığına
> birebir eşit olana kadar** tamamlanmış sayılmaz. Fark varsa Excel değil ERP düzeltilir;
> Excel'de hata bulunursa Ensotek'e raporlanır.

Bu doğrulama, Ensotek'in ERP'ye güvenmesinin tek yolu. Rakamlar tutmazsa satış ekibi
Excel'e geri döner ve proje fiilen ölür.

---

## 3. Göç sırası — bağımlılık zinciri

```
G-08 Müşteriler        (bağımsız)
   ↓
G-01 Birim fiyat + işçilik   ← ÖNCE bu; her şey buna bağlı
   ↓
G-03 CTP kg maliyeti · G-04 Serpantin   ← alt ağaçlar
   ↓
G-02 Ürün ağaçları    ← alt ağaçlar hazır olmadan girilemez
   ↓
G-12 Seçim tabloları · G-05 Pano · G-10 Şablonlar
   ↓
G-06 Teklif sayacı · G-07 ENK/ENB sayacı  ← canlıya geçişten hemen önce
   ↓
G-09 Stok · G-11 İnceleme formu · G-13 Arşiv
```

> **G-06/G-07 en sona bırakılır.** Sayaçlar canlıya geçiş anındaki son numaradan
> devralınmalı; erken alınırsa Excel'de üretilen yeni numaralarla çakışır.

---

## 4. Altyapı — sıfırdan yazılmaz

`ihracatradari.com.tr/backend/src/modules/commercial/` içinde hazır olan:
- `customer-import.ts` + `customer-import.test.ts` — müşteri içe aktarma
- `import.ts` — genel içe aktarma
- `workbook-export.ts` — Excel çalışma kitabı üretimi (ters yön: dışa aktarma)

Bunlar Ensotek ERP'nin **içe aktarma altyapısının (I-13)** tabanı olur.

Her göç işi için standart akış:
```
Yükle → Ön izleme (kaç satır, kaç hata) → Eşleştirme ekranı → Kuru çalıştırma
     → Onay → Yükleme → Rapor (kaç kayıt, kaç atlandı, neden)
```
Hiçbir göç **geri alınamaz olmaz**: her yükleme bir toplu-iş kimliği (batch id) alır ve
tümüyle geri alınabilir.

---

## 5. Kim yapacak — netleşmesi gereken tek nokta

| İş | Muhtemel sahip | Not |
|---|---|---|
| Excel dosyalarının teslimi | **Ensotek** | Tüm dosyaların güncel kopyası |
| Kalem normalizasyonu + stok kodu şeması | **Birlikte** | Ensotek malzemeyi tanır, biz yapıyı kurarız |
| İçe aktarma araçlarının yazılması | **Biz** | I-13 altyapısı |
| Doğrulama (maliyet eşitliği) | **Birlikte** | Ensotek onaylamadan model kapanmaz |
| Eksik/hatalı veri düzeltme | **Ensotek** | Excel'deki tutarsızlıklar |

> Tek açık soru: **stok kodu şemasını kim tanımlayacak** ve **normalizasyon kararlarını
> kim verecek**. Bu, göç süresini birkaç haftadan birkaç aya çıkarabilecek tek kalem.

---

## 6. Excel'in kapanması

Bir modül `ready` olduğunda, yerini aldığı Excel **aynı gün kapanır**:

| Modül açılır | Kapanan dosya |
|---|---|
| MOD-04 + MOD-03 | Ürün ağacı Excel'leri, birim fiyat Excel'i, CTP Excel'i, serpantin Excel'i |
| MOD-02 | Teklif takip Excel'i, Word teklif şablonları |
| MOD-07 | İş takip Excel'i, Word Teklif İnceleme Formu |
| MOD-05 | Stok Excel'i |
| MOD-02 arşiv | Elle oluşturulan teklif klasörleri |

**Paralel çalışma yapılmaz.** Gerekçe: veri iki yerde tutulursa ikisi de güvenilmez
hale gelir ve ERP'nin maliyet zinciri (birim fiyat → BOM → teklif → snapshot) kopar.

Geçiş güvenliği paralel çalışmayla değil, **göç doğrulamasıyla** (§2) sağlanır:
rakamlar birebir tuttuğu için Excel'e geri dönme ihtiyacı doğmaz.
