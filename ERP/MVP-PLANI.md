# Ensotek ERP — MVP Planı (İÇ BELGE)

> ⚠️ **Bu belge içeridir.** Efor tahminleri, risk değerlendirmeleri ve kaynak proje
> isimleri müşteriye gitmez. Hamdi Bey'e gidecek PDF raporu ayrıca hazırlanacak.
>
> **Tarih:** 2026-08-18 · **Sürüm:** 1.0 · **Durum:** Plan — geliştirme başlamadı

---

## 1. MVP nedir — tek cümle

> **MVP = Ensotek satış ekibinin teklif ve maliyet Excel'lerini bir daha açmadan,
> bir kule teklifini baştan sona ERP'de hazırlayıp müşteriye gönderebilmesi.**

Neden burası: Hamdi Bey'in kendi saydığı darboğazların üçü de burada birleşiyor —
**D-1 teklif hazırlama, D-2 maliyet analizi, D-3 gönderme**. Üretim tarafı (D-4, D-5)
zaten hazır kodla besleniyor ve MVP'den sonra çok daha hızlı gelir.

**MVP'nin başarı ölçütü tek ve serttir:**
> Aynı kule için ERP'nin hesapladığı maliyet, Excel'in hesapladığına **birebir eşit**.
> Eşit değilse MVP bitmemiştir.

---

## 2. MVP kapsamı

### İçinde ✅

| Modül | Ne yapıyor |
|---|---|
| **MOD-00** Altyapı | Giriş, rol, yetki, dosya, mail, bildirim, audit, numaralandırma, modül kayıt defteri |
| **MOD-01** Talep + Müşteri | Talep kaydı (e-posta/telefon/WhatsApp), satış personeline atama, müşteri kartı |
| **MOD-04** Ürün Ağacı | Çok seviyeli BOM, kg-bazlı kalem, işçilik satırı, alt ağaç, revizyon |
| **MOD-03** Maliyet | Patlatma, roll-up, kur, çarpan + pazarlık payı, **teklif anı snapshot** |
| **MOD-02** Teklif | Teklif no + revizyon, standart dışı kırmızı, **3 PDF**, e-posta, otomatik arşiv, takip |
| **Veri göçü** | Birim fiyat + CTP + serpantin + ürün ağaçları + müşteriler |

### Dışında ❌ *(MVP sonrası)*

Üretim iş emirleri · Kalite · Sevkiyat · Navlun · Stok hareketleri · Satın alma ·
Mühendislik/AutoCAD · Personel · Bakım · Fabrika kapasitesi · Firma bulma · Muhasebe ·
Servis · Raporlama panosu

> Bunların **hiçbiri menüde görünmeyecek**. "Yakında" yazmıyoruz — modül `hidden` ise
> sistemde yok: menü yok, route 404, API rotası kayıt edilmiyor.

### Sınırda — MVP'ye alınabilecek iki kalem

| Kalem | Neden alınabilir | Karar |
|---|---|---|
| **Müşteri teklif portalı** (`/teklif/[token]`) | TeklifRota'da **hazır**, ~3 gün. Teklif takibini (D-3) tek başına çözer | 🟢 **Alalım** — getiri/maliyet oranı çok yüksek |
| **Navlun motoru** (MOD-15) | Paket hazır, ~5 gün entegrasyon. Teklife nakliye kalemi girer | 🟡 MVP'yi şişirir; **Faz 2'ye** — ama şema ilk günden yer ayırsın |

---

## 3. Ne kadar hazır, ne kadar yeniden üretilecek

**Okuma:** "Devralınan" = mevcut koddan gelen. "Yeni" = sıfırdan yazılacak.
Yüzdeler kod hacmi değil, **iş hacmi** tahminidir.

### 3.1 MVP kalemleri

