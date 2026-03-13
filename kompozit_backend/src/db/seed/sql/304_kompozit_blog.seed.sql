-- =============================================================
-- FILE: 304_kompozit_blog.seed.sql
-- MOE Kompozit — Blog yazilari (custom_pages) + i18n (TR/EN)
-- module_key = 'kompozit_blog'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 1) CUSTOM PAGES (BASE)
-- =========================
INSERT INTO `custom_pages`
(
  `id`,
  `module_key`,
  `is_published`,
  `featured`,
  `display_order`,
  `order_num`,
  `featured_image`,
  `featured_image_asset_id`,
  `image_url`,
  `storage_asset_id`,
  `images`,
  `storage_image_ids`,
  `category_id`,
  `sub_category_id`
)
VALUES
  ('bb010001-5001-4001-9001-bbbbbbbb0001', 'kompozit_blog', 1, 1, 10, 10, '/media/blog-placeholder.svg', NULL, '/media/blog-placeholder.svg', NULL, '[]', '[]', NULL, NULL),
  ('bb010002-5002-4002-9002-bbbbbbbb0002', 'kompozit_blog', 1, 1, 20, 20, '/media/blog-placeholder.svg', NULL, '/media/blog-placeholder.svg', NULL, '[]', '[]', NULL, NULL),
  ('bb010003-5003-4003-9003-bbbbbbbb0003', 'kompozit_blog', 1, 0, 30, 30, '/media/blog-placeholder.svg', NULL, '/media/blog-placeholder.svg', NULL, '[]', '[]', NULL, NULL),
  ('bb010004-5004-4004-9004-bbbbbbbb0004', 'kompozit_blog', 1, 0, 40, 40, '/media/blog-placeholder.svg', NULL, '/media/blog-placeholder.svg', NULL, '[]', '[]', NULL, NULL)
ON DUPLICATE KEY UPDATE
  `module_key`   = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `featured`     = VALUES(`featured`),
  `display_order`= VALUES(`display_order`),
  `featured_image` = VALUES(`featured_image`),
  `image_url` = VALUES(`image_url`);

