-- =============================================================
-- FILE: 014.94_product_bbbb0004_tctp_triple_cell__all_locales.sql (FINAL / VALIDATION ALIGNED)
-- Ensotek – Product Seed (04/..)
-- Product: Open Circuit Cooling Towers – Triple Cell / TCTP Series
-- Source: Catalog p.9
--
-- ✅ FIX (schema + validation + admin controller aligned):
--  - product_i18n.specifications: Record<string,string> => ALL VALUES STRING (NO JSON_ARRAY / NO nested JSON)
--  - product_specs uses order_num (NO display_order)
--  - locale child tables: DELETE (product_id+locale) then INSERT (stable + re-run safe)
--  - locale-less child tables: id-based DELETE then INSERT
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
  'bbbb0004-2222-4222-8222-bbbbbbbb0004',
  'product',
  'aaaa0002-1111-4111-8111-aaaaaaaa0002',
  'bbbb0102-1111-4111-8111-bbbbbbbb0102',
  0.00,
  'https://www.ensotek.de/uploads/product/open-circuit-tctp-triple-1-250x250-1.png',
  NULL,
  JSON_ARRAY(
    'https://www.ensotek.de/uploads/material/open-circuit-tctp-triple-1-250x250-1.jpg',
    'https://www.ensotek.de/uploads/material/open-circuit-tctp-triple-2-250x250-1.jpg',
    'https://www.ensotek.de/uploads/material/open-circuit-tctp-triple-3-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  130,
  'TCTP-TRIPLE',
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
-- I18N (TR) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0004-2222-4222-8222-bbbbbbbb0004',
  'tr',
  'Açık Tip Su Soğutma Kuleleri – Üç Hücreli (TCTP Serisi)',
  'acik-tip-su-sogutma-kuleleri-uc-hucreli-tctp-serisi',
  'TCTP serisi üç hücreli açık tip su soğutma kuleleri, çok yüksek kapasite ve debi gerektiren uygulamalarda üç hücreli yapı ile ölçeklenebilir çözüm sağlar. Katalog tablosunda her modelin ölçüleri, ağırlıkları, kapasite ve debi değerleri 35/30/25°C ve 40/30/24°C koşullarına göre verilmiştir.',
  'Açık tip su soğutma kulesi – Üç hücreli TCTP serisi',
  JSON_ARRAY('açık tip','open circuit','üç hücreli','TCTP','soğutma kulesi','ensotek'),
  JSON_OBJECT(
    'cellType', 'Üç hücreli',
    'series', 'TCTP',
    'capacityConditions', '35/30/25°C | 40/30/24°C'
  ),
  'Açık Tip Su Soğutma Kuleleri | Üç Hücreli TCTP Serisi | Ensotek',
  'Üç hücreli açık tip kuleler (TCTP serisi). TCTP-3’ten TCTP-35’e model seçenekleri; ölçü, ağırlık, kapasite ve debi değerleri katalog tablosuna göre.'
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
WHERE product_id='bbbb0004-2222-4222-8222-bbbbbbbb0004' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550004-aaaa-4aaa-8aaa-bbbb0004tr01','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Seri / Hücre Tipi','TCTP – üç hücreli açık tip kuleler','custom',10),
  ('55550004-aaaa-4aaa-8aaa-bbbb0004tr02','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Model Aralığı','TCTP-3 … TCTP-35','custom',20),
  ('55550004-aaaa-4aaa-8aaa-bbbb0004tr03','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Fan Grubu','3×930 … 3×3700 (mm)','physical',30),
  ('55550004-aaaa-4aaa-8aaa-bbbb0004tr04','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Kapasite Aralığı (35/30/25°C)','700.000 – 10.400.000 kcal/h (modele göre)','service',40),
  ('55550004-aaaa-4aaa-8aaa-bbbb0004tr05','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Debi Aralığı (35/30/25°C)','140 – 2080 m³/h (modele göre)','service',50),
  ('55550004-aaaa-4aaa-8aaa-bbbb0004tr06','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Kapasite Aralığı (40/30/24°C)','1.100.000 – 15.300.000 kcal/h (modele göre)','service',60),
  ('55550004-aaaa-4aaa-8aaa-bbbb0004tr07','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Debi Aralığı (40/30/24°C)','110 – 1530 m³/h (modele göre)','service',70),
  ('55550004-aaaa-4aaa-8aaa-bbbb0004tr08','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Ağırlık (Boş/Çalışır)','950–11500 kg / 3400–60000 kg (modele göre)','physical',80);

-- FAQS (TR) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb0004-2222-4222-8222-bbbbbbbb0004' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660004-aaaa-4aaa-8aaa-bbbb0004tr01','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Üç hücreli kule ne zaman tercih edilir?','Çok yüksek kapasite ve debi gereksinimlerinde, üç hücreli yapı ile ölçeklenebilir performans istendiğinde tercih edilir.',10,1),
  ('66660004-aaaa-4aaa-8aaa-bbbb0004tr02','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Kapasite/debi değerleri hangi koşullarda veriliyor?','Katalog tablosunda 35/30/25°C ve 40/30/24°C koşullarına göre kapasite (kcal/h) ve debi (m³/h) verilir.',20,1),
  ('66660004-aaaa-4aaa-8aaa-bbbb0004tr03','bbbb0004-2222-4222-8222-bbbbbbbb0004','tr','Model seçerken nelere bakılmalı?','İstenen debi, hedef koşul, taban alanı/yükseklik ve sahadaki kaldırma/taşıma şartları birlikte değerlendirilmelidir.',30,1);

