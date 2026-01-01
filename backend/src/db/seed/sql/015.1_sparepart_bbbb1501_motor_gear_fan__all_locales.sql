-- =============================================================
-- FILE: 015.1_sparepart_bbbb1501_motor_gear_fan__all_locales.sql (FINAL / VALIDATION ALIGNED)
-- Ensotek – Sparepart Seed (01/..)
-- Sparepart: Motor + Reducer + Fan Group
--
-- ✅ FIXES (schema + validation + admin controller aligned):
--  - products.item_type = 'sparepart' (explicit)
--  - product_i18n.description: PLAIN TEXT (NO HTML)
--  - images: JSON_ARRAY(url...) only
--  - storage_image_ids: JSON_ARRAY(assetId...) only (kept JSON_ARRAY())
--  - product_i18n.specifications: Record<string,string> => ALL VALUES STRING (NO JSON_ARRAY / NO nested JSON)
--  - locale child tables: DELETE (product_id+locale) then INSERT (stable + re-run safe)
--  - locale-less child tables: id-based DELETE then INSERT
--  - ✅ product_options EN/DE added (optional but keeps parity + re-run safety)
--
-- RULES (SABIT):
--  - products.item_type        = 'sparepart'
--  - products.category_id      = 'aaaa1001-1111-4111-8111-aaaaaaaa1001'
--  - products.sub_category_id  = 'bbbb1004-1111-4111-8111-bbbbbbbb1004' (Fan & Motor Group)
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
  'bbbb1501-2222-4222-8222-bbbbbbbb1501',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1004-1111-4111-8111-bbbbbbbb1004',
  0.00,
  'http://localhost:8086/uploads/material/ensotek-sogutma-kulesi-motor-fan-grubu-mekanik-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/ensotek-sogutma-kulesi-motor-fan-grubu-mekanik-250x250-1.jpg',
    'http://localhost:8086/uploads/material/ensotek-sogutma-kulesi-reduktorlu-motor-fan-grubu-250x250-1.jpg',
    'http://localhost:8086/uploads/material/44-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1501,
  'SP-MOTOR-REDUKTOR',
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
  'bbbb1501-2222-4222-8222-bbbbbbbb1501',
  'tr',
  'Motor ve Redüktör (Fan Grubu)',
  'motor-ve-reduktor-fan-grubu',
  'Motor ve redüktör, kulenin çatı bölümünde fan ve fan bacası ile birlikte grup halinde görev yapar. Su soğutma kulesinde en önemli görevi üstlenen ekipmanlardandır. Fan çapı Ø ≤ 1600 mm olan kulelerde yalnız elektrik motoru kullanılabilir; daha büyük modellerde motor ve redüktör birlikte kullanılmaktadır. Fanlarda çevre hızı 52–60 m/s’dir. Elektrik motorları ve redüktörler V1 konumunda düşey flanşlı tip olarak kullanılır. Motorlar F sınıfı izolasyon ve IP56 koruma sınıfı ile toz, yağ ve neme karşı korunmaktadır.',
  'Soğutma kulesi motor ve redüktör (fan grubu) yedek parça',
  JSON_ARRAY('yedek parça', 'motor', 'redüktör', 'fan grubu', 'soğutma kulesi', 'ensotek'),
  JSON_OBJECT(
    'fanSpeed', '52–60 m/s',
    'fanDiameterNote', 'Ø ≤ 1600 mm: yalnız motor | büyük modeller: motor + redüktör',
    'mounting', 'V1 konumu, düşey flanşlı tip',
    'insulation', 'F sınıfı izolasyon',
    'protection', 'IP56'
  ),
  'Motor ve Redüktör | Soğutma Kulesi Yedek Parça | Ensotek',
  'Soğutma kulesi çatı bölümünde fan ve fan bacası ile birlikte çalışan motor ve redüktör grubu. IP56, F sınıfı izolasyon, 52–60 m/s çevre hızı.'
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
WHERE product_id='bbbb1501-2222-4222-8222-bbbbbbbb1501' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111501-aaaa-4aaa-8aaa-bbbb1501tr01','bbbb1501-2222-4222-8222-bbbbbbbb1501','tr','Kullanım Yeri','Kule çatı bölümü; fan ve fan bacası ile birlikte grup','custom',10),
  ('11111501-aaaa-4aaa-8aaa-bbbb1501tr02','bbbb1501-2222-4222-8222-bbbbbbbb1501','tr','Fan Çapı Notu','Ø ≤ 1600 mm: yalnız motor; büyük modeller: motor + redüktör','physical',20),
  ('11111501-aaaa-4aaa-8aaa-bbbb1501tr03','bbbb1501-2222-4222-8222-bbbbbbbb1501','tr','Çevre Hızı','52–60 m/s','physical',30),
  ('11111501-aaaa-4aaa-8aaa-bbbb1501tr04','bbbb1501-2222-4222-8222-bbbbbbbb1501','tr','Montaj','V1 konumu, düşey flanşlı tip','physical',40),
  ('11111501-aaaa-4aaa-8aaa-bbbb1501tr05','bbbb1501-2222-4222-8222-bbbbbbbb1501','tr','Koruma / İzolasyon','IP56, F sınıfı izolasyon','material',50);

