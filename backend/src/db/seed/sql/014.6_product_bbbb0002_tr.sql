-- =============================================================
-- FILE: 014.6_product_bbbb0002_tr.sql
-- PRODUCT bbbb0002 i18n + specs + faqs + reviews + options (TR)
-- Açık Tip Su Soğutma Kuleleri – Tek Hücreli / CTP Serisi
-- Source: Catalog p.7
-- =============================================================

SET NAMES utf8mb4;

START TRANSACTION;

-- i18n (TR)
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0002-2222-4222-8222-bbbbbbbb0002',
  'de',
  'Açık Tip Su Soğutma Kuleleri – Tek Hücreli (CTP Serisi)',
  'acik-tip-su-sogutma-kuleleri-tek-hucreli-ctp-serisi',
  'CTP serisi tek hücreli açık tip su soğutma kuleleri; geniş model skalası ile farklı kapasite ve debi ihtiyaçlarına uygun çözümler sunar. Kapasite değerleri 35/30/25°C ve 40/30/24°C çalışma koşullarına göre katalogda tablo halinde verilmektedir.',
  'Açık tip su soğutma kulesi – Tek hücreli CTP serisi',
  JSON_ARRAY('açık tip', 'open circuit', 'tek hücreli', 'CTP', 'soğutma kulesi', 'ensotek'),
  JSON_OBJECT(
    'cellType', 'Tek hücreli',
    'series', 'CTP',
    'capacityConditions', JSON_ARRAY('35/30/25°C', '40/30/24°C')
  ),
  'Açık Tip Su Soğutma Kuleleri | Tek Hücreli CTP Serisi | Ensotek',
  'Tek hücreli açık tip su soğutma kuleleri (CTP serisi). CTP-1’den CTP-35’e model seçenekleri; ölçü, ağırlık, kapasite ve debi değerleri katalog tablosunda.'
)
ON DUPLICATE KEY UPDATE
  title=VALUES(title),
  slug=VALUES(slug),
  description=VALUES(description),
  alt=VALUES(alt),
  tags=VALUES(tags),
  specifications=VALUES(specifications),
  meta_title=VALUES(meta_title),
  meta_description=VALUES(meta_description);

-- TECHNICAL SPECS (TR) – derived from p.7 table (range-style summary)
INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr01','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Seri / Hücre Tipi','CTP – Tek hücreli açık tip kuleler','custom',10),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr02','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Model Aralığı','CTP-1 … CTP-35','custom',20),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr03','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Kapasite Koşulları','35/30/25°C ve 40/30/24°C (katalog tablosu)','service',30),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr04','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Kapasite Aralığı (35/30/25°C)','90.000 – 3.500.000 kcal/h (modele göre)','service',40),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr05','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Debi Aralığı (35/30/25°C)','18 – 700 m³/h (modele göre)','service',50),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr06','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Fan Çapı (Ø) Aralığı','630 – 3700 mm (modele göre)','physical',60)
ON DUPLICATE KEY UPDATE
  name=VALUES(name), value=VALUES(value), category=VALUES(category), order_num=VALUES(order_num);

-- FAQS (TR)
INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660002-aaaa-4aaa-8aaa-bbbb0002tr01','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','CTP serisi neyi ifade eder?','CTP, tek hücreli açık tip kuleler için ürün ailesini ifade eder. Modeller CTP-1’den CTP-35’e kadar ölçeklenir.',10,1),
  ('66660002-aaaa-4aaa-8aaa-bbbb0002tr02','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Kapasite değerleri hangi koşullarda veriliyor?','Katalog tablosunda 35/30/25°C ve 40/30/24°C koşulları için kapasite ve debi değerleri paylaşılır.',20,1),
  ('66660002-aaaa-4aaa-8aaa-bbbb0002tr03','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Doğru model seçimi nasıl yapılır?','Hedef soğutma koşulu (örn. 35/30/25°C), ihtiyaç debisi (m³/h) ve saha yerleşimi (taban ölçüsü/yükseklik) birlikte değerlendirilerek seçilir.',30,1)
ON DUPLICATE KEY UPDATE
  question=VALUES(question), answer=VALUES(answer), display_order=VALUES(display_order), is_active=VALUES(is_active);

-- REVIEWS (TR) – sample
INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770002-aaaa-4aaa-8aaa-bbbb0002tr01','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,5,'Tek hücreli seri içinde kapasite skalası çok geniş; seçim kolaylaştı.',1,'Proje Ekibi'),
  ('77770002-aaaa-4aaa-8aaa-bbbb0002tr02','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,4,'Tablo verileriyle hızlı ön boyutlandırma yapabildik.',1,'Saha Operasyon')
ON DUPLICATE KEY UPDATE
  rating=VALUES(rating), comment=VALUES(comment), is_active=VALUES(is_active), customer_name=VALUES(customer_name);

-- OPTIONS (TR) – model list from p.7
INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880002-aaaa-4aaa-8aaa-bbbb0002tr01','bbbb0002-2222-4222-8222-bbbbbbbb0002','Model', JSON_ARRAY(
    'CTP-1','CTP-2','CTP-3','CTP-4','CTP-5','CTP-5.5','CTP-6','CTP-7','CTP-9',
    'CTP-12','CTP-14','CTP-16','CTP-20','CTP-24','CTP-26','CTP-30','CTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name=VALUES(option_name), option_values=VALUES(option_values);

COMMIT;
