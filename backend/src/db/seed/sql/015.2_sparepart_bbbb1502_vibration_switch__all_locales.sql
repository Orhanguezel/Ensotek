-- =============================================================
-- FILE: 015.2_sparepart_bbbb1502_vibration_switch__all_locales.sql (FINAL)
-- Ensotek – Sparepart Seed (02/14)
-- Sparepart: Titreşim Şalteri / Vibration Switch / Vibrationsschalter
--
-- RULES (SABIT):
--  - products.item_type   = 'sparepart'
--  - products.category_id = 'aaaa1001-1111-4111-8111-aaaaaaaa1001'
--  - products.sub_category_id = 'bbbb1004-1111-4111-8111-bbbbbbbb1004'  (Fan & Motor Group)
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
  'bbbb1502-2222-4222-8222-bbbbbbbb1502',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1004-1111-4111-8111-bbbbbbbb1004',
  0.00,
  'http://localhost:8086/uploads/material/titresim-salteri1-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/titresim-salteri1-250x250-1.jpg',
    'http://localhost:8086/uploads/material/ensotek-switch-kontakli-titresim-salteri-250x250-1.jpg',
    'http://localhost:8086/uploads/material/ensotek-cooling-tower-magnetic-vibration-switch-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1502,
  'SP-VIBRATION-SWITCH',
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
  'bbbb1502-2222-4222-8222-bbbbbbbb1502',
  'tr',
  'Titreşim Şalteri',
  'titresim-salteri',
  'Titreşim şalteri, redüktörlü kulelerde fan bacasının hemen yanında konumlanır. Fan grubunda oluşan titreşimi anormal çalışma durumlarında algılar ve elektrik motorunu devreden çıkararak sistemi korur. Alüminyum gövdeli siviç kontaklı, cıva kontaklı ve manyetik kontaklı tipleri mevcuttur.',
  'Soğutma kulesi titreşim şalteri (fan grubu) yedek parça',
  JSON_ARRAY('yedek parça', 'titreşim şalteri', 'vibrasyon', 'fan grubu', 'motor koruma', 'ensotek'),
  JSON_OBJECT(
    'konum', 'Fan bacası yakınında (özellikle redüktörlü kuleler)',
    'amac', 'Anormal titreşimde motoru devreden çıkararak koruma sağlar',
    'govde', 'Alüminyum',
    'tipler', JSON_ARRAY('Siviç kontaklı', 'Cıva kontaklı', 'Manyetik kontaklı')
  ),
  'Titreşim Şalteri | Soğutma Kulesi Yedek Parça | Ensotek',
  'Fan grubundaki anormal titreşimi algılayıp motoru devreden çıkaran titreşim şalteri. Alüminyum gövde; siviç, cıva ve manyetik kontak seçenekleri.'
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
WHERE product_id='bbbb1502-2222-4222-8222-bbbbbbbb1502' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111502-aaaa-4aaa-8aaa-bbbb1502tr01','bbbb1502-2222-4222-8222-bbbbbbbb1502','tr','Konum','Redüktörlü kulelerde fan bacasının hemen yanında','custom',10),
  ('11111502-aaaa-4aaa-8aaa-bbbb1502tr02','bbbb1502-2222-4222-8222-bbbbbbbb1502','tr','Görev','Anormal titreşimi algılar; elektrik motorunu devreden çıkarır','physical',20),
  ('11111502-aaaa-4aaa-8aaa-bbbb1502tr03','bbbb1502-2222-4222-8222-bbbbbbbb1502','tr','Gövde','Alüminyum','material',30),
  ('11111502-aaaa-4aaa-8aaa-bbbb1502tr04','bbbb1502-2222-4222-8222-bbbbbbbb1502','tr','Kontak Tipleri','Siviç kontaklı / Cıva kontaklı / Manyetik kontaklı','custom',40),
  ('11111502-aaaa-4aaa-8aaa-bbbb1502tr05','bbbb1502-2222-4222-8222-bbbbbbbb1502','tr','Kullanım','Fan grubu koruması (plaka kırılması, anormal çalışma vb.)','custom',50);

-- FAQS (TR)
DELETE FROM product_faqs
WHERE product_id='bbbb1502-2222-4222-8222-bbbbbbbb1502' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221502-aaaa-4aaa-8aaa-bbbb1502tr01','bbbb1502-2222-4222-8222-bbbbbbbb1502','tr','Titreşim şalteri nerede kullanılır?','Genellikle redüktörlü kulelerde fan bacasının hemen yanında, fan grubu üzerinde/yanında konumlandırılır.',10,1),
  ('22221502-aaaa-4aaa-8aaa-bbbb1502tr02','bbbb1502-2222-4222-8222-bbbbbbbb1502','tr','Ne işe yarar?','Anormal titreşimi algılayarak elektrik motorunu devreden çıkarır ve ekipmanı korur.',20,1),
  ('22221502-aaaa-4aaa-8aaa-bbbb1502tr03','bbbb1502-2222-4222-8222-bbbbbbbb1502','tr','Hangi tipleri vardır?','Siviç kontaklı, cıva kontaklı ve manyetik kontaklı tipleri bulunur.',30,1);

