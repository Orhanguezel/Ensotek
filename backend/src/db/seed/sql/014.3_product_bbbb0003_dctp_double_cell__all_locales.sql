-- =============================================================
-- FILE: 014.3_product_bbbb0003_dctp_double_cell__all_locales.sql (FINAL)
-- Ensotek – Product Seed (03/..)
-- Product: Open Circuit Cooling Towers – Double Cell / DCTP Series
-- Source: Catalog p.8
--
-- FIXES (aligned with 014.2 pattern):
--  - products.image_url: FULL URL
--  - products.images: MULTI IMAGE JSON_ARRAY
--  - product_i18n.description: PLAIN TEXT (NO HTML)
--  - TR/EN/DE in ONE FILE
--  - product_specs uses order_num (NO display_order)
--  - Re-runnable: ON DUPLICATE KEY UPDATE everywhere possible
--  - child tables: locale-based reset with DELETE
--  - all child IDs: CHAR(36) safe
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
  'bbbb0003-2222-4222-8222-bbbbbbbb0003',
  'product',
  'aaaa0002-1111-4111-8111-aaaaaaaa0002',
  'bbbb0102-1111-4111-8111-bbbbbbbb0102',
  0.00,
  'http://localhost:8086/uploads/product/open-circuit-dctp-double-1-250x250-1.png',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/open-circuit-dctp-double-1-250x250-1.jpg',
    'http://localhost:8086/uploads/material/open-circuit-dctp-double-2-250x250-1.jpg',
    'http://localhost:8086/uploads/material/open-circuit-dctp-double-3-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  120,
  'DCTP-DOUBLE',
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
  'bbbb0003-2222-4222-8222-bbbbbbbb0003',
  'tr',
  'Açık Tip Su Soğutma Kuleleri – İki Hücreli (DCTP Serisi)',
  'acik-tip-su-sogutma-kuleleri-iki-hucreli-dctp-serisi',
  'DCTP serisi iki hücreli açık tip su soğutma kuleleri, yüksek kapasite ve debi ihtiyaçlarında çift hücreli yapı ile çözüm sunar. Katalog tablosunda her model için ölçüler, ağırlıklar, kapasite ve debi değerleri 35/30/25°C ve 40/30/24°C koşullarında verilmiştir.',
  'Açık tip su soğutma kulesi – İki hücreli DCTP serisi',
  JSON_ARRAY('açık tip','open circuit','iki hücreli','DCTP','soğutma kulesi','ensotek'),
  JSON_OBJECT(
    'cellType','İki hücreli',
    'series','DCTP',
    'capacityConditions', JSON_ARRAY('35/30/25°C','40/30/24°C')
  ),
  'Açık Tip Su Soğutma Kuleleri | İki Hücreli DCTP Serisi | Ensotek',
  'İki hücreli açık tip kuleler (DCTP serisi). DCTP-3’ten DCTP-35’e model seçenekleri; ölçü, ağırlık, kapasite ve debi değerleri katalog tablosuna göre.'
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

-- SPECS (TR) — locale reset
DELETE FROM product_specs
WHERE product_id='bbbb0003-2222-4222-8222-bbbbbbbb0003' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550003-aaaa-4aaa-8aaa-bbbb0003tr01','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Seri / Hücre Tipi','DCTP – iki hücreli açık tip kuleler','custom',10),
  ('55550003-aaaa-4aaa-8aaa-bbbb0003tr02','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Model Aralığı','DCTP-3 … DCTP-35','custom',20),
  ('55550003-aaaa-4aaa-8aaa-bbbb0003tr03','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Fan Grubu','2×930 … 2×3150 (mm)','physical',30),
  ('55550003-aaaa-4aaa-8aaa-bbbb0003tr04','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Kapasite Aralığı (35/30/25°C)','500.000 – 7.000.000 kcal/h (modele göre)','service',40),
  ('55550003-aaaa-4aaa-8aaa-bbbb0003tr05','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Debi Aralığı (35/30/25°C)','100 – 1400 m³/h (modele göre)','service',50),
  ('55550003-aaaa-4aaa-8aaa-bbbb0003tr06','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Kapasite Aralığı (40/30/24°C)','720.000 – 10.500.000 kcal/h (modele göre)','service',60),
  ('55550003-aaaa-4aaa-8aaa-bbbb0003tr07','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Debi Aralığı (40/30/24°C)','72 – 1050 m³/h (modele göre)','service',70),
  ('55550003-aaaa-4aaa-8aaa-bbbb0003tr08','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Ağırlık (Boş/Çalışır)','780–8900 kg / 2500–45000 kg (modele göre)','physical',80)
