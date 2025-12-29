-- =============================================================
-- FILE: 015.7_sparepart_bbbb1507_frp_pultrusion_profiles__all_locales.sql (FINAL)
-- Ensotek – Sparepart Seed (07/14)
-- Sparepart: CTP Profiller / FRP Pultrusion Profiles / FRP Pultrusionsprofil
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
  'bbbb1507-2222-4222-8222-bbbbbbbb1507',
  'sparepart',
  'aaaa1001-1111-4111-8111-aaaaaaaa1001',
  'bbbb1001-1111-4111-8111-bbbbbbbb1001',
  0.00,
  'http://localhost:8086/uploads/material/ctp-pultruzyon-1-250x250-1.jpg',
  NULL,
  JSON_ARRAY(
    'http://localhost:8086/uploads/material/ctp-pultruzyon-1-250x250-1.jpg',
    'http://localhost:8086/uploads/material/ctp-pultruzyon-profil-2-250x250-1.jpg',
    'http://localhost:8086/uploads/material/sogutma-kulesi-profili-4-250x250-1.jpg'
  ),
  JSON_ARRAY(),
  1,
  1,
  1507,
  'SP-FRP-PULTRUSION-PROFILES',
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
  'bbbb1507-2222-4222-8222-bbbbbbbb1507',
  'tr',
  'CTP Profiller (Pultruzyon)',
  'ctp-profiller-pultruzyon',
  'Soğutma kulesi imalatında ihtiyaç duyulan farklı kesitlerde profiller, cam elyaf takviyeli polyester (CTP/GFRP) malzemeden pultruzyon yöntemiyle üretilir. Pultruzyonda profil; elyaf ve reçine kombinasyonunun kalıptan geçirilmesiyle şekillenir. Yüksek elyaf oranı sayesinde mukavemet ve mekanik değerleri yüksektir. Kullanım ömrü boyunca boyama veya periyodik bakım gerektirmez ve kimyasallardan minimum etkilenir.',
  'Soğutma kulesi CTP pultruzyon profil yedek parça',
  JSON_ARRAY('yedek parça', 'ctp', 'gfrp', 'pultruzyon', 'profil', 'konstrüksiyon', 'ensotek'),
  JSON_OBJECT(
    'malzeme', 'CTP / GFRP (Cam elyaf takviyeli polyester)',
    'uretim', 'Pultruzyon yöntemi (elyaf + reçine)',
    'avantajlar', JSON_ARRAY('Yüksek mukavemet', 'Bakım/boya gerektirmez', 'Kimyasal dayanım', 'Uzun ömür'),
    'kullanim', 'Soğutma kulesi konstrüksiyon profilleri (çeşitli kesitler)'
  ),
  'CTP Profiller (Pultruzyon) | Soğutma Kulesi Yedek Parça | Ensotek',
  'CTP/GFRP pultruzyon profiller: yüksek mukavemet, kimyasal dayanım, bakım/boya gerektirmeyen uzun ömürlü soğutma kulesi konstrüksiyon profilleri.'
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
WHERE product_id='bbbb1507-2222-4222-8222-bbbbbbbb1507' AND locale='tr';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111507-aaaa-4aaa-8aaa-bbbb1507tr01','bbbb1507-2222-4222-8222-bbbbbbbb1507','tr','Malzeme','CTP/GFRP (Cam elyaf takviyeli polyester)','material',10),
  ('11111507-aaaa-4aaa-8aaa-bbbb1507tr02','bbbb1507-2222-4222-8222-bbbbbbbb1507','tr','Üretim Yöntemi','Pultruzyon (elyaf + reçine kombinasyonu)','custom',20),
  ('11111507-aaaa-4aaa-8aaa-bbbb1507tr03','bbbb1507-2222-4222-8222-bbbbbbbb1507','tr','Mekanik Dayanım','Yüksek elyaf oranı ile yüksek mukavemet','physical',30),
  ('11111507-aaaa-4aaa-8aaa-bbbb1507tr04','bbbb1507-2222-4222-8222-bbbbbbbb1507','tr','Bakım','Boyama/bakım gerektirmez','custom',40),
  ('11111507-aaaa-4aaa-8aaa-bbbb1507tr05','bbbb1507-2222-4222-8222-bbbbbbbb1507','tr','Dayanım','Kimyasallardan minimum etkilenir','material',50);

