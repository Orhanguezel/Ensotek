# ANALİZ-03 · Kapsam Taslağı (SCOPE v0.1)

> **Durum:** Taslak. Ensotek onayı alınmadı. **Fiyat verilmedi.**
> **Girdi:** [Mevcut Durum](01-mevcut-durum-as-is.md) + [İhtiyaç Listesi](02-ihtiyac-listesi.md)
> **Karar bekleyenler:** [Açık Sorular](04-acik-sorular.md)

---

## 1. Ürün tanımı

**Ensotek ERP** — su soğutma kulesi üretimi için **proje bazlı** teklif, maliyet, üretim,
sevkiyat ve servis yönetim sistemi. Web tabanlı, uzaktan erişilebilir.

**Sistemin merkezindeki nesne "Proje"dir.** Bir talep geldiğinde proje açılır; teklif,
revizyonlar, maliyet, iş numarası, malzeme listesi, iş emirleri, kalite kayıtları,
sevkiyat, tahsilat ve servis aynı proje altında yaşar. Bugün bu bağı klasör adı ve
insan hafızası kuruyor.

---

## 2. Sistem ne DEĞİL

Bunu baştan yazmak fiyatı ve beklentiyi korur.

| | |
|---|---|
| ❌ **Muhasebe/ön muhasebe programı değil** | Fatura ve irsaliye **kesim adımı süreçte yer alır**, ama e-fatura entegrasyonu ve resmi defter kapsam dışıdır. Karar bekliyor → [S-07](04-acik-sorular.md) |
| ❌ **Excel'in ekrana taşınmış hali değil** | Excel'ler arası manuel bağ, veritabanı ilişkisine dönüşür |
| ❌ **Bordro / prim / İK sistemi değil** | Hamdi Bey açıkça hariç tuttu (OUT-01) |
| ❌ **Termal seçim/hesap motoru değil** | Mevcut seçim yazılımı **entegre edilir**, sıfırdan yazılmaz → [S-01](04-acik-sorular.md) |
| ❌ **CAD sistemi değil** | AutoCAD dosyaları **eklenir ve projeye bağlanır**, çizim yapılmaz |

---

## 3. Modül haritası

| Kod | Modül | Teyitli ihtiyaç | Faz |
|---|---|---|---|
| MOD-01 | Talep ve CRM | 6 | **1** |
| MOD-02 | Teklif | 15 | **1** |
| MOD-03 | Maliyet | 11 | **1** |
| MOD-04 | Ürün Ağacı (BOM) | 9 | **1** |
| MOD-05 | Ürün Kataloğu ve Stok | 6 | **2** |
| MOD-06 | Satın Alma | 3 | **2** |
| MOD-07 | Siparişe Dönüşüm / Üretime Teslim | 8 | **2** |
| MOD-08 | Mühendislik | 4 | **2** |
| MOD-09 | Üretim ve İş Emirleri | 6 | **3** |
| MOD-10 | Kalite | 3 | **3** |
| MOD-11 | Sevkiyat ve Tahsilat | 5 | **3** |
| MOD-12 | Süpervizörlük ve Servis | 4 | **4** |
| MOD-13 | Sistem Geneli (yetki, proje kartı) | 4 | **1** |

---

## 4. Fazlama — neden bu sıra

Sıra, Ensotek'in **beyan ettiği darboğazlara** göre kuruldu
([AS-IS §6](01-mevcut-durum-as-is.md)); modül listesine göre değil.

### FAZ 1 — Teklif + Maliyet motoru ⭐ *en yüksek getiri*
> Darboğaz D-1 (teklif hazırlama), D-2 (maliyet analizi), D-3 (gönderme) — üçü de burada.
> Ensotek'in bugün **en çok vakit kaybettiği** yer. Faz 1 tek başına canlıya alınabilir
> ve Excel'lerin çoğunu emekliye ayırır.

Kapsam: MOD-01, MOD-02, MOD-03, MOD-04, MOD-13
- Talep kaydı (e-posta/telefon/WhatsApp) ve satış personeline atama
- Teklif takip no + revizyon yönetimi
- Model seçimi → standart değerlerin otomatik gelmesi
- Standart dışı özelliklerin kırmızı işaretlenmesi
- Ürün ağacı: çok seviyeli BOM, serpantin alt ağacı, CTP kg-bazlı maliyet
- Birim fiyat kartları + işçilik (adam-gün, harcırah, SGK, yemek)
- Çarpan + pazarlık payı + Euro kuru → fiyat
- **Teklif anı maliyet snapshot'ı**
- Teknik PDF / Ticari PDF / Birleşik PDF / İç maliyet PDF
- E-posta gönderimi + otomatik arşiv
- Kullanıcı, rol, yetki; proje kartı iskeleti

**Faz 1 çıktısı:** *"Müşteri → Model → Teknik veriler → Hesapla → Teklif hazır."*

### FAZ 2 — Siparişe dönüşüm + Mühendislik + Satın alma
> Darboğaz D-4 (malzeme listesi — "uzun zaman alıyor") burada çözülür.

Kapsam: MOD-05, MOD-06, MOD-07, MOD-08
- İşe dönüşüm, ENK/ENB iş numarası, ödeme planı
- **Avans kontrolü** (avans gelmeden üretime teslim engeli)
- Teklif İnceleme Formu'nun dijitalleşmesi → Word ve elden teslim ortadan kalkar
- İş atama (imalat müdürü → mühendis)
- AutoCAD dosya bağlama, müşteriye sorulan teknik soruların kaydı
- **Malzeme listesi + otomatik stok kontrolü + eksik listesi**
- Stok kodu sisteminin kurulması, stok kartları
- Satın alma siparişi → maliyeti besleme

