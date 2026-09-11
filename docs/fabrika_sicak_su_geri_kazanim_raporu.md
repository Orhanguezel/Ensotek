---
title: "Fabrikada Sıcak Soğutma Suyunun Geri Kazanımı"
subtitle: "Teknik çözüm, satın alma yaklaşımı ve tedarikçi karşılaştırması"
author: "Konuşma özetinden hazırlanmıştır"
date: "03.06.2026"
lang: tr-TR
---

# Yönetici özeti

Bu doküman, fabrikada soğutma amacıyla kullanılan sıcak suyun kanalizasyona gönderilmesi yerine soğutulup tekrar prosese verilmesi için konuşmada ele alınan teknik ve satın alma önerilerini bir araya getirir.

Ana öneri, mevcut tek kullanımlık soğutma suyu yaklaşımını **devridaimli soğutma sistemine** çevirmektir. Suyun temiz veya kirli olmasına göre iki farklı ana kurgu düşünülmelidir:

- **Su temizse:** sıcak su tankı, pompa, soğutma kulesi veya kuru soğutucu, soğuk su tankı ve tekrar proses hattı.
- **Su kirliyse, yağlıysa veya kimyasal içeriyorsa:** prosesi korumak için **plakalı eşanjörlü kapalı devre** sistem.

Satın alma tarafında, sadece bir soğutma kulesi almak yerine genelde komple sistem değerlendirilmelidir: **tank, pompa, eşanjör, filtre, kimyasal şartlandırma, blöf kontrolü ve otomasyon**. Firma seçimi sadece fiyata veya internetteki puana göre yapılmamalıdır. En önemli kriterler; yaz şartlarında performans garantisi, servis gücü, referans teyidi, yedek parça erişimi ve teklif kapsamıdır.

Konuşmadaki değerlendirmeye göre **Ensotek tercih edilebilir bir adaydır**, ancak karar vermeden önce **Cenk Endüstri, Form Freva, Niba** gibi alternatiflerden de aynı şartnameyle teklif alınması önerilmiştir. Daha yüksek bütçeli ve kritik proseslerde **BAC/BRC** veya **EVAPCO/TransKlima** gibi global markalar da referans teklif olarak değerlendirilmelidir. Su tüketimini minimuma indirmek isteniyorsa **Friterm** ve **TermoKar** dry cooler/chiller tarafında ayrıca incelenmelidir.

> Not: Firma iletişim bilgileri, puanlar ve ürün bilgileri konuşma sırasında açık kaynaklardan derlenmiş bilgilerdir. Satın alma öncesinde ilgili firmanın resmi sitesinden ve doğrudan firma temsilcisinden güncel olarak teyit edilmelidir.

# Başlangıç problemi

Fabrikada sürekli sıcak su çıkmaktadır. Bu su soğutma amacıyla kullanılmakta, sonrasında kanalizasyona gönderilmektedir. Amaç, bu suyu soğutup tekrar sisteme vermek ve böylece:

- şebeke/kuyu suyu tüketimini azaltmak,
- kanalizasyona deşarj miktarını azaltmak,
- proses sıcaklığını daha kontrollü hale getirmek,
- işletme maliyetlerini düşürmek,
- çevresel ve mevzuatsal uyumu iyileştirmektir.

Bu problemde en kritik ayrım şudur: sıcak su **temiz soğutma suyu** mu, yoksa prosesten kirlilik alan **kirli proses suyu** mu? Bu ayrım sistem seçimini doğrudan belirler.

# Teknik çözüm yaklaşımı

## Temiz su için temel devridaim sistemi

Suyunuz ürünle veya proses kimyasallarıyla temas etmiyorsa, en yalın sistem şu şekilde kurulabilir:

```text
Sıcak su dönüş hattı
  -> sıcak su toplama tankı
  -> sirkülasyon pompası
  -> soğutma kulesi veya kuru soğutucu
  -> soğuk su tankı
  -> tekrar prosese/makineye besleme
```

Bu yaklaşım, mevcut tek geçişli soğutma kullanımını devridaimli sisteme çevirir. Açık tip soğutma kulesi kullanılırsa su tamamen sıfır kayıpla dönmez; buharlaşma, blöf, sürüklenme ve kaçaklar için takviye su gerekir. Ancak kanalizasyona giden su miktarı ciddi şekilde azalabilir.

## Kirli veya riskli su için eşanjörlü kapalı devre