| # | İş kalemi | Devralınan | Yeni | Kaynak |
|---|---|:---:|:---:|---|
| **A** | Depo iskeleti, monorepo, paketler | 80% | 20% | sablon_proje + Ensotek packages |
| **B** | Auth + rol + yetki + audit | 90% | 10% | Ensotek shared-backend, transpalet |
| **C** | Dosya deposu + mail + bildirim | 90% | 10% | Ensotek shared-backend |
| **D** | Admin panel iskeleti (layout, sidebar, auth gate) | 85% | 15% | paspas `_components`, transpalet navigation |
| **E** | **Modül kayıt defteri** (`hidden/internal/ready`) | 40% | 60% | transpalet `permissions.ts` deseni |
| **F** | **Numaralandırma** (PRJ/TKF/ENK/ENB) | 30% | 70% | TeklifRota `quote_sequences` deseni |
| **G** | PDF üretim tabanı | 70% | 30% | TeklifRota `document-service` + paspas `pdf.service` |
| **H** | Excel içe aktarma altyapısı | 60% | 40% | TeklifRota `customer-import`, `import.ts` |
| **I** | Deploy hattı (Docker/Nginx/PM2/CI) | 85% | 15% | Ensotek + paspas deploy |
| **J** | Talep + müşteri kartı | 80% | 20% | transpalet `talepler`, `musteriler`, `crm` |
| **K** | **Ürün/malzeme kartı + stok kodu** | 70% | 30% | paspas `urunler`, `birimler` |
| **L** | **BOM veri modeli** | 50% | 50% | paspas `receteler` + `recete_kalemleri` |
| **M** | **BOM patlatma motoru** (özyineleme, döngü, roll-up) | **0%** | **100%** | — **yok** |
| **N** | **Parametrik model türetme** (~130 model) | **0%** | **100%** | — **yok** |
| **O** | **Maliyet hesap katmanı** (22 madde) | **5%** | **95%** | TeklifRota `fixed-decimal` |
| **P** | **Fiyat altyapısı** (kur, para birimi, fiyat geçmişi) | 20% | 80% | — |
| **R** | **Maliyet snapshot** | 40% | 60% | TeklifRota `quote_revisions` deseni |
| **S** | Teklif yaşam döngüsü + revizyon + olay çizelgesi | **90%** | 10% | TeklifRota `commercial` |
| **T** | **Kule teklif şablonu + standart dışı kırmızı** | 10% | 90% | — |
| **U** | **3 ayrı PDF** (teknik / ticari / iç maliyet) | 30% | 70% | paspas Türkçe şablon |
| **V** | Otomatik arşiv (teklif no klasörü) | 50% | 50% | TeklifRota `quote_documents` |
| **W** | Müşteri teklif portalı | **95%** | 5% | TeklifRota `public-link-service` |
| **X** | **Veri göçü — araçlar** | 50% | 50% | TeklifRota import |
| **Y** | **Veri göçü — normalizasyon + stok kodu** | **0%** | **100%** | — *veri işi, Ensotek ile birlikte* |
| **Z** | **Veri göçü — 130 model BOM + doğrulama** | **0%** | **100%** | — *veri işi* |

### 3.2 Özet

| Grup | Kalem | Ortalama devralma |
|---|---|:---:|
| 🟩 **Neredeyse hazır** — devral, uyarla | A,B,C,D,I,J,S,W | **~87%** |
| 🟢 **Yarı hazır** — omurga var, tamamla | G,H,K,L,R,V,X | **~56%** |
| 🟠 **Desen var, iş yeni** | E,F,P,U | **~30%** |
| 🔴 **Sıfırdan** | **M, N, O, T, Y, Z** | **~2%** |

> **MVP'nin bel kemiği 🔴 gruptadır:** BOM patlatma motoru (M), parametrik türetme (N),
> maliyet hesap katmanı (O) ve veri göçü (Y, Z). MVP eforunun **yaklaşık üçte ikisi**
> bu altı kalemde.

---

## 4. Efor tahmini

> **Uyarı:** Bu tahmin **S-01, S-02, S-03 cevaplanmadan ±%40** oynar.
> En büyük belirsizlik **N (parametrik BOM)** ve **Z (130 model göçü)** — ikisi de
> Excel dosyaları görülmeden kestirilemez.

### Faz 0 — İskelet

