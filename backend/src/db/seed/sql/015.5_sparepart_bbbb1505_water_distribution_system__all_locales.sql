-- =============================================================
-- FILE: 015.5_sparepart_bbbb1505_water_distribution_system__all_locales.sql (FINAL / VALIDATION ALIGNED)
-- Ensotek – Sparepart Seed (05/14)
-- Sparepart: Su Dağıtım Sistemi / Water Distribution System / Wasserverteilungssystem
--
-- ✅ FIXES (schema + validation aligned to 015.4 pattern):
--  - product_i18n.description: PLAIN TEXT (NO HTML)
--  - image urls: FULL URL
--  - product_i18n.specifications: Record<string,string> => ALL VALUES STRING
--    (NO nested JSON_OBJECT/JSON_ARRAY inside specifications)
--  - child tables: locale-based reset with DELETE (product_id + locale)
--  - options: TR/EN/DE separately (table is locale-less) => id-based delete
--  - child IDs: 36-char uuid-like
--
-- RULES (SABIT):
--  - products.item_type        = 'sparepart'
--  - products.category_id      = 'aaaa1001-1111-4111-8111-aaaaaaaa1001'
--  - products.sub_category_id  = 'bbbb1001-1111-4111-8111-bbbbbbbb1001'  (Tower Main Components)
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
  'bbbb1505-2222-4222-8222-bbbbbbbb1505',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1001-1111-4111-8111-bbbbbbbb1001',
  0.00,
  'https://www.ensotek.de/uploads/material/su-dagitim-sistemi-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'https://www.ensotek.de/uploads/material/su-dagitim-sistemi-250x250-1.jpg',
    'https://www.ensotek.de/uploads/material/pvc-kole-ve-pvc-flans-250x250-1.jpg',
    'https://www.ensotek.de/uploads/material/su-dagitim-uygulamasi-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1505,
  'SP-WATER-DISTRIBUTION',
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
  'bbbb1505-2222-4222-8222-bbbbbbbb1505',
  'tr',
  'Su Dağıtım Sistemi',
  'su-dagitim-sistemi',
  'Su dağıtım sistemi, kule içinde damlalık (drift eliminator) ile dolgu malzemesi arasında konumlanır ve tesisten gelen sıcak suyun dolgular üzerine eşit şekilde dağıtılmasını sağlar. Su sıcaklığı 55°C’nin altındaysa ana boru ve by-pass hattı PVC malzemeden; daha yüksek sıcaklıklarda ise PP veya CTP (FRP) malzemeden uygulanır. Ana boru ve by-pass, sızdırmaz bağlantı ile üretilir; bu sayede bakım sırasında kesme/ekleme işlemi gerektirmeden kolayca sökülüp takılabilir.',
  'Soğutma kulesi su dağıtım sistemi yedek parça',
  JSON_ARRAY('yedek parça', 'su dağıtım', 'kolektör', 'by-pass', 'dolgu', 'soğutma kulesi', 'ensotek'),
  JSON_OBJECT(
    'konum', 'Damlalık (drift eliminator) ile dolgu malzemesi arasında (kule içi)',
    'gorev', 'Tesisten gelen sıcak suyu dolgular üzerine eşit dağıtır',
    'sicaklikEsigi', '55°C',
    'malzeme55Alti', 'PVC (ana boru + by-pass)',
    'malzeme55Ustu', 'PP veya CTP (FRP)',
    'baglanti', 'Sızdırmaz bağlantı; bakımda kesme/ekleme gerektirmeden sök/tak'
  ),
  'Su Dağıtım Sistemi | Soğutma Kulesi Yedek Parça | Ensotek',
  'Kule içi su dağıtım sistemi: sıcak suyu dolgulara eşit dağıtır. 55°C altı PVC; yüksek sıcaklıkta PP/CTP. Sızdırmaz bağlantı ile kolay bakım.'
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
WHERE product_id='bbbb1505-2222-4222-8222-bbbbbbbb1505' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111505-aaaa-4aaa-8aaa-bbbb1505tr01','bbbb1505-2222-4222-8222-bbbbbbbb1505','tr','Konum','Damlalık (drift eliminator) ile dolgu arasında (kule içi)','custom',10),
  ('11111505-aaaa-4aaa-8aaa-bbbb1505tr02','bbbb1505-2222-4222-8222-bbbbbbbb1505','tr','Görev','Sıcak suyu dolgular üzerine eşit dağıtım','custom',20),
  ('11111505-aaaa-4aaa-8aaa-bbbb1505tr03','bbbb1505-2222-4222-8222-bbbbbbbb1505','tr','Sıcaklık Eşiği','55°C','physical',30),
  ('11111505-aaaa-4aaa-8aaa-bbbb1505tr04','bbbb1505-2222-4222-8222-bbbbbbbb1505','tr','Malzeme (≤55°C)','PVC (ana boru + by-pass)','material',40),
  ('11111505-aaaa-4aaa-8aaa-bbbb1505tr05','bbbb1505-2222-4222-8222-bbbbbbbb1505','tr','Malzeme (>55°C)','PP veya CTP (FRP)','material',50);