Suyunuz yağ, kimyasal, partikül, ürün kalıntısı veya korozyon riski taşıyorsa, suyu doğrudan soğutma kulesine vermek doğru değildir. Bu durumda önerilen şema şöyledir:

```text
Kirli/sıcak proses suyu
  -> plakalı eşanjör
  -> kendi proses devresine geri dönüş

Temiz soğutma devresi
  -> eşanjörden ısı alır
  -> soğutma kulesi / dry cooler
  -> tekrar eşanjöre döner
```

Bu yapı proses suyunu kule devresinden ayırır. Böylece soğutma kulesi dolgusu, nozullar, pompa, boru hattı ve fan sistemleri kirli suyun oluşturacağı tıkanma, korozyon, biyofilm ve bakım sorunlarından daha iyi korunur.

## Hangi ekipman tipi seçilmeli?

| İhtiyaç / koşul | Uygun çözüm | Yorum |
|---|---|---|
| 30-40 °C civarı su yeterli | Açık tip soğutma kulesi | Çoğu fabrikada ekonomik ve etkili çözümdür. Su tüketimi sıfırlanmaz ama büyük oranda azalır. |
| Su tüketimi çok düşük olsun | Kuru soğutucu / dry cooler | Buharlaşma ve blöf yoktur; yazın dış hava sıcaklığı hedef sıcaklığı sınırlayabilir. |
| Sabit ve düşük sıcaklık gerekli | Chiller | 10-20 °C gibi düşük sıcaklıklar gerekirse düşünülür; elektrik tüketimi daha yüksektir. |
| Sıcak su 50-90 °C aralığında | Önce atık ısı geri kazanımı | Yıkama suyu, kazan besi suyu, proses ön ısıtma veya bina ısıtması için ısı değerlendirilebilir. |
| Su kirli/yağlı/kimyasal içeriyor | Plakalı eşanjörlü kapalı devre | Prosesi ve soğutma ekipmanını korumak için en güvenli yaklaşımdır. |

# Ölçülmesi gereken veriler

Firma çağırmadan veya teklif istemeden önce en az bir hafta boyunca şu veriler toplanmalıdır:

1. Saatlik debi: kaç m³/saat sıcak su çıkıyor?
2. Sıcak su giriş sıcaklığı: örneğin 55 °C, 60 °C veya 70 °C.
3. Hedef geri dönüş sıcaklığı: örneğin 30 °C veya 35 °C.
4. Günlük çalışma süresi: 8 saat, 16 saat veya 24 saat.
5. Su kalitesi: pH, sertlik, iletkenlik/TDS, yağ-gres, askıda katı madde, klorür, demir ve proses kimyasalı.
6. Fabrikanın ili ve yaz tasarım şartları: yaş termometre ve kuru termometre sıcaklıkları.

Yaklaşık soğutma yükü hesabı:

```text
Soğutma yükü (kW) = 1,163 x debi (m³/saat) x sıcaklık farkı (°C)
```

Örnek: Saatte 10 m³ su, 60 °C'den 35 °C'ye soğutulacaksa sıcaklık farkı 25 °C olur.

```text
1,163 x 10 x 25 = yaklaşık 291 kW
```

Bu değer, soğutma kulesi, kuru soğutucu veya chiller kapasitesinin temelidir. Pratikte buna yaz şartları, kirlenme payı ve emniyet katsayısı eklenir.

# Sistemde bulunması gereken ana ekipmanlar

Komple çözüm genellikle aşağıdaki ekipmanlardan oluşur:

| Ekipman | Görevi |
|---|---|
| Sıcak su toplama tankı | Debi ve sıcaklık dalgalanmalarını dengeler. |
| Soğuk su tankı | Prosese daha stabil sıcaklıkta su gönderilmesini sağlar. |
| Sirkülasyon pompaları | Su devridaimini sağlar; mümkünse biri yedekli seçilmelidir. |
| Soğutma kulesi | Isıyı atmosfere atar; çoğu standart proses için ekonomik çözümdür. |
| Kuru soğutucu / dry cooler | Su kaybını azaltır; performansı dış hava sıcaklığına bağlıdır. |
| Plakalı eşanjör | Kirli proses suyu ile temiz soğutma devresini ayırır. |
| Filtre | Tortu, pas, partikül ve tıkanma riskini azaltır. |
| Kimyasal dozaj | Kireç, korozyon ve mikrobiyolojik riskleri kontrol eder. |
| İletkenlik kontrollü blöf | Açık kulelerde tuz birikimini kontrol etmek için kullanılır. |
| Otomasyon ve sensörler | Sıcaklık, seviye, debi, basınç ve pompa kontrolünü sağlar. |

