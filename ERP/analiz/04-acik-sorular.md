# ANALİZ-04 · Açık Sorular — fiyat vermeden önce cevaplanmalı

> Bu listedeki her soru **kapsamı ve fiyatı doğrudan değiştirir**. Cevapsız bırakılan
> bir madde, sonradan "bu da dahil sanıyorduk" tartışmasına dönüşür.
>
> **Öncelik:** 🔴 fiyatı çok etkiler · 🟡 kapsamı netleştirir · 🟢 tasarım detayı

---

## 🔴 S-01 · Mevcut seçim yazılımı entegre edilecek mi?

Hamdi Bey: *"benim daha önce yaptırdığım bir yazılım var, o da web tabanlı"* — giriş/çıkış
sıcaklığı, yaş termometre, debi girilip **m² ve model** bulunuyor.

- Bu yazılımın **kaynak koduna / veritabanına / API'sine erişim var mı?**
- Kim yaptı, hâlâ destekleniyor mu?
- Seçenekler:
  - **(a)** API ile entegre et → ucuz, hızlı
  - **(b)** Seçim tablolarını ERP'ye veri olarak al, seçimi ERP yapsın → orta
  - **(c)** Termal hesabı sıfırdan yaz → **pahalı, mühendislik doğrulaması gerekir, önerilmez**

**Etkisi:** (c) senaryosu tek başına projenin en riskli kalemi olur.

---

## 🔴 S-02 · Kaç model gerçekten sisteme girecek?

Beyan: açık tip ~100 model (CTP1–CTP30 + hücre çeşitlemeleri), kapalı tip 30–40 model.

- **~130 ürün ağacının tamamı mı** girilecek, yoksa **en çok satan N model** ile mi başlanacak?
- Hamdi Bey'in kritik ipucu: *"iskelet aynı iskelet, sadece miktarlar/motor gücü/fan
  çapı/adam-gün değişiyor."* → **parametrik BOM** mümkün mü, yoksa 130 ayrı kayıt mı?

**Etkisi:** Parametrik yapı kurulabilirse veri girişi eforu ~10 kat azalır. Bu tek soru
Faz 1'in süresini belirler.

---

## 🔴 S-03 · Excel verisini kim taşıyacak?

Taşınacak dosyalar: ürün ağaçları, birim fiyat listesi, serpantin maliyet analizleri,
CTP maliyet reçeteleri, pano fiyatları, müşteri listesi, açık teklifler.

- Veri girişi **Ensotek'te mi**, **bizde mi**?
- Excel'ler tutarlı/temiz mi, yoksa dosya bazında farklı format mı?
- Geçmiş teklifler sisteme aktarılacak mı, yoksa **sistem sıfırdan mı başlayacak**?

**Etkisi:** Veri göçü kolayca projenin %20–30'u kadar efor olur. Kim yapacağı yazılı olmalı.

---

## 🔴 S-04 · Stok kodu sistemini kim kuracak?

Bugün **stok kodu yok**. Hamdi Bey: *"Yapılabilir mi? Yapılabilir. Zor bir şey değil."*

- Kodlama şemasını (MTR-001, FAN-004…) kim tanımlayacak?
- Kaç kalem var? (motor, fan, redüktör, dolgu, profil, cıvata, reçine, boru…)
- İlk kod setini birlikte mi kuracağız?

**Etkisi:** Stok kodu olmadan MOD-05, MOD-06 ve MOD-09 kurulamaz.

---

## 🟡 S-05 · Kaç kullanıcı, hangi departmanlar?

Anlatımda geçen roller: satış, imalat müdürü, imalat mühendisi, kaynak/polyester/montaj
atölyeleri, montajcılar, satın almacılar, otomasyoncu (pano), depo, servis.

- Her rolde **kaç kişi**?
- Mavi yakalılar sisteme **girecek mi**, yoksa iş emri kâğıt/tablet olarak mı kalacak?
- Eş zamanlı kullanıcı sayısı?

**Etkisi:** Lisans/kullanıcı modeli, yetki matrisi ve eğitim eforu.

---

## 🟡 S-06 · Onay mekanizması var mı?

