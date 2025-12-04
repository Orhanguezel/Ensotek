-- =============================================================
-- 016_product_details_seed.sql
-- Products: Specs + FAQs + Reviews + Options + Stock
--  - Ana ürünler (bbbb0001..0003)
--  - Spareparts (bbbb1001..1002)
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- 1) PRODUCT SPECS
-- =============================================================

INSERT INTO product_specs (
  id,
  product_id,
  name,
  value,
  category,
  order_num
)
VALUES
  -- ===== PRODUCT 1: Açık Devre Soğutma Kulesi =====
  ('pspc0001-1111-4111-8111-aaaaaaaa0001',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Debi Kapasitesi',
   '1.500 m3/h – 4.500 m3/h aralığında farklı modeller',
   'physical',
   1),
  ('pspc0002-1111-4111-8111-aaaaaaaa0002',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Fan Tipi',
   'Mekanik çekişli aksiyal fan, düşük ses seviyesi',
   'physical',
   2),
  ('pspc0003-1111-4111-8111-aaaaaaaa0003',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Gövde Malzemesi',
   'Sıcak daldırma galvaniz çelik ve GRP paneller',
   'material',
   3),
  ('pspc0004-1111-4111-8111-aaaaaaaa0004',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Dolgu Tipi',
   'Yüksek verimli film tip PVC dolgu',
   'material',
   4),
  ('pspc0005-1111-4111-8111-aaaaaaaa0005',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Garanti Süresi',
   '2 yıl sistem garantisi',
   'service',
   5),

  -- ===== PRODUCT 2: Kapalı Devre Soğutma Kulesi =====
  ('pspc0011-1111-4111-8111-aaaaaaaa0011',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'Soğutma Kapasitesi',
   '500 kW – 2.000 kW aralığında standart modeller',
   'physical',
   1),
  ('pspc0012-1111-4111-8111-aaaaaaaa0012',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'Serpantin Malzemesi',
   'Galvaniz çelik veya opsiyonel paslanmaz çelik serpantin',
   'material',
   2),
  ('pspc0013-1111-4111-8111-aaaaaaaa0013',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'Devre Yapısı',
   'Kapalı proses devresi + açık kule devresi',
   'custom',
   3),
  ('pspc0014-1111-4111-8111-aaaaaaaa0014',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'Uygulama Alanları',
   'Proses soğutma, chiller kondenser devreleri, ısı geri kazanım sistemleri',
   'custom',
   4),
  ('pspc0015-1111-4111-8111-aaaaaaaa0015',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'Garanti Süresi',
   '3 yıl serpantin sızdırmazlık garantisi',
   'service',
   5),

  -- ===== PRODUCT 3: Hibrit Adyabatik Sistem =====
  ('pspc0021-1111-4111-8111-aaaaaaaa0021',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'Çalışma Modları',
   'Kuru, adyabatik ve hibrit mod arasında otomatik geçiş',
   'custom',
   1),
  ('pspc0022-1111-4111-8111-aaaaaaaa0022',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'Su Tasarrufu',
   'Klasik soğutma kulelerine göre %60 a varan su tasarrufu',
   'physical',
   2),
  ('pspc0023-1111-4111-8111-aaaaaaaa0023',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'Uygulama Alanları',
   'Veri merkezleri, hastaneler, endüstriyel prosesler ve ofis binaları',
   'custom',
   3),
  ('pspc0024-1111-4111-8111-aaaaaaaa0024',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'Garanti Süresi',
   '2 yıl sistem garantisi',
   'service',
   4),

  -- ===== SPAREPART 1: Kule Fan Motoru =====
  ('pspc0101-1111-4111-8111-aaaaaaaa0101',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'Güç Aralığı',
   '7,5 kW – 30 kW',
   'physical',
   1),
  ('pspc0102-1111-4111-8111-aaaaaaaa0102',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'Koruma Sınıfı',
   'IP55, dış ortam şartlarına dayanımlı',
   'material',
   2),
  ('pspc0103-1111-4111-8111-aaaaaaaa0103',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'Besleme',
   '400V / 3 Faz / 50 Hz',
   'physical',
   3),
  ('pspc0104-1111-4111-8111-aaaaaaaa0104',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'Montaj Tipi',
   'Flanş montaj, kule fan göbeğine uyumlu',
   'custom',
   4),

  -- ===== SPAREPART 2: PVC Dolgu Bloğu =====
  ('pspc0111-1111-4111-8111-aaaaaaaa0111',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'Malzeme',
   'Yüksek ısı ve kimyasal dayanımlı PVC',
   'material',
   1),
  ('pspc0112-1111-4111-8111-aaaaaaaa0112',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'Çalışma Sıcaklığı',
   'Maksimum 60 °C sürekli çalışma',
   'physical',
   2),
  ('pspc0113-1111-4111-8111-aaaaaaaa0113',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'Tip',
   'Film tip dolgu bloğu',
   'custom',
   3)