-- FAQS (TR) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1505-2222-4222-8222-bbbbbbbb1505' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221505-aaaa-4aaa-8aaa-bbbb1505tr01','bbbb1505-2222-4222-8222-bbbbbbbb1505','tr','Su dağıtım sistemi ne işe yarar?','Tesisten gelen sıcak suyu kule içindeki dolgular üzerine eşit şekilde dağıtır.',10,1),
  ('22221505-aaaa-4aaa-8aaa-bbbb1505tr02','bbbb1505-2222-4222-8222-bbbbbbbb1505','tr','Hangi sıcaklıkta hangi malzeme kullanılır?','55°C altı uygulamalarda PVC; daha yüksek sıcaklıklarda PP veya CTP (FRP) tercih edilir.',20,1),
  ('22221505-aaaa-4aaa-8aaa-bbbb1505tr03','bbbb1505-2222-4222-8222-bbbbbbbb1505','tr','Bakım sırasında sökme-takma kolay mı?','Evet. Sızdırmaz bağlantı yapısı sayesinde kesme/ekleme yapmadan kolayca sökülüp takılabilir.',30,1);

-- REVIEWS (TR) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331505-aaaa-4aaa-8aaa-bbbb1505tr01',
  '33331505-aaaa-4aaa-8aaa-bbbb1505tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331505-aaaa-4aaa-8aaa-bbbb1505tr01','bbbb1505-2222-4222-8222-bbbbbbbb1505',NULL,5,'Dağıtım homojenliği arttı, dolgu yüzeyi daha verimli çalışıyor.',1,'Operasyon'),
  ('33331505-aaaa-4aaa-8aaa-bbbb1505tr02','bbbb1505-2222-4222-8222-bbbbbbbb1505',NULL,4,'Sızdırmaz bağlantı bakımda çok zaman kazandırıyor.',1,'Bakım Ekibi');

-- OPTIONS (TR) — id-based reset (table is locale-less)
DELETE FROM product_options
WHERE id='44441505-aaaa-4aaa-8aaa-bbbb1505tr01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441505-aaaa-4aaa-8aaa-bbbb1505tr01','bbbb1505-2222-4222-8222-bbbbbbbb1505','Malzeme', JSON_ARRAY(
    'PVC (≤55°C)',
    'PP (>55°C)',
    'CTP (FRP) (>55°C)'
  ));

-- =============================================================
-- I18N (EN) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1505-2222-4222-8222-bbbbbbbb1505',
  'en',
  'Water Distribution System',
  'water-distribution-system',
  'The water distribution system is located inside the tower between the drift eliminator and the fill media. It ensures uniform distribution of hot water from the plant onto the fills. When water temperature is below 55°C, the main pipe and bypass are applied in PVC; for higher temperatures they are implemented in PP or FRP (CTP). The main pipe and bypass are produced with leak-tight connections, allowing easy assembly/disassembly without cutting and splicing during maintenance.',
  'Cooling tower water distribution system spare part',
  JSON_ARRAY('spare part', 'water distribution', 'collector', 'bypass', 'fill media', 'cooling tower', 'ensotek'),
  JSON_OBJECT(
    'location', 'Inside tower, between drift eliminator and fill media',
    'function', 'Uniformly distributes hot water onto the fill media',
    'temperatureThreshold', '55°C',
    'materialBelow55C', 'PVC (main pipe + bypass)',
    'materialAbove55C', 'PP or FRP (CTP)',
    'connection', 'Leak-tight joints; easy maintenance without cutting/splicing'
  ),
  'Water Distribution System | Cooling Tower Spare Parts | Ensotek',
  'Cooling tower water distribution system: distributes hot water uniformly onto fill media. PVC below 55°C; PP/FRP above 55°C. Leak-tight joints for easy maintenance.'
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
WHERE product_id='bbbb1505-2222-4222-8222-bbbbbbbb1505' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111505-bbbb-4bbb-8bbb-bbbb1505en01','bbbb1505-2222-4222-8222-bbbbbbbb1505','en','Location','Inside tower, between drift eliminator and fill','custom',10),
  ('11111505-bbbb-4bbb-8bbb-bbbb1505en02','bbbb1505-2222-4222-8222-bbbbbbbb1505','en','Function','Uniform distribution of hot water onto the fill media','custom',20),
  ('11111505-bbbb-4bbb-8bbb-bbbb1505en03','bbbb1505-2222-4222-8222-bbbbbbbb1505','en','Temperature Threshold','55°C','physical',30),
  ('11111505-bbbb-4bbb-8bbb-bbbb1505en04','bbbb1505-2222-4222-8222-bbbbbbbb1505','en','Material (≤55°C)','PVC (main pipe + bypass)','material',40),
  ('11111505-bbbb-4bbb-8bbb-bbbb1505en05','bbbb1505-2222-4222-8222-bbbbbbbb1505','en','Material (>55°C)','PP or FRP (CTP)','material',50);

