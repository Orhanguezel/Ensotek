# ANALİZ-02 · İhtiyaç Listesi

> **Amaç:** Kapsam ve fiyat için sayılabilir gereksinim envanteri.
> Her madde kaynağına bağlıdır. **Kaynak sütunu bu belgenin en önemli sütunudur.**

## Kaynak etiketleri

| Etiket | Anlamı | Fiyata etkisi |
|---|---|---|
| **[H]** | **Hamdi Bey açıkça söyledi** — teyitli gereksinim | Kapsama girer |
| **[H-ç]** | Hamdi Bey'in anlatımından **doğrudan çıkarım** (süreç zaten böyle işliyor) | Kapsama girer, teyit edilir |
| **[Ö]** | **ChatGPT önerisi** — Ensotek onayı YOK | Kapsam dışı sayılır, opsiyon olarak fiyatlanır |
| **[X]** | **Açıkça istenmedi / hariç tutuldu** | Kapsam dışı |
| **[K]** | **Orhan'ın kapsam kararı** (2026-08-18) — Ensotek anlatımında yok, biz ekliyoruz | Kapsama girer |

> ⚠️ **Kapsam kararı (2026-08-18):** *"Tamamını hatta fazlasıyla yapacağız."*
> Bu karardan sonra **[Ö] etiketli 26 madde artık opsiyon değil, kapsam içidir.**
> Etiket, maddenin **nereden geldiğini** göstermeye devam eder — Ensotek'in kendi
> talebi ile bizim eklediğimizi ayırt edebilmek için. Fiyat aşamasında bu ayrım
> tekrar işe yarar.

`H-09` gibi referanslar → [KAYNAK-02](../kaynak/02-hamdi-anlatimi-ham-kayit.md) blok numarası.

---

## MOD-01 · Talep ve CRM

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-101 | Talep kaydı; kanal seçimi: **e-posta, telefon, WhatsApp** | [H] | H-09 |
| IHT-102 | Talep tipi ayrımı: **soğutma kulesi** / **yedek malzeme** | [H] | H-09 |
| IHT-103 | Talebin bir **satış personeline atanması** ("biri bu işi üzerine alıyor") | [H] | H-09 |
| IHT-104 | Müşteri/firma kartı: firma, ilgili kişi, ad-soyad, şirket bilgileri | [H] | H-09, H-10 |
| IHT-105 | Gelen talep içeriğinin (mail/WhatsApp) kayda eklenmesi | [H] | H-09 |
| IHT-106 | Teklif takibi — "günler içinde ara ara takip" için hatırlatma/zaman çizelgesi | [H-ç] | H-09 |
| IHT-107 | Teklif kartında iletişim geçmişi sekmesi (gelen/giden mail, telefon notu) | [Ö] | — |
| IHT-108 | WhatsApp **entegrasyonu** (otomatik gönderim/okuma) | [Ö] | — |

---