-- FAQS (TR)
DELETE FROM product_faqs
WHERE product_id='bbbb1507-2222-4222-8222-bbbbbbbb1507' AND locale='tr';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221507-aaaa-4aaa-8aaa-bbbb1507tr01','bbbb1507-2222-4222-8222-bbbbbbbb1507','tr','Pultruzyon profil nedir?','Elyaf ve reçinenin kalıptan sürekli geçirilmesiyle üretilen, yüksek mukavemetli kompozit profildir.',10,1),
  ('22221507-aaaa-4aaa-8aaa-bbbb1507tr02','bbbb1507-2222-4222-8222-bbbbbbbb1507','tr','CTP profillerin avantajı nedir?','Yüksek dayanım, korozyon/kimyasal dayanım ve bakım/boya gerektirmeyen uzun ömür sağlar.',20,1),
  ('22221507-aaaa-4aaa-8aaa-bbbb1507tr03','bbbb1507-2222-4222-8222-bbbbbbbb1507','tr','Hangi alanlarda kullanılır?','Soğutma kulesi konstrüksiyonunda farklı kesitli taşıyıcı/bağlantı profilleri olarak kullanılır.',30,1);

-- REVIEWS (TR)
DELETE FROM product_reviews
WHERE id IN (
  '33331507-aaaa-4aaa-8aaa-bbbb1507tr01',
  '33331507-aaaa-4aaa-8aaa-bbbb1507tr02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331507-aaaa-4aaa-8aaa-bbbb1507tr01','bbbb1507-2222-4222-8222-bbbbbbbb1507',NULL,5,'Korozyon derdi yok; sahada uzun yıllar bakım istemeden duruyor.',1,'Bakım Ekibi'),
  ('33331507-aaaa-4aaa-8aaa-bbbb1507tr02','bbbb1507-2222-4222-8222-bbbbbbbb1507',NULL,4,'Montajda hafifliği ve rijitliği işimizi kolaylaştırdı.',1,'Saha Uygulama');

-- OPTIONS (shared)
DELETE FROM product_options
WHERE id='44441507-aaaa-4aaa-8aaa-bbbb1507op01';

INSERT INTO product_options (id, product_id, option_name, option_values)
VALUES
  ('44441507-aaaa-4aaa-8aaa-bbbb1507op01','bbbb1507-2222-4222-8222-bbbbbbbb1507','Profile Section', JSON_ARRAY('I / U / L / Box','Custom Cut Length','Custom Section (on request)'));

-- =============================================================
-- I18N (EN) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1507-2222-4222-8222-bbbbbbbb1507',
  'en',
  'FRP Pultrusion Profiles',
  'frp-pultrusion-profiles',
  'Profiles with various cross-sections required for tower construction are manufactured from glass fiber reinforced polyester (FRP/GFRP) using the pultrusion process. In pultrusion, the profile is formed by pulling a fiber-and-resin combination through a die. Thanks to the high fiber content, mechanical strength is high. The profiles do not require painting or periodic maintenance over their service life and are minimally affected by chemicals.',
  'Cooling tower FRP pultrusion profile spare part',
  JSON_ARRAY('spare part', 'frp', 'gfrp', 'pultrusion', 'profile', 'structure', 'ensotek'),
  JSON_OBJECT(
    'material', 'FRP / GFRP (glass fiber reinforced polyester)',
    'process', 'Pultrusion (fiber + resin)',
    'benefits', JSON_ARRAY('High strength', 'No painting/maintenance', 'Chemical resistance', 'Long service life'),
    'application', 'Cooling tower structural profiles (various sections)'
  ),
  'FRP Pultrusion Profiles | Cooling Tower Spare Parts | Ensotek',
  'FRP/GFRP pultrusion profiles: high strength, chemical resistance, long-life structural profiles for cooling towers with no painting or periodic maintenance needs.'
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
WHERE product_id='bbbb1507-2222-4222-8222-bbbbbbbb1507' AND locale='en';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111507-bbbb-4bbb-8bbb-bbbb1507en01','bbbb1507-2222-4222-8222-bbbbbbbb1507','en','Material','FRP/GFRP (glass fiber reinforced polyester)','material',10),
  ('11111507-bbbb-4bbb-8bbb-bbbb1507en02','bbbb1507-2222-4222-8222-bbbbbbbb1507','en','Manufacturing','Pultrusion (fiber + resin combination)','custom',20),
  ('11111507-bbbb-4bbb-8bbb-bbbb1507en03','bbbb1507-2222-4222-8222-bbbbbbbb1507','en','Mechanical Strength','High strength due to high fiber content','physical',30),
  ('11111507-bbbb-4bbb-8bbb-bbbb1507en04','bbbb1507-2222-4222-8222-bbbbbbbb1507','en','Maintenance','No painting / periodic maintenance required','custom',40),
  ('11111507-bbbb-4bbb-8bbb-bbbb1507en05','bbbb1507-2222-4222-8222-bbbbbbbb1507','en','Resistance','Minimally affected by chemicals','material',50);

