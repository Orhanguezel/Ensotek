-- =============================================================
-- FILE: 016.1_sparepart_bbbb1511_splash_grid_fill__all_locales.sql (FINAL / VALIDATION ALIGNED)
-- Ensotek – Sparepart Seed (11/14)
-- Sparepart: Splash Grid Dolgu / Splash Grid Fill / Spritzgitter-Füllung
--
-- ✅ FIXES (schema + validation aligned to corrected pattern):
--  - product_i18n.description: PLAIN TEXT (NO HTML)
--  - image urls: FULL URL
--  - product_i18n.specifications: Record<string,string> => ALL VALUES STRING
--    (NO JSON_ARRAY/JSON_OBJECT nested inside specifications)
--  - product_specs/product_faqs: locale-based reset with DELETE
--  - product_reviews: id-based reset
--  - product_options is locale-less => TR/EN/DE separate option rows with different IDs
--  - all child IDs: CHAR(36) safe (uuid-like, 36 chars)
--
-- RULES (SABIT):
--  - products.item_type        = 'sparepart'
--  - products.category_id      = 'aaaa1001-1111-4111-8111-aaaaaaaa1001'
--  - products.sub_category_id  = 'bbbb1003-1111-4111-8111-bbbbbbbb1003'  (Fill Media)
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
  'bbbb1511-2222-4222-8222-bbbbbbbb1511',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1003-1111-4111-8111-bbbbbbbb1003',
  0.00,
  'http://localhost:8086/uploads/material/grid-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/grid-250x250-1.jpg',
    'http://localhost:8086/uploads/material/splash-grid-dolgu_1-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1511,
  'SP-SPLASH-GRID-FILL',
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
  'bbbb1511-2222-4222-8222-bbbbbbbb1511',
  'tr',
  'Splash Grid Dolgu (Sıçratmalı Izgara Dolgu)',
  'splash-grid-dolgu',
  'Splash grid dolgu, kirli su ile çalışan uygulamalarda kullanılan dolgu tipidir. Suyu çok kirli olan proseslerde ve yüksek askıda katı madde içeren uygulamalarda, tıkanmaya karşı daha toleranslı bir yapı sunar. Domates salçası üretimi, yağ fabrikalarının vakum hatları ve haddehaneler gibi tesislerde sıklıkla tercih edilir.',
  'Soğutma kulesi splash grid (sıçratmalı ızgara) dolgu yedek parça',
  JSON_ARRAY('yedek parça', 'splash grid dolgu', 'ızgara dolgu', 'kirli su', 'tıkanma dayanımı', 'ensotek'),
  JSON_OBJECT(
    'kullanim', 'Kirli su ile çalışan uygulamalar',
    'avantaj', 'Tıkanmaya karşı toleranslı yapı',
    'tipikTesisler', 'Domates salçası üretimi; yağ fabrikası vakum hatları; haddehaneler'
  ),
  'Splash Grid Dolgu | Soğutma Kulesi Yedek Parça | Ensotek',
  'Kirli su uygulamaları için splash grid (sıçratmalı ızgara) dolgu. Tıkanmaya toleranslı yapı; salça üretimi, yağ fabrikası vakum hatları ve haddehanelerde tercih edilir.'
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
WHERE product_id='bbbb1511-2222-4222-8222-bbbbbbbb1511' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111511-aaaa-4aaa-8aaa-bbbb1511tr01','bbbb1511-2222-4222-8222-bbbbbbbb1511','tr','Dolgu Tipi','Splash Grid / Sıçratmalı ızgara dolgu','custom',10),
  ('11111511-aaaa-4aaa-8aaa-bbbb1511tr02','bbbb1511-2222-4222-8222-bbbbbbbb1511','tr','Uygun Proses','Kirli su ile çalışan sistemler','custom',20),
  ('11111511-aaaa-4aaa-8aaa-bbbb1511tr03','bbbb1511-2222-4222-8222-bbbbbbbb1511','tr','Avantaj','Tıkanmaya karşı toleranslı yapı','physical',30),
  ('11111511-aaaa-4aaa-8aaa-bbbb1511tr04','bbbb1511-2222-4222-8222-bbbbbbbb1511','tr','Tipik Kullanım','Salça üretimi, vakum hatları, haddehaneler','custom',40);

-- FAQS (TR) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1511-2222-4222-8222-bbbbbbbb1511' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221511-aaaa-4aaa-8aaa-bbbb1511tr01','bbbb1511-2222-4222-8222-bbbbbbbb1511','tr','Splash grid dolgu ne zaman tercih edilir?','Su çok kirliyse ve dolgu üzerinde tıkanma riski yüksekse splash grid dolgu tercih edilir.',10,1),
  ('22221511-aaaa-4aaa-8aaa-bbbb1511tr02','bbbb1511-2222-4222-8222-bbbbbbbb1511','tr','Hangi sektörlerde kullanımı yaygındır?','Domates salçası üretimi, yağ fabrikası vakum hatları ve haddehaneler gibi tesislerde yaygındır.',20,1),
  ('22221511-aaaa-4aaa-8aaa-bbbb1511tr03','bbbb1511-2222-4222-8222-bbbbbbbb1511','tr','Bakım açısından avantajı nedir?','Tıkanmaya daha toleranslı olduğu için temizleme ve bakım periyodunu kolaylaştırır.',30,1);

