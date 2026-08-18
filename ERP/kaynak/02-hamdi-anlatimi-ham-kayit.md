# KAYNAK-02 · Hamdi Bey'in anlatımı — ham kayıt (yalnız Ensotek tarafı)

> **Belge türü:** Ham kaynak. Hamdi Bey'in yazdıkları **birebir**, tek kelimesi
> değiştirilmeden alınmıştır. Yorum, düzeltme ve özet yoktur.
>
> Bu dosya gereksinimlerin **tek doğruluk kaynağıdır**. Analiz belgelerinde bir madde
> tartışmalı hale gelirse buraya bakılır. Karşı taraftaki ChatGPT önerileri için
> [01-hamdi-gorusme-tam-dokum.md](01-hamdi-gorusme-tam-dokum.md).

**Kaynak:** https://chatgpt.com/share/6a74d01b-9d04-83ed-a7d2-1fb546d194fa · 2026-08-18

| Blok | İçerik |
|---|---|
| H-01 | İlk talep — süreç özeti ve yazılım isteği |
| H-02 | Web tabanlı olsun kararı |
| H-03 | Maliyet takibi + süpervizörlük/bakım isteği |
| H-04 | Firma adı düzeltmesi (Ensotek, K ile) |
| H-05 | Teklif anı maliyetinin saklanması isteği |
| H-06 | Teklifin teknik / ticari olarak ikiye bölünmesi isteği |
| H-07 | Onay — devam |
| H-08 | Onay — başlayalım |
| **H-09** | **Mevcut teklif süreci — uçtan uca detaylı anlatım** |
| **H-10** | **Sipariş → üretim → sevkiyat süreci — uçtan uca detaylı anlatım** |
| H-11 | Onay — devam |
| **H-12** | **Ürün gamı, ürün ağaçları, Excel altyapısı, stok, darboğazlar** |
| **H-13** | **Yarı mamul satışı, CTP kg-bazlı maliyet modeli** |
| H-14 | Bu görüşmeleri nasıl kalıcı hale getiririz sorusu |

---

## H-01 · İlk talep — süreç özeti ve yazılım isteği

> Biz su soğutma kulesi imalatı yapıyoruz. Bu su soğutma kulelerinin imalatına başlamadan önce müşterilerimize teklif veriyoruz. Bu tekliflerin takibini yapıyoruz. Teklifler olumlu sonuçlanırsa işe dönüştürüyoruz. Bunları dosya halinde imalat ekibine veriyoruz. Onlar da aşağıdaki imalat mavi yakalılarına dosyaları veriyorlar. Üretim yapılıyor ve sonrasında sevkiyatı yapılıyor. Bu işlerin takibini yapabileceğim, ürün akışı olan, ürün ağacı olan, sistem akışı olan bir yazılım programı hazırlayabilir misin benim için?

---

## H-02 · Web tabanlı olsun kararı

> Hadi başlayalım. Web tabanlı olması iyi olur. Uzaktan da erişim sağlayabiliriz.

---

## H-03 · Maliyet takibi + süpervizörlük ve bakım isteği

> Tamam, bu söylediklerine ek olarak soğutma kulelerinin maliyetlerini de takip edebilmek istiyorum. Ürün ağacından, oradaki malzeme kalemlerinin maliyetlerini girerek bizler veya siparişlerden de alabilir bunun tedarik siparişlerinden, ürün ağaçlarından ürünün güncel maliyetini görüp ona göre de teklifimize kar oranımızı belirleyip teklif fiyatımızı belirleyebilelim. Ayrıca bizim süpervizörlük hizmetimiz de var sahada, kurulum aşamasında veya sonraki bakım aşamalarında bunları da yönetebilelim.

---

## H-04 · Firma adı düzeltmesi

> Tamam başlayalım. Yalnız firmamızın ismi Ensotek derken sonu CH ile değil de sonu K harfiyle, Türkçe karakter olarak düşün.

---

## H-05 · Teklif anı maliyetinin saklanması isteği

