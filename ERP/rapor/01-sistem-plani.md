# Ensotek ERP
## Sistem Kapsamı ve Aşama Planı

**Hazırlayan:** Güzel Web Design
**Tarafınıza:** Ensotek — Sn. Hamdi Bey
**Tarih:** 18 Ağustos 2026
**Belge:** Sistem planı — v1.0

---

## 1. Bu belge ne anlatıyor

Yaptığımız görüşmede Ensotek'in tekliften sevkiyata kadar olan tüm çalışma biçimini
ayrıntılı olarak anlattınız. Bu belge, o anlatımın karşılığı olan sistemi tarif ediyor:

- Sistemin hangi bölümlerden oluşacağı
- Her bölümün ne yapacağı
- Hangi bölümün ne zaman devreye gireceği
- İlk aşamada Ensotek'te somut olarak neyin değişeceği
- Sizden ne beklediğimiz

Teknik ayrıntı yoktur; her bölüm **işin dilinde** anlatılmıştır.

---

## 2. Bugün nasıl çalışıyorsunuz

Anlattıklarınızdan çıkan tablo şu:

| Alan | Bugün |
|---|---|
| Teklif numarası | Excel'den sıra numarası |
| İş numarası | Excel'den — küçük iş ve malzeme **ENK**, büyük iş **ENB** |
| Kule seçimi | Basılı seçim tabloları + ayrı bir web programı |
| Teklif | Word veya Excel şablonu |
| Ürün ağaçları | Excel — açık tipte yaklaşık 100, kapalı tipte 30–40 model |
| Birim fiyatlar | Ayrı bir Excel; ürün ağaçları fiyatı oradan okuyor |
| Serpantin maliyeti | Ayrı Excel — model ve kat sayısına göre |
| CTP maliyeti | Ayrı Excel — kilogram başına maliyet |
| Pano fiyatı | Ayrı Excel, otomasyoncu hesaplıyor |
| Fiyatlandırma | Maliyet × çarpan × pazarlık payı × Euro kuru |
| Teklif İnceleme Formu | Word — çıktısı elden imalata teslim ediliyor |
| Stok kodu | Yok |
| Stok takibi | Gözle; bazı kalemler Excel'de |
| Arşiv | Teklif numarası adlı klasörde PDF'ler |
| Teklif takibi | Elle, "ara ara" |

Sistem çalışıyor — ancak **her halka insan eliyle bir sonrakine bağlanıyor.** Bir dosyadaki
değişiklik diğerine kendiliğinden yansımıyor, bilgi kişilerin hafızasında duruyor ve aynı
veri birden çok yere yeniden giriliyor.

Kendi ifadenizle en çok zaman kaybettiğiniz işler:

1. **Teklif hazırlamak**
2. **Maliyet analizi çıkarmak**
3. **Teklifi göndermek ve takip etmek**
4. **Malzeme listesi oluşturmak** — "uzun zaman alıyor"
5. **İş emirlerini hazırlayıp dağıtmak**
6. Evrak işleri ve servis takibi

Aşama planımız doğrudan bu sıraya göre kuruldu.

---

## 3. Sistemin temel fikri

> **Her iş, müşteriden gelen talepten garanti süresinin sonuna kadar tek bir proje
> dosyası içinde yaşar.**

Bugün bir işin izi teklif klasöründe, iş takip Excel'inde, imalattaki kâğıt dosyada,
sevkiyat evrakında ve satış mühendisinin hafızasında ayrı ayrı duruyor.

Yeni sistemde tek bir proje kartına girdiğinizde şunların **hepsini** aynı ekranda
görürsünüz:

Müşteri · Gelen talep · Teklifler ve revizyonlar · Maliyet analizi · Teknik ve ticari
PDF'ler · Ürün ağacı · Malzeme listesi · Satın alma durumu · İş emirleri · Üretim
ilerlemesi · Kalite testleri · Fotoğraflar · Sevkiyat · Fatura ve tahsilat · Kurulum ·
Süpervizör raporları · Servis kayıtları · Garanti

Bilgi tek yerde durduğu için, bir satış mühendisi izinli olduğunda başka bir arkadaşınız
projeyi dakikalar içinde devralabilir.

---

## 4. Sistem bölümleri ve kapsamları