## MOD-02 · Teklif

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-201 | **Teklif takip numarası** otomatik üretimi (bugün Excel sırası) | [H] | H-09 |
| IHT-202 | **Revizyon numarası** yönetimi | [H] | H-09 |
| IHT-203 | Model seçildikten sonra **ölçü/ağırlık gibi standart değerlerin otomatik gelmesi** ("model belli olunca ölçüler değişmiyor") | [H-ç] | H-09 |
| IHT-204 | Projeye göre değişen alanlar: **sıcaklıklar, debiler, kcal değerleri** | [H] | H-09 |
| IHT-205 | **Standart dışı özelliklerin kırmızı renkle** gösterimi (teklifte ve formda) | [H] | H-09 |
| IHT-206 | Kapsam kalemleri: **nakliye kimde, kurulum kimde, vinç kimde** | [H] | H-09 |
| IHT-207 | Opsiyonel kalem: **pano** (fiyatı ayrı hesaplanıp 2. kalem olarak eklenir) | [H] | H-09 |
| IHT-208 | Opsiyonel kalem: **su şartlandırma sistemi** | [H] | H-09 |
| IHT-209 | Süpervizörlük şartlarının teklife yazılması: 1 süpervizör Ensotek, 4–5 yardımcı personel müşteri, süre, otel müşteride | [H] | H-09 |
| IHT-210 | **Teknik teklif PDF** ve **ticari teklif PDF** ayrı üretimi | [H] | H-06, H-09 |
| IHT-211 | **Birleşik tek PDF** üretimi (müşteri başkasına vermeyecekse) | [H] | H-09 |
| IHT-212 | **İç maliyet PDF'i** (Ensotek'e özel, müşteriye gitmez) | [H] | H-05, H-09 |
| IHT-213 | Teklifin **e-posta ile gönderilmesi** (%90 kanal) | [H] | H-09 |
| IHT-214 | Teklifin WhatsApp'la gönderilmesi (manuel/dosya indirme yeterli olabilir) | [H] | H-09 |
| IHT-215 | **Otomatik arşiv klasörü**: teklif PDF + maliyet PDF + gönderilen mail + gelen talep, teklif no altında | [H] | H-09 |
| IHT-216 | Teknik teklifin **kilitlenmesi** (satış fiyatı değiştirir, teknik değiştiremez) | [Ö] | — |
| IHT-217 | Teklif durum akışı (bekliyor / görüşmede / revize / kazanıldı / kaybedildi) + kazanma oranı | [Ö] | — |
| IHT-218 | "Benzer projeden kopyala" | [Ö] | — |
| IHT-219 | **Çok dilli teklif çıktısı** (TR/EN) | [Ö] | — |

---

## MOD-03 · Maliyet — **en kritik modül**

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-301 | Ürün ağacı kalemlerinin maliyetlerinin sistemden okunması | [H] | H-03 |
| IHT-302 | Malzeme **birim fiyat kartı** (bugünkü "birim fiyat Excel"inin yerine geçer) | [H] | H-12 |
| IHT-303 | **İşçilik maliyeti:** adam-gün, harcırah, SGK/sigorta, yemek — ürün ağacında satır olarak | [H] | H-12 |
| IHT-304 | **Çarpan (kâr katsayısı)** girişi | [H] | H-09 |
| IHT-305 | **Pazarlık payı** (%3–5) girişi | [H] | H-09 |
| IHT-306 | **Euro kuru** otomatik okunması ve EUR bazlı fiyat | [H] | H-09 |
| IHT-307 | **Teklif anı maliyetinin dondurulması (snapshot)** — teklif gönderildiği andaki maliyet sonradan değişmeden görülebilmeli | [H] | H-05 |
| IHT-308 | Teklif anı maliyetin **tablo veya PDF olarak** saklanması | [H] | H-05 |
| IHT-309 | **Güncel maliyet** ile teklif anı maliyetin karşılaştırılması | [H-ç] | H-05 |
| IHT-310 | Tedarik siparişlerinden **güncel maliyetin beslenmesi** | [H] | H-03 |
| IHT-311 | Kâr oranı belirleyip **teklif fiyatının hesaplanması** | [H] | H-03 |
| IHT-312 | Gerçekleşen (fiili) maliyet ve kârlılık analizi | [Ö] | — |
| IHT-313 | Fiyat simülasyonu (%15/%18/%22 senaryoları) | [Ö] | — |
| IHT-314 | Maliyet onay sistemi (toplu fiyat değişikliğinde yönetici onayı) | [Ö] | — |
| IHT-315 | 3 katmanlı maliyet: malzeme / işçilik / dolaylı gider | [Ö] | — |

---