> Tamamdır. Burada mesela teklif verdiğimiz ürünün maliyetini takip ederken ilk teklifi verdiğimiz andaki maliyetini de görmemizde fayda var. Onu da sistemde bir yerde, tabloda veya bir PDF dosyasında tutabilmesi iyi olur. Hani diyelim ki maliyetler değişti, teklifin son halini açtığımızda biz işte değişmiş maliyetleri görmeyelim sadece. Teklifi verdiğimiz müşteriye gönderdiğimiz andaki maliyeti de görmemiz lazım.

---

## H-06 · Teklifin teknik / ticari olarak ikiye bölünmesi isteği

> Bir de müşteriye teklifi gönderirken bence teklifi ikiye bölmekte fayda var. Teknik bilgiler ve de ticari bilgiler olarak. İki PDF olursa belki müşteri de bir başkasına teklif verecekse ticari bilgileri kendi yeniden ayarlar ama teknik bilgileri değiştirmeyebilir böylece.

---

## H-07 · Onay — devam

> Tamam, bu dediklerini de ekleyelim. Ne yapalım, başlayalım mı artık?

---

## H-08 · Onay — başlayalım

> Tamam, hadi başlayalım o zaman. Benden isteğin var mı şu anda?

---

## H-09 · MEVCUT TEKLİF SÜRECİ — uçtan uca anlatım

> Şimdi müşteriden bize talepler nerelerden gelebilir? Birincisi e-posta ile gelebilir, ikincisi telefon ederek gelebilir, üçüncüsü WhatsApp üzerinden gelebilir. Bize gelen talepler su soğutma kulesi talebi olabilir veya herhangi bir yedek malzemenin talebi olabilir. Diyelim su soğutma kulesi talebi geldi. Bizim satış ekibindeki arkadaşlardan biri bu işi üzerine alınıyor, alıyor ve bir teklif takip numarası veriyor. Bunu Excel'den yapıyor. Daha sonra bizim Word veya Excel formatında tekliflerimiz var. O teklifleri açmadan önce tabii ki önce soğutma kulesinin ve müşterinin verdiği kapasite talebine göre seçimini yapıyor. Bunu bizim seçimini yaptığımız belirli tablolarımız var. Bunlar çıktı halinde masalarında durabiliyor. Bir de benim daha önce yaptırdığım bir yazılım var. O da web tabanlı bir yazılım. Oradan da seçimini yine teyit etmek amaçlı kontrol ediyor. İşte giriş-çıkış sıcaklıklarını, yaşlar metre sıcaklığını, su debisini giriyor ve kulenin kaç metrekare olduğunu buluyor. Hatta o yazılım o kulenin direkt seçiminde hangi modelle tekabül ettiğini de seçiyor. Model belli olduktan sonra Excel'de veya Word'deki hangi formattaysa bu teklif oradan işte iş numarasını veriyor, müşterinin bilgilerini, adını soyadını, şirket bilgilerini filan oraya giriyor. Tarihini, revizyon numarasını, teklif numarasını neyse giriyor. Sonra bu teklifi oluşturmaya başlıyor. İşte müşterinin verilerini yazıyor oraya. O verilere göre hani çoğu ürünün zaten ölçüsü aynı, ölçüler değişmiyor model belli olduktan sonra. Ama sıcaklıklar, debiler, kilokalori değerleri değişebiliyor. Veya özel bir istek varsa işte ısıya dayanıklı soğutma kulesi gibi, ne bileyim, işte motoruna ek bir özellik istiyorsa onlar gibi. Onlar kırmızı renkle belirtiyoruz teklifte onları, standart dışı yaptığımız şeyleri genelde biz. Onun dışında teklife işte kapsamını, nakliye bizde mi onlarda mı, kurulumu biz mi yapacağız, onlar mı yapacak, işte vinç onlarda mı gibi böyle birçok kalemi de girdikten sonra maliyet tarafına da geçiyor. Maliyetlerde bizde şu an Excel'de tutuyor. Ürün ağaçlarımız Excel üzerinde. Orada her ürünün işte modeline göre standart bir maliyet analizi var. Ondan bir tane farklı sayfa kopyalıyor aynı Excel içerisinde. Diyor ki XYZ firmasının işte bu CTP5 model kulesinin maliyet analizi diye. İşte CTP5 XYZ diyor atıyorum sayfanın adına Excel içerisinde. Orada işte düzenlemesi gereken kalemler varsa onları düzeltiyor. Özel ekstrem şeyler varsa maliyeti değiştiren, azaltan veya artıran, onları düzeltiyor. Ondan sonra fiyatını, maliyetini görüyor, toplam maliyetini. Oraya çarpan girdiğimiz yer var. Oraya çarpanı giriyor. Örneğin girdi çarpanı, sonra bir de pazarlık payı koyuyor onun üstüne, yüzde 3-5 neyse, onu da oradan seçiyor. Formüleze edilmiş. Kaç yazarsa onu Excel çarpıyor zaten. Biz fiyatları şu an Euro bazında veriyoruz genelde. Euro kurunu da o bir yerden okuyor Excel. Onu da okuduktan sonra orada Euro fiyatını görüyor. O fiyatla teklife yazıyor. Gerekiyorsa pano fiyatını da veriyor. Panoların fiyatlarını ayrı bir Excel'de tutuyoruz. Onu otomasyoncumuz ayrı yeten hesaplıyor onların fiyatını. Pano fiyatını ikinci kalem olarak ekliyor teklifin içerisine. İşte su şartlandırma sistemi vesaire vereceksek onları da ekleyebiliyor. Bu şekilde genelde teklifi büyük kulelerde biz süpervizör gönderiyoruz. Böyle trasa sığmayacak büyüklükteki kuleleri demonte gönderiyoruz. Onlara süpervizör gönderiyoruz. Teklifte öyle yazıyoruz. Bir süpervizör biz vereceğiz, siz 4-5 adet yardımcı personel vereceksiniz. İşte bunlar 5 gün, 10 gün neyse çalışacak. Onun oteli falan da sizde olacak gibi teklifimizin içerisinde yazıyor. Ama paket tip dediğimiz kuleler var. Onlar tra ya da konteynere girebilen kuleler. Onlar kurulu olarak gidiyor veya işte yanında bir iki tane parçası demonte gidiyor. Bunları genelde müşterilerin kendisinin kurmasını bekliyoruz. Biz gitmiyoruz kulenin arkasından devreye almak için. Ama gidebiliriz, bunu da yönetebiliriz orada. Bunlar her şey tamamlandıktan sonra PDF halinde iki PDF veya tek PDF. Yani müşteri başkasına teklif verecekse genelde ticari ile teknik teklifi ayrı yapıyoruz. Vermeyecekse tek teklif olarak gönderiyoruz. Mail olarak gönderiyoruz bunu da %90. Arada bir WhatsApp'tan isteyen olsa WhatsApp'tan da gönderiyoruz. Ondan sonra bu PDF'leri, teklifin PDF'ini, maliyetin PDF'ini, gönderdiğimiz mailin içeriğini, müşteriden gelen talebin içeriğini hepsini bunların PDF yaparak bir klasörde o teklif numarası ile beraber klasör olarak saklıyoruz. Ve sonra da bunun ara ara takibini yapıyoruz günler içerisinde.