-- REVIEWS (TR) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '77770004-aaaa-4aaa-8aaa-bbbb0004tr01',
  '77770004-aaaa-4aaa-8aaa-bbbb0004tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770004-aaaa-4aaa-8aaa-bbbb0004tr01','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,5,'Çok yüksek debide bile kararlı; üç hücreli yapı işimizi çözdü.',1,'Endüstri Tesisi'),
  ('77770004-aaaa-4aaa-8aaa-bbbb0004tr02','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,4,'Büyük model seçenekleri sayesinde doğru kapasiteye hızlı ulaştık.',1,'Proje Ekibi');

-- OPTIONS (TR) — id-based reset
DELETE FROM product_options
WHERE id='88880004-aaaa-4aaa-8aaa-bbbb0004tr01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880004-aaaa-4aaa-8aaa-bbbb0004tr01','bbbb0004-2222-4222-8222-bbbbbbbb0004','Model', JSON_ARRAY(
    'TCTP-3','TCTP-4','TCTP-5','TCTP-5.5','TCTP-6','TCTP-7','TCTP-9',
    'TCTP-12','TCTP-14','TCTP-16','TCTP-20','TCTP-24','TCTP-26','TCTP-30','TCTP-35'
  ));

-- =============================================================
-- I18N (EN) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0004-2222-4222-8222-bbbbbbbb0004',
  'en',
  'Open Circuit Cooling Towers – Triple Cell (TCTP Series)',
  'open-circuit-cooling-towers-triple-cell-tctp-series',
  'TCTP triple-cell open circuit cooling towers provide scalable performance for very high capacity and flow requirements. The catalog table lists dimensions, weights, capacity and flow rate values for 35/30/25°C and 40/30/24°C operating conditions.',
  'Open circuit cooling tower – triple cell TCTP series',
  JSON_ARRAY('open circuit','triple cell','TCTP','cooling tower','ensotek'),
  JSON_OBJECT(
    'cellType', 'Triple cell',
    'series', 'TCTP',
    'capacityConditions', '35/30/25°C | 40/30/24°C'
  ),
  'Open Circuit Cooling Towers | Triple Cell TCTP Series | Ensotek',
  'Triple-cell open circuit towers (TCTP series). Models from TCTP-3 to TCTP-35 with catalog-based dimensions, weights, capacities and flow rates.'
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
WHERE product_id='bbbb0004-2222-4222-8222-bbbbbbbb0004' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550004-bbbb-4bbb-8bbb-bbbb0004en01','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Series / Cell Type','TCTP – triple cell open circuit towers','custom',10),
  ('55550004-bbbb-4bbb-8bbb-bbbb0004en02','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Model Range','TCTP-3 … TCTP-35','custom',20),
  ('55550004-bbbb-4bbb-8bbb-bbbb0004en03','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Fan Group','3×930 … 3×3700 (mm)','physical',30),
  ('55550004-bbbb-4bbb-8bbb-bbbb0004en04','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Capacity Range (35/30/25°C)','700,000 – 10,400,000 kcal/h (model dependent)','service',40),
  ('55550004-bbbb-4bbb-8bbb-bbbb0004en05','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Flow Rate Range (35/30/25°C)','140 – 2080 m³/h (model dependent)','service',50),
  ('55550004-bbbb-4bbb-8bbb-bbbb0004en06','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Capacity Range (40/30/24°C)','1,100,000 – 15,300,000 kcal/h (model dependent)','service',60),
  ('55550004-bbbb-4bbb-8bbb-bbbb0004en07','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Flow Rate Range (40/30/24°C)','110 – 1530 m³/h (model dependent)','service',70),
  ('55550004-bbbb-4bbb-8bbb-bbbb0004en08','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Weight (Empty/Operating)','950–11,500 kg / 3,400–60,000 kg (model dependent)','physical',80);

