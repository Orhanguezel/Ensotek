-- =============================================================
-- FILE: 016_sparepart_bbbb1510_pp_bigudi_fill__all_locales.sql (FINAL)
-- Ensotek – Sparepart Seed (10/14)
-- Sparepart: PP Bigudi Dolgu / PP Ring Fill / PP Spritzring-Füllung
--
-- RULES (SABIT):
--  - products.item_type   = 'sparepart'
--  - products.category_id = 'aaaa1001-1111-4111-8111-aaaaaaaa1001'
--  - products.sub_category_id = 'bbbb1003-1111-4111-8111-bbbbbbbb1003'  (Fill Media)
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
  'bbbb1510-2222-4222-8222-bbbbbbbb1510',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1003-1111-4111-8111-bbbbbbbb1003',
  0.00,
  'http://localhost:8086/uploads/material/bigudi-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/bigudi-250x250-1.jpg',
    'http://localhost:8086/uploads/material/su-dagitim-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1510,
  'SP-PP-RING-FILL',
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
  'bbbb1510-2222-4222-8222-bbbbbbbb1510',
  'tr',
  'PP Bigudi Dolgu (Spritzring Dolgu)',
  'pp-bigudi-dolgu-spritzring',
  'PP bigudi (spritzring) dolgu, kulelerde uzun yıllardır tercih edilen dolgu tiplerindendir. PP (polipropilen) malzemeden enjeksiyon yöntemiyle üretilir ve yaklaşık 100 °C’ye kadar yüksek sıcaklıklı proses sularında kullanılabilir. Suyun çok kirli, yağlı, kumlu olduğu; kireçlenmeye yatkın uygulamalarda ve ortamın tozlu olduğu tesislerde avantaj sağlar. Yıkanarak tekrar kullanılabilir; bakım ve değişim maliyeti düşüktür.',
  'Soğutma kulesi PP bigudi (spritzring) dolgu yedek parça',
  JSON_ARRAY('yedek parça', 'pp bigudi dolgu', 'spritzring dolgu', 'polipropilen', 'kirli su', 'ensotek'),
  JSON_OBJECT(
    'malzeme', 'PP (Polipropilen)',
    'uretim', 'Enjeksiyon',
    'sicaklik', 'Yaklaşık 100 °C’ye kadar',
    'uygunluk', JSON_ARRAY('Kirli/yağlı/kumlu su', 'Kireçlenmeye yatkın prosesler', 'Tozlu ortamlar'),
    'bakim', 'Yıkanabilir, tekrar kullanılabilir'
  ),
  'PP Bigudi Dolgu | Soğutma Kulesi Yedek Parça | Ensotek',
  'PP bigudi (spritzring) dolgu: kirli/yağlı/kumlu sularda ve tozlu ortamlarda dayanıklı çözüm. Enjeksiyon PP, ~100 °C’ye kadar, yıkanabilir ve tekrar kullanılabilir.'
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
WHERE product_id='bbbb1510-2222-4222-8222-bbbbbbbb1510' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111510-aaaa-4aaa-8aaa-bbbb1510tr01','bbbb1510-2222-4222-8222-bbbbbbbb1510','tr','Dolgu Tipi','Bigudi / Spritzring dolgu','custom',10),
  ('11111510-aaaa-4aaa-8aaa-bbbb1510tr02','bbbb1510-2222-4222-8222-bbbbbbbb1510','tr','Malzeme','PP (Polipropilen)','material',20),
  ('11111510-aaaa-4aaa-8aaa-bbbb1510tr03','bbbb1510-2222-4222-8222-bbbbbbbb1510','tr','Üretim','Enjeksiyon','custom',30),
  ('11111510-aaaa-4aaa-8aaa-bbbb1510tr04','bbbb1510-2222-4222-8222-bbbbbbbb1510','tr','Sıcaklık Dayanımı','~100 °C’ye kadar proses suyu','physical',40),
  ('11111510-aaaa-4aaa-8aaa-bbbb1510tr05','bbbb1510-2222-4222-8222-bbbbbbbb1510','tr','Önerilen Kullanım','Kirli/yağlı/kumlu ve kireçlenmeye yatkın sular; tozlu ortamlar','custom',50);