-- FAQS (TR) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1501-2222-4222-8222-bbbbbbbb1501' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221501-aaaa-4aaa-8aaa-bbbb1501tr01','bbbb1501-2222-4222-8222-bbbbbbbb1501','tr','Motor ve redüktör grubu nerede çalışır?','Kulenin çatı bölümünde; fan ve fan bacası ile birlikte grup halinde çalışır.',10,1),
  ('22221501-aaaa-4aaa-8aaa-bbbb1501tr02','bbbb1501-2222-4222-8222-bbbbbbbb1501','tr','Hangi durumda redüktör gerekir?','Fan çapı büyüdükçe (tipik olarak Ø > 1600 mm) motorla birlikte redüktör kullanımı tercih edilir.',20,1),
  ('22221501-aaaa-4aaa-8aaa-bbbb1501tr03','bbbb1501-2222-4222-8222-bbbbbbbb1501','tr','Koruma sınıfı nedir?','Motorlar IP56 koruma sınıfı ve F sınıfı izolasyonla toz, yağ ve neme karşı korunur.',30,1);

-- REVIEWS (TR) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331501-aaaa-4aaa-8aaa-bbbb1501tr01',
  '33331501-aaaa-4aaa-8aaa-bbbb1501tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331501-aaaa-4aaa-8aaa-bbbb1501tr01','bbbb1501-2222-4222-8222-bbbbbbbb1501',NULL,5,'IP56 koruma ve yüksek verim motor ile uzun süre stabil çalışıyor.',1,'Bakım Ekibi'),
  ('33331501-aaaa-4aaa-8aaa-bbbb1501tr02','bbbb1501-2222-4222-8222-bbbbbbbb1501',NULL,4,'Büyük fanlı kulelerde redüktörle birlikte daha güvenli sürüş sağlıyor.',1,'Tesis Operasyon');

-- OPTIONS (TR) — id-based reset
DELETE FROM product_options
WHERE id='44441501-aaaa-4aaa-8aaa-bbbb1501tr01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441501-aaaa-4aaa-8aaa-bbbb1501tr01','bbbb1501-2222-4222-8222-bbbbbbbb1501','Konfigürasyon', JSON_ARRAY(
    'Sadece Motor (Ø ≤ 1600 mm)',
    'Motor + Redüktör (Büyük fanlı modeller)'
  ));