## MOD-04 · Ürün Ağacı (BOM)

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-401 | Model bazlı **standart ürün ağacı** (~100 açık tip + 30–40 kapalı tip) | [H] | H-12 |
| IHT-402 | **Çok seviyeli BOM** — bir BOM kalemi başka bir ürünün BOM'unu çağırabilmeli | [H] | H-13 |
| IHT-403 | **CTP gövde kg-bazlı maliyet**: `CTP maliyeti = 270 kg × birim kg fiyatı` | [H] | H-13 |
| IHT-404 | CTP kalemlerinin (duvar, çatı, havuz) **kendi reçeteleri**nden kg maliyetinin hesaplanması | [H] | H-13 |
| IHT-405 | **Serpantin ayrı ürün ağacı**: model × kat sayısı (3/4/5 katlı) | [H] | H-12 |
| IHT-406 | Serpantin maliyetinin kapalı kule BOM'una **tek kalem** olarak girmesi | [H] | H-12 |
| IHT-407 | Alt BOM'ların **otomatik okunması** (kullanıcı tek tek açmasın) | [H] | H-13 |
| IHT-408 | Modeller arası benzerlik: aynı iskelet, değişen **miktar / motor gücü / fan çapı / adam-gün** → parametrik veya kopyala-türet yapı | [H] | H-12 |
| IHT-409 | Hücre çeşitlemesi: 1/2/3/4 hücreli türevler (`TCTP30` = 3 hücreli 30) | [H] | H-12 |
| IHT-410 | Projeye özel BOM: standart BOM kopyalanır, projeye özel değiştirilir, **standart bozulmaz** | [Ö] | — |
| IHT-411 | BOM revizyon geçmişi (kim, ne zaman, eski hali) | [Ö] | — |

---

## MOD-05 · Ürün Kataloğu ve Stok

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-501 | Ürün gamı: **açık tip** (CTP1–CTP30, aralarda boşluk) + **kapalı tip** | [H] | H-12 |
| IHT-502 | **Evaporatif kondenser** = kapalı tip kulenin farklı hesapla adlandırılmış hali (ayrı ürün değil) | [H] | H-12 |
| IHT-503 | **Yarı mamul / yedek parça satışı**: motor, fan, redüktör, havuz, serpantin | [H] | H-13 |
| IHT-504 | **Stok kodu sistemi** — bugün yok, kurulacak ("yapılabilir, zor bir şey değil") | [H] | H-12 |
| IHT-505 | Stok takibi — bugün gözle; sistemde tutulacak | [H] | H-12 |
| IHT-506 | Kritik kalemlerde (fan, motor, redüktör) **stok azaldı uyarısı** | [H-ç] | H-12 |
| IHT-507 | Depo giriş/çıkış, projeye zimmetleme | [Ö] | — |
| IHT-508 | Seri numarası / lot takibi | [Ö] | — |

---

## MOD-06 · Satın Alma

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-601 | Stokta olmayan kalemler için **satın alma siparişi** açılması | [H] | H-10 |
| IHT-602 | Satın alma siparişlerinin **maliyeti beslemesi** | [H] | H-03 |
| IHT-603 | Malzeme listesi oluşturulurken **otomatik stok kontrolü ve eksik listesi** | [H-ç] | H-10 |
| IHT-604 | Tedarikçi kartları, fiyat geçmişi, son alış / ortalama fiyat seçimi | [Ö] | — |

---

## MOD-07 · Siparişe Dönüşüm ve Üretime Teslim

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-701 | Teklifin **işe dönüştürülmesi** | [H] | H-01, H-10 |
| IHT-702 | **ENK / ENB iş numarası** üretimi (ENK: küçük iş + malzeme, ENB: büyük iş) | [H] | H-10 |
| IHT-703 | İş kaydına firma, ilgili, ürün, **fiyat** girilmesi | [H] | H-10 |
| IHT-704 | **Ödeme planı** kaydı | [H] | H-10 |
| IHT-705 | **Avans kontrolü:** avans isteniyorsa gelmeden üretime teslim edilemez | [H] | H-10 |
| IHT-706 | **Teklif İnceleme Formu**'nun dijitalleşmesi (ürün, iş no, standart dışı notlar) | [H] | H-10 |
| IHT-707 | Formun + teklifin + maliyetin + yazışmaların üretim ofisine **sistem üzerinden** devri (elden çıktı yerine) | [H-ç] | H-10 |
| IHT-708 | İmalat müdürünün işi bir mühendise **ataması** | [H] | H-10 |
| IHT-709 | Kişi başına düşen açık proje sayısının görülmesi | [Ö] | — |

---

## MOD-08 · Mühendislik

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-801 | **AutoCAD genel görünüş projesi** dosyasının işe bağlanması (DWG/PDF) | [H] | H-10 |
| IHT-802 | **Müşteriye sorulan teknik soruların** ve cevaplarının kaydı | [H] | H-10 |
| IHT-803 | **Malzeme listesi** oluşturma — bugünkü en büyük imalat darboğazı | [H] | H-10, H-12 |
| IHT-804 | Mevcut **web tabanlı seçim yazılımının** entegrasyonu (giriş/çıkış sıcaklığı, yaş termometre, debi → m² ve model) | [H] | H-09 |
| IHT-805 | Doküman yönetimi (STEP, 3D, sertifika, CE) | [Ö] | — |

