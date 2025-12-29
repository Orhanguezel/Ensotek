-- =============================================================
-- FILE: 015.8_sparepart_bbbb1508_drift_eliminators__all_locales.sql (FINAL)
-- Ensotek – Sparepart Seed (08/14)
-- Sparepart: Damlalıklar / Drift Eliminators / Tropfenabscheider
--
-- RULES (SABIT):
--  - products.item_type   = 'sparepart'
--  - products.category_id = 'aaaa1001-1111-4111-8111-aaaaaaaa1001'
--  - products.sub_category_id = 'bbbb1002-1111-4111-8111-bbbbbbbb1002'  (Spare Parts & Accessories)
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
  'bbbb1508-2222-4222-8222-bbbbbbbb1508',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1002-1111-4111-8111-bbbbbbbb1002',
  0.00,
  'http://localhost:8086/uploads/material/damlatutucu3-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/damlatutucu2-250x250-1.jpg',
    'http://localhost:8086/uploads/material/damla-tutucu-pvc-c-145x45-250x250-1.jpg',
    'http://localhost:8086/uploads/material/damlatutucu3-250x250-1.jpg',
    'http://localhost:8086/uploads/material/cooling-tower-drift-eliminator-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1508,
  'SP-DRIFT-ELIMINATOR',
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
  'bbbb1508-2222-4222-8222-bbbbbbbb1508',
  'tr',
  'Damlalıklar (Drift Eliminator)',
  'damlaliklar-drift-eliminator',
  'Damlalıklar, fan grubunun bulunduğu platform ile kule içindeki su dağıtım sistemi arasında yer alır. Görevi, su dağıtım sisteminde parçalanan su damlacıklarının emilen hava ile sürüklenerek atmosfere taşınmasını önlemektir. Kule içinde modüler kasetler halinde monte edilir; kasetler boşluksuz yerleştirilerek tüm kesitleri kapatır. Optimum tasarım ile yüksek damlacık tutma performansı sağlarken basınç kaybını düşük tutar.',
  'Soğutma kulesi damlalık (drift eliminator) yedek parça',
  JSON_ARRAY('yedek parça', 'damlalık', 'drift eliminator', 'damlacık tutucu', 'basınç kaybı', 'ensotek'),
  JSON_OBJECT(
    'konum', 'Fan platformu ile su dağıtım sistemi arasında',
    'amac', 'Damlacık sürüklenmesini (drift) azaltmak, su kaybını önlemek',
    'montaj', 'Modüler kaset sistem; boşluksuz montaj',
    'performans', 'Yüksek drift giderimi, düşük basınç kaybı'
  ),
  'Damlalıklar | Soğutma Kulesi Yedek Parça | Ensotek',
  'Drift eliminator (damlalık) kasetleri ile su damlacıklarının atmosfere taşınmasını azaltın. Modüler montaj, yüksek performans ve düşük basınç kaybı.'
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
WHERE product_id='bbbb1508-2222-4222-8222-bbbbbbbb1508' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111508-aaaa-4aaa-8aaa-bbbb1508tr01','bbbb1508-2222-4222-8222-bbbbbbbb1508','tr','Konum','Fan platformu ile su dağıtım sistemi arasında','custom',10),
  ('11111508-aaaa-4aaa-8aaa-bbbb1508tr02','bbbb1508-2222-4222-8222-bbbbbbbb1508','tr','Görev','Damlacık sürüklenmesini azaltır; su kaybını önler','physical',20),
  ('11111508-aaaa-4aaa-8aaa-bbbb1508tr03','bbbb1508-2222-4222-8222-bbbbbbbb1508','tr','Montaj','Modüler kaset, boşluksuz montaj ile tüm kesiti kaplar','custom',30),
  ('11111508-aaaa-4aaa-8aaa-bbbb1508tr04','bbbb1508-2222-4222-8222-bbbbbbbb1508','tr','Tasarım Hedefi','Yüksek drift giderimi + düşük basınç kaybı','custom',40),
  ('11111508-aaaa-4aaa-8aaa-bbbb1508tr05','bbbb1508-2222-4222-8222-bbbbbbbb1508','tr','Kullanım','Su dağıtım bölgesinde damlacık kontrolü','custom',50);

-- FAQS (TR)
DELETE FROM product_faqs
WHERE product_id='bbbb1508-2222-4222-8222-bbbbbbbb1508' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221508-aaaa-4aaa-8aaa-bbbb1508tr01','bbbb1508-2222-4222-8222-bbbbbbbb1508','tr','Damlalık ne işe yarar?','Su damlacıklarının hava ile sürüklenerek atmosfere taşınmasını azaltır ve su kaybını önler.',10,1),
  ('22221508-aaaa-4aaa-8aaa-bbbb1508tr02','bbbb1508-2222-4222-8222-bbbbbbbb1508','tr','Nerede konumlandırılır?','Fan grubunun bulunduğu platform ile su dağıtım sistemi arasında yer alır.',20,1),
  ('22221508-aaaa-4aaa-8aaa-bbbb1508tr03','bbbb1508-2222-4222-8222-bbbbbbbb1508','tr','Montaj tipi nasıldır?','Modüler kasetler halinde, boşluksuz şekilde monte edilerek tüm kesit kapatılır.',30,1);