---

## H-10 · SİPARİŞ → ÜRETİM → SEVKİYAT SÜRECİ — uçtan uca anlatım

> Şimdi burada şöyle oluyor, diyelim ki bir teklif takibi sonucu işe dönüştü, pazarlıklar yapıldı, ödeme planlarına göre anlaşma yapıldı ve işe dönüştü. Bu durumda şöyle bir şey yapıyoruz, eğer ki avans isteyeceksek, avans ödemesinin gelmesini bekliyoruz imalata teslim etmek için yani üretim bölümüne. Eğer istemeyeceksek direkt de verebiliyoruz. Şimdi burada bizim satış ekibindeki arkadaş bir Excel üzerinden alınan iş takip numarası, yani küçük işler için ENK, büyük işler için ENB, yine malzeme işleri de ENK diye geçiyor. Onlar da küçük iş. ENK ile başlayan bir numara veriyor diyelim ki. İşte Excel'deki sıra numarası 5715. ENK-5715 numaralı küçük iş numarasını vermiş oluyor. Buraya işte o numarayı verirken de firmanın adını yazıyor, işte ilgilisini yazıyor, ürünün ne satıldığını filan yazıyor. Hatta fiyatını da giriyor oraya. Daha sonra biz de oradan o fiyatlardan prim hesabı vesaire de yapabiliyoruz. Ama bu primi şimdilik sen sistemde tutma istersen. İş numarasını verdim. Daha sonra bir Word belgemiz var bizim. Burada teklif inceleme formu diye bir şey var. Bu forma işte ürünün ne olduğunu, iş numarasını yazıyoruz. Ve bu ürünün işte standart dışı olan bir takım notları, özellikleri varsa işte termostörlü motor olacak, süpervizöre oteli bizden olacak, nakliyesi bizden, işte boru çapı şu olacak, motor gücü bu olacak gibi bilgileri de bazı özet bilgileri, önemli bilgileri de yine bu teklif inceleme formuna yazıyoruz. Daha sonra da bu teklif inceleme formunu ve teklifimizin, maliyetimizin vesaire yazışmaların, önemli yazışmaların çıktılarını alıp imalat ekibine götürüp elden, yani imalat ekibi dediğim bu arada imalat ofisi, üretim ofisi yani, oraya elden teslim ediyorlar. Oradaki kim ilgilenecekse o herhangi bir kişi, buradaki oradakilerden biri, üzerine alıyor. Veya bu arada bunu imalat müdürü önce inceleyip o kime isterse işe atayabilir de. O da olabilir. Atanan kişi bu işi üzerine alıyor. Daha sonra bununla ilgili işte genel görünüş projesini oluşturuyor AutoCAD'de. Ne bileyim, müşteriyle sorması gereken bazı sorular varsa onları sorabiliyor bu arada. Mesela diyor ki, su çıkışı diyor pompaya müştemi olacak diyor, su havuzdan kendi ağırlığıyla mı dökülecek diyor ya da ne bileyim işte özel bir şeyler istiyor mu diye değiştirilebileceğimiz şeyler varsa onları soruyor müşteriyle tekrar bu konuda, bu aşamada. Daha sonra onların işte malzemeleri stokta var mı yoksa sipariş verilmesi gereken herhangi bir şey var mı, onları kontrol ediyor. Eğer sipariş vermesi gereken bir şey varsa o siparişleri veriyor, satın alma tedarikini yapıyor. Ondan sonra bunlarla ilgili malzeme listesi oluşturuyor. Bu malzeme listesinde işte o arada kontrol ediyor yani eksik malzeme var mı diye, stokta var mı yok mu diye. Daha sonra da her şey tabii sipariş verebilir, paralelinde de üretime verebilir. Burada şöyle yapıyor orada da, bir üretim iş emri oluşturuyor. O iş emri işte hangi atölyelere iş emri gitmesi gerekiyorsa, kaynak atölyesine, polyester atölyesine, montaj atölyesine, gitmesi gerekiyorsa oralara iş emri olarak veriliyor. Genelde montaj atölyesine stokta varsa bütün malzemeler işte kulenin yan duvarları falan yarı mamul olarak varsa o zaman montaja gidebilir direkt. Yoksa ondan önce polyestere gider veya işte kapalı kuleyse serpantin yoksa içindeki onun, serpantinin üretimi için şeye gider, kaynak atölyesine gider. İşte motorunu, fanını, ne bileyim bir takım işte şeylerini montaj atölyesi stoktan çekiyor bu arada. Kaynak atölyesi hazır ellerinde zaten onların mesela serpantin imalatı için borular var. Oradan serpantin imalatını gerçekleştirebilir. Ondan sonra testleri yapılır, galvanize gider. İşte basınç testi yapılır, hava basılır içine, su kaçırıyor mu, damla kaçırıyor mu diye kontrol edilir. Sonra galvanize gider, galvanizden gelince bir daha test edilir. Bu aşamalarda testler yapılıyor. Bu arada polyester imalat atölyesi yan duvarlarını, çatısını, havuzunu ve CTP bacasının imalatını yapar. Bazı kulelerde metal de baca kullanabiliyoruz. İşte taşıyıcı motorun altındaki taşıyıcı sistem falan metalden imalat yapılıyor. Onlar genelde stokumuzda oluyor. Olmaması nadir oluyor. Yoksa da gene onun da metal imalat yapacak imalatını. Hepsinin imalatı malzemeleri tamamlandıktan sonra paket kuleyse bu, montaj atölyemizde montajı yapılıyor. Eğer sahada kurulması gereken büyük kuleyse yani ENB kodlu bir kuleyse, o zaman da malzemeleri toparlanıyor bir noktada. Bunu genelde bu toparlanma işini montajcılar yapar. Malzemeler toparlanır, işte paletlenir, streçlenir vesaire. Ya da işte çuvallar da çuvallanır ve bir yerde ayrılır. Sevkiyat zamanı geldiği zaman da sevk ederler yine montajcılar yüklemesini yapar bunun, tavaya, konteynıra veya kamyona. Bu aşamada tabii ödeme takibi de yapılır. Eğer bakiye ödemesi sevkiyat öncesiyse onun tahsilatı yapılır önce. Yok, vadeli ödemeyse işte tahsilat yapılır, faturası irsaliyesi kesilir, gönderilir. Tahsilat yapılması, sevk yapılır, fatura irsaliye kesilir, sevk olur. Ödeme sonradan takip edilir. Böyle bir süreç var burada da üretim kısmında.