Sistem **24 bölümden** oluşur. Aşağıda her birinin ne yapacağı anlatılmıştır.

---

### A · SATIŞ VE TEKLİF

#### 1. Talep ve Müşteri Yönetimi
Müşteriden gelen her talebin kaydı buradan başlar.

- Talep kanalı: e-posta, telefon, WhatsApp
- Talep tipi: soğutma kulesi veya yedek malzeme
- Talebin bir satış mühendisine atanması
- Müşteri ve firma kartı, yetkili kişiler, iletişim bilgileri
- Gelen talebin yazışması ve ekleri talep kaydına bağlanır
- Görüşme notları, hatırlatmalar ve takip zaman çizelgesi

#### 2. Teklif Yönetimi
Teklifin hazırlanmasından müşteriye ulaşmasına ve takibine kadar tüm süreç.

- Teklif numarası ve revizyon numarası otomatik verilir
- Model seçildiğinde ölçü, ağırlık ve standart donanım kendiliğinden gelir
- Sıcaklıklar, debiler ve kapasite değerleri projeye göre girilir
- **Standart dışı özellikler kırmızı olarak işaretlenir** — bugünkü yönteminiz korunur
- Kapsam kalemleri: nakliye kimde, kurulum kimde, vinç kimde
- Ek kalemler: pano, su şartlandırma, süpervizörlük, devreye alma
- Süpervizörlük şartları teklife yazılır (personel sayısı, süre, konaklama)
- **Üç ayrı belge üretilir:**
  - **Teknik teklif** — yalnız teknik bilgiler, fiyat yok
  - **Ticari teklif** — fiyat, ödeme, teslim, garanti şartları
  - **İç maliyet raporu** — yalnız Ensotek görür, müşteriye gitmez
- İstenirse teknik ve ticari tek belgede birleştirilir
- Teklif e-posta ile gönderilir
- **Teklif klasörü kendiliğinden oluşur:** gelen talep, gönderilen mail, teklif PDF'i,
  maliyet PDF'i ve revizyonlar teklif numarası altında toplanır
- **Müşteri teklif bağlantısı:** müşteri kendisine gönderilen bağlantıdan teklifi açar;
  görüntülediği, kabul ettiği veya revizyon istediği anında size düşer

#### 3. Maliyet Yönetimi
Sistemin en önemli bölümü. Bugün Excel'de yaptığınız işin tamamı buraya taşınır.

- Ürün ağacındaki her kalemin maliyeti otomatik hesaplanır
- Malzeme birim fiyatları tek bir yerde tutulur, tüm ürün ağaçları oradan okur
- İşçilik maliyeti: adam-gün, harcırah, sigorta, yemek
- Maliyet üç katmanda gösterilir: **malzeme · işçilik · dolaylı giderler**
- Çarpan ve pazarlık payı girilir, Euro kuru sisteme okunur, teklif fiyatı çıkar
- **Teklif anı maliyeti dondurulur:** teklifi müşteriye gönderdiğiniz gündeki tüm birim
  fiyatlar ve toplamlar kaydedilir, sonradan değişmez
- Aynı ekranda üç sütun görürsünüz:
  **teklif anındaki maliyet · bugünkü maliyet · gerçekleşen maliyet**
- Sistem uyarır: *"Bu teklif hazırlandığından beri maliyet %9,8 arttı."*
- Farklı kâr oranı senaryoları anında karşılaştırılır
- Toplu fiyat değişikliklerinde (örneğin CTP kilogram maliyeti) kaç ürünün etkileneceği
  gösterilir ve yönetici onayı istenir

#### 4. Ürün Ağacı (Reçete)
Kulelerinizin malzeme ve işçilik yapısı.

- Her model için ürün ağacı: CTP1–CTP30 ve hücre çeşitlemeleri, kapalı tip modeller
- **Çok katmanlı yapı:** CTP-5'in ağacında *"CTP gövde — 270 kg"* satırı yer alır;
  CTP gövdenin kendi reçetesi ayrıca sistemde durur ve kilogram maliyeti oradan gelir
- Serpantin ayrı bir yarı mamul olarak tanımlanır; model ve kat sayısına göre kendi
  reçetesi vardır ve kapalı kule ağacına tek kalem olarak girer
