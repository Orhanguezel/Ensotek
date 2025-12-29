-- =============================================================
-- FILE: 015.9_sparepart_bbbb1509_pvc_film_fill__all_locales.sql (FINAL)
-- Ensotek – Sparepart Seed (09/14)
-- Sparepart: PVC Petek Dolgu (Film Tipi) / PVC Film Fill / PVC Folienfüllung
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
  'bbbb1509-2222-4222-8222-bbbbbbbb1509',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1003-1111-4111-8111-bbbbbbbb1003',
  0.00,
  'http://localhost:8086/uploads/material/pvc-cf-12-petek-dolgu_1-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/pvc-cf-12-petek-dolgu_1-250x250-1.jpg',
    'http://localhost:8086/uploads/material/pvc-cf-19-petek-dolgu-250x250-1.jpg',
    'http://localhost:8086/uploads/material/pvc-cf-30-petek-dolgu-250x250-1.jpg',
    'http://localhost:8086/uploads/material/pvc-cf-m-sogutma-kulesi-dolgusu-250x250-1.jpg',
    'http://localhost:8086/uploads/material/pvc-cf-o-sogutma-kulesi-dolgusu_1-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1509,
  'SP-PVC-FILM-FILL',
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
  'bbbb1509-2222-4222-8222-bbbbbbbb1509',
  'tr',
  'PVC Petek Dolgu (Film Tipi)',
  'pvc-petek-dolgu-film-tipi',
  'PVC film tipi petek dolgu, soğutma kulelerinde su ve havanın ısı alışverişi için gerekli ısı transfer yüzeyini oluşturur. Plakalar vakumla şekillendirilir ve daha sonra paket (bale) haline getirilerek blok olarak kullanılır. Maksimum 55 °C sıcaklığa kadar, suyun temiz olduğu (toz, kir ve kireçten arındırılmış) proseslerde tercih edilir. Yüksek yüzey alanı sayesinde diğer dolgu tiplerine göre verimi yüksektir. CF-12, CF-19, CF-30, CF-M ve CF-O tipleri bulunur. CF-30 tipi özellikle biyolojik arıtma gibi arıtma tesislerinde; CF-O tipi ise çapraz akışlı kulelerde kullanılır.',
  'Soğutma kulesi PVC film tipi petek dolgu yedek parça',
  JSON_ARRAY('yedek parça', 'pvc petek dolgu', 'film dolgu', 'cf-12', 'cf-19', 'cf-30', 'ensotek'),
  JSON_OBJECT(
    'malzeme', 'PVC',
    'kullanimKosulu', 'Temiz su, maks. 55 °C',
    'tipler', JSON_ARRAY('CF-12', 'CF-19', 'CF-30', 'CF-M', 'CF-O'),
    'notlar', JSON_OBJECT(
      'CF-30', 'Arıtma tesislerinde (özellikle biyolojik) yaygın kullanım',
      'CF-O', 'Çapraz akışlı kulelerde kullanım'
    )
  ),
  'PVC Petek Dolgu (Film Tipi) | Soğutma Kulesi Yedek Parça | Ensotek',
  'PVC film tipi petek dolgu: yüksek yüzey alanı ile verimli ısı transferi. Temiz su ve 55 °C altı prosesler için CF-12/19/30/CF-M/CF-O seçenekleri.'
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
WHERE product_id='bbbb1509-2222-4222-8222-bbbbbbbb1509' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111509-aaaa-4aaa-8aaa-bbbb1509tr01','bbbb1509-2222-4222-8222-bbbbbbbb1509','tr','Dolgu Tipi','Film tipi (petek dolgu)','custom',10),
  ('11111509-aaaa-4aaa-8aaa-bbbb1509tr02','bbbb1509-2222-4222-8222-bbbbbbbb1509','tr','Malzeme','PVC','material',20),
  ('11111509-aaaa-4aaa-8aaa-bbbb1509tr03','bbbb1509-2222-4222-8222-bbbbbbbb1509','tr','Önerilen Proses','Temiz su (toz/kir/kireç düşük)','custom',30),
  ('11111509-aaaa-4aaa-8aaa-bbbb1509tr04','bbbb1509-2222-4222-8222-bbbbbbbb1509','tr','Maks. Su Sıcaklığı','55 °C','physical',40),
  ('11111509-aaaa-4aaa-8aaa-bbbb1509tr05','bbbb1509-2222-4222-8222-bbbbbbbb1509','tr','Tip Seçenekleri','CF-12 / CF-19 / CF-30 / CF-M / CF-O','custom',50);

