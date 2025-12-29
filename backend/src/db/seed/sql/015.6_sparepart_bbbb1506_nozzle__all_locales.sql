-- =============================================================
-- FILE: 015.6_sparepart_bbbb1506_nozzle__all_locales.sql (FINAL)
-- Ensotek – Sparepart Seed (06/14)
-- Sparepart: Nozul / Nozzle / Kühlturmdüse
--
-- RULES (SABIT):
--  - products.item_type   = 'sparepart'
--  - products.category_id = 'aaaa1001-1111-4111-8111-aaaaaaaa1001'
--  - products.sub_category_id = 'bbbb1001-1111-4111-8111-bbbbbbbb1001'  (Tower Main Components)
--
-- FIXES:
--  - product_i18n.description: PLAIN TEXT (NO HTML)
--  - image urls: FULL URL (http://localhost:8086/uploads/material/...)
--  - all child IDs: CHAR(36) safe (uuid-like, 36 chars)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- BASE PRODUCT (sparepart)
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
  'bbbb1506-2222-4222-8222-bbbbbbbb1506',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1001-1111-4111-8111-bbbbbbbb1001',
  0.00,
  'http://localhost:8086/uploads/material/ensotek-kademeli-nozul-2-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/ensotek-kademeli-nozul-2-250x250-1.jpg',
    'http://localhost:8086/uploads/material/papatya-nozul-250x250-1.jpg',
    'http://localhost:8086/uploads/material/rk-fiskiyeleri-250x250-1.jpg',
    'http://localhost:8086/uploads/material/ithal-kule-nozulu-1-250x250-1.jpg',
    'http://localhost:8086/uploads/material/ithal-kule-nozul-2-250x250-1.jpg',
    'http://localhost:8086/uploads/material/ithal-kule-nozulu-4-250x250-1.jpg',
    'http://localhost:8086/uploads/material/ithal-kule-nozulu-3-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1506,
  'SP-NOZZLE',
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
  'bbbb1506-2222-4222-8222-bbbbbbbb1506',
  'tr',
  'Nozul',
  'nozul',
  'Nozul, polipropilen (PP) malzemeden üretilir. Temizlik ve bakım için kolay sökülüp takılacak şekilde tasarlanmıştır. Değişken debi ihtiyaçları için farklı çaplarda konik parçalar kullanılarak basınç ayarı yapılabilir. Farklı soğutma kulesi markaları için çeşitli nozul tipleri mevcuttur; ihtiyacınıza uygun modeli görsellerden seçebilirsiniz.',
  'Soğutma kulesi nozul (su dağıtım) yedek parça',
  JSON_ARRAY('yedek parça', 'nozul', 'su dağıtım', 'pp', 'debi', 'soğutma kulesi', 'ensotek'),
  JSON_OBJECT(
    'malzeme', 'PP (Polipropilen)',
    'tasarim', 'Kolay sök/tak; temizlik ve bakım için uygun',
    'ayar', 'Farklı çap koniler ile basınç/debi ayarı',
    'uyumluluk', 'Farklı kule markaları için çeşitli tipler'
  ),
  'Nozul | Soğutma Kulesi Yedek Parça | Ensotek',
  'PP nozul: kolay bakım/temizlik, farklı çap koniler ile basınç ve debi ayarı. Farklı soğutma kulesi markaları için çeşitli nozul tipleri.'
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
WHERE product_id='bbbb1506-2222-4222-8222-bbbbbbbb1506' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111506-aaaa-4aaa-8aaa-bbbb1506tr01','bbbb1506-2222-4222-8222-bbbbbbbb1506','tr','Malzeme','PP (Polipropilen)','material',10),
  ('11111506-aaaa-4aaa-8aaa-bbbb1506tr02','bbbb1506-2222-4222-8222-bbbbbbbb1506','tr','Tasarım','Kolay sök/tak; temizlik ve bakım için uygun','custom',20),
  ('11111506-aaaa-4aaa-8aaa-bbbb1506tr03','bbbb1506-2222-4222-8222-bbbbbbbb1506','tr','Ayarlanabilirlik','Farklı çap koniler ile basınç/debi ayarı','physical',30),
  ('11111506-aaaa-4aaa-8aaa-bbbb1506tr04','bbbb1506-2222-4222-8222-bbbbbbbb1506','tr','Uyumluluk','Farklı soğutma kulesi markaları için çeşitli tipler','custom',40),
  ('11111506-aaaa-4aaa-8aaa-bbbb1506tr05','bbbb1506-2222-4222-8222-bbbbbbbb1506','tr','Kullanım','Su dağıtım sisteminde püskürtme / dağıtım','custom',50);

-- FAQS (TR)
DELETE FROM product_faqs
WHERE product_id='bbbb1506-2222-4222-8222-bbbbbbbb1506' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221506-aaaa-4aaa-8aaa-bbbb1506tr01','bbbb1506-2222-4222-8222-bbbbbbbb1506','tr','Nozul hangi malzemeden üretilir?','Polipropilen (PP) malzemeden üretilir.',10,1),
  ('22221506-aaaa-4aaa-8aaa-bbbb1506tr02','bbbb1506-2222-4222-8222-bbbbbbbb1506','tr','Basınç veya debi ayarı yapılabilir mi?','Evet. Farklı çap konik parçalar kullanılarak basınç/debi ayarı yapılabilir.',20,1),
  ('22221506-aaaa-4aaa-8aaa-bbbb1506tr03','bbbb1506-2222-4222-8222-bbbbbbbb1506','tr','Bakım ve temizlik kolay mı?','Evet. Kolay sök/tak tasarımı sayesinde temizlik ve bakım için uygundur.',30,1);

-- REVIEWS (TR)
DELETE FROM product_reviews
WHERE id IN (
  '33331506-aaaa-4aaa-8aaa-bbbb1506tr01',
  '33331506-aaaa-4aaa-8aaa-bbbb1506tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331506-aaaa-4aaa-8aaa-bbbb1506tr01','bbbb1506-2222-4222-8222-bbbbbbbb1506',NULL,5,'Söküp temizlemesi çok kolay, tıkanma sonrası hızlı müdahale ediliyor.',1,'Bakım Ekibi'),
  ('33331506-aaaa-4aaa-8aaa-bbbb1506tr02','bbbb1506-2222-4222-8222-bbbbbbbb1506',NULL,4,'Farklı konilerle debi ayarı sahada işimizi kolaylaştırdı.',1,'Operasyon');

-- OPTIONS (shared)
DELETE FROM product_options
WHERE id='44441506-aaaa-4aaa-8aaa-bbbb1506op01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441506-aaaa-4aaa-8aaa-bbbb1506op01','bbbb1506-2222-4222-8222-bbbbbbbb1506','Nozzle Type', JSON_ARRAY('Kademeli Nozul','Papatya Nozul','RK Fıskiye','İthal Kule Nozulu'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1506-2222-4222-8222-bbbbbbbb1506',
  'en',
  'Nozzle',
  'nozzle',
  'The nozzle is manufactured from polypropylene (PP). It is designed for easy assembly/disassembly for cleaning and maintenance. For variable flow requirements, pressure/flow can be adjusted by using cones of different diameters. Multiple nozzle types are available for different cooling tower brands; you can choose the suitable model from the images.',
  'Cooling tower nozzle (water distribution) spare part',
  JSON_ARRAY('spare part', 'nozzle', 'water distribution', 'pp', 'flow', 'cooling tower', 'ensotek'),
  JSON_OBJECT(
    'material', 'PP (Polypropylene)',
    'design', 'Easy to remove/install for cleaning and maintenance',
    'adjustment', 'Pressure/flow adjustment via cones with different diameters',
    'compatibility', 'Various types for different cooling tower brands'
  ),
  'Nozzle | Cooling Tower Spare Parts | Ensotek',
  'PP nozzle for cooling towers: easy maintenance, adjustable pressure/flow with different cone diameters. Multiple nozzle types available for different tower brands.'
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
WHERE product_id='bbbb1506-2222-4222-8222-bbbbbbbb1506' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111506-bbbb-4bbb-8bbb-bbbb1506en01','bbbb1506-2222-4222-8222-bbbbbbbb1506','en','Material','PP (Polypropylene)','material',10),
  ('11111506-bbbb-4bbb-8bbb-bbbb1506en02','bbbb1506-2222-4222-8222-bbbbbbbb1506','en','Design','Easy assembly/disassembly for cleaning and maintenance','custom',20),
  ('11111506-bbbb-4bbb-8bbb-bbbb1506en03','bbbb1506-2222-4222-8222-bbbbbbbb1506','en','Adjustability','Pressure/flow adjustment with different cone diameters','physical',30),
  ('11111506-bbbb-4bbb-8bbb-bbbb1506en04','bbbb1506-2222-4222-8222-bbbbbbbb1506','en','Compatibility','Various types for different cooling tower brands','custom',40),
  ('11111506-bbbb-4bbb-8bbb-bbbb1506en05','bbbb1506-2222-4222-8222-bbbbbbbb1506','en','Use','Spray/distribution in the water distribution system','custom',50);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb1506-2222-4222-8222-bbbbbbbb1506' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221506-bbbb-4bbb-8bbb-bbbb1506en01','bbbb1506-2222-4222-8222-bbbbbbbb1506','en','Which material is the nozzle made of?','It is made of polypropylene (PP).',10,1),
  ('22221506-bbbb-4bbb-8bbb-bbbb1506en02','bbbb1506-2222-4222-8222-bbbbbbbb1506','en','Can pressure or flow be adjusted?','Yes. Pressure/flow can be adjusted using cones with different diameters.',20,1),
  ('22221506-bbbb-4bbb-8bbb-bbbb1506en03','bbbb1506-2222-4222-8222-bbbbbbbb1506','en','Is maintenance easy?','Yes. The design allows easy removal/installation for cleaning and maintenance.',30,1);

-- REVIEWS (EN)
DELETE FROM product_reviews
WHERE id IN (
  '33331506-bbbb-4bbb-8bbb-bbbb1506en01',
  '33331506-bbbb-4bbb-8bbb-bbbb1506en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331506-bbbb-4bbb-8bbb-bbbb1506en01','bbbb1506-2222-4222-8222-bbbbbbbb1506',NULL,5,'Very easy to remove and clean—quick recovery after clogging.',1,'Maintenance'),
  ('33331506-bbbb-4bbb-8bbb-bbbb1506en02','bbbb1506-2222-4222-8222-bbbbbbbb1506',NULL,4,'Flow adjustment with different cones is practical on site.',1,'Operations');

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1506-2222-4222-8222-bbbbbbbb1506',
  'de',
  'Kühlturmdüse',
  'kuehlturmduese',
  'Die Düse besteht aus Polypropylen (PP). Sie ist so konstruiert, dass sie zur Reinigung und Wartung leicht montiert und demontiert werden kann. Für variable Wassermengen kann der Druck bzw. Durchfluss durch Kegel mit unterschiedlichen Durchmessern eingestellt werden. Für unterschiedliche Kühlturmmarken sind verschiedene Düsentypen verfügbar; das passende Modell kann anhand der Bilder ausgewählt werden.',
  'Kühlturm Düse (Wasserverteilung) Ersatzteil',
  JSON_ARRAY('ersatzteil', 'duese', 'wasserverteilung', 'pp', 'durchfluss', 'kuehlturm', 'ensotek'),
  JSON_OBJECT(
    'material', 'PP (Polypropylen)',
    'konstruktion', 'Einfache Montage/Demontage für Reinigung und Wartung',
    'einstellung', 'Druck/Durchfluss über Kegel mit verschiedenen Durchmessern',
    'kompatibilitaet', 'Verschiedene Typen für unterschiedliche Kühlturmmarken'
  ),
  'Kühlturmdüse | Kühlturm Ersatzteile | Ensotek',
  'PP-Kühlturmdüse: einfache Wartung, einstellbarer Druck/Durchfluss über Kegel. Mehrere Düsentypen für unterschiedliche Kühltürme verfügbar.'
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
WHERE product_id='bbbb1506-2222-4222-8222-bbbbbbbb1506' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111506-cccc-4ccc-8ccc-bbbb1506de01','bbbb1506-2222-4222-8222-bbbbbbbb1506','de','Material','PP (Polypropylen)','material',10),
  ('11111506-cccc-4ccc-8ccc-bbbb1506de02','bbbb1506-2222-4222-8222-bbbbbbbb1506','de','Ausführung','Einfache Montage/Demontage für Reinigung und Wartung','custom',20),
  ('11111506-cccc-4ccc-8ccc-bbbb1506de03','bbbb1506-2222-4222-8222-bbbbbbbb1506','de','Einstellbarkeit','Druck/Durchfluss über Kegel mit verschiedenen Durchmessern','physical',30),
  ('11111506-cccc-4ccc-8ccc-bbbb1506de04','bbbb1506-2222-4222-8222-bbbbbbbb1506','de','Kompatibilität','Verschiedene Typen für unterschiedliche Kühlturmmarken','custom',40),
  ('11111506-cccc-4ccc-8ccc-bbbb1506de05','bbbb1506-2222-4222-8222-bbbbbbbb1506','de','Einsatz','Sprüh-/Verteilfunktion im Wasserverteilungssystem','custom',50);

-- FAQS (DE)
DELETE FROM product_faqs
WHERE product_id='bbbb1506-2222-4222-8222-bbbbbbbb1506' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221506-cccc-4ccc-8ccc-bbbb1506de01','bbbb1506-2222-4222-8222-bbbbbbbb1506','de','Aus welchem Material besteht die Düse?','Sie besteht aus Polypropylen (PP).',10,1),
  ('22221506-cccc-4ccc-8ccc-bbbb1506de02','bbbb1506-2222-4222-8222-bbbbbbbb1506','de','Kann man Druck oder Durchfluss einstellen?','Ja. Über Kegel mit unterschiedlichen Durchmessern lässt sich Druck/Durchfluss einstellen.',20,1),
  ('22221506-cccc-4ccc-8ccc-bbbb1506de03','bbbb1506-2222-4222-8222-bbbbbbbb1506','de','Ist die Wartung einfach?','Ja. Die Konstruktion ermöglicht eine leichte Montage/Demontage zur Reinigung.',30,1);

-- REVIEWS (DE)
DELETE FROM product_reviews
WHERE id IN (
  '33331506-cccc-4ccc-8ccc-bbbb1506de01',
  '33331506-cccc-4ccc-8ccc-bbbb1506de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331506-cccc-4ccc-8ccc-bbbb1506de01','bbbb1506-2222-4222-8222-bbbbbbbb1506',NULL,5,'Sehr leicht zu reinigen – nach Verstopfung schnell wieder einsatzbereit.',1,'Instandhaltung'),
  ('33331506-cccc-4ccc-8ccc-bbbb1506de02','bbbb1506-2222-4222-8222-bbbbbbbb1506',NULL,4,'Die Einstellmöglichkeit über verschiedene Kegel ist in der Praxis sehr hilfreich.',1,'Betrieb');

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