ON DUPLICATE KEY UPDATE
  name      = VALUES(name),
  value     = VALUES(value),
  category  = VALUES(category),
  order_num = VALUES(order_num);

-- =============================================================
-- 2) PRODUCT FAQS
-- =============================================================

INSERT INTO product_faqs (
  id,
  product_id,
  question,
  answer,
  display_order,
  is_active
)
VALUES
  -- ===== PRODUCT 1: Açık Devre Soğutma Kulesi =====
  ('pfqa0001-1111-4111-8111-aaaaaaaa0001',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Açık devre soğutma kulesinin bakımı ne sıklıkla yapılmalıdır?',
   'Minimum yılda bir kez genel bakım ve temizlik, su kalitesi kötü ise 6 ayda bir kontrol önerilir.',
   1,
   1),
  ('pfqa0002-1111-4111-8111-aaaaaaaa0002',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Kuleyi kış şartlarında kullanırken nelere dikkat etmeliyim?',
   'Donma riskine karşı drenaj noktalarının kontrol edilmesi ve gerekiyorsa ısıtıcı veya by-pass devrelerinin kullanılması önerilir.',
   2,
   1),
  ('pfqa0003-1111-4111-8111-aaaaaaaa0003',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Dolgu ve sürüklenme tutucuların ömrü ne kadardır?',
   'Çalışma koşullarına bağlı olarak 5-7 yıl aralığında değişmekle birlikte, düzenli bakım ömrü uzatır.',
   3,
   1),

  -- ===== PRODUCT 2: Kapalı Devre Soğutma Kulesi =====
  ('pfqa0011-1111-4111-8111-aaaaaaaa0011',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'Kapalı devre kulelerde proses suyu neden daha temiz kalır?',
   'Proses suyu hava ile doğrudan temas etmediği için dış ortamdan kir ve partikül almaz, korozyon ve kireçlenme riski azalır.',
   1,
   1),
  ('pfqa0012-1111-4111-8111-aaaaaaaa0012',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'Serpantin temizliği nasıl yapılır?',
   'Serpantinler kimyasal yıkama veya düşük basınçlı su ile temizlenebilir, üretici tavsiyelerine uygun kimyasallar kullanılmalıdır.',
   2,
   1),

  -- ===== PRODUCT 3: Hibrit Adyabatik Sistem =====
  ('pfqa0021-1111-4111-8111-aaaaaaaa0021',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'Hibrit adyabatik sistemler hangi projelerde avantaj sağlar?',
   'Su tüketiminin kısıtlı olduğu, su maliyetinin yüksek olduğu veya yasal sınırların bulunduğu projelerde önemli avantaj sağlar.',
   1,
   1),
  ('pfqa0022-1111-4111-8111-aaaaaaaa0022',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   'Tamamen kuru modda çalışmak mümkün müdür?',
   'Tasarım koşullarına bağlı olarak belirli dış sıcaklıklara kadar sistem tamamen kuru modda çalışabilir.',
   2,
   1),

  -- ===== SPAREPART 1: Fan Motoru =====
  ('pfqa0101-1111-4111-8111-aaaaaaaa0101',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'Mevcut kulemdeki fan motoru ile uyumluluğu nasıl kontrol edebilirim?',
   'Etiket bilgilerindeki güç, devir ve flanş ölçülerinin teknik dokümanımız ile karşılaştırılması gerekir.',
   1,
   1),
  ('pfqa0102-1111-4111-8111-aaaaaaaa0102',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'Motoru inverter ile kullanabilir miyim?',
   'Uygun izolasyon sınıfına sahip motorlar frekans invertörü ile birlikte kullanılabilir, detaylar için teknik ekibimiz ile iletişime geçiniz.',
   2,
   1),

  -- ===== SPAREPART 2: PVC Dolgu Bloğu =====
  ('pfqa0111-1111-4111-8111-aaaaaaaa0111',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'Dolgu değişimi sırasında kuleyi tamamen durdurmak gerekir mi?',
   'Güvenlik açısından dolgu değişimi sırasında kule devre dışı bırakılmalıdır.',
   1,
   1),
  ('pfqa0112-1111-4111-8111-aaaaaaaa0112',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'PVC dolgu bloklarının ortalama ömrü nedir?',
   'Su kalitesi ve çalışma şartlarına bağlı olarak ortalama 5 yıl ömür beklenir.',
   2,
   1)