-- =============================================================
-- I18N (EN) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1501-2222-4222-8222-bbbbbbbb1501',
  'en',
  'Motor and Reducer (Fan Group)',
  'motor-and-reducer-fan-group',
  'The motor and reducer operate as a group with the fan and fan stack on the tower deck. They are among the most critical components of a water cooling tower. Units with fan diameter Ø ≤ 1600 mm may use only an electric motor; larger units use motor and reducer together. Fan peripheral speed is 52–60 m/s. Motors and reducers are used in V1 vertical flange configuration. Motors are Class F insulated and IP56 protected against dust, oil and moisture.',
  'Cooling tower motor and reducer (fan group) spare part',
  JSON_ARRAY('spare part', 'motor', 'reducer', 'fan group', 'cooling tower', 'ensotek'),
  JSON_OBJECT(
    'fanSpeed', '52–60 m/s',
    'fanDiameterNote', 'Ø ≤ 1600 mm: motor only | larger units: motor + reducer',
    'mounting', 'V1 vertical flange type',
    'insulation', 'Class F',
    'protection', 'IP56'
  ),
  'Motor and Reducer | Cooling Tower Spare Parts | Ensotek',
  'Motor and reducer group operating with fan and fan stack on tower deck. IP56 protection, Class F insulation, 52–60 m/s peripheral speed.'
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
WHERE product_id='bbbb1501-2222-4222-8222-bbbbbbbb1501' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111501-bbbb-4bbb-8bbb-bbbb1501en01','bbbb1501-2222-4222-8222-bbbbbbbb1501','en','Location','Tower deck; operates with fan and fan stack as a group','custom',10),
  ('11111501-bbbb-4bbb-8bbb-bbbb1501en02','bbbb1501-2222-4222-8222-bbbbbbbb1501','en','Fan Diameter Note','Ø ≤ 1600 mm: motor only; larger units: motor + reducer','physical',20),
  ('11111501-bbbb-4bbb-8bbb-bbbb1501en03','bbbb1501-2222-4222-8222-bbbbbbbb1501','en','Peripheral Speed','52–60 m/s','physical',30),
  ('11111501-bbbb-4bbb-8bbb-bbbb1501en04','bbbb1501-2222-4222-8222-bbbbbbbb1501','en','Mounting','V1 position, vertical flange type','physical',40),
  ('11111501-bbbb-4bbb-8bbb-bbbb1501en05','bbbb1501-2222-4222-8222-bbbbbbbb1501','en','Protection / Insulation','IP56, Class F insulation','material',50);

-- FAQS (EN) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1501-2222-4222-8222-bbbbbbbb1501' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221501-bbbb-4bbb-8bbb-bbbb1501en01','bbbb1501-2222-4222-8222-bbbbbbbb1501','en','Where does the motor and reducer group operate?','On the tower deck, working together with the fan and fan stack as a single group.',10,1),
  ('22221501-bbbb-4bbb-8bbb-bbbb1501en02','bbbb1501-2222-4222-8222-bbbbbbbb1501','en','When is a reducer required?','For larger fan diameters (typically Ø > 1600 mm), motor and reducer are used together.',20,1),
  ('22221501-bbbb-4bbb-8bbb-bbbb1501en03','bbbb1501-2222-4222-8222-bbbbbbbb1501','en','What is the protection class?','Motors are IP56 protected and Class F insulated against dust, oil and moisture.',30,1);

-- REVIEWS (EN) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331501-bbbb-4bbb-8bbb-bbbb1501en01',
  '33331501-bbbb-4bbb-8bbb-bbbb1501en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331501-bbbb-4bbb-8bbb-bbbb1501en01','bbbb1501-2222-4222-8222-bbbbbbbb1501',NULL,5,'High-efficiency motor with IP56 protection performs reliably in harsh environments.',1,'Maintenance Team'),
  ('33331501-bbbb-4bbb-8bbb-bbbb1501en02','bbbb1501-2222-4222-8222-bbbbbbbb1501',NULL,4,'Motor + reducer configuration is more stable for large fan applications.',1,'Plant Operations');

-- OPTIONS (EN) — id-based reset (parity)
DELETE FROM product_options
WHERE id='44441501-bbbb-4bbb-8bbb-bbbb1501en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441501-bbbb-4bbb-8bbb-bbbb1501en01','bbbb1501-2222-4222-8222-bbbbbbbb1501','Configuration', JSON_ARRAY(
    'Motor only (Ø ≤ 1600 mm)',
    'Motor + Reducer (large fan units)'
  ));

