-- =============================================================
-- FILE: 015.3_sparepart_bbbb1503_fan__all_locales.sql (FINAL)
-- Ensotek – Sparepart Seed (03/14)
-- Sparepart: Fan / Axialventilator (Lüfter) / Fan
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
  'bbbb1503-2222-4222-8222-bbbbbbbb1503',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1004-1111-4111-8111-bbbbbbbb1004',
  0.00,
  'http://localhost:8086/uploads/material/fan-1220-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/fan-1220-250x250-1.jpg',
    'http://localhost:8086/uploads/material/fan-250x250-1.jpg',
    'http://localhost:8086/uploads/material/aluminyum-fan-2-250x250-1.jpg',
    'http://localhost:8086/uploads/material/4-kanatli-sac-kule-fani-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1503,
  'SP-FAN',
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
  'bbbb1503-2222-4222-8222-bbbbbbbb1503',
  'tr',
  'Soğutma Kulesi Aksiyal Fan (Lüfter)',
  'sogutma-kulesi-aksiyal-fan',
  'Aksiyal fan, kulenin üst kısmındaki fan şaftında yer alır ve havayı kule boyunca hareket ettirerek buharlaşma prensibi ile soğutmayı sağlar. Dış ortamdan panjurlar üzerinden alınan hava, dolgulardan geçer ve fan bacasından atmosfere atılır. Fan kanatları cam elyaf takviyeli PP, CTP (FRP), alüminyum pultruzyon profil veya PP malzemeden üretilebilir. Kanat bağlantı tablaları alüminyum pultruzyon profil veya kataforez kaplı karbon çelik olabilir. Farklı tip soğutma kulesi fanları temin edilebilir.',
  'Soğutma kulesi aksiyal fan (lüfter) yedek parça',
  JSON_ARRAY('yedek parça', 'fan', 'aksiyal fan', 'lüfter', 'fan grubu', 'soğutma kulesi', 'ensotek'),
  JSON_OBJECT(
    'konum', 'Kule üstü fan şaftı / fan bacası bölgesi',
    'gorev', 'Havayı dolgulardan geçirerek buharlaşma ile soğutmayı sağlar',
    'kanatMalzemeleri', JSON_ARRAY('Cam elyaf takviyeli PP', 'CTP (FRP)', 'Alüminyum pultruzyon profil', 'PP'),
    'baglantiTablasi', 'Alüminyum pultruzyon profil veya kataforez kaplı karbon çelik',
    'uyumluluk', 'Farklı kule tipleri ve çaplar için seçeneklenebilir'
  ),
  'Aksiyal Fan | Soğutma Kulesi Yedek Parça | Ensotek',
  'Soğutma kulesi aksiyal fan: hava akışını sağlar, dolgulardan geçirip fan bacasından atmosfere atar. PP/CTP/Alüminyum seçenekleri, farklı kule tipleriyle uyum.'
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
WHERE product_id='bbbb1503-2222-4222-8222-bbbbbbbb1503' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111503-aaaa-4aaa-8aaa-bbbb1503tr01','bbbb1503-2222-4222-8222-bbbbbbbb1503','tr','Konum','Kule üstü fan şaftı / fan bacası bölgesi','custom',10),
  ('11111503-aaaa-4aaa-8aaa-bbbb1503tr02','bbbb1503-2222-4222-8222-bbbbbbbb1503','tr','Görev','Havayı kule boyunca hareket ettirir; buharlaşma ile soğutmayı destekler','physical',20),
  ('11111503-aaaa-4aaa-8aaa-bbbb1503tr03','bbbb1503-2222-4222-8222-bbbbbbbb1503','tr','Kanat Malzemeleri','Cam elyaf takviyeli PP / CTP (FRP) / Alüminyum pultruzyon profil / PP','material',30),
  ('11111503-aaaa-4aaa-8aaa-bbbb1503tr04','bbbb1503-2222-4222-8222-bbbbbbbb1503','tr','Bağlantı Tablası','Alüminyum pultruzyon profil veya kataforez kaplı karbon çelik','material',40),
  ('11111503-aaaa-4aaa-8aaa-bbbb1503tr05','bbbb1503-2222-4222-8222-bbbbbbbb1503','tr','Uygulama','Farklı soğutma kulesi tipleri ve fan çapları için opsiyonlanabilir','custom',50);

