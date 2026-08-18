# ANALİZ-04 · Açık Sorular (v0.2)

> **Güncelleme (2026-08-18):** Kapsam kararıyla birlikte bazı sorular kapandı, yeni
> sorular açıldı. **Fiyat en son aşama** — bu liste artık fiyat için değil, **planı
> netleştirmek** için.
>
> **Öncelik:** 🔴 planı/mimariyi belirler · 🟡 kapsamı netleştirir · 🟢 detay

---

## ✅ Kapanan sorular

| # | Soru | Karar |
|---|---|---|
| ~~S-Tek~~ | Hangi teknoloji? | **Bizim teknoloji.** Fastify + Bun + Drizzle + MySQL + Next.js 16. ASP.NET/MSSQL önerisi reddedildi → [ANALİZ-06 §4](06-mimari-iskelet.md) |
| ~~S-Kapsam~~ | Nereye kadar yapacağız? | **Tamamı ve fazlası.** 21 modül; firma bulma, navlun, personel, bakım, fabrika, satış, muhasebe dahil → [ANALİZ-03](03-kapsam-taslagi.md) |
| ~~S-Excel~~ | Excel'ler ne olacak? | **Tamamen kapanacak.** Veriler ERP'ye taşınır, paralel çalışma yok → [ANALİZ-07](07-excel-veri-gocu.md) |
| ~~S-Sıfırdan~~ | Kod sıfırdan mı yazılacak? | **Hayır.** Workspace'teki mevcut modüller birleştirilecek; 21 modülün 19'u mevcut koddan besleniyor → [ANALİZ-05](05-modul-envanteri-yeniden-kullanim.md) |
| ~~S-Yakında~~ | Hazır olmayan modüller nasıl gösterilecek? | **Gösterilmeyecek.** "Yakında" yasak; modül `hidden` ise menüde yok, route 404, API kapalı → [ANALİZ-06 §1](06-mimari-iskelet.md) |

---

## 🔴 S-01 · Mevcut seçim yazılımı entegre edilecek mi? — **hâlâ açık**

Hamdi Bey: *"benim daha önce yaptırdığım bir yazılım var, o da web tabanlı"* — giriş/çıkış
sıcaklığı, yaş termometre, debi girilir; **m² ve model** çıkar.

- Kaynak koduna / veritabanına / API'sine **erişim var mı**? Kim yaptı, destekleniyor mu?
- Seçenekler:
  - **(a)** API ile entegre → ucuz, hızlı
  - **(b)** Seçim tablolarını ERP'ye veri olarak al, seçimi ERP yapsın → orta
  - **(c)** Termal hesabı sıfırdan yaz → **pahalı, mühendislik doğrulaması gerekir; OUT-04 ile kapsam dışı bırakıldı**

**Neden kritik:** Faz 1'in girişi bu. Model belirlenmeden teklif de maliyet de başlamaz.

---

## 🔴 S-02 · Ürün ağacı parametrik kurulabilir mi? — **projenin en belirleyici sorusu**

Hamdi Bey: *"CTP5 ile CTP6'nın büyük kısmı aynı… iskelet aynı iskelet."*
Değişen: miktarlar, motor gücü, fan çapı, adam-gün.

- ~130 model için **3–5 parametrik taban + model parametre tablosu** kurulabilir mi,
  yoksa **130 ayrı BOM** mı girilecek?
- Excel'lerin incelenmesi gerekiyor — bu soru masabaşında cevaplanamaz.

**Neden kritik:** Faz 1'in süresini ve MOD-04'ün (projenin kalbi) mimarisini bu belirler.
Fark 10 kat olabilir → [ANALİZ-07 §2](07-excel-veri-gocu.md).

**Sonraki adım:** Ensotek'ten **3 örnek ürün ağacı Excel'i** (bir küçük, bir orta, bir
büyük model) + birim fiyat Excel'i + CTP maliyet Excel'i + serpantin Excel'i istenecek.
Bu dosyalar gelmeden mimari kararı verilemez.

---

## 🔴 S-03 · Stok kodu şemasını kim tanımlayacak?

Bugün **stok kodu yok**. Hamdi Bey: *"Yapılabilir. Zor bir şey değil."*

- Kodlama şemasını (MTR-001, FAN-004, PVC-012…) kim kuracak?
- Kaç tekil kalem var? (Excel normalizasyonundan çıkacak)
- Aynı malzemenin farklı yazımları kim tarafından eşleştirilecek?

**Neden kritik:** MOD-04, MOD-05, MOD-06, MOD-09 hepsi buna bağlı. Ayrıca veri göçünün
en uzun adımı bu (G-02 adım 2–3).

---

## 🔴 S-04 · Canlıya geçiş stratejisi — Excel bir günde mi kapanacak?

Karar: paralel çalışma yok. Ama **hangi anda** kapanacak?

- Faz 1 bittiğinde satış ekibi **aynı gün** Excel'i bırakacak mı?
- O anda **açık olan teklifler** ne olacak — ERP'ye taşınacak mı, Excel'de mi bitirilecek?
- ENK/ENB sayaçları geçiş anındaki son numaradan devralınacak → geçiş tarihi net olmalı
- Geri dönüş planı ne? (Rakamlar tutmazsa ne yapılır)