-- FAQS (TR)
DELETE FROM product_faqs
WHERE product_id='bbbb1510-2222-4222-8222-bbbbbbbb1510' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221510-aaaa-4aaa-8aaa-bbbb1510tr01','bbbb1510-2222-4222-8222-bbbbbbbb1510','tr','PP bigudi dolgu hangi uygulamalar için uygundur?','Kirli, yağlı, kumlu ve kireçlenmeye yatkın proses sularında ve tozlu tesis koşullarında tercih edilir.',10,1),
  ('22221510-aaaa-4aaa-8aaa-bbbb1510tr02','bbbb1510-2222-4222-8222-bbbbbbbb1510','tr','Yüksek sıcaklıkta kullanılabilir mi?','Evet, PP bigudi dolgu yaklaşık 100 °C’ye kadar proses sularında kullanılabilir.',20,1),
  ('22221510-aaaa-4aaa-8aaa-bbbb1510tr03','bbbb1510-2222-4222-8222-bbbbbbbb1510','tr','Temizlenip tekrar kullanılabilir mi?','Evet. Yıkanarak tekrar kullanılabilir; bakım ve değişim maliyetini düşürür.',30,1);

-- REVIEWS (TR)
DELETE FROM product_reviews
WHERE id IN (
  '33331510-aaaa-4aaa-8aaa-bbbb1510tr01',
  '33331510-aaaa-4aaa-8aaa-bbbb1510tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331510-aaaa-4aaa-8aaa-bbbb1510tr01','bbbb1510-2222-4222-8222-bbbbbbbb1510',NULL,5,'Kirli su prosesinde tıkanma problemi azaldı, temizlik sonrası tekrar kullandık.',1,'Bakım Ekibi'),
  ('33331510-aaaa-4aaa-8aaa-bbbb1510tr02','bbbb1510-2222-4222-8222-bbbbbbbb1510',NULL,4,'Tozlu ortamda dayanımı iyi; değişim aralığı uzadı.',1,'Tesis Operasyon');