| Kalem | Adam-gün |
|---|---:|
| A · Depo iskeleti, monorepo, paketler | 3 – 5 |
| B · Auth + rol + yetki + audit | 4 – 6 |
| C · Dosya + mail + bildirim | 4 – 6 |
| D · Admin panel iskeleti | 4 – 6 |
| E · Modül kayıt defteri | 2 – 3 |
| F · Numaralandırma üreteci | 2 – 3 |
| G · PDF üretim tabanı | 3 – 5 |
| H · Excel içe aktarma altyapısı | 4 – 6 |
| I · Deploy hattı | 3 – 5 |
| **Çekirdek şema tasarımı** (tek `CREATE TABLE` seti) | 6 – 10 |
| **Faz 0 toplam** | **35 – 55** |

### Faz 1 — MVP

| Kalem | Adam-gün |
|---|---:|
| J · Talep + müşteri | 5 – 8 |
| K · Ürün/malzeme kartı + stok kodu altyapısı | 5 – 8 |
| L · BOM veri modeli | 5 – 8 |
| **M · BOM patlatma motoru** 🔴 | **10 – 16** |
| **N · Parametrik model türetme** 🔴 | **10 – 20** |
| **O · Maliyet hesap katmanı** 🔴 | **15 – 25** |
| P · Fiyat altyapısı (kur, para birimi, fiyat geçmişi) | 5 – 8 |
| R · Maliyet snapshot | 5 – 8 |
| BOM + maliyet admin ekranları | 10 – 16 |
| S · Teklif yaşam döngüsü devralma | 6 – 10 |
| **T · Kule şablonu + standart dışı kırmızı** 🔴 | **5 – 8** |
| **U · 3 ayrı PDF** | **8 – 14** |
| V · Otomatik arşiv | 3 – 5 |
| W · Müşteri teklif portalı | 3 – 4 |
| Teklif admin ekranları | 8 – 12 |
| **Faz 1 geliştirme toplam** | **103 – 170** |

### Veri göçü *(Faz 1'e paralel)*

| Kalem | Adam-gün |
|---|---:|
| X · Göç araçları | 6 – 10 |
| **Y · Normalizasyon + stok kodu şeması** 🔴 | **10 – 20** |
| **Z · 130 model BOM girişi + doğrulama** 🔴 | **15 – 45** |
| **Göç toplam** | **31 – 75** |

> **Z'nin aralığı neden bu kadar geniş:** S-02 cevabı. Parametrik taban kurulabilirse
> ~3–5 taban + parametre tablosu (alt uç). Kurulamazsa 130 ayrı BOM (üst uç).

### Kapanış

| Kalem | Adam-gün |
|---|---:|
| Test, kabul, hata düzeltme | 8 – 14 |
| Eğitim + devreye alma + paralel-yok geçişi | 6 – 10 |
| **Toplam** | **14 – 24** |

### MVP genel toplam

| | Adam-gün |
|---|---:|
| Faz 0 İskelet | 35 – 55 |
| Faz 1 Geliştirme | 103 – 170 |
| Veri göçü | 31 – 75 |
| Kapanış | 14 – 24 |
| **TOPLAM** | **183 – 324** |

**Takvim karşılığı:**

| Ekip | Süre |
|---|---|
| 1 kişi | 9 – 16 ay |
| 2 kişi | 5 – 8 ay |
| 3 kişi | 3,5 – 6 ay |

> Veri göçünün bir kısmı Ensotek tarafında (Excel temizliği, malzeme eşleştirme onayı) —
> bu, üstteki adam-güne dahil **değil**.

---

## 5. Kritik yol

```
Şema tasarımı
   └─► L BOM veri modeli
          └─► M Patlatma motoru ──► O Maliyet hesap katmanı ──► R Snapshot
                     │                        │
                     └─► N Parametrik türetme │
                                │             │
                                └──► Z 130 model göçü + DOĞRULAMA ◄──┘
                                              │
                                              └─► MVP KAPANIŞ
```

**Kritik yol üzerindeki her şey sıralı — paralelleştirilemez.** Toplam: 55 – 114 adam-gün.

Paralel yürüyebilecekler: A, B, C, D, I (iskelet) · J, K · S, W (teklif devralma) ·
X (göç araçları) · U (PDF şablonları)

> **Tek en riskli bağımlılık:** Doğrulama (Z) en sonda. Rakamlar tutmazsa geri dönüş
> M/O'ya kadar gider. Bu yüzden **doğrulama erken başlamalı**: ilk 3 model göç edip
> doğrulandıktan sonra kalan 127'ye geçilir.