-- =========================
-- 2) CUSTOM PAGES I18N — TR
-- =========================
INSERT INTO `custom_pages_i18n`
(
  `id`,
  `page_id`,
  `locale`,
  `title`,
  `slug`,
  `content`,
  `summary`,
  `meta_title`,
  `meta_description`,
  `tags`
)
VALUES
  (
    'bb020001-6001-4001-a001-bbbbbbbb0001',
    'bb010001-5001-4001-9001-bbbbbbbb0001',
    'tr',
    'Karbon Fiber Nedir? Özellikleri ve Kullanım Alanları',
    'karbon-fiber-nedir',
    JSON_OBJECT('html', '<p>Karbon fiber, yüksek mukavemet ve düşük ağırlık gerektiren uygulamalarda kullanılan ileri kompozit takviye malzemelerinden biridir. Özellikle boyutsal kararlılık, yorulma dayanımı ve hafif yapı hedeflenen projelerde önemli avantaj sağlar.</p><p>Havacılık, otomotiv, savunma, spor ekipmanları ve endüstriyel makine bileşenlerinde karbon fiber tercih edilmesinin temel nedeni, dayanım ile ağırlık arasında verimli bir denge kurabilmesidir.</p><h2>Karbon Fiberin Temel Özellikleri</h2><ul><li>Yüksek mukavemet / düşük ağırlık oranı</li><li>Korozyona karşı dayanım</li><li>Boyutsal kararlılık</li><li>Doğru tasarımla yüksek rijitlik</li></ul><h2>Kullanım Alanları</h2><p>Karbon fiber; yapısal paneller, koruyucu muhafazalar, hafif taşıyıcı parçalar, özel makine bileşenleri ve performans odaklı endüstriyel uygulamalarda öne çıkar. Ancak doğru sonuç için yalnızca malzeme seçimi yeterli değildir; reçine sistemi, katman yapısı, yüzey beklentisi ve üretim prosesi birlikte değerlendirilmelidir.</p><p>MOE Kompozit, karbon fiber uygulamalarında mühendislik, numune doğrulama ve seri üretime geçiş süreçlerini proje ihtiyaçlarına göre birlikte ele alır.</p>'),
    'Karbon fiberin temel özellikleri, avantajları ve endüstriyel kullanım alanları hakkında teknik özet.',
    'Karbon Fiber Nedir? Özellikleri ve Kullanım Alanları | MOE Kompozit',
    'Karbon fiberin özellikleri, avantajları ve kullanım alanları hakkında teknik bilgiler. MOE Kompozit karbon fiber çözümleri.',
    'karbon fiber, kompozit malzeme, karbon fiber özellikleri'
  ),
  (
    'bb020002-6002-4002-a002-bbbbbbbb0002',
    'bb010002-5002-4002-9002-bbbbbbbb0002',
    'tr',
    'CTP ve Fiberglass Arasındaki Farklar',
    'ctp-fiberglass-farklari',
    JSON_OBJECT('html', '<p>CTP (Cam Takviyeli Polyester) ile fiberglass kavramları çoğu zaman birbirinin yerine kullanılsa da teknik olarak aynı şeyi ifade etmez. Fiberglass, genel olarak cam elyaf takviyeli yapıların yaygın adıdır; CTP ise cam elyafın polyester reçine ile birleştirildiği spesifik kompozit yapıyı tarif eder.</p><h2>CTP Nedir?</h2><p>CTP; mekanik dayanım, kimyasal direnç ve maliyet/performans dengesi nedeniyle endüstriyel gövde, kapak, panel ve koruyucu parçalarda sık kullanılan bir kompozit çözümdür.</p><h2>Fiberglass Ne Anlama Gelir?</h2><p>Fiberglass ifadesi daha geniş bir kullanım alanına sahiptir ve cam elyaf takviyeli farklı reçine sistemlerini kapsayabilir. Bu nedenle projede teknik karar verirken kullanılan reçine tipi, üretim yöntemi ve hedef performans ayrıca netleştirilmelidir.</p>'),
    'CTP ve fiberglass kavramları arasındaki teknik farkları ve doğru malzeme seçimi yaklaşımını özetler.',
    'CTP ve Fiberglass Arasındaki Farklar | MOE Kompozit',
    'CTP ve fiberglass arasındaki teknik farklar, kullanım alanları ve doğru malzeme seçimi için temel bilgiler.',
    'CTP, fiberglass, cam elyaf, kompozit karşılaştırma'
  ),
  (
    'bb020003-6003-4003-a003-bbbbbbbb0003',
    'bb010003-5003-4003-9003-bbbbbbbb0003',
    'tr',
    'Kompozit Malzemelerde Kalite Kontrol Süreçleri',
    'kompozit-kalite-kontrol',
    JSON_OBJECT('html', '<p>Kompozit üretimde kalite kontrol yalnızca son ürün muayenesi değildir; hammadde girişinden kalıp hazırlığına, proses parametrelerinden son kontrol ve dokümantasyona kadar uzanan bütüncül bir disiplindir.</p><h2>Başlıca Kontrol Aşamaları</h2><ol><li>Hammadde ve takviye malzemesi kontrolü</li><li>Üretim süreci ve katman yerleşimi takibi</li><li>Boyutsal ölçüm ve tolerans kontrolü</li><li>Görsel yüzey kontrolü</li><li>Gerekli durumlarda mekanik test ve doğrulama</li></ol><p>Kalite kontrol yaklaşımı, parçanın kullanım yerine ve performans beklentisine göre şekillendirilmelidir. Özellikle seri üretime geçişte proses tekrarlanabilirliği en kritik başlıklardan biridir.</p>'),
    'Kompozit üretimde kalite kontrol aşamalarını ve proses tekrarlanabilirliği açısından kritik noktaları açıklar.',
    'Kompozit Kalite Kontrol Süreçleri | MOE Kompozit',
    'Kompozit malzemelerde kalite kontrol süreçleri, test yaklaşımı ve üretim takibine dair temel bilgiler.',
    'kalite kontrol, kompozit test, ISO standartları'
  ),
  (
    'bb020004-6004-4004-a004-bbbbbbbb0004',
    'bb010004-5004-4004-9004-bbbbbbbb0004',
    'tr',
    'Endustriyel Kompozit Cozumlerin Gelecegi',
    'endustriyel-kompozit-gelecek',
    JSON_OBJECT('html', '<p>Kompozit malzemeler, geleneksel metallerin yerini hizla almaktadir. Hafiflik, dayaniklilik ve tasarim esnekligi sayesinde otomotiv, enerji ve insaat sektorlerinde kullanimi her yil artmaktadir.</p><h2>Gelecek Trendleri</h2><ul><li>Elektrikli arac hafifletme</li><li>Ruzgar turbini kanatlari</li><li>3D baski ile kompozit uretim</li><li>Geri donusturulabilir kompozitler</li></ul>'),
    'Endustriyel kompozit malzemelerin gelecegi ve sektordeki yenilikci trendler.',
    'Kompozit Gelecegi | MOE Kompozit',
    'Endustriyel kompozit cozumlerin gelecegi, trendler ve inovasyon.',
    'kompozit gelecek, endustriyel kompozit, inovasyon'
  )