- Modeller arası benzerlik korunur — aynı iskelet, değişen miktarlar
- İşçilik satırları ürün ağacının parçasıdır
- Fire payı kalem bazında tanımlanır
- Standart ürün ağacı ile projeye özel ağaç ayrılır: bir projede motor değişirse standart
  ağaç bozulmaz
- Ürün ağacı revizyonları kayıt altındadır: kim, ne zaman, neyi değiştirdi

---

### B · MALZEME VE TEDARİK

#### 5. Ürün ve Stok Yönetimi
- Ürün tipleri: bitmiş kule, yarı mamul, hammadde, ticari mal, hizmet
- **Stok kodu sistemi kurulur** — bugün olmayan yapı, birlikte oluşturulur
- Yedek parça ve yarı mamul satışı (motor, fan, redüktör, havuz, serpantin)
- Stok giriş-çıkış hareketleri ve mal kabul
- Kritik stok seviyesi ve azalma uyarısı
- Birim tanımları ve dönüşümleri: kilogram, adet, metrekare, metre, adam-gün

#### 6. Malzeme İhtiyaç Planlama
Bugün "uzun zaman alıyor" dediğiniz malzeme listesi işinin karşılığı.

- Açık işlerin ürün ağaçları toplu olarak çözülür
- Stokta olan, rezerve edilmiş ve eksik miktarlar ayrıştırılır
- **Net ihtiyaç listesi otomatik çıkar**
- Hangi malzemenin hangi hafta gerekeceği gösterilir
- Tedarik süresi dikkate alınarak *"bu siparişin bugün verilmesi gerekiyor"* uyarısı verilir
- Eksik kalemler doğrudan satın alma önerisine dönüşür

#### 7. Satın Alma
- Tedarikçi kartları ve iletişim bilgileri
- Satın alma siparişi ve kalem bazında termin tarihi
- Sipariş takibi: verildi, yolda, teslim alındı
- **Alış fiyatları maliyet kartını besler** — bir sonraki teklifte güncel fiyat kullanılır
- Tedarikçi bazında fiyat geçmişi

---

### C · İŞ VE ÜRETİM

#### 8. Sipariş ve Üretime Teslim
Teklifin işe dönüşmesi ve imalata devri.

- Teklif tek adımda işe dönüşür
- **ENK / ENB iş numarası** verilir — mevcut Excel sıranızdan devam eder
- Ödeme planı kaydedilir
- **Avans kontrolü:** avans isteniyorsa, ödeme gelmeden "üretime başlat" açılmaz
- **Teklif İnceleme Formu dijitalleşir:** ürün, iş numarası ve standart dışı notlar
  (termistörlü motor, nakliye bizden, boru çapı, süpervizör konaklaması) sistemde durur
- Elden evrak taşımak ortadan kalkar — imalat ofisi işi ekranından görür
- İmalat müdürü işi bir mühendise atar; kimin üzerinde kaç iş olduğu görülür

#### 9. Mühendislik
- Genel görünüş projesi ve teknik çizimler projeye bağlanır, sürümleri korunur
- **Müşteriye sorulan teknik sorular ve cevapları kayıt altına alınır**
  (örneğin *"su çıkışı pompaya mı bağlanacak, yerçekimi ile mi akacak?"*) — yıllar sonra
  neden o çapın seçildiği görülebilir
- Malzeme listesi ürün ağacından üretilir
- Mevcut kule seçim programınız sisteme bağlanır; aynı bilgiler iki kez girilmez

#### 10. Üretim ve İş Emirleri
- İş emri atölyelere dağıtılır: kaynak, polyester, montaj, metal
- Yönlendirme mantığınız korunur: yarı mamuller stokta ise doğrudan montaja, değilse
  polyestere; kapalı kulede serpantin yoksa önce kaynak atölyesine
- Her atölye kendi işini ekranda görür ve tamamladığını işaretler
- Planlanan ve gerçekleşen süre karşılaştırılır
- Fire miktarı kaydedilir
- Vardiya bazlı üretim takibi ve duruş nedenleri
- Malzemenin depodan çekilmesi işe zimmetlenir — hangi projede hangi motor kullanıldı,
  yıllar sonra bulunur