-- REVIEWS (TR) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331511-aaaa-4aaa-8aaa-bbbb1511tr01',
  '33331511-aaaa-4aaa-8aaa-bbbb1511tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331511-aaaa-4aaa-8aaa-bbbb1511tr01','bbbb1511-2222-4222-8222-bbbbbbbb1511',NULL,5,'Kirli su hattında tıkanma azaldı; bakım daha rahat.',1,'Bakım Ekibi'),
  ('33331511-aaaa-4aaa-8aaa-bbbb1511tr02','bbbb1511-2222-4222-8222-bbbbbbbb1511',NULL,4,'Haddehane prosesinde uzun süre stabil çalıştı.',1,'Operasyon');

-- OPTIONS (TR) — locale-less table => separate row
DELETE FROM product_options
WHERE id='44441511-aaaa-4aaa-8aaa-bbbb1511tr01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441511-aaaa-4aaa-8aaa-bbbb1511tr01','bbbb1511-2222-4222-8222-bbbbbbbb1511','Uygulama', JSON_ARRAY('Kirli su prosesi','Yüksek kirlenme (fouling)'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1511-2222-4222-8222-bbbbbbbb1511',
  'en',
  'Splash Grid Fill',
  'splash-grid-fill',
  'Splash grid fill is used for dirty-water applications. In processes with high suspended solids where clogging risk is elevated, it offers a more tolerant structure. It is commonly preferred in facilities such as tomato paste production, vacuum lines in oil factories, and rolling mills.',
  'Cooling tower splash grid fill spare part',
  JSON_ARRAY('spare part', 'splash grid fill', 'dirty water', 'anti-clogging', 'fill media', 'ensotek'),
  JSON_OBJECT(
    'service', 'Dirty-water duty',
    'benefit', 'More tolerant to clogging',
    'typicalIndustries', 'Tomato paste production; oil factory vacuum lines; rolling mills'
  ),
  'Splash Grid Fill | Cooling Tower Spare Parts | Ensotek',
  'Splash grid fill for dirty-water duty. Clogging-tolerant structure; commonly used in tomato paste production, oil factory vacuum lines and rolling mills.'
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
WHERE product_id='bbbb1511-2222-4222-8222-bbbbbbbb1511' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111511-bbbb-4bbb-8bbb-bbbb1511en01','bbbb1511-2222-4222-8222-bbbbbbbb1511','en','Fill Type','Splash grid fill','custom',10),
  ('11111511-bbbb-4bbb-8bbb-bbbb1511en02','bbbb1511-2222-4222-8222-bbbbbbbb1511','en','Service','Dirty-water applications','custom',20),
  ('11111511-bbbb-4bbb-8bbb-bbbb1511en03','bbbb1511-2222-4222-8222-bbbbbbbb1511','en','Benefit','More tolerant to clogging','physical',30),
  ('11111511-bbbb-4bbb-8bbb-bbbb1511en04','bbbb1511-2222-4222-8222-bbbbbbbb1511','en','Typical Use','Tomato paste, vacuum lines, rolling mills','custom',40);

-- FAQS (EN) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1511-2222-4222-8222-bbbbbbbb1511' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221511-bbbb-4bbb-8bbb-bbbb1511en01','bbbb1511-2222-4222-8222-bbbbbbbb1511','en','When should splash grid fill be selected?','When water is very dirty and clogging risk is high, splash grid fill is a practical choice.',10,1),
  ('22221511-bbbb-4bbb-8bbb-bbbb1511en02','bbbb1511-2222-4222-8222-bbbbbbbb1511','en','Which industries commonly use it?','Common uses include tomato paste plants, vacuum lines in oil factories, and rolling mills.',20,1),
  ('22221511-bbbb-4bbb-8bbb-bbbb1511en03','bbbb1511-2222-4222-8222-bbbbbbbb1511','en','What is the maintenance advantage?','Its clogging-tolerant structure typically reduces cleaning frequency and simplifies upkeep.',30,1);

-- REVIEWS (EN) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331511-bbbb-4bbb-8bbb-bbbb1511en01',
  '33331511-bbbb-4bbb-8bbb-bbbb1511en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331511-bbbb-4bbb-8bbb-bbbb1511en01','bbbb1511-2222-4222-8222-bbbbbbbb1511',NULL,5,'Reduced clogging in dirty-water duty and maintenance became easier.',1,'Maintenance'),
  ('33331511-bbbb-4bbb-8bbb-bbbb1511en02','bbbb1511-2222-4222-8222-bbbbbbbb1511',NULL,4,'Stable operation in rolling-mill process water.',1,'Operations');