-- FAQS (TR)
DELETE FROM product_faqs
WHERE product_id='bbbb1503-2222-4222-8222-bbbbbbbb1503' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221503-aaaa-4aaa-8aaa-bbbb1503tr01','bbbb1503-2222-4222-8222-bbbbbbbb1503','tr','Aksiyal fanın görevi nedir?','Havayı kule boyunca hareket ettirerek dolgulardan geçirir ve fan bacasından atmosfere atılmasını sağlar.',10,1),
  ('22221503-aaaa-4aaa-8aaa-bbbb1503tr02','bbbb1503-2222-4222-8222-bbbbbbbb1503','tr','Hangi kanat malzemeleri kullanılabilir?','Cam elyaf takviyeli PP, CTP (FRP), alüminyum pultruzyon profil veya PP seçenekleri bulunur.',20,1),
  ('22221503-aaaa-4aaa-8aaa-bbbb1503tr03','bbbb1503-2222-4222-8222-bbbbbbbb1503','tr','Fan seçimi neye göre yapılır?','Kule tipi, fan çapı, debi/çekiş ihtiyacı ve montaj yapısına göre uygun seçenek belirlenir.',30,1);

-- REVIEWS (TR)
DELETE FROM product_reviews
WHERE id IN (
  '33331503-aaaa-4aaa-8aaa-bbbb1503tr01',
  '33331503-aaaa-4aaa-8aaa-bbbb1503tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331503-aaaa-4aaa-8aaa-bbbb1503tr01','bbbb1503-2222-4222-8222-bbbbbbbb1503',NULL,5,'Debi stabil, titreşim düşük. Malzeme seçenekleri sahaya göre iyi uyarlanabiliyor.',1,'Bakım Ekibi'),
  ('33331503-aaaa-4aaa-8aaa-bbbb1503tr02','bbbb1503-2222-4222-8222-bbbbbbbb1503',NULL,4,'Alüminyum seçenek hafif ve montajı pratik. Performans tatmin edici.',1,'Operasyon');