---

## MOD-09 · Üretim

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-901 | **İş emri** oluşturma ve atölyelere dağıtım: **kaynak / polyester / montaj** | [H] | H-10 |
| IHT-902 | Yönlendirme mantığı: yarı mamul stokta ise doğrudan montaj; değilse polyester; kapalı kule + serpantin yoksa kaynak | [H] | H-10 |
| IHT-903 | Montaj atölyesinin **stoktan malzeme çekmesi** (motor, fan vb.) | [H] | H-10 |
| IHT-904 | Polyester atölyesi kalemleri: yan duvar, çatı, havuz, CTP baca | [H] | H-10 |
| IHT-905 | Metal imalat: metal baca, motor altı taşıyıcı sistem (genelde stokta) | [H] | H-10 |
| IHT-906 | Atölyelerin **iş tamamlandı** bildirimi / üretim durumu takibi | [H-ç] | H-10 |
| IHT-907 | İş emirlerinin tablet/mobil ekrandan kapatılması | [Ö] | — |
| IHT-908 | Barkod / QR kod | [Ö] | — |

---

## MOD-10 · Kalite

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-1001 | Serpantin **basınç testi** kaydı (hava basılır, kaçak kontrolü) | [H] | H-10 |
| IHT-1002 | **Galvaniz** sevk/dönüş takibi | [H] | H-10 |
| IHT-1003 | Galvaniz dönüşü **tekrar test** kaydı | [H] | H-10 |
| IHT-1004 | Test formları, fotoğraf, PDF rapor, CE evrakı | [Ö] | — |

---

## MOD-11 · Sevkiyat ve Tahsilat

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-1101 | **ENB işlerde toparlama/paketleme** kaydı: paletleme, streçleme, çuvallama | [H] | H-10 |
| IHT-1102 | Sevkiyat kaydı: **TIR / konteyner / kamyon** | [H] | H-10 |
| IHT-1103 | **Sevkiyat öncesi tahsilat zorunluysa** uyarı/blok | [H] | H-10 |
| IHT-1104 | **Fatura + irsaliye** kesim adımının süreçte yer alması | [H] | H-10 |
| IHT-1105 | Vadeli satışta **ödeme sonradan takip** | [H] | H-10 |
| IHT-1106 | Yükleme listesi, palet/koli sayısı, konteyner no, plaka, fotoğraf | [Ö] | — |

---

## MOD-12 · Süpervizörlük ve Servis

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-1201 | **Süpervizörlük hizmetinin yönetimi** — saha kurulum aşaması | [H] | H-03 |
| IHT-1202 | **Bakım aşamasının yönetimi** | [H] | H-03 |
| IHT-1203 | Büyük kule (ENB) → demonte sevk → süpervizör; paket tip → müşteri kurar, istenirse Ensotek gider | [H] | H-09 |
| IHT-1204 | Servis taleplerinin **uzun vadede** gelmesi — geçmişe erişim şart | [H] | H-12 |
| IHT-1205 | Süpervizör seyahat/otel/harcırah planı, mobil rapor, fotoğraf, müşteri imzası | [Ö] | — |
| IHT-1206 | Garanti takibi ve hatırlatma | [Ö] | — |

---

## MOD-13 · Sistem Geneli

| ID | Gereksinim | Kaynak | Ref |
|---|---|---|---|
| IHT-1301 | **Web tabanlı**, uzaktan erişilebilir | [H] | H-02 |
| IHT-1302 | Kullanıcı / rol / yetki (satış kendi tekliflerini görür vb.) | [H-ç] | H-09 |
| IHT-1303 | **Proje kartı** — bir iş numarası altında tüm zincirin tek ekranda görülmesi | [H-ç] | H-01, H-09, H-10 |
| IHT-1304 | Firma adı yazımı: **Ensotek** (K ile, Türkçe karakter) | [H] | H-04 |
| IHT-1305 | Dashboard / yönetim raporları | [Ö] | — |
| IHT-1306 | Görev yönetimi modülü | [Ö] | — |
| IHT-1307 | Mobil kullanım (PWA) | [Ö] | — |