#### 11. Kalite Kontrol
- Serpantin basınç testi kaydı
- Galvaniz sevk ve dönüş takibi
- Galvaniz dönüşü tekrar test
- Test formları, ölçüm değerleri, fotoğraf, personel ve tarih
- Test raporu ve belgelerin projeye bağlanması

---

### D · SEVKİYAT VE İHRACAT

#### 12. Sevkiyat
- Paket tip ve demonte sevk ayrımı
- Demonte işlerde toparlama, paletleme, streçleme, çuvallama kaydı
- Yükleme listesi, palet ve koli sayısı, araç veya konteyner bilgisi, fotoğraf
- **Sevkiyat öncesi tahsilat kontrolü** — ödeme şartlıysa sistem uyarır
- İrsaliye ve fatura adımı süreçte yer alır

#### 13. Navlun ve Lojistik
- Kule ve parçaların hacim, net ve brüt ağırlık hesabı
- Kamyon, TIR veya konteynere sığdırma hesabı
- Karayolu, deniz ve hava için navlun tahmini
- Teslim şekli (EXW, FOB, CIF vb.) seçimi ve teklife yansıması
- Nakliyeciden fiyat isteme ve gelen tekliflerin karşılaştırılması
- Navlun maliyetinin teklife kalem, maliyete gider olarak girmesi

#### 14. İhracat ve Gümrük
- Ürün kartında GTİP kodu ve menşe bilgisi
- İhracat evrak seti: menşe şahadetnamesi, ATR / EUR.1, fatura, çeki listesi
- Ödeme şekli takibi: peşin, mal mukabili, vesaik mukabili, akreditif
- Gümrük beyanname referansı ve dosyaların projeye bağlanması
- Ülke bazında istenen belge ve sertifikaların kontrol listesi

---

### E · FABRİKA VE İNSAN

#### 15. Fabrika Yönetimi
- Atölye kapasitesi tanımı ve iş yükü dağılımı
- Hangi işin hangi atölyede, ne zaman yapılacağı — üretim planı
- Darboğaz görünümü: hangi atölye tıkalı
- Termin tarihi hesabı ve gecikme uyarısı
- Planlanan ile gerçekleşen sürenin atölye bazında karşılaştırılması

#### 16. Personel Yönetimi
- Personel kartı: görev, departman, atölye
- Vardiya ve devam takibi
- Personel evrakı ve belge süreleri
- İşe ve projeye atama, kişi başına iş yükü
- **Adam-gün maliyetinin gerçek personel verisine bağlanması** — ürün ağacındaki
  adam-gün tahmininin tutup tutmadığı ölçülebilir hale gelir

#### 17. Bakım Yönetimi
- Fabrika makine ve ekipman envanteri
- Periyodik bakım planı ve hatırlatma
- Arıza kaydı ve duruş süresi
- Bakım maliyetinin genel giderlere yansıması

#### 18. Süpervizörlük ve Servis
- Süpervizör görevlendirme, seyahat ve konaklama planı
- Saha raporu, fotoğraf ve müşteri onayı
- Kurulum ve devreye alma kayıtları
- Garanti başlangıç ve bitiş takibi, süre dolmadan hatırlatma
- Servis talepleri ve arıza geçmişi — kule yıllar sonra arandığında tüm geçmişi açılır
- Kullanılan motor, fan, redüktör ve seri numaraları kayıtlıdır

---

### F · TİCARET VE YÖNETİM

#### 19. Fuar Yönetimi
- Katılınacak fuarların takvimi, stand ve bütçe bilgisi
- Fuarda görüşülen firmaların yerinde kaydı
- Fuar sonrası takip: hangi firma kim tarafından, ne zaman aranacak
- Fuardan gelen tekliflerin ve siparişlerin izlenmesi
- Fuar gideri ile fuardan gelen işin karşılaştırılması

#### 20. Firma Bulma
- Soğutma kulesi kullanan tesislerin araştırılması ve listelenmesi
- Firma bilgilerinin zenginleştirilmesi ve karar vericinin tespiti
- Ensotek'e uygunluk açısından önceliklendirme
- Uygun bulunan firmanın tek adımda talebe veya müşteri kaydına dönüşmesi

