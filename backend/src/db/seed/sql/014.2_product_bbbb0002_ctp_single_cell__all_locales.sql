-- =============================================================
-- FILE: 014.2_product_bbbb0002_ctp_single_cell__all_locales.sql (FINAL / VALIDATION ALIGNED)
-- Ensotek – Product Seed (02/..)
-- Product: Open Circuit Cooling Towers – Single Cell / CTP Series
-- Source: Catalog p.7
--
-- FIXES (sparepart pattern):
--  - products.image_url: FULL URL
--  - products.images: MULTI IMAGE JSON_ARRAY
--  - product_i18n.description: PLAIN TEXT (NO HTML)
--  - TR/EN/DE in ONE FILE
--  - product_specs uses order_num (NO display_order)
--  - Re-runnable: ON DUPLICATE KEY UPDATE everywhere possible
--  - child tables: locale-based reset with DELETE
--  - all child IDs: CHAR(36) safe
--  - ✅ product_i18n.specifications: RECORD<string,string> (NO JSON_ARRAY values) (validation.ts aligned)
--
-- RULES:
--  - products.item_type   = 'product'
--  - category_id          = 'aaaa0002-1111-4111-8111-aaaaaaaa0002'  (Open Circuit Cooling Towers)
--  - sub_category_id      = 'bbbb0102-1111-4111-8111-bbbbbbbb0102'  (Mechanical Draft Open Circuit)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- BASE PRODUCT (product)
-- =============================================================
INSERT INTO products (
  id,
  item_type,
  category_id,
  sub_category_id,
  price,
  image_url,
  storage_asset_id,
  images,
  storage_image_ids,
  is_active,
  is_featured,
  order_num,
  product_code,
  stock_quantity,
  rating,
  review_count
)
VALUES (
  'bbbb0002-2222-4222-8222-bbbbbbbb0002',
  'product',
  'aaaa0002-1111-4111-8111-aaaaaaaa0002',
  'bbbb0102-1111-4111-8111-bbbbbbbb0102',
  0.00,
  'http://localhost:8086/uploads/product/open-circuit-ctp-single-1-250x250-1.png',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/open-circuit-ctp-single-1-250x250-1.jpg',
    'http://localhost:8086/uploads/material/open-circuit-ctp-single-2-250x250-1.jpg',
    'http://localhost:8086/uploads/material/open-circuit-ctp-single-3-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  110,
  'CTP-SINGLE',
  0,
  5.00,
  0
)
ON DUPLICATE KEY UPDATE
  item_type          = VALUES(item_type),
  category_id        = VALUES(category_id),
  sub_category_id    = VALUES(sub_category_id),
  price              = VALUES(price),
  image_url          = VALUES(image_url),
  storage_asset_id   = VALUES(storage_asset_id),
  images             = VALUES(images),
  storage_image_ids  = VALUES(storage_image_ids),
  is_active          = VALUES(is_active),
  is_featured        = VALUES(is_featured),
  order_num          = VALUES(order_num),
  product_code       = VALUES(product_code),
  stock_quantity     = VALUES(stock_quantity),
  rating             = VALUES(rating),
  review_count       = VALUES(review_count);

-- =============================================================
-- I18N (TR) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0002-2222-4222-8222-bbbbbbbb0002',
  'tr',
  'Açık Tip Su Soğutma Kuleleri – Tek Hücreli (CTP Serisi)',
  'acik-tip-su-sogutma-kuleleri-tek-hucreli-ctp-serisi',
  'CTP serisi tek hücreli açık tip su soğutma kuleleri; geniş model skalası ile farklı kapasite ve debi ihtiyaçlarına uygun çözümler sunar. Kapasite değerleri 35/30/25°C ve 40/30/24°C çalışma koşullarına göre katalogda tablo halinde verilmektedir.',
  'Açık tip su soğutma kulesi – Tek hücreli CTP serisi',
  JSON_ARRAY('açık tip', 'open circuit', 'tek hücreli', 'CTP', 'soğutma kulesi', 'ensotek'),
  -- ✅ validation.ts: Record<string,string> -> ALL VALUES MUST BE STRING
  JSON_OBJECT(
    'cellType', 'Tek hücreli',
    'series', 'CTP',
    'capacityConditions', '35/30/25°C | 40/30/24°C'
  ),
  'Açık Tip Su Soğutma Kuleleri | Tek Hücreli CTP Serisi | Ensotek',
  'Tek hücreli açık tip su soğutma kuleleri (CTP serisi). CTP-1’den CTP-35’e model seçenekleri; ölçü, ağırlık, kapasite ve debi değerleri katalog tablosunda.'
)
ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  updated_at       = CURRENT_TIMESTAMP(3);