-- FAQS (EN)
DELETE FROM product_faqs
WHERE product_id='bbbb1507-2222-4222-8222-bbbbbbbb1507' AND locale='en';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221507-bbbb-4bbb-8bbb-bbbb1507en01','bbbb1507-2222-4222-8222-bbbbbbbb1507','en','What is a pultrusion profile?','A composite profile produced by pulling fiber and resin through a die, resulting in high strength and consistency.',10,1),
  ('22221507-bbbb-4bbb-8bbb-bbbb1507en02','bbbb1507-2222-4222-8222-bbbbbbbb1507','en','What are the key advantages of FRP profiles?','High strength, corrosion/chemical resistance, and long service life without painting or periodic maintenance.',20,1),
  ('22221507-bbbb-4bbb-8bbb-bbbb1507en03','bbbb1507-2222-4222-8222-bbbbbbbb1507','en','Where are they used in cooling towers?','As structural and connection profiles with various cross-sections in tower construction.',30,1);

-- REVIEWS (EN)
DELETE FROM product_reviews
WHERE id IN (
  '33331507-bbbb-4bbb-8bbb-bbbb1507en01',
  '33331507-bbbb-4bbb-8bbb-bbbb1507en02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331507-bbbb-4bbb-8bbb-bbbb1507en01','bbbb1507-2222-4222-8222-bbbbbbbb1507',NULL,5,'Excellent corrosion resistance—no repainting needed over time.',1,'Maintenance Team'),
  ('33331507-bbbb-4bbb-8bbb-bbbb1507en02','bbbb1507-2222-4222-8222-bbbbbbbb1507',NULL,4,'Lightweight yet rigid—installation is faster compared to metal parts.',1,'Site Crew');