ON DUPLICATE KEY UPDATE
  `title`            = VALUES(`title`),
  `slug`             = VALUES(`slug`),
  `content`          = VALUES(`content`),
  `summary`          = VALUES(`summary`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `tags`             = VALUES(`tags`);

-- =========================
-- 3) CUSTOM PAGES I18N — EN
-- =========================
INSERT INTO `custom_pages_i18n`
(
  `id`,
  `page_id`,
  `locale`,
  `title`,
  `slug`,
  `content`,
  `summary`,
  `meta_title`,
  `meta_description`,
  `tags`
)
VALUES
  (
    'bb020005-6005-4005-a005-bbbbbbbb0005',
    'bb010001-5001-4001-9001-bbbbbbbb0001',
    'en',
    'What is Carbon Fiber? Properties and Applications',
    'what-is-carbon-fiber',
    JSON_OBJECT('html', '<p>Carbon fiber is an advanced material with an exceptional strength-to-weight ratio. It is widely used across aerospace, automotive, sports, and industrial applications.</p><h2>Advantages of Carbon Fiber</h2><ul><li>5 times stronger than steel</li><li>40% lighter than aluminum</li><li>Corrosion resistant</li><li>High temperature resistance</li></ul><p>At MOE Kompozit, we manufacture carbon fiber products to the highest quality standards.</p>'),
    'A comprehensive guide to carbon fiber properties, advantages, and industrial applications.',
    'What is Carbon Fiber? | MOE Kompozit',
    'Carbon fiber properties, advantages, and applications. MOE Kompozit industrial carbon fiber solutions.',
    'carbon fiber, composite material, carbon fiber properties'
  ),
  (
    'bb020006-6006-4006-a006-bbbbbbbb0006',
    'bb010002-5002-4002-9002-bbbbbbbb0002',
    'en',
    'Differences Between FRP and Fiberglass',
    'frp-fiberglass-differences',
    JSON_OBJECT('html', '<p>FRP (Fiber Reinforced Polymer) and fiberglass are two of the most common materials in the composite industry. While both contain glass fibers, their manufacturing methods and performance characteristics differ significantly.</p><h2>What is FRP?</h2><p>Glass fiber reinforced polyester resin composite. It offers high mechanical strength and chemical resistance.</p><h2>What is Fiberglass?</h2><p>The general term for thin fibers made from glass. Widely used in insulation, automotive, and marine industries.</p>'),
    'Technical comparison of FRP and fiberglass materials and a guide to choosing the right material.',
    'FRP vs Fiberglass Differences | MOE Kompozit',
    'Technical differences between FRP and fiberglass, their advantages and application areas compared.',
    'FRP, fiberglass, glass fiber, composite comparison'
  ),
  (
    'bb020007-6007-4007-a007-bbbbbbbb0007',
    'bb010003-5003-4003-9003-bbbbbbbb0003',
    'en',
    'Quality Control Processes in Composite Materials',
    'composite-quality-control',
    JSON_OBJECT('html', '<p>Quality control in composite manufacturing is critical for product reliability and performance. At MOE Kompozit, we implement ISO-standard quality control processes.</p><h2>Quality Control Steps</h2><ol><li>Raw material incoming inspection</li><li>Production process monitoring</li><li>Dimensional control</li><li>Mechanical testing</li><li>Visual inspection</li></ol>'),
    'Quality control processes and ISO-standard testing methods in composite manufacturing.',
    'Composite Quality Control | MOE Kompozit',
    'Quality control processes, testing methods, and ISO standards in composite materials.',
    'quality control, composite testing, ISO standards'
  ),
  (
    'bb020008-6008-4008-a008-bbbbbbbb0008',
    'bb010004-5004-4004-9004-bbbbbbbb0004',
    'en',
    'The Future of Industrial Composite Solutions',
    'industrial-composite-future',
    JSON_OBJECT('html', '<p>Composite materials are rapidly replacing traditional metals. Thanks to their lightweight nature, durability, and design flexibility, their use in automotive, energy, and construction sectors grows each year.</p><h2>Future Trends</h2><ul><li>Electric vehicle lightweighting</li><li>Wind turbine blades</li><li>3D printed composites</li><li>Recyclable composites</li></ul>'),
    'The future of industrial composite materials and innovative trends in the sector.',
    'Composite Future | MOE Kompozit',
    'The future of industrial composite solutions, trends, and innovation.',
    'composite future, industrial composite, innovation'
  )
ON DUPLICATE KEY UPDATE
  `title`            = VALUES(`title`),
  `slug`             = VALUES(`slug`),
  `content`          = VALUES(`content`),
  `summary`          = VALUES(`summary`),
  `meta_title`       = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `tags`             = VALUES(`tags`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