### FAZ 3 — Üretim + Kalite + Sevkiyat
> Darboğaz D-5 (iş emri hazırlama/dağıtma) ve D-6 (evrak).

Kapsam: MOD-09, MOD-10, MOD-11
- İş emri → kaynak / polyester / montaj dağıtımı ve yönlendirme mantığı
- Atölye tamamlandı bildirimi, üretim durumu
- Serpantin: basınç testi → galvaniz → tekrar test
- ENB toparlama/paketleme, sevkiyat (TIR/konteyner/kamyon)
- Sevkiyat öncesi tahsilat kontrolü, fatura/irsaliye adımı

### FAZ 4 — Süpervizörlük + Servis
> Darboğaz D-7. Servis talepleri uzun vadede geldiği için en son gelebilir,
> ama **Faz 1'de kurulan proje geçmişi** bu modülün ön şartıdır.

Kapsam: MOD-12

---

## 5. Opsiyon listesi (ayrı fiyatlanır)

ChatGPT'nin önerdiği, **Ensotek'in henüz onaylamadığı** kalemler. Ana fiyata dahil değil.

| Kod | Opsiyon | İlgili IHT |
|---|---|---|
| OPS-01 | Gerçekleşen maliyet + kârlılık analizi (teklif / güncel / fiili karşılaştırma) | IHT-312 |
| OPS-02 | Fiyat simülasyonu (kâr senaryoları) | IHT-313 |
| OPS-03 | Maliyet onay sistemi (toplu fiyat değişikliğinde yönetici onayı) | IHT-314 |
| OPS-04 | Teknik teklif kilidi + ayrı teknik/ticari revizyon izleri | IHT-216 |
| OPS-05 | Teklif durum akışı + kazanma/kaybetme analizi | IHT-217 |
| OPS-06 | "Benzer projeden kopyala" | IHT-218 |
| OPS-07 | **Çok dilli (TR/EN) arayüz ve teklif çıktısı** | IHT-219 |
| OPS-08 | Tedarikçi yönetimi, fiyat geçmişi, son alış/ortalama fiyat seçimi | IHT-604 |
| OPS-09 | Seri numarası / lot takibi, projeye zimmet | IHT-507/508 |
| OPS-10 | Mobil / tablet iş emri kapatma (PWA) | IHT-907, IHT-1307 |
| OPS-11 | Barkod / QR kod | IHT-908 |
| OPS-12 | Yönetim dashboard'u ve grafikler | IHT-1305 |
| OPS-13 | Görev yönetimi modülü | IHT-1306 |
| OPS-14 | Doküman yönetimi (STEP/3D/CE/sertifika) | IHT-805 |
| OPS-15 | Garanti takibi ve otomatik hatırlatma | IHT-1206 |
| OPS-16 | Süpervizör seyahat planı, mobil rapor, müşteri imzası | IHT-1205 |
| OPS-17 | WhatsApp entegrasyonu | IHT-108 |
| OPS-18 | Teklif kartında birleşik iletişim geçmişi (mail/telefon/WhatsApp) | IHT-107 |

---

## 6. Teknoloji kararı — **öneri**

ChatGPT görüşmede **ASP.NET Core + MSSQL + Blazor/React** önerdi. Bu bizim için
**tavsiye değil**: workspace'te bu stack'te üretim tecrübesi ve altyapı yok.

**Önerimiz — workspace standardı:**

| Katman | Seçim | Gerekçe |
|---|---|---|
| Frontend | **Next.js 16 + React 19 + TypeScript** | Workspace standardı; 9 canlı sitede kullanımda |
| Backend | **Fastify + TypeScript** | Workspace standardı |
| ORM / DB | **Drizzle ORM + MySQL** | Workspace standardı, seed-SQL disiplini kurulu |
| PDF | Sunucu tarafı PDF üretimi (teknik/ticari/iç maliyet şablonları) | 3 farklı şablon gerekiyor |
| Deploy | Docker + Nginx + PM2, VPS | Mevcut Ensotek VPS altyapısı |
| Erişim | Web + PWA | "Web tabanlı olsun, uzaktan da erişelim" (H-02) |

> **Not:** ERP iç ağda mı, internete açık mı çalışacak → [S-08](04-acik-sorular.md).
> Bu karar kimlik doğrulama, yedekleme ve fiyatı doğrudan etkiler.

---

## 7. Hâlâ kapsanmamış alanlar

Bunlar Hamdi Bey'in anlatımında **hiç geçmedi**. Fiyat vermeden önce sorulmalı:

- Muhasebe/ERP entegrasyonu (Logo, Netsis, Mikro?) → [S-07](04-acik-sorular.md)
- Mevcut Excel verilerinin **göçü** (~130 model ürün ağacı) → [S-03](04-acik-sorular.md)
- Kullanıcı sayısı ve departman listesi → [S-05](04-acik-sorular.md)
- Yedekleme, felaket kurtarma, eğitim, devreye alma desteği → [S-09](04-acik-sorular.md)
- Bakım/destek sözleşmesi → [S-10](04-acik-sorular.md)

---

## 8. Bu belgenin durumu

| Adım | Durum |
|---|---|
| Kaynak toplandı | ✅ |
| Mevcut durum (AS-IS) çıkarıldı | ✅ |
| İhtiyaç envanteri | ✅ 111 madde |
| Kapsam taslağı | ✅ v0.1 — **Ensotek onayı bekliyor** |
| Açık soruların cevaplanması | ⬜ |
| Efor tahmini | ⬜ |
| Fiyat teklifi | ⬜ |
| Geliştirme | ⬜ **başlamadı** |