-- REVIEWS (TR)
DELETE FROM product_reviews
WHERE id IN (
  '33331502-aaaa-4aaa-8aaa-bbbb1502tr01',
  '33331502-aaaa-4aaa-8aaa-bbbb1502tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331502-aaaa-4aaa-8aaa-bbbb1502tr01','bbbb1502-2222-4222-8222-bbbbbbbb1502',NULL,5,'Titreşim artınca motoru hızlı kesip arızayı büyütmeden durduruyor.',1,'Bakım Ekibi'),
  ('33331502-aaaa-4aaa-8aaa-bbbb1502tr02','bbbb1502-2222-4222-8222-bbbbbbbb1502',NULL,4,'Manyetik tip, sahada ayar ve kullanım açısından pratik.',1,'Operasyon');

-- OPTIONS (shared)
DELETE FROM product_options
WHERE id='44441502-aaaa-4aaa-8aaa-bbbb1502op01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441502-aaaa-4aaa-8aaa-bbbb1502op01','bbbb1502-2222-4222-8222-bbbbbbbb1502','Type', JSON_ARRAY('Switch contact type','Mercury contact type','Magnetic contact type'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1502-2222-4222-8222-bbbbbbbb1502',
  'en',
  'Vibration Switch',
  'vibration-switch',
  'The vibration switch is typically installed next to the fan stack on gear-driven towers. It detects vibration in the fan group under abnormal operating conditions and protects the system by switching the electric motor off. Aluminum-bodied versions are available in switch-contact, mercury-contact and magnetic-contact types.',
  'Cooling tower vibration switch (fan group) spare part',
  JSON_ARRAY('spare part', 'vibration switch', 'fan group', 'motor protection', 'cooling tower', 'ensotek'),
  JSON_OBJECT(
    'location', 'Near the fan stack (especially on gear-driven towers)',
    'purpose', 'Detects abnormal vibration and switches the motor off for protection',
    'housing', 'Aluminum',
    'types', JSON_ARRAY('Switch contact', 'Mercury contact', 'Magnetic contact')
  ),
  'Vibration Switch | Cooling Tower Spare Parts | Ensotek',
  'Vibration switch for cooling towers: detects abnormal vibration and shuts down the motor. Aluminum housing; switch, mercury and magnetic contact types.'
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
WHERE product_id='bbbb1502-2222-4222-8222-bbbbbbbb1502' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111502-bbbb-4bbb-8bbb-bbbb1502en01','bbbb1502-2222-4222-8222-bbbbbbbb1502','en','Location','Near the fan stack (gear-driven towers)','custom',10),
  ('11111502-bbbb-4bbb-8bbb-bbbb1502en02','bbbb1502-2222-4222-8222-bbbbbbbb1502','en','Function','Detects abnormal vibration; switches the motor off','physical',20),
  ('11111502-bbbb-4bbb-8bbb-bbbb1502en03','bbbb1502-2222-4222-8222-bbbbbbbb1502','en','Housing','Aluminum','material',30),
  ('11111502-bbbb-4bbb-8bbb-bbbb1502en04','bbbb1502-2222-4222-8222-bbbbbbbb1502','en','Contact Types','Switch contact / Mercury contact / Magnetic contact','custom',40),
  ('11111502-bbbb-4bbb-8bbb-bbbb1502en05','bbbb1502-2222-4222-8222-bbbbbbbb1502','en','Use Case','Fan group protection (abnormal operation, failures, etc.)','custom',50);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb1502-2222-4222-8222-bbbbbbbb1502' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221502-bbbb-4bbb-8bbb-bbbb1502en01','bbbb1502-2222-4222-8222-bbbbbbbb1502','en','Where is the vibration switch installed?','Typically next to the fan stack on gear-driven cooling towers.',10,1),
  ('22221502-bbbb-4bbb-8bbb-bbbb1502en02','bbbb1502-2222-4222-8222-bbbbbbbb1502','en','What does it do?','It detects abnormal vibration in the fan group and shuts down the motor to protect equipment.',20,1),
  ('22221502-bbbb-4bbb-8bbb-bbbb1502en03','bbbb1502-2222-4222-8222-bbbbbbbb1502','en','Which types are available?','Switch-contact, mercury-contact and magnetic-contact types are available.',30,1);