# Sağlık, bakım ve işletme riskleri

Açık tip soğutma kulesi kurulursa bakım konusu kritik hale gelir. Özellikle Legionella riski nedeniyle kule suyunda durgun hatlardan kaçınmak, drift eliminatörlerini doğru seçmek, düzenli temizlik/dezenfeksiyon yapmak, su kimyasını izlemek ve blöf sistemini doğru işletmek gerekir.

Bu nedenle kule satın alırken şu hizmetler de sorgulanmalıdır:

- devreye alma ve işletme eğitimi,
- periyodik bakım planı,
- su şartlandırma kimyasalları,
- analiz programı,
- dolgu, fan, motor, nozul ve pompa yedek parça temini,
- arıza durumunda servis müdahale süresi.

# Türkiye'de mevzuat ve izin notları

Fabrika Türkiye'de olduğu için bağlı olunan yere göre OSB Müdürlüğü, belediye su ve kanalizasyon idaresi ve gerekirse Çevre, Şehircilik ve İklim Değişikliği İl Müdürlüğü ile uyumlu ilerlenmelidir.

Kanalizasyona verilen su için sıcaklık ve kalite limitleri şehirden şehre değişebilir. Konuşmada örnek olarak bazı yerel idarelerde 40 °C veya 50 °C gibi farklı sıcaklık limitleri görülebildiği belirtilmiştir. Bu yüzden fabrikanın bulunduğu il ve OSB şartları mutlaka ayrıca kontrol edilmelidir.

Devridaim sistemi kurulduğunda kanalizasyona giden su tamamen sıfırlanmayabilir. Açık kulelerde blöf suyu, taşma, bakım suyu veya arıza suyu olabilir. Bu deşarjların da yerel idarenin limitlerine uygun olması gerekir.

# Nereden satın alınabilir?

Konuşmada Türkiye'de teklif alınabilecek bazı firma ve temsilciler aşağıdaki gibi listelenmiştir. Bu liste tarafsız bir başlangıç listesidir; firma seçimi öncesinde güncel iletişim bilgileri ve teklif kapsamı teyit edilmelidir.

| Firma | Ne için değerlendirilebilir? | Konuşmada geçen iletişim / not |
|---|---|---|
| Form Freva | Açık/kapalı çevrim soğutma kulesi, hibrit kule, kuru/adyabatik soğutucu | +90 212 286 18 38, freva@formgroup.com |
| Ensotek | CTP su soğutma kuleleri, satış ve fabrika desteği | İstanbul +90 212 613 33 01, satış +90 531 880 31 51; Ankara +90 312 802 02 92 |
| DamlaSU | Paket tip ve inşai tip su soğutma kuleleri | +90 212 295 67 56, info@damla-su.com |
| CTP Mühendislik | Su soğutma kulesi, satın alma/sevkiyat | +90 216 304 68 68, GSM +90 507 641 18 81, +90 533 201 51 13 |
| ISISO | Su soğutma kulesi, dry cooler | +90 312 395 2974, +90 546 645 83 22 |
| Gazi Soğutma | Chiller, su soğutma kulesi, eşanjör, dry cooler | +90 212 501 61 37, +90 212 577 20 62 |
| Friterm | Dry cooler, kanatlı borulu eşanjör, endüstriyel soğutma | +90 216 394 12 82, info@friterm.com |
| TermoKar | Chiller, dry cooler, kondenser, özel projeler | 0332 248 81 36, info@termokarchillers.com |
| Alfa Laval Türkiye | Plakalı eşanjör, servis ve yedek parça | +90 216 311 79 00, turkey@alfalaval.com |
| TempusPHE | Plakalı, borulu ve lehimli eşanjör | +90 312 283 33 00, info@tempusphe.com |
| Değişim Isı Teknik | Alfa Laval Ege Bölge distribütörü, eşanjör/servis | +90 232 262 09 36, info@degisimisiteknik.com |
| Üçsan Soğutma | Su soğutma kuleleri, endüstriyel klima imalatı | +90 212 501 60 70, WhatsApp +90 544 359 80 99 |

# Ensotek değerlendirmesi

Konuşmada Ensotek için varılan özet kanaat şudur: **Ensotek teklif alınabilecek ve kısa listeye koyulabilecek bir firma** olarak değerlendirilmiştir. Açık ve kapalı tip CTP su soğutma kuleleri, servis/bakım, modernizasyon ve yedek parça tarafında faaliyet gösterdiği belirtilmiştir.