-- FAQS (EN) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb0004-2222-4222-8222-bbbbbbbb0004' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660004-bbbb-4bbb-8bbb-bbbb0004en01','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','When should a triple-cell tower be preferred?','Preferred for very high capacity/flow requirements where scalable performance with three cells is needed.',10,1),
  ('66660004-bbbb-4bbb-8bbb-bbbb0004en02','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Under which conditions are values listed?','Capacity (kcal/h) and flow rate (m³/h) are listed for 35/30/25°C and 40/30/24°C in the catalog table.',20,1),
  ('66660004-bbbb-4bbb-8bbb-bbbb0004en03','bbbb0004-2222-4222-8222-bbbbbbbb0004','en','Key parameters for model selection?','Required flow rate, target condition, footprint/height constraints, and handling/weight constraints should be evaluated together.',30,1);

-- REVIEWS (EN) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '77770004-bbbb-4bbb-8bbb-bbbb0004en01',
  '77770004-bbbb-4bbb-8bbb-bbbb0004en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770004-bbbb-4bbb-8bbb-bbbb0004en01','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,5,'Stable even at very high flow rates; the triple-cell layout delivered.',1,'Industrial Plant'),
  ('77770004-bbbb-4bbb-8bbb-bbbb0004en02','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,4,'Model range made it easy to match our capacity requirements.',1,'Project Team');

-- OPTIONS (EN) — id-based reset
DELETE FROM product_options
WHERE id='88880004-bbbb-4bbb-8bbb-bbbb0004en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880004-bbbb-4bbb-8bbb-bbbb0004en01','bbbb0004-2222-4222-8222-bbbbbbbb0004','Model', JSON_ARRAY(
    'TCTP-3','TCTP-4','TCTP-5','TCTP-5.5','TCTP-6','TCTP-7','TCTP-9',
    'TCTP-12','TCTP-14','TCTP-16','TCTP-20','TCTP-24','TCTP-26','TCTP-30','TCTP-35'
  ));