-- FAQS (TR)
DELETE FROM product_faqs
WHERE product_id='bbbb1509-2222-4222-8222-bbbbbbbb1509' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221509-aaaa-4aaa-8aaa-bbbb1509tr01','bbbb1509-2222-4222-8222-bbbbbbbb1509','tr','PVC petek dolgu hangi şartlarda tercih edilir?','Genellikle temiz su proseslerinde ve su sıcaklığının 55 °C altında olduğu uygulamalarda tercih edilir.',10,1),
  ('22221509-aaaa-4aaa-8aaa-bbbb1509tr02','bbbb1509-2222-4222-8222-bbbbbbbb1509','tr','Film tipi dolgunun avantajı nedir?','Yüksek yüzey alanı sayesinde ısı transfer verimi yüksektir.',20,1),
  ('22221509-aaaa-4aaa-8aaa-bbbb1509tr03','bbbb1509-2222-4222-8222-bbbbbbbb1509','tr','CF tipleri neyi ifade eder?','Farklı geometri ve adım (pitch) seçeneklerini ifade eder. Uygulamaya göre CF-12/19/30/CF-M/CF-O seçilir.',30,1);

-- REVIEWS (TR)
DELETE FROM product_reviews
WHERE id IN (
  '33331509-aaaa-4aaa-8aaa-bbbb1509tr01',
  '33331509-aaaa-4aaa-8aaa-bbbb1509tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331509-aaaa-4aaa-8aaa-bbbb1509tr01','bbbb1509-2222-4222-8222-bbbbbbbb1509',NULL,5,'Temiz su prosesinde performansı çok iyi; kule verimi yükseldi.',1,'Tesis Operasyon'),
  ('33331509-aaaa-4aaa-8aaa-bbbb1509tr02','bbbb1509-2222-4222-8222-bbbbbbbb1509',NULL,4,'CF seçenekleriyle ihtiyaca göre doğru dolgu seçimi yapılabiliyor.',1,'Bakım Ekibi');