ON DUPLICATE KEY UPDATE
  question      = VALUES(question),
  answer        = VALUES(answer),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active);

-- =============================================================
-- 3) PRODUCT REVIEWS
--  (count ve rating alanlarını products tablosu ile uyumlu tuttuk)
-- =============================================================

INSERT INTO product_reviews (
  id,
  product_id,
  user_id,
  rating,
  comment,
  is_active,
  customer_name,
  review_date
)
VALUES
  -- ===== PRODUCT 1: 3 review (review_count = 3, rating ~ 4.90) =====
  ('prev0001-1111-4111-8111-aaaaaaaa0001',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   NULL,
   5,
   'Proses hattımızda 1 yıldır kullanıyoruz, enerji tüketimi ve su sarfiyatı beklediğimizden daha iyi.',
   1,
   'Murat K.',
   '2025-01-15 10:00:00.000'),
  ('prev0002-1111-4111-8111-aaaaaaaa0002',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   NULL,
   5,
   'Montaj ve devreye alma süreci sorunsuz geçti, ses seviyesi düşük.',
   1,
   'Elif A.',
   '2025-02-02 14:30:00.000'),
  ('prev0003-1111-4111-8111-aaaaaaaa0003',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   NULL,
   4,
   'Yoğun yaz döneminde yüksek performans sağladı, yalnızca periyodik temizlik gerekiyor.',
   1,
   'Cem D.',
   '2025-03-10 09:15:00.000'),

  -- ===== PRODUCT 2: 2 review (review_count = 2, rating ~ 4.85) =====
  ('prev0011-1111-4111-8111-aaaaaaaa0011',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   NULL,
   5,
   'Kapalı devre çözüm sayesinde serpantin tarafında kireçlenme sorunumuz kalmadı.',
   1,
   'Ayşe T.',
   '2025-02-20 11:20:00.000'),
  ('prev0012-1111-4111-8111-aaaaaaaa0012',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   NULL,
   4,
   'Bakım kolay, performans stabil. Teknik dokümantasyon yeterli.',
   1,
   'Serkan B.',
   '2025-04-05 16:45:00.000'),

  -- ===== PRODUCT 3: 1 review (review_count = 1, rating ~ 4.95) =====
  ('prev0021-1111-4111-8111-aaaaaaaa0021',
   'bbbb0003-2222-4222-8222-bbbbbbbb0003',
   NULL,
   5,
   'Su tüketimi kısıtlı projede hibrit çözüm ile hem su hem enerji tasarrufu sağladık.',
   1,
   'Zehra L.',
   '2025-03-28 13:10:00.000'),

  -- ===== SPAREPART 1: 3 review (review_count = 3, rating ~ 4.80) =====
  ('prev0101-1111-4111-8111-aaaaaaaa0101',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   NULL,
   5,
   'Fan motoru değişimi sonrası titreşim ve ses azaldı, montajı kolaydı.',
   1,
   'İsmail Y.',
   '2025-01-22 08:40:00.000'),
  ('prev0102-1111-4111-8111-aaaaaaaa0102',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   NULL,
   4,
   'Teslimat süresi makuldü, paketleme sağlamdı.',
   1,
   'Gökhan P.',
   '2025-02-11 17:05:00.000'),
  ('prev0103-1111-4111-8111-aaaaaaaa0103',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   NULL,
   5,
   'Farklı kule markaları ile de uyumlu, stokta bulunduruyoruz.',
   1,
   'Yasemin Z.',
   '2025-03-01 12:25:00.000'),

  -- ===== SPAREPART 2: 5 review (review_count = 5, rating ~ 4.90) =====
  ('prev0111-1111-4111-8111-aaaaaaaa0111',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   NULL,
   5,
   'Mevcut kule dolgumuz ile ölçüleri birebir uydu, montajı hızlı oldu.',
   1,
   'Hüseyin D.',
   '2025-01-18 09:50:00.000'),
  ('prev0112-1111-4111-8111-aaaaaaaa0112',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   NULL,
   5,
   'Satın alma sürecinde teknik ekip hızlı destek verdi.',
   1,
   'Nur S.',
   '2025-02-03 15:35:00.000'),
  ('prev0113-1111-4111-8111-aaaaaaaa0113',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   NULL,
   4,
   'Yoğun debili uygulamada performans gayet iyi.',
   1,
   'Baran E.',
   '2025-02-25 10:05:00.000'),
  ('prev0114-1111-4111-8111-aaaaaaaa0114',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   NULL,
   5,
   'Stokta tutmak için toplu alım yaptık, herhangi bir deformasyon görmedik.',
   1,
   'Mehmet F.',
   '2025-03-12 11:45:00.000'),
  ('prev0115-1111-4111-8111-aaaaaaaa0115',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   NULL,
   5,
   'Kule verimini gözle görülür şekilde artırdı.',
   1,
   'Selin C.',
   '2025-04-01 14:20:00.000')