---

## 6. Yol haritası

### 🚩 M0 — Hazırlık *(geliştirme öncesi)*
- [ ] Excel dosyaları alınır: 3 örnek ürün ağacı (küçük/orta/büyük), birim fiyat, CTP maliyet, serpantin, pano, Word teklif şablonu, Teklif İnceleme Formu
- [ ] **S-02** cevaplanır — parametrik BOM mümkün mü *(dosyaya bakarak)*
- [ ] **S-03** cevaplanır — stok kodu şeması kim kuracak
- [ ] **S-01** cevaplanır — seçim yazılımına erişim var mı
- [ ] Efor tahmini daraltılır → **fiyat verilir**

> **M0 bitmeden kod yazılmaz.** S-02'nin cevabı MOD-04'ün mimarisini belirliyor;
> yanlış tahminle başlamak atılacak şema üretmektir.

### 🚩 M1 — İskelet ayakta *(Faz 0)*
- Giriş çalışıyor, roller tanımlı
- Menüde **hiçbir modül yok** *(doğru davranış)*
- Çekirdek tablolar kurulu, numaralandırma çalışıyor (ENK/ENB Excel'den devralınmış)
- Dosya + mail + PDF + audit çalışıyor
- VPS'te ayakta, deploy hattı kurulu

### 🚩 M2 — Ürün ağacı çalışıyor
- Malzeme/işçilik kartları girilebiliyor, stok kodu şeması kurulu
- **3 örnek model** ERP'de: çok seviyeli patlatma çalışıyor
- CTP kg-bazlı kalem doğru hesaplanıyor, serpantin alt ağacı çözülüyor
- **✅ Kapı: 3 modelin maliyeti Excel'e birebir eşit**

> Bu kapı geçilmeden 130 modele geçilmez. Model yanlışsa 130 kez yanlış olur.

### 🚩 M3 — Maliyet motoru tam
- Çarpan + pazarlık payı + EUR kuru zinciri
- Maliyet katmanları (malzeme / işçilik / dolaylı)
- **Teklif anı snapshot** çalışıyor
- Fiyat geçmişi ve kur yönetimi

### 🚩 M4 — Teklif uçtan uca
- Talep → atama → model → BOM → maliyet → fiyat
- Standart dışı özellikler kırmızı
- **3 PDF** üretiliyor: teknik / ticari / iç maliyet
- E-posta gönderimi + otomatik arşiv
- Müşteri portalı: görüntülendi / kabul / revizyon talebi
- **✅ Kapı: Bir satış mühendisi gerçek bir teklifi baştan sona ERP'de hazırladı**

### 🚩 M5 — Veri göçü tamam
- Birim fiyat + CTP + serpantin + 130 model + müşteriler ERP'de
- **✅ Kapı: Her model için ERP maliyeti = Excel maliyeti**

### 🚩 M6 — Canlıya geçiş
- Eğitim verildi
- ENK/ENB sayaçları son numaradan devralındı
- **Teklif ve maliyet Excel'leri kapatıldı** — paralel çalışma yok
- Yedekleme çalışıyor

> **MVP burada biter.** Bu noktada Ensotek teklif ve maliyeti tamamen ERP'de yapıyor.

---

## 7. MVP sonrası — kısa

| Faz | Modüller | Neden bu sıra | Kaba efor |
|---|---|---|---:|
| **2** | Stok · Satın Alma · Sipariş/Üretime Teslim · Mühendislik | D-4 malzeme listesi darboğazı; ENK/ENB + avans kontrolü | 60 – 100 |
| **3** | Üretim · Kalite · Sevkiyat · Navlun | D-5 iş emri darboğazı; paspas + navlun motoru hazır | 55 – 90 |
| **4** | Personel · Bakım · Fabrika · Servis | Adam-gün maliyetinin gerçek veriye bağlanması | 50 – 85 |
| **5** | Firma bulma · Satış · Muhasebe · Raporlama | Ticari kapanış | 60 – 100 |

Faz 2–5 toplam: **225 – 375 adam-gün**. MVP dahil tüm proje: **~410 – 700 adam-gün**.

> Faz 2 ve 3 MVP'den **belirgin olarak ucuz**: kod büyük ölçüde hazır (paspas üretim,
> TeklifRota navlun/sevkiyat) ve maliyet motoru bir kez yazıldıktan sonra tekrar
> yazılmıyor.