-- SPECS (TR)
DELETE FROM product_specs
WHERE product_id='bbbb0002-2222-4222-8222-bbbbbbbb0002' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr01','bbbb0002-2222-4222-8222-bbbbbbbb0002','tr','Seri / Hücre Tipi','CTP – Tek hücreli açık tip kuleler','custom',10),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr02','bbbb0002-2222-4222-8222-bbbbbbbb0002','tr','Model Aralığı','CTP-1 … CTP-35','custom',20),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr03','bbbb0002-2222-4222-8222-bbbbbbbb0002','tr','Kapasite Koşulları','35/30/25°C ve 40/30/24°C (katalog tablosu)','service',30),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr04','bbbb0002-2222-4222-8222-bbbbbbbb0002','tr','Kapasite Aralığı (35/30/25°C)','90.000 – 3.500.000 kcal/h (modele göre)','service',40),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr05','bbbb0002-2222-4222-8222-bbbbbbbb0002','tr','Debi Aralığı (35/30/25°C)','18 – 700 m³/h (modele göre)','service',50),
  ('55550002-aaaa-4aaa-8aaa-bbbb0002tr06','bbbb0002-2222-4222-8222-bbbbbbbb0002','tr','Fan Çapı (Ø) Aralığı','630 – 3700 mm (modele göre)','physical',60);

-- FAQS (TR)
DELETE FROM product_faqs
WHERE product_id='bbbb0002-2222-4222-8222-bbbbbbbb0002' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660002-aaaa-4aaa-8aaa-bbbb0002tr01','bbbb0002-2222-4222-8222-bbbbbbbb0002','tr','CTP serisi neyi ifade eder?','CTP, tek hücreli açık tip kuleler için ürün ailesini ifade eder. Modeller CTP-1’den CTP-35’e kadar ölçeklenir.',10,1),
  ('66660002-aaaa-4aaa-8aaa-bbbb0002tr02','bbbb0002-2222-4222-8222-bbbbbbbb0002','tr','Kapasite değerleri hangi koşullarda veriliyor?','Katalog tablosunda 35/30/25°C ve 40/30/24°C koşulları için kapasite ve debi değerleri paylaşılır.',20,1),
  ('66660002-aaaa-4aaa-8aaa-bbbb0002tr03','bbbb0002-2222-4222-8222-bbbbbbbb0002','tr','Doğru model seçimi nasıl yapılır?','Hedef soğutma koşulu (örn. 35/30/25°C), ihtiyaç debisi (m³/h) ve saha yerleşimi (taban ölçüsü/yükseklik) birlikte değerlendirilerek seçilir.',30,1);

-- REVIEWS (TR)
DELETE FROM product_reviews
WHERE id IN (
  '77770002-aaaa-4aaa-8aaa-bbbb0002tr01',
  '77770002-aaaa-4aaa-8aaa-bbbb0002tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770002-aaaa-4aaa-8aaa-bbbb0002tr01','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,5,'Tek hücreli seri içinde kapasite skalası çok geniş; seçim kolaylaştı.',1,'Proje Ekibi'),
  ('77770002-aaaa-4aaa-8aaa-bbbb0002tr02','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,4,'Tablo verileriyle hızlı ön boyutlandırma yapabildik.',1,'Saha Operasyon');

-- OPTIONS (TR)
DELETE FROM product_options
WHERE id='88880002-aaaa-4aaa-8aaa-bbbb0002tr01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880002-aaaa-4aaa-8aaa-bbbb0002tr01','bbbb0002-2222-4222-8222-bbbbbbbb0002','Model', JSON_ARRAY(
    'CTP-1','CTP-2','CTP-3','CTP-4','CTP-5','CTP-5.5','CTP-6','CTP-7','CTP-9',
    'CTP-12','CTP-14','CTP-16','CTP-20','CTP-24','CTP-26','CTP-30','CTP-35'
  ));

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0002-2222-4222-8222-bbbbbbbb0002',
  'en',
  'Open Circuit Cooling Towers – Single Cell (CTP Series)',
  'open-circuit-cooling-towers-single-cell-ctp-series',
  'CTP single-cell open circuit cooling towers provide a wide model range to match different capacity and flow requirements. Capacity and flow rate values are provided in the catalog table for 35/30/25°C and 40/30/24°C operating conditions.',
  'Open circuit cooling tower – single cell CTP series',
  JSON_ARRAY('open circuit', 'single cell', 'CTP', 'cooling tower', 'ensotek'),
  -- ✅ validation.ts: Record<string,string> -> ALL VALUES MUST BE STRING
  JSON_OBJECT(
    'cellType', 'Single cell',
    'series', 'CTP',
    'capacityConditions', '35/30/25°C | 40/30/24°C'
  ),
  'Open Circuit Cooling Towers | Single Cell CTP Series | Ensotek',
  'Single-cell open circuit cooling towers (CTP series). Model options from CTP-1 to CTP-35; dimensions, weights, capacities and flow rates are listed in the catalog table.'
)
ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  updated_at       = CURRENT_TIMESTAMP(3);