-- REVIEWS (TR)
DELETE FROM product_reviews
WHERE id IN (
  '33331508-aaaa-4aaa-8aaa-bbbb1508tr01',
  '33331508-aaaa-4aaa-8aaa-bbbb1508tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331508-aaaa-4aaa-8aaa-bbbb1508tr01','bbbb1508-2222-4222-8222-bbbbbbbb1508',NULL,5,'Sürüklenme kayıpları ciddi azaldı; sistem daha temiz çalışıyor.',1,'Tesis Operasyon'),
  ('33331508-aaaa-4aaa-8aaa-bbbb1508tr02','bbbb1508-2222-4222-8222-bbbbbbbb1508',NULL,4,'Kaset montajı hızlı; basınç kaybı da düşük kaldı.',1,'Bakım Ekibi');

-- OPTIONS (shared)
DELETE FROM product_options
WHERE id='44441508-aaaa-4aaa-8aaa-bbbb1508op01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441508-aaaa-4aaa-8aaa-bbbb1508op01','bbbb1508-2222-4222-8222-bbbbbbbb1508','Profile', JSON_ARRAY('PVC CF-18DT','PVC C-145x45','PVC C-70x16','Custom (on request)'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1508-2222-4222-8222-bbbbbbbb1508',
  'en',
  'Drift Eliminators',
  'drift-eliminators',
  'Drift eliminators are located between the fan deck platform and the water distribution system inside the tower. Their purpose is to prevent water droplets formed in the distribution zone from being carried to the atmosphere by the induced airflow. They are installed as modular cassette blocks; cassettes are mounted without gaps to cover the full tower cross-section. The design targets high drift removal performance while keeping pressure drop low.',
  'Cooling tower drift eliminator spare part',
  JSON_ARRAY('spare part', 'drift eliminator', 'droplet control', 'water loss', 'low pressure drop', 'ensotek'),
  JSON_OBJECT(
    'location', 'Between fan deck platform and water distribution system',
    'purpose', 'Reduce drift and prevent water loss to atmosphere',
    'installation', 'Modular cassette system; gap-free mounting',
    'performance', 'High drift removal, low pressure drop'
  ),
  'Drift Eliminators | Cooling Tower Spare Parts | Ensotek',
  'Drift eliminator cassettes to reduce water droplet carryover. Modular installation, high drift removal efficiency and low pressure drop.'
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
WHERE product_id='bbbb1508-2222-4222-8222-bbbbbbbb1508' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111508-bbbb-4bbb-8bbb-bbbb1508en01','bbbb1508-2222-4222-8222-bbbbbbbb1508','en','Location','Between fan deck platform and water distribution system','custom',10),
  ('11111508-bbbb-4bbb-8bbb-bbbb1508en02','bbbb1508-2222-4222-8222-bbbbbbbb1508','en','Function','Reduces droplet carryover (drift) and prevents water loss','physical',20),
  ('11111508-bbbb-4bbb-8bbb-bbbb1508en03','bbbb1508-2222-4222-8222-bbbbbbbb1508','en','Installation','Modular cassette blocks; gap-free mounting','custom',30),
  ('11111508-bbbb-4bbb-8bbb-bbbb1508en04','bbbb1508-2222-4222-8222-bbbbbbbb1508','en','Design Target','High drift removal with low pressure drop','custom',40),
  ('11111508-bbbb-4bbb-8bbb-bbbb1508en05','bbbb1508-2222-4222-8222-bbbbbbbb1508','en','Use Case','Droplet control in the distribution zone','custom',50);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb1508-2222-4222-8222-bbbbbbbb1508' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221508-bbbb-4bbb-8bbb-bbbb1508en01','bbbb1508-2222-4222-8222-bbbbbbbb1508','en','What do drift eliminators do?','They reduce water droplet carryover to the atmosphere and help prevent water loss.',10,1),
  ('22221508-bbbb-4bbb-8bbb-bbbb1508en02','bbbb1508-2222-4222-8222-bbbbbbbb1508','en','Where are they installed?','Between the fan deck platform and the water distribution system inside the tower.',20,1),
  ('22221508-bbbb-4bbb-8bbb-bbbb1508en03','bbbb1508-2222-4222-8222-bbbbbbbb1508','en','How are they mounted?','As modular cassette blocks mounted without gaps to cover the full cross-section.',30,1);