Anlatımda **hiç geçmedi**. ChatGPT sordu, cevap gelmedi.

- Teklif müşteriye gitmeden önce **genel müdür onayı** gerekiyor mu?
- Kâr oranının altına düşen fiyatlarda onay şartı olsun mu?
- İş emri açmadan önce onay var mı?

**Etkisi:** Onay akışı varsa neredeyse her modülde durum makinesi değişir.

---

## 🟡 S-07 · Muhasebe entegrasyonu

Anlatımda fatura ve irsaliye kesimi geçiyor ama **hangi programla** kesildiği söylenmedi.

- Logo / Netsis / Mikro / e-fatura entegratörü var mı?
- ERP **fatura kesecek mi**, yoksa sadece "kesildi" işareti mi tutacak?
- Cari hesap ve tahsilat takibi ERP'de mi, muhasebe programında mı?

**Etkisi:** e-fatura entegrasyonu istenirse ayrı bir proje kalemi olur.

---

## 🟡 S-08 · Nerede çalışacak, kim yönetecek?

- İç ağda mı, internete açık mı? (Hamdi Bey uzaktan erişim istedi → internete açık)
- Sunucu **Ensotek'te mi**, bizim VPS'te mi, bulutta mı?
- Yedekleme sorumluluğu kimde?
- Teklif PDF'leri ve AutoCAD dosyaları için ne kadar disk gerekir?

**Etkisi:** Barındırma ve bakım maliyeti; güvenlik gereksinimleri.

---

## 🟢 S-09 · Eğitim ve devreye alma

- Kaç kişiye, kaç gün eğitim?
- Paralel çalışma dönemi olacak mı (Excel + ERP birlikte)?
- Devreye alma desteği süresi?

---

## 🟢 S-10 · Bakım ve destek sonrası

- Teslim sonrası **aylık bakım/destek sözleşmesi** olacak mı?
- Yeni model eklendiğinde ürün ağacını **Ensotek kendi mi** girecek?
- Değişiklik talepleri nasıl fiyatlanacak?

---

## 🟢 S-11 · Teknik detaylar

| # | Soru | Neden |
|---|---|---|
| S-11.1 | Euro kuru **hangi kaynaktan** okunuyor? (TCMB? banka? manuel?) | IHT-306 |
| S-11.2 | Teklif geçerlilik süresi kaç gün? | Teklif durum akışı |
| S-11.3 | Pano fiyatını otomasyoncu **nasıl** hesaplıyor — formül ERP'ye girer mi, dışarıda mı kalır? | IHT-207 |
| S-11.4 | Kapalı kule serpantininde "kat sayısı" dışında değişken var mı? | IHT-405 |
| S-11.5 | CTP kg maliyeti **hangi sıklıkla** güncelleniyor? | IHT-403 |
| S-11.6 | Teklif numarası ile ENK/ENB iş numarası **arasında bağ var mı**, yoksa bağımsız mı? | Numaralandırma tasarımı |
| S-11.7 | Aynı teklifte **birden fazla kule** olabiliyor mu? | BOM ve fiyatlandırma yapısı |
| S-11.8 | Yedek parça talepleri de teklif sürecinden mi geçiyor, yoksa kısa yol var mı? | IHT-102 |
| S-11.9 | Teklif PDF'lerinde Ensotek antetli şablon var mı — mevcut Word şablonu alınabilir mi? | PDF şablon eforu |
| S-11.10 | Ürünler **yurt dışına** da satılıyor mu (Incoterms, EN teklif)? | OPS-07 çok dillilik |

---

## Cevap toplama planı

| Adım | İçerik |
|---|---|
| **1. Toplantı** | S-01, S-02, S-03, S-04 — fiyatı belirleyen dört soru |
| **2. Toplantı** | S-05, S-06, S-07, S-08 — kapsam sınırları |
| **Yazışma** | S-09, S-10, S-11 |
| **Sonra** | Efor tahmini → fiyat teklifi |

> Dört 🔴 soru cevaplanmadan **fiyat verilmemelidir.** Özellikle S-01 ve S-02, projenin
> toplam eforunu iki katına kadar değiştirebilir.