Olumlu görülen noktalar:

- Yerli üretici olması.
- Soğutma kulesi alanına odaklı görünmesi.
- Çok sayıda sektör referansı sunduğunu belirtmesi.
- Açık/kapalı devre kule ihtiyacına cevap verebilecek ürün grubuna sahip görünmesi.
- Konuşma sırasında görülen açık kaynak puanlarında merkez kaydı için yüksek puan görünmesi.

Dikkat edilmesi gereken noktalar:

- Açık kaynak müşteri yorumu sayısı sınırlı olduğu için müşteri memnuniyeti kesin söylenemez.
- İnternette görünen 4,8/5 gibi puanlar az değerlendirme sayısıyla geldiği için tek başına karar kriteri olmamalıdır.
- Teklif edilen spesifik model için CTI veya Eurovent gibi bağımsız performans sertifikası olup olmadığı mutlaka sorulmalıdır.
- Sizin sisteminizde su kirliyse, sadece kule değil, eşanjörlü kapalı devre çözüm istenmelidir.
- Yaz şartlarında hedef sıcaklık garanti edilmiyorsa karar verilmemelidir.

Ensotek'e sorulması gereken kilit soru:

```text
Teklif ettiğiniz model, yaz tasarım şartlarında
bizim debimizde suyu hedef sıcaklığa indirecek mi?
Bu performansı yazılı garanti ediyor musunuz?
Modeliniz CTI veya Eurovent sertifikalı mı?
```

# Alternatif firmalarla kıyaslama

Konuşmada Ensotek dışında daha güçlü veya farklı konumlanmış alternatifler de değerlendirildi. Bunlar aşağıdaki gibi özetlenebilir.

| Firma / marka | Öne çıkan taraf | Ne zaman öne alınmalı? |
|---|---|---|
| Cenk Endüstri | Teknik sertifika ve ürün hattı açısından güçlü aday olarak değerlendirildi. | Yaz performansı ve bağımsız sertifika öncelikliyse. |
| Form Freva | Form Grubu arkasında, açık/kapalı kule ve dry/hybrid ürün gamı var. | Kurumsal yapı, sertifikalı ürün ve farklı soğutma alternatifleri isteniyorsa. |
| Niba | Sertifikalı açık devre kule tarafında güçlü yerli alternatif olarak değerlendirildi. | Yerli üretici, referans ve sertifika önemliyse. |
| Ensotek | Fiyat/performans ve CTP kule tarafında iyi aday. | Yazılı performans garantisi ve referans teyidi alınabiliyorsa. |
| BAC / BRC | Premium/global marka seçeneği. | Proses duruşu çok pahalıysa ve bütçe yüksekse. |
| EVAPCO / TransKlima | Premium/global evaporatif soğutma çözümü. | Kritik tesis ve global marka güvencesi isteniyorsa. |
| Friterm | Dry cooler ve endüstriyel hava soğutucu tarafında güçlü aday. | Su tüketimini minimuma indirmek hedefse. |
| TermoKar | Chiller, dry cooler ve özel soğutma çözümleri. | Düşük sıcaklık veya özel proses soğutması gerekiyorsa. |

# Puanlara göre durum

Konuşmada görülen açık kaynak puanlarına göre en yüksek görünen puan **Ensotek merkez kaydı için 4,8/5** olarak not edilmişti. Ancak değerlendirme sayısının düşük olması nedeniyle bu sonuç kesin kalite göstergesi olarak alınmamalıdır.

| Firma | Konuşmada geçen görünen puan | Değerlendirme notu |
|---|---:|---|
| Ensotek Merkez | 4,8/5 | En yüksek görünen puan; değerlendirme sayısı az. |
| Friterm | 4,7/5 civarı | Dry cooler/eşanjör tarafında dikkate değer. |
| Cenk Endüstri | 4,4/5 civarı | Oy sayısı biraz daha fazla; teknik sertifika tarafı güçlü. |
| TermoKar | 4,3/5 civarı | Chiller/dry cooler tarafında değerlendirilebilir. |
| CTP Mühendislik | 4,1/5 civarı | Bazı kayıtlarda puan var, bazı kayıtlarda yorum sınırlı. |
| Form Freva | Yeterli açık yorum yok | Yeni/kurumsal yapı ve sertifika tarafı daha önemli. |
| Niba | Yorum/puan sınırlı | Puanla değil, referans ve sertifikayla değerlendirilmeli. |
| DamlaSU / Gazi Soğutma | Yorum sınırlı | Teklif alınabilir; puanla karar vermek zor. |