-- =============================================================
-- I18N (DE) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb0004-2222-4222-8222-bbbbbbbb0004',
  'de',
  'Offene Kühltürme – Dreifachzelle (TCTP-Serie)',
  'offene-kuehltuerme-dreifachzelle-tctp-serie',
  'Die TCTP-Serie (Dreifachzelle) der offenen Kühltürme ist für sehr hohe Kapazitäts- und Volumenstromanforderungen ausgelegt und skaliert über drei Zellen. Die Katalogtabelle enthält Abmessungen, Gewichte sowie Kapazitäts- und Volumenstromwerte für 35/30/25°C und 40/30/24°C.',
  'Offener Kühlturm – Dreifachzelle TCTP-Serie',
  JSON_ARRAY('offener kühlturm','open circuit','dreifachzelle','TCTP','ensotek'),
  JSON_OBJECT(
    'zelltyp', 'Dreifachzelle',
    'serie', 'TCTP',
    'betriebsbedingungen', '35/30/25°C | 40/30/24°C'
  ),
  'Offene Kühltürme | TCTP Dreifachzelle | Ensotek',
  'Dreizellige offene Kühltürme (TCTP-Serie). Modelle TCTP-3 bis TCTP-35 mit Abmessungen, Gewichten, Kapazitäten und Volumenströmen gemäß Katalogtabelle.'
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
WHERE product_id='bbbb0004-2222-4222-8222-bbbbbbbb0004' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('55550004-cccc-4ccc-8ccc-bbbb0004de01','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Serie / Zelltyp','TCTP – offene Kühltürme, Dreifachzelle','custom',10),
  ('55550004-cccc-4ccc-8ccc-bbbb0004de02','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Modellbereich','TCTP-3 … TCTP-35','custom',20),
  ('55550004-cccc-4ccc-8ccc-bbbb0004de03','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Ventilatorgruppe','3×930 … 3×3700 (mm)','physical',30),
  ('55550004-cccc-4ccc-8ccc-bbbb0004de04','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Kapazitätsbereich (35/30/25°C)','700.000 – 10.400.000 kcal/h (modellabhängig)','service',40),
  ('55550004-cccc-4ccc-8ccc-bbbb0004de05','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Volumenstrombereich (35/30/25°C)','140 – 2080 m³/h (modellabhängig)','service',50),
  ('55550004-cccc-4ccc-8ccc-bbbb0004de06','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Kapazitätsbereich (40/30/24°C)','1.100.000 – 15.300.000 kcal/h (modellabhängig)','service',60),
  ('55550004-cccc-4ccc-8ccc-bbbb0004de07','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Volumenstrombereich (40/30/24°C)','110 – 1530 m³/h (modellabhängig)','service',70),
  ('55550004-cccc-4ccc-8ccc-bbbb0004de08','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Gewichte (leer/Betrieb)','950–11.500 kg / 3.400–60.000 kg (modellabhängig)','physical',80);

-- FAQS (DE) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb0004-2222-4222-8222-bbbbbbbb0004' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('66660004-cccc-4ccc-8ccc-bbbb0004de01','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Wann ist eine Dreifachzelle sinnvoll?','Bei sehr hohen Kapazitäts- und Volumenstromanforderungen, wenn skalierbare Leistung über drei Zellen benötigt wird.',10,1),
  ('66660004-cccc-4ccc-8ccc-bbbb0004de02','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Unter welchen Bedingungen sind die Werte angegeben?','Kapazität (kcal/h) und Volumenstrom (m³/h) sind für 35/30/25°C und 40/30/24°C in der Katalogtabelle angegeben.',20,1),
  ('66660004-cccc-4ccc-8ccc-bbbb0004de03','bbbb0004-2222-4222-8222-bbbbbbbb0004','de','Wichtige Auswahlparameter?','Erforderlicher Volumenstrom, Zielzustand, Platzbedarf (Grundfläche/Höhe) sowie Gewichts- und Handlinganforderungen.',30,1);

-- REVIEWS (DE) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '77770004-cccc-4ccc-8ccc-bbbb0004de01',
  '77770004-cccc-4ccc-8ccc-bbbb0004de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('77770004-cccc-4ccc-8ccc-bbbb0004de01','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,5,'Auch bei sehr hohen Volumenströmen stabil – Dreifachzelle passt.',1,'Industriebetrieb'),
  ('77770004-cccc-4ccc-8ccc-bbbb0004de02','bbbb0004-2222-4222-8222-bbbbbbbb0004',NULL,4,'Große Modellauswahl erleichtert die richtige Dimensionierung.',1,'Planung');

-- OPTIONS (DE) — id-based reset
DELETE FROM product_options
WHERE id='88880004-cccc-4ccc-8ccc-bbbb0004de01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('88880004-cccc-4ccc-8ccc-bbbb0004de01','bbbb0004-2222-4222-8222-bbbbbbbb0004','Modell', JSON_ARRAY(
    'TCTP-3','TCTP-4','TCTP-5','TCTP-5.5','TCTP-6','TCTP-7','TCTP-9',
    'TCTP-12','TCTP-14','TCTP-16','TCTP-20','TCTP-24','TCTP-26','TCTP-30','TCTP-35'
  ));

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
