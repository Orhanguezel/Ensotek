# Ensotek ERP — Sistem Planı ve Teklif

**Teklifi veren:** GZL Teknoloji · **Müşteri:** Ensotek · **İlgili:** Sn. Hamdi Yağar
**Belge:** ERP-2026-001 · R0 · 18.08.2026 · **Geçerlilik:** 30 gün

> Görsel sürüm (PDF'e dönüşecek): https://claude.ai/code/artifact/1e3d06b0-a54a-44a5-8711-b0d4aecfcf29
> Kaynak dosya: [teklif.html](teklif.html)

| | |
|---|---|
| **Kapsam** | 24 bölüm · 6 grup · **3 faz** — tamamı bu teklife dahil |
| **Süre** | **4 ay** — Faz 1 ve 2 birer buçuk ay, Faz 3 bir ay |
| **Bedel** | **120.000 ₺ + KDV** |
| **Ödeme** | **3 × 40.000 ₺ + KDV** — her faz teslimi ve onayı sonrası |

---

## Bu fazın kapsamı neden burası

Ensotek'te en çok zaman kaybettiren üç iş: **teklif hazırlamak**, **maliyet analizi
çıkarmak**, **teklifi gönderip takip etmek**. Üçü de aynı zincirde ve aynı Excel
dosyalarına bağlı.

Ayrıca teknik zorunluluk: maliyet hesabı kurulmadan malzeme planlaması, üretim takibi ve
kârlılık analizi anlam ifade etmez. Temel önce atılır.

---

## Faz 1 · Satış ve Maliyet Omurgası — 1.–6. hafta · 40.000 ₺ + KDV

**Grup A** (Talep/Müşteri · Teklif · Maliyet · Ürün Ağacı) + **Sistem Yönetimi** — 5 bölüm

- Sistem kurulumu, güvenli giriş, kullanıcı ve yetki tanımları
- Müşteri ve firma kartları; talep kaydı (e-posta, telefon, WhatsApp)
- Ürün ve malzeme kartları, **stok kodu düzeninin kurulması**
- Birim fiyat yönetimi — malzeme fiyatları ve işçilik (adam-gün, harcırah, sigorta, yemek)
- **Çok katmanlı ürün ağacı** — CTP gövde kilogram bazlı, serpantin alt reçetesi, fire payı
- Üç örnek modelin ürün ağacının sisteme girilmesi



---

### Faz 1 içeriği — maliyet ve teklif

- Ürün ağacından otomatik maliyet hesabı; malzeme / işçilik / dolaylı gider katmanları
- Çarpan, pazarlık payı ve Euro kuru ile teklif fiyatının oluşması
- **Teklif anı maliyetinin dondurulması** — teklif anı, güncel ve fark aynı ekranda
- Teklif hazırlama ekranı, revizyon yönetimi, standart dışı özelliklerin kırmızı işaretlenmesi
- Kapsam ve opsiyon kalemleri — pano, su şartlandırma, süpervizörlük, nakliye, vinç
- **Üç ayrı belge:** teknik teklif · ticari teklif · iç maliyet raporu
- E-posta ile gönderim, teklif arşivinin kendiliğinden oluşması



---

### Faz 1 içeriği — veri aktarımı ve devreye alma

- **En çok kullanılan otuz kule modelinin** ürün ağaçlarının aktarılması
- Birim fiyat, CTP maliyet, serpantin maliyet ve pano fiyat listeleri
- Müşteri listesi ve açık tekliflerin aktarılması
- Teklif takip zaman çizelgesi ve **müşteriye özel teklif bağlantısı**
- **Doğrulama:** her model için sistem maliyeti ile Excel maliyetinin karşılaştırılması
- Kullanıcı eğitimi, sunucu kurulumu, yedekleme

**Teslim ölçütü:** Aktarılan her modelde sistem maliyeti Excel'e eşit; teklif ve maliyet Excel'leri
kapatılır, sistem canlı kullanımdadır.
**Ödeme:** 40.000 ₺ + KDV

---

## Faz 2 · Malzeme, Üretim ve Sevkiyat — 7.–12. hafta · 40.000 ₺ + KDV

**Grup B + C + D** — 10 bölüm

### B · Malzeme ve Tedarik
- **05 Ürün ve Stok Yönetimi** — ürün tipleri, stok kodu sistemi, yedek parça ve yarı
  mamul satışı, giriş-çıkış hareketleri, mal kabul, kritik stok uyarısı, birim dönüşümleri
- **06 Malzeme İhtiyaç Planlama** — açık işlerin ürün ağaçları toplu çözülür; stokta olan,
  rezerve ve eksik ayrışır; **net ihtiyaç listesi otomatik çıkar**; hangi malzeme hangi
  hafta gerekecek; tedarik süresine göre "bugün sipariş verilmeli" uyarısı
- **07 Satın Alma** — tedarikçi kartları, kalem bazında termin, sipariş takibi,
  **alış fiyatlarının maliyet kartını beslemesi**, tedarikçi fiyat geçmişi

### C · İş ve Üretim
- **08 Sipariş ve Üretime Teslim** — tek adımda işe dönüşüm, **ENK/ENB iş numarası**
  (mevcut Excel sıranızdan devam), ödeme planı, **avans kontrolü**, Teklif İnceleme
  Formu'nun dijitali, elden evrak taşımanın kalkması, iş atama
- **09 Mühendislik** — genel görünüş projesi ve çizimlerin projeye bağlanması,
  **müşteriye sorulan teknik soruların kaydı**, malzeme listesinin ürün ağacından
  üretilmesi, **mevcut kule seçim programının sisteme bağlanması**
- **10 Üretim ve İş Emirleri** — kaynak/polyester/montaj/metal atölyelerine iş emri,
  mevcut yönlendirme mantığınızın korunması, atölye tamamlandı bildirimi,
  **planlanan↔gerçekleşen süre**, fire, vardiya takibi, duruş nedenleri,
  malzemenin işe zimmetlenmesi
- **11 Kalite Kontrol** — serpantin basınç testi, galvaniz sevk/dönüş, dönüşte tekrar
  test, test formu ve ölçüm değerleri, fotoğraf, rapor

### D · Sevkiyat ve İhracat
- **12 Sevkiyat** — paket/demonte ayrımı, toparlama-paletleme-streçleme-çuvallama kaydı,
  yükleme listesi, araç/konteyner bilgisi, **sevkiyat öncesi tahsilat kontrolü**,
  irsaliye ve fatura adımı
- **13 Navlun ve Lojistik** — hacim ve ağırlık hesabı, **TIR/konteyner sığdırma**,
  kara/deniz/hava navlun tahmini, teslim şekli (EXW/FOB/CIF), **nakliyeciden fiyat isteme**,
  navlunun teklife ve maliyete yansıması
- **14 İhracat ve Gümrük** — **GTİP kodu ve menşe**, ihracat evrak seti
  (menşe şahadetnamesi, **ATR / EUR.1**, fatura, çeki listesi), ödeme şekli takibi
  (**akreditif** dahil), gümrük beyanname referansı, ülke bazlı belge kontrol listesi

---

## Faz 3 · Fabrika, İnsan ve Ticaret — 13.–16. hafta · 40.000 ₺ + KDV

**Grup E + F** — 9 bölüm

### E · Fabrika ve İnsan
- **15 Fabrika Yönetimi** — atölye kapasitesi, iş yükü dağılımı, üretim planı,
  **darboğaz görünümü**, termin hesabı ve gecikme uyarısı, planlanan↔gerçekleşen sapma
- **16 Personel Yönetimi** — personel kartı, vardiya ve devam, evrak ve belge süreleri,
  atama ve kişi başı iş yükü, **adam-gün maliyetinin gerçek personel verisine bağlanması**
- **17 Bakım Yönetimi** — makine/ekipman envanteri, **periyodik bakım planı ve hatırlatma**,
  arıza ve duruş kaydı, bakım maliyetinin genel giderlere yansıması
- **18 Süpervizörlük ve Servis** — görevlendirme, seyahat ve konaklama planı, saha raporu
  ve müşteri onayı, kurulum/devreye alma, **garanti takibi ve hatırlatma**, servis geçmişi,
  seri numarası kaydı

### F · Ticaret ve Yönetim
- **19 Fuar Yönetimi** — fuar takvimi, stand ve bütçe, **fuarda görüşülen firmaların
  yerinde kaydı**, fuar sonrası takip, fuardan gelen işin izlenmesi, **fuar gideri ↔
  gelen iş karşılaştırması**
- **20 Firma Bulma** — soğutma kulesi kullanan tesislerin araştırılması, firma bilgisi
  zenginleştirme ve **karar verici tespiti**, uygunluk önceliklendirmesi, tek adımda
  talebe dönüşüm
- **21 Satış Yönetimi** — satış hattı, **kayıp nedeni analizi**, satış mühendisi bazında
  portföy, kazanma oranı ve hedef, müşteri bazında satış geçmişi
- **22 Muhasebe ve Cari** — cari hesaplar, ödeme planı ve vade, avans/tahsilat/bakiye,
  fatura-irsaliye ve **e-fatura bağlantısı**, kur farkı, **proje bazlı gerçekleşen maliyet
  ve kârlılık**
- **23 Yönetim Paneli ve Raporlar** — açık teklif, devam eden üretim, sevk bekleyen,
  **geciken iş**, aylık satış ve kârlılık grafikleri, atölye ve personel performansı,
  Excel'e aktarım

> **24 Sistem Yönetimi** Faz 1'de kurulur: kullanıcı, rol ve yetkiler, işlem geçmişi,
> doküman arşivi, bildirimler, yedekleme.

**Faz 3 teslim ölçütü:** Atölye kapasitesi, personel, bakım ve servis kayıtları sistemde;
cari, tahsilat ve fatura akışı ile yönetim raporları çalışır durumda. **24 bölümün tamamı
devrede.**
**Ödeme:** 40.000 ₺ + KDV

---

## Toplam

| Faz | Bölüm | Süre | Bedel |
|---|---:|---:|---:|
| Faz 1 · Satış ve Maliyet Omurgası | 5 | 1.–6. hafta | 40.000 ₺ |
| Faz 2 · Malzeme, Üretim ve Sevkiyat | 10 | 7.–12. hafta | 40.000 ₺ |
| Faz 3 · Fabrika, İnsan ve Ticaret | 9 | 13.–16. hafta | 40.000 ₺ |
| **Toplam · KDV hariç** | **24** | **4 ay** | **120.000 ₺** |

---

## Hiçbir fazın kapsamında olmayanlar

- **Yasal mali işlemler** — defter tutma, beyanname, mali müşavirlik
- **Bordro ve SGK hesaplama** — personel yönetimi var, bordro motoru yok
- **Prim ve komisyon hesabı** — görüşmede kapsam dışı bırakıldı
- **Termal seçim hesabı** — mevcut seçim programı bağlanır, sıfırdan yazılmaz
- **Teknik çizim yapma** — çizimler bağlanır ve saklanır, sistemde çizim yapılmaz
- **Muhasebe programıyla çift yönlü canlı bağlantı** — veri aktarım dosyası üretilir
- **Mağaza mobil uygulaması** — sistem tarayıcıdan telefon/tablette çalışır
- **Yabancı dil arayüz** — arayüz ve belgeler Türkçe
- **Otuz modelin ötesindeki ürün ağaçları** — kalanlar aynı yapıyla sonradan eklenir

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
- Her faz teslimini takip eden **bir ay hata düzeltme desteği** ücretsizdir.
- Bu teklif **üç fazın tamamını** kapsar: 24 bölüm, **4 ay**, 120.000 ₺ + KDV.
- Faz süreleri iş yüküne göre dağıtıldı: Faz 1 ve Faz 2 birer buçuk ay, Faz 3 bir ay.
  Süreler sözleşme başlangıcından itibaren işler.
- Ödeme **teslim ve onay sonrası**. Onaylanmayan faz için ödeme talep edilmez.
- Faz 1'de **en çok kullanılan otuz kule modelinin** ürün ağacı aktarılır.
- Bir fazın kapsamı, o faz altında listelenen bölümler ve maddelerle **sınırlıdır**.
  Kapsam dışı yeni talepler takvimi ve bedeli etkilemez; ayrı çalışma olarak planlanır.
- Ensotek kaynaklı gecikmelerde teslim tarihleri aynı süre kadar ötelenir.
- Hazır olmayan bölüm sistemde **görünmez** — "yakında" yazan ekran olmaz.
- Bir bölüm devreye alındığında yerini aldığı Excel kapanır; güvence maliyet
  doğrulamasıyla sağlanır.

---

## İç not — bu bölüm müşteriye gitmez

> İç program planımızda ([PROGRAM-PLANI.md](../PROGRAM-PLANI.md)) S1 kapsamı
> **185–326 adam-gün** olarak tahmin edilmişti. Bu teklifte Faz 1 üç aya sığacak şekilde
> daraltıldı:
>
> **Çıkarılanlar:** parametrik model türetme altyapısı (modeller kopyala-türet ile
> girilecek), maliyet onay sistemi, fiyat simülasyonu, çok dilli çıktı, kule seçim
> yazılımı entegrasyonu, gerçekleşen maliyet karşılaştırması *(veri Faz 1'den itibaren
> toplanıyor ama ekran sonraki fazda)*.
>
> **2026-08-18 fiyat ve süre kararı:** üç fazın tamamı 120.000 ₺ + KDV, **4 ay**,
> 3 × 40.000 ₺. Ek ay Faz 1 ve Faz 2'ye dağıtıldı (1,5 + 1,5 + 1); Faz 2 on bölümle
> en yüklü faz, Faz 1 ise teknik olarak en ağırı (maliyet motoru + BOM + veri göçü).
> İç program planındaki tahmin 452–771 adam-gündü; bu, adam-gün başına ~155–265 ₺ demek.
> Karar Orhan'ındır ve teklife böyle işlendi. Karşılığında belgeye **üç koruma** konuldu:
> 1. **"Hiçbir fazın kapsamında olmayanlar"** bölümü — 9 kalem yazılı sınır
> 2. **Otuz model** sınırı — açık uçlu "tüm modeller" taahhüdü kaldırıldı
> 3. **"Bir fazın kapsamı o faz altında listelenen maddelerle sınırlıdır"** maddesi +
>    Ensotek kaynaklı gecikmede takvimin ötelenmesi
>
> Sabit bedelli işte tek savunma kapsam sınırıdır; bu üç madde sözleşmeye aynen geçmelidir.
>
> **Faz eşlemesi:** teklifteki Faz 1 = iç plandaki S1. Teklifteki Faz 2 = iç plandaki
> S2 + S3. Teklifteki Faz 3 = iç plandaki S4 + S5. İç plandaki 24 modül kodu ile
> teklifteki 24 bölüm birebir örtüşür.