Bu puanlar satın alma kararında en düşük ağırlığa sahip olmalıdır. Endüstriyel soğutma sistemlerinde asıl karar kriterleri; performans garantisi, referans, mühendislik kalitesi, servis hızı, yedek parça ve toplam işletme maliyetidir.

# Önerilen satın alma stratejisi

Tek firma ile ilerlemek yerine aynı teknik şartnameyle en az üç veya dört firmadan teklif almak en doğru yaklaşımdır.

Önerilen kısa liste:

1. Ensotek
2. Cenk Endüstri
3. Form Freva
4. Niba

Bütçe yüksekse ve proses duruşu ciddi zarar oluşturuyorsa:

5. BAC / BRC
6. EVAPCO / TransKlima

Su tüketimini en aza indirmek ve dry cooler alternatifini görmek için:

7. Friterm
8. TermoKar

Plakalı eşanjör ihtiyacı varsa ayrıca:

9. Alfa Laval Türkiye
10. TempusPHE
11. Değişim Isı Teknik

# Karar sıralaması

Konuşmada önerilen pratik karar mantığı şu şekildeydi:

- **En yüksek görünen puan:** Ensotek.
- **Teknik sertifika ve performans güveni için ilk bakılacaklar:** Cenk, Form Freva, Niba.
- **Premium/global kalite için:** BAC/BRC veya EVAPCO/TransKlima.
- **Dry cooler için:** Friterm veya TermoKar.
- **Kirli su veya riskli proses için:** mutlaka plakalı eşanjörlü kapalı devre.

Sadece fiyata bakarak karar verilmemelidir. En ucuz teklif, yazın hedef sıcaklığı sağlayamazsa veya servis zayıfsa toplamda daha pahalıya gelebilir.

# Teklif isterken kullanılacak metin

Firmalara gönderilebilecek örnek metin:

```text
Merhaba,

Fabrikamızda soğutma amacıyla kullandığımız sıcak suyu
şu anda kanalizasyona veriyoruz.
Bu suyu soğutup tekrar prosese vermek istiyoruz.

Aşağıdaki şartlara göre açık devre soğutma kulesi,
kapalı devre soğutma kulesi, dry cooler veya eşanjörlü
kapalı devre sistem için keşif ve teklif rica ederiz.

Veriler:
- Sıcak su debisi: ... m³/saat
- Sıcak su giriş sıcaklığı: ... °C
- Hedef geri dönüş sıcaklığı: ... °C
- Günlük çalışma süresi: ... saat/gün
- Fabrika ili/ilçesi: ...
- Su kalitesi: temiz / kirli / yağlı / kimyasal içeriyor
- Su analiz raporu: ektedir / hazırlanacaktır

Teklifte aşağıdaki kapsamın açıkça belirtilmesini rica ederiz:
- Soğutma ekipmanı tipi ve kapasitesi
- Pompa, tank, eşanjör, filtre, borulama ve otomasyon dahil mi?
- Kimyasal şartlandırma ve blöf sistemi dahil mi?
- Yaz tasarım şartlarında hedef çıkış sıcaklığı garanti ediliyor mu?
- Teklif edilen model CTI veya Eurovent sertifikalı mı?
- Garanti süresi, servis müdahale süresi ve yedek parça temin süresi nedir?
```

# Teklif karşılaştırma kontrol listesi

Teklifleri karşılaştırırken şu sorulara yazılı cevap alınmalıdır:

| Kontrol sorusu | Neden önemli? |
|---|---|
| Hedef çıkış sıcaklığı yazılı garanti ediliyor mu? | Sistemin yazın gerçekten çalışacağını gösterir. |
| Tasarımda hangi yaş/kuru termometre sıcaklığı kullanıldı? | Kule/dry cooler kapasitesinin doğru seçildiğini gösterir. |
| Teklif sadece kule mi, komple sistem mi? | Pompa, tank, eşanjör ve otomasyon eksik kalırsa maliyet artar. |
| Su kirliyse eşanjörlü devre önerildi mi? | Kule tıkanması ve korozyon riskini azaltır. |
| Kimyasal şartlandırma ve blöf sistemi dahil mi? | Açık kule işletmesinde şarttır. |
| Servis müdahale süresi kaç saat/gün? | Duruş maliyeti yüksek fabrikalarda kritik konudur. |
| Yedek parça stokları var mı? | Fan, motor, nozul, dolgu gibi parçaların temini önemlidir. |
| Referans müşteri veriyorlar mı? | İnternet puanından daha güvenilir doğrulama sağlar. |
| Enerji ve su tüketimi hesaplandı mı? | Toplam sahip olma maliyetini belirler. |
| Mevzuata uygun deşarj/blöf planı var mı? | Yerel idare ve OSB uyumu için gereklidir. |