ON DUPLICATE KEY UPDATE
  rating        = VALUES(rating),
  comment       = VALUES(comment),
  is_active     = VALUES(is_active),
  customer_name = VALUES(customer_name),
  review_date   = VALUES(review_date);

-- =============================================================
-- 4) PRODUCT OPTIONS
--  (RTK tarafta varyant yönetimi için örnek JSON)
-- =============================================================

INSERT INTO product_options (
  id,
  product_id,
  option_name,
  option_values
)
VALUES
  -- ===== PRODUCT 1: Debi / Gövde malzemesi seçenekleri =====
  ('popt0001-1111-4111-8111-aaaaaaaa0001',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Debi Kapasitesi',
   JSON_ARRAY(
     JSON_OBJECT('code','1500','label','1.500 m3/h'),
     JSON_OBJECT('code','2500','label','2.500 m3/h'),
     JSON_OBJECT('code','3500','label','3.500 m3/h'),
     JSON_OBJECT('code','4500','label','4.500 m3/h')
   )),
  ('popt0002-1111-4111-8111-aaaaaaaa0002',
   'bbbb0001-2222-4222-8222-bbbbbbbb0001',
   'Gövde Malzemesi',
   JSON_ARRAY(
     JSON_OBJECT('code','galvaniz','label','Galvaniz Çelik'),
     JSON_OBJECT('code','grp','label','GRP'),
     JSON_OBJECT('code','inox','label','Paslanmaz Çelik (opsiyonel)')
   )),

  -- ===== PRODUCT 2: Serpantin malzemesi / kapasite =====
  ('popt0011-1111-4111-8111-aaaaaaaa0011',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'Serpantin Malzemesi',
   JSON_ARRAY(
     JSON_OBJECT('code','galvaniz','label','Galvaniz Çelik'),
     JSON_OBJECT('code','inox','label','Paslanmaz Çelik')
   )),
  ('popt0012-1111-4111-8111-aaaaaaaa0012',
   'bbbb0002-2222-4222-8222-bbbbbbbb0002',
   'Nominal Kapasite',
   JSON_ARRAY(
     JSON_OBJECT('code','500','label','500 kW'),
     JSON_OBJECT('code','1000','label','1.000 kW'),
     JSON_OBJECT('code','1500','label','1.500 kW'),
     JSON_OBJECT('code','2000','label','2.000 kW')
   )),

  -- ===== SPAREPART 1: Fan motoru güç seçenekleri =====
  ('popt0101-1111-4111-8111-aaaaaaaa0101',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'Motor Güç Seçenekleri',
   JSON_ARRAY(
     JSON_OBJECT('code','75','label','7,5 kW'),
     JSON_OBJECT('code','110','label','11 kW'),
     JSON_OBJECT('code','150','label','15 kW'),
     JSON_OBJECT('code','220','label','22 kW'),
     JSON_OBJECT('code','300','label','30 kW')
   )),

  -- ===== SPAREPART 2: Dolgu blok kalınlığı / tip =====
  ('popt0111-1111-4111-8111-aaaaaaaa0111',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'Dolgu Blok Kalınlığı',
   JSON_ARRAY(
     JSON_OBJECT('code','125','label','125 mm'),
     JSON_OBJECT('code','150','label','150 mm')
   )),
  ('popt0112-1111-4111-8111-aaaaaaaa0112',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'Dolgu Tipi',
   JSON_ARRAY(
     JSON_OBJECT('code','film','label','Film Tip'),
     JSON_OBJECT('code','splash','label','Splash Tip (özel üretim)')
   ))