-- OPTIONS (shared)
DELETE FROM product_options
WHERE id='44441510-aaaa-4aaa-8aaa-bbbb1510op01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441510-aaaa-4aaa-8aaa-bbbb1510op01','bbbb1510-2222-4222-8222-bbbbbbbb1510','Material', JSON_ARRAY('PP (Polypropylene)'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1510-2222-4222-8222-bbbbbbbb1510',
  'en',
  'PP Ring Fill (Spritzring Fill)',
  'pp-ring-fill-spritzring',
  'PP ring (spritzring) fill is one of the most widely used fill types in cooling towers for many years. It is injection-molded from PP (polypropylene) and can be used successfully in high-temperature process water up to about 100 °C. It is preferred where water is very dirty, oily or sandy and prone to scaling, and where ambient conditions are dusty. It can be washed and reused, helping reduce maintenance and replacement costs.',
  'Cooling tower PP ring (spritzring) fill spare part',
  JSON_ARRAY('spare part', 'PP ring fill', 'spritzring fill', 'polypropylene', 'dirty water', 'ensotek'),
  JSON_OBJECT(
    'material', 'PP (Polypropylene)',
    'manufacturing', 'Injection molded',
    'temperature', 'Up to ~100 °C process water',
    'bestFor', JSON_ARRAY('Dirty/oily/sandy water', 'Scaling-prone applications', 'Dusty environments'),
    'maintenance', 'Washable and reusable'
  ),
  'PP Ring Fill | Cooling Tower Spare Parts | Ensotek',
  'PP ring (spritzring) fill for harsh conditions: dirty/oily/sandy water and dusty environments. Injection-molded PP, up to ~100 °C, washable and reusable.'
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
WHERE product_id='bbbb1510-2222-4222-8222-bbbbbbbb1510' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111510-bbbb-4bbb-8bbb-bbbb1510en01','bbbb1510-2222-4222-8222-bbbbbbbb1510','en','Fill Type','Ring / spritzring fill','custom',10),
  ('11111510-bbbb-4bbb-8bbb-bbbb1510en02','bbbb1510-2222-4222-8222-bbbbbbbb1510','en','Material','PP (Polypropylene)','material',20),
  ('11111510-bbbb-4bbb-8bbb-bbbb1510en03','bbbb1510-2222-4222-8222-bbbbbbbb1510','en','Manufacturing','Injection molded','custom',30),
  ('11111510-bbbb-4bbb-8bbb-bbbb1510en04','bbbb1510-2222-4222-8222-bbbbbbbb1510','en','Temperature Capability','Up to ~100 °C process water','physical',40),
  ('11111510-bbbb-4bbb-8bbb-bbbb1510en05','bbbb1510-2222-4222-8222-bbbbbbbb1510','en','Recommended Use','Dirty/oily/sandy water; scaling-prone duty; dusty environments','custom',50);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb1510-2222-4222-8222-bbbbbbbb1510' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221510-bbbb-4bbb-8bbb-bbbb1510en01','bbbb1510-2222-4222-8222-bbbbbbbb1510','en','Where is PP ring fill typically used?','In applications with dirty, oily or sandy water and in dusty environments where fouling and scaling are concerns.',10,1),
  ('22221510-bbbb-4bbb-8bbb-bbbb1510en02','bbbb1510-2222-4222-8222-bbbbbbbb1510','en','Can it handle high temperature water?','Yes. PP ring fill can be used with process water up to about 100 °C.',20,1),
  ('22221510-bbbb-4bbb-8bbb-bbbb1510en03','bbbb1510-2222-4222-8222-bbbbbbbb1510','en','Is it reusable after cleaning?','Yes. It can be washed and reused, reducing maintenance and replacement costs.',30,1);