-- REVIEWS (EN)
DELETE FROM product_reviews
WHERE id IN (
  '33331502-bbbb-4bbb-8bbb-bbbb1502en01',
  '33331502-bbbb-4bbb-8bbb-bbbb1502en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331502-bbbb-4bbb-8bbb-bbbb1502en01','bbbb1502-2222-4222-8222-bbbbbbbb1502',NULL,5,'Shuts the motor down quickly when vibration spikes—prevents major failures.',1,'Maintenance'),
  ('33331502-bbbb-4bbb-8bbb-bbbb1502en02','bbbb1502-2222-4222-8222-bbbbbbbb1502',NULL,4,'Magnetic type is easy to handle and robust in the field.',1,'Operations');

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1502-2222-4222-8222-bbbbbbbb1502',
  'de',
  'Vibrationsschalter',
  'vibrationsschalter',
  'Er befindet sich oben am Turm, in der Nähe des Lüfterstapels. Er schaltet den Elektromotor ab, indem er die Vibration in anormalen Betriebssituationen erkennt (z. B. Plattenbruch, gebrochener Plattenwinkel usw.). Es gibt Ausführungen mit Schaltkontakt, Quecksilberkontakt oder Magnetkontakt. Das Gehäuse besteht aus Aluminium.',
  'Vibrationsschalter für Kühltürme (Lüftergruppe) Ersatzteil',
  JSON_ARRAY('ersatzteil', 'vibrationsschalter', 'luefterstapel', 'motorschutz', 'kuehlturm', 'ensotek'),
  JSON_OBJECT(
    'einbauort', 'Oben am Turm, nahe Lüfterstapel',
    'zweck', 'Erkennt Vibration bei abnormalem Betrieb und schaltet den Motor ab',
    'gehaeuse', 'Aluminium',
    'typen', JSON_ARRAY('Schaltkontakt', 'Quecksilberkontakt', 'Magnetkontakt')
  ),
  'Vibrationsschalter | Kühlturm Ersatzteile | Ensotek',
  'Vibrationsschalter für Kühltürme: erkennt anormale Vibration und schaltet den Elektromotor ab. Aluminiumgehäuse; Schalt-, Quecksilber- oder Magnetkontakt.'
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
WHERE product_id='bbbb1502-2222-4222-8222-bbbbbbbb1502' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111502-cccc-4ccc-8ccc-bbbb1502de01','bbbb1502-2222-4222-8222-bbbbbbbb1502','de','Einbauort','Oben am Turm, nahe dem Lüfterstapel','custom',10),
  ('11111502-cccc-4ccc-8ccc-bbbb1502de02','bbbb1502-2222-4222-8222-bbbbbbbb1502','de','Funktion','Erkennt anormale Vibration und schaltet den Elektromotor ab','physical',20),
  ('11111502-cccc-4ccc-8ccc-bbbb1502de03','bbbb1502-2222-4222-8222-bbbbbbbb1502','de','Gehäuse','Aluminium','material',30),
  ('11111502-cccc-4ccc-8ccc-bbbb1502de04','bbbb1502-2222-4222-8222-bbbbbbbb1502','de','Kontakt-Typen','Schaltkontakt / Quecksilberkontakt / Magnetkontakt','custom',40),
  ('11111502-cccc-4ccc-8ccc-bbbb1502de05','bbbb1502-2222-4222-8222-bbbbbbbb1502','de','Einsatz','Schutz der Lüftergruppe bei abnormalem Betrieb','custom',50);

-- FAQS (DE)
DELETE FROM product_faqs
WHERE product_id='bbbb1502-2222-4222-8222-bbbbbbbb1502' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221502-cccc-4ccc-8ccc-bbbb1502de01','bbbb1502-2222-4222-8222-bbbbbbbb1502','de','Wo wird der Vibrationsschalter montiert?','Oben am Turm, in der Nähe des Lüfterstapels.',10,1),
  ('22221502-cccc-4ccc-8ccc-bbbb1502de02','bbbb1502-2222-4222-8222-bbbbbbbb1502','de','Welche Aufgabe hat er?','Er erkennt Vibration in anormalen Betriebssituationen und schaltet den Motor ab.',20,1),
  ('22221502-cccc-4ccc-8ccc-bbbb1502de03','bbbb1502-2222-4222-8222-bbbbbbbb1502','de','Welche Ausführungen gibt es?','Typen mit Schaltkontakt, Quecksilberkontakt oder Magnetkontakt.',30,1);

-- REVIEWS (DE)
DELETE FROM product_reviews
WHERE id IN (
  '33331502-cccc-4ccc-8ccc-bbbb1502de01',
  '33331502-cccc-4ccc-8ccc-bbbb1502de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331502-cccc-4ccc-8ccc-bbbb1502de01','bbbb1502-2222-4222-8222-bbbbbbbb1502',NULL,5,'Schaltet den Motor bei auffälliger Vibration schnell ab – sehr guter Schutz.',1,'Instandhaltung'),
  ('33331502-cccc-4ccc-8ccc-bbbb1502de02','bbbb1502-2222-4222-8222-bbbbbbbb1502',NULL,4,'Der Magnetkontakt ist robust und im Betrieb gut handhabbar.',1,'Betrieb');

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