---

## MOD-14 · Firma Bulma *(yeni — K)*

> Kaynak: **ihracatradari.com.tr** `enrichment`, `decision-makers`, `scans`, `scoring`, `crm`, `customs` + Google-Maps-Scrapper

| ID | Gereksinim | Kaynak |
|---|---|---|
| IHT-1401 | Potansiyel müşteri (soğutma kulesi kullanan tesis) keşfi ve listeye alma | [K] |
| IHT-1402 | Firma zenginleştirme: iletişim, sektör, ölçek, web/sosyal veri | [K] |
| IHT-1403 | **Karar verici** tespiti ve iletişim bilgisi | [K] |
| IHT-1404 | Firma skorlama — Ensotek'e uygunluk (sektör, kapasite ihtiyacı, bölge) | [K] |
| IHT-1405 | Bulunan firmanın **tek tuşla CRM'e / talebe dönüşmesi** | [K] |
| IHT-1406 | Tarama işleri (scan) ve periyodik yenileme | [K] |
| IHT-1407 | KVKK / veri yaşam döngüsü uyumu (kaynak projede politika mevcut) | [K] |

---

## MOD-15 · Navlun ve Lojistik *(yeni — K)*

> Kaynak: **ihracatradari `commercial/calculation-engine`** — karton/palet dönüşümü, ölçü, net/brüt ağırlık, palet darası, `freight`, `defaultIncoterm: EXW|FOB|CIF`, `packing-list`

| ID | Gereksinim | Kaynak |
|---|---|---|
| IHT-1501 | Kule/parça bazlı **hacim ve ağırlık** hesabı (net, brüt, dara) | [K] |
| IHT-1502 | **TIR / konteyner sığdırma** hesabı — paket tip mi, demonte mi | [K] + [H] H-09 |
| IHT-1503 | Demonte sevkiyatta **palet / koli / çuval** planı | [K] + [H] H-10 |
| IHT-1504 | **Navlun maliyeti** hesabı ve teklife kalem olarak yansıtılması | [K] |
| IHT-1505 | **Incoterm** seçimi (EXW / FOB / CIF …) ve teklifte gösterimi | [K] |
| IHT-1506 | **Packing list** ve yükleme belgesi üretimi | [K] |
| IHT-1507 | Nakliye kimde sorusunun (IHT-206) navlun hesabıyla bağlanması | [K] |
| IHT-1508 | Taşıyıcı/nakliyeci kartları ve fiyat geçmişi | [K] |

---

## MOD-16 · Personel Yönetimi *(yeni — K)*

> Kaynak: **osgb-yazilim** `personel`, `calisan`, `evrak`, `atama`, `kpi`, `saglik` + transpalet `personel`, `vardiya_analizi`

| ID | Gereksinim | Kaynak |
|---|---|---|
| IHT-1601 | Personel kartı: kimlik, görev, departman, atölye | [K] |
| IHT-1602 | Departman / atölye yapısı (satış, imalat ofisi, kaynak, polyester, montaj, depo, satın alma, servis) | [K] + [H] H-10 |
| IHT-1603 | **Vardiya** ve devam takibi | [K] |
| IHT-1604 | Personel evrakı (sözleşme, sertifika, İSG belgesi) ve süre takibi | [K] |
| IHT-1605 | İşe/projeye **atama** ve kişi başı iş yükü görünümü | [K] |
| IHT-1606 | **Adam-gün maliyetinin gerçek personel verisine bağlanması** (MOD-03 besleme) | [K] + [H] H-12 |
| IHT-1607 | Süpervizör havuzu ve saha görevlendirmesi (MOD-12 ile ortak) | [K] |
| IHT-1608 | Personel KPI / performans göstergeleri | [K] |
| IHT-1609 | ❌ Maaş bordrosu hesaplama | **kapsam dışı** |

---

## MOD-17 · Bakım Yönetimi — fabrika ekipmanı *(yeni — K)*