-- SPECS (EN)
DELETE FROM product_specs
WHERE product_id='bbbb0002-2222-4222-8222-bbbbbbbb0002' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en01','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Series / Cell Type','CTP – single cell open circuit towers','custom',10),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en02','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Model Range','CTP-1 … CTP-35','custom',20),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en03','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Capacity Conditions','35/30/25°C and 40/30/24°C (catalog table)','service',30),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en04','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Capacity Range (35/30/25°C)','90,000 – 3,500,000 kcal/h (model dependent)','service',40),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en05','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Flow Rate Range (35/30/25°C)','18 – 700 m³/h (model dependent)','service',50),
  ('55550002-bbbb-4bbb-8bbb-bbbb0002en06','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Fan Diameter (Ø) Range','630 – 3700 mm (model dependent)','physical',60);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb0002-2222-4222-8222-bbbbbbbb0002' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660002-bbbb-4bbb-8bbb-bbbb0002en01','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','What does the CTP series represent?','CTP refers to the single-cell open circuit tower family. Models scale from CTP-1 up to CTP-35.',10,1),
  ('66660002-bbbb-4bbb-8bbb-bbbb0002en02','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','Under which conditions are capacities provided?','The catalog table provides capacity and flow rates for 35/30/25°C and 40/30/24°C operating conditions.',20,1),
  ('66660002-bbbb-4bbb-8bbb-bbbb0002en03','bbbb0002-2222-4222-8222-bbbbbbbb0002','en','How do I choose the right model?','Select based on target operating condition, required flow rate (m³/h), and installation constraints such as base area and height.',30,1);

-- REVIEWS (EN)
DELETE FROM product_reviews
WHERE id IN (
  '77770002-bbbb-4bbb-8bbb-bbbb0002en01',
  '77770002-bbbb-4bbb-8bbb-bbbb0002en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770002-bbbb-4bbb-8bbb-bbbb0002en01','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,5,'Very broad model range; sizing became straightforward.',1,'Project Team'),
  ('77770002-bbbb-4bbb-8bbb-bbbb0002en02','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,4,'Catalog table is practical for quick pre-sizing.',1,'Operations');

-- OPTIONS (EN)
DELETE FROM product_options
WHERE id='88880002-bbbb-4bbb-8bbb-bbbb0002en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880002-bbbb-4bbb-8bbb-bbbb0002en01','bbbb0002-2222-4222-8222-bbbbbbbb0002','Model', JSON_ARRAY(
    'CTP-1','CTP-2','CTP-3','CTP-4','CTP-5','CTP-5.5','CTP-6','CTP-7','CTP-9',
    'CTP-12','CTP-14','CTP-16','CTP-20','CTP-24','CTP-26','CTP-30','CTP-35'
  ));

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0002-2222-4222-8222-bbbbbbbb0002',
  'de',
  'Offene Kühltürme – Einzelzelle (CTP-Serie)',
  'offene-kuehltuerme-einzelzelle-ctp-serie',
  'Die CTP-Serie (Einzelzelle) der offenen Kühltürme bietet eine breite Modellauswahl für unterschiedliche Kapazitäts- und Volumenstromanforderungen. Kapazität und Volumenstrom sind in der Katalogtabelle für die Betriebsbedingungen 35/30/25°C und 40/30/24°C angegeben.',
  'Offener Kühlturm – Einzelzelle CTP-Serie',
  JSON_ARRAY('offener kühlturm', 'open circuit', 'einzelzelle', 'CTP', 'ensotek'),
  -- ✅ validation.ts: Record<string,string> -> ALL VALUES MUST BE STRING
  JSON_OBJECT(
    'zelltyp', 'Einzelzelle',
    'serie', 'CTP',
    'betriebsbedingungen', '35/30/25°C | 40/30/24°C'
  ),
  'Offene Kühltürme | Einzelzelle CTP-Serie | Ensotek',
  'Einzelzellige offene Kühltürme (CTP-Serie) von CTP-1 bis CTP-35. Abmessungen, Gewichte, Kapazitäten und Volumenströme sind in der Katalogtabelle gelistet.'
)
ON DUPLICATE KEY UPDATE
  title            = VALUES(title),
  slug             = VALUES(slug),
  description      = VALUES(description),
  alt              = VALUES(alt),
  tags             = VALUES(tags),
  specifications   = VALUES(specifications),
  meta_title       = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  updated_at       = CURRENT_TIMESTAMP(3);