-- FAQS (EN) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1505-2222-4222-8222-bbbbbbbb1505' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221505-bbbb-4bbb-8bbb-bbbb1505en01','bbbb1505-2222-4222-8222-bbbbbbbb1505','en','What does the water distribution system do?','It distributes hot water from the plant uniformly onto the tower fill media.',10,1),
  ('22221505-bbbb-4bbb-8bbb-bbbb1505en02','bbbb1505-2222-4222-8222-bbbbbbbb1505','en','Which material is used at different temperatures?','PVC is used below 55°C; PP or FRP (CTP) is preferred above 55°C.',20,1),
  ('22221505-bbbb-4bbb-8bbb-bbbb1505en03','bbbb1505-2222-4222-8222-bbbbbbbb1505','en','Is maintenance easy?','Yes. Leak-tight joints allow easy assembly/disassembly without cutting or splicing.',30,1);

-- REVIEWS (EN) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331505-bbbb-4bbb-8bbb-bbbb1505en01',
  '33331505-bbbb-4bbb-8bbb-bbbb1505en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331505-bbbb-4bbb-8bbb-bbbb1505en01','bbbb1505-2222-4222-8222-bbbbbbbb1505',NULL,5,'Improved distribution uniformity; fill surface works more efficiently.',1,'Operations'),
  ('33331505-bbbb-4bbb-8bbb-bbbb1505en02','bbbb1505-2222-4222-8222-bbbbbbbb1505',NULL,4,'Leak-tight connection saves significant time during maintenance.',1,'Maintenance');

-- OPTIONS (EN) — id-based reset
DELETE FROM product_options
WHERE id='44441505-bbbb-4bbb-8bbb-bbbb1505en01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441505-bbbb-4bbb-8bbb-bbbb1505en01','bbbb1505-2222-4222-8222-bbbbbbbb1505','Material (Main/Bypass)', JSON_ARRAY(
    'PVC (≤55°C)',
    'PP (>55°C)',
    'FRP/CTP (>55°C)'
  ));