> Kaynak: transpalet/paspas `makine_havuzu`, `makine_verileri`, `makine_kapali_araliklar`
> **Not:** Satılan kulenin bakımı MOD-12'de; bu modül **Ensotek'in kendi fabrika ekipmanı**.

| ID | Gereksinim | Kaynak |
|---|---|---|
| IHT-1701 | Makine / ekipman envanteri | [K] |
| IHT-1702 | **Periyodik bakım planı** ve hatırlatma | [K] |
| IHT-1703 | Arıza kaydı, duruş süresi, kapalı aralık | [K] |
| IHT-1704 | Bakım maliyeti → dolaylı gider olarak MOD-03'e yansıma | [K] |
| IHT-1705 | Yedek parça stoğu (MOD-05 ile ortak) | [K] |

---

## MOD-18 · Fabrika Yönetimi *(yeni — K)*

> Kaynak: transpalet/paspas `is_yukler`, `gantt`, `vardiya_analizi`, `operator`, `dashboard`

| ID | Gereksinim | Kaynak |
|---|---|---|
| IHT-1801 | **Atölye kapasitesi** tanımı (kaynak, polyester, montaj, metal) | [K] |
| IHT-1802 | İş yükü dağılımı ve **darboğaz görünümü** | [K] |
| IHT-1803 | Üretim planı / **Gantt** — hangi iş hangi atölyede, ne zaman | [K] |
| IHT-1804 | Termin tarihi hesabı ve gecikme uyarısı | [K] |
| IHT-1805 | Atölye bazlı performans (planlanan vs gerçekleşen adam-gün) | [K] |
| IHT-1806 | Fabrika geneli canlı üretim durumu ekranı | [K] |

---

## MOD-19 · Satış Yönetimi *(yeni — K)*

> Kaynak: transpalet `crm` + gzl-gelir-crm pipeline

| ID | Gereksinim | Kaynak |
|---|---|---|
| IHT-1901 | Satış **pipeline** ve fırsat aşamaları | [K] |
| IHT-1902 | Satış personeli bazlı portföy ve aktivite | [K] |
| IHT-1903 | **Kazanma / kaybetme** analizi ve kayıp nedeni | [K] + [Ö] IHT-217 |
| IHT-1904 | Satış hedefi ve gerçekleşme | [K] |
| IHT-1905 | Müşteri bazlı satış geçmişi ve tekrar satış fırsatı | [K] |
| IHT-1906 | ❌ Prim / komisyon hesabı | **kapsam dışı — OUT-01** |

---

## MOD-20 · Muhasebe / Maliyet Muhasebesi *(yeni — K)*

> Kaynak: **e-fatura-service** (ayrı servis) + transpalet `logo_entegrasyon`

| ID | Gereksinim | Kaynak |
|---|---|---|
| IHT-2001 | **Cari hesap** (müşteri / tedarikçi) | [K] |
| IHT-2002 | **Ödeme planı** ve vade takibi | [K] + [H] H-10 |
| IHT-2003 | **Avans** kaydı ve üretime teslim bloğuyla bağı | [K] + [H] H-10 |
| IHT-2004 | Tahsilat kaydı ve sevkiyat öncesi kontrol | [K] + [H] H-10 |
| IHT-2005 | **Fatura + irsaliye** kesimi | [K] + [H] H-10 |
| IHT-2006 | **e-fatura entegrasyonu** (mevcut `e-fatura-service` ile) | [K] |
| IHT-2007 | Tedarikçi faturası ve satın alma maliyeti eşleşmesi | [K] |
| IHT-2008 | **Gerçekleşen maliyet muhasebesi** — proje bazlı fiili maliyet | [K] + [Ö] IHT-312 |
| IHT-2009 | Proje kârlılığı: teklif ↔ güncel ↔ gerçekleşen | [K] + [Ö] IHT-312 |
| IHT-2010 | Kur farkı yönetimi (EUR bazlı teklif, TL maliyet) | [K] |
| IHT-2011 | Harici muhasebe programı köprüsü (Logo vb.) → [S-07](04-acik-sorular.md) | [K] |
| IHT-2012 | ❌ Yasal defter, beyanname, mali müşavirlik | **kapsam dışı** |

---