-- OPTIONS (EN) — locale-less table => separate row
DELETE FROM product_options
WHERE id='44441511-bbbb-4bbb-8bbb-bbbb1511en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441511-bbbb-4bbb-8bbb-bbbb1511en01','bbbb1511-2222-4222-8222-bbbbbbbb1511','Application', JSON_ARRAY('Dirty water duty','High fouling duty'));

-- =============================================================
-- I18N (DE) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1511-2222-4222-8222-bbbbbbbb1511',
  'de',
  'Spritzgitter-Füllung (Splash Grid)',
  'spritzgitter-fuellung-splash-grid',
  'Diese Füllung wird mit schmutzigem Wasser eingesetzt. Bei Prozessen mit hoher Schmutz- bzw. Feststoffbelastung und erhöhtem Verstopfungsrisiko bietet sie eine tolerantere Struktur. Typische Anwendungen sind Tomatenmarkproduktion, Vakuumleitungen in Ölfabriken und Walzwerke.',
  'Kühlturm Spritzgitter-Füllung (Splash Grid) Ersatzteil',
  JSON_ARRAY('ersatzteil', 'spritzgitter fuellung', 'splash grid', 'schmutzwasser', 'anti-verstopfung', 'ensotek'),
  JSON_OBJECT(
    'einsatz', 'Schmutzwasser-Anwendungen',
    'vorteil', 'Toleranter gegenüber Verstopfung',
    'typischeAnlagen', 'Tomatenmarkproduktion; Vakuumleitungen in Ölfabriken; Walzwerke'
  ),
  'Spritzgitter-Füllung | Kühlturm Ersatzteile | Ensotek',
  'Spritzgitter-Füllung (Splash Grid) für schmutziges Wasser. Tolerant gegenüber Verstopfung; typische Anwendungen in Tomatenmarkproduktion, Ölfabrik-Vakuumleitungen und Walzwerken.'
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
WHERE product_id='bbbb1511-2222-4222-8222-bbbbbbbb1511' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111511-cccc-4ccc-8ccc-bbbb1511de01','bbbb1511-2222-4222-8222-bbbbbbbb1511','de','Fülltyp','Spritzgitter-/Splash-Grid-Füllung','custom',10),
  ('11111511-cccc-4ccc-8ccc-bbbb1511de02','bbbb1511-2222-4222-8222-bbbbbbbb1511','de','Einsatz','Schmutzwasser-Prozesse','custom',20),
  ('11111511-cccc-4ccc-8ccc-bbbb1511de03','bbbb1511-2222-4222-8222-bbbbbbbb1511','de','Vorteil','Toleranter gegenüber Verstopfung','physical',30),
  ('11111511-cccc-4ccc-8ccc-bbbb1511de04','bbbb1511-2222-4222-8222-bbbbbbbb1511','de','Typische Anwendung','Tomatenmark, Vakuumleitungen, Walzwerke','custom',40);

-- FAQS (DE) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1511-2222-4222-8222-bbbbbbbb1511' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221511-cccc-4ccc-8ccc-bbbb1511de01','bbbb1511-2222-4222-8222-bbbbbbbb1511','de','Wann ist Spritzgitter-Füllung sinnvoll?','Wenn das Wasser stark verschmutzt ist und ein hohes Verstopfungsrisiko besteht.',10,1),
  ('22221511-cccc-4ccc-8ccc-bbbb1511de02','bbbb1511-2222-4222-8222-bbbbbbbb1511','de','Wo wird sie typischerweise eingesetzt?','In Tomatenmarkproduktion, Vakuumleitungen von Ölfabriken und in Walzwerken.',20,1),
  ('22221511-cccc-4ccc-8ccc-bbbb1511de03','bbbb1511-2222-4222-8222-bbbbbbbb1511','de','Was ist der Wartungsvorteil?','Die tolerante Struktur reduziert Verstopfung und vereinfacht Reinigung und Wartung.',30,1);

-- REVIEWS (DE) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331511-cccc-4ccc-8ccc-bbbb1511de01',
  '33331511-cccc-4ccc-8ccc-bbbb1511de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331511-cccc-4ccc-8ccc-bbbb1511de01','bbbb1511-2222-4222-8222-bbbbbbbb1511',NULL,5,'Bei schmutzigem Wasser deutlich weniger Verstopfung, Wartung einfacher.',1,'Instandhaltung'),
  ('33331511-cccc-4ccc-8ccc-bbbb1511de02','bbbb1511-2222-4222-8222-bbbbbbbb1511',NULL,4,'Im Walzwerk-Prozesswasser stabil und zuverlässig.',1,'Betrieb');

-- OPTIONS (DE) — locale-less table => separate row
DELETE FROM product_options
WHERE id='44441511-cccc-4ccc-8ccc-bbbb1511de01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441511-cccc-4ccc-8ccc-bbbb1511de01','bbbb1511-2222-4222-8222-bbbbbbbb1511','Anwendung', JSON_ARRAY('Schmutzwasserbetrieb','Hohe Verschmutzung (Fouling)'));

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