**Neden kritik:** Yanlış zamanlanmış bir geçiş, doğru yazılmış bir yazılımı bile
kullanılmaz hale getirir.

---

## 🟡 S-05 · Kaç kullanıcı, hangi departmanlar?

Anlatımda geçen roller: satış, imalat müdürü, imalat mühendisi, kaynak/polyester/montaj
atölyeleri, montajcılar, satın almacılar, otomasyoncu (pano), depo, servis.

- Her rolde kaç kişi? Eş zamanlı kullanıcı sayısı?
- **Mavi yakalılar sisteme girecek mi**, yoksa iş emri atölyede kâğıt/tablet mi kalacak?
- Yönetim (patron) hangi ekranları görecek?

**Etkisi:** Yetki matrisi, PWA kapsamı (Faz 3), eğitim planı, MOD-16 personel yapısı.

---

## 🟡 S-06 · Onay mekanizmaları var mı?

Anlatımda hiç geçmedi.

- Teklif müşteriye gitmeden **genel müdür onayı** gerekiyor mu?
- Belirli kâr oranının altında onay şartı olsun mu?
- İş emri açmadan önce onay var mı?
- Satın alma siparişinde tutar limiti ve onay var mı?

**Etkisi:** Onay akışı varsa neredeyse her modülde durum makinesi değişir.
ihracatradari `approval-engine` hazır — kullanılır ama **kuralları Ensotek tanımlamalı**.

---

## 🟡 S-07 · Muhasebe sınırı nerede biter?

Kapsam kararıyla muhasebe **modülü var** (MOD-20). Sınırı çizilmeli:

- Ensotek şu an hangi muhasebe programını kullanıyor? (Logo / Netsis / Mikro / mali müşavir)
- ERP **fatura kesecek mi**, yoksa "kesildi" işareti mi tutacak?
- Cari hesap ERP'de mi, muhasebe programında mı **asıl kayıt** olacak?
- e-fatura: mevcut `e-fatura-service` mi bağlanacak, entegratör mü?
- Mali müşavire hangi formatta veri gidecek?

**Etkisi:** İki sistem arasında **çift kayıt** olursa muhasebe tarafı güvenilmez olur.

---

## 🟡 S-08 · Firma bulma — veri kaynağı ve hedef kitle *(yeni)*

MOD-14 için:

- Hedef kitle kim? (soğutma kulesi kullanan tesisler: enerji, kimya, gıda, çimento, AVM…)
- Coğrafi kapsam: yurt içi mi, ihracat mı, ikisi mi?
- Veri kaynağı: ihracatradari'nin mevcut zenginleştirme kaynakları yeterli mi,
  Google Maps taraması mı, sektör dernek listeleri mi?