---

## H-11 · Onay — devam

> Tamam, devam edelim.

---

## H-12 · ÜRÜN GAMI, ÜRÜN AĞAÇLARI, EXCEL ALTYAPISI, STOK, DARBOĞAZLAR

> Şimdi Şan, sana şöyle söyleyeyim. Ana ürünlerimiz bizim şu anda açık tip soğutma kuleleri ve kapalı tip soğutma kuleleri. Web sitemizde yazan evaporatif kondanser gibi ürünler aslında kapalı tip soğutma kulesi de bir evaporatif kondanser diye de kullanılabilir. Önemli olan bunu şey yapmak, hani o şekilde mühendislik hesabını yapıp o şekilde adlandırmak. Ama ürün olarak aşağı yukarı aynı gibi bir ürün diye düşünebiliriz. Bizim açık tip kulelerimizde işte CTP1'den CTP30'a kadar. Ama aralarda bazı sayılar olmayabilir. Mesela işte ne bileyim CTP8 diye bir kulemiz yok mesela şu anda. Ha ileride olabilir ama. Bunların işte birden otuza kadar modelleri var diyelim şimdilik. Bunların da iki hücreli, üç hücreli, dört hücreli gibi. Mesela TCTP30 işte üç hücreli 30 demek. Yani aşağı yukarı 90 metrekare bir kuledir bu. Diğeri 30 metrekareydi tek hücreli olsaydı. Bunun double olanı işte 4 olanı olabiliyor. Bu şekilde çeşitlendirebilirsin orayı. Yani 4'e kadar, 4.30 diye de düşünürsek ama 1, 2, 3'ün 4'ü olmaz, 3'ü olmaz genelde. O küçük modellerde pek olmuyor onlar. Ama orada diyelim ki işte 100 tane modelimiz var en az. Kapalı kulelerde de bir 30-40 tane modelimiz var bu arada, öyle söyleyeyim. Her modelin evet ayrı ürün ağacı var. Bunlar genelde işte Excel'de tutuluyor bunlar hepsi de. Bizim stok kodumuz yok şu an. Stok birim fiyatlarımızı biz bir Excel'de tutuyoruz. O Excel'den de diğer ürün ağaçları okuyor fiyatları. İşte ürün ağacını oluşturuyorsun, sonra yanında da kaç tane olduğunu ve onun birim fiyatını da birim fiyat Excel'inden okutturuyoruz. O şekilde toplam maliyeti hesaplatıyoruz. İşte işçilikler falan hepsi bu birim fiyat Excel'inde duruyor. Oradan kaç adam günü kullanacak, kaç adam günü harcırah yazacak, kaç adam gün sigorta yazacaksa onları yemek yazacak vesaire hepsi orada ürün ağacında oluşuyor alt alta. Oradan da çekerek toplam maliyeti ve kar oranımızı girip fiyatımızı belirliyor. Yani ürünlerin CTP5 ile CTP6'nın evet büyük kısmı aynı. Sadece içinde işte miktarlar değişir. Yani büyüklükleri farklı olduğu için motor güçleri, fan çapları ya da adam gün sayıları falan değişik olabilir. Ama iskelet aynı iskelet aslında. Kapalı tipinkinde bir de içinde serpantin olduğu için ayrıca bizim serpantin maliyet analizi diye de bir Excel'imiz var. O Excel'in altındaki sayfalarda da işte üç model kule, CTP üç model serpantini, o serpantinin ne kat sayılarına göre değişebiliyor. Üç katlısı, dört katlısı, beş katlısı gibi onun maliyet analizi var. O serpantin maliyet analizleri o dosyada tutulur. Oradan da biz kapalı kulelerin ürün ağacına okuttururuz o serpantin maliyet analizini. Orada bir malzeme kalemi olarak serpantin maliyeti gelir oradan da. O şekilde olur. Stok kodlarımız dediğim gibi yok. Yani çok kullandığımız bir şey değil Excel'de tuttuğumuz için. Yapılabilir mi? Yapılabilir. Zor bir şey değil. Stok takibini de genelde gözle yapıyoruz. Yani bazı önemli kalemleri işte fandır, motordur, redüktördür. Bunları şey yapabiliyoruz. Bir Excel'imiz de var, orada da tutabiliyoruz. Ama çok böyle şey değil yani profesyonel bir sistem yok orada. Eksildikçe birileri haber verir ve bizim satın almacılar da satın almasını geçerler, siparişini verirler. Stok takibini evet söylediğim gibi tutuyoruz. Bu şekilde. Yani bizim vaktimizi genelde alan teklifçilerin vaktini alanlar teklifin hazırlanması, maliyet analizinin hazırlanması ve gönderilmesi. Ürün tarafına geçince de imalatım tarafına orada da malzeme listesi oluşturulması uzun zaman alıyor. Ondan sonra da işte iş emirlerinin hazırlanıp dağıtılması. Genelde sevkiyat yapıldıktan sonra işte yani evrak işleri de oluyor tabii ki, işte servis takibi de oluyor. Ama öyle aşırı her iş ürünün sonuna bir servis hemen gelmez. Uzun yıllar kullanılan ürün olduğu için uzun vadede de gelebilir servis talepleri.