-- OPTIONS (shared)
DELETE FROM product_options
WHERE id='44441509-aaaa-4aaa-8aaa-bbbb1509op01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441509-aaaa-4aaa-8aaa-bbbb1509op01','bbbb1509-2222-4222-8222-bbbbbbbb1509','Type', JSON_ARRAY('PVC CF-12','PVC CF-19','PVC CF-30','PVC CF-M','PVC CF-O'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1509-2222-4222-8222-bbbbbbbb1509',
  'en',
  'PVC Film Fill',
  'pvc-film-fill',
  'PVC film fill provides the heat transfer surface required for water-to-air exchange in cooling towers. Sheets are vacuum-formed and assembled into blocks (bales) for installation. It is typically used in clean-water processes up to 55 °C, where water is free of excessive dust, dirt and scaling. Due to its large surface area, efficiency is higher than many other fill types. Common types include CF-12, CF-19, CF-30, CF-M and CF-O. CF-30 is widely used in wastewater treatment (especially biological treatment); CF-O is used in crossflow cooling towers.',
  'Cooling tower PVC film fill spare part',
  JSON_ARRAY('spare part', 'PVC film fill', 'film fill', 'CF-12', 'CF-19', 'CF-30', 'ensotek'),
  JSON_OBJECT(
    'material', 'PVC',
    'recommendedProcess', 'Clean water, up to 55 °C',
    'types', JSON_ARRAY('CF-12', 'CF-19', 'CF-30', 'CF-M', 'CF-O'),
    'notes', JSON_OBJECT(
      'CF-30', 'Common in wastewater treatment (biological)',
      'CF-O', 'Used in crossflow towers'
    )
  ),
  'PVC Film Fill | Cooling Tower Spare Parts | Ensotek',
  'PVC film fill for efficient heat transfer in clean-water processes up to 55 °C. Available in CF-12/19/30/CF-M/CF-O options.'
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
WHERE product_id='bbbb1509-2222-4222-8222-bbbbbbbb1509' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111509-bbbb-4bbb-8bbb-bbbb1509en01','bbbb1509-2222-4222-8222-bbbbbbbb1509','en','Fill Type','Film fill','custom',10),
  ('11111509-bbbb-4bbb-8bbb-bbbb1509en02','bbbb1509-2222-4222-8222-bbbbbbbb1509','en','Material','PVC','material',20),
  ('11111509-bbbb-4bbb-8bbb-bbbb1509en03','bbbb1509-2222-4222-8222-bbbbbbbb1509','en','Recommended Process','Clean water (low fouling/scaling)','custom',30),
  ('11111509-bbbb-4bbb-8bbb-bbbb1509en04','bbbb1509-2222-4222-8222-bbbbbbbb1509','en','Max. Water Temperature','55 °C','physical',40),
  ('11111509-bbbb-4bbb-8bbb-bbbb1509en05','bbbb1509-2222-4222-8222-bbbbbbbb1509','en','Type Options','CF-12 / CF-19 / CF-30 / CF-M / CF-O','custom',50);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb1509-2222-4222-8222-bbbbbbbb1509' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221509-bbbb-4bbb-8bbb-bbbb1509en01','bbbb1509-2222-4222-8222-bbbbbbbb1509','en','When should PVC film fill be used?','It is recommended for clean-water applications up to about 55 °C with low fouling and scaling.',10,1),
  ('22221509-bbbb-4bbb-8bbb-bbbb1509en02','bbbb1509-2222-4222-8222-bbbbbbbb1509','en','What is the main advantage of film fill?','High surface area, which increases heat transfer efficiency.',20,1),
  ('22221509-bbbb-4bbb-8bbb-bbbb1509en03','bbbb1509-2222-4222-8222-bbbbbbbb1509','en','What do CF types indicate?','They represent different geometries/pitches. Selection depends on water quality and operating conditions.',30,1);