-- OPTIONS (shared)
DELETE FROM product_options
WHERE id='44441503-aaaa-4aaa-8aaa-bbbb1503op01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441503-aaaa-4aaa-8aaa-bbbb1503op01','bbbb1503-2222-4222-8222-bbbbbbbb1503','Blade Material', JSON_ARRAY('Glass fiber reinforced PP','FRP (CTP)','Aluminum pultrusion','PP'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1503-2222-4222-8222-bbbbbbbb1503',
  'en',
  'Cooling Tower Axial Fan',
  'cooling-tower-axial-fan',
  'The axial fan is installed in the fan shaft at the top of the tower. It drives airflow through the tower to enable evaporative cooling. Air is drawn through louvers, passes through the fill media and is discharged to the atmosphere through the fan stack. Fan blades can be manufactured from glass-fiber reinforced PP, FRP (CTP), aluminum pultrusion profiles or PP. Blade connection plates may be aluminum pultrusion profiles or cataphoresis-coated carbon steel. Various cooling tower fan types are available.',
  'Cooling tower axial fan spare part',
  JSON_ARRAY('spare part', 'fan', 'axial fan', 'fan group', 'cooling tower', 'ensotek'),
  JSON_OBJECT(
    'location', 'Top fan shaft / fan stack area',
    'function', 'Moves air through the tower to support evaporative cooling',
    'bladeMaterials', JSON_ARRAY('Glass fiber reinforced PP', 'FRP (CTP)', 'Aluminum pultrusion', 'PP'),
    'connectionPlate', 'Aluminum pultrusion profile or cataphoresis-coated carbon steel',
    'compatibility', 'Configurable for different tower types and fan diameters'
  ),
  'Axial Fan | Cooling Tower Spare Parts | Ensotek',
  'Cooling tower axial fan: drives airflow through louvers and fill media and discharges via fan stack. Multiple blade material options and configurable selections.'
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
WHERE product_id='bbbb1503-2222-4222-8222-bbbbbbbb1503' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111503-bbbb-4bbb-8bbb-bbbb1503en01','bbbb1503-2222-4222-8222-bbbbbbbb1503','en','Location','Top fan shaft / fan stack area','custom',10),
  ('11111503-bbbb-4bbb-8bbb-bbbb1503en02','bbbb1503-2222-4222-8222-bbbbbbbb1503','en','Function','Drives airflow through the tower for evaporative cooling','physical',20),
  ('11111503-bbbb-4bbb-8bbb-bbbb1503en03','bbbb1503-2222-4222-8222-bbbbbbbb1503','en','Blade Materials','Glass fiber reinforced PP / FRP (CTP) / Aluminum pultrusion / PP','material',30),
  ('11111503-bbbb-4bbb-8bbb-bbbb1503en04','bbbb1503-2222-4222-8222-bbbbbbbb1503','en','Connection Plate','Aluminum pultrusion or cataphoresis-coated carbon steel','material',40),
  ('11111503-bbbb-4bbb-8bbb-bbbb1503en05','bbbb1503-2222-4222-8222-bbbbbbbb1503','en','Selection','Depends on tower type, fan diameter and airflow requirement','custom',50);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb1503-2222-4222-8222-bbbbbbbb1503' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221503-bbbb-4bbb-8bbb-bbbb1503en01','bbbb1503-2222-4222-8222-bbbbbbbb1503','en','What is the role of an axial fan?','It drives air through louvers and fill media and discharges it via the fan stack to support evaporative cooling.',10,1),
  ('22221503-bbbb-4bbb-8bbb-bbbb1503en02','bbbb1503-2222-4222-8222-bbbbbbbb1503','en','Which blade materials are available?','Glass-fiber reinforced PP, FRP (CTP), aluminum pultrusion and PP options are available.',20,1),
  ('22221503-bbbb-4bbb-8bbb-bbbb1503en03','bbbb1503-2222-4222-8222-bbbbbbbb1503','en','How do I select the right fan?','Selection depends on tower type, fan diameter, required airflow and mounting configuration.',30,1);