## MOD-21 · Yönetim ve Raporlama *(genişletildi)*

| ID | Gereksinim | Kaynak |
|---|---|---|
| IHT-2101 | Yönetici dashboard'u: açık teklif, devam eden üretim, sevk bekleyen, geciken iş | [Ö] IHT-1305 |
| IHT-2102 | Aylık satış ve kârlılık grafikleri | [K] |
| IHT-2103 | Modül bazlı raporlar ve Excel dışa aktarma | [K] |
| IHT-2104 | Fiyat simülasyonu (kâr senaryoları) | [Ö] IHT-313 |
| IHT-2105 | Maliyet onay sistemi (toplu fiyat değişikliğinde yönetici onayı) | [Ö] IHT-314 |
| IHT-2106 | Görev yönetimi | [Ö] IHT-1306 |
| IHT-2107 | Çok dilli arayüz ve çıktı (TR/EN) | [Ö] IHT-219 |
| IHT-2108 | PWA / mobil saha kullanımı | [Ö] IHT-1307, IHT-907 |
| IHT-2109 | Barkod / QR kod | [Ö] IHT-908 |
| IHT-2110 | Seri numarası ve lot takibi | [Ö] IHT-507/508 |

---

## Kapsam dışı — açıkça

| ID | Konu | Gerekçe |
|---|---|---|
| **[X] OUT-01** | **Prim hesabı** | Hamdi Bey: *"bu primi şimdilik sen sistemde tutma"* (H-10) |

---

## Sayısal özet

**Toplam 173 gereksinim satırı, 21 modül.**

| Kaynak | Satır | Anlamı |
|---|---:|---|
| **[H]** Hamdi Bey teyitli | 83 | Ensotek'in kendi anlattığı süreç |
| **[H-ç]** Anlatımdan çıkarım | 9 | Teyit edilecek |
| **[Ö]** ChatGPT önerisi | 37 | v0.2 ile **kapsama alındı** (26'sı özgün, kalanı yeni modüllerden çapraz referans) |
| **[K]** Orhan kapsam kararı | 52 | Firma bulma, navlun, personel, bakım, fabrika, satış, muhasebe |

> Bir satır birden çok etiket taşıyabilir (örn. `[K] + [H]` — biz ekledik ama Ensotek'in
> anlattığı bir ihtiyaca da denk geliyor). Bu yüzden sütun toplamı 173'ü aşar.

### Modül dağılımı

| Faz | Modüller | Gereksinim |
|---|---|---:|
| **0** | MOD-00 Altyapı | *(iskelet — [ANALİZ-06](06-mimari-iskelet.md))* |
| **1** | MOD-01, 02, 03, 04 | 53 |
| **2** | MOD-05, 06, 07, 08 | 26 |
| **3** | MOD-09, 10, 11, 15 | 26 |
| **4** | MOD-12, 16, 17, 18 | 26 |
| **5** | MOD-14, 19, 20, 21 | 35 |
| — | MOD-13 Sistem geneli | 7 |

---

## Kapsam dışı — açıkça

| ID | Konu | Gerekçe |
|---|---|---|
| **OUT-01** | **Prim / komisyon hesabı** | Hamdi Bey: *"bu primi şimdilik sen sistemde tutma"* (H-10) |
| **OUT-02** | **Maaş bordrosu hesaplama** | Personel yönetimi var, bordro motoru yok (IHT-1609) |
| **OUT-03** | **Yasal defter, beyanname, mali müşavirlik** | Muhasebe modülü operasyonel; resmi mali işler harici (IHT-2012) |
| **OUT-04** | **Termal seçim/hesap motorunun sıfırdan yazılması** | Mevcut seçim yazılımı entegre edilir → [S-01](04-acik-sorular.md) |
| **OUT-05** | **Canlı taşıyıcı navlun fiyat borsası** | Navlun hesaplanır, dış fiyat servisi çekilmez |

> **Fiyat aşaması** ([ANALİZ-03 §7](03-kapsam-taslagi.md)) en sona bırakıldı.
> Etiket ayrımı orada tekrar işe yarayacak: Ensotek'in kendi talebi ile bizim
> eklediğimiz kapsam ayrı ayrı gösterilebilir.