- **KVKK:** kişisel veri toplanacaksa aydınlatma/saklama politikası gerekir
  (ihracatradari'de politika belgesi mevcut, uyarlanır)

---

## 🟡 S-09 · Navlun kapsamı *(yeni)*

MOD-15 için:

- Navlun **kim tarafından** hesaplanıyor bugün? (nakliyeciden teklif mi alınıyor?)
- ERP navlunu **hesaplayacak mı**, yoksa dışarıdan gelen fiyatı **kaydedecek mi**?
- Yurt dışı sevkiyat var mı? Varsa hangi incoterm'ler kullanılıyor?
- Konteyner/TIR sığdırma hesabı için kule **dış ölçüleri** model kartında var mı?

---

## 🟡 S-10 · Barındırma ve işletim

- İç ağ mı, internete açık mı? (Uzaktan erişim isteniyor → internete açık)
- Sunucu Ensotek'te mi, bizim VPS'te mi?
- Yedekleme sorumluluğu kimde, hangi sıklıkta?
- PDF + DWG + fotoğraf için ne kadar disk? (yıllık büyüme)
- Tek ERP'ye geçildiği için **kesinti toleransı** nedir?

---

## ✅ Kapanan — ürün ailesi yapısı

| Soru | Karar (2026-08-18, Orhan) |
|---|---|
| Karbonkompozit ayrı şirket mi? | **Hayır.** Ayrı ürün ailesi ve marka: **MOE Kompozit**. Ayrı tenant kurulmayacak |
| Ayrı fatura / cari / muhasebe mi? | **Hayır.** Faturalar şu an **Ensotek adına** kesiliyor |
| Ayrı iş numarası serisi mi? | **Hayır.** ENK/ENB her iki ürün ailesi için ortak |
| Nasıl ayrışacak? | Ürün kartındaki **marka** alanı — ürün, ürün ağacı, teklif anteti ve raporlarda kırılım |

---

## 🟡 S-13 · Marka ayrımı belgelere nasıl yansıyacak? *(yeni)*

- **Teklif PDF'i** MOE Kompozit logosu ve anteti ile mi çıkacak, Ensotek anteti ile mi?
- Fatura Ensotek adına kesildiğine göre, teklif ile fatura arasında marka farkı
  müşteride soru yaratır mı?
- MOE Kompozit için ayrı teklif numarası öneki gerekiyor mu?
- E-posta gönderiminde hangi imza ve alan adı kullanılacak?

**Neden önemli:** Belge şablonu ayarı olarak çözülür, ama hangi belgede hangi markanın
görüneceği baştan netleşmeli.

---

## 🟡 S-14 · Kompozit üretimi aynı atölyede mi? *(yeni)*

- Lunapark kompozit ürünleri **aynı polyester atölyesinde** mi üretiliyor?
- Aynı personel iki ürün ailesinde de çalışıyor mu?
- Depo ortak mı?

**Neden önemli:** Ortaksa, atölye kapasitesi ve üretim planı iki ürün ailesinin işini
**birlikte** göstermeli — aynı atölyeye iki yerden habersiz iş verilmemeli.
Tek şirket olduğu için bu doğal çözüm, ama teyit edilmeli.

---

## 🟡 S-15 · Malzeme kartları ortak mı? *(yeni)*

Reçine, cam elyaf, jelkot her iki ürün ailesinde de kullanılıyor.

- Tek malzeme kartı ve tek birim fiyat mı?
- Satın alma ortak mı yapılıyor?
- MOE Kompozit'e özgü malzemeler var mı?

**Beklenen cevap:** tek havuz — tek şirket, tek depo, tek satın alma.

---

## 🟢 S-16 · MOE Kompozit'in ürün ağacı yapısı *(yeni)*

- Lunapark ürünlerinin de **standart ürün ağacı** var mı, yoksa her iş projeye özel mi?
- Kompozit ürünlerde de **kilogram bazlı maliyet** mantığı geçerli mi?
- Adam-gün yapısı soğutma kulesiyle aynı mı?
- Kaç MOE Kompozit modeli sisteme girecek?

**Neden önemli:** Veri göçünün kapsamını etkiler. Teklifteki "otuz model" sınırı
şu an yalnız soğutma kulesi modelleri için tanımlı.

---

## 🟢 S-11 · Eğitim, devreye alma, bakım

- Kaç kişiye kaç gün eğitim? Faz bazlı mı, toplu mu?
- Devreye alma desteği süresi?
- Teslim sonrası bakım/destek sözleşmesi?
- Yeni kule modeli eklendiğinde ürün ağacını **Ensotek kendi mi** girecek?

---

## 🟢 S-12 · Teknik detaylar

| # | Soru | İlgili |
|---|---|---|
| S-12.1 | Euro kuru hangi kaynaktan okunuyor? (TCMB / banka / manuel) | IHT-306 |
| S-12.2 | Teklif geçerlilik süresi kaç gün? | MOD-02 |
| S-12.3 | Pano fiyat formülü ERP'ye girer mi, otomasyoncuda mı kalır? | IHT-207 |
| S-12.4 | Serpantinde "kat sayısı" dışında değişken var mı? | IHT-405 |
| S-12.5 | CTP kg maliyeti hangi sıklıkla güncelleniyor? | IHT-403 |
| S-12.6 | Teklif no ile ENK/ENB arasında bağ var mı? | I-03 numaralandırma |
| S-12.7 | Aynı teklifte birden fazla kule olabiliyor mu? | MOD-02/04 |
| S-12.8 | Yedek parça talebi teklif sürecinden mi geçiyor, kısa yol var mı? | IHT-102 |
| S-12.9 | Mevcut Word teklif şablonu alınabilir mi? (antet, madde düzeni) | G-10 |
| S-12.10 | Yurt dışı satış var mı? (çok dillilik ve incoterm) | IHT-2107, S-09 |
| S-12.11 | Fabrikada kaç atölye, kaç vardiya var? | MOD-18 |
| S-12.12 | Makine/ekipman envanteri çıkarılmış mı? | MOD-17 |

---

## Toplama planı

| Adım | İçerik | Çıktı |
|---|---|---|
| **Dosya talebi** | 3 örnek ürün ağacı Excel'i, birim fiyat, CTP maliyet, serpantin, pano, Word teklif şablonu, Teklif İnceleme Formu | S-02 ve S-03 masabaşında değil, **dosyaya bakarak** cevaplanır |
| **Toplantı 1** | S-01, S-02, S-03, S-04 | Faz 1 mimarisi kilitlenir |
| **Toplantı 2** | S-05, S-06, S-07, S-10, **S-13, S-14, S-15, S-16** | Yetki matrisi + muhasebe sınırı + **marka ve MOE Kompozit ürün yapısı** |
| **Toplantı 3** | S-08, S-09 | Yeni modüllerin sınırları |
| **Yazışma** | S-11, S-12 | Detaylar |
| **Sonra** | Modül bazlı efor tahmini | |
| **En son** | **Fiyat** | |

> **En acil iş soru sormak değil, Excel dosyalarını almak.** S-02 ve S-03 projenin
> mimarisini belirliyor ve ikisi de ancak gerçek dosyalara bakılarak cevaplanabilir.
>
> **S-16 ikinci sırada:** MOE Kompozit'in kaç modeli olduğu ve ürün ağacı yapısının
> soğutma kulesiyle aynı olup olmadığı, veri göçü kapsamını doğrudan etkiler.