-- REVIEWS (EN)
DELETE FROM product_reviews
WHERE id IN (
  '33331510-bbbb-4bbb-8bbb-bbbb1510en01',
  '33331510-bbbb-4bbb-8bbb-bbbb1510en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331510-bbbb-4bbb-8bbb-bbbb1510en01','bbbb1510-2222-4222-8222-bbbbbbbb1510',NULL,5,'Less clogging in dirty-water service; we cleaned and reused the fill successfully.',1,'Maintenance'),
  ('33331510-bbbb-4bbb-8bbb-bbbb1510en02','bbbb1510-2222-4222-8222-bbbbbbbb1510',NULL,4,'Durable in dusty areas and extended replacement interval.',1,'Operations');

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1510-2222-4222-8222-bbbbbbbb1510',
  'de',
  'PP Spritzring-Füllung (Bigudi-Füllung)',
  'pp-spritzring-fuellung-bigudi',
  'Diese Füllung ist seit vielen Jahren einer der am häufigsten verwendeten Fülltypen in Kühltürmen. Sie wird im Spritzgussverfahren aus PP (Polypropylen) hergestellt und kann erfolgreich in Prozesswasser mit hoher Temperatur (ca. 100 °C) eingesetzt werden. Sie wird bevorzugt, wenn das Wasser sehr schmutzig, ölig oder sandig ist und zur Verkalkung neigt sowie wenn die Umgebung sehr staubig ist. Sie kann gereinigt und wiederverwendet werden; Wartungs- und Austauschkosten sind gering.',
  'Kühlturm PP Spritzring-Füllung (Bigudi) Ersatzteil',
  JSON_ARRAY('ersatzteil', 'pp spritzring fuellung', 'bigudi fuellung', 'polypropylen', 'verschmutztes wasser', 'ensotek'),
  JSON_OBJECT(
    'material', 'PP (Polypropylen)',
    'herstellung', 'Spritzguss',
    'temperatur', 'Bis ca. 100 °C Prozesswasser',
    'geeignetFuer', JSON_ARRAY('Schmutzig/ölig/sandig', 'Verkalkungsanfällig', 'Staubige Umgebung'),
    'wartung', 'Reinigbar und wiederverwendbar'
  ),
  'PP Spritzring-Füllung | Kühlturm Ersatzteile | Ensotek',
  'PP Bigudi/Spritzring-Füllung für anspruchsvolle Bedingungen: schmutziges, öliges oder sandiges Wasser und staubige Umgebungen. Spritzguss-PP, bis ca. 100 °C, reinigbar und wiederverwendbar.'
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
WHERE product_id='bbbb1510-2222-4222-8222-bbbbbbbb1510' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111510-cccc-4ccc-8ccc-bbbb1510de01','bbbb1510-2222-4222-8222-bbbbbbbb1510','de','Fülltyp','Spritzring-/Bigudi-Füllung','custom',10),
  ('11111510-cccc-4ccc-8ccc-bbbb1510de02','bbbb1510-2222-4222-8222-bbbbbbbb1510','de','Material','PP (Polypropylen)','material',20),
  ('11111510-cccc-4ccc-8ccc-bbbb1510de03','bbbb1510-2222-4222-8222-bbbbbbbb1510','de','Herstellung','Spritzguss','custom',30),
  ('11111510-cccc-4ccc-8ccc-bbbb1510de04','bbbb1510-2222-4222-8222-bbbbbbbb1510','de','Temperaturbereich','Bis ca. 100 °C Prozesswasser','physical',40),
  ('11111510-cccc-4ccc-8ccc-bbbb1510de05','bbbb1510-2222-4222-8222-bbbbbbbb1510','de','Empfohlener Einsatz','Schmutzig/ölig/sandig, verkalkungsanfällig, staubige Umgebung','custom',50);

-- FAQS (DE)
DELETE FROM product_faqs
WHERE product_id='bbbb1510-2222-4222-8222-bbbbbbbb1510' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221510-cccc-4ccc-8ccc-bbbb1510de01','bbbb1510-2222-4222-8222-bbbbbbbb1510','de','Wann ist Spritzring-Füllung sinnvoll?','Bei stark verschmutztem/öligem/sandigem Wasser und in staubigen Umgebungen, wo Fouling und Verkalkung auftreten.',10,1),
  ('22221510-cccc-4ccc-8ccc-bbbb1510de02','bbbb1510-2222-4222-8222-bbbbbbbb1510','de','Ist sie für hohe Temperaturen geeignet?','Ja. Sie kann mit Prozesswasser bis ca. 100 °C eingesetzt werden.',20,1),
  ('22221510-cccc-4ccc-8ccc-bbbb1510de03','bbbb1510-2222-4222-8222-bbbbbbbb1510','de','Kann sie wiederverwendet werden?','Ja. Nach Reinigung kann sie wiederverwendet werden, die Kosten bleiben gering.',30,1);

-- REVIEWS (DE)
DELETE FROM product_reviews
WHERE id IN (
  '33331510-cccc-4ccc-8ccc-bbbb1510de01',
  '33331510-cccc-4ccc-8ccc-bbbb1510de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331510-cccc-4ccc-8ccc-bbbb1510de01','bbbb1510-2222-4222-8222-bbbbbbbb1510',NULL,5,'Weniger Verstopfung bei schmutzigem Wasser; nach Reinigung erneut eingesetzt.',1,'Instandhaltung'),
  ('33331510-cccc-4ccc-8ccc-bbbb1510de02','bbbb1510-2222-4222-8222-bbbbbbbb1510',NULL,4,'Robust in staubiger Umgebung und lange Standzeit.',1,'Betrieb');

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