#### 21. Satış Yönetimi
- Satış hattı: talep, teklif, görüşme, kazanıldı veya kaybedildi
- Kayıp nedenlerinin kaydı ve analizi
- Satış mühendisi bazında portföy ve aktivite
- Kazanma oranı, satış hedefi ve gerçekleşme
- Müşteri bazında satış geçmişi ve tekrar satış fırsatları

#### 22. Muhasebe ve Cari
- Müşteri ve tedarikçi cari hesapları
- Ödeme planı ve vade takibi
- Avans, tahsilat ve bakiye
- Fatura ve irsaliye; e-fatura bağlantısı
- Euro bazlı teklif ile TL maliyet arasındaki kur farkı
- **Proje bazlı gerçekleşen maliyet ve kârlılık:** teklif fiyatı ile gerçekte harcanan
  arasındaki fark, nedenleriyle birlikte

#### 23. Yönetim Paneli ve Raporlar
- Açık teklifler, devam eden üretimler, sevk bekleyenler, geciken işler
- Aylık satış ve kârlılık grafikleri
- Atölye ve personel performansı
- Tüm listelerin Excel'e aktarılabilmesi

#### 24. Sistem Yönetimi
- Kullanıcılar, roller ve yetkiler — her departman yalnız kendi ekranını görür
- İşlem geçmişi: kim, ne zaman, neyi değiştirdi
- Doküman arşivi ve dosya yönetimi
- Bildirimler ve hatırlatmalar
- Yedekleme

---

## 5. Aşama planı

Sistemin tamamı bir defada devreye alınmaz. **Beş aşamada** ilerlenir. Sıralama, sizin
en çok zaman kaybettiğiniz işlere göre belirlenmiştir.

| Aşama | Bölümler | Neyi çözer |
|---|---|---|
| **1. Aşama** | Talep ve Müşteri · **Teklif** · **Maliyet** · **Ürün Ağacı** · Sistem Yönetimi | Teklif hazırlama, maliyet analizi ve gönderme |
| **2. Aşama** | Ürün ve Stok · **Malzeme İhtiyaç Planlama** · Satın Alma · Sipariş ve Üretime Teslim · Mühendislik | Malzeme listesi ve iş numarası süreci |
| **3. Aşama** | Üretim ve İş Emirleri · Kalite · Sevkiyat · Navlun · İhracat | İş emri dağıtımı ve sevkiyat evrakı |
| **4. Aşama** | Fabrika · Personel · Bakım · Süpervizörlük ve Servis · Fuar | Kapasite, insan ve saha |
| **5. Aşama** | Muhasebe · Firma Bulma · Satış Yönetimi · Yönetim Paneli | Ticari ve mali kapanış |

**Sıralama bir kapsam kısıtlaması değildir.** Yirmi dört bölümün tamamı planın parçasıdır;
yalnızca devreye giriş sıraları farklıdır.

Sıra rastgele değil: maliyet hesabı kurulmadan malzeme planlaması, üretim takibi ve
kârlılık analizi anlam ifade etmez. Bu yüzden temel önce atılır.

---

## 6. Birinci aşama — ilk teslim

### Kapsam
Talep ve Müşteri Yönetimi · Teklif Yönetimi · Maliyet Yönetimi · Ürün Ağacı ·
Sistem Yönetimi

### Birinci aşama sonunda ne değişecek

**Bugün bir teklif:**
Seçim tablosu ve seçim programı açılır → Word veya Excel şablonu açılır → maliyet
Excel'inde model sayfası kopyalanır → birim fiyat Excel'inden fiyatlar okunur → CTP ve
serpantin Excel'lerinden maliyetler alınır → pano fiyatı ayrıca istenir → çarpan ve
pazarlık payı girilir → PDF alınır → klasör açılır → dosyalar tek tek klasöre konur →
mail atılır → takip elle yapılır.

**Birinci aşamadan sonra:**
Müşteri seçilir → model seçilir → teknik değerler girilir → **Hesapla** → maliyet, kâr
oranı ve teklif fiyatı ekranda → **teknik, ticari ve iç maliyet belgeleri** tek tuşla →
e-posta gönderilir → **arşiv kendiliğinden oluşur** → müşteri teklifi açtığında haberiniz
olur.

### Birinci aşamada kapanacak dosyalar