-- REVIEWS (EN)
DELETE FROM product_reviews
WHERE id IN (
  '33331508-bbbb-4bbb-8bbb-bbbb1508en01',
  '33331508-bbbb-4bbb-8bbb-bbbb1508en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331508-bbbb-4bbb-8bbb-bbbb1508en01','bbbb1508-2222-4222-8222-bbbbbbbb1508',NULL,5,'Noticeable reduction in drift losses; cleaner operation overall.',1,'Plant Operations'),
  ('33331508-bbbb-4bbb-8bbb-bbbb1508en02','bbbb1508-2222-4222-8222-bbbbbbbb1508',NULL,4,'Cassette installation is fast and pressure drop remains low.',1,'Maintenance');

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1508-2222-4222-8222-bbbbbbbb1508',
  'de',
  'Drift Eliminator (Tropfenabscheider)',
  'drift-eliminator-tropfenabscheider',
  'Der Tropfenabscheider befindet sich zwischen der Plattform der Lüftergruppe und dem Wasserverteilungssystem im Inneren des Turms. Er verhindert, dass Wassertröpfchen aus dem Verteilbereich mit der angesaugten Luft in die Atmosphäre getragen werden. Die Montage erfolgt als modulare Kassetten; diese werden ohne Zwischenräume installiert und decken den gesamten Turmquerschnitt ab. Das Design zielt auf hohe Abscheideleistung bei geringem Druckverlust.',
  'Kühlturm Tropfenabscheider (Drift Eliminator) Ersatzteil',
  JSON_ARRAY('ersatzteil', 'tropfenabscheider', 'drift eliminator', 'wasserverlust', 'geringer druckverlust', 'ensotek'),
  JSON_OBJECT(
    'einbauort', 'Zwischen Lüfterplattform und Wasserverteilungssystem',
    'zweck', 'Reduziert Drift und verhindert Wasserverlust',
    'montage', 'Modulare Kassetten; spaltfreie Montage',
    'leistung', 'Hohe Abscheidung, geringer Druckverlust'
  ),
  'Tropfenabscheider | Kühlturm Ersatzteile | Ensotek',
  'Tropfenabscheider-Kassetten zur Reduktion von Drift und Wasserverlust. Modulare Montage, hohe Abscheideleistung und geringer Druckverlust.'
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
WHERE product_id='bbbb1508-2222-4222-8222-bbbbbbbb1508' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111508-cccc-4ccc-8ccc-bbbb1508de01','bbbb1508-2222-4222-8222-bbbbbbbb1508','de','Einbauort','Zwischen Lüfterplattform und Wasserverteilungssystem','custom',10),
  ('11111508-cccc-4ccc-8ccc-bbbb1508de02','bbbb1508-2222-4222-8222-bbbbbbbb1508','de','Funktion','Reduziert Tröpfchenmitnahme (Drift) und Wasserverlust','physical',20),
  ('11111508-cccc-4ccc-8ccc-bbbb1508de03','bbbb1508-2222-4222-8222-bbbbbbbb1508','de','Montage','Modulare Kassetten; spaltfreie Montage','custom',30),
  ('11111508-cccc-4ccc-8ccc-bbbb1508de04','bbbb1508-2222-4222-8222-bbbbbbbb1508','de','Designziel','Hohe Abscheidung bei geringem Druckverlust','custom',40),
  ('11111508-cccc-4ccc-8ccc-bbbb1508de05','bbbb1508-2222-4222-8222-bbbbbbbb1508','de','Einsatz','Tröpfchenkontrolle im Verteilbereich','custom',50);

-- FAQS (DE)
DELETE FROM product_faqs
WHERE product_id='bbbb1508-2222-4222-8222-bbbbbbbb1508' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221508-cccc-4ccc-8ccc-bbbb1508de01','bbbb1508-2222-4222-8222-bbbbbbbb1508','de','Wozu dient ein Tropfenabscheider?','Er reduziert die Tröpfchenmitnahme in die Atmosphäre und verhindert Wasserverlust.',10,1),
  ('22221508-cccc-4ccc-8ccc-bbbb1508de02','bbbb1508-2222-4222-8222-bbbbbbbb1508','de','Wo wird er montiert?','Zwischen Lüfterplattform und Wasserverteilungssystem im Inneren des Turms.',20,1),
  ('22221508-cccc-4ccc-8ccc-bbbb1508de03','bbbb1508-2222-4222-8222-bbbbbbbb1508','de','Wie erfolgt die Montage?','Als modulare Kassetten, die ohne Zwischenräume den gesamten Querschnitt abdecken.',30,1);

-- REVIEWS (DE)
DELETE FROM product_reviews
WHERE id IN (
  '33331508-cccc-4ccc-8ccc-bbbb1508de01',
  '33331508-cccc-4ccc-8ccc-bbbb1508de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331508-cccc-4ccc-8ccc-bbbb1508de01','bbbb1508-2222-4222-8222-bbbbbbbb1508',NULL,5,'Deutlich weniger Drift; die Umgebung bleibt spürbar trockener.',1,'Betrieb'),
  ('33331508-cccc-4ccc-8ccc-bbbb1508de02','bbbb1508-2222-4222-8222-bbbbbbbb1508',NULL,4,'Kassetten lassen sich sauber montieren; Druckverlust bleibt moderat.',1,'Instandhaltung');

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