# Referans teyidi için sorulacak sorular

Bir firmadan teklif aldıktan sonra, sizin sektörünüze yakın en az üç referans müşteriyle görüşmek gerekir. Referans müşterilere şu sorular sorulmalıdır:

1. Teslim tarihi söz verildiği gibi miydi?
2. Sistem yaz aylarında hedef sıcaklığı sağlıyor mu?
3. Kule, dolgu, nozul veya filtre tarafında sık tıkanma yaşandı mı?
4. Servis çağrısına dönüş hızları nasıl?
5. Yedek parça temini kolay mı?
6. Elektrik ve su tüketimi tekliftekine yakın çıktı mı?
7. Kimyasal şartlandırma ve bakım konusunda destek veriyorlar mı?
8. Bugün aynı firmayla tekrar çalışır mıydınız?

Bu cevaplar, internetteki puanlardan çok daha değerlidir.

# Sonuç ve önerilen yol haritası

Bu proje için konuşmada önerilen yol haritası şöyledir:

1. En az bir hafta debi ve sıcaklık kaydı alın.
2. Su analizini yaptırın.
3. Hedef geri dönüş sıcaklığını netleştirin.
4. Su temizse kule/dry cooler; kirliyse eşanjörlü kapalı devre isteyin.
5. Ensotek, Cenk, Form Freva ve Niba'dan aynı şartnameyle teklif alın.
6. Bütçe uygunsa BAC/BRC ve EVAPCO/TransKlima'dan referans teklif alın.
7. Dry cooler ihtimali için Friterm ve TermoKar'ı ayrıca değerlendirin.
8. Teklifleri fiyat yerine performans garantisi, servis, referans ve kapsam üzerinden karşılaştırın.
9. Seçilen firma ile P&ID/proses akış şeması, kapasite hesabı ve devreye alma planı hazırlatın.
10. OSB/belediye/ilgili yerel idare ile deşarj ve blöf suyu konusunu teyit edin.

Pratik nihai öneri:

**Ensotek'i kısa listeye alın; ancak kararınızı Ensotek + Cenk + Form Freva + Niba tekliflerini aynı teknik şartnameyle karşılaştırdıktan sonra verin. En ucuz olanı değil, yaz şartlarında hedef sıcaklığı yazılı garanti eden, kapsamı net, servisi güçlü ve referansı teyit edilebilen firmayı seçin.**

# Ek: Telefonda kullanılacak kısa ifade

```text
Fabrikamızda soğutma amaçlı kullandığımız sıcak suyu
şu anda kanalizasyona veriyoruz.
Bu suyu soğutup tekrar sisteme vermek istiyoruz.
Bize soğutma kulesi, dry cooler veya gerekiyorsa
plakalı eşanjörlü kapalı devre sistem için keşif ve
teklif verebilir misiniz?
```

Ardından şu bilgileri verin:

- saatte kaç m³ su çıktığı,
- sıcak suyun kaç derece olduğu,
- tekrar kaç dereceye düşürmek istediğiniz,
- fabrikanın bulunduğu il,
- suyun temiz mi kirli mi olduğu,
- sistemin günde kaç saat çalıştığı.

# Ek: Satın alma karar matrisi

Aşağıdaki ağırlıklandırma teklifleri sayısallaştırmak için kullanılabilir:

| Kriter | Önerilen ağırlık |
|---|---:|
| Yaz şartlarında performans garantisi | %25 |
| Toplam sistem kapsamı | %20 |
| Referans teyidi | %15 |
| Servis ve yedek parça gücü | %15 |
| Toplam sahip olma maliyeti | %15 |
| Firma puanı / açık kaynak yorumları | %5 |
| Ödeme ve teslim koşulları | %5 |

Bu matriste internet puanları sadece küçük bir ağırlıkla değerlendirilmelidir. Endüstriyel ekipmanda gerçek performans, servis ve garanti çok daha belirleyicidir.