- Ürün ağacı Excel'leri
- Birim fiyat Excel'i
- CTP maliyet Excel'i
- Serpantin maliyet Excel'i
- Teklif takip Excel'i
- Word ve Excel teklif şablonları
- Elle oluşturulan teklif klasörleri

### Başarı şartı

> Birinci aşama, **her model için sistemin hesapladığı maliyet, bugünkü Excel'inizin
> hesapladığı maliyete birebir eşit olduğunda** tamamlanmış sayılır.

Bu şart pazarlığa açık değildir. Rakamlar birebir tutmadığı sürece kimse yeni sisteme
güvenmez ve haklı olarak Excel'e döner. Bu yüzden önce üç model taşınıp doğrulanacak,
ancak ondan sonra kalan modellere geçilecektir.

---

## 7. Çalışma biçimimiz — üç kural

**1. Hazır olmayan bölüm ekranda görünmez.**
Menüde "yakında" yazan, tıklanınca boş açılan bir bölüm olmayacak. Bir bölüm hazır
değilse sistemde hiç yoktur. Kullanamayacağınız on beş menü göstermek, sistemi
güvenilmez yapar.

**2. Bir bölüm açıldığında yerini aldığı dosya kapanır.**
Excel ile sistem yan yana kullanılmaz. Veri iki yerde tutulursa ikisi de güvenilmez hale
gelir. Güvenliği paralel çalışma değil, yukarıdaki **doğrulama şartı** sağlar: rakamlar
birebir tuttuğu için geri dönme ihtiyacı doğmaz.

**3. Mevcut çalışma biçiminiz korunur, sadece dosyalardan kurtulur.**
ENK/ENB numaralarınız kaldığı yerden devam eder. Standart dışı özellikleri kırmızı
gösterme alışkanlığınız korunur. Çarpan ve pazarlık payı mantığınız aynen taşınır.
CTP maliyetini kilogram üzerinden hesaplama yönteminiz sürer. Sistem sizi kendine
uydurmaz; sizin çalışma biçiminize göre kurulur.

---

## 8. Sizden beklediklerimiz

Sistemin doğru kurulması için aşağıdakilere ihtiyacımız var.

### Öncelikli — plan kesinleşmeden önce

| # | İstenen | Neden |
|---|---|---|
| 1 | **Üç örnek ürün ağacı Excel'i** — küçük, orta ve büyük birer model | Ürün ağacı yapısının nasıl kurulacağını belirler |
| 2 | **Birim fiyat Excel'i** | Malzeme ve işçilik kartlarının temeli |
| 3 | **CTP maliyet Excel'i** | Kilogram bazlı maliyet yapısı |
| 4 | **Serpantin maliyet Excel'i** | Kapalı kule maliyeti |
| 5 | **Word teklif şablonu** ve **Teklif İnceleme Formu** | Belge tasarımlarının aslına uygun olması |
| 6 | **Mevcut kule seçim programına erişim durumu** — kim yaptı, hâlâ destekleniyor mu | Yeniden yazmak yerine bağlanabilmesi için |

### Süreç boyunca

- Malzeme isimlerinin eşleştirilmesi ve **stok kodlarının belirlenmesi** — malzemeyi siz
  tanıyorsunuz, yapıyı biz kuruyoruz
- Taşınan her modelin maliyetinin **sizin tarafınızdan onaylanması**
- Departman ve kullanıcı listesi, kimin neyi görebileceği
- Onay gerektiren durumlar: teklif müşteriye gitmeden önce onay alınıyor mu, belirli kâr
  oranının altında onay isteniyor mu
- Mevcut muhasebe programınız ve hangi bilginin nerede tutulacağı
- İhracat yaptığınız ülkeler ve istenen belgeler

---

## 9. Sonraki adım

1. Yukarıdaki **altı öncelikli dosyanın** tarafımıza iletilmesi
2. Dosyalar incelendikten sonra ürün ağacı yapısının ve stok kodu düzeninin
   birlikte kararlaştırılması
3. Birinci aşama için süre planının ve teklifin sunulması

---

*Bu belge, 18 Ağustos 2026 tarihli süreç görüşmesindeki anlatımınız esas alınarak
hazırlanmıştır. Belgedeki bölüm kapsamları, sizden gelecek bilgiler doğrultusunda
güncellenecektir.*