-- REVIEWS (EN)
DELETE FROM product_reviews
WHERE id IN (
  '33331509-bbbb-4bbb-8bbb-bbbb1509en01',
  '33331509-bbbb-4bbb-8bbb-bbbb1509en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331509-bbbb-4bbb-8bbb-bbbb1509en01','bbbb1509-2222-4222-8222-bbbbbbbb1509',NULL,5,'Excellent thermal performance in clean-water duty; noticeable efficiency gain.',1,'Operations'),
  ('33331509-bbbb-4bbb-8bbb-bbbb1509en02','bbbb1509-2222-4222-8222-bbbbbbbb1509',NULL,4,'Multiple CF options make it easy to match site conditions.',1,'Maintenance');

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1509-2222-4222-8222-bbbbbbbb1509',
  'de',
  'PVC Folienfüllung (Filmfüllung)',
  'pvc-folienfuellung-filmfuellung',
  'Die PVC-Folienfüllung bildet die Wärmeübertragungsfläche für den Wärmeaustausch zwischen Wasser und Luft im Kühlturm. Die Folienplatten werden im Vakuum geformt und zu Blöcken (Ballen) zusammengefügt. Sie wird in Prozessen mit sauberem Wasser bis etwa 55 °C eingesetzt, wenn das Wasser weitgehend frei von Staub, Schmutz und Verkalkung ist. Durch die große Oberfläche ist die Leistung höher als bei vielen anderen Fülltypen. Verfügbare Typen sind CF-12, CF-19, CF-30, CF-M und CF-O. CF-30 wird häufig in Kläranlagen, insbesondere in biologischen Anlagen, eingesetzt; CF-O wird in Querstromkühltürmen verwendet.',
  'Kühlturm PVC Folienfüllung (Filmfüllung) Ersatzteil',
  JSON_ARRAY('ersatzteil', 'pvc folienfuellung', 'filmfuellung', 'cf-12', 'cf-19', 'cf-30', 'ensotek'),
  JSON_OBJECT(
    'material', 'PVC',
    'einsatz', 'Sauberes Wasser, bis ca. 55 °C',
    'typen', JSON_ARRAY('CF-12', 'CF-19', 'CF-30', 'CF-M', 'CF-O'),
    'hinweise', JSON_OBJECT(
      'CF-30', 'Häufig in Kläranlagen (biologisch)',
      'CF-O', 'Für Querstromkühltürme'
    )
  ),
  'PVC Folienfüllung | Kühlturm Ersatzteile | Ensotek',
  'PVC Filmfüllung für effiziente Wärmeübertragung bei sauberem Wasser bis 55 °C. Typen CF-12/19/30/CF-M/CF-O verfügbar.'
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
WHERE product_id='bbbb1509-2222-4222-8222-bbbbbbbb1509' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111509-cccc-4ccc-8ccc-bbbb1509de01','bbbb1509-2222-4222-8222-bbbbbbbb1509','de','Fülltyp','Filmfüllung (Folienfüllung)','custom',10),
  ('11111509-cccc-4ccc-8ccc-bbbb1509de02','bbbb1509-2222-4222-8222-bbbbbbbb1509','de','Material','PVC','material',20),
  ('11111509-cccc-4ccc-8ccc-bbbb1509de03','bbbb1509-2222-4222-8222-bbbbbbbb1509','de','Empfohlener Einsatz','Sauberes Wasser (geringe Verschmutzung/Verkalkung)','custom',30),
  ('11111509-cccc-4ccc-8ccc-bbbb1509de04','bbbb1509-2222-4222-8222-bbbbbbbb1509','de','Max. Wassertemperatur','55 °C','physical',40),
  ('11111509-cccc-4ccc-8ccc-bbbb1509de05','bbbb1509-2222-4222-8222-bbbbbbbb1509','de','Typen','CF-12 / CF-19 / CF-30 / CF-M / CF-O','custom',50);

-- FAQS (DE)
DELETE FROM product_faqs
WHERE product_id='bbbb1509-2222-4222-8222-bbbbbbbb1509' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221509-cccc-4ccc-8ccc-bbbb1509de01','bbbb1509-2222-4222-8222-bbbbbbbb1509','de','Wann wird PVC-Folienfüllung eingesetzt?','Bei sauberem Wasser und Wassertemperaturen bis etwa 55 °C, wenn geringe Verschmutzung/Verkalkung vorliegt.',10,1),
  ('22221509-cccc-4ccc-8ccc-bbbb1509de02','bbbb1509-2222-4222-8222-bbbbbbbb1509','de','Was ist der Vorteil von Filmfüllung?','Hohe Oberfläche und damit sehr gute Wärmeübertragungsleistung.',20,1),
  ('22221509-cccc-4ccc-8ccc-bbbb1509de03','bbbb1509-2222-4222-8222-bbbbbbbb1509','de','Wofür stehen die CF-Typen?','Sie kennzeichnen unterschiedliche Geometrien/Teilungen. Die Auswahl erfolgt je nach Wasserqualität und Betriebsbedingungen.',30,1);

-- REVIEWS (DE)
DELETE FROM product_reviews
WHERE id IN (
  '33331509-cccc-4ccc-8ccc-bbbb1509de01',
  '33331509-cccc-4ccc-8ccc-bbbb1509de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331509-cccc-4ccc-8ccc-bbbb1509de01','bbbb1509-2222-4222-8222-bbbbbbbb1509',NULL,5,'Sehr gute Leistung bei sauberem Wasser; die Kühlleistung ist gestiegen.',1,'Betrieb'),
  ('33331509-cccc-4ccc-8ccc-bbbb1509de02','bbbb1509-2222-4222-8222-bbbbbbbb1509',NULL,4,'Die CF-Varianten helfen, die passende Ausführung schnell zu wählen.',1,'Instandhaltung');

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