---

## H-13 · YARI MAMUL SATIŞI VE CTP KG-BAZLI MALİYET MODELİ

> Aynen. Yani bu arada bizim yarı mamül satışımız da olabilir. Hani sadece soğutma kulesi olarak değil, yedek parçalar da, motoru da, fanı da, redüktörü de ne bileyim, işte havuzu bile satabiliriz ya da serpantinini de satabiliriz. Bu arada bizim mesela şu anki CTP maliyetlerimiz yani kaportadır, çatıdır, havuzdur bunları maalesef bizde şöyle çalışıyor sistem. Bunların kendine reçeteleri var, ürün ağaçları var. Oradan onların işte birim fiyatının bir kilogram maliyetini hesaplıyoruz. Örneğin diyorum ki benim CTP'min kilogram maliyeti 10 dolar bölü kilogram diye bir maliyetim var benim. Diyelim ki CTP 5'in maliyet analizinde ürün ağacında şöyle diyor, CTP maliyeti diye bir kalem var. Orada da diyor ki 270 kilo diyor misal. 270 kilogram diyor benim CTP maliyetim. Yani bunun içinde ne var? Duvarlar var, çatı var, havuz var. Bunlar o şekilde adlandırılıyor orada. Ve ben kilogram başında yani 270 kilogram işte 10 dolar diye onu da okutturuyorum farklı ürün ağacından, CTP maliyet ürün excelinden. Oradan okutturmuşum zaten. Onları bu arada tek tek açmama gerek yok benim. Zaten onu otomatik olarak ürün ağacını açınca kendi diğer Excellerden okuyup getiriyor. Bu şekilde ürün ağacını oluşturuyorum. Hadi bundan sonra devam edelim bakalım.

---

## H-14 · Görüşmelerin kalıcı hale getirilmesi sorusu

> Peki şimdi biz seninle burada bir analiz yaptık, konuşuyoruz, bir şeyler söylüyorum. Ben birkaç gün sonra senin programını açtığım zaman ben bu yazışmaları göremeyeceğim. Onları şu anda nasıl kaydedebilirim? Ben nasıl bir klasifikasyon yapalım burada, ne yapalım önerirsin?

---

