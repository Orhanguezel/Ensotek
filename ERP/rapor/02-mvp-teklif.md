# Ensotek ERP — Birinci Faz Teklifi

**Teklifi veren:** GZL Teknoloji · **Müşteri:** Ensotek · **İlgili:** Sn. Hamdi Bey
**Belge:** ERP-2026-001 · R0 · 18.08.2026 · **Geçerlilik:** 30 gün

> Görsel sürüm (PDF'e dönüşecek): https://claude.ai/code/artifact/1e3d06b0-a54a-44a5-8711-b0d4aecfcf29
> Kaynak dosya: [teklif.html](teklif.html)

| | |
|---|---|
| **Aşama** | 3 — her biri teslimli |
| **Süre** | 3 ay |
| **Bedel** | **120.000 ₺ + KDV** |
| **Ödeme** | 3 × 40.000 ₺ + KDV, her aşama teslimi ve onayı sonrası |

---

## Bu fazın kapsamı neden burası

Ensotek'te en çok zaman kaybettiren üç iş: **teklif hazırlamak**, **maliyet analizi
çıkarmak**, **teklifi gönderip takip etmek**. Üçü de aynı zincirde ve aynı Excel
dosyalarına bağlı.

Ayrıca teknik zorunluluk: maliyet hesabı kurulmadan malzeme planlaması, üretim takibi ve
kârlılık analizi anlam ifade etmez. Temel önce atılır.

---

## Aşama 01 · Temel ve Ürün Ağacı — 1. Ay

- Sistem kurulumu, güvenli giriş, kullanıcı ve yetki tanımları
- Müşteri ve firma kartları; talep kaydı (e-posta, telefon, WhatsApp)
- Ürün ve malzeme kartları, **stok kodu düzeninin kurulması**
- Birim fiyat yönetimi — malzeme fiyatları ve işçilik (adam-gün, harcırah, sigorta, yemek)
- **Çok katmanlı ürün ağacı** — CTP gövde kilogram bazlı, serpantin alt reçetesi, fire payı
- Üç örnek modelin ürün ağacının sisteme girilmesi

**Teslim ölçütü:** Üç modelin maliyeti mevcut Excel'in hesapladığıyla **birebir aynı**.
**Ödeme:** 40.000 ₺ + KDV

---

## Aşama 02 · Maliyet Motoru ve Teklif — 2. Ay

- Ürün ağacından otomatik maliyet hesabı; malzeme / işçilik / dolaylı gider katmanları
- Çarpan, pazarlık payı ve Euro kuru ile teklif fiyatının oluşması
- **Teklif anı maliyetinin dondurulması** — teklif anı, güncel ve fark aynı ekranda
- Teklif hazırlama ekranı, revizyon yönetimi, standart dışı özelliklerin kırmızı işaretlenmesi
- Kapsam ve opsiyon kalemleri — pano, su şartlandırma, süpervizörlük, nakliye, vinç
- **Üç ayrı belge:** teknik teklif · ticari teklif · iç maliyet raporu
- E-posta ile gönderim, teklif arşivinin kendiliğinden oluşması

**Teslim ölçütü:** Gerçek bir kule teklifi baştan sona sistemde hazırlanır, üç belgesi
üretilir ve müşteriye gönderilir.
**Ödeme:** 40.000 ₺ + KDV

---

## Aşama 03 · Veri Aktarımı ve Devreye Alma — 3. Ay

- Tüm kule modellerinin ürün ağaçlarının aktarılması
- Birim fiyat, CTP maliyet, serpantin maliyet ve pano fiyat listeleri
- Müşteri listesi ve açık tekliflerin aktarılması
- Teklif takip zaman çizelgesi ve **müşteriye özel teklif bağlantısı**
- **Doğrulama:** her model için sistem maliyeti ile Excel maliyetinin karşılaştırılması
- Kullanıcı eğitimi, sunucu kurulumu, yedekleme

**Teslim ölçütü:** Her modelde sistem maliyeti Excel'e eşit; teklif ve maliyet Excel'leri
kapatılır, sistem canlı kullanımdadır.
**Ödeme:** 40.000 ₺ + KDV

---

## Bu fazın dışında kalanlar

Sistemin genel planının parçası, bu teklifin kapsamında değil — sonraki fazlarda ayrıca
teklif edilir:

Üretim ve iş emirleri · Malzeme ihtiyaç planlama · Satın alma · Kalite kontrol ·
Sevkiyat · Navlun ve lojistik · İhracat ve gümrük · Personel yönetimi · Fabrika yönetimi ·
Bakım yönetimi · Süpervizörlük ve servis · Fuar yönetimi · Firma bulma · Muhasebe ve cari ·
Yönetim raporları

---

## Ensotek'in katkısı

Üç aylık takvim bunlara bağlıdır:

1. **Excel dosyalarının teslimi** — üç örnek ürün ağacı, birim fiyat, CTP maliyet, serpantin maliyet, pano fiyat listesi *(sözleşme başlangıcında)*
2. **Belge şablonları** — Word teklif şablonu ve Teklif İnceleme Formu
3. **Malzeme eşleştirme ve stok kodu onayı** *(birlikte)*
4. **Maliyet doğrulama onayı** — her modelin maliyetinin Ensotek tarafından onaylanması
5. **Kullanıcı ve yetki listesi**
6. **Haftada bir görüşme** — yaklaşık bir saat

---

## Koşullar

- Fiyatlara KDV dahil değildir. Geçerlilik 30 gün.
- Kaynak kod ve tüm veri **Ensotek'e aittir**.
- Teslimden sonra **bir ay hata düzeltme desteği** ücretsizdir.
- Kapsam dışı yeni talepler takvimi etkilemez; sonraki fazda planlanır.
- Hazır olmayan bölüm sistemde **görünmez** — "yakında" yazan ekran olmaz.
- Bir bölüm devreye alındığında yerini aldığı Excel kapanır; güvence maliyet
  doğrulamasıyla sağlanır.

---

## İç not — bu bölüm müşteriye gitmez

> İç program planımızda ([PROGRAM-PLANI.md](../PROGRAM-PLANI.md)) S1 kapsamı
> **185–326 adam-gün** olarak tahmin edilmişti. Bu teklifte kapsam üç aya sığacak şekilde
> daraltıldı:
>
> **Çıkarılanlar:** parametrik model türetme altyapısı (modeller kopyala-türet ile
> girilecek), maliyet onay sistemi, fiyat simülasyonu, çok dilli çıktı, kule seçim
> yazılımı entegrasyonu, gerçekleşen maliyet karşılaştırması *(veri Faz 1'den itibaren
> toplanıyor ama ekran sonraki fazda)*.
>
> **Takvimi belirleyen tek kalem:** 130 modelin ürün ağacı göçü. Excel dosyaları
> görülmeden bu daralmaz. Parametrik taban kurulamazsa Aşama 03 sıkışır — bu durumda
> "tüm modeller" yerine **en çok satan modellerle** çıkılıp kalanı sonraki faza bırakmak
> gerekir. Sözleşmede model sayısına üst sınır konulması önerilir.