-- REVIEWS (EN)
DELETE FROM product_reviews
WHERE id IN (
  '33331503-bbbb-4bbb-8bbb-bbbb1503en01',
  '33331503-bbbb-4bbb-8bbb-bbbb1503en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331503-bbbb-4bbb-8bbb-bbbb1503en01','bbbb1503-2222-4222-8222-bbbbbbbb1503',NULL,5,'Stable airflow and low vibration. Material options make it easy to match site conditions.',1,'Maintenance Team'),
  ('33331503-bbbb-4bbb-8bbb-bbbb1503en02','bbbb1503-2222-4222-8222-bbbbbbbb1503',NULL,4,'Aluminum option is lightweight and easy to install. Good overall performance.',1,'Operations');

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1503-2222-4222-8222-bbbbbbbb1503',
  'de',
  'Axialventilator (Lüfter) für Kühltürme',
  'axialventilator-fuer-kuehltuerme',
  'Der Axialventilator befindet sich im Lüfterschacht oben auf dem Turm. Er sorgt dafür, dass die Luft durch den Turm strömt und damit die Verdunstung als Hauptprinzip des Kühlturms wirksam wird. Die Luft wird über Jalousien angesaugt, strömt durch die Füllkörper und wird über den Lüfterkamin in die Atmosphäre ausgestoßen. Lüfterflügel werden aus glasfaserverstärktem PP, FRP (CTP), Aluminium-Pultrusionsprofil oder PP gefertigt. Die Blattverbindungselemente bestehen aus Aluminium-Pultrusionsprofilen oder kataphoretisch beschichtetem Kohlenstoffstahl. Verschiedene Lüftertypen sind verfügbar.',
  'Axialventilator (Lüfter) für Kühltürme Ersatzteil',
  JSON_ARRAY('ersatzteil', 'axialventilator', 'luefter', 'lueftergruppe', 'kuehlturm', 'ensotek'),
  JSON_OBJECT(
    'einbauort', 'Lüfterschacht oben am Turm / Bereich Lüfterkamin',
    'funktion', 'Führt Luft durch den Turm und unterstützt die Verdunstungskühlung',
    'fluegelMaterial', JSON_ARRAY('Glasfaserverstärktes PP', 'FRP (CTP)', 'Aluminium-Pultrusionsprofil', 'PP'),
    'verbindung', 'Aluminium-Pultrusionsprofil oder kataphoretisch beschichteter Kohlenstoffstahl',
    'auswahl', 'Abhängig von Turmtyp, Durchmesser und Luftbedarf'
  ),
  'Axialventilator | Kühlturm Ersatzteile | Ensotek',
  'Axialventilator für Kühltürme: sorgt für Luftstrom durch Füllkörper und Ausstoß über den Lüfterkamin. Mehrere Materialoptionen und konfigurierbare Ausführungen.'
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
WHERE product_id='bbbb1503-2222-4222-8222-bbbbbbbb1503' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111503-cccc-4ccc-8ccc-bbbb1503de01','bbbb1503-2222-4222-8222-bbbbbbbb1503','de','Einbauort','Lüfterschacht oben am Turm / Bereich Lüfterkamin','custom',10),
  ('11111503-cccc-4ccc-8ccc-bbbb1503de02','bbbb1503-2222-4222-8222-bbbbbbbb1503','de','Funktion','Führt Luft durch den Turm und unterstützt die Verdunstungskühlung','physical',20),
  ('11111503-cccc-4ccc-8ccc-bbbb1503de03','bbbb1503-2222-4222-8222-bbbbbbbb1503','de','Flügelmaterial','Glasfaserverstärktes PP / FRP (CTP) / Aluminium-Pultrusionsprofil / PP','material',30),
  ('11111503-cccc-4ccc-8ccc-bbbb1503de04','bbbb1503-2222-4222-8222-bbbbbbbb1503','de','Verbindungselemente','Aluminium-Pultrusionsprofil oder kataphoretisch beschichteter Kohlenstoffstahl','material',40),
  ('11111503-cccc-4ccc-8ccc-bbbb1503de05','bbbb1503-2222-4222-8222-bbbbbbbb1503','de','Auswahl','Abhängig von Turmtyp, Durchmesser und Luftbedarf','custom',50);

-- FAQS (DE)
DELETE FROM product_faqs
WHERE product_id='bbbb1503-2222-4222-8222-bbbbbbbb1503' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221503-cccc-4ccc-8ccc-bbbb1503de01','bbbb1503-2222-4222-8222-bbbbbbbb1503','de','Welche Aufgabe hat der Axialventilator?','Er bewegt die Luft durch den Turm, durchströmt die Füllkörper und stößt sie über den Lüfterkamin aus.',10,1),
  ('22221503-cccc-4ccc-8ccc-bbbb1503de02','bbbb1503-2222-4222-8222-bbbbbbbb1503','de','Welche Materialien gibt es für die Flügel?','Glasfaserverstärktes PP, FRP (CTP), Aluminium-Pultrusionsprofil oder PP.',20,1),
  ('22221503-cccc-4ccc-8ccc-bbbb1503de03','bbbb1503-2222-4222-8222-bbbbbbbb1503','de','Wovon hängt die Auswahl ab?','Von Turmtyp, Ventilatordurchmesser, benötigtem Luftstrom und Montageausführung.',30,1);

-- REVIEWS (DE)
DELETE FROM product_reviews
WHERE id IN (
  '33331503-cccc-4ccc-8ccc-bbbb1503de01',
  '33331503-cccc-4ccc-8ccc-bbbb1503de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331503-cccc-4ccc-8ccc-bbbb1503de01','bbbb1503-2222-4222-8222-bbbbbbbb1503',NULL,5,'Stabiler Luftstrom und geringe Vibration – sehr zuverlässig im Betrieb.',1,'Instandhaltung'),
  ('33331503-cccc-4ccc-8ccc-bbbb1503de02','bbbb1503-2222-4222-8222-bbbbbbbb1503',NULL,4,'Die Aluminium-Variante ist leicht und schnell zu montieren.',1,'Betrieb');

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