-- =============================================================
-- I18N (DE) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1501-2222-4222-8222-bbbbbbbb1501',
  'de',
  'Wasserkühlturmmotor – Getriebe – Lüfter',
  'wasserkuehlturmmotor-getriebe-luefter',
  'An der Spitze des Turms (Deckteil) arbeitet der Elektromotor (oder Motor + Getriebeeinheit) mit Ventilator und Ventilatorstapel als Gruppe. Es übernimmt eine zentrale Aufgabe im Kühlturm. Türme mit Ventilatordurchmesser Ø ≤ 1600 mm werden nur mit Elektromotor verwendet, größere Anlagen mit Motor und Getriebe. Die Umfangsgeschwindigkeit beträgt 52–60 m/s. Elektromotoren und Getriebe werden als vertikale Flanschausführung in V1-Position eingesetzt. Elektromotoren sind mit Schutzart IP56 und Isolationsklasse F gegen Staub, Öl und Feuchtigkeit geschützt.',
  'Kühlturm Motor und Getriebe (Lüftergruppe) Ersatzteil',
  JSON_ARRAY('ersatzteil', 'motor', 'getriebe', 'lueftergruppe', 'kuehlturm', 'ensotek'),
  JSON_OBJECT(
    'umfangsgeschwindigkeit', '52–60 m/s',
    'durchmesserHinweis', 'Ø ≤ 1600 mm: nur Motor | größer: Motor + Getriebe',
    'montage', 'V1 vertikale Flanschausführung',
    'isolation', 'Klasse F',
    'schutzart', 'IP56'
  ),
  'Wasserkühlturmmotor & Getriebe | Kühlturm Ersatzteile | Ensotek',
  'Motor- und Getriebeeinheit für Kühltürme: IP56, Isolationsklasse F, 52–60 m/s Umfangsgeschwindigkeit, Einsatz am Deckteil mit Lüfter und Lüfterstapel.'
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
WHERE product_id='bbbb1501-2222-4222-8222-bbbbbbbb1501' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111501-cccc-4ccc-8ccc-bbbb1501de01','bbbb1501-2222-4222-8222-bbbbbbbb1501','de','Einbauort','Deckteil; arbeitet mit Lüfter und Lüfterstapel als Gruppe','custom',10),
  ('11111501-cccc-4ccc-8ccc-bbbb1501de02','bbbb1501-2222-4222-8222-bbbbbbbb1501','de','Hinweis Ventilatordurchmesser','Ø ≤ 1600 mm: nur Motor; größer: Motor + Getriebe','physical',20),
  ('11111501-cccc-4ccc-8ccc-bbbb1501de03','bbbb1501-2222-4222-8222-bbbbbbbb1501','de','Umfangsgeschwindigkeit','52–60 m/s','physical',30),
  ('11111501-cccc-4ccc-8ccc-bbbb1501de04','bbbb1501-2222-4222-8222-bbbbbbbb1501','de','Montage','V1, vertikale Flanschausführung','physical',40),
  ('11111501-cccc-4ccc-8ccc-bbbb1501de05','bbbb1501-2222-4222-8222-bbbbbbbb1501','de','Schutz / Isolation','IP56, Isolationsklasse F','material',50);

-- FAQS (DE) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1501-2222-4222-8222-bbbbbbbb1501' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221501-cccc-4ccc-8ccc-bbbb1501de01','bbbb1501-2222-4222-8222-bbbbbbbb1501','de','Wo wird die Motor-Getriebeeinheit eingesetzt?','Am Deckteil des Kühlturms, zusammen mit Lüfter und Lüfterstapel.',10,1),
  ('22221501-cccc-4ccc-8ccc-bbbb1501de02','bbbb1501-2222-4222-8222-bbbbbbbb1501','de','Wann wird ein Getriebe benötigt?','Bei größeren Ventilatordurchmessern (typisch > Ø 1600 mm) wird Motor + Getriebe verwendet.',20,1),
  ('22221501-cccc-4ccc-8ccc-bbbb1501de03','bbbb1501-2222-4222-8222-bbbbbbbb1501','de','Welche Schutzart hat der Motor?','IP56 Schutzart und Isolationsklasse F gegen Staub, Öl und Feuchtigkeit.',30,1);

-- REVIEWS (DE) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331501-cccc-4ccc-8ccc-bbbb1501de01',
  '33331501-cccc-4ccc-8ccc-bbbb1501de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331501-cccc-4ccc-8ccc-bbbb1501de01','bbbb1501-2222-4222-8222-bbbbbbbb1501',NULL,5,'Robuste Ausführung mit IP56 – läuft zuverlässig auch bei Feuchtigkeit.',1,'Instandhaltung'),
  ('33331501-cccc-4ccc-8ccc-bbbb1501de02','bbbb1501-2222-4222-8222-bbbbbbbb1501',NULL,4,'Mit Getriebe für große Lüfter deutlich stabiler im Betrieb.',1,'Betrieb');

-- OPTIONS (DE) — id-based reset (parity)
DELETE FROM product_options
WHERE id='44441501-cccc-4ccc-8ccc-bbbb1501de01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441501-cccc-4ccc-8ccc-bbbb1501de01','bbbb1501-2222-4222-8222-bbbbbbbb1501','Konfiguration', JSON_ARRAY(
    'Nur Motor (Ø ≤ 1600 mm)',
    'Motor + Getriebe (große Lüfteranlagen)'
  ));

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