-- =============================================================
-- I18N (DE) — PLAIN TEXT + specifications: Record<string,string>
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1505-2222-4222-8222-bbbbbbbb1505',
  'de',
  'Wasserverteilungssystem',
  'wasserverteilungssystem',
  'Das Wasserverteilungssystem befindet sich im Turm zwischen Tropfenabscheider (Drift Eliminator) und Füllkörpern. Es sorgt für die gleichmäßige Verteilung von heißem Wasser aus der Anlage auf die Füllungen. Liegt die Wassertemperatur unter 55°C, bestehen Hauptrohr und Bypass aus PVC; bei höheren Temperaturen werden PP oder FRP (CTP) eingesetzt. Hauptrohr und Bypass sind mit dichtender Verbindung ausgeführt, sodass sie ohne Schneiden und Einfügen während der Wartung leicht montiert und demontiert werden können.',
  'Wasserverteilungssystem für Kühltürme Ersatzteil',
  JSON_ARRAY('ersatzteil', 'wasserverteilung', 'sammler', 'bypass', 'fuellkoerper', 'kuehlturm', 'ensotek'),
  JSON_OBJECT(
    'einbauort', 'Im Turm zwischen Tropfenabscheider und Füllkörpern',
    'funktion', 'Gleichmäßige Verteilung von heißem Wasser auf die Füllungen',
    'temperaturSchwelle', '55°C',
    'materialUnter55C', 'PVC (Hauptrohr + Bypass)',
    'materialUeber55C', 'PP oder FRP (CTP)',
    'verbindung', 'Dichtende Verbindung; Montage/Demontage ohne Schneiden und Einfügen'
  ),
  'Wasserverteilungssystem | Kühlturm Ersatzteile | Ensotek',
  'Wasserverteilungssystem im Kühlturm: verteilt heißes Wasser gleichmäßig auf Füllkörper. PVC unter 55°C, PP/FRP darüber. Dichtende Verbindung für einfache Wartung.'
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
WHERE product_id='bbbb1505-2222-4222-8222-bbbbbbbb1505' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111505-cccc-4ccc-8ccc-bbbb1505de01','bbbb1505-2222-4222-8222-bbbbbbbb1505','de','Einbauort','Im Turm zwischen Tropfenabscheider und Füllkörpern','custom',10),
  ('11111505-cccc-4ccc-8ccc-bbbb1505de02','bbbb1505-2222-4222-8222-bbbbbbbb1505','de','Funktion','Gleichmäßige Verteilung von heißem Wasser auf die Füllungen','custom',20),
  ('11111505-cccc-4ccc-8ccc-bbbb1505de03','bbbb1505-2222-4222-8222-bbbbbbbb1505','de','Temperaturschwelle','55°C','physical',30),
  ('11111505-cccc-4ccc-8ccc-bbbb1505de04','bbbb1505-2222-4222-8222-bbbbbbbb1505','de','Material (≤55°C)','PVC (Hauptrohr + Bypass)','material',40),
  ('11111505-cccc-4ccc-8ccc-bbbb1505de05','bbbb1505-2222-4222-8222-bbbbbbbb1505','de','Material (>55°C)','PP oder FRP (CTP)','material',50);

-- FAQS (DE) — locale reset
DELETE FROM product_faqs
WHERE product_id='bbbb1505-2222-4222-8222-bbbbbbbb1505' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221505-cccc-4ccc-8ccc-bbbb1505de01','bbbb1505-2222-4222-8222-bbbbbbbb1505','de','Wofür ist das Wasserverteilungssystem zuständig?','Es verteilt das heiße Wasser aus der Anlage gleichmäßig auf die Füllkörper im Turm.',10,1),
  ('22221505-cccc-4ccc-8ccc-bbbb1505de02','bbbb1505-2222-4222-8222-bbbbbbbb1505','de','Welches Material wird bei welchen Temperaturen verwendet?','Unter 55°C PVC; bei höheren Temperaturen PP oder FRP (CTP).',20,1),
  ('22221505-cccc-4ccc-8ccc-bbbb1505de03','bbbb1505-2222-4222-8222-bbbbbbbb1505','de','Ist die Wartung einfach?','Ja. Durch dichtende Verbindungen ist die Montage/Demontage ohne Schneiden und Einfügen möglich.',30,1);

-- REVIEWS (DE) — id-based reset
DELETE FROM product_reviews
WHERE id IN (
  '33331505-cccc-4ccc-8ccc-bbbb1505de01',
  '33331505-cccc-4ccc-8ccc-bbbb1505de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331505-cccc-4ccc-8ccc-bbbb1505de01','bbbb1505-2222-4222-8222-bbbbbbbb1505',NULL,5,'Sehr gleichmäßige Verteilung – die Füllkörper arbeiten spürbar effizienter.',1,'Betrieb'),
  ('33331505-cccc-4ccc-8ccc-bbbb1505de02','bbbb1505-2222-4222-8222-bbbbbbbb1505',NULL,4,'Die dichte Verbindung erleichtert Wartung und Umbau erheblich.',1,'Instandhaltung');

-- OPTIONS (DE) — id-based reset
DELETE FROM product_options
WHERE id='44441505-cccc-4ccc-8ccc-bbbb1505de01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441505-cccc-4ccc-8ccc-bbbb1505de01','bbbb1505-2222-4222-8222-bbbbbbbb1505','Material (Haupt/Bypass)', JSON_ARRAY(
    'PVC (≤55°C)',
    'PP (>55°C)',
    'FRP/CTP (>55°C)'
  ));

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