ON DUPLICATE KEY UPDATE
  name      = VALUES(name),
  value     = VALUES(value),
  category  = VALUES(category),
  order_num = VALUES(order_num);

-- FAQS (TR) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb0003-2222-4222-8222-bbbbbbbb0003' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660003-aaaa-4aaa-8aaa-bbbb0003tr01','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','İki hücreli kule ne zaman tercih edilir?','Yüksek kapasite ve debi ihtiyaçlarında ve işletme sürekliliği için çift hücreli (redundant) yapı istenen projelerde tercih edilir.',10,1),
  ('66660003-aaaa-4aaa-8aaa-bbbb0003tr02','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Kapasite değerleri hangi koşullarda veriliyor?','Katalog tablosunda 35/30/25°C ve 40/30/24°C koşullarına göre kapasite (kcal/h) ve debi (m³/h) verilir.',20,1),
  ('66660003-aaaa-4aaa-8aaa-bbbb0003tr03','bbbb0003-2222-4222-8222-bbbbbbbb0003','tr','Model seçimi nasıl yapılır?','Hedef koşul, istenen debi, saha ölçüleri (taban alanı/yükseklik) ve ağırlık/taşıma şartları birlikte değerlendirilerek seçilir.',30,1)
ON DUPLICATE KEY UPDATE
  question      = VALUES(question),
  answer        = VALUES(answer),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active);

-- REVIEWS (TR) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '77770003-aaaa-4aaa-8aaa-bbbb0003tr01',
  '77770003-aaaa-4aaa-8aaa-bbbb0003tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770003-aaaa-4aaa-8aaa-bbbb0003tr01','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,5,'Çift hücreli yapı sayesinde yüksek debide stabil performans aldık.',1,'Proje Mühendisliği'),
  ('77770003-aaaa-4aaa-8aaa-bbbb0003tr02','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,4,'Katalog tablosu seçimde çok iş gördü; yerleşim planı netleşti.',1,'Saha Ekibi');

-- OPTIONS (TR) — id-based reset
DELETE FROM product_options
WHERE id='88880003-aaaa-4aaa-8aaa-bbbb0003tr01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880003-aaaa-4aaa-8aaa-bbbb0003tr01','bbbb0003-2222-4222-8222-bbbbbbbb0003','Model', JSON_ARRAY(
    'DCTP-3','DCTP-4','DCTP-5','DCTP-5.5','DCTP-6','DCTP-7','DCTP-9',
    'DCTP-12','DCTP-14','DCTP-16','DCTP-20','DCTP-24','DCTP-26','DCTP-30','DCTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name   = VALUES(option_name),
  option_values = VALUES(option_values);

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0003-2222-4222-8222-bbbbbbbb0003',
  'en',
  'Open Circuit Cooling Towers – Double Cell (DCTP Series)',
  'open-circuit-cooling-towers-double-cell-dctp-series',
  'DCTP double-cell open circuit cooling towers address higher capacity and flow requirements with a dual-cell configuration. The catalog table provides dimensions, weights, capacity and flow rate values for 35/30/25°C and 40/30/24°C operating conditions.',
  'Open circuit cooling tower – double cell DCTP series',
  JSON_ARRAY('open circuit','double cell','DCTP','cooling tower','ensotek'),
  JSON_OBJECT(
    'cellType','Double cell',
    'series','DCTP',
    'capacityConditions',JSON_ARRAY('35/30/25°C','40/30/24°C')
  ),
  'Open Circuit Cooling Towers | Double Cell DCTP Series | Ensotek',
  'Double-cell open circuit towers (DCTP series). Model options from DCTP-3 to DCTP-35; dimensions, weights, capacities and flow rates per catalog table.'
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

-- SPECS (EN) — locale reset
DELETE FROM product_specs
WHERE product_id='bbbb0003-2222-4222-8222-bbbbbbbb0003' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550003-bbbb-4bbb-8bbb-bbbb0003en01','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Series / Cell Type','DCTP – double cell open circuit towers','custom',10),
  ('55550003-bbbb-4bbb-8bbb-bbbb0003en02','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Model Range','DCTP-3 … DCTP-35','custom',20),
  ('55550003-bbbb-4bbb-8bbb-bbbb0003en03','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Fan Group','2×930 … 2×3150 (mm)','physical',30),
  ('55550003-bbbb-4bbb-8bbb-bbbb0003en04','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Capacity Range (35/30/25°C)','500,000 – 7,000,000 kcal/h (model dependent)','service',40),
  ('55550003-bbbb-4bbb-8bbb-bbbb0003en05','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Flow Rate Range (35/30/25°C)','100 – 1400 m³/h (model dependent)','service',50),
  ('55550003-bbbb-4bbb-8bbb-bbbb0003en06','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Capacity Range (40/30/24°C)','720,000 – 10,500,000 kcal/h (model dependent)','service',60),
  ('55550003-bbbb-4bbb-8bbb-bbbb0003en07','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Flow Rate Range (40/30/24°C)','72 – 1050 m³/h (model dependent)','service',70),
  ('55550003-bbbb-4bbb-8bbb-bbbb0003en08','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Weight (Empty/Operating)','780–8900 kg / 2500–45000 kg (model dependent)','physical',80)
ON DUPLICATE KEY UPDATE
  name      = VALUES(name),
  value     = VALUES(value),
  category  = VALUES(category),
  order_num = VALUES(order_num);

-- FAQS (EN) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb0003-2222-4222-8222-bbbbbbbb0003' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660003-bbbb-4bbb-8bbb-bbbb0003en01','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','When should a double-cell tower be preferred?','Preferred for higher capacity/flow projects and when a dual-cell configuration is required for operational continuity.',10,1),
  ('66660003-bbbb-4bbb-8bbb-bbbb0003en02','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','Under which conditions are capacities listed?','The catalog table lists capacity (kcal/h) and flow rate (m³/h) for 35/30/25°C and 40/30/24°C operating conditions.',20,1),
  ('66660003-bbbb-4bbb-8bbb-bbbb0003en03','bbbb0003-2222-4222-8222-bbbbbbbb0003','en','How do I choose the right model?','Select based on target condition, required flow rate, site constraints (base area/height) and handling/weight constraints.',30,1)
ON DUPLICATE KEY UPDATE
  question      = VALUES(question),
  answer        = VALUES(answer),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active);