---

## 8. Riskler

| # | Risk | Etki | Ne yaparız |
|---|---|---|---|
| **R-1** | **Parametrik BOM kurulamaz** — 130 model tek tek girilir | Göç eforu 15 → 45 gün | M0'da dosyaya bakarak erken öğren; kurulamazsa göçü Ensotek'e paylaştır |
| **R-2** | **Doğrulama tutmaz** — ERP maliyeti Excel'e eşit çıkmaz | MVP kapanmaz, satış Excel'e döner | M2 kapısı: 3 modelde doğrula, sonra 130'a geç |
| **R-3** | **Excel'de gizli formül/istisna** | Sonradan çıkan sürprizler | Göçte her sapmayı raporla; Excel hatası bulunursa Ensotek'e bildir |
| **R-4** | **Stok kodu normalizasyonu tıkanır** — kim karar verecek belirsiz | Göç durur | S-03 M0'da cevaplanmalı; karar sahibi isimle belirlensin |
| **R-5** | **Seçim yazılımına erişim yok** | Teklif girişi elle kalır | Kabul edilebilir: MVP'de model elle seçilir, entegrasyon Faz 2'ye |
| **R-6** | **Kapsam kayması** — "şunu da ekleyelim" | MVP uzar | Modül kayıt defteri koruyor: MVP dışı modül `hidden`, tartışma bile açılmaz |
| **R-7** | **Devralınan kod yeni şemaya uymaz** | Uyarlama eforu şişer | Şema tasarımı devralınacak modüllere bakılarak yapılıyor, tersi değil |
| **R-8** | **Ensotek tarafı veri hazırlığına vakit ayıramaz** | Takvim kayar | Sözleşmede Ensotek sorumlulukları açıkça yazılsın |

---

## 9. Varsayımlar

Tahminler bunlara dayanıyor — biri değişirse rakam değişir:

1. Teknoloji **bizim stack** (Fastify + Bun + Drizzle + MySQL + Next.js 16)
2. Backend + admin panel modülleri devralınıyor, **seed dosyaları kopyalanmıyor**
3. Sistem **tek kiracılı**, `tenant_key` sabit değere bağlanıyor
4. MVP'de yalnız **satış ekibi** kullanıcı — mavi yaka yok, mobil yok
5. **Muhasebe entegrasyonu MVP'de yok**
6. Termal seçim hesabı yazılmıyor
7. Excel dosyalarının **güncel ve eksiksiz** kopyası Ensotek'ten geliyor
8. Malzeme normalizasyonu ve doğrulama onayı **Ensotek ile birlikte** yapılıyor
9. Arayüz **yalnız Türkçe** (çok dillilik Faz 5)
10. Barındırma bizim VPS'te

---

## 10. Şimdi ne yapılacak

| Sıra | İş | Kim |
|---|---|---|
| 1 | **Excel dosyalarını iste** | Sen → Hamdi Bey |
| 2 | Dosyalara bakarak S-02 / S-03 cevaplansın | Biz |
| 3 | Seçim yazılımı erişimi sorulsun (S-01) | Sen → Hamdi Bey |
| 4 | Efor aralığı daraltılsın | Biz |
| 5 | **Hamdi Bey'e gidecek PDF raporu** | Biz |
| 6 | Fiyat | Sen |

> **PDF raporu için not:** Bu belgedeki efor tahminleri, risk tablosu ve kaynak proje
> isimleri **rapora girmez**. Rapor; mevcut durum analizi, önerilen sistem, modüller,
> faz planı ve Ensotek'ten beklenenler üzerine kurulur.

---

**İlgili:** [Modül Planı](ENSOTEK-ERP-MODUL-PLANI.md) ·
[Kapsam](analiz/03-kapsam-taslagi.md) ·
[Açık Sorular](analiz/04-acik-sorular.md) ·
[Yeniden Kullanım](analiz/05-modul-envanteri-yeniden-kullanim.md) ·
[Veri Göçü](analiz/07-excel-veri-gocu.md)