-- SPECS (DE)
DELETE FROM product_specs
WHERE product_id='bbbb0002-2222-4222-8222-bbbbbbbb0002' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550002-cccc-4ccc-8ccc-bbbb0002de01','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Serie / Zelltyp','CTP – offene Kühltürme, Einzelzelle','custom',10),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de02','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Modellbereich','CTP-1 … CTP-35','custom',20),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de03','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Betriebsbedingungen','35/30/25°C und 40/30/24°C (Katalogtabelle)','service',30),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de04','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Kapazitätsbereich (35/30/25°C)','90.000 – 3.500.000 kcal/h (modellabhängig)','service',40),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de05','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Volumenstrombereich (35/30/25°C)','18 – 700 m³/h (modellabhängig)','service',50),
  ('55550002-cccc-4ccc-8ccc-bbbb0002de06','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Ventilator-Ø Bereich','630 – 3700 mm (modellabhängig)','physical',60);

-- FAQS (DE)
DELETE FROM product_faqs
WHERE product_id='bbbb0002-2222-4222-8222-bbbbbbbb0002' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660002-cccc-4ccc-8ccc-bbbb0002de01','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Wofür steht die CTP-Serie?','CTP bezeichnet die Einzelzelle-Produktfamilie der offenen Kühltürme. Die Modelle skalieren von CTP-1 bis CTP-35.',10,1),
  ('66660002-cccc-4ccc-8ccc-bbbb0002de02','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Unter welchen Bedingungen sind die Kapazitäten angegeben?','Die Katalogtabelle enthält Kapazität und Volumenstrom für 35/30/25°C sowie 40/30/24°C.',20,1),
  ('66660002-cccc-4ccc-8ccc-bbbb0002de03','bbbb0002-2222-4222-8222-bbbbbbbb0002','de','Wie wähle ich das richtige Modell?','Auswahl anhand Ziel-Betriebsbedingung, benötigtem Volumenstrom (m³/h) und Einbaubedingungen (Grundfläche/Höhe).',30,1);

-- REVIEWS (DE)
DELETE FROM product_reviews
WHERE id IN (
  '77770002-cccc-4ccc-8ccc-bbbb0002de01',
  '77770002-cccc-4ccc-8ccc-bbbb0002de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770002-cccc-4ccc-8ccc-bbbb0002de01','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,5,'Sehr große Modellbandbreite – schnelle Vor-Auslegung möglich.',1,'Planung'),
  ('77770002-cccc-4ccc-8ccc-bbbb0002de02','bbbb0002-2222-4222-8222-bbbbbbbb0002',NULL,4,'Tabellenwerte sind für die Projektierung sehr hilfreich.',1,'Betrieb');

-- OPTIONS (DE)
DELETE FROM product_options
WHERE id='88880002-cccc-4ccc-8ccc-bbbb0002de01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880002-cccc-4ccc-8ccc-bbbb0002de01','bbbb0002-2222-4222-8222-bbbbbbbb0002','Modell', JSON_ARRAY(
    'CTP-1','CTP-2','CTP-3','CTP-4','CTP-5','CTP-5.5','CTP-6','CTP-7','CTP-9',
    'CTP-12','CTP-14','CTP-16','CTP-20','CTP-24','CTP-26','CTP-30','CTP-35'
  ));

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