-- REVIEWS (EN) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '77770003-bbbb-4bbb-8bbb-bbbb0003en01',
  '77770003-bbbb-4bbb-8bbb-bbbb0003en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770003-bbbb-4bbb-8bbb-bbbb0003en01','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,5,'Stable performance at high flow rates thanks to the dual-cell design.',1,'Engineering'),
  ('77770003-bbbb-4bbb-8bbb-bbbb0003en02','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,4,'The catalog table made pre-sizing and layout planning straightforward.',1,'Operations');

-- OPTIONS (EN) — id-based reset
DELETE FROM product_options
WHERE id='88880003-bbbb-4bbb-8bbb-bbbb0003en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880003-bbbb-4bbb-8bbb-bbbb0003en01','bbbb0003-2222-4222-8222-bbbbbbbb0003','Model', JSON_ARRAY(
    'DCTP-3','DCTP-4','DCTP-5','DCTP-5.5','DCTP-6','DCTP-7','DCTP-9',
    'DCTP-12','DCTP-14','DCTP-16','DCTP-20','DCTP-24','DCTP-26','DCTP-30','DCTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name   = VALUES(option_name),
  option_values = VALUES(option_values);

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0003-2222-4222-8222-bbbbbbbb0003',
  'de',
  'Offene Kühltürme – Doppelzelle (DCTP-Serie)',
  'offene-kuehltuerme-doppelzelle-dctp-serie',
  'Die DCTP-Serie (Doppelzelle) der offenen Kühltürme ist für höhere Kapazitäts- und Volumenstromanforderungen ausgelegt. Die Katalogtabelle enthält Abmessungen, Gewichte sowie Kapazitäts- und Volumenstromwerte für 35/30/25°C und 40/30/24°C.',
  'Offener Kühlturm – Doppelzelle DCTP-Serie',
  JSON_ARRAY('offener kühlturm','open circuit','doppelzelle','DCTP','ensotek'),
  JSON_OBJECT(
    'zelltyp','Doppelzelle',
    'serie','DCTP',
    'betriebsbedingungen',JSON_ARRAY('35/30/25°C','40/30/24°C')
  ),
  'Offene Kühltürme | DCTP Doppelzelle | Ensotek',
  'Doppelzellige offene Kühltürme (DCTP-Serie). Modelle DCTP-3 bis DCTP-35; Abmessungen, Gewichte, Kapazitäten und Volumenströme gemäß Katalogtabelle.'
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

-- SPECS (DE) — locale reset
DELETE FROM product_specs
WHERE product_id='bbbb0003-2222-4222-8222-bbbbbbbb0003' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550003-cccc-4ccc-8ccc-bbbb0003de01','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Serie / Zelltyp','DCTP – offene Kühltürme, Doppelzelle','custom',10),
  ('55550003-cccc-4ccc-8ccc-bbbb0003de02','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Modellbereich','DCTP-3 … DCTP-35','custom',20),
  ('55550003-cccc-4ccc-8ccc-bbbb0003de03','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Ventilatorgruppe','2×930 … 2×3150 (mm)','physical',30),
  ('55550003-cccc-4ccc-8ccc-bbbb0003de04','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Kapazitätsbereich (35/30/25°C)','500.000 – 7.000.000 kcal/h (modellabhängig)','service',40),
  ('55550003-cccc-4ccc-8ccc-bbbb0003de05','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Volumenstrombereich (35/30/25°C)','100 – 1400 m³/h (modellabhängig)','service',50),
  ('55550003-cccc-4ccc-8ccc-bbbb0003de06','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Kapazitätsbereich (40/30/24°C)','720.000 – 10.500.000 kcal/h (modellabhängig)','service',60),
  ('55550003-cccc-4ccc-8ccc-bbbb0003de07','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Volumenstrombereich (40/30/24°C)','72 – 1050 m³/h (modellabhängig)','service',70),
  ('55550003-cccc-4ccc-8ccc-bbbb0003de08','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Gewichte (leer/Betrieb)','780–8900 kg / 2500–45000 kg (modellabhängig)','physical',80)
ON DUPLICATE KEY UPDATE
  name      = VALUES(name),
  value     = VALUES(value),
  category  = VALUES(category),
  order_num = VALUES(order_num);

-- FAQS (DE) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb0003-2222-4222-8222-bbbbbbbb0003' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660003-cccc-4ccc-8ccc-bbbb0003de01','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Wann ist eine Doppelzelle sinnvoll?','Bei hohen Kapazitäts- und Volumenstromanforderungen und wenn eine Doppelzellen-Ausführung für Betriebssicherheit/Redundanz gewünscht ist.',10,1),
  ('66660003-cccc-4ccc-8ccc-bbbb0003de02','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Unter welchen Bedingungen sind die Werte angegeben?','Kapazität (kcal/h) und Volumenstrom (m³/h) sind für 35/30/25°C und 40/30/24°C in der Katalogtabelle angegeben.',20,1),
  ('66660003-cccc-4ccc-8ccc-bbbb0003de03','bbbb0003-2222-4222-8222-bbbbbbbb0003','de','Wie wähle ich das passende Modell?','Auswahl anhand Ziel-Betriebsbedingung, benötigtem Volumenstrom (m³/h) sowie Einbauraum (Grundfläche/Höhe) und Gewichts-/Handlinganforderungen.',30,1)
ON DUPLICATE KEY UPDATE
  question      = VALUES(question),
  answer        = VALUES(answer),
  display_order = VALUES(display_order),
  is_active     = VALUES(is_active);

-- REVIEWS (DE) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '77770003-cccc-4ccc-8ccc-bbbb0003de01',
  '77770003-cccc-4ccc-8ccc-bbbb0003de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770003-cccc-4ccc-8ccc-bbbb0003de01','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,5,'Sehr stabil bei hohen Volumenströmen – die Doppelzelle zahlt sich aus.',1,'Planung'),
  ('77770003-cccc-4ccc-8ccc-bbbb0003de02','bbbb0003-2222-4222-8222-bbbbbbbb0003',NULL,4,'Tabellenwerte sind sehr hilfreich für Vor-Auslegung und Layout.',1,'Betrieb');

-- OPTIONS (DE) — id-based reset
DELETE FROM product_options
WHERE id='88880003-cccc-4ccc-8ccc-bbbb0003de01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880003-cccc-4ccc-8ccc-bbbb0003de01','bbbb0003-2222-4222-8222-bbbbbbbb0003','Modell', JSON_ARRAY(
    'DCTP-3','DCTP-4','DCTP-5','DCTP-5.5','DCTP-6','DCTP-7','DCTP-9',
    'DCTP-12','DCTP-14','DCTP-16','DCTP-20','DCTP-24','DCTP-26','DCTP-30','DCTP-35'
  ))
ON DUPLICATE KEY UPDATE
  option_name   = VALUES(option_name),
  option_values = VALUES(option_values);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