-- =============================================================
-- I18N (DE) — PLAIN TEXT
-- =============================================================
INSERT INTO product_i18n (
  product_id, locale, title, slug, description, alt, tags, specifications,
  meta_title, meta_description
)
VALUES (
  'bbbb1507-2222-4222-8222-bbbbbbbb1507',
  'de',
  'FRP Pultrusionsprofil',
  'frp-pultrusionsprofil',
  'Profile mit verschiedenen Querschnitten für den Turmbau werden aus glasfaserverstärktem Polyester (FRP/GFK) im Pultrusionsverfahren hergestellt. Dabei wird eine Kombination aus Fasern und Harz durch eine Matrize gezogen und geformt. Durch den hohen Faseranteil entstehen sehr hohe Festigkeit und gute mechanische Werte. Die Profile müssen während ihrer Nutzungsdauer weder gestrichen noch regelmäßig gewartet werden und werden durch Chemikalien nur minimal beeinträchtigt.',
  'Kühlturm FRP Pultrusionsprofil Ersatzteil',
  JSON_ARRAY('ersatzteil', 'frp', 'gfk', 'pultrusion', 'profil', 'konstruktion', 'ensotek'),
  JSON_OBJECT(
    'material', 'FRP/GFK (glasfaserverstärkter Polyester)',
    'verfahren', 'Pultrusion (Faser + Harz)',
    'vorteile', JSON_ARRAY('Hohe Festigkeit', 'Keine Lackierung/Wartung', 'Chemikalienbeständig', 'Lange Lebensdauer'),
    'einsatz', 'Kühlturm-Konstruktionsprofile (verschiedene Querschnitte)'
  ),
  'FRP Pultrusionsprofile | Kühlturm Ersatzteile | Ensotek',
  'FRP/GFK Pultrusionsprofile: hohe Festigkeit, chemische Beständigkeit und langlebige Konstruktionsprofile für Kühltürme – ohne Lackierung oder regelmäßige Wartung.'
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
WHERE product_id='bbbb1507-2222-4222-8222-bbbbbbbb1507' AND locale='de';

INSERT INTO product_specs (id, product_id, locale, name, value, category, order_num)
VALUES
  ('11111507-cccc-4ccc-8ccc-bbbb1507de01','bbbb1507-2222-4222-8222-bbbbbbbb1507','de','Material','FRP/GFK (glasfaserverstärkter Polyester)','material',10),
  ('11111507-cccc-4ccc-8ccc-bbbb1507de02','bbbb1507-2222-4222-8222-bbbbbbbb1507','de','Herstellung','Pultrusion (Faser + Harz Kombination)','custom',20),
  ('11111507-cccc-4ccc-8ccc-bbbb1507de03','bbbb1507-2222-4222-8222-bbbbbbbb1507','de','Festigkeit','Hohe Festigkeit durch hohen Faseranteil','physical',30),
  ('11111507-cccc-4ccc-8ccc-bbbb1507de04','bbbb1507-2222-4222-8222-bbbbbbbb1507','de','Wartung','Keine Lackierung / regelmäßige Wartung erforderlich','custom',40),
  ('11111507-cccc-4ccc-8ccc-bbbb1507de05','bbbb1507-2222-4222-8222-bbbbbbbb1507','de','Beständigkeit','Geringe Beeinträchtigung durch Chemikalien','material',50);

-- FAQS (DE)
DELETE FROM product_faqs
WHERE product_id='bbbb1507-2222-4222-8222-bbbbbbbb1507' AND locale='de';

INSERT INTO product_faqs (id, product_id, locale, question, answer, display_order, is_active)
VALUES
  ('22221507-cccc-4ccc-8ccc-bbbb1507de01','bbbb1507-2222-4222-8222-bbbbbbbb1507','de','Was ist ein Pultrusionsprofil?','Ein Verbundprofil, das durch kontinuierliches Ziehen von Faser und Harz durch eine Matrize hergestellt wird.',10,1),
  ('22221507-cccc-4ccc-8ccc-bbbb1507de02','bbbb1507-2222-4222-8222-bbbbbbbb1507','de','Welche Vorteile haben FRP/GFK-Profile?','Hohe Festigkeit, Korrosions-/Chemikalienbeständigkeit und lange Lebensdauer ohne Lackierung oder regelmäßige Wartung.',20,1),
  ('22221507-cccc-4ccc-8ccc-bbbb1507de03','bbbb1507-2222-4222-8222-bbbbbbbb1507','de','Wo werden sie im Kühlturm eingesetzt?','Als Konstruktions- und Verbindungsprofile mit unterschiedlichen Querschnitten im Turmbau.',30,1);

-- REVIEWS (DE)
DELETE FROM product_reviews
WHERE id IN (
  '33331507-cccc-4ccc-8ccc-bbbb1507de01',
  '33331507-cccc-4ccc-8ccc-bbbb1507de02'
);

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_active, customer_name)
VALUES
  ('33331507-cccc-4ccc-8ccc-bbbb1507de01','bbbb1507-2222-4222-8222-bbbbbbbb1507',NULL,5,'Sehr korrosionsbeständig – keine Nacharbeit mit Lack nötig.',1,'Instandhaltung'),
  ('33331507-cccc-4ccc-8ccc-bbbb1507de02','bbbb1507-2222-4222-8222-bbbbbbbb1507',NULL,4,'Leicht und dennoch steif – Montage geht deutlich schneller.',1,'Montage');

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