ON DUPLICATE KEY UPDATE
  option_name   = VALUES(option_name),
  option_values = VALUES(option_values);

-- =============================================================
-- 5) PRODUCT STOCK
--  (Örnek lisans / stok içerikleri – dijital lisans veya seri numarası gibi)
-- =============================================================

INSERT INTO product_stock (
  id,
  product_id,
  stock_content,
  is_used,
  used_at,
  order_item_id
)
VALUES
  -- ===== SPAREPART 1: Fan motoru stokları =====
  ('pstk0101-1111-4111-8111-aaaaaaaa0101',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'FM-7.5-2025-0001',
   0,
   NULL,
   NULL),
  ('pstk0102-1111-4111-8111-aaaaaaaa0102',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'FM-11-2025-0002',
   0,
   NULL,
   NULL),
  ('pstk0103-1111-4111-8111-aaaaaaaa0103',
   'bbbb1001-2222-4222-8222-bbbbbbbb1001',
   'FM-15-2025-0003',
   1,
   '2025-03-05 13:00:00.000',
   NULL),

  -- ===== SPAREPART 2: PVC dolgu stokları =====
  ('pstk0111-1111-4111-8111-aaaaaaaa0111',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'FILL-PVC-150-2025-0001',
   0,
   NULL,
   NULL),
  ('pstk0112-1111-4111-8111-aaaaaaaa0112',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'FILL-PVC-150-2025-0002',
   0,
   NULL,
   NULL),
  ('pstk0113-1111-4111-8111-aaaaaaaa0113',
   'bbbb1002-2222-4222-8222-bbbbbbbb1002',
   'FILL-PVC-125-2025-0003',
   1,
   '2025-04-10 09:30:00.000',
   NULL)
ON DUPLICATE KEY UPDATE
  stock_content = VALUES(stock_content),
  is_used       = VALUES(is_used),
  used_at       = VALUES(used_at),
  order_item_id = VALUES(order_item_id);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
